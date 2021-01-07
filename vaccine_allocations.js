var pub = {
    currentState:"NY",
    column1:"Adult_pop",
    column2:"SVI",
    activeMap:"map1",
    map1Move:true,
    map2Move:false,
    dataByState:null
}
var map1
var map2
var minMaxDictionary = {}
var stateAllocationPercentMaxMin = {}
var allocationMaxs = {
}
var highlightColor = "gold"
var bghighlightColor = "gold"
var outlineColor = "#DF6D2A"
var colorColumn = "_priority"
var countyCentroids = d3.json("county_centroids.geojson")
var counties = d3.json("counties.geojson")
var usOutline = d3.json("simple_contiguous.geojson")
var timeStamp = d3.csv("https://raw.githubusercontent.com/CenterForSpatialResearch/newpoliticsofcare_analysis_vaccine/main/Vaccine_allocation/Output/time_stamp.csv")
var allData = d3.csv("https://raw.githubusercontent.com/CenterForSpatialResearch/newpoliticsofcare_analysis_vaccine/main/Vaccine_allocation/Output/County_level_proportional_vaccine_allocation.csv")

var states = d3.json("simplestates.geojson")
var carto= d3.json("cartogram.geojson")
var stateAllocations = d3.csv("https://raw.githubusercontent.com/CenterForSpatialResearch/newpoliticsofcare_analysis_vaccine/main/Vaccine_allocation/Output/State_level_vaccine_allocation.csv")


