
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
    coordsByCounty:null,
    sviByCounty:null,
    combined:null,
    neighborsGeo:null,
    neighborId:null,
    currendId:null
}
var mostLeastDescription = {}
var currentState = ""
var highlightColor = "gold"
var bghighlightColor = "gold"
var outlineColor = "#DF6D2A"
var currentClickedGroup = null

var measures = [
"AGE17",
"AGE65",
"CROWD",
"DISABL",
"GROUPQ",
"LIMENG",
"MINRTY",
"MOBILE",
"MUNIT",
"NOHSDP",
"NOVEH",
"PCI",
"POV",
"SNGPNT",
"UNEMP"
]
var measuresLabels = {
AGE17:"Persons aged 17 and younger",
AGE65:"Persons aged 65 and older",
DISABL:"Civilian noninstitutionalized population with a disability",
LIMENG:"Persons(age 5+) who speak English \"less than well\"",
CROWD:"At household level(occupied housing unite) more people than rooms",
GROUPQ:"Persons in group quarters",
MINRTY:"Minority(all persons expcept white, non-Hispanic)",
MOBILE:"Mobile homes",
MUNIT:"Housing in structurew with 10 or more units",
NOHSDP:"Persons(age 25+) with no high school diploma",
NOVEH:"Households with no vehicle available",
PCI:"Per capita income",
POV:"Persons below poverty",
SNGPNT:"Single parent household with children under 18",
UNEMP:"Civilian(age 16+) unemployed"
}
var measuresPercentDenominators = {
AGE17:"of population",
AGE65:"of population",
DISABL:"of population",
LIMENG:"of population",
CROWD:"of households",
GROUPQ:"of population",
MINRTY:"of population",
MOBILE:"of housing units",
MUNIT:"of housing units",
NOHSDP:"of population 25+",
NOVEH:"of households",
PCI:"",
POV:"of population",
SNGPNT:"of households",
UNEMP:"of population 16+"
}
var measuresDenominators = {
AGE17:"persons",
AGE65:"persons",
DISABL:"persons",
LIMENG:"persons",
CROWD:"households",
GROUPQ:"persons",
MINRTY:"persons",
MOBILE:"housing units",
MUNIT:"housing units",
NOHSDP:"persons",
NOVEH:"households",
PCI:"",
POV:"persons",
SNGPNT:"households",
UNEMP:"persons"
}

var colors = ["#aaa","red"]
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
var countyCentroids = d3.json("../county_centroids.geojson")
var counties = d3.json("counties_neighbors.geojson")
var stateCentroids = d3.json("../us-state-centroids.json")
var usOutline = d3.json("../simple_contiguous.geojson")
//var timeStamp = d3.csv("https://raw.githubusercontent.com/CenterForSpatialResearch/newpoliticsofcare_analysis/master/Output/time_stamp.csv")
var allData = d3.csv("SVI2018_US_COUNTY.csv")
//var allData = d3.csv("County_level_proportional_allocation_for_all_policies 2.csv")
var states = d3.json("../simplestates.geojson")

var userRankings = {}



Promise.all([counties,usOutline,countyCentroids,allData,states,stateCentroids])
.then(function(data){
    ready(data[0],data[1],data[2],data[3],data[4],data[5])
})
var hoveredStateId = null;

