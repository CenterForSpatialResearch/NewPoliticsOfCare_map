$(document).ready(function() {
    $('.js-example-basic-single').select2();
});

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
    histo:null
}
var highlightColor = "#DF6D2A"
var bghighlightColor = "gold"
var outlineColor = "#DF6D2A"
var colors = {
hotspot:["#A7DCDF","#6EAFC3","#3983A8","#02568B"],
SVI:["#A7DCDF","#6EAFC3","#3983A8","#02568B"],
hotspotSVI:["#A7DCDF","#6EAFC3","#3983A8","#02568B"],
highDemand:["#A7DCDF","#6EAFC3","#3983A8","#02568B"]}


var colorGroups = ["#8DC63F","#9FCF8B","#B2D8D6","#47823B","#5A8B71","#6C93A7","#003E38","#134658","#274F78"]

var colorGroups = ["#B2D8D6","#6C93A7","#274F78","#9FCF8B","#5A8B71","#134658","#8DC63F","#47823B","#003E38"]
var colorGroups = ["#003E38","#134658","#274F78","#47823B","#5A8B71","#6C93A7","#8DC63F","#9FCF8B","#B2D8D6"]

var colorGroups = ["#FF8608","#D8AF6F","#B2D8D6","#CA6C19","#9B8060","#6C93A7","#94512A","#5D5051","#274F78"]


var colorGroups = ["#DDDDD7","#91B3C4","#4488B2","#EED66C","#88B078","#228983","#FFCE00","#80AC2A","#008954"]

var colorGroups = ["#FDECB2","#CED9C4","#CFDEDF","#FCE477","#9EBD9C","#9FC6D2","#FADB3C","#6DA173","#6FAFC4"]
var colorGroups = ["rgba(250,219,60,.4)","rgba(136,176,120,.4)","rgba(75,142,191,.4)","rgba(250,219,60,.7)","rgba(136,176,120,.7)","rgba(75,142,191,.7)","rgba(250,219,60,1)","rgba(136,176,120,1)","rgba(75,142,191,1)"]
var colorGroups = [
"rgba(75,142,191,1)","rgba(75,142,191,.7)","rgba(75,142,191,.4)",
"rgba(136,176,120,1)","rgba(136,176,120,.7)","rgba(136,176,120,.4)",
"rgba(250,219,60,1)","rgba(250,219,60,.7)","rgba(250,219,60,.4)"
]
//var colorGroups = ["#FDD6B9","#DBCEC5","#B8C5D1","#FCAE74","#B79D8C","#718BA4","#F77A26","#91664E","#2A5176"]
//
// var pStops = [[0,.33],[.34,.66],[.67,1]]
// var cStops = [[0,33],[34,66],[67,100]]

    
var pStops = [[0,.34],[.34,.67],[.67,1]]
var cStops = [[0,34],[34,67],[67,100]]

var groupColorDict = []
for(var g =0; g<colorGroups.length; g++){
    groupColorDict.push("_"+String(g+1))
    groupColorDict.push(colorGroups[g])
}
groupColorDict.push("#eee")

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
var aiannh = d3.json("indian_reservations.geojson")
var allData = d3.csv("County_level_coverage_for_all_policies_and_different_base_case_capacity (1).csv")
//var allData = d3.csv("https://media.githubusercontent.com/media/CenterForSpatialResearch/allocating_covid/master/Output/County_level_coverage_for_all_policies_and_different_base_case_capacity.csv")
var prioritySet = ["priority_high_demand","priority_SVI_hotspot","priority_SVI_pop","priority_hotspot"]

var coverageSet = []
var coverageDisplayText = {show_all:"Hide Coverage Info"}
for(var c = 1; c<=8; c++){
    var setTerm = "base_case_capacity_"+c*10
     coverageSet.push(setTerm)
    coverageDisplayText[setTerm] = c*10+' CHW per 100,000 People'
 }