var measureSet = [
     "Adult_pop",
     "Firstphase",
     "SVI",
     "SVI_no_race"
]
var measureDisplayText = {
     Adult_pop:"Adult Population",
     Firstphase:"Healthcare & Long-term Care",
     SVI:"SVI",
     SVI_no_race:"SVI no race"
}
var measureDisplayTextPop={
     Adult_pop:"Adult Population",
     Firstphase:"Healthcare & Long-term Care",
     ADI:"Area Deprivation Index",
     PVI:"Pandemic Vulnerability Index",
     SVI:"SVI",
     SVI_no_race:"SVI no race"
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
var state_tiger_dict = {'01':'AL','02':'AK','04':'AZ','05':'AR','06':'CA','08':'CO','09':'CT','10':'DE','11':'DC','12':'FL','13':'GA',
'15':'HI','16':'ID','17':'IL','18':'IN','19':'IA','20':'KS','21':'KY','22':'LA','23':'ME','24':'MD','25':'MA','26':'MI','27':'MN',
'28':'MS','29':'MO','30':'MT','31':'NE','32':'NV','33':'NH','34':'NJ','35':'NM','36':'NY','37':'NC','38':'ND','39':'OH','40':'OK',
'41':'OR','42':'PA','44':'RI','45':'SC','46':'SD','47':'TN','48':'TX','49':'UT','50':'VT','51':'VA','53':'WA','54':'WV','55':'WI',
'56':'WY','60':'AS','66':'GU','69':'MP','72':'PR','78':'VI'}
var stateToNumber = {'WA': '53', 'DE': '10', 'DC': '11', 'WI': '55', 'WV': '54', 'HI': '15', 'FL': '12', 'WY': '56', 'NH': '33', 'NJ': '34', 'NM': '35', 'TX': '48', 'LA': '22', 'NC': '37', 'ND': '38', 'NE': '31', 'TN': '47', 'NY': '36', 'PA': '42', 'CA': '06', 'NV': '32', 'VA': '51', 'GU': '66', 'CO': '08', 'VI': '78', 'AK': '02', 'AL': '01', 'AS': '60', 'AR': '05', 'VT': '50', 'IL': '17', 'GA': '13', 'IN': '18', 'IA': '19', 'OK': '40', 'AZ': '04', 'ID': '16', 'CT': '09', 'ME': '23', 'MD': '24', 'MA': '25', 'OH': '39', 'UT': '49', 'MO': '29', 'MN': '27', 'MI': '26', 'RI': '44', 'KS': '20', 'MT': '30', 'MP': '69', 'MS': '28', 'PR': '72', 'SC': '45', 'KY': '21', 'OR': '41', 'SD': '46'}
function ready(counties,outline,centroids,modelData,timeStamp,states,carto,stateAllocations){
    //combine data
    PopulateDropDownList(states.features)
    
    var combined = combineData(modelData,counties)

    pub.dataByState = makeStateDictionary(combined)
    
    map1 = drawMap(combined,"map",pub.column1,outline)
    map2 = drawMap(combined,"map2",pub.column2,outline)
   
   
    $("#map").mouseenter(function(){
       pub.activeMap = "map1"
        //console.log(pub.activeMap)
        pub.map2Move=false
        pub.map1Move=true
        // console.log("Map1"+pub.map1Move+" Map2"+pub.map2Move)
        moveMapsTogether(map1,map2)
    });
    $("#map2").mouseenter(function(){
       pub.activeMap ="map2"
        pub.map1Move=false
        pub.map2Move=true
        moveMapsTogether(map1,map2)
    });
    
    
    //set initial state
    
    //populate dropdown 1 and 2
    //set initial data for map 1 and map 2
    //add counties layer to map 1 and map 2
    //filter each map to state
    //color each map with selected column
    //figure out other interactions
    
    
    var s = 12
    var svgList = d3.select("#list")
            .append("svg")
            .attr("width",400)
            .attr("height",pub.dataByState[pub.currentState].length*s+140)
    
    var combined = {}
    
    var list1 = sortList(pub.dataByState[pub.currentState],pub.column1)
    drawList(list1,100,"end","list1",svgList,pub.column1)   
    combined1 = combinedList(list1,combined,pub.column1)
    
    var list2 = sortList(pub.dataByState[pub.currentState],pub.column2)
    drawList(list2,300,"start","list2",svgList,pub.column2)
    combined2 = combinedList(list2,combined1,pub.column2)
        
    drawLines(combined2,svgList)
    
    for(var m in measureSet){
        console.log(measureSet[m])
        d3.select("#columns1")
            .append("div")
            .attr("class","measures1")
            .html(measureDisplayText[measureSet[m]])
            .attr("id",measureSet[m])
            .attr("cursor","pointer")
            .on("click",function(){
                if(d3.select(this).attr("id")!=pub.column1 && d3.select(this).attr("id")!=pub.column2){
                    d3.selectAll(".measures1").style("background-color","#fff").style("color","#000").style("border","1px solid #000")
                    d3.selectAll(".measures2").style("color","#000").style("border","1px solid #000")
                    d3.select(this).style("background-color","gold").style("color","#000").style("border","1px solid #000")
                    pub.column1 = d3.select(this).attr("id")
                    updateColumns()
                    //d3.select("#columns1").select("#"+pub.column2).style("color","#aaa").style("border","1px solid #aaa")
                    d3.select("#columns2").select("#"+pub.column1).style("color","#aaa").style("border","1px solid #aaa")
                    colorByPriority(map1,pub.column1)
                }
            })
            
        d3.select("#columns2")
            .append("div")
            .attr("class","measures2")
            .html(measureDisplayText[measureSet[m]])
            .attr("id",measureSet[m])
            .style("cursor","pointer")
            .on("click",function(){
                if( d3.select(this).attr("id")!=pub.column2 && d3.select(this).attr("id")!=pub.column1){
                    d3.selectAll(".measures2").style("background-color","#fff")
                    d3.selectAll(".measures1").style("color","#000").style("border","1px solid #000")
                    d3.select(this).style("background-color","gold").style("color","#000").style("border","1px solid #000")
                    pub.column2 = d3.select(this).attr("id")
                    updateColumns()
                    d3.select("#columns1").select("#"+pub.column2).style("color","#aaa").style("border","1px solid #aaa")
                    d3.select("#columns2").select("#"+pub.column1).style("color","#aaa").style("border","1px solid #aaa")
                    colorByPriority(map2,pub.column2)
                }
            })
    }
        d3.select("#columns1").select("#"+pub.column1).style("background-color","gold")
        d3.select("#columns2").select("#"+pub.column2).style("background-color","gold")
    
        d3.select("#columns1").select("#"+pub.column2).style("color","#aaa").style("border","1px solid #aaa")
        d3.select("#columns2").select("#"+pub.column1).style("color","#aaa").style("border","1px solid #aaa")
  
}
function drawNewLists(){
    var s = 12
    
    d3.select("#list svg").remove()
    var svgList = d3.select("#list")
            .append("svg")
            .attr("width",400)
            .attr("height",pub.dataByState[pub.currentState].length*s+140)
    
    var state = pub.currentState
    var c1 = pub.column1
    var c2 = pub.column2
    
    var combined = {}
    
    //do lists
    var list1 = sortList(pub.dataByState[pub.currentState],pub.column1)
    drawList(list1,100,"end","list1",svgList,pub.column1)   
    combined1 = combinedList(list1,combined,pub.column1)
    
    var list2 = sortList(pub.dataByState[pub.currentState],pub.column2)
    drawList(list2,300,"start","list2",svgList,pub.column2)
    combined2 = combinedList(list2,combined1,pub.column2)
    
    drawLines(combined2,svgList)
}

function updateColumns(){
    //console.log("update")
    
    var combined = {}
    var list1 = sortList(pub.dataByState[pub.currentState],pub.column1)
    updateListColumn(list1,"list1",pub.column1)
    combined1 = combinedList(list1,combined,pub.column1)
    
    var list2 = sortList(pub.dataByState[pub.currentState],pub.column2)
    updateListColumn(list2,"list2",pub.column2)
    combined2 = combinedList(list2,combined1,pub.column2)
     
    updateLines(combined2)
       
    //drawLines(combined2,svgList)
    
}

function updateListColumn(list,className,column){
    // console.log(list)
    // console.log(column)
    d3.select("#"+className+"_title").text(measureDisplayText[column])
    
    d3.selectAll("."+className)
    .data(list)
    .each(function(d,i){
        //console.log(d)
        d3.select("#"+className+"_"+d.FIPS)
        .transition()
        .duration(1000)
        .attr("y",parseInt(i)*12)
        .text(d.county+" "+Math.ceil(d["Proportional_allocation_to_"+column]))
    })
}

function updateLines(combined,svg){
    var line = d3.line()
        .x(function(d,i){
                return i*190+105
        })
        .y(function(d){
                return parseInt(d.order)*12-4
        })  
        
    var opacityScale = d3.scaleLinear().domain([0,40]).range([.1,1])
        for(var i in combined){
            var lineData = combined[i]            
            d3.select("#"+lineData[0].county.replace(".","_").split(" ").join("_")+"_connector")
                .data([lineData])
                .each(function(d,i){
                    d3.select("#"+lineData[0].county.replace(".","_").split(" ").join("_")+"_connector")
                            .transition()
                            .duration(1000)
                            .delay(i*100)
                            .attr("d",line)
                })
        }
    
}

function drawLines(combined,svg){
    //console.log(combined)
    var line = d3.line()
        .x(function(d,i){
                return i*190+105
        })
        .y(function(d){
                return parseInt(d.order)*12-4
        })    
    
    var opacityScale = d3.scaleLinear().domain([0,40]).range([.1,1])
        
    for(var i in combined){
        var lineData = combined[i]
        svg.append("path")
                .data([lineData])
                .attr("d",line)
               // .attr("class",lineData[0].county)
                .attr("stroke",function(d){
                    return "black"
                })
                .attr("id",function(d){return d[0].county.replace(".","_").split(" ").join("_")+"_connector"})
                .attr("class","connector")
                .attr("opacity",function(d){
                   return .3
                })
                .attr("stroke-width",4)
                .attr("stroke-linecap","round")
                .attr("transform","translate(0,15)")
                .on("mouseover",function(d){
                    console.log(d)
                })
                .attr("transform","translate(0,130)")  
            
        }
}
    

function combinedList(list,combined,column){    
    for(var i in list){
        if(list[i].FIPS!=undefined){
            var fips = list[i].FIPS
            var county = list[i].county
            
            if(Object.keys(combined).indexOf(fips)==-1){
                combined[fips]=[]
                combined[fips].push({fips:fips,county:county,order:parseInt(i),doses:list[i]["Proportional_allocation_to_"+column]})
            }else{
                combined[fips].push({fips:fips,county:county,order:parseInt(i),doses:list[i]["Proportional_allocation_to_"+column]})
            }
        }
    }
    return combined
}

function sortList(list,column){
    return list.sort(function(a,b){
            return parseFloat(b["Proportional_allocation_to_"+column])-parseFloat(a["Proportional_allocation_to_"+column])
        })
}

function drawList(list,x,anchor,className,svg,column){
    
    svg.append("text").text(measureDisplayText[column])
    .attr("id",className+"_title")
    .attr("x",x)
    .attr("y",0)
    .attr("text-anchor","middle")
    .attr("transform","translate(0,110)")
    .attr("font-size","12px")
    .attr("font-weight","bold")
    
   var s = 12
    svg.selectAll("."+className)
    .data(list)
    .enter()
    .append("text")
    .attr("class",className)
    .attr("id",function(d){return className+"_"+d.FIPS})
    .text(function(d){return d.county+" "+Math.ceil(d["Proportional_allocation_to_"+column])})
    .attr("x",x)
    .attr("text-anchor",anchor)
    .attr("y",function(d,i){
        return i*s
    })
    .attr("transform","translate(0,130)")
}

function makeStateDictionary(data){
    var stateDictionary = {}
    for(var i in data.features){
        var state = data.features[i].properties.stateAbbr
        if(Object.keys(stateDictionary).indexOf(state)==-1){
            stateDictionary[state]=[]
            stateDictionary[state].push(data.features[i].properties)
        }else{
            stateDictionary[state].push(data.features[i].properties)
        }
    }
    return stateDictionary
}

function moveMapsTogether(map1,map2){    
    
    map1.on("move",function(){            
                var zoom1 = map1.getZoom()
                var center1 = map1.getCenter()
                var zoom2 = map2.getZoom()
                var center2 = map2.getCenter()
            
            if(pub.map1Move==true){
                map2.flyTo({
                        center:map1.getCenter(),
                        zoom:map1.getZoom(),
                        speed: 1,
                        curve: 1
                    })
                }
                    
            })
    
        map2.on("move",function(){        
            var zoom1 = map1.getZoom()
            var center1 = map1.getCenter()
            var zoom2 = map2.getZoom()
            var center2 = map2.getCenter()
                if(pub.map2Move==true){
                
                map1.flyTo({
                    center:map2.getCenter(),
                    zoom:map2.getZoom(),
                    speed: 1,
                    curve: 1
                })
            }            
                
        }) 
       
}

function combineData(modelData,counties){
    //data Dictionary
    var modelDictionary = {}
    for(var m in modelData){
        if(modelData[m]["County_FIPS"]!=undefined){
            var fips = modelData[m]["County_FIPS"]
       
            if(fips.length==4){
                fips="0"+fips
            }
            var data = modelData[m]
            modelDictionary[fips]=data
        }
    }
    
    //add data to geo
    for(var c in counties.features){
        var fips = counties.features[c].properties.FIPS
        var newEntry = counties.features[c].properties
        var modelDataMatch = modelDictionary[fips]
        for(var k in modelDataMatch){
            newEntry[k]=parseFloat(modelDataMatch[k])
        }
        counties.features[c].properties=newEntry
    }
    return counties
}

function drawMap(data,div,column,outline){
    // d3.select("#"+div).style("width",window.innerWidth+"px").style("height",window.innerHeight+"px")
//
    mapboxgl.accessToken = "pk.eyJ1IjoiYzRzci1nc2FwcCIsImEiOiJja2J0ajRtNzMwOHBnMnNvNnM3Ymw5MnJzIn0.fsTNczOFZG8Ik3EtO9LdNQ"//new account
    var maxBounds = [[-190,8],[-20, 74]];
    var map = new mapboxgl.Map({
        container: div,
        style:"mapbox://styles/c4sr-gsapp/ckjiy8jxw03vp19ro3f0h6osn",
        maxZoom:10,
        zoom: 3.8,
        preserveDrawingBuffer: true,
        minZoom:3.5,
        center:[-30,80]
        //,
    //    maxBounds: maxBounds    
     });

     map.dragRotate.disable();
     map.addControl(new mapboxgl.NavigationControl(),'bottom-right');
     
    map.on("load",function(){
        map.addSource("counties",{
             "type":"geojson",
             "data":data
         })
                  
         map.addLayer({
             'id': 'counties',
             'type': 'fill',
             'source': 'counties',
             'paint': {
                 'fill-color': "#ffffff",
                 'fill-opacity':1
             },
             'filter': ['==', '$type', 'Polygon']
         });
         

         zoomToBounds(map)
             
           
     })
   
     map.on('mousemove', 'counties', function(e) {
         map.getCanvas().style.cursor = 'pointer'; 
         var feature = e.features[0]
         if(feature["properties"].FIPS!=undefined){
            console.log(feature)
         }       
         
         map.on("mouseleave",'counties',function(){
             d3.select("#mapPopup").style("visibility","hidden")
         })  
    });
    
    map.once("idle",function(){
        colorByPriority(map,column)
        map.setFilter("counties",["==","stateAbbr",pub.currentState])
        var coords = pub.bounds["36"]
        //console.log(coords)
        var bounds =  new mapboxgl.LngLatBounds(coords);
        map1.fitBounds(bounds,{padding:80},{bearing:0})
         map2.fitBounds(bounds,{padding:80},{bearing:0})
    })
    return map
}

function colorByPriority(map,column){
    map.setPaintProperty("counties", 'fill-opacity',1)
  
    var matchString = {
        property: "Percentile_ranks_"+column,
        stops: [[0,"#ddd"],[0.00001, "red"],[50,"gold"],[100, "green"]]
    }
    map.setPaintProperty("counties", 'fill-color', matchString)
}

function zoomToBounds(map){
    //https://docs.mapbox.com/mapbox-gl-js/example/zoomto-linestring/
    var bounds =  new mapboxgl.LngLatBounds([-155, 20], 
        [-55, 55]);
    map1.fitBounds(bounds,{padding:40},{bearing:0})
    map2.fitBounds(bounds,{padding:40},{bearing:0})
}
function flatDeep(arr, d = 1) {
   return d > 0 ? arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flatDeep(val, d - 1) : val), [])
                : arr.slice();
};

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