var lineOpacity = {stops:[[0,1],[100,0.3]]}
var lineWeight = {stops:[[-1,0],[-0.01,0],[0,2],[99,.5],[100,0]]}
var centroids = null
var latestDate = null
var countiesCount = null
function ready(counties,outline,centroids,sviData,states,sCentroids){ 
    
    pub.coordsByCounty = getCountyCoordinates(counties)
    pub.sviByCounty = getSviByCounty(sviData)
    
    
    pub.combined = combineGeojson(pub.sviByCounty,counties)
   // console.log(pub.combined)
    drawMap(pub.combined)
    
//what ways is your county vulnerable?
    //add chapter with div of chart
    
    
    //rollover div to filter map
    
//what ways are your neighborhing counties vulnerable?
    //get neighbors
    
    
//which are the most vulnerable counties in your state?

//where in the country is your county similar to?

//where should vaccines go?
       
}
function drawPercents(data){
    console.log(data)
    var lineHeight = 60
    
    d3.select("#user svg").remove()
    d3.select("#countyTitle").remove()
    d3.select("#countySubtitle").remove()
    
    d3.select("#user h3").html("<span id=\"countyName\"> "+ data.LOCATION+"</span>")
    d3.select("#user").append("div").attr("id","countyTitle")
    .style("font-size","16px")
    .style("width","300px")
    .style("padding","0px")
    .html("<br>Total Population: "+numberWithCommas(data["E_TOTPOP"])
        +"<br>Total Households: "+numberWithCommas(data["E_HH"])
        +"<br>Total Housing Units: "+numberWithCommas(data["E_HU"])
        )
    d3.select("#user").append("p").html("Here are the 15 Census demographic data points used in SVI:").attr("id","countySubtitle")
    
   var svg= d3.select("#user").append("svg").attr("width",300).attr("height",16*60)
    
  
    
   svg.selectAll(".percent_text")
    .data(measures)
    .enter()
    .append("text")
    .attr("class","percent_text")
    .text(function(d){
        return measuresLabels[d]
    })
    .attr("x",function(d,i){
        return 0
    })
    .attr("y",function(d,i){
        return i*lineHeight+20
    })
    
    var wScale = d3.scaleLinear().domain([0,100]).range([0,200])
    
   svg.selectAll(".percent_count")
    .data(measures)
    .enter()
    .append("text")
    .attr("class","percent_count")
    .text(function(d){
        if(d=="PCI"){
            return "$"+numberWithCommas(data["E_"+d])
        }
        return numberWithCommas(data["E_"+d])
    })
    .attr("x",10)
    .attr("y",function(d,i){return i*lineHeight+45})
    .attr("font-size","24px")
    .attr("fill","#5ac15f")
    
   svg.selectAll(".count_label")
    .data(measures)
    .enter()
    .append("text")
    .attr("class","count_label")
    .text(function(d){
        return measuresDenominators[d]
    })
    .attr("x",10)
    .attr("y",function(d,i){return i*lineHeight+55})
    .attr("font-size","11px")
    .attr("fill","#5ac15f")

   svg.selectAll(".percent_number")
    .data(measures)
    .enter()
    .append("text")
    .attr("class","percent_number")
    .text(function(d){
        if(d=="PCI"){
            return ""
        }
        return numberWithCommas(data["EP_"+d])+"%"
    })
    .attr("x",280)
    .attr("y",function(d,i){return i*lineHeight+45})
    .attr("font-size","24px")
    .attr("fill","#6acc54")
    .attr("text-anchor","end")
    
   svg.selectAll(".percent_count_label")
    .data(measures)
    .enter()
    .append("text")
    .attr("class","percent_count_label")
    .text(function(d){
        return measuresPercentDenominators[d]
    })
    .attr("x",280)
    .attr("y",function(d,i){return i*lineHeight+55})
    .attr("font-size","11px")
    .attr("fill","#5ac15f")
    .attr("text-anchor","end")
}
function drawPercentile(data){
    var lineHeight = 30
    
    d3.select("#percentile svg").remove()
    d3.select("#countyTitlePercentile").remove()
    
    d3.select("#percentile h3").html("How does <span id=\"countyName\"> "+ data.LOCATION+"</span> compare?")
    
    d3.select("#percentile").append("p")
    .style("font-size","16px")
    .style("width","300px")
    .style("padding","0px")
    .html("RPL: "+data["RPL_THEMES"]
        +"<br>SPL: "+data["SPL_THEMES"]
        )
    
   var svg= d3.select("#percentile").append("svg").attr("width",400).attr("height",16*60)
    
   svg.selectAll(".percent_text")
    .data(measures)
    .enter()
    .append("text")
    .attr("class","percent_text")
    .text(function(d){
        return measuresLabels[d]
    })
    .attr("x",function(d,i){
        return 10
    })
    .attr("y",function(d,i){
        return i*lineHeight+20
    })
    .style("font-size","10px")
    
    var wScale = d3.scaleLinear().domain([0,1]).range([0,200])
    var cScale = d3.scaleLinear().domain([0,1]).range([colors[0],colors[1]])
    
   svg.selectAll(".percent_count")
    .data(measures)
    .enter()
    .append("rect")
    .attr("class","percent_count")
    .attr("width",function(d){
        return wScale(data["EPL_"+d])
    })
    .attr("height",lineHeight/2)
    .attr("x",10)
    .attr("y",function(d,i){return i*lineHeight+25})
    .attr("fill",function(d){
        return cScale(data["EPL_"+d])
    })
    
   svg.selectAll(".percentile_label")
    .data(measures)
    .enter()
    .append("text")
    .attr("class","percentile_label")
    .attr("x",function(d){
        return wScale(data["EPL_"+d])+10
    })
    .attr("y",function(d,i){return i*lineHeight+35})
    .attr("fill",function(d){
        return cScale(data["EPL_"+d])
    })
    .text(function(d){
        return Math.round(data["EPL_"+d]*10000)/100+"%"
    })

   // svg.selectAll(".percent_number")
 //    .data(measures)
 //    .enter()
 //    .append("text")
 //    .attr("class","percent_number")
 //    .text(function(d){
 //        if(d=="PCI"){
 //            return ""
 //        }
 //        return numberWithCommas(data["EP_"+d])+"%"
 //    })
 //    .attr("x",280)
 //    .attr("y",function(d,i){return i*lineHeight+50})
 //    .attr("font-size","24px")
 //    .attr("fill","#6acc54")
 //    .attr("text-anchor","end")
}
function drawNeighbors(data){
    //console.log(data)
    d3.select("#neighbors svg").remove()
    d3.select("#neighbors p").remove()
    var neighbors = data.NEIGHBORS.split(",")
    var bounds = []
    var nsData = []
    var neighborId = []
    for(var i in neighbors){
        var nGid = neighbors[i]
        var nData = pub.sviByCounty[nGid]
        var nGeo = pub.coordsByCounty[nGid]
        bounds.push(nGeo)
        nsData.push(nData)
        neighborId.push(nGid)
    }
    neighborId.push(data["GEOID"])
    pub.neighborsGeo = bounds
    pub.neighborId = neighborId
    nsData.push(data)
    
    
    d3.select("#neighbors h3")
    .html("How does <span id=\"countyName\">"+ data.LOCATION+ "</span> compare to its <span id=\"countyName\">"+(nsData.length-1)+" neighboring counties</span>?")
    d3.select("#neighbors").append("p").attr("id","neighborDescription")
//.html("rollover the bars to see corresponding neighboring county on map")
    var descriptionText = data.COUNTY+" ranks <br>"
    var svg  = d3.select("#neighbors").append("svg").attr("width",200).attr("height",nsData.length*210)
    
   // console.log(nsData)
    for(var m in measures){
        
        var nCount = nsData.length
        var measure = measures[m]
        
        var w = 300/nsData.length
        if(w>30){
            w=30
        }
        
        var sorted = nsData.sort(function(a,b){
            return b["EP_"+measures[m]]-a["EP_"+measures[m]]
        })
        
        var rank = sorted.indexOf(data)
      //  console.log(rank)
        
        if(rank == 0){
            descriptionText+="highest in \""+ measuresLabels[measure]+"\"<br>"
           // d3.select("#neighborDescription").append("p").html(data.COUNTY+" ranks the highest in "+ measuresLabels[measure])
        }else if(rank == nCount-1){
           descriptionText+="lowest in \""+ measuresLabels[measure]+"\"<br>"
           // d3.select("#neighborDescription").append("p").html(data.COUNTY+" ranks the lowest in "+ measuresLabels[measure])
        }
        
        var wScale = d3.scaleLinear().domain([0,sorted[0]["EP_"+measure]]).range([2,100])
        
        svg.append("text").attr("id",measure)
        .text(function(){
                return measuresLabels[measure]
        })
        .attr("transform","translate(0,"+(m*((nCount+5)*11)+11)+")")
       .attr("font-size","11px")
        
        svg.append("text").attr("id",measure+"denom")
        .text(function(){
            if(measure=="PCI"){
                return ""
            }else{
                return " as % "+measuresPercentDenominators[measure]
                
            }
        })
        .attr("transform","translate(0,"+(m*((nCount+5)*11)+22)+")")
       .attr("font-size","11px")
        
        svg.selectAll(".bar_"+measures[m])
        .data(sorted)
        .enter()
        .append("rect")
        .attr("id",function(d){
            return measure+"_"+d.FIPS
        })
        .attr("measure",measure)
        .attr("height",10)
        .attr("width",function(d){
            return wScale(d["EP_"+measure])
        })
        .attr("y",function(d,i){return i*11})
        .attr("x",function(d,i){return 80; return 100-wScale(d["EP_"+measure])})
        .attr("transform","translate(0,"+(m*((nCount+5)*11)+25)+")")
        .attr("fill",function(d){
            //console.log([d.FIPS,data.FIPS])
            if(d.FIPS==data.FIPS){
                return "red"
            }else{
                return "#aaa"
            }
        })
        .attr("cursor","pointer")
        .on("mouseover",function(d){
            var gid = d.FIPS
            console.log(d)
            var currentMeasure = d3.select(this).attr("measure")
            map.setFilter("hover",["==","GEOID",gid])
            d3.select("#popup")
                .style("left",(window.event.clientX+20)+"px")
                .style("top",window.event.clientY+"px")
                .html(d.LOCATION+"<br>"+currentMeasure+":"+d["EP_"+currentMeasure])
        })
        .on("mouseout",function(d){
            var gid = d.FIPS
            map.setFilter("hover",["==","GEOID",""])
            
        })
        
        svg.selectAll(".label_"+measure)
        .data(sorted)
        .enter()
        .append("text")
       .text(function(d){
           if(measure=="PCI"){
               return numberWithCommas(Math.round(d["EP_"+measure]))
           }
           return d["EP_"+measure]+"%"
       })
        .attr("x",function(d,i){return wScale(d["EP_"+measure])+85})
        .attr("y",function(d,i){return i*11})
        .attr("transform","translate(0,"+(m*((nCount+5)*11)+35)+")")
       .attr("font-size","10px")
        .attr("fill",function(d){
            //console.log([d.FIPS,data.FIPS])
            if(d.FIPS==data.FIPS){
                return "red"
            }else{
                return "#aaa"
            }
        })
        
        
         svg.selectAll(".label_"+measure)
         .data(sorted)
         .enter()
         .append("text")
        .text(function(d){
            return d["COUNTY"]
        })
         .attr("x",function(d,i){return 75})
         .attr("y",function(d,i){return i*11})
         .attr("transform","translate(0,"+(m*((nCount+5)*11)+35)+")")
        .attr("font-size","10px")
        .attr("text-anchor","end")
         .attr("fill",function(d){
             //console.log([d.FIPS,data.FIPS])
             if(d.FIPS==data.FIPS){
                 return "red"
             }else{
                 return "#aaa"
             }
         })
        
    }
    
     d3.select("#neighborDescription").append("p").html(descriptionText).style("font-size","11px")
    
}
function addLayers(column){

         map.addLayer({
             'id':column,
             'type': 'fill',
             'source': 'counties',
             'paint': {
                 'fill-color': "#ffffff",
                 'fill-opacity':0
             }
         });
         
         var matchString = {
         property: "EPL_"+column,
         stops: [[0,"#ddd"],[0.001, colors[0]],[1, colors[1]]]
         }
         map.setPaintProperty(column, 'fill-color', matchString)
      //   map.setPaintProperty(column, 'fill-opacity', 0)
}


