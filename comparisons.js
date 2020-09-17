$(document).ready(function() {
    $('.js-example-basic-single').select2();
});

var possibleStartStates = ["CA","LA","FL","NY","MT","TX"]
var randomStartState = possibleStartStates[Math.round(Math.random()*possibleStartStates.length-1)]

//"F_THEME1","F_THEME2", "F_THEME3", "F_THEME4"
var map;
var ndx;
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
var currentCapacity = 30
var pub = {
    coverage:"base_case_capacity_"+currentCapacity,
    aiannh:false,
    prison:false,
    satellite:false,
    tract_svi:false,
    all:null,
    noGeo:null,
    onlyGeo:null,
    centroids:null,
    histo:null,
    pair:"SVIXXXCovid_capita",
    states:null,
    countyHighlighted:null,
    fluctuation:false,
    overallMaxFluctuation:0,
    showRangeOnly:false,
    bounds:null,
    startState:randomStartState,
    stateAllocations:null,
    currentState:randomStartState,
    dataByState:null
}
var stateAllocationPercentMaxMin = {}

var highlightColor = "#DF6D2A"
var bghighlightColor = "gold"
var outlineColor = "#DF6D2A"

var minCoverage = 10
var maxCoverage = 80
var coverageInterval = 10

var colorEnd = "#6FAFC4"
var colorStart = "#604F23"
// var keyColors = {high_demand:"#EA00FF",SVI_hotspot:"#F45180",SVI_pop:"#45B6A3",hotspot:"#7E6EFF",SVI_high_demand:"#71BF4D"}


var keyColors = {
    SVI:"#6b68d6",
    Covid_death_capita:"#5eb24c",
    YPLL:"#b5a533",
    Unemployment:"#d2762e",
    Covid_capita:"#d5453e",
    
    Covid:"#6fac38",
    Medicaid_demand:"red",
    
    YPLL_med:"#569f3d",
    Unemployment_med:"#bec23f",
    Covid_med:"#cb983f",
    Covid_capita_med:"#e8b72b"
}


var keyColors = {
    SVI:"#FF9F00",
    YPLL:"#A2D352",
    Unemployment:"#17DCFF",
    Covid_capita:"#7E6EFF",
    Covid_death_capita:"#E400FF",
    Medicaid_demand:"#00D200",    
     Covid:"#FF0066"
}




 var measureSet = [
    // "medicaid_demand",
      "Medicaid_demand",
     "SVI",
     "YPLL",
     "Unemployment",
    "Covid",
     "Covid_capita",
     "Covid_death_capita"
]