var measureSet = ["percentage_scenario_SVI_pop","percentage_scenario_SVI_hotspot","percentage_scenario_hotspot","percentage_scenario_high_demand"]
var measureDisplayText = {
    percentage_scenario_high_demand:"only new cases within the last 14 days",
    percentage_scenario_hotspot:"new cases within the last 14 days as a percent of population",
    percentage_scenario_SVI_pop:"large socially vulnerable populations",
    percentage_scenario_SVI_hotspot:"large socially vulnerable populations and cases as a percent of population"
}

Promise.all([counties,aiannh,countyCentroids,allData])
.then(function(data){
    ready(data[0],data[1],data[2],data[3])
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

function ready(counties,aiannh,centroids,modelData){
    var processed = turnToDictFIPS(modelData,"County_FIPS")
    var comparisonsKeys = processed[1]
    var dataByFIPS = processed[0]
    var combinedGeojson = combineGeojson(dataByFIPS,counties)
    pub.all = combinedGeojson
    drawMap(combinedGeojson,comparisonsKeys)
   
};

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
//var comparisonsSet = []
function turnToDictFIPS(data,keyColumn){
//var prioritySet = ["priority_high_demand","priority_SVI_hotspot","priority_SVI_pop","priority_hotspot"]
    
    var newDict = {}
    var maxPriority = 0
    var keys = Object.keys(data[0])
    
    for(var i in data){
        var key = String(data[i][keyColumn])
        if(key.length==4){
            key= "0"+key
        }
        if(key=="30085"){
            console.log(data[i])
        }
    var newKeys = []
        
        newDict[key]={}
        
       // var values = data[i]
        for(var j in prioritySet){
            var k1 = prioritySet[j]
            var v1 = parseFloat(data[i][k1])
            newDict[key][k1]=v1
            
            for(var k in prioritySet){
                var k2 = prioritySet[k]
                var v2 = parseFloat(data[i][k2])
                var index1 = j
                var index2 = k
                if(index1!=index2){
                    if(index1<index2){
                        var compareKey = "compare_"+k1+"_"+k2
                        if(newKeys.indexOf(compareKey)==-1){
                            newDict[key][compareKey]=v1-v2
                            newKeys.push(compareKey)                            
                        }
                    }else{
                        var compareKey = "compare_"+k2+"_"+k1
                        if(newKeys.indexOf(compareKey)==-1){
                            newDict[key][compareKey]=v2-v1
                            newKeys.push(compareKey)
                        }
                    }
                }
            }
        }
    }
    var comparisonsSet = newKeys
    return [newDict,comparisonsSet]
}

function combineGeojson(all,counties){
    for(var c in counties.features){
        var countyFIPS = counties.features[c].properties.FIPS
        var data = all[countyFIPS]
       // console.log(data)
        
        //for now PR is undefined
        if(data!=undefined){            
            var keys = Object.keys(data)
            for(var k in keys){
                var key = keys[k]
                if(isNaN(parseFloat(value))!=true && key!="County_FIPS"){
                     var value = parseFloat(data[key])
                 }else{
                     var value = data[key]
                 }
                counties.features[c].properties[key]=value
            }
        }
    }
    return counties
}

function drawGrid(map,comparisonsSet){
    var drawn = []
    var svg = d3.select("#comparisonGrid").append("svg").attr("width",280).attr("height",300)
    var gridSize = 30
    for(var i in prioritySet){
                svg.append("text")
                .text(prioritySet[i])
                .attr("x",i*gridSize+40)
                .attr("y",130)
                .attr("transform","rotate(-45 "+(i*gridSize+40)+",0)")
        
        for(var j in prioritySet){
            if(i==0){
                svg.append("text")
                .text(prioritySet[j])
                .attr("x",i)
                .attr("y",j*gridSize+gridSize/2)
                .attr("transform","translate(110,100)")
                .attr("text-anchor","end")
                
            }
            
            if(j!=i){
                if(i<j){
                    var key = "compare_"+prioritySet[i]+"_"+prioritySet[j]
                }else{
                    var key = "compare_"+prioritySet[j]+"_"+prioritySet[i]
                }
                
                if(comparisonsSet.indexOf(key)>-1 && drawn.indexOf(key)==-1){
                    svg.append("rect")
                        .attr("width",gridSize-4)
                        .attr("height",gridSize-4)
                        .attr("x",gridSize*j)
                        .attr("y",gridSize*i)
                        .attr("id",key)
                        .attr("class","grid")
                        .attr("transform","translate(120,100)")
                        .attr("cursor","pointer")
                        .on("click",function(){
                            colorMap(map,d3.select(this).attr("id"))
                            d3.selectAll(".grid").attr("fill","black")
                            d3.select(this).attr("fill","red")
                            drawKey(d3.select(this).attr("id"))
                        })
                        drawn.push(key)
                    }else{
                    svg.append("rect")
                        .attr("width",gridSize-6)
                        .attr("height",gridSize-6)
                        .attr("x",gridSize*j)
                        .attr("y",gridSize*i)
                        .attr("transform","translate(120,100)")
                        .attr("fill","none")
                        .attr("stroke","#aaa")
                    }
            }else{
                    svg.append("rect")
                        .attr("width",gridSize-6)
                        .attr("height",gridSize-6)
                        .attr("x",gridSize*j)
                        .attr("y",gridSize*i)
                        .attr("transform","translate(120,100)")
                        .attr("fill","none")
                        .attr("stroke","#aaa")
            }
        }
    }
}
function drawKey(key){
    d3.select("#comparisonKey svg").remove()
    
    var k1 = key.split("_priority_")[1]
    var k2 = key.split("_priority_")[2]
    var svg = d3.select("#comparisonKey").append("svg")
        .attr("width",500).attr('height',200)
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
       .attr("stop-color", "green")
       .attr("stop-opacity", 1);

    gradient.append("stop")
       .attr('class', 'end')
       .attr("offset", "50%")
       .attr("stop-color", "white")
       .attr("stop-opacity", 1);
    gradient.append("stop")
       .attr('class', 'end')
       .attr("offset", "100%")
       .attr("stop-color", "red")
       .attr("stop-opacity", 1);


    svg.append("text").text("higher "+k1).attr("y",18).attr("x",20)
    svg.append("text").text("higher "+k2).attr("y",18).attr("x",420).attr("text-anchor","end")
    svg.append("text").text("no difference").attr("y",18).attr("x",220).attr("text-anchor","middle")
    svg.append("rect")
    .attr("class","key")
    .attr('width',400)
    .attr('height',20)
    .attr("x",20)
    .attr("y",20)
    .attr("fill","url(#svgGradient)")
    
    
}
function colorMap(map,key){
    var color = {property:key,stops:[[-1,"red"],[0,"#fff"],[1,"green"]]}
    map.setPaintProperty("counties", 'fill-color', color)  
    
}
function drawMap(data,comparisonsKeys){
	mapboxgl.accessToken = 'pk.eyJ1Ijoic2lkbCIsImEiOiJkOGM1ZDc0ZTc5NGY0ZGM4MmNkNWIyMmIzNDBkMmZkNiJ9.Qn36nbIqgMc4V0KEhb4iEw';    
    //mapboxgl.accessToken = "pk.eyJ1IjoiYzRzci1nc2FwcCIsImEiOiJja2J0ajRtNzMwOHBnMnNvNnM3Ymw5MnJzIn0.fsTNczOFZG8Ik3EtO9LdNQ"//new account
    var bounds = [
    [-74.1, 40.6], // Southwest coordinates
    [-73.6, 40.9] // Northeast coordinates
    ];
   
    map = new mapboxgl.Map({
         container: 'map',
 		style: "mapbox://styles/sidl/ckbsbi96q3mta1hplaopbjt9s",
 		//style:"mapbox://styles/c4sr-gsapp/ckc4s079z0z5q1ioiybc8u6zp",//new account
        center:[-100,37],
         zoom: 3.8,
         preserveDrawingBuffer: true,
        minZoom:3.5//,
       // maxBounds: bounds    
     });
     
     map.on("load",function(){        
         
         map.setLayoutProperty("mapbox-satellite", 'visibility', 'none');
         map.addSource("counties",{
             "type":"geojson",
             "data":data
         })
         
         map.addLayer({
             'id': 'county_outline',
             'type': 'line',
             'source': 'counties',
             'paint': {
                 'line-color':"#fff",
                 'line-opacity':.3
             },
             'filter': ['==', '$type', 'Polygon']
         },"mapbox-satellite");
                  
         map.addLayer({
             'id': 'counties',
             'type': 'fill',
             'source': 'counties',
             'paint': {
             'fill-color': "white",
                 'fill-opacity':0
             },
             'filter': ['==', '$type', 'Polygon']
         },"county_outline");
         
         
         drawGrid(map,comparisonsKeys)
         
         
        lineOpacity["property"]=pub.strategy+"_"+pub.coverage
        lineWeight["property"]=pub.strategy+"_"+pub.coverage
        fillColor["property"]="priority_"+pub.strategy.replace("percentage_scenario_","")
     
         map.setPaintProperty("counties", 'fill-opacity',1)
        // map.setPaintProperty("counties", 'fill-color',fillColor)
              var matchString = ["match",["get",pub.strategy+"_"+pub.coverage+"_group"]].concat(groupColorDict)
              //console.log(matchString)
              
               map.setPaintProperty("counties", 'fill-color', matchString)  
         
        d3.select("."+pub.coverage+"_radialC").style("background-color",highlightColor).style("border","1px solid "+ highlightColor)
        d3.selectAll("."+pub.coverage).style("color",highlightColor)
        d3.selectAll("."+pub.strategy).style("color",highlightColor)
        d3.selectAll("."+pub.strategy+"_radialS").style("background-color",highlightColor).style("border","1px solid "+ highlightColor)
          
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
             
             var x = event.clientX;     // Get the horizontal coordinate
             var y = event.clientY;             
              d3.select("#mapPopup").style("visibility","visible")
              .style("left",x+"px")
              .style("top",(y+20)+"px") 
             
             var countyName = feature["properties"]["county"]+" County, "+feature["properties"]["stateAbbr"]
             var population = feature["properties"]["totalPopulation"]
             var geometry = feature["geometry"]
             var countyId = feature["properties"]["FIPS"]
             
             var displayString = countyName+"<br>Population: "+population
             
             var chartData = []
                         //
              for(var p in prioritySet){
                  var pk = prioritySet[p]
                  var pv = feature["properties"][pk]
                 // displayString+=pk+": "+pv+"<br>"
                  chartData.push({axis:pk,value:pv})
              }
             d3.select("#mapPopup").html(displayString)
             drawChart(chartData)
         }       
         
         map.on("mouseleave",'counties',function(){
             d3.select("#mapPopup").style("visibility","hidden")

         })  
     
         var coordinates = geometry.coordinates[0]
         
         var bounds = coordinates.reduce(function(bounds, coord) {
                 return bounds.extend(coord);
             }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));
      

     });
    
}
function drawChart(data){
    var xScale = d3.scaleLinear().domain([0,1]).range([0,200])
    var svg = d3.select("#mapPopup").append("svg").attr("class","chart").attr("width",200).attr("height",200)
    svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("width",function (d,i){
        return xScale(d.value)
    })
    .attr("height",10)
    .attr("x",10)
    .attr("y",function(d,i){return i*30+20})
    
    svg.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .text(function (d,i){
            return d.axis+": "+d.value
        })
        .attr("x",10)
        .attr("y",function(d,i){return i*30+19})
}
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


function filterMap(gids){
  //  console.log(gids)
  var filter = ['in',["get",'FIPS'],["literal",gids]];
	map.setFilter("counties",filter)
}
//#### Version
//Determine the current version of dc with `dc.version`
d3.selectAll("#version").text(dc.version);