function getSviByCounty(data){
    var dict = {}
    for(var i in data){
        var gid = data[i].FIPS
        if(gid!=undefined){
            if(gid.length==4){
                gid = "0"+gid
            }
            dict[gid]=data[i]
        }
        
    }
    return dict
}
function getCountyCoordinates(counties){
   // console.log(counties)
    var dict = {}
    for(var i in counties.features){
        var geometry = counties.features[i].geometry.coordinates
        var gid = counties.features[i].properties.GEOID
        dict[gid]=geometry
    }
    return dict
}

function getUserCounty(userCoordinates){
    var userPoint = map.project(userCoordinates)
    var features = map.queryRenderedFeatures(userPoint,{layers:["base"]});
   //  var properties = features[0].properties
     //var county = properties.county
    return features[0]
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
        var fips = data.features[i].properties.GEOID
        if(fips.length==4){
            fips = "0"+fips
        }
        dict[fips]=county
    }
    return dict
}
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function combineGeojson(all,counties){

    for(var c in counties.features){
        var countyFIPS = counties.features[c].properties.GEOID
        if(countyFIPS.length==4){
            countyFIPS = "0"+countyFIPS
        }
        var data = all[countyFIPS]
            
        counties.features[c]["id"]=countyFIPS        

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
        counties.features[c].properties.FIPS = countyFIPS
        
    }
    return counties
}