var measureDisplayText = {
     Proportional_allocation_to_Medicaid_demand:"MEDICAID ENROLLEES",
     Proportional_allocation_to_SVI:"SVI",
     Proportional_allocation_to_YPLL:"YPLL",
     Proportional_allocation_to_Unemployment:"UNEMPLOYMENT",
     Proportional_allocation_to_Covid:"COVID CASES (14 DAYS)",
     Proportional_allocation_to_Covid_capita:"COVID CASES / 100K",
     Proportional_allocation_to_Covid_death_capita:"COVID DEATHS / 100K"
   
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

var countyCentroids = d3.json("county_centroids.geojson")
var counties = d3.json("counties.geojson")
//var aiannh = d3.json("indian_reservations.geojson")
var allData = d3.csv("County_level_proportional_allocation_for_all_policies.csv")
var timeStamp = d3.csv("https://raw.githubusercontent.com/CenterForSpatialResearch/allocation_chw/master/Output/time_stamp.csv")
var states = d3.json("simplestates.geojson")
var carto= d3.json("cartogram.geojson")
var stateAllocations = d3.csv("state_level_allocation.csv")
var coverageSet = []
var coverageDisplayText = {show_all:"Hide Coverage Info"}
for(var c = 1; c<=8; c++){
    var setTerm = "base_case_capacity_"+c*10
     coverageSet.push(setTerm)
    coverageDisplayText[setTerm] = c*10+' CHW per 100,000 residents'
 }

Promise.all([counties,countyCentroids,allData,timeStamp,states,carto,stateAllocations])
.then(function(data){
    ready(data[0],data[1],data[2],data[3],data[4],data[5],data[6])
})

var lineOpacity = {stops:[[0,1],[100,0.3]]}
var lineWeight = {stops:[[-1,0],[-0.01,0],[0,2],[99,.5],[100,0]]}

var fillColor = {
        property:null,
        stops:[
            [0,"#A7DCDF"],
            [.005,"#6EAFC3"],
            [.03,"#3983A8"],
            [.1,"#02568B"]]
}

var centroids = null
var latestDate = null

function ready(counties,centroids,modelData,timeStamp,states,carto,stateAllocations){
    pub.states = states
    d3.select("#date").html("Model run as of "+timeStamp["columns"][1])
    
    var processed = turnToDictFIPS(modelData,"County_FIPS")
    var comparisonsKeys = processed[1]
   // console.log(comparisonsKeys)
    var dataByFIPS = processed[0]
    pub.noGeo = dataByFIPS
    var combinedGeojson = combineGeojson(dataByFIPS,counties)
    
   pub.dataByState = dataByState(combinedGeojson.features)
    
    
    pub.onlyGeo = turnToDictFIPS(counties.features,"id")[0]
    pub.all = combinedGeojson
    drawMap(combinedGeojson,comparisonsKeys)
  
    ndx = crossfilter(modelData);
    var all = ndx.groupAll();  
   // scatterPlot(ndx,"Proportional_allocation_to_"+pub.pair.split("XXX")[0],"Proportional_allocation_to_"+pub.pair.split("XXX")[1],1000)
  
  
    cartogram(carto,stateAllocations)
  
};
function dataByState(data){
    var formatted = {}
    for(var i in data){
        var state = data[i].properties.stateAbbr
        var values =data[i].properties
        if(Object.keys(formatted).indexOf(state)==-1){
            formatted[state]=[]
            formatted[state].push(values)
        }else{
            formatted[state].push(values)
        }
    }
    return formatted
}


function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
//var comparisonsSet = []
function turnToDictFIPS(data,keyColumn){
    var overallMax = 0

    var newDict = {}
    var maxPriority = 0
    var keys = Object.keys(data[0])

    for(var i in data){
        var key = String(data[i][keyColumn])
        if(key.length==4){
            key= String("0"+key)
        }
        var min= 9999
        var max= 0    
        var minKey = null
        var maxKey = "test"
        
        var newKeys = []
        newDict[key]=data[i]
            // var values = data[i]
            for(var j in measureSet){
                var k1 = ("Proportional_allocation_to_"+measureSet[j])
                var v1 = Math.ceil(parseFloat(data[i][k1]))
                
                if(v1>max){max = v1; maxKey = k1;}
                if(v1<min){min = v1; minKey = k1;}
                
                newDict[key][k1]=v1
                for(var k in measureSet){
                    var k2 =("Proportional_allocation_to_"+measureSet[k])
                    var v2 = Math.ceil(parseFloat(data[i][k2]))
                    var index1 = j
                    var index2 = k
                    if(index1!=index2){
                        if(index1<index2){
                                var compareKey = "compare_"+k1.replace("Proportional_allocation_to_","")+"XXX"+k2.replace("Proportional_allocation_to_","")
                              
                                    newDict[key][compareKey]=v1-v2
                            
                                if(newKeys.indexOf(compareKey)==-1){
                                    newKeys.push(compareKey)                            
                                }
                            }else{
                                var compareKey = "compare_"+k2.replace("Proportional_allocation_to_","")+"XXX"+k1.replace("Proportional_allocation_to_","")
                                newDict[key][compareKey]=v2-v1
                                if(newKeys.indexOf(compareKey)==-1){
                                    newKeys.push(compareKey)                            
                                }
                            }
                    }
            }
        }
         if(max>overallMax){
           overallMax = max
          // overallMaxId = data[i]
       }
        var range = max-min
        newDict[key]["range"]=range
        newDict[key]["max"]=max
        newDict[key]["min"]=min
        newDict[key]["maxKey"]=maxKey
        newDict[key]["minKey"]=minKey
    }
     pub.overallMaxFluctuation = overallMax
    var comparisonsSet = newKeys   
   // console.log(newDict)
    return [newDict,comparisonsSet]
}

function combineGeojson(all,counties){
    for(var c in counties.features){
        var countyFIPS = counties.features[c].properties.FIPS        
        var data = all[countyFIPS]
       // console.log(data)
        counties.features[c]["id"]=countyFIPS
        
        if(data!=undefined){            
            var keys = Object.keys(data)
            for(var k in keys){
                var key = keys[k]
                if(isNaN(value)==true){
                     var value = data[key]
                 }else{
                     var value = parseFloat(data[key])
                 }
                counties.features[c].properties[key]=value
            }
        }
    }
  //  console.log(counties)
    return counties
}

function drawGrid(map,comparisonsSet){
    var drawn = []
    var svg = d3.select("#comparisonGrid").append("svg").attr("width",290).attr("height",220)
    var gridSize = 15
    for(var i in measureSet){
            var x = i*gridSize+140
            var y = 115
                svg.append("text")
                .text(measureDisplayText["Proportional_allocation_to_"+measureSet[i]])
                .attr("x",x)
                .attr("y",y)
                .attr("transform","rotate(-90 "+x+","+y+")")
                .attr("fill",keyColors[measureSet[i]])
        
        for(var j in measureSet){
            if(i==0){
                svg.append("text")
                .text(measureDisplayText["Proportional_allocation_to_"+measureSet[j]])
                .attr("x",i)
                .attr("y",j*gridSize+gridSize/2)
                .attr("transform","translate(125,120)")
                .attr("text-anchor","end")
                .attr("fill",keyColors[measureSet[j]])
            }
            
            if(j!=i){
                if(i<j){
                    var key = "compare_"+measureSet[i]
                    +"XXX"+measureSet[j]
                }else{
                    var key = "compare_"+measureSet[j]
                    +"XXX"+measureSet[i]
                }
                if(comparisonsSet.indexOf(key)>-1 && drawn.indexOf(key)==-1){
                    svg.append("rect")
                        .attr("width",gridSize-3)
                        .attr("height",gridSize-3)
                        .attr("x",gridSize*j)
                        .attr("y",gridSize*i)
                        .attr("id",key.replace("compare_",""))
                        .attr("class","grid")
                        .attr("transform","translate(130,120)")
                        .attr("cursor","pointer")
                        .on("click",function(){
                          //  console.log("grid click")
                            pub.showRangeOnly = false
                            var id = d3.select(this).attr("id")
                          //  var key = "compare_"+id.split("XXX")[0]+"_"+currentCapacity+"_"+id.split("XXX")[1]+"_"+currentCapacity
                            pub.pair = id
                            colorMap(map,id)
                            d3.selectAll(".grid").attr("fill","black")
                            d3.select(this).attr("fill","gold")
                            
                            drawKey(d3.select(this).attr("id"))
                          //  console.log("scatter")
                            
                            d3.select("#comparisonPlot svg").remove()
                            var x = "Proportional_allocation_to_"+id.split("XXX")[0]
                            var y = "Proportional_allocation_to_"+id.split("XXX")[1]
                             //dc.filterAll();
                            // scatterPlot(ndx,x,y,1)
                             newScatterPlot(pub.currentState)
  // 
                            
                        })
                        drawn.push(key)
                    }else{
                    svg.append("rect")
                        .attr("width",gridSize-6)
                        .attr("height",gridSize-6)
                        .attr("x",gridSize*j)
                        .attr("y",gridSize*i)
                        .attr("transform","translate(132,120)")
                        .attr("fill","none")
                        .attr("stroke","#ddd")
                        .attr("stroke-width",.5)
                    }
            }else{
                    svg.append("rect")
                        .attr("width",gridSize-6)
                        .attr("height",gridSize-6)
                        .attr("x",gridSize*j)
                        .attr("y",gridSize*i)
                        .attr("transform","translate(132,120)")
                        .attr("fill","none")

                        .attr("stroke","#ddd")
                        .attr("stroke-width",.5)
            }
        }
    }
}
function drawKey(key){
    d3.select("#comparisonKey svg").remove()
    var width = 270
    // compare_percentage_scenario_
  //   high_demand
  //   _base_case_capacity_30_percentage_scenario_
  //   SVI_pop
  //   _base_case_capacity_30
    var k1 = key.split("XXX")[0]//.replace("_base_case_capacity_"+currentCapacity,"")
    var k2 = key.split("XXX")[1]//.replace("_base_case_capacity_"+currentCapacity,"")
   // console.log([k1,k2])
    var svg = d3.select("#comparisonKey").append("svg")
        .attr("width",width).attr('height',50)
    var defs = svg.append("defs");
    var gradient = defs.append("linearGradient")
       .attr("id", "svgGradient")
       .attr("x1", "0%")
       .attr("x2", "100%")
       .attr("y1", "0%")
       .attr("y2", "0%");

    gradient.append("stop")
       .attr('class', 'start')
       .attr("offset", "0%")
       .attr("stop-color", keyColors[k1])
       .attr("stop-opacity", 1);

    gradient.append("stop")
       .attr('class', 'end')
       .attr("offset", "40%")
       .attr("stop-color", "#ddd")
       .attr("stop-opacity", 1);
    gradient.append("stop")
       .attr('class', 'end')
       .attr("offset", "60%")
       .attr("stop-color", "#ddd")
       .attr("stop-opacity", 1);
    gradient.append("stop")
       .attr('class', 'end')
       .attr("offset", "100%")
       .attr("stop-color", keyColors[k2])
       .attr("stop-opacity", 1);
       
    svg.append("text").text("More workers allocated with".toUpperCase()).attr("y",10).attr("x",20)
       .attr("fill","#000").style("font-size","12px").style("font-weight","bold")
    //
    // svg.append("text").text("More workers by".toUpperCase()).attr("y",1).attr("x",width)
    //    .attr("fill","#000").style("font-size","12px").attr("text-anchor","end").style("font-weight","bold").attr("fill",keyColors[k2])
    svg.append("text").text("no difference".toUpperCase()).attr("y",75).attr("x",width/2)
   .attr("text-anchor","middle").style("font-size","12px")
   .style("font-weight","bold")
    svg.append("rect")
    .attr("class","key")
    .attr('width',width)
    .attr('height',13)
    .attr("x",20)
    .attr("y",15)
    .attr("fill","url(#svgGradient)")
       .attr("stroke","rgba(0,0,0,.5)")
       .attr("stroke-width",.1)

svg.append("text").text(measureDisplayText["Proportional_allocation_to_"+k1].toUpperCase()).attr("y",40).attr("x",20).style("font-size","12px").style("font-weight","bold").attr("fill",keyColors[k1])//.attr("fill",keyColors[k1])
    svg.append("text").text(measureDisplayText["Proportional_allocation_to_"+k2].toUpperCase()).attr("y",40).attr("x",width).style("font-size","12px").style("font-weight","bold").attr("text-anchor","end").attr("fill",keyColors[k2])//.attr("fill",keyColors[k2])
       
 //
// svg.append("rect").attr("width",20).attr("height",20).attr("x",20).attr("y",90).attr("fill","#ddd")
// svg.append("text").attr("x",45).attr("y",103).text("Counties with no recorded cases")
//
    
}
function drawRangeKey(){
    d3.select("#comparisonKey svg").remove()
    var width = 270
    
    var svg = d3.select("#comparisonKey").append("svg")
        .attr("width",width).attr('height',120)
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
       .attr("stop-color", "white")
       .attr("stop-opacity", 1);
       
    gradient.append("stop")
       .attr('class', 'end')
       .attr("offset", "100%")
       .attr("stop-color", "red")
       .attr("stop-opacity", 1);
       
    svg.append("text").text("differences").attr("y",18).attr("x",20)
       .attr("fill","#000").style("font-size","12px").style("font-weight","bold")//.attr("fill",keyColors[k1])
       
    svg.append("rect")
    .attr("class","key")
    .attr('width',width)
    .attr('height',10)
    .attr("x",20)
    .attr("y",50)
    .attr("fill","url(#svgGradient)")
       .attr("stroke","rgba(0,0,0,.5)")
       .attr("stroke-width",.1)
    
}

function colorMapByRange(map){
    var color = {property:"range",stops:[[0,"#fff"],[pub.overallMaxFluctuation,"red"]]}
    map.setPaintProperty("counties", 'fill-color', color)
    pub.showRangeOnly=true    
    drawRangeKey()
}
function colorMap(map,key){
    //console.log(key)
   // console.log(currentCapacity)
    var measureStart = key.split("XXX")[0]
    var measureEnd = key.split("XXX")[1]
    
    //console.log([measureEnd,measureStart])
    
    var colorStart = keyColors[measureStart]
    var colorEnd = keyColors[measureEnd]
  //  console.log(colorStart)
    
    var rangeExtent = d3.extent(pub.dataByState[pub.currentState].map(function(d){return d["compare_"+pub.pair]}))
    
 //
    var dataProperty = "compare_"+key
    var color = {property:dataProperty,stops:[[rangeExtent[0],colorStart],[0,"#ddd"],[rangeExtent[1],colorEnd]]}
    map.setPaintProperty("counties", 'fill-color', color)
    
}
function drawMap(data,comparisonsKeys){
//	mapboxgl.accessToken = 'pk.eyJ1Ijoic2lkbCIsImEiOiJkOGM1ZDc0ZTc5NGY0ZGM4MmNkNWIyMmIzNDBkMmZkNiJ9.Qn36nbIqgMc4V0KEhb4iEw';    
    mapboxgl.accessToken = "pk.eyJ1IjoiYzRzci1nc2FwcCIsImEiOiJja2J0ajRtNzMwOHBnMnNvNnM3Ymw5MnJzIn0.fsTNczOFZG8Ik3EtO9LdNQ"//new account
var maxBounds = [
[-190,8], // Southwest coordinates
[-20, 74] // Northeast coordinates
];
    var bounds = [[-130, 26], 
         [-40, 50]
     ]
 
 d3.select("#map").style("width",window.innerWidth+"px")
          .style("height",window.innerHeight+"px")
    map = new mapboxgl.Map({
        container: 'map',
        style:"mapbox://styles/c4sr-gsapp/ckcnnqpsa2rxx1hp4fhb1j357",//dare2
        //   style:"mapbox://styles/c4sr-gsapp/cke1jg963001c19mayxz2tayb",//newest with cropping
        maxZoom:8,
        bounds:bounds,
        zoom: 3.8,
        preserveDrawingBuffer: true,
        minZoom:5,
        maxBounds: maxBounds    
    });
    
    // d3.select("#backToNational")
 //    .style("cursor","pointer")
 //    .on("click",function(){
 //        zoomToBounds(map)
 //        var filter = ["!=","stateAbbr",""]
 //        map.setFilter("counties",filter)
 //        document.getElementById("ddlCustomers").value = "Contiguous 48"
 //        document.getElementById("ddlCustomers").id = "Contiguous 48"
 //        d3.select("#backToNational").style("visibility","hidden")
 //    })
    
    d3.select("#fluctuation")
    .on("click",function(){
        colorMapByRange(map)
        fluctuation = true
    })
    
     map.on("load",function(){                 
         zoomToBounds(map)
         map.addControl(new mapboxgl.NavigationControl(),'bottom-right');
         
         //map.setLayoutProperty("mapbox-satellite", 'visibility', 'none');
         map.addSource("counties",{
             "type":"geojson",
             "data":data
         })
         
         map.addLayer({
             'id': 'county_outline',
             'type': 'line',
             'source': 'counties',
             'paint': {
                 'line-color':[
                    'case',
                    ['boolean', ['feature-state', 'hover'], false],
                    "#ffffff",
                    "#ffffff"
                 ],
                 'line-opacity':[
                    'case',
                    ['boolean', ['feature-state', 'hover'], false],
                    1,
                    1
                 ],
                 'line-width':[
                    'case',
                    ['boolean', ['feature-state', 'hover'], false],
                    6,
                    1
                 ]
             },
             
             'filter': ['==', '$type', 'Polygon']
         },"ST-OUTLINE");
               //    },"country-label");
         map.addLayer({
             'id': 'counties',
             'type': 'fill',
             'source': 'counties',
             'paint': {
             'fill-color': "#fff",
                 'fill-opacity':.05
             },
             'filter': ['==', '$type', 'Polygon']
         },"county_outline");
         
         
         drawGrid(map,comparisonsKeys)
         coverageMenu(map)
         colorMap(map,pub.pair)
         d3.select("#"+pub.pair).attr("fill","gold")
         drawKey(pub.pair)
         PopulateDropDownList(pub.states.features,map) 
        var filter = ["!=","percentage_scenario_SVI_hotspot_base_case_capacity_"+currentCapacity,-1]
         map.setFilter("counties",filter)
         map.setPaintProperty("counties", 'fill-opacity',1)
         
            cartoGoToState(pub.startState)
           newScatterPlot(pub.startState)
           // map.setFilter("county-name",["==","STATEFP","06"])
  //          map.setFilter("state-abbr",["==","STATEFP","06"])
  //          map.setFilter("reservation-name",["==","STATE",pub.startState])
            map.setFilter("state_mask",["==","STATEFP","a"])
  //          map.setFilter("state_mask_outline",["==","STATEFP","06"])
        
            d3.selectAll(".hex").attr("opacity",0.5)
            d3.select("."+pub.startState+"_hex").attr("opacity",1)
         
  
     })

    
     var popup = new mapboxgl.Popup({
         closeButton: false,
         closeOnClick: false
     });     
      var hoveredStateId = null;
     
     var firstMove = true
      
     map.on('mousemove', 'counties', function(e) {
         var feature = e.features[0]
         map.getCanvas().style.cursor = 'pointer'; 
         if(feature["properties"].FIPS!=undefined){
           //  console.log(feature["properties"])
                 if(pub.countyHighlighted==null){
                     pub.countyHighlighted = feature["properties"]["County_FIPS"]
                 }
                 if(feature["properties"]["County_FIPS"] != pub.countyHighlighted){
             
                 if (hoveredStateId) {
                 map.setFeatureState(
                 { source: 'counties', id: hoveredStateId },
                 { hover: false }
                 );
                 }
                 hoveredStateId = e.features[0].id;
                 d3.selectAll(".scatterCircle").attr("stroke","none")
                 d3.select("#scatter_"+e.features[0].properties.FIPS).attr("stroke","black")
                 map.setFeatureState(
                 { source: 'counties', id: hoveredStateId },
                 { hover: true }
                 );
             
                 var x = event.clientX;     // Get the horizontal coordinate
                 var y = event.clientY;             
             
                 var x = event.clientX+20;     // Get the horizontal coordinate
                 var y = event.clientY+20;             
                 var w = window.innerWidth;
                 var h = window.innerHeight;
                 if(x+200>w){
                     x = x-280
                 }
                 if(y+300>h){
                     y= y-320
                 }
                  d3.select("#mapPopupCompare").style("visibility","visible")
                  .style("left",x+"px")
                  .style("top",(y+20)+"px") 
             
                 var countyName = feature["properties"]["county"]+" County, "+feature["properties"]["stateAbbr"]
                 var population = feature["properties"]["totalPopulation"]
                 var geometry = feature["geometry"]
                 var countyId = feature["properties"]["FIPS"]
                 var key1 = "Proportional_allocation_to_"+pub.pair.split("XXX")[0]
                 var value1 = Math.ceil(parseFloat(feature["properties"][key1]))
                 var key2 = "Proportional_allocation_to_"+pub.pair.split("XXX")[1]
                 var value2 = Math.ceil(parseFloat(feature["properties"][key2]))
                 var dif = numberWithCommas(Math.abs(value1-value2))
                 
                 var comparisonString = ""
                 
                 if(pub.showRangeOnly==true){
                     var range = feature.properties["range"]
                     var displayString = 
                     "<span style = \"font-size:16px;\">"
                     +"<strong>"+countyName
                     +"</span>"
                     +"</strong><br><strong>Population:</strong> "+population+"<br>"+"<br><strong>"
                     +"Allocating by "+ measureDisplayText[feature.properties.maxKey]+" results in the most workers: "+ feature.properties.max
                     +"<br><br>Allocating by "+  measureDisplayText[feature.properties.minKey]+" results in the least workers: "+feature.properties.min
                     +"<br><br>Difference: "+feature.properties.range
                     
                     var max = 0
                     var min = 999
                     for(var m in measureSet){
                         var key = measureSet[m]
                         var value = feature.properties[measureSet[m]]
                         if(value>max){max=value}
                         if(value<min){min = value}
                     }
                     
                 }
                 
                 else{
                     
                
                     
                     if(value1>value2){
                         comparisonString = dif+" more CHWs by "+measureDisplayText[key1]+ " than by "+ measureDisplayText[key2]
                         
                     
                     }else if(value1<value2){
                         comparisonString = dif+" more CHWs by "+measureDisplayText[key2]+ " than by "+ measureDisplayText[key1]
                        
                     
                     }else{
                         comparisonString = "Prioritizing by "
                         +measureDisplayText[key1]
                         +" and "+measureDisplayText[key2]
                          +" allocates the same amount of workers to this county."
                     }
             
                     var displayString = 
                     "<span style = \"font-size:16px;\">"
                     +"<strong>"+countyName
                     +"</span>"
                     +"</strong><br><strong>Population:</strong> "+numberWithCommas(population)+"<br>"+"<br><strong>"
                     +measureDisplayText[key1]+": <span class=\"popupTitle\">"+numberWithCommas(value1)+"</span><br>"
                     +measureDisplayText[key2]+": <span class=\"popupTitle\">"+numberWithCommas(value2)+"</span><br>"
                     +"Difference: "+comparisonString
                     
                     
                     
                     var chartData = []
                      for(var p in measureSet){
                          var pk = "Proportional_allocation_to_"+measureSet[p]
                          var pv = feature["properties"][pk]
                          chartData.push({axis:pk,value:pv})
                      }
                 }
                 d3.select("#mapPopupCompare").html(displayString)
              }
         }       
         
         map.on("mouseleave",'counties',function(e){
             d3.select("#mapPopupCompare").style("visibility","hidden")
             
                 d3.selectAll(".scatterCircle").attr("stroke","none")
             
             map.setFeatureState(
             { source: 'counties', id: hoveredStateId },
             { hover: false }
             );
         })  
     });
    
}
function drawChart(data){
    var min = 9999
    var max = 0
    var minKey = null
    var maxKey = null
    
   // console.log(pub.pair)
    var label =  d3.select("#mapPopupCompare").html()+"<br>"
    
    for(var i in data){
        label += data[i].axis.replace("Proportional_allocation_to_","")+": "+Math.ceil(data[i].value)+"<br>"
        if(data[i].value>max){
            max = Math.ceil(data[i].value)
            maxKey = data[i].axis.replace("Proportional_allocation_to_","")
        }else if(data[i].value<min){
            min = Math.ceil(data[i].value)
            minKey = data[i].axis.replace("Proportional_allocation_to_","")
        }
    }
    var range = Math.round(max-min)
    
    var barHeight = 35
    var xScale = d3.scaleLinear().domain([0,range]).range([2,100])
   // console.log(data)

    d3.select("#mapPopupCompare")
    .html(label
        +"<br>  Prioritizing by <strong>"+maxKey+"</strong> would allocate <strong>"+max+" CHWs</strong>, the most number of workers to the county"
        +"<br> Prioritizing by <strong>"+minKey+"</strong> would allocate <strong>"+min+" CHWs</strong>, the least."
        +"<br> <strong>There is a "+range+" worker difference.</strong>")
       
       
       
    
}
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function coverageMenu(map){
    var w = 250
    var h = 200
    var svg = d3.select("#coverageMenu").append("svg").attr("width",w).attr("height",h)
    var startCoverage = pub.coverage.split("_")[3]
    var coverageDisplay = svg.append("text").text(startCoverage).style("font-size","70px").attr("x",40).attr("y",80)
    var plus = svg.append("text").text("+10").style("font-size","14px").attr("x",130).attr("y",40).style("font-weight","bold")
    .style('cursor',"pointer")
    
    .on("click",function(){
        var newCoverage = parseInt(pub.coverage.split("_")[3])+10
        if(newCoverage>80){
            newCoverage=80
        }
        currentCapacity = newCoverage
        if(newCoverage <=80){
            var key = pub.pair.split(parseInt(pub.coverage.split("_")[3])).join(newCoverage)
            pub.pair = key
            pub.coverage = pub.coverage.replace(pub.coverage.split("_")[3],newCoverage)
            coverageDisplay.text(newCoverage)
            minus.attr("fill","#000")
            colorMap(map,key)
        }
        if(newCoverage==80){
            d3.select(this).attr("fill","#aaa")
        }
        
    })
    
    var minus = svg.append("text").text("-10").style("font-size","14px").attr("x",130).attr("y",80).style("font-weight","bold")
    .style('cursor',"pointer")
        .on("click",function(){
            var newCoverage = parseInt(pub.coverage.split("_")[3])-10
            if(newCoverage<10){
                newCoverage=10
            }
        currentCapacity = newCoverage
            
            if(newCoverage >=10){
                var key = pub.pair
                
                pub.coverage = pub.coverage.replace(pub.coverage.split("_")[3],newCoverage)
                coverageDisplay.text(newCoverage)
                plus.attr("fill","#000")
                colorMap(map,key)
            }
            if(newCoverage==10){
                d3.select(this).attr("fill","#aaa")
            }
        })
    
    svg.append("text").text("CHW per 100,000 residents").style("font-size","12px").attr("x",30).attr("y",120)
  
}
function zoomToBounds(mapS){
    //https://docs.mapbox.com/mapbox-gl-js/example/zoomto-linestring/
    var bounds =  new mapboxgl.LngLatBounds([-155, 20], 
        [-55, 55]);
    map.fitBounds(bounds,{padding:40},{bearing:0})
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
function PopulateDropDownList(features,map) {
           //Build an array containing Customer records.
    var sorted =features.sort(function(a,b){
        return parseInt(a.properties.GEOID) - parseInt(b.properties["GEOID"]);
        
    })          
    var ddlCustomers = document.getElementById("ddlCustomers");
 
    var option = document.createElement("OPTION");
    option.innerHTML = "Contiguous 48"
    option.value = "C48";
        option.id = "Contiguous 48"
    
    ddlCustomers.options.add(option);
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
    
    pub.bounds = boundsDict
    
   $('select').on("change",function(){
      // console.log(this.value)
       if(this.value=="C48"){
        //   console.log("ok")
           zoomToBounds(map)
          // var filter = ["!=","stateAbbr"," "]
  //         map.setFilter("counties",filter)
        //   d3.select("#backToNational").style("visibility","hidden")
           // map.flyTo({
 //               zoom:3.8,
 //               center: [-94,37],
 //               speed: 0.8, // make the flying slow
 //               curve: 1
 //               //essential: true // this animation is considered essential with respect to prefers-reduced-motion
 //           });
       }else if(this.value=="02"){
         //  d3.select("#backToNational").style("visibility","visible")
           
           map.flyTo({
               zoom:4,
               center: [-147.653,63.739]//,
               // speed: 0.8, // make the flying slow
     //           curve: 1
               //essential: true // this animation is considered essential with respect to prefers-reduced-motion
           });
       }
       else{
           var coords = boundsDict[this.value]
           //console.log(coords)
           var bounds =  new mapboxgl.LngLatBounds(coords);
           map.fitBounds(bounds,{padding:60},{bearing:0})
           var state_tiger_dict = {'01':'AL','02':'AK','04':'AZ','05':'AR','06':'CA','08':'CO','09':'CT','10':'DE','11':'DC','12':'FL','13':'GA','15':'HI','16':'ID','17':'IL','18':'IN','19':'IA','20':'KS','21':'KY','22':'LA','23':'ME','24':'MD','25':'MA','26':'MI','27':'MN','28':'MS','29':'MO','30':'MT','31':'NE','32':'NV','33':'NH','34':'NJ','35':'NM','36':'NY','37':'NC','38':'ND','39':'OH','40':'OK','41':'OR','42':'PA','44':'RI','45':'SC','46':'SD','47':'TN','48':'TX','49':'UT','50':'VT','51':'VA','53':'WA','54':'WV','55':'WI','56':'WY','60':'AS','66':'GU','69':'MP','72':'PR','78':'VI'}
          // console.log(this.value)
           var currentState = state_tiger_dict[this.value]
          var filter = ["==","stateAbbr",currentState]
          map.setFilter("counties",filter)
            //  d3.select("#backToNational").style("visibility","visible")

       }
    })
}

function newScatterPlot(state){
    d3.select("#comparisonPlot svg").remove()
    var w = 180
    var h = 140
    var p = 20
    var svg = d3.select("#comparisonPlot").append("svg").attr("width",w+p*5).attr("height",h+p*3)
    var data = pub.dataByState[state]
    
    var xLabel = "Proportional_allocation_to_"+pub.pair.split("XXX")[0]
    var yLabel = "Proportional_allocation_to_"+pub.pair.split("XXX")[1]
    
    var extentX = d3.extent(data.map(function(d){
        return d[xLabel]
    }))
    var extentY = d3.extent(data.map(function(d){
        return d[yLabel]
    }))
    
    var colorStart = keyColors[pub.pair.split("XXX")[0]]
    var colorEnd = keyColors[pub.pair.split("XXX")[1]]
    
    var xScale = d3.scaleLinear().domain([0,extentX[1]]).range([0,w])
    var yScale = d3.scaleLinear().domain([0,extentY[1]]).range([h,0])
    
    var rangeExtent = d3.extent(data.map(function(d){return d["compare_"+pub.pair]}))
    
    var cScale = d3.scaleLinear().domain([rangeExtent[0],0,rangeExtent[1]]).range([colorStart,"#ddd",colorEnd])
    
    var tooltip = d3.select("#comparisonPlot").append("div").attr("class", "toolTip");
    
    svg.append("text").text("CHWs assigned by "+measureDisplayText[xLabel]).attr("x",p*2).attr("y",h+p*3-3)
    .attr("text-anchor","start")
    
    var yLabelX = p/2
    var yLabelY=(h+p*3)/2
    svg.append("text").text("CHWs assigned by "+measureDisplayText[yLabel]).attr("x",yLabelX).attr("y",yLabelY)
    .attr("transform","rotate(-90,"+yLabelX+","+yLabelY+")").attr("text-anchor","middle")
    
    svg.append("text").text("less").attr("x",p*1.8).attr("y",h+p*1.8).attr("text-anchor","start").style("font-style","italic").style("font-weight","bold")
    svg.append("text").text("more").attr("x",w+p*3).attr("y",h+p*1.8).attr("text-anchor","start").style("font-style","italic").style("font-weight","bold")
    
    svg.append("text").text("less").attr("x",p).attr("y",h+p*1.2).attr("text-anchor","start").style("font-style","italic").style("font-weight","bold")
    svg.append("text").text("more").attr("x",p).attr("y",p).attr("text-anchor","start").style("font-style","italic").style("font-weight","bold")
    
    svg.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(yScale).ticks(4))
        .attr("transform","translate("+p*3+","+p+")")
    
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate("+p*3+"," + (h+p) + ")")
        .call(d3.axisBottom(xScale).ticks(2));
    
    svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("r",5)
    .attr("cx",function(d){
        return xScale(d[xLabel])
    })
    .attr("cy",function(d){
        return yScale(d[yLabel])
    })
    .attr("fill",function(d){
        return cScale(d["compare_"+pub.pair])
    })
    .attr("opacity",.8)
    .style("cursor","pointer")
    .attr("class","scatterCircle")
    .attr("id",function(d){return "scatter_"+d.FIPS})
    .attr("transform","translate("+p*3+","+p+")")
    .on("mouseover",function(d){
        
        //console.log(d)
        if(d[xLabel]>d[yLabel]){
            var compareString = (d[xLabel]-d[yLabel])+" more CHWs by "+measureDisplayText[xLabel]+ " than by "+ measureDisplayText[yLabel]
        }else if(d[xLabel]<d[yLabel]){
            var compareString =(d[xLabel]-d[yLabel])+" more CHWs by "+measureDisplayText[yLabel]+ " than by "+ measureDisplayText[xLabel]
        }else{
            var compareString = measureDisplayText[yLabel]+ " and "+ measureDisplayText[xLabel]+ " result in same number of CHWs"
        }
        
        var displayString =" <span class=\"popupTitle\">"+ d.county+" County, "+d.stateAbbr+"</span>"+"<br>"
        +"Poplation: "+d["totalPopulation"]+"<br>"
        +measureDisplayText[xLabel]+":  <span class=\"popupTitle\">"+numberWithCommas(d[xLabel])+"</span> CHWs"+"<br>"
        +measureDisplayText[yLabel]+":  <span class=\"popupTitle\">"+numberWithCommas(d[yLabel])+"</span> CHWs"+"<br>"
        +"Difference: "+compareString
        
      tooltip
      .style("position","absolute")
      .style("padding","5px")
      .style("border","1px solid black")
      .style("background-color","rgba(255,255,255,.9)")
        .style("left", d3.event.pageX - 50 + "px")
        .style("top", d3.event.pageY - 80 + "px")
        .style("visibility", "visible")
        .html(displayString);
        
        
        hoveredStateId = d["FIPS"];
        map.setFeatureState(
        { source: 'counties', id: hoveredStateId },
        { hover: true }
        );
    })
	.on("mouseout", function(d){ 
        tooltip.style("visibility", "hidden");
        map.setFeatureState(
        { source: 'counties', id: hoveredStateId },
        { hover: false }
        );
    });
    
}

function scatterPlot(ndx,x,y,xRange){
    
    var scatter =  new dc.ScatterPlot("#comparisonPlot")
    var dimension = ndx.dimension(function(d){
        return [d[x],d[y]]
    })
    var group = dimension.group()
    scatter.width(250)
          .useCanvas(true)
        .height(250)
        .group(group)
        .dimension(dimension)
    .x(d3.scaleLinear().domain([-1, 5000]))
    .y(d3.scaleLinear().domain([-1, 5000]))
    .xAxisLabel("ALLOCATION FOR "+measureDisplayText[x],20)
    .yAxisLabel("ALLOCATION FOR "+measureDisplayText[y],20)
    .symbolSize(1)
    .excludedSize(1)
    .excludedOpacity(0.5)
    .colors(["#aaaaaa"])
    .on("filtered",function(){
        onFiltered(dimension.top(Infinity))
    })
    scatter.xAxis().ticks(4)
    scatter.yAxis().ticks(4)
        
    dc.renderAll();
    d3.select(".y-axis-label").attr("transform","translate(0,-20)")
    
}
function onFiltered(data){
    var gids =[]
    var counties = ""
    for(var d in data){
        var gid = data[d].County_FIPS
        gids.push(gid)
        if(gid.length==4){
            gid = String("0"+gid)
        }
        
        var state = pub.onlyGeo[gid].properties.stateAbbr
        var county = pub.onlyGeo[gid].properties.county
      //  console.log(county)
        // console.log(gid)
      //   console.log(pub.all.features[gid])
      //   
       
        counties+=gid+"  "+county+", "+state+"<br>"
    }
    
    d3.select("#scatterplotResults").html(gids.length+" counties<br>"+counties)
    filterMap(gids)
}

function filterMap(gids){
  //  console.log(gids)
  var filter = ['in',["get",'FIPS'],["literal",gids]];
	map.setFilter("counties",filter)
}

//#### Version
//Determine the current version of dc with `dc.version`
d3.selectAll("#version").text(dc.version);
