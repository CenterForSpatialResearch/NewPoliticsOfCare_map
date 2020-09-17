
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
var possibleStartStates = ["CA","LA","FL","NY","MT","TX"]
var randomStartState = possibleStartStates[Math.round(Math.random()*possibleStartStates.length-1)]
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
    bounds:null,
    SVIFIPS:null,
    sviZoom:10,
    SVIcenter:null,
    column:"Proportional_allocation_to_Covid",
    min:999,
    max:0,
    maxAllocationByPop:0,
    minAllocationByPop:99999999999,
    startState:randomStartState,
    stateAllocations:null,
    currentState:randomStartState
}
var stateAllocationPercentMaxMin = {}
var allocationMaxs = {
}
var highlightColor = "gold"
var bghighlightColor = "gold"
var outlineColor = "#DF6D2A"
var colors = ["#17DCFF","#7E6EFF","#E400FF"]
//var colors = ["#2D7FB8","#7FCDBB","#2D7FB8"]

  var colorGroups =[
  "rgba(19,182,163, .4)","rgba(19,182,163, .7)","rgba(19,182,163, 1)",
  "rgba(162,211,82, .4)","rgba(162,211,82, .7)","rgba(162,211,82, 1)",
  "rgba(255, 241, 0, .4)","rgba(255, 241, 0, .7)","rgba(255, 241, 0, 1)"
  ]
  

var newColors =  ["_10","#ddd",
                "_0","rgba(19,182,163, 1)",
                "_1","rgba(162,211,82, 1)",
                "_2","rgba(255, 241, 0, 1)",
                '#eee'
                ]
    
var pStops = [[0,.34],[.34,.67],[.67,1]]
var cStops = [[0,34],[34,67],[67,100]]

var groupColorDict = []
for(var g =0; g<colorGroups.length; g++){
    groupColorDict.push("_"+String(g+1))
    groupColorDict.push(colorGroups[g])
}
groupColorDict.push("red")

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
var usOutline = d3.json("simple_contiguous.geojson")
var allData =d3.csv("County_level_proportional_allocation_for_all_policies.csv")
var timeStamp = d3.csv("https://raw.githubusercontent.com/CenterForSpatialResearch/allocation_chw/master/Output/time_stamp.csv")
var states = d3.json("simplestates.geojson")

var carto= d3.json("cartogram.geojson")
var stateAllocations = d3.csv("state_level_allocation.csv")
 var measureSet = [
     "Proportional_allocation_to_Medicaid_demand",
     "Proportional_allocation_to_SVI",
     "Proportional_allocation_to_YPLL",
     "Proportional_allocation_to_Unemployment",
       "Proportional_allocation_to_Covid",
     "Proportional_allocation_to_Covid_capita",
     "Proportional_allocation_to_Covid_death_capita"
]


 var measureDisplayText = {
      Proportional_allocation_to_Medicaid_demand:"MEDICAID ENROLLEES",
      Proportional_allocation_to_SVI:"SOCIAL VULNERALBILITY INDEX <span class=\"sviAster\">*</span>",
      Proportional_allocation_to_YPLL:"YEARS OF POTENTIAL LIFE LOST RATE",
      Proportional_allocation_to_Unemployment:"UNEMPLOYMENT RATE",
       Proportional_allocation_to_Covid:"<span class=\"covidMenu\">COVID CASES (14 DAYS)</span>",
      Proportional_allocation_to_Covid_capita:"<span class=\"covidMenu\">COVID CASES / 100K</span>",
      Proportional_allocation_to_Covid_death_capita:"<span class=\"covidMenu\">COVID DEATHS / 100K</span>"

 }


var measureDisplayTextPop={
     Proportional_allocation_to_Medicaid_demand:"Medicaid Enrollees",
     Proportional_allocation_to_SVI:"Social Vulneralbility Index",
     Proportional_allocation_to_YPLL:"Years of Potential Life Lost",
     Proportional_allocation_to_Unemployment:"Unemployment",
     Proportional_allocation_to_Covid:"Total Covid Cases",
     Proportional_allocation_to_Covid_capita:"Covid Cases per 100,000 Residents",
     Proportional_allocation_to_Covid_death_capita:"Covid Deaths per 100,000 Residents"
}

Promise.all([counties,usOutline,countyCentroids,allData,timeStamp,states,carto,stateAllocations])
.then(function(data){
    ready(data[0],data[1],data[2],data[3],data[4],data[5],data[6],data[7])
})
var hoveredStateId = null;

var lineOpacity = {stops:[[0,1],[100,0.3]]}
var lineWeight = {stops:[[-1,0],[-0.01,0],[0,2],[99,.5],[100,0]]}

var centroids = null
var latestDate = null

