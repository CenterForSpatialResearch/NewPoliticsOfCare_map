
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

 var measureSet = [
     "Medicaid_capita",
     "Unemployment_capita",
     "SVI",
     "YPLL",
       "Covid",
     "Covid_capita",
     "Covid_death_capita"
]

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
    //pub.all = {"highDemand":highDemand,"hotspot":hotspot,"SVI":SVI,"hotspotSVI":hotspotSVI,"normal":normalizedP}
    countiesCount = getCountyCountByState(counties)
    
    pub.centroids = formatCentroids(centroids.features)
    //add to geojson of counties
    var combinedGeojson = combineGeojson(dataByFIPS,counties)
    pub.all = combinedGeojson
    
   // console.log(combinedGeojson)
 //  console.log(combinedGeojson)
            
    pub.fipsToName =  fipsCountyName(counties,"county")
   pub.fipsToPopulation = fipsCountyName(counties,"totalPopulation")

    drawMap(combinedGeojson,outline)
    
        
}
function getUserCounty(userCoordinates){
    console.log(userCoordinates)
    var userPoint = map.project(userCoordinates)
    console.log(userPoint)
    var features = map.queryRenderedFeatures(userPoint);
    console.log(features[0])
    var properties = features[0].properties
    var county = properties.county
    var state = properties.state
    var pop = properties.totalPopulation
    var covid = "test"
    
    var existingText = d3.select("#start p").html()
    var newText = existingText+"You are currently in "+ county+" county "+state+", population "+pop+"."
    
    newText+="<br><br>"+county+" county percentile ranks: <br>"
    for(var m in measureSet){
        var mKey = "Percentile_ranks_"+measureSet[m]
        var mValue = Math.round(properties[mKey]*100)/100
        
        var rank = calculateRankFromPercentile(properties[mKey],state)
        
        var displayKey = measureDisplayTextPop[measureSet[m]]
        newText+="<strong>"+displayKey+":</strong> "+ mValue+"<br>"
    }
    newText+="What does this mean in terms of vulnerability during covid?"
    d3.select("#start p").html(newText)
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
    var rank = value/(100/numCounties)
    console.log(rank)
    console.log(value)
}

function filterByPercentile(column,value){
    
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

function addMarker(gid,text,layer){
  //  console.log([layer,gid])
    if(gid.length==4){
        gid = "0"+gid
    }
    var coords = pub.centroids[gid]
        
    if(coords!=undefined){
       // console.log(gid)
        var countyName = pub.fipsToName[gid]
        map.addSource(layer,{
            "type":"geojson",
            "data":{
                        'type': 'Feature',
                        'properties': {
                            'description': text+countyName,
                            'icon': 'music'
                    },
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [coords.lng,coords.lat]//[-77.007481, 38.876516]
                    }
                }
        })
    
        // var marker = new mapboxgl.Marker().setLngLat([coords.lng,coords.lat]).addTo(map);
       //    console.log(marker);
      
        map.addLayer({
            'id': layer,
            'type': 'symbol',
            'source': layer,
            'layout': {
                'text-field': ['get', 'description'],
                'icon-allow-overlap': true,
                'text-allow-overlap': true,
                //'font-scale': 0.8,
                //'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
                'text-radial-offset': 10 ,
                 'text-justify': 'left'//,
    //             'icon-image': ['concat', ['get', 'icon'], '-15']
            },
                "paint": {
                    "text-halo-color": "rgba(255,255,255,.8)",
                    "text-halo-width": 25,
                    "text-halo-blur":5,
                'text-opacity':0
                    
                }
        });
    
    
        map.setLayoutProperty(layer, 'text-field', [
        'format',
        ['get', 'description'],
        {
        'font-scale':1,
        'text-font': [
        'literal',
        ['Arial Unicode MS Regular']
        ]
        }
        ]);
        
    }
   
    
}

function calculateMostLeasetFrequency(mostLeast){
        var mostLeastIds = []
        var idsFreq = {}
        for(var i in mostLeast){
        //console.log(i)
            var mostId = mostLeast[i].most.county
            var leastId = mostLeast[i].least.county
            
            
            if(Object.keys(idsFreq).indexOf(mostId)==-1){
                idsFreq[mostId]=[]
                idsFreq[mostId].push({cat:i,ml:"highest",value:mostLeast[i].most.value})
            }else{
                idsFreq[mostId].push({cat:i,ml:"highest",value:mostLeast[i].most.value})
            }
            
            if(Object.keys(idsFreq).indexOf(leastId)==-1){
                idsFreq[leastId]=[]
                idsFreq[leastId].push({cat:i,ml:"lowest",value:mostLeast[i].least.value})
            }else{
                idsFreq[leastId].push({cat:i,ml:"lowest",value:mostLeast[i].least.value})
            }
            
            
            
            if(mostId.length==4){
                mostLeastIds.push("0"+String(mostId))
                mostLeastIds.push("0"+String(mostId))
            }else{
                mostLeastIds.push(mostId)
                mostLeastIds.push(leastId)
            }
    }
   // console.log(idsFreq)
    
    var count = []
    for(var id in idsFreq){
        if(idsFreq[id].length>1){
            count.push({county:id,count:idsFreq[id].length,content:idsFreq[id]})
        }
    }
    
    // console.log(mostLeastIds)
 //    var count=frequencyCount(mostLeastIds)
 // 
  //  console.log(count)
    return count
}

