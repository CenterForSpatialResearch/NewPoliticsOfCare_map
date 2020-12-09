
//"F_THEME1","F_THEME2", "F_THEME3", "F_THEME4"
var map;
var detailMap;
var themesDefinitions ={
    "SPL_THEME1":"Sum of series for Socioeconomic",
    "RPL_THEME1":"Percentile ranking for Socioeconomic",
    "SPL_THEME2":"Sum of series for Household Composition",
    "RPL_THEME2":"Percentile ranking for Household Composition",
    "SPL_THEME3":"Sum of series for Minority Status/Language",
    "RPL_THEME3":"Percentile ranking for series for Minority Status/Language",
    "SPL_THEME4":"Sum of series for Housing Type/Transportation",
    "RPL_THEME4":"Percentile ranking for Housing Type/Transportation",
    "SPL_THEMES":"Sum of series themes", 
    "RPL_THEMES":"Overall percentile ranking for themes"
}
var pub = {
    strategy:"percentage_scenario_SVI_hotspot",
    coverage:"base_case_capacity_30",
    aiannh:false,
    prison:false,
    satellite:false,
    tract_svi:false,
    all:null,
    centroids:null,
    histo:null,
    states:null,
    univar:false,
    SVIFIPS:null,
    sviZoom:10,
    SVIcenter:null,
    column:"Covid",
    dataByFIPS:null,
    fipsToName:null,
    chapters:[],
    stateCentroids:null,
    fipsToPopulation:null
}
var mostLeastDescription = {}
var currentState = ""
var highlightColor = "gold"
var bghighlightColor = "gold"
var outlineColor = "#DF6D2A"
var currentClickedGroup = null

var colors = ["#10B6A3","#A2D352","#FFF100"]
//var colors = ["#fff","#aaa","black"]
//var colors = ["#E0ECF4","#9EBCDA","#8856A7"]
var pStops = [[0,.1],[.1,.2],[.2,.3],[.3,.4],[.4,.5],[.5,.6],[.6,.7],[.7,.8],[.8,.9],[.9,1]]
var pStops = [[0,10],[10,20],[20,30],[30,40],[40,50],[50,60],[60,70],[70,80],[80,90],[90,100]]
function loader(){
    function myFunction() {
      var myVar = setTimeout(showPage, 1000);
    }

    function showPage() {
      $("#loader_sec").css("display","none");
      $("#bodyloader").css("display","block");
    }
    
    if(!localStorage.getItem("visted")){
       // console.log("first")
       myFunction();
       localStorage.setItem("visted",true);
    }else{
       // console.log("not first")
        
    }

}
function histo(){
var histo = d3.histogram()
    .value(function(d){
        if(d.properties[pub.strategy+"_"+pub.coverage+"_group"]==undefined){
            return 999
        }else{
            return d.properties[pub.strategy+"_"+pub.coverage+"_group"]//.replace("_","")
        }
    })
    .domain([1,10])
    .thresholds(9)
        
var bins = histo(pub.all.features)
    return bins
}

