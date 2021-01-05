var pub = {
    startState:"NY",
    column1:"Adult_pop",
    column2:"SVI",
    activeMap:"map1",
    map1Move:true,
    map2Move:false
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
     "Proportional_allocation_to_Adult_pop",
     "Proportional_allocation_to_Firstphase",
     "Proportional_allocation_to_SVI",
     "Proportional_allocation_to_SVI_no_race"
]
var measureDisplayText = {
     Proportional_allocation_to_Adult_pop:"Adult Population",
     Proportional_allocation_to_Firstphase:"Healthcare & Long-term Care",
     Proportional_allocation_to_SVI:"SVI",
     Proportional_allocation_to_SVI_no_race:"SVI no race"
}
var measureDisplayTextPop={
     Proportional_allocation_to_Adult_pop:"Adult Population",
     Proportional_allocation_to_Firstphase:"Healthcare & Long-term Care",
     Proportional_allocation_to_ADI:"Area Deprivation Index",
     Proportional_allocation_to_PVI:"Pandemic Vulnerability Index",
     Proportional_allocation_to_SVI:"SVI",
     Proportional_allocation_to_SVI_no_race:"SVI no race"
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
var state_tiger_dict = {'01':'AL','02':'AK','04':'AZ','05':'AR','06':'CA','08':'CO','09':'CT','10':'DE','11':'DC','12':'FL','13':'GA','15':'HI','16':'ID','17':'IL','18':'IN','19':'IA','20':'KS','21':'KY','22':'LA','23':'ME','24':'MD','25':'MA','26':'MI','27':'MN','28':'MS','29':'MO','30':'MT','31':'NE','32':'NV','33':'NH','34':'NJ','35':'NM','36':'NY','37':'NC','38':'ND','39':'OH','40':'OK','41':'OR','42':'PA','44':'RI','45':'SC','46':'SD','47':'TN','48':'TX','49':'UT','50':'VT','51':'VA','53':'WA','54':'WV','55':'WI','56':'WY','60':'AS','66':'GU','69':'MP','72':'PR','78':'VI'}
var stateToNumber = {'WA': '53', 'DE': '10', 'DC': '11', 'WI': '55', 'WV': '54', 'HI': '15', 'FL': '12', 'WY': '56', 'NH': '33', 'NJ': '34', 'NM': '35', 'TX': '48', 'LA': '22', 'NC': '37', 'ND': '38', 'NE': '31', 'TN': '47', 'NY': '36', 'PA': '42', 'CA': '06', 'NV': '32', 'VA': '51', 'GU': '66', 'CO': '08', 'VI': '78', 'AK': '02', 'AL': '01', 'AS': '60', 'AR': '05', 'VT': '50', 'IL': '17', 'GA': '13', 'IN': '18', 'IA': '19', 'OK': '40', 'AZ': '04', 'ID': '16', 'CT': '09', 'ME': '23', 'MD': '24', 'MA': '25', 'OH': '39', 'UT': '49', 'MO': '29', 'MN': '27', 'MI': '26', 'RI': '44', 'KS': '20', 'MT': '30', 'MP': '69', 'MS': '28', 'PR': '72', 'SC': '45', 'KY': '21', 'OR': '41', 'SD': '46'}
function ready(counties,outline,centroids,modelData,timeStamp,states,carto,stateAllocations){
    //combine data
    var combined = combineData(modelData,counties)
    console.log(combined)
    
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
    
  
    // moveMapsTogether(map1,map2)
  //   moveMapsTogether(map2,map1)
    
    //populate dropdown
    PopulateDropDownList(states.features,map)
    
    
    //set initial state
    //populate dropdown 1 and 2
    //set initial data for map 1 and map 2
    //add counties layer to map 1 and map 2
    //filter each map to state
    //color each map with selected column
    
    //figure out other interactions
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
                 'fill-color': "#000000",
                 'fill-opacity':1
             },
             'filter': ['==', '$type', 'Polygon']
         });
         

         zoomToBounds(map)
             
        //   map.setFilter("counties",["==","stateAbbr",stateToNumber[pub.startState]])
           
     })
   
     map.on('mousemove', 'counties', function(e) {
         map.getCanvas().style.cursor = 'pointer'; 

         var feature = e.features[0]
         if(feature["properties"].FIPS!=undefined){
           // console.log(feature)
         }       
         
         map.on("mouseleave",'counties',function(){
             d3.select("#mapPopup").style("visibility","hidden")
         })  
    });
    
    map.once("idle",function(){
        colorByPriority(map,column)     
        console.log(map.getStyle().layers)
        
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

function zoomToBounds(map){
    //https://docs.mapbox.com/mapbox-gl-js/example/zoomto-linestring/
    var bounds =  new mapboxgl.LngLatBounds([-155, 20], 
        [-55, 55]);
    map.fitBounds(bounds,{padding:40},{bearing:0})
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

function PopulateDropDownList(features,map) {
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
          map.setFilter("counties",filter)

       }else if(this.value=="02"){
           map.flyTo({
               zoom:4,
               center: [-147.653,63.739]//,
           });
       }
       else{
           var coords = boundsDict[this.value]
           //console.log(coords)
           var bounds =  new mapboxgl.LngLatBounds(coords);
           map.fitBounds(bounds,{padding:40},{bearing:0})
           var state_tiger_dict = {'01':'AL','02':'AK','04':'AZ','05':'AR','06':'CA','08':'CO','09':'CT','10':'DE','11':'DC','12':'FL','13':'GA','15':'HI','16':'ID','17':'IL','18':'IN','19':'IA','20':'KS','21':'KY','22':'LA','23':'ME','24':'MD','25':'MA','26':'MI','27':'MN','28':'MS','29':'MO','30':'MT','31':'NE','32':'NV','33':'NH','34':'NJ','35':'NM','36':'NY','37':'NC','38':'ND','39':'OH','40':'OK','41':'OR','42':'PA','44':'RI','45':'SC','46':'SD','47':'TN','48':'TX','49':'UT','50':'VT','51':'VA','53':'WA','54':'WV','55':'WI','56':'WY','60':'AS','66':'GU','69':'MP','72':'PR','78':'VI'}
           var currentState = state_tiger_dict[this.value]
            pub.currentState = currentState
           
           cartoGoToState( currentState )
           d3.selectAll(".hex").attr("opacity",.5)
           d3.select("#"+currentState+"_carto").attr("opacity",1)

       }
    })
    $('select').val("06")
}