function frequencyCount(arr) {
    var a = [], b = [], prev;
    arr.sort();
    for ( var i = 0; i < arr.length; i++ ) {
        if ( arr[i] !== prev ) {
            a.push(arr[i]);
            b.push(1);
        } else {
            b[b.length-1]++;
        }
        prev = arr[i];
    }
    var c = []
    for(var j in a){
        if(b[j]>1){
            c.push({county:a[j],count:b[j]})
        }
    }
    c.sort(function(a,b){
        return b.count-a.count
    })
    return c;
}

function filterDataByState(data){
    var stateData = []
    for(var i in data.features){
        if(data.features[i].properties.stateAbbr == filteredToState){
                stateData.push(data.features[i].properties)
        }
    }
    return stateData
}
function calculateMostLeast(stateData){
    var dictionary = {}
    for(var m in measureSet){
        var key = "Percentile_ranks_"+measureSet[m]
        dictionary[key]={}
        dictionary[key]["most"]={county:null, value:0}
        dictionary[key]["least"]={county:null, value:100}
    }
    
    
    for(var m in measureSet){
        var key = "Percentile_ranks_"+measureSet[m]
         for(var i in stateData){
             var countyData = stateData[i]
             var keyValue = countyData[key]
             var FIPS = countyData["FIPS"]
              if(FIPS.length==4){
                  var gid = "0"+String(FIPS)
              }
              else{
                  var gid = String(FIPS)
              }
          //    console.log(gid)
             
             if(keyValue>dictionary[key]["most"].value){
                 dictionary[key]["most"].county = gid
                 dictionary[key]["most"].value = keyValue
             }
             if(keyValue<dictionary[key]["least"].value){
                 dictionary[key]["least"].county = gid
                 dictionary[key]["least"].value = keyValue
             }
         }
    }
    return dictionary
}

function calculateVariance(stateData){
    var varianceData = []
    for(var i in stateData){
        var countyData = stateData[i]
        var countyId = countyData["FIPS"]
        var sum = 0
        for(var m in measureSet){
            var key = "Percentile_ranks_"+measureSet[m]
            var value = countyData[key]
            sum+=value
        }
        var average = sum/measureSet.length        
        var variance = 0
        for(var m in measureSet){
            var key = "Percentile_ranks_"+measureSet[m]
            var value = countyData[key]
            var deviation = Math.abs(value-average)
            variance+=(deviation*deviation)
        }
        variance = variance/measureSet.length
        varianceData.push({county:countyId,variance:variance})
    }
    varianceData.sort(function(a,b){
        return b.variance-a.variance
    })
    var mostVariance = varianceData[0]
    var leastVariance = varianceData[varianceData.length-1]
    return {most:mostVariance,least:leastVariance}
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
         },"county-name");
         map.addLayer({
             'id':"selectedStateBase",
             'type': 'fill',
             'source': 'counties',
             'paint': {
                 'fill-color': "#aaa",
                 'fill-opacity':.1
             }
         },"county-name");
         
         map.addLayer({
             'id':"variance",
             'type': 'fill',
             'source': 'counties',
             'paint': {
                 'fill-color': "#a9a9a9",
                 'fill-opacity':0
             }
         },"county-name");
         
         map.addLayer({
             'id':"frequency",
             'type': 'fill',
             'source': 'counties',
             'paint': {
                 'fill-color': "#a9a9a9",
                 'fill-opacity':0
             }
         },"county-name");
         
         for(var m in measureSet){
             map.addLayer({
                 'id':measureSet[m],
                 'type': 'fill',
                 'source': 'counties',
                 'paint': {
                     'fill-color': "#aaaaaa",
                     'fill-opacity':0
                 }
             },"county-name");
         }
         
       // colorByPriority(map,"Unemployment_capita","Unemployment_capita")
        
    })
    //    console.log(map.getStyle().layers)
    
    map.once("idle",function(){
       // console.log(map.getStyle().layers)
        d3.select("#loader").attr("opacity",1).transition().duration(1000).attr("opacity",0).remove()
    getUserCounty(userCoordinates)
      //  map.showCollisionBoxes = true
         //map.setFilter("state-abbr",["==","stateAbbr",filteredToState])
        // for(var m in measureSet){
 //
 //             map.setFilter(measureSet[m],["==","stateAbbr",filteredToState])
 //            colorByPriority(map,measureSet[m],measureSet[m])
 //
 //        }
    // map.setFilter("selectedStateBase",["==","stateAbbr",filteredToState])
 //        map.setFilter("variance",["==","stateAbbr",filteredToState])
 //        map.setFilter("frequency",["==","stateAbbr",filteredToState])
 //
 //    map.setFilter("place-label",["==","iso_3166_2","US-"+filteredToState])
 //    map.setFilter("place-marker",["==","iso_3166_2","US-"+filteredToState])
    
     //   map.setFilter("place-label",["==","iso_3166_2","US-"+filteredToState])
      //  map.setFilter("place-marker",["==","iso_3166_2","US-"+filteredToState])
      
       // console.log(map.getStyle().layers)
    })

}