function PopulateDropDownList(features) {
           //Build an array containing Customer records.
    var sorted =features.sort(function(a,b){
        return parseInt(a.properties.GEOID) - parseInt(b.properties["GEOID"]);
        
    })          
    var ddlCustomers = document.getElementById("ddlCustomers");

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
          map1.setFilter("counties",filter)
          map2.setFilter("counties",filter)

       }else if(this.value=="02"){
           map1.flyTo({
               zoom:4,
               center: [-147.653,63.739]//,
           });
           map2.flyTo({
               zoom:4,
               center: [-147.653,63.739]//,
           });
       }
       else{
           var coords = boundsDict[this.value]
           //console.log(coords)
           var bounds =  new mapboxgl.LngLatBounds(coords);
           map1.fitBounds(bounds,{padding:80},{bearing:0})
            map2.fitBounds(bounds,{padding:80},{bearing:0})
           
       }
       var state_tiger_dict = {'01':'AL','02':'AK','04':'AZ','05':'AR','06':'CA','08':'CO','09':'CT','10':'DE','11':'DC','12':'FL','13':'GA','15':'HI','16':'ID','17':'IL','18':'IN','19':'IA','20':'KS','21':'KY','22':'LA','23':'ME','24':'MD','25':'MA','26':'MI','27':'MN','28':'MS','29':'MO','30':'MT','31':'NE','32':'NV','33':'NH','34':'NJ','35':'NM','36':'NY','37':'NC','38':'ND','39':'OH','40':'OK','41':'OR','42':'PA','44':'RI','45':'SC','46':'SD','47':'TN','48':'TX','49':'UT','50':'VT','51':'VA','53':'WA','54':'WV','55':'WI','56':'WY','60':'AS','66':'GU','69':'MP','72':'PR','78':'VI'}
       var currentState = state_tiger_dict[this.value]
       pub.currentState = currentState
       map1.setFilter("counties",["==","stateAbbr",pub.currentState])
       map2.setFilter("counties",["==","stateAbbr",pub.currentState])
       drawNewLists()
       console.log(pub.currentState)
       
       
    })
    $('select').val("36")
}