function ready(counties,outline,centroids,modelData,timeStamp,states,carto,stateAllocations){
    d3.select("#closeMap").on("click",function(){
        d3.select("#SVIMap").style("display","none")
    })
    pub.states = states
   loader()
     d3.select("#date").html("Model run as of "+timeStamp["columns"][1])
    //convert to geoid dict
    var dataByFIPS = turnToDictFIPS(modelData,"County_FIPS",stateAllocations)
    
    //pub.all = {"highDemand":highDemand,"hotspot":hotspot,"SVI":SVI,"hotspotSVI":hotspotSVI,"normal":normalizedP}
    pub.centroids = formatCentroids(centroids.features)
    //add to geojson of counties
    var combinedGeojson = combineGeojson(dataByFIPS,counties,stateAllocations)
    pub.all = combinedGeojson
    
    //    console.log(combinedGeojson)
    
       var map = drawMap(combinedGeojson,outline)
    
       // drawReservations(aiannh)
    
        var formattedData = []
        for(var i in combinedGeojson.features){
            formattedData.push(combinedGeojson.features[i].properties)
        }
    cartogram(carto,stateAllocations)
    pub.stateAllocations = stateAllocations
        //drawHistogram(pub.strategy,pub.coverage)
    map.once("idle",function(){
        colorByPriority(map)
        d3.select("#"+pub.column).style("background-color",highlightColor)
    })
    
    d3.select("#univar").on("click",function(){
        if(pub.univar==false){
            d3.select("#univar").html("<strong>Show "+pub.column+"</strong> / Show Workers Assigned")
        colorByWorkers(map)
            pub.univar= true
        }
        else{
            d3.select("#univar").html("Show "+pub.column+" / <strong>Show Workers Assigned</strong>")
        colorByPriority(map)
            pub.univar= false
        }
    })
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function turnToDictFIPS(data,keyColumn,stateAllocations){
  //  console.log(stateAllocations)
    var stateAllocationDictionary = formatState(stateAllocations)[0]
   // console.log(stateAllocationDictionary)
    var newDict = {}
    var maxPriority = 0
    var keys = Object.keys(data[0])
    //console.log(keys)
    var notBinaryCoverage = []
    var state_tiger_dict = {'01':'AL','02':'AK','04':'AZ','05':'AR','06':'CA','08':'CO','09':'CT','10':'DE','11':'DC','12':'FL','13':'GA','15':'HI','16':'ID','17':'IL','18':'IN','19':'IA','20':'KS','21':'KY','22':'LA','23':'ME','24':'MD','25':'MA','26':'MI','27':'MN','28':'MS','29':'MO','30':'MT','31':'NE','32':'NV','33':'NH','34':'NJ','35':'NM','36':'NY','37':'NC','38':'ND','39':'OH','40':'OK','41':'OR','42':'PA','44':'RI','45':'SC','46':'SD','47':'TN','48':'TX','49':'UT','50':'VT','51':'VA','53':'WA','54':'WV','55':'WI','56':'WY','60':'AS','66':'GU','69':'MP','72':'PR','78':'VI'}
    
    for(var i in data){
        var key = String(data[i][keyColumn])
        if(key.length==4){
            key= "0"+key
        }

        var stateCode = String(key.slice(0,2))
        var stateAbbr = state_tiger_dict[stateCode]
        
        if(stateAbbr!=undefined){
            var stateName = stateNameDictionary[stateAbbr].toUpperCase()
            var stateTotal = stateAllocationDictionary[stateName]
            //console.log(stateTotal)
            var values = data[i]
       
            for(var j in measureSet){
                var measureKey = measureSet[j]
                var priorityKey = "Normalized_"+measureKey
                var priority = parseFloat(data[i][priorityKey])
                var allocated =Math.floor(parseFloat(data[i][measureKey]))
                var percentAllocated = Math.round(allocated/stateTotal*10000)/100
                values["percentAllocated_"+measureKey]=percentAllocated
                
                if(Object.keys(stateAllocationPercentMaxMin).indexOf(stateAbbr)==-1){
                    stateAllocationPercentMaxMin[stateAbbr]={}
                    stateAllocationPercentMaxMin[stateAbbr].min=percentAllocated
                    stateAllocationPercentMaxMin[stateAbbr].max=percentAllocated
                }else{
                    if(percentAllocated>stateAllocationPercentMaxMin[stateAbbr].max){
                        stateAllocationPercentMaxMin[stateAbbr].max=percentAllocated
                     }
                     if(percentAllocated<stateAllocationPercentMaxMin[stateAbbr].min){
                         stateAllocationPercentMaxMin[stateAbbr].min=percentAllocated
                      }
                     
                }
                
                if(Object.keys(allocationMaxs).indexOf(measureKey)==-1){
                    allocationMaxs[measureKey]=allocated
                }else{
                    if(allocated>allocationMaxs[measureKey]){
                        allocationMaxs[measureKey]=allocated
                    }
                }
                if(percentAllocated>pub.max){pub.max=percentAllocated}
                if(percentAllocated<pub.min && percentAllocated!=0){pub.min=percentAllocated}      
            }
            newDict[key]=values
        }        
    }
    //console.log(newDict)
    return newDict
}
function combineGeojson(all,counties,stateAllocations){
    
    for(var c in counties.features){
        var countyFIPS = counties.features[c].properties.FIPS
        var data = all[countyFIPS]
       // console.log(data)
        counties.features[c]["id"]=countyFIPS
        var population = counties.features[c].properties.totalPopulation
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
                // if(key.includes("Proportional_allocation")){
 //                    var newKey = key+"_pop"
 //                    var newValue = (value/population*100000)
 //                    if(pub.maxAllocationByPop<newValue){
 //                        pub.maxAllocationByPop=newValue
 //                    }
 //                    if(pub.minAllocationByPop>newValue && newValue!=0){
 //                        pub.minAllocationByPop=newValue
 //                    }
 //                }
 //                counties.features[c].properties[newKey]=newValue
            }
        }
    }
    //console.log(counties)
    return counties
}
function drawReservations(data,map){
    //for pattern: https://docs.mapbox.com/mapbox-gl-js/example/fill-pattern/
    map.addSource("aiannh",{
        "type":"geojson",
        "data":aiannh
    })

    map.loadImage(
                  'pattern_transparent.png',
                  function(err, image) {
                  // Throw an error if something went wrong
                      if (err) throw err;
      
                      // Declare the image
                      map.addImage('pattern', image);
      
                      // Use it
                      map.addLayer({
                          'id': 'aiannh',
                          'type': 'fill',
                          'source': 'aiannh',
                          'layout': {
                              'visibility': 'visible'
                           },
                          'paint': {
                              'fill-pattern': 'pattern'
                          }
                      });
                  }
              );
}