function drawSmallMapKey(svg){
    
    var defs = svg.append("defs");
    var gradient = defs.append("linearGradient")
       .attr("id", "svgGradient")
       .attr("x1", "0%")
       .attr("x2", "100%")
       .attr("y1", "0%")
       .attr("y2", "0%");

    gradient.append("stop")
       .attr('class', 'end')
       .attr("offset", "0%")
       .attr("stop-color", "#e1e0e0")
       .attr("stop-opacity", 1);
    gradient.append("stop")
       .attr('class', 'start')
       .attr("offset", "100%")
       .attr("stop-color", "#525252")
       .attr("stop-opacity", 1);

   
       
    svg.append("rect")
    .attr("class","key")
    .attr('width',160)
    .attr('height',10)
    .attr("x",20)
    .attr("y",10)
    //   .attr("fill","red")
    .attr("fill","url(#svgGradient)")
       .attr("stroke","rgba(0,0,0,.5)")
       .attr("stroke-width",.1)
       
      svg.append("text").text("High SVI: 1").attr("x",180).attr("y",32).attr("text-anchor","end")
      svg.append("text").text("Low SVI: 0").attr("x",20).attr("y",32)//.attr("text-anchor","end")
}

function sumProperty(prop,list){
     var total = 0
    for ( var i = 0, _len = list.length; i < _len; i++ ) {
        total += parseFloat(list[i][prop])
    }
    return total
}