function drawMap(data){

    mapboxgl.accessToken = "pk.eyJ1IjoiYzRzci1nc2FwcCIsImEiOiJja2J0ajRtNzMwOHBnMnNvNnM3Ymw5MnJzIn0.fsTNczOFZG8Ik3EtO9LdNQ"//new account
    var maxBounds = [
    [-165,6], // Southwest coordinates
    [-15, 70] // Northeast coordinates
    ];

    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/c4sr-gsapp/ckkq5n6bw2nhf17lf0vl4hseh',
        center:[-95,39],
        zoom:3.5,
        speed: .4,
        maxBounds:maxBounds
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
             map.addLayer({
                 'id':"hover",
                 'type': 'fill',
                 'source': 'counties',
                 'paint': {
                     'fill-color': "gold",
                     'fill-opacity':0
                 }
             });
             map.addLayer({
                 'id':"outline",
                 'type': 'line',
                 'source': 'counties',
                 'paint': {
                     'line-color':"#fff",
                     'line-opacity':0,
                     'line-width':2
                 },
             });
             map.addLayer({
                 'id':"outline_hover",
                 'type': 'line',
                 'source': 'counties',
                 'paint': {
                     'line-color':"#fff",
                     'line-opacity':.5,
                     'line-width':.5
                 },
             });
          //   console.log(map.getStyle().layers)
             map.on("mousemove","base",function(c){
                // console.log(c.features[0])
             })
             map.on("click","base",function(e){
                 var userProperties = e.features[0].properties
                 var userCoordinates = null
                 getUserInfo(userCoordinates,userProperties,map)
             })
         
     
    })
    //    console.log(map.getStyle().layers)
    
    map.once("idle",function(){
        addLayers("RPL_THEMES")
        map.setFilter("hover",["==","GEOID",""])
        
        for(var m in measures){
            var measure = measures[m]
            addLayers(measure)
        }
        
        
           
        configureStory() 
         scrollAll()
          
          
        d3.select("#ipAddress").on("click",function(){
            var currentText = d3.select("#ipAddress").attr("html")
            $.getJSON('https://geoip-db.com/json/')
            .done (function(location) {
                userCoordinates = [location.longitude, location.latitude]
               
                     var userCounty = getUserCounty(userCoordinates)
                        console.log(userCounty)
                     var userProperties = userCounty.properties
                    getUserInfo(userCoordinates,userProperties,map)
                
           });
   
        })
    
    })
}