function toTitleCase(str){
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

var colorColumn = "_priority"
var countyCentroids = d3.json("county_centroids.geojson")
var counties = d3.json("counties.geojson")
var stateCentroids = d3.json("us-state-centroids.json")
var usOutline = d3.json("simple_contiguous.geojson")
var allData =d3.csv("County_level_proportional_allocation_for_all_policies.csv")
var timeStamp = d3.csv("https://raw.githubusercontent.com/CenterForSpatialResearch/newpoliticsofcare_analysis/master/Output/time_stamp.csv")
var allData = d3.csv("https://raw.githubusercontent.com/CenterForSpatialResearch/newpoliticsofcare_analysis/master/Output/County_level_proportional_allocation_for_all_policies.csv")
//var allData = d3.csv("County_level_proportional_allocation_for_all_policies 2.csv")
var states = d3.json("simplestates.geojson")

var userRankings = {}



Promise.all([counties,usOutline,countyCentroids,allData,timeStamp,states,stateCentroids])
.then(function(data){
    ready(data[0],data[1],data[2],data[3],data[4],data[5],data[6])
})
var hoveredStateId = null;

var lineOpacity = {stops:[[0,1],[100,0.3]]}
var lineWeight = {stops:[[-1,0],[-0.01,0],[0,2],[99,.5],[100,0]]}
var centroids = null
var latestDate = null
var countiesCount = null
function ready(counties,outline,centroids,modelData,timeStamp,states,sCentroids){ 
    
    getCountyCountByState(counties)
    
    d3.select("#closeMap").on("click",function(){
        d3.select("#SVIMap").style("display","none")
    })
    pub.states = states
     d3.select("#date").html("Model run as of "+timeStamp["columns"][1])
    var dataByFIPS = turnToDictFIPS(modelData,"County_FIPS")
    pub.dataByFIPS=dataByFIPS
    countiesCount = getCountyCountByState(counties)
    
    pub.centroids = formatCentroids(centroids.features)
    var combinedGeojson = combineGeojson(dataByFIPS,counties)
    pub.all = combinedGeojson
    
   // pub.fipsToName =  fipsCountyName(counties,"county")
  // pub.fipsToPopulation = fipsCountyName(counties,"totalPopulation")
    
 
    
    $.getJSON('https://geoip-db.com/json/')
    .done (function(location) {
        userCoordinates = [location.longitude, location.latitude]
   });
    
    drawMap(combinedGeojson,outline)
        
}
function setMapToUser(userCoordinates){
    config.chapters[1].location = {center:userCoordinates,zoom:18}
}

function getUserCounty(userCoordinates){
    var userPoint = map.project(userCoordinates)
    var features = map.queryRenderedFeatures(userPoint,{layers:["base"]});
    
    
    
        //
     var properties = features[0].properties
     var county = properties.county
   
    return properties
}
function populateUserChapter(){
     var state = properties.state
    var pop = properties.totalPopulation
     var newText ="You are currently in "+ county+" County, "
     +toTitleCase(state)+", population "+numberWithCommas(pop)+"."
     +"<br><br>What does this actually mean in terms of vulnerability during covid?"
 
     d3.select("#user p").html(newText)
}


function getCountyCountByState(counties){
    var stateTally = []
    
    for(var c in counties.features){
        var county = counties.features[c]
        var state = county.properties.state
        stateTally.push(state)
    }
    var counts = {};
    for (var i = 0; i < stateTally.length; i++) {
      var num = stateTally[i];
      counts[num] = counts[num] ? counts[num] + 1 : 1;
    }
    return counts
}

function calculateRankFromPercentile(value,state){
    var numCounties = countiesCount[state]
    var rank = numCounties - Math.round(value/(100/numCounties))+1
    
    // console.log(rank)
 //    console.log(value)
    return [rank,numCounties]
}

function fipsCountyName(data,columName){
    var dict = {}
    for(var i in data.features){
        var county = data.features[i].properties[columName]
        var fips = data.features[i].properties.FIPS
        dict[fips]=county
    }
    return dict
}
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function turnToDictFIPS(data,keyColumn){
    
    var newDict = {}
    var maxPriority = 0
    var keys = Object.keys(data[0])
    //console.log(keys)
    var notBinaryCoverage = []
    for(var i in data){
        var key = String(data[i][keyColumn])
        if(key.length==4){
            key= "0"+key
        }
        var values = data[i]
        for(var j in measureSet){
            var measureKey = measureSet[j]
            var priorityKey = "Percentile_ranks_"+measureKey
            var priority = parseFloat(data[i][priorityKey])
            //console.log(priority)
            for(var ps in pStops){
                var pStop = pStops[ps]
                if(priority>=pStop[0] && priority<=pStop[1]){
                    var pGroup = "_"+ps
                    break
                }                
            }
            values["group_"+measureKey]=pGroup
            if(values["County_FIPS"]!=undefined && values["County_FIPS"].length==4){
                var oldFIPS = values["County_FIPS"]
                values["County_FIPS"] = "0"+oldFIPS
               // console.log( values["County_FIPS"])
            }
                      
        }
        
        newDict[key]=values
        //break
    }
 //   console.log(newDict)
    return newDict
}
function combineGeojson(all,counties){
    for(var c in counties.features){
        var countyFIPS = counties.features[c].properties.FIPS
        var data = all[countyFIPS]
       // console.log(data)
        counties.features[c]["id"]=countyFIPS        
        //for now PR is undefined
        if(data!=undefined){            
            var keys = Object.keys(data)
            
            for(var k in keys){
                var key = keys[k]
                 var value = data[key]
                if(isNaN(value)==false){
                    value = parseFloat(value)
                }
                counties.features[c].properties[key]=value
            }
        }
    }
    return counties
}

function drawMap(data,outline){
    // d3.select("#map").style("width",window.innerWidth+"px")
 //       .style("height",window.innerHeight+"px")
    mapboxgl.accessToken = "pk.eyJ1IjoiYzRzci1nc2FwcCIsImEiOiJja2J0ajRtNzMwOHBnMnNvNnM3Ymw5MnJzIn0.fsTNczOFZG8Ik3EtO9LdNQ"//new account
    var maxBounds = [
    [-165,6], // Southwest coordinates
    [-15, 70] // Northeast coordinates
    ];
   var bounds = [[-120, 26], 
        [-40, 50]
    ]
     
    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/c4sr-gsapp/ckgv55fah2szi19qfea0cnug1',
        center:[-80,35],
        zoom:6,
        scrollZoom: false,
        transformRequest: transformRequest
    });


  //  var marker = new mapboxgl.Marker();
    // if (config.showMarkers) {
  //       marker.setLngLat(config.chapters[0].location.center).addTo(map);
  //   }


     map.on("load",function(){

         map.setLayoutProperty("mapbox-satellite", 'visibility', 'visible');
         map.setPaintProperty("mapbox-satellite","raster-opacity",1)

        map.resize();

        map.dragRotate.disable();
        map.addSource("counties",{
                 "type":"geojson",
                 "data":data
             })
         
             map.addLayer({
                 'id':"base",
                 'type': 'fill',
                 'source': 'counties',
                 'paint': {
                     'fill-color': "#ffffff",
                     'fill-opacity':.1
                 }
             });
         
         
    })
    //    console.log(map.getStyle().layers)
    
    map.once("idle",function(){
       // console.log(map.getStyle().layers)
        d3.select("#loader").attr("opacity",1).transition().duration(1000).attr("opacity",0).remove()
        var countyData = getUserCounty(userCoordinates)
        
        configureStory()
    
        //populate configuration here
        var county = countyData.county
        var state = countyData.state
        var pop = countyData.totalPopulation
        var  properties = countyData
        var totalCountiesInState = calculateRankFromPercentile(countyData["Percentile_ranks_"+measureSet[0]],state)[1]
        
       // console.log(totalCountiesInState)
        config.chapters[1]["description"]= "You are currently in "+ county+" County, containing "+numberWithCommas(pop)+" residents." 
        //+" 1 of "+ totalCountiesInState+" counties in "+ toTitleCase(state)+"."
        
         for(var m in measureSet){
             var label = measureSet[m] 
            // console.log(label)
             
             var mKey = "Percentile_ranks_"+measureSet[m]
             var mValue = Math.round(properties[mKey]*100)/100
        
             var rank = calculateRankFromPercentile(properties[mKey],state)
             var topCounty = mostVulnerableCounty(mKey,state)
             //console.log(topCounty)
             var displayKey = measureDisplayTextPop[measureSet[m]]
        
             if(rank[0]==1){
                var dataText="<br>The percentile rank of "+displayKey+" for where you are is "+ mValue
                 +", which is #"+rank[0]+" out of the "+rank[1]+" counties in "+toTitleCase(state)+".<br><br>"
             }else{
             var dataText="<br>The percentile rank of "+displayKey+" for where you are is "+ mValue
             +", which is #"+rank[0]+" out of the "+rank[1]+" counties in "+toTitleCase(state)+".<br><br>"
             +"In your state, "+topCounty.county+" county, with a population of "+numberWithCommas(topCounty.population)
            +" has the highest vulnerability in "+displayKey+"."
             }
             
             
             var newChapter = {}
             newChapter["id"]=label
             newChapter["title"]=measureDisplayTextPop[label]
             newChapter["description"]=introDescription[label]+"<br>"+dataText
             newChapter["location"]={center:topCounty.centroid,zoom:15,speed: .2}
             newChapter["onChapterEnter"] = [
      //            {layer: label,opacity:1} ,
      //            {layer: "least_"+label,opacity:1},
      //             {layer: "most_"+label,opacity:1}
             ]
               newChapter["onChapterExit"] = [
      //             {layer: label,opacity:0},
      //             {layer: "least_"+label,opacity:0},
      //              {layer: "most_"+label,opacity:0}
                ]
             config.chapters.push(newChapter)
         }
         
        
          for(var n in capitaSet){
              // console.log(capitaSet[n])
              // console.log(countyData)
//               console.log(value)
              var newChapter = {}
              newChapter["id"]=capitaSet[n]+"_compare"
              var value = countyData[capitaSet[n]]
              var matches = filterByValue(value,capitaSet[n],county)
              var title = capitaSetDisplayTitle[capitaSet[n]]
              newChapter["title"]= matches.length+" counties have similar "
              +measureDisplayTextPop[capitaSet[n]]+" as where you are: "+value
              
              
              var description = ""
              for(var m in matches){
                  description+= matches[m].county+" county, in "+matches[m].state+" "+Math.round(matches[m].value*100)/100+"<br>"
              }
              newChapter["description"]=description
              newChapter["location"]={center:userCoordinates,zoom:18,speed: 1}
              newChapter["onChapterEnter"] = [
       //            {layer: label,opacity:1} ,
       //            {layer: "least_"+label,opacity:1},
       //             {layer: "most_"+label,opacity:1}
              ]
                newChapter["onChapterExit"] = [
       //             {layer: label,opacity:0},
       //             {layer: "least_"+label,opacity:0},
       //              {layer: "most_"+label,opacity:0}
                 ]
              config.chapters.push(newChapter)
          }
         scrollAll()
         setMapToUser(userCoordinates)
    })
}