function drawHistogram(strategy){
  //  var strategy = "SVI"
    var priority = strategy+"_priority"
    d3.select("#histogram svg").remove()
   var svg = d3.select("#histogram")
                .append("svg")
                .attr("width",800)
                .attr("height",140)
   
    var height = 80
    var width = 700
    var barWidth = 650
    var activeData = Object.values(pub.all[strategy])
    
    var breaks = fillColor[strategy]["stops"]

    var max = Math.max.apply(Math, activeData.map(function(o) { return o[priority]; }))
    
    var totalCounties = activeData.length
    
    var formattedBreaks = []
    var cLength = 0    
    
    for(var i in breaks){
        if(i==breaks.length-1){
            var endValue = max
            var startValue = breaks[i][0]

        }else{
            var startValue = breaks[i][0]
            var endValue = breaks[parseInt(i)+1][0]
        }
        
        var group =activeData.filter(function(d){
            return d[priority]>=startValue && d[priority]<=endValue
        })        
        var sum = sumProperty(strategy+"_total_demand_of_county",group)
        
        var startX = cLength
        cLength+=Math.round((group.length/totalCounties)*10000)/100
        actualLength = group.length
        var color = colors[strategy][i]
        formattedBreaks.push({cases:sum,color:color,cLength:cLength, sLength:startX,actualLength:actualLength,length:Math.round((group.length/totalCounties)*10000)/100})
    }
    var xScale = d3.scaleLinear().domain([0,100]).range([0, barWidth])
    
    var gradient = svg.append("defs").append("linearGradient")
        .attr("id","test")
        .attr("x1","0%")
        .attr("y1","0%")
        .attr("x2","100%")
        .attr("y2","0%")
    
    var y1 = 100
    var y2 = 20
    
   // svg.append("text").text("priority value").attr("x",20).attr("y",30)
    svg.append("text").text("# of counties").attr("x",0).attr("y",y1)
    svg.append("text").text("# of cases").attr("x",0).attr("y",y1+30)


    for(var b in formattedBreaks){
        var bk = formattedBreaks[b]
        gradient.append("stop")
        .attr("offset",bk.sLength+"%")
        .style("stop-color",bk.color)
        
    }
    svg.append("rect")
    .attr("x",0)
    .attr("y",y1+5)
    .attr("width", barWidth)
    .attr("height",10)
    .attr("fill","url(#test)")
    .attr("stroke","#fff")
    .attr("stroke-width","2px")
    
    for(var b in formattedBreaks){
        var bk = formattedBreaks[b]
        // svg.append("text")
 //        .text(bk.endV)
 //        .attr("x",xScale(bk.cLength)-5)
 //        .attr("y",55)
 //        .style("writing-mode","vertical-rl")
 //        .attr("text-anchor","end")
        
        
        // svg.append("rect")
      //       .attr("x",xScale(bk.sLength))
      //       .attr("y",20)
      //       .attr("width", xScale(bk.length))
      //       .attr("height",10)
      //       .attr("fill",bk.color)
        
        svg.append("text")
        .text(numberWithCommas(bk.actualLength))
        .attr("x",xScale(bk.sLength+bk.length/2)-5)
        .attr("y",y1+10)
        .attr("text-anchor","end")
        .style("writing-mode","vertical-rl")
        
        svg.append("text")
        .text(numberWithCommas(bk.cases))
        .attr("x",xScale(bk.sLength+bk.length/2)-5)
        .attr("y",y1+20)
        .attr("text-anchor","start")
        .style("writing-mode","vertical-rl")
        
        svg.append("rect")
        .attr("width",2)
        .attr("height",10)
        .attr("x",xScale(bk.cLength)-2)
        .attr("y",y1+5)
        .attr("fill","white")
    }
    
    
    if(pub.coverage !="show_all"){
        var cBreaks = 10
        var cmax = 100
        var cmin = 0
        var formattedCBreaks = []
    
        var cGroup = activeData.filter(function(d){
                var cKey = pub.strategy+"_"+pub.coverage
                return d[cKey]==0
            }) 
        var cummulativeLength =Math.round(cGroup.length/totalCounties*10000)/100
        formattedCBreaks.push({minValue:0,maxValue:0,length:cGroup.length,lengthP:Math.round(cGroup.length/totalCounties*10000)/100,start:0})
        
        
        
        for(var c = 0; c<10; c++){
             var cBreakStart = (cmax-cmin)/cBreaks*c
             var cBreakEnd = (cmax-cmin)/cBreaks*(c+1)
            if(cBreakStart==0){
                cBreakStart = 1
            }
            var cGroup =activeData.filter(function(d){
                var cKey = pub.strategy+"_"+pub.coverage
                return d[cKey]>=cBreakStart && d[cKey]<cBreakEnd
            }) 
            formattedCBreaks.push({minValue:cBreakStart,maxValue:cBreakEnd-1,length:cGroup.length,lengthP:Math.round(cGroup.length/totalCounties*10000)/100,start:cummulativeLength})
            cummulativeLength+=Math.round(cGroup.length/totalCounties*10000)/100
        }
    
        var oScale = d3.scaleLinear().domain([0,99.9]).range([1,0])
        var sScale = d3.scaleLinear().domain([0,99.9]).range([2,1])
        for(var i in formattedCBreaks){
            var fcb = formattedCBreaks[i]
            svg.append("rect")
            .attr("y",y2)
            .attr("x",xScale(fcb.start)+i*2)
            .attr("height",10)
            .attr("width",xScale(fcb.lengthP))
            .attr("fill","none")
            .attr("stroke",outlineColor)
            .attr("opacity",oScale(fcb.minValue))
            .attr("stroke-width",sScale(fcb.minValue))
            break
        }
    
        svg.append("text").text(numberWithCommas(formattedCBreaks[0].length)+" ("+formattedCBreaks[0].lengthP+"%)"+" counties with 0% coverage")
        .attr("y",y2+25).attr("x",0).attr("fill","black")
    }
}

function colorByPriority(map,layer,column){
    var matchString = {
    property: "Percentile_ranks_"+column,
   // stops: [[0, 'rgba(19,182,163, 1)'],[.5,"#A2D352"],[1, 'rgba(255, 241, 0, 1)']]
    stops: [[0,"#ddd"],[Math.pow(.01, 30), colors[0]],[50,colors[1]],[100, colors[2]]]
    }
    map.setPaintProperty(layer, 'fill-color', matchString)
    
}