function getUserInfo(userCoordinates,userProperties,map){
            var userGid = userProperties.GEOID
    if(String(userGid).length==4){
        userGid = "0"+String(userGid)
    }
    pub.currentId = userGid
    
        var userGeometry = pub.coordsByCounty[userGid]
            var userCoords =  flatDeep(userGeometry,Infinity)
            var userBounds = getMaxMin(userCoords)

            var bounds = new mapboxgl.LngLatBounds(userBounds)
            
            map.fitBounds(bounds,{padding:20})
            
    if(userCoordinates!=null){
            d3.select("#ipAddress").html("Your ip address indicates that you are at: "+userCoordinates
            +"<br> in "+userProperties.county+" county, "+userProperties.stateAbbr
            +", population "+userProperties.totalPopulation)+"."
    }else{
        d3.select("#ipAddress").html("You have selected "
            +"<br><span id=\"countyName\">"+userProperties.LOCATION
            +"</span><br> population "+userProperties["E_TOTPOP"])+"."
    
    }
    map.setPaintProperty("base","fill-opacity",.9)
    map.setFilter("base",["!=","GEOID",userGid])
    map.setFilter("outline",["==","GEOID",userGid])
    
    map.setPaintProperty("outline","line-opacity",1)
    
    
    drawPercents(userProperties)
    drawPercentile(userProperties)
    drawNeighbors(userProperties)
}

function getMaxMin(coords){
    var maxLat = -999
    var minLat = 0
    var maxLng = 0
    var minLng = 999
    for(var i in coords){
        var coord = coords[i]
        if(coord<0){
            if(coord<minLat){
                minLat = coord
            }else if(coord>maxLat){
                maxLat = coord
            }
        }else{
            if(coord>maxLng){
                maxLng = coord
            }else if(coord<minLng){
                minLng = coord
            }
        }
    }
    var bounds = [
    [minLat,minLng], // Southwest coordinates
    [maxLat, maxLng] // Northeast coordinates
    ];
    return bounds
    
   // console.log([minLat,maxLat,minLng,maxLng])
}
function flatDeep(arr, d = 1) {
   return d > 0 ? arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flatDeep(val, d - 1) : val), [])
                : arr.slice();
};
function zoomToBounds(map,coordinates){
    //https://docs.mapbox.com/mapbox-gl-js/example/zoomto-linestring/
    var bounds =  new mapboxgl.LngLatBounds(coordinates);
    map.fitBounds(bounds,{padding:200})
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
                var centroid = pub.centroids[properties.GEOID]
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
function combineDatasets(svi,covid){
        
    var countiesWith = 0
    var countiesWithout = 0
    var formatted = {}
    for(var s in svi){
        var state = svi[s]["ST"]
        var county = "_"+String(svi[s].GEOID)
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