function drawMap(data,outline){
    d3.select("#map").style("width",window.innerWidth+"px")
          .style("height",window.innerHeight+"px")
    mapboxgl.accessToken = "pk.eyJ1IjoiYzRzci1nc2FwcCIsImEiOiJja2J0ajRtNzMwOHBnMnNvNnM3Ymw5MnJzIn0.fsTNczOFZG8Ik3EtO9LdNQ"//new account
    var maxBounds = [
    [-190,8], // Southwest coordinates
    [-20, 74] // Northeast coordinates
    ];
   var bounds = [[-130, 26], 
        [-40, 50]
    ]
    map = new mapboxgl.Map({
         container: 'map',
        style:"mapbox://styles/c4sr-gsapp/ckcnnqpsa2rxx1hp4fhb1j357",//newest
        bounds:bounds,
        maxZoom:8,
         zoom: 3.8,
         preserveDrawingBuffer: true,
        minZoom:3.5,
       maxBounds: maxBounds    
     });
     
     map.on("load",function(){
         
     //    console.log(map.getStyle().layers)
         
        $('#map').show();

        map.resize();

        map.addControl(new mapboxgl.NavigationControl(),'bottom-right');
    map.dragRotate.disable();
    map.addSource("counties",{
             "type":"geojson",
             "data":data
         })
         
                  
         map.addLayer({
             'id': 'counties',
             'type': 'fill',
             'source': 'counties',
             'paint': {
             'fill-color': "white",
                 'fill-opacity':0
             },
             'filter': ['==', '$type', 'Polygon']
         },"ST-OUTLINE");
         
         map.addLayer({
             'id': 'county_outline',
             'type': 'line',
             'source': 'counties',
             'paint': {
                 'line-color':"#ffffff",
                 'line-opacity':[
                    'case',
                    ['boolean', ['feature-state', 'hover'], false],
                    1,
                    1
                 ],
                 'line-width':[
                    'case',
                    ['boolean', ['feature-state', 'hover'], false],
                    4,
                    1
                 ]
             },
             
             'filter': ['==', '$type', 'Polygon']
         },"ST-OUTLINE");
         
         
        // },"county_outline");         
         
         // var filter = ["!=","percentage_scenario_SVI_hotspot_base_case_capacity_30",-1]
    //      map.setFilter("counties",filter)
    //     console.log(map.getStyle().layers)        
         zoomToBounds(map)
         strategyMenu(map,data)
         //toggleLayers(map)
         placesMenus(map)
             //
        // lineOpacity["property"]=pub.strategy+"_"+pub.coverage
        // lineWeight["property"]=pub.strategy+"_"+pub.coverage
        // fillColor["property"]="priority_"+pub.strategy.replace("percentage_scenario_","")
        // d3.select("."+pub.coverage+"_radialC")//.style("border","1px solid "+ highlightColor)
        // d3.selectAll("."+pub.coverage).style("background-color","#000").style("color","#fff")
        // d3.selectAll("."+pub.strategy).style("background-color","#000").style("color","#fff")
        //d3.selectAll("."+pub.strategy+"_radialS")//.style("background-color","#000").style("color","#fff")//.style("border","1px solid "+ highlightColor)
            cartoGoToState(pub.startState)
 var stateToNumber = {'WA': '53', 'DE': '10', 'DC': '11', 'WI': '55', 'WV': '54', 'HI': '15', 'FL': '12', 'WY': '56', 'NH': '33', 'NJ': '34', 'NM': '35', 'TX': '48', 'LA': '22', 'NC': '37', 'ND': '38', 'NE': '31', 'TN': '47', 'NY': '36', 'PA': '42', 'CA': '06', 'NV': '32', 'VA': '51', 'GU': '66', 'CO': '08', 'VI': '78', 'AK': '02', 'AL': '01', 'AS': '60', 'AR': '05', 'VT': '50', 'IL': '17', 'GA': '13', 'IN': '18', 'IA': '19', 'OK': '40', 'AZ': '04', 'ID': '16', 'CT': '09', 'ME': '23', 'MD': '24', 'MA': '25', 'OH': '39', 'UT': '49', 'MO': '29', 'MN': '27', 'MI': '26', 'RI': '44', 'KS': '20', 'MT': '30', 'MP': '69', 'MS': '28', 'PR': '72', 'SC': '45', 'KY': '21', 'OR': '41', 'SD': '46'}// console.log(this.value)           
           
           map.setFilter("county-name",["==","STATEFP",stateToNumber[pub.startState]])
           map.setFilter("state-abbr",["==","STATEFP",stateToNumber[pub.startState]])
           map.setFilter("reservation-name",["==","STATE",pub.startState])
           map.setFilter("state_mask",["!=","STATEFP",stateToNumber[pub.startState]])
           map.setFilter("state_mask_outline",["==","STATEFP",stateToNumber[pub.startState]])     
        
            d3.selectAll(".hex").attr("opacity",0.5)
            d3.select("."+pub.startState+"_hex").attr("opacity",1)
        
     })
     var popup = new mapboxgl.Popup({
         closeButton: false,
         closeOnClick: false
     });     
      var hoveredStateId = null;
     
     var firstMove = true
        d3.select("#mapPopup").append("div").attr("id","popLabel") 
      d3.select("#mapPopup").append("div").attr("id","popMap")
    
    map.on('click', 'counties', function(e) {
        
        
        var feature = e.features[0]
        pub.SVIFIPS = feature.properties.FIPS
        pub.sviZoom = 10
        pub.SVIcenter = pub.centroids[feature.properties["FIPS"]]
        
       // window.open("sviMap.html", "_blank"); 
        
  //      d3.select("#SVIMap").style("display","block")
    //    d3.select("#SVIText").html("SVI Census Tract Level Map TEMPORARY<br><br>COUNTY: "+pub.SVIFIPS+"<br>Id vel atqui commodo bonorum. Sit eu menandri percipitur adversarium, quis error nostrud an sea, cu paulo mundi his. Vel ut iusto omittam temporibus, sea nullam tamquam periculis ea. Te cum brute malorum praesent, eu sed vero omittam consulatu, usu illum deserunt no.")
        
    })
    map.on("mousemove","ST-OUTLINE",function(c){
        console.log(c.features)
    })
     map.on('mousemove', 'counties', function(e) {
         var feature = e.features[0]
        //console.log(map.getZoom())
        //console.log(feature["properties"]["Normalized_Covid_capita"])
         map.getCanvas().style.cursor = 'pointer'; 
         if(feature["properties"].FIPS!=undefined){
             if (hoveredStateId) {
             map.setFeatureState(
             { source: 'counties', id: hoveredStateId },
             { hover: false }
             );
             }
             hoveredStateId = e.features[0].id;
             map.setFeatureState(
             { source: 'counties', id: hoveredStateId },
             { hover: true }
             );
             
             
             var x = event.clientX+20;     // Get the horizontal coordinate
             var y = event.clientY+20;             
             var w = window.innerWidth;
             var h = window.innerHeight;
             if(x+200>w){
                 x = x-280
             }
             if(y+200>h){
                 y= h-220
             }else if(y-200<150){
                 y = 150
             }
             
              d3.select("#mapPopup").style("visibility","visible")
              .style("left",x+"px")
              .style("top",y+"px") 
             
             var countyName = feature["properties"]["county"]+" County, "+feature["properties"]["stateAbbr"]
             var population = feature["properties"]["totalPopulation"]
             var geometry = feature["geometry"]
             var chwNeed = feature["properties"]["CHW_need"]
             var cases = feature["properties"]["Covid_cases"]             
             var countyId = feature["properties"]["FIPS"]
             var SVI = Math.round(feature["properties"]["SVI_county"]*100)/100
             
             var actualCoverage = feature.properties[pub.strategy+"_base_case_capacity_0"]
           //  var columnsToShow = ["hotspotSVI_priority","hotspot_priority","SVI_priority","highDemand_priority"]       
             
            var currentSelection = pub.strategy+"_"+pub.coverage
             
             
             var currentSelectionCoverage = Math.round(feature["properties"][currentSelection]*100)/100
             
             var chwAssigned = Math.round(chwNeed*(feature["properties"][currentSelection]/100))
             
             var displayString = "<span class=\"popupTitle\">"+countyName+"</span><br>"
                     +"Population: "+numberWithCommas(population)+"<br>"+"<br>"
                     +"Number of workers allocated using "+measureDisplayTextPop[pub.column]+":<br><span class=\"popupTitle\">"
                     +numberWithCommas(Math.floor(feature.properties[pub.column]))+"</span>"
                     +"<br>"
                 +"Constitutes <span class=\"popupTitle\">"+feature.properties["percentAllocated_"+pub.column]+"%</span> of the total workers statewide"
                 
             var needsMetString = currentSelectionCoverage+"% of needs met</strong>"
             
             if(currentSelectionCoverage ==-1){
                 needsMetString = "Currently No Cases Reported"
             }
             d3.select("#popLabel").html(displayString)//+"<br><i>Click on county for more</i>")
            var coords = pub.centroids[feature.properties["FIPS"]]
              var formattedCoords =coords
         }       
         
         map.on("mouseleave",'counties',function(){
             d3.select("#mapPopup").style("visibility","hidden")
         })  
         var coordinates = geometry.coordinates[0]
              });
          return map
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
function subMap(detailMap, center,geometry,countyId){    
    var coordinates = geometry.coordinates[0]
   // console.log(countyId)
    var bounds = getMaxMin(flatDeep(coordinates,Infinity))
    var mapboxBounds = new mapboxgl.LngLatBounds(bounds)
    // var filter = ["==","COUNTY",String(countyId)]
    // detailMap.setFilter("tractSVI",filter)
    
    // var bounds = coordinates.reduce(function(bounds, coord) {
 //            return bounds.extend(coord);
 //        }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));
 //     console.log(bounds)
        // detailMap.flyTo(
   //          {
   //
   //              center:[center.lat,center.lng],
   //              curve: 0,
   //             // zoom: 9,
   //              speed:10
   //
   //          }
   //      )
             detailMap.fitBounds(mapboxBounds, {
                 padding: 5,
                 animate: false
             })
         
 
    
     
     // var filter = ['!=',["get",'FIPS'],["literal",[countyId]]];
   //   detailMap.setFilter("county-small-4yr1gy",filter)

     
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
        //
    // for(var i in breaks){
    //     if(i==breaks.length-1){
    //         var endValue = max
    //         var startValue = breaks[i][0]
    //
    //     }else{
    //         var startValue = breaks[i][0]
    //         var endValue = breaks[parseInt(i)+1][0]
    //     }
    //
    //     var group =activeData.filter(function(d){
    //         return d[priority]>=startValue && d[priority]<=endValue
    //     })
    //     var sum = sumProperty(strategy+"_total_demand_of_county",group)
    //
    //     var startX = cLength
    //     cLength+=Math.round((group.length/totalCounties)*10000)/100
    //     actualLength = group.length
    //     var color = colors[strategy][i]
    //     formattedBreaks.push({cases:sum,color:color,cLength:cLength, sLength:startX,actualLength:actualLength,length:Math.round((group.length/totalCounties)*10000)/100})
    // }
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

function drawKey(demandType){
    
    d3.selectAll("#keySvg").remove()
    var color = colors[demandType]
    var svg = d3.select("#key").append("svg").attr("width",350).attr("height",300).attr("id","keySvg")

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
       .attr("stop-color", "white")
       .attr("stop-opacity", 1);

    gradient.append("stop")
       .attr('class', 'end')
       .attr("offset", "100%")
       .attr("stop-color", color)
       .attr("stop-opacity", 1);
   
   var w = 200
       var h = 10
       var l = 120
       var t = 30
    svg.append("rect")
    .attr("width",w)
    .attr("height",h)
    .attr("x",l)
    .attr("y",t)
    .attr("fill","url(#svgGradient)")
    
    svg.append("rect")
    .attr("width",w)
    .attr("height",h)
    .attr("x",l)
    .attr("y",t*2)
       .attr("opacity",.3)
    .attr("fill","url(#svgGradient)")
       
      svg.append("text").text("covered").attr("x",l-10).attr("y",t+10).attr("text-anchor","end")
      svg.append("text").text("notcovered").attr("x",l-10).attr("y",t*2+10).attr("text-anchor","end")
      svg.append("text").text("low priority").attr("x",l).attr("y",t-10)//.attr("text-anchor","end")
      svg.append("text").text("high prioirty").attr("x",w+l).attr("y",t-10).attr("text-anchor","end")

}

function strategyMenu(map,data){
    var gridSize = 70
    
     var clickedId = "Covid_capita"
     for (var i = 0; i < measureSet.length; i++) {
         var id = measureSet[i];
         if(measureSet[i]!= "percentage_scenario_SVI_pop"){
             d3.select("#strategiesMenu").append("div")//.attr("width",gridSize-4).attr("height",gridSize-4)
             .attr("id",id)
             .html(measureDisplayText[id])
             .attr("class","measures")
             .attr("cursor","pointer")
             .attr("stroke","black")
             .style("cursor","pointer")
             .on("click",function(){
                         clickedId = d3.select(this).attr("id")
                         pub.column = clickedId
                         d3.selectAll(".measures").style("background-color","white").style("color","#000")
                         d3.selectAll("#"+clickedId).style("background-color",highlightColor)
                         colorByPriority(map)
                     })
         }
     }
     d3.selectAll(".measureGridLabel").style("font-size","12px")
     
     d3.select("#strategiesMenu")
     .append("div")
     .attr("id","sviAsterLabel").html("CDC considers percentile rank of fifteen different factors while calculating SVI, we consider proportional value of these fifteen factors in each state compared to the state and then take the average of these proportional values for the fifteen different factors.")
     .style("position","absolute").style("left","225px").style("top","355px")
     .style("width","150px")
     .style('padding',"5px")
     .style('background-color',"#ffffff")
     .style("border","1px solid black")
     .style('visibility',"hidden")
     
    d3.select(".sviAster")
     .style('text-decoration',"underline")
     .on("mouseover", function(){
         d3.select("#sviAsterLabel").style('visibility',"visible")
     })
     .on("mouseout", function(){
         d3.select("#sviAsterLabel").style('visibility',"hidden")
     })
}

                
function colorByPriority(map){
    map.setPaintProperty("counties", 'fill-opacity',1)
    var maxMin =  stateAllocationPercentMaxMin[pub.currentState]
    
    var max = parseFloat(maxMin.max)
    var min = parseFloat(maxMin.min)
    var midPoint = min+(max-min)/2
    // var matchString = ["match",
 //                ["get","group_"+pub.column]].concat(newColors)
    var matchString = {
    property: "percentAllocated_"+pub.column,
//    stops: [[0, colors[0]],[allocationMaxs[pub.column]/2,colors[1]],[allocationMaxs[pub.column], colors[2]]]
    stops: [[0,"#ddd"],[0.001, colors[0]],[midPoint,colors[1]],[max, colors[2]]]
    }
    map.setPaintProperty("counties", 'fill-color', matchString)
    drawGridWithoutCoverage(map)
    d3.select("#coverage").style("display","block")
    
}

function drawGridWithoutCoverage(map){
    var gridHeight = 180
    var gridWidth = 150
    var gridSize = 30
    d3.select("#colorGrid svg").remove()
    var uniSVG = d3.select("#colorGrid").append("svg").attr("width",gridWidth).attr("height",gridHeight)
   // var colorsArray =["#17DCFF","#7E6EFF","#E400FF"]
    var label = [0,allocationMaxs[pub.column]/2,allocationMaxs[pub.column]]
    var clicked = false
    var currentFilter = null
    
    
    uniSVG.append("text").text("high").attr("x",60).attr("y",20).attr("text-anchor","end")
    uniSVG.append("text").text("low").attr("x",60).attr("y",130).attr("text-anchor","end")
    
  

    uniSVG.append("text").text("WORKERS ALLOCATED BY").attr("x",10).attr("y",80).style("font-size","12px")
    .attr("transform","rotate(-90 10,80)").style("font-weight","bold")
    .attr("text-anchor","middle")
    
    uniSVG.append("text").text(measureDisplayText[pub.column]).attr("x",25).attr("y",80).style("font-size","12px")
    .attr("transform","rotate(-90 25,80)").style("font-weight","bold")
    .attr("text-anchor","middle")
    
    // uniSVG.append("rect").attr("width",gridSize/2).attr("height",gridSize/2).attr("x",10).attr("y",190).attr("fill","#ddd")
   //  uniSVG.append("text").attr("x",35).attr("y",204).text("Counties with no recorded cases")
   //  
    uniSVG.selectAll(".uniRect")
                .data(colors)
                .enter()
                .append("rect")
                .attr("fill",function(d){return d})
                .attr("width",gridSize)
                .attr("height",gridSize)
                .attr("x",20)
                .attr("y",function(d,i){return 155 - (i+1)*(gridSize+10)})
                .attr("transform","translate(100,-20)")
                .attr("class","gridCell")
                .on("mouseover",function(d,i){
                    var groupName = "_"+(i)            
                    var filter = ["==","group_"+pub.column,groupName]
                    map.setFilter("counties",filter)
                    d3.selectAll(".gridCell").attr("opacity",.3)
                    d3.select(this).attr("opacity",1)

                    var x = event.clientX;     // Get the horizontal coordinate
                    var y = event.clientY;             
                    d3.select("#gridHover").style("visibility","visible")
                    var gP = ["low","med","high"][Math.floor((i)/3)]
                    var gC = ["low","med","high"][i%3]
                    d3.select("#gridHover").html(pub.histo[i].length+ " counties have "+ gP+" priority and "+gC+" unmet need")
                    //   console.log("over")
                })
                .on("mouseout",function(d,i){
                    d3.selectAll(".gridCell").attr("opacity",1)
                    d3.select("#gridHover").style("visibility","hidden")

                    if(clicked == false){
                        currentFilter = ["!=","percentage_scenario_SVI_hotspot_base_case_capacity_30",-1]
                        map.setFilter("counties",currentFilter)
                    }else{
                        map.setFilter("counties",currentFilter)
                    }
                })
                .on("click",function(d,i){
                    var groupName = "_"+(i)            
                    var filter = ["==","group_"+pub.column,groupName]

                    if(JSON.stringify(filter) == JSON.stringify(currentFilter)){
                        d3.select(this).attr("stroke","none")
                        currentFilter = ["!=","percentage_scenario_SVI_hotspot_base_case_capacity_30",-1]
                        map.setFilter("counties",currentFilter)
                        clicked = false
                    }else{
                        map.setFilter("counties",filter)
                        currentFilter = filter
                        d3.selectAll(".gridCell").attr("stroke","none")
                        d3.select(this).attr("stroke","#000")
                        clicked = true
                    }
                })
                
    uniSVG.selectAll(".uniText")
                .data(colors)
                .enter()
                .append("text")
                .text(function(d,i){
                    return label[i]
                })
                .attr("text-decoration","underline")
                .attr("x",20)
                .attr("y",function(d,i){return 135 - i*(gridSize+10)})
                .attr("text-anchor","end")
                .attr("transform","translate(95,-20)")
}
function drawGrid(map,data){
    d3.select("#colorGrid svg").remove()
    var currentFilter = null

    var domainC = []
    for(var g =0; g<colorGroups.length; g++){
        domainC.push("_"+g)
    }

    var histo = d3.histogram()
    .value(function(d){
        if(d.properties[pub.strategy+"_"+pub.coverage+"_group"]==undefined){
            return 999
        }else{
            return d.properties[pub.strategy+"_"+pub.coverage+"_group"].replace("_","")
        }
    })
    .domain([1,10])
    .thresholds(9)

    var bins = histo(data.features)
    pub.histo = bins

    var gridHeight = 250
    var gridWidth = 220
    var colorGridSvg = d3.select("#colorGrid").append("svg").attr("width",gridWidth).attr("height",gridHeight)
    var gridSize = 40
    var rScale = d3.scaleLinear().domain([0,800]).range([10,gridSize-5])

    colorGridSvg.append("rect").attr("width",gridSize/2).attr("height",gridSize/2).attr("x",10).attr("y",190).attr("fill","#ddd")
    colorGridSvg.append("text").attr("x",35).attr("y",204).text("Counties with no recorded cases")

    var clicked = false

    colorGridSvg
    .selectAll(".grid")
    .data(colorGroups)
    .enter()
    .append("rect")
    .attr("class",function(d,i){
        var cClass = i%3
        var mClass = Math.floor(i/3)
        return "c_"+cClass+" "+"m_"+mClass+" gridCell"
    })
    .attr("x",function(d,i){
        return i%3*(gridSize)
    })
    .attr("y",function(d,i){
        return 150-Math.floor(i/3+1)*(gridSize)//-rScale(bins[i].length)+gridSize/2
    })
    .attr("width",function(d,i){
        return gridSize//-20
    })
    .attr("height",function(d,i){
        return gridSize
    })
    .attr('fill',function(d){return d})
    .attr("transform","translate(100,-20)")
    .attr("cursor","pointer")
    .on("mouseover",function(d,i){
        var groupName = "_"+(i+1)            
        var filter = ["==",pub.strategy+"_"+pub.coverage+"_group",groupName]
        map.setFilter("counties",filter)
        d3.selectAll(".gridCell").attr("opacity",.3)
        d3.select(this).attr("opacity",1)

        var x = event.clientX;     // Get the horizontal coordinate
        var y = event.clientY;             
        d3.select("#gridHover").style("visibility","visible")
        var gP = ["low","med","high"][Math.floor((i)/3)]
        var gC = ["low","med","high"][i%3]
        d3.select("#gridHover").html(pub.histo[i].length+ " counties have "+ gP+" priority and "+gC+" unmet need")
        //   console.log("over")
    })
    .on("mouseout",function(d,i){
        d3.selectAll(".gridCell").attr("opacity",1)
        d3.select("#gridHover").style("visibility","hidden")

        if(clicked == false){
            currentFilter = ["!=","percentage_scenario_SVI_hotspot_base_case_capacity_30",-1]
            map.setFilter("counties",currentFilter)
        }else{
            map.setFilter("counties",currentFilter)
        }
    })
    .on("click",function(d,i){
        var groupName = "_"+(i+1)            
        var filter = ["==",pub.strategy+"_"+pub.coverage+"_group",groupName]

        if(JSON.stringify(filter) == JSON.stringify(currentFilter)){
            d3.select(this).attr("stroke","none")
            currentFilter = null
            map.setFilter("counties",currentFilter)
            clicked = false
        }else{
            map.setFilter("counties",filter)
            currentFilter = filter
            d3.selectAll(".gridCell").attr("stroke","none")
            d3.select(this).attr("stroke","#000")
            clicked = true
        }
    })
    
    colorGridSvg.append("text").text("% OF UNMET NEED").attr("x",105).attr("y",180).style("font-weight","bold").style("font-size","12px")
    colorGridSvg.append("text").text("less").attr("x",100).attr("y",160)
    colorGridSvg.append("text").text("more").attr("x",190).attr("y",160)

    colorGridSvg.append("text").text("high").attr("x",60).attr("y",20).attr("text-anchor","end")
    colorGridSvg.append("text").text("low").attr("x",60).attr("y",130).attr("text-anchor","end")

    var measureDisplayTextShort = {
        percentage_scenario_high_demand:"new cases",
        percentage_scenario_SVI_high_demand:"SVI*new cases",
        percentage_scenario_hotspot:"new cases/pop",
        percentage_scenario_SVI_pop:"SVI*pop",
        percentage_scenario_SVI_hotspot:"SVI*(new cases/pop)"
    }

    colorGridSvg.append("text").text(measureDisplayTextShort[pub.strategy].toUpperCase()).attr("x",10).attr("y",80).style("font-size","12px")
    .attr("transform","rotate(-90 10,80)").style("font-weight","bold")
    .attr("text-anchor","middle")
    
    colorGridSvg.append("text").text("PRIORITY SCORE").attr("x",25).attr("y",80).style("font-size","12px")
    .attr("transform","rotate(-90 25,80)").style("font-weight","bold")
    .attr("text-anchor","middle")


    var degree = ["low","med","high"]
    colorGridSvg
        .selectAll(".gridDegreeX")
        .data(degree)
        .enter()
        .append('text')
        .text(function(d,i){return cStops[i].join("-");})
        .attr("x",function(d,i){return i*gridSize+gridSize/2})
        .attr("y",140)
        .attr("column",function(d,i){return i})
        .attr("cursor","pointer")
        .attr("text-anchor","middle")
        .attr("text-decoration","underline")
        .attr("transform","translate(100,0)")
        .on("mouseover",function(d,i){
            var column = d3.select(this).attr("column")
            d3.selectAll(".gridCell").attr("opacity",.3)
            d3.selectAll(".c_"+column).attr("opacity",1)
            var groupName = "_"+i            
            var filter = ["==",pub.strategy+"_"+pub.coverage+"_group",groupName]
            map.setFilter("counties",filter)
            var ids = map.querySourceFeatures("counties",  { filter:filter} )
        })
        .on("mouseout",function(d,i){
            d3.selectAll(".gridCell").attr("opacity",1)
            if(clicked == false){
                var filter = null
                map.setFilter("counties",filter)
            }else{
                map.setFilter("counties",currentFilter)
            }
        })

    colorGridSvg
        .selectAll(".gridDegreeX")
        .data(degree)
        .enter()
        .append('text')
        .text(function(d,i){return pStops[i].join(" - "); return d})
        .attr("y",function(d,i){return 130-i*gridSize+5})
        .attr("text-decoration","underline")
        .attr("x",0)
        .attr("row",function(d,i){
            return i
        })
        .attr("text-anchor","end")
        .attr("transform","translate(95,-20)")
        .attr("cursor","pointer")
        .on("mouseover",function(d,i){
            var row = d3.select(this).attr('row')
            d3.selectAll(".gridCell").attr("opacity",.3)
            d3.selectAll(".m_"+row).attr("opacity",1)
            var groupName = "_"+i            
            var filter = ["==",pub.strategy.replace("percentage_scenario_","")+"_group",groupName]
            map.setFilter("counties",filter)
        })
        .on("mouseout",function(d,i){
            d3.selectAll(".gridCell").attr("opacity",1)
            if(clicked == false){
                    var filter = null
                    map.setFilter("counties",filter)
            }else{
                    map.setFilter("counties",currentFilter)
            }
        })
    
}
function formatSearch(item) {
    var selectionText = item.text.split("|");
    var $returnString = $('<span>' + selectionText[0] + '</br><b>' + selectionText[1] + '</b></br>' + selectionText[2] +'</span>');
    return $returnString;
};
function formatSelected(item) {
    var selectionText = item.text.split("|");
    var $returnString = $('<span>' + selectionText[0].substring(0, 21) +'</span>');
    return $returnString;
};

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
 
    // var option = document.createElement("OPTION");
    // option.innerHTML = "Contiguous 48"
    // option.value = "C48";
    //     option.id = "Contiguous 48"
    //
    // ddlCustomers.options.add(option);
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
          var filter = ["!=","stateAbbr"," "]
          map.setFilter("counties",filter)
           // map.flyTo({
 //               zoom:3.8,
 //               center: [-94,37],
 //               speed: 0.8, // make the flying slow
 //               curve: 1
 //               //essential: true // this animation is considered essential with respect to prefers-reduced-motion
 //           });
       }else if(this.value=="02"){
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
           var currentState = state_tiger_dict[this.value]
            pub.currentState = currentState
           
           cartoGoToState( currentState )
           d3.selectAll(".hex").attr("opacity",.5)
           d3.select("#"+currentState+"_carto").attr("opacity",1)
          // var filter = ["==","stateAbbr",currentState]
   //        map.setFilter("counties",filter)
   //
   //         map.setFilter("county-name",["==","STATEFP",this.value])
   //         map.setFilter("state-abbr",["==","STATEFP",this.value])
   //         map.setFilter("reservation-name",["==","STATE",currentState])
   //         map.setFilter("state_mask",["!=","STATEFP",this.value])
   //
           
  //    
       }
    })
    $('select').val("06")
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
function covidBarChart(column,ndx,height,width){
    var max = 0
    var min = 0

    var columnDimension = ndx.dimension(function (d) {
        if(parseFloat(d[column])>max){
            max = d[column]
        }
        if(column=="covid_casesPer100000"){
            return d[column]
        }
         if(d[column]!=-999){
            return Math.round(d[column]*100)/100;
        }    
    });
  

    var columnGroup = columnDimension.group();
        
    var divName = column.split("_")[1]
    
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
    max = max+1
    chart.elasticY(false)
    chart.y(d3.scale.pow().domain([0,100]))
    
    chart.width(width)
            .height(height)
            .margins({top: 10, right: 20, bottom: 30, left: 40})
            .dimension(columnDimension)
            .group(columnGroup)
          // .centerBar(true)
            .gap(0)
            //.elasticY(true)
            .xUnits(function(){return Math.abs(Math.round(max-min))*100;})
            .x(d3.scale.linear().domain([min,max]))
            .xAxis()
            .ticks(10)

            chart.colorAccessor(function (d, i){return d.value;})
            .colors(d3.scale.linear().domain([0,10]).range(["rgba(255,0,0,.1)",'rgba(255,0,0,.5)']))
      
        
        chart.yAxis()
            .ticks(0);
      chart.on("preRedraw", function (chart) {
          chart.rescale();
      });
      chart.on("preRender", function (chart) {
          chart.rescale();
      });		
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