function filterByValue(matchValue, column, matchCounty){
    var matches = []
    for(var j in pub.all.features){
        var value = pub.all.features[j].properties[column]
            var county = pub.all.features[j].properties.county
        if(value<matchValue*1.01 && value>matchValue*.99&& matchCounty!=county){
      //  console.log(value)
            
            var state = pub.all.features[j].properties.state
            var population = pub.all.features[j].properties.totalPopulation
            var match = {county:county, state:state, population:population,value:value}
            matches.push(match)
        }
    }
    return matches
}

function mostVulnerableCounty(measure,selectedState){
    for(var i in pub.all.features){
        var properties = pub.all.features[i].properties
        var state = properties.state
        // console.log(state)
    //     console.log(selectedState)
        if(state==selectedState){
            var ranking = calculateRankFromPercentile(properties[measure],state)
            if(ranking[0]==1){
                var county = properties.county
                var population = properties.totalPopulation
               // console.log(pub.all.features[i].)
                var centroid = pub.centroids[properties.FIPS]
                return {county:county,population:population, centroid:centroid}
               // return 
            }
        }//[measure]
    }
    
}


function formatCentroids(centroids){
    var formatted ={}
    for(var i in centroids){
        var geoid = centroids[i].properties.GEOID
        var coords = centroids[i].geometry.coordinates
        formatted[geoid]={lng:coords[0],lat:coords[1]}
    }
    return formatted
}
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function combineDatasets(svi,covid){
        
    var countiesWith = 0
    var countiesWithout = 0
    var formatted = {}
    for(var s in svi){
        var state = svi[s]["ST"]
        var county = "_"+String(svi[s].FIPS)
        var totalPop = parseInt(svi[s]["E_TOTPOP"])
        //console.log(covid[county])
        if(Object.keys(covid[county]).length==0 ){
            countiesWithout+=1
            svi[s]["covid_deaths"]=0
            svi[s]["covid_cases"]=0
            svi[s]["covid_deathsPer100000"]=0
            svi[s]["covid_casesPer100000"]=0
        }else{
            countiesWith+=1
            var countyEarliestDate = Object.keys(covid[county]).sort()[0]
            var countyLatestDate = Object.keys(covid[county]).sort()[Object.keys(covid[county]).length-1]
            
            var deaths = parseInt(covid[county][countyLatestDate].deaths)
            svi[s]["covid_deaths"]=deaths
            var cases = parseInt(covid[county][countyLatestDate].cases)
            svi[s]["covid_cases"]=cases
            svi[s]["population"]=totalPop
            svi[s]["covid_deathsPer100000"] = Math.round(deaths/(totalPop/100000)*10)/10
            svi[s]["covid_casesPer100000"] = Math.round(cases/(totalPop/100000))
            svi[s]["startDate"]
            svi[s]["endDate"]
            
        }
    }
    
    
    return svi
}