function zoomToBounds(mapS){
    //https://docs.mapbox.com/mapbox-gl-js/example/zoomto-linestring/
    var bounds =  new mapboxgl.LngLatBounds([-155, 20], 
        [-55, 55]);
    map.fitBounds(bounds,{padding:500},{bearing:0})
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
function PopulateDropDownList(features,map,combinedGeojson) {
           //Build an array containing Customer records.
    var sorted =features.sort(function(a,b){
        return parseInt(a.properties.GEOID) - parseInt(b.properties["GEOID"]);
        
    })          
    var ddlCustomers = document.getElementById("ddlCustomers");
 
  
    //Add the Options to the DropDownList.
    var boundsDict = {}
    
    for (var i = 0; i < sorted .length; i++) {
        var option = document.createElement("OPTION");

        //Set Customer Name in Text part.
        option.innerHTML = sorted[i].properties.NAME;
        
        var coordinates = flatDeep(features[i].geometry.coordinates,Infinity)
        //console.log(coordinates)
       boundsDict[sorted[i].properties.GEOID]=getMaxMin(coordinates)
        //Set CustomerId in Value part.
        option.value = sorted[i].properties["GEOID"]
        option.id = sorted[i].properties.NAME
        //Add the Option element to DropDownList.
        if(sorted[i].properties.NAME!="United States Virgin Islands"&& sorted[i].properties.NAME!="American Samoa"&& sorted[i].properties.NAME!="Commonwealth of the Northern Mariana Islands"&& sorted[i].properties.NAME!="Guam"){
          ddlCustomers.options.add(option);
      }
    }
    document.getElementById("ddlCustomers").value = "36";
    
   $('select').on("change",function(){
      // console.log(this.value)
       if(this.value=="C48"){
        //   console.log("ok")
        //   zoomToBounds(map)
          var filter = ["!=","stateAbbr"," "]
          map.setFilter("counties",filter)
           // map.flyTo({
 //               zoom:3.8,
 //               center: [-94,37],
 //               speed: 0.8, // make the flying slow
 //               curve: 1
 //               //essential: true // this animation is considered essential with respect to prefers-reduced-motion
 //           });
         currentState="C48"
       }else if(this.value=="02"){
           map.flyTo({
               zoom:4,
               center: [-147.653,63.739]//,
               // speed: 0.8, // make the flying slow
     //           curve: 1
               //essential: true // this animation is considered essential with respect to prefers-reduced-motion
           });
           currentState="AK"
       }
       else{
           var coords = boundsDict[this.value]
           //console.log(coords)
           var bounds =  new mapboxgl.LngLatBounds(coords);
           map.fitBounds(bounds,{padding:200},{bearing:0})
           var state_tiger_dict = {'01':'AL','02':'AK','04':'AZ','05':'AR','06':'CA','08':'CO','09':'CT','10':'DE','11':'DC','12':'FL','13':'GA','15':'HI','16':'ID','17':'IL','18':'IN','19':'IA','20':'KS','21':'KY','22':'LA','23':'ME','24':'MD','25':'MA','26':'MI','27':'MN','28':'MS','29':'MO','30':'MT','31':'NE','32':'NV','33':'NH','34':'NJ','35':'NM','36':'NY','37':'NC','38':'ND','39':'OH','40':'OK','41':'OR','42':'PA','44':'RI','45':'SC','46':'SD','47':'TN','48':'TX','49':'UT','50':'VT','51':'VA','53':'WA','54':'WV','55':'WI','56':'WY','60':'AS','66':'GU','69':'MP','72':'PR','78':'VI'}
           currentState = state_tiger_dict[this.value]
          var filter = ["==","stateAbbr",currentState]
         // map.setFilter("counties",filter)
           filteredToState = currentState
  //    
       }
       
       filteredToState =currentState
       
       setToState(combinedGeojson)
    })
}
function setToState(combinedGeojson){
    //le.log(filteredToState)
    config["chapters"][1]["location"]={}
    
    var allLayers = map.getStyle().layers
    for(var i in allLayers){
        var layerId = allLayers[i].id
        if(layerId.split("_")[0]=="most"||layerId.split("_")[0]=="least"){
            map.removeLayer(layerId)
            map.removeSource(layerId)
        }
    }
     //  console.log(map.getStyle().layers)
    
    var stateData = filterDataByState(combinedGeojson)
        var mostLeast = calculateMostLeast(stateData)
        var mostLeastVariance = calculateVariance(stateData)    
        var mostLeastFrequency = calculateMostLeasetFrequency(mostLeast)
    
    var introDescription = {
          "Medicaid_capita":"Vulnerability is also reflected by the number of residents enrolled in Medicaid, a means-tested health insurance program with eligibility largely determined by income. The enrollment criteria share some factors with SVI*, such as income, household composition, disability, and employment status.",
          "Unemployment_capita":"As the pandemic has rolled through the United States, unemployment has increased dramatically; this increase is a sign of the economic toll the virus has taken. For many workers in America, health care access is tied to a job. With rising unemployment, many have been left uninsured or underinsured.",
          "SVI": "SVI* calls attention to counties with the greatest number of its highly vulnerable per-capita factors across the four areas of socioeconomic status, household composition and disability, minority status and language, and housing type.",
          "YPLL":"Years of Potential Life Lost (YPLL) represents community-specific health vulnerability in the United States by measuring rates of premature death. Some of the counties that have the state’s highest values for SVI* also have the highest levels of YPLL. But other counties are newly visible as vulnerable.",
            "Covid":"The direct effects of COVID-19 have exacerbated many of the preexisting vulnerabilities in the United States. Sometimes long-term vulnerabilities and the impact of COVID-19 coincide in our maps, but sometimes they do not.",
          "Covid_capita":"Normalizing recent COVID-19 cases by population highlights the less populous counties where large proportions of a community have acquired the virus",
        "Covid_death_capita":"Cumulative COVID-19 deaths normalized by population show places that have had a severe epidemic at any time since March 2020, whether those deaths were recent or occurred months ago."
    }
    
    for(var j in mostLeast){
       // console.log(j)
       // console.log(mostLeast[j])
        var label = j
        var most = mostLeast[j].most
        var least = mostLeast[j].least
        addMarker(least.county,"Lowest: ","least_"+label.replace("Percentile_ranks_",""))
        addMarker(most.county,"Highest: ","most_"+label.replace("Percentile_ranks_",""))
        var existingText = introDescription[label.replace("Percentile_ranks_","")]
        var newText = "<br><br>In "+filteredToState+", <strong>"+pub.fipsToName[least.county]
            +" County</strong>, population "+  numberWithCommas(pub.fipsToPopulation[least.county])+", has the lowest percentile ranking when prioritized according to "
            +measureDisplayTextPop[label.replace("Percentile_ranks_","")]
        +", and <strong>"+pub.fipsToName[most.county]+" County</strong>, population "+numberWithCommas(pub.fipsToPopulation[most.county])+", has the highest."
        d3.select("#"+label.replace("Percentile_ranks_","")).select("p").html(existingText+newText)
    }
    
    if(mostLeastFrequency.length>1){
        var existingText = "Here are the counties that displayed across the most extremes in rankings of vulnerability we mapped."
    }else{
        var existingText = "Here is the county that displayed across the most extremes in rankings of vulnerability we mapped."
    }

    for(var f in mostLeastFrequency){
        mostLeastFrequency[f]
        var county = pub.fipsToName[mostLeastFrequency[f].county]
        existingText+= "<br><br><strong>"+county + " County</strong> is "
        
        for(var c in mostLeastFrequency[f].content){
            if(c ==mostLeastFrequency[f].content.length-1){
                var formattedText = " and "+mostLeastFrequency[f].content[c].ml +" in "
                    +measureDisplayTextPop[mostLeastFrequency[f].content[c].cat.replace("Percentile_ranks_","")]
                    +"."
            }else{
                var formattedText = mostLeastFrequency[f].content[c].ml +" in "
                    +measureDisplayTextPop[mostLeastFrequency[f].content[c].cat.replace("Percentile_ranks_","")]
                    +", "
            }
            existingText+=formattedText
            
        }
        
        
        d3.select("#frequency").select("p").html(existingText)
        
        config["chapters"][config["chapters"].length-1].description=existingText
        
        addMarker(mostLeastFrequency[f].county,"","most_"+f)
        config["chapters"][0]["onChapterEnter"].push({layer:"most_"+f,opacity:0})
        config["chapters"][config["chapters"].length-1]["onChapterEnter"].push({layer:"most_"+f,opacity:1})
        config["chapters"][config["chapters"].length-1]["onChapterExit"].push({layer:"most_"+f,opacity:0})
    }
 //
        addMarker(mostLeastVariance.least.county,"Lowest variance across rankings: ","least_variance")
        addMarker(mostLeastVariance.most.county,"Highest variance across rankings: ","most_variance")
    
    for(var m in measureSet){
        
         map.setFilter(measureSet[m],["==","stateAbbr",filteredToState])
        colorByPriority(map,measureSet[m],measureSet[m])
        
    }
    map.setFilter("variance",["==","stateAbbr",filteredToState])
    map.setFilter("frequency",["==","stateAbbr",filteredToState])
    map.setFilter("selectedStateBase",["==","stateAbbr",filteredToState])
    
    map.setFilter("place-label",["==","iso_3166_2","US-"+filteredToState])
    map.setFilter("place-marker",["==","iso_3166_2","US-"+filteredToState])
    
    
       var chapter1 = d3.select("#start")
}

function placesMenus(map){
    PopulateDropDownList(pub.states.features,map)
   // var places = ["Contiguous 48","Alaska","Hawaii","Puerto_Rico"]
    // var places = ["Contiguous 48"]
 //    var coords = {
 //        "Contiguous 48":{coord:[37,-93],zoom:4},
 //        "Alaska":{coord:[63.739,-147.653],zoom:4},
 //        "Hawaii":{coord:[20.524,-157.063],zoom:7.1},
 //        "Puerto_Rico":{coord:[18.219,-66.338],zoom:8}
 //    }
 //
 //    for (var i = 0; i < places.length; i++) {
 //        var id = places[i];
 //        var link = document.createElement('a');
 //        link.href = '#';
 //        link.className = 'placesLink';
 //        link.textContent = id.split("_").join(" ");
 //        link.id =id;
 //
 //        link.onclick = function(e) {
 //            var id = d3.select(this).attr("id")
 //            var coord = coords[id].coord
 //            var zoom = coords[id].zoom
 //            map.flyTo({
 //                zoom: zoom,
 //            center: [
 //           coord[1] ,
 //            coord[0]
 //            ],
 //            speed: 0.8, // make the flying slow
 //            curve: 1
 //            //essential: true // this animation is considered essential with respect to prefers-reduced-motion
 //            });
 //        };
 //
 //        var layers = document.getElementById('placesMenu');
 //        layers.appendChild(link);
 //    }
}

function toggleLayers(map){
    // enumerate ids of the layers
   // var toggleableLayerIds = ['aiannh', 'prison','mapbox-satellite',"tract_svi"];
    var toggleableLayerIds = ['mapbox-satellite'];

    // set up the corresponding toggle button for each layer
    for (var i = 0; i < toggleableLayerIds.length; i++) {
        var id = toggleableLayerIds[i];

        var link = document.createElement('a');
        link.href = '#';
        link.className = 'active';
        link.textContent = "Satellite Only"
        link.id = id;
        
        link.onclick = function(e) {//TODO toggle click 
              
              
         
            var clickedLayer = this.id;
            e.preventDefault();
            e.stopPropagation();

            var visibility = map.getLayoutProperty(clickedLayer, 'visibility');

            // toggle layer visibility by changing the layout object's visibility property
            if (visibility === 'visible') {
              map.setPaintProperty("county-centroids-dnxdon", 'text-color',"#000000")
                map.setLayoutProperty(clickedLayer, 'visibility', 'none');
                d3.select(this).style("background-color","white")
                link.textContent = "Satellite Only"
                this.className = '';
            } else {
              map.setPaintProperty("county-centroids-dnxdon", 'text-color',"#ffffff")
                this.className = 'active';
                map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
                    d3.select(this).style("background-color","yellow")
               link.textContent = "Hide Satellite"
            }
        };

        var layers = document.getElementById('layersMenu');
        layers.appendChild(link);
    }
}
//for crossfilter
function drawTable(ndx,svi){
    var table = new dc.DataTable('#table');
    var tDim = ndx.dimension(function(d){return d["covid_cases"]})
    table
        .dimension(tDim)
        .size(svi.length)
        .order(d3.descending)
        .sortBy(function(d) { return d["covid_cases"]; })
        .showSections(false)
    .columns([
                  {
                      label: 'FIPS',
                      format: function(d) {
                          return d["FIPS"];
                      }
                  },
                  {
                      label: 'STATE',
                      format: function(d) {
                          return d["STATE"];
                      }
                  },
                  {
                      label: 'COUNTY',
                      format: function(d) {
                          return d["COUNTY"];
                      }
                  },
                  {
                      label: 'CASES',
                      format: function(d) {
                          return d["covid_cases"];
                      }
                  },
                  {
                      label: '/100000',
                      format: function(d) {
                          return d["covid_deathsPer100000"];
                      }
                  },
                  {
                      label: 'SVI',
                      format: function(d) {
                          return d["SPL_THEMES"];
                      }
                  },
                  {
                      label: 'SVI%',
                      format: function(d) {
                          return d["RPL_THEMES"];
                      }
                  }
              ]);
          d3.select('#download')
              .attr("cursor","pointer")
              .on('click', function() {
                  //console.log("download")
                  var data = tDim.top(Infinity);
                  if(d3.select('#download-type input:checked').node().value==='table') {
                      data = data.sort(function(a, b) {
                          return table.order()(table.sortBy()(a), table.sortBy()(b));
                      });
                      data = data.map(function(d) {
                          var row = {};
                          table.columns().forEach(function(c) {
                              row[table._doColumnHeaderFormat(c)] = table._doColumnValueFormat(c, d);
                          });
                          return row;
                      });
                  }
                  var blob = new Blob([d3.csvFormat(data)], {type: "text/csv;charset=utf-8"});
                  saveAs(blob, 'data.csv');
              });
}
function scatterPlot(ndx,w,h,x,y,xRange){
  
     d3.select("#scatter").append("div").attr("id",x)
    var scatter =  new dc.ScatterPlot("#"+x)
    var dimension = ndx.dimension(function(d){
        console.log(Object.keys(d))
        return [d[x],d[y]]
    })
    var group = dimension.group()
    scatter.width(w)
          .useCanvas(true)
        .height(h)
        .group(group)
        .dimension(dimension)
    .x(d3.scaleLinear().domain([-.01, xRange]))
    .y(d3.scaleLinear().domain([0, 35000]))
    .xAxisLabel(x)
    .yAxisLabel("Cases Per 100,000")
    .excludedOpacity(0.5)
    .colors(["#000000"])
    .on("filtered",function(){
        onFiltered(dimension.top(Infinity))
    })
}
function formatCovid(covid,svi){
   // console.log(covid)
    
    var covidByCounty = {}
    for (var i in svi){
        var gid = "_"+svi[i].FIPS
        covidByCounty[gid]=[]
    }
    var other = []
    for(var c in covid){
        var cases = covid[c].cases
        var fips = "_"+covid[c].fips
        var deaths = covid[c].deaths
        var date = covid[c].date
        if(fips==""||fips=="unkown"||covidByCounty[fips]==undefined){
            if(other.indexOf(covid[c].county)==-1){
                other.push(covid[c].county)
            }
        }else{
            covidByCounty[fips][date]={date:date,fips:fips,cases:cases,deaths:deaths}
        }
    }
    
    return covidByCounty
    
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
function formatDate(date){
            var d = new Date(date)
            var ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d)
            var mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d)
            var da = ("0"+d.getUTCDate()).slice(-2)
    
            var formattedDate = ye+"-"+mo+"-"+da    
            return formattedDate
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
function onFiltered(data){
    var gids =[]
    var pop = 0
    var hu = 0
    var area = 0
    var deaths = 0
    var cases = 0
    
    for(var d in data){
        gids.push(data[d].FIPS)
        pop+=parseInt(data[d].E_TOTPOP)
        area+=parseInt(data[d].AREA_SQMI)
        hu+=parseInt(data[d].E_HU)
        cases+=parseInt(data[d]["covid_cases"])
        deaths+=parseInt(data[d]["covid_deaths"])
        
    }
    d3.select("#population").html("Containing "+numberWithCommas(pop)
        +" people <br>"+numberWithCommas(hu)+" households <br> in "+numberWithCommas(area)
        +" square miles <br>"
        +numberWithCommas(cases)+" cases <br>"
        +numberWithCommas(deaths)+" deaths")
    
    formatFilteredData(data)
    filterMap(gids)
}
function formatFilteredData(data){
    //console.log(data)
    var formatted = ""
    
}
function filterMap(gids){
  //  console.log(gids)
  var filter = ['in',["get",'FIPS'],["literal",gids]];
	map.setFilter("counties",filter)
}
function barChart(divName, column,ndx,height,width){
    var max = 0
    var min = 0

    var columnDimension = ndx.dimension(function (d) {
        if(parseFloat(d[column])>max){
            max = parseFloat(d[column])
        } 
        return parseFloat(d[column])
    });
  
   //   console.log([max,min])

    var columnGroup = columnDimension.group();
        
    //var divName = column.split("_")[1]
    
    var color = colors[divName]
    
    var barDiv = d3.select("#"+divName).append("div").attr("id",column).style("width",width+"px").style("height",(height+30)+"px")
    
    d3.select("#"+column).append("text").attr("class","reset")
        .on("click",function(){
            chart.filterAll();
            dc.redrawAll();
        })
        .style("display","none")
        .text("reset")
        .attr("cursor","pointer")
    
    barDiv.append("span").attr("class","reset")
    barDiv.append("span").attr("class","filter")

    var chart = dc.barChart("#"+column);
    chart.on("filtered",function(){
        onFiltered(columnDimension.top(Infinity))
    })
    
    d3.select("#"+column).append("div").attr("class","chartName").html(themesDefinitions[column]).style("color",color)
        d3.select("#"+divName).style("color",color)
    
    chart.width(width)
            .height(height)
            .margins({top: 10, right: 20, bottom: 30, left: 40})
            .dimension(columnDimension)
            .group(columnGroup)
          // .centerBar(true)
            .gap(0)
            .elasticY(true)
            .xUnits(function(){return Math.abs(Math.round(max-min))*100;})
            .x(d3.scaleLinear().domain([min,max]))
            .xAxis()
            .ticks(10)
        
        chart.yAxis()
            .ticks(2);
      chart.on("preRedraw", function (chart) {
          chart.rescale();
      });
      chart.on("preRender", function (chart) {
          chart.rescale();
      });		
}
function rowChart(divName,column, ndx,height,width,topQ,color){
    d3.select("#"+divName).style("width",width+"px").style("height",height+"px")
    var chart = dc.rowChart("#"+divName);

    var columnDimension = ndx.dimension(function (d) {
        return d[column];
    });
    var columnGroup = columnDimension.group();
    chart.on("filtered",function(){
        onFiltered(columnDimension.top(Infinity))
       // moveMap(columnDimension.top(Infinity))
    })
    chart.width(width)
        .height(height)
        .margins({top: 0, left: 250, right: 10, bottom: 20})
        .group(columnGroup)
        .dimension(columnDimension)
    	.labelOffsetX(-240)
    	.labelOffsetY(12)
    	//.data(function(agencyGroup){return columnGroup.top(topQ)})
    	.ordering(function(d){ return -d.value })
        .ordinalColors([color])
        .label(function (d) {
            return d.key+": "+ d.value+ " counties";
        })
        // title sets the row text
        .title(function (d) {
            return d.value;
        })
        .gap(2)
        .elasticX(true)
        .xAxis().ticks(4)
}
function dataCount(dimension,group){
    dc.dataCount(".dc-data-count")
        .dimension(dimension)
        .group(group)
        // (optional) html, for setting different html for some records and all records.
        // .html replaces everything in the anchor with the html given using the following function.
        // %filter-count and %total-count are replaced with the values obtained.
        .html({
            some:"%filter-count selected out of <strong>%total-count</strong> counties | <a href='javascript:dc.filterAll(); dc.renderAll();''>Reset All</a>",
            all:"All  %total-count counties selected."
        })
        
}

//#### Version
//Determine the current version of dc with `dc.version`
d3.selectAll("#version").text(dc.version);
