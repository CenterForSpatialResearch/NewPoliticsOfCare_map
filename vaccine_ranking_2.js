var pub = {
    currentState:"NY",
    column1:"SVI",
    column2:"Adult_pop",
    activeMap:"map1",
    map1Move:true,
    map2Move:false,
    dataByState:null,
    maxDoses:0,
    modelDictionary:null
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

var colors = ["rgb(236, 235, 16)","rgb(133, 205, 98)","rgb(16, 182, 163)"]
var colors = ["#50ac72",
"#c9578c",
"#8675ca",
"#c96840"]

var measureSet = [
     "Adult_pop",
     "Firstphase",
     "SVI",
     "SVI_no_race"
]
var measureDisplayText = {
     Adult_pop:"Adult Population",
     Firstphase:"Healthcare/Long-term",
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
    var formatted =calculateDifferences(modelData)
    pub.modelDictionary = formatByFips(formatted)
    
    var geoByFips = featuresByFips(counties.features)
    //calculate all the rankings ranges
    //sort and list
    var list = sortBy(formatted,"coverage_Firstphase")
    drawList(list,geoByFips)
    
   // console.log(list)
    var groups = makeGroups(list)
    var maxs = groups[0]
    var mins = groups[1]
   // console.log(maxs)
  //  console.log(mins)
    drawMap(counties,maxs)
    
    var keySvg = d3.select("#key").append("svg").attr("width",200).attr("height",150)
    for(var m in measureSet){
        var measure = measureSet[m]
        var color = colors[m]
        keySvg.append("rect").attr("width",20).attr("height",20).attr("fill",color).attr("x",10).attr("y",m*30+20)
        keySvg.append("text").attr("fill",color).attr("x",35).attr("y",m*30+37).text(measure)
        
    }
    // for(var max in maxs){
  //       var gids = maxs[max]
  //       d3.select("#map").append("div").attr("id","title_"+max).attr("class","mapTitle").html("Counties that received <strong><u>maximum</u></strong> doses when allocating by "+measureDisplayText[max])
  //       d3.select("#map").append("div").attr("id","max_"+max).style("width","600px").style("height","300px")
  //       drawMap("max_"+max,gids,counties,max)
  //       //break
  //   }
        //
    // for(var min in mins){
    //     var gids = mins[min]
    //     d3.select("#map").append("div").attr("id","title_"+min).attr("class","mapTitle").html("Counties that received <strong><u>minimum</u></strong> doses when allocating by "+measureDisplayText[min])
    //     d3.select("#map").append("div").attr("id","min_"+min).style("width","600px").style("height","300px")
    //     drawMap("min_"+min,gids,counties,min)
    //     //break
    // }
    //
    //click on county to move map
    //add some text to map - population, density, etc.   
    //what counties benefit most from each?
    //what counties vary most?
    //what are the counties that get most % coverage for each?
    //what counties get more coverage?
}
function formatByFips(data){
    var formatted = {}
    for(var i in data){
     var fips = data[i]["County_FIPS"]  
        if(fips!=undefined){
            if(fips.length==4){
                fips = "0"+fips
            }
            formatted[fips]=data[i]
        } 
        
    }
    return formatted
}
function makeGroups(list){
    var maxGroups = {}
    var minGroups = {}
    for(var m in measureSet){
        maxGroups[measureSet[m]]=[]
        minGroups[measureSet[m]]=[]
    }

    
    for(var i in list){
        // console.log(list[i])
 //        break
       var fips = list[i]["County_FIPS"]
        if(fips!=undefined){
            if(fips.length==4){
                fips = "0"+fips
            }
            var maxKey = list[i]["maxKey"]
            var minKey = list[i]["minKey"]
            if(maxKey!=undefined){
                maxGroups[maxKey].push(fips)
                minGroups[minKey].push(fips)
            }
            
        }
       
    }
    
    return [maxGroups,minGroups]
}

function drawList(list,geo){
    var tableHeaders = ["coverage_Adult_pop", "coverage_Firstphase", "coverage_SVI","coverage_SVI_no_race"]
    d3.selectAll("tr").remove()
    
   // console.log(list)
    var listDiv = d3.select("#list").append("table")
    var header = listDiv.append("tr")
    var th = header.append("th").html("County")
    .attr("id","countyHeader")
        .on("click",function(){
            var newList = sortBy(list,"County")
            drawList(newList,geo)
        })
    var th = header.append("th").html("Adult Population")
        .on("click",function(){
            var newList = sortBy(list,"Adult_pop")
            drawList(newList,geo)
        })
    
    for(var t in tableHeaders){
        var column = tableHeaders[t]
        var th = header.append("th").html("% of adult population covered by "+measureDisplayText[tableHeaders[t].replace("coverage_","")])
        .attr("id",function(){ return tableHeaders[t]})
        
        .on("click",function(){
            var id = d3.select(this).attr("id").replace("#","")
            var newList = sortBy(list,id)
            drawList(newList,geo)
        })
    }
    header.append("th").html("range")
        .on("click",function(){
            var newList = sortBy(list,"percentRange")
            drawList(newList,geo)
        })
    
    
    for(var i in list){
        var fips = list[i]["County_FIPS"]
        if(fips!=undefined){
            if(fips.length==4){
                fips = "0"+fips
            }
            var row = listDiv.append("tr").attr("class","row")
            var td = row.append("td").html(geo[fips].county+", "+geo[fips].stateAbbr)
            var td = row.append("td").html(list[i]["Adult_pop"])
        
            for(var t in tableHeaders){
                var td = row.append("td").html(Math.round(list[i][tableHeaders[t]]*100)/100+"%")
            }
            row.append("td").html(Math.round(list[i]["percentRange"]*100)/100+"%")
            
        }
       
    }
    
}

function featuresByFips(data){
    var formatted = {}
    for(var i in data){
        var gid = data[i].properties.FIPS
        formatted[gid]=data[i].properties
    }
    return formatted
}
function calculateDifferences(data){
    var formatted = []
    for(var i in data){
        //console.log(data[i])
        var newEntry = data[i]
        var max = 0
        var min = 10**10
        var maxKey = null
        var minKey = null
        var adultPop = parseInt(data[i]["Adult_pop"])
        for(var m in measureSet){
            var key = measureSet[m]
            var value = parseInt(data[i]["Proportional_allocation_to_"+key])
            var percentCoverage = value/adultPop*100
            
            newEntry["coverage_"+key]=percentCoverage
            
            if(value>max){
                max = value
                maxKey = key
            }
            if(value<min){
                min = value
                minKey = key
            }
        }
        var maxDif = max-min
        newEntry["range"]=maxDif
        newEntry["max"]=max
        newEntry["min"]=min
        newEntry["maxKey"]=maxKey
        newEntry["minKey"]=minKey
        newEntry["percentRange"]=maxDif/adultPop*100
        formatted.push(newEntry)
    }
    return formatted
}

function sortBy(data, column){
    return data.sort(function(a,b){
        return b[column]-a[column]
    })
}


function drawMap(geoData,lists){
    //console.log(list)
//
    mapboxgl.accessToken = "pk.eyJ1IjoiYzRzci1nc2FwcCIsImEiOiJja2J0ajRtNzMwOHBnMnNvNnM3Ymw5MnJzIn0.fsTNczOFZG8Ik3EtO9LdNQ"//new account
   // var maxBounds = [[-190,8],[-20, 74]];
    var map = new mapboxgl.Map({
        container: "map",
        style:"mapbox://styles/c4sr-gsapp/ckjiy8jxw03vp19ro3f0h6osn",
        zoom: 3,
        center:[-95,40],
        minZoom:2.5
        //,
    //    maxBounds: maxBounds    
     });

     map.dragRotate.disable();
     map.addControl(new mapboxgl.NavigationControl(),'bottom-right');
     
    map.on("load",function(){
       //  zoomToBounds(map)
        
        map.addSource("counties",{
             "type":"geojson",
             "data":geoData
         })
         
         map.addLayer({
             'id': "counties",
             'type': 'fill',
             'source': 'counties',
             'paint': {
                 'fill-color': "#000",
                 'fill-opacity':.5
             },
             'filter': ['==', '$type', 'Polygon']
         },"state-abbr");  
         
         map.addLayer({
             'id': 'county_outline',
             'type': 'line',
             'source': 'counties',
             'paint': {
                 'line-color':"#fff",
                 'line-width':.1
             }             
         });
                 //
          for(var m in measureSet){
              var measure = measureSet[m]
              var list = lists[measure]
              var gids = []
              
              map.addLayer({
                  'id': measureSet[m],
                  'type': 'fill',
                  'source': 'counties',
                  'paint': {
                      'fill-color': colors[m],
                      'fill-opacity':1
                  },
                  'filter': ['==', '$type', 'Polygon']
              },"state-abbr");
              
              map.setFilter(measureSet[m],["in","FIPS"].concat(list))
         
          }      
        
             //console.log(map.getStyle().layers)
       // map.setFilter("county_outline",["==","FIPS",""])
            
     })
   
     map.on('mousemove', 'counties', function(e) {
         map.getCanvas().style.cursor = 'pointer'; 
         var feature = e.features[0]
         if(feature["properties"].FIPS!=undefined){
            var fips = feature["properties"]["FIPS"]
            var population = feature["properties"]["totalPopulation"]
            var county = feature["properties"]["county"]+", "+feature["properties"]["stateAbbr"]
            var fipsData = pub.modelDictionary[fips]
             
             var adultD = Math.floor(fipsData["Proportional_allocation_to_Adult_pop"])
             var firstPhaseD = Math.floor(fipsData["Proportional_allocation_to_Firstphase"])
             var sviD = Math.floor(fipsData["Proportional_allocation_to_SVI"])
             var sviNoRaceD = Math.floor(fipsData["Proportional_allocation_to_SVI_no_race"])
            
             var adultP = Math.floor(fipsData["Adult_pop"])
             var firstPhaseP = Math.floor(fipsData["Firstphase"])
             var sviP = Math.floor(fipsData["SVI"]*100)/100
             var sviNoRaceP = Math.floor(fipsData["SVI_no_race"]*100)/100
             
             var adultPC = Math.floor(fipsData["coverage_Adult_pop"])
             var firstPhasePC = Math.floor(fipsData["coverage_Firstphase"])
             var sviPC = Math.floor(fipsData["coverage_SVI"]*100)/100
             var sviNoRacePC = Math.floor(fipsData["coverage_SVI_no_race"]*100)/100
            
            d3.select("#popup").html(county+"<br>"
                +"Total Population:"+population+"<br>"+"<br>"
                +"Adult: "+adultP+" Persons allocates "+ adultD+" Doses"+"<br>"
                +"1a: "+firstPhaseP+" Persons allocates "+ firstPhaseD+" Doses"+"<br>"
                +"SVI: "+sviP+" allocates "+ sviD+" Doses"+"<br>"
                +"SVI-race: "+sviNoRaceP+" allocates "+ sviNoRaceD+" Doses"
            )
            .style("left",(window.event.clientX+20)+"px")
            .style("top",window.event.clientY+"px")
        }       
         
         // map.on("mouseleave",'counties',function(){
  //
  //        }) 
    });
    
    map.once("idle",function(){
   //     map.setFilter("counties",["in","FIPS"].concat(list))
        
        //var coords = pub.bounds["36"]
        //console.log(coords)
        // var bounds =  new mapboxgl.LngLatBounds(coords);
//         map1.fitBounds(bounds,{padding:80},{bearing:0})
//          map2.fitBounds(bounds,{padding:80},{bearing:0})
    })
    return map
}
function colorByPriority(map,column){
    map.setPaintProperty("counties", 'fill-opacity',1)  
    var matchString = {
        property: "Percentile_ranks_"+column,
        stops: [[0,colors[0]],[50, colors[1]],[100, colors[2]]]
    }
    map.setPaintProperty("counties", 'fill-color', matchString)
}
function zoomToBounds(map){
    //https://docs.mapbox.com/mapbox-gl-js/example/zoomto-linestring/
    var bounds =  new mapboxgl.LngLatBounds([-155, 20], 
        [-55, 55]);
    map1.fitBounds(bounds,{padding:10},{bearing:0})
    map2.fitBounds(bounds,{padding:10},{bearing:0})
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
           map1.fitBounds(bounds,{padding:0},{bearing:0})
            map2.fitBounds(bounds,{padding:0},{bearing:0})
        //   var maxcoords = [[coords[0][0]-3,coords[0][1]-3],[coords[1][0]+3,coords[1][1]+3]]
           // var maxBounds = new mapboxgl.LngLatBounds(maxcoords);
   //         console.log(coords)
   //         map1.setMaxBounds(maxBounds)
           
       }
       var state_tiger_dict = {'01':'AL','02':'AK','04':'AZ','05':'AR','06':'CA','08':'CO','09':'CT','10':'DE','11':'DC','12':'FL','13':'GA','15':'HI','16':'ID','17':'IL','18':'IN','19':'IA','20':'KS','21':'KY','22':'LA','23':'ME','24':'MD','25':'MA','26':'MI','27':'MN','28':'MS','29':'MO','30':'MT','31':'NE','32':'NV','33':'NH','34':'NJ','35':'NM','36':'NY','37':'NC','38':'ND','39':'OH','40':'OK','41':'OR','42':'PA','44':'RI','45':'SC','46':'SD','47':'TN','48':'TX','49':'UT','50':'VT','51':'VA','53':'WA','54':'WV','55':'WI','56':'WY','60':'AS','66':'GU','69':'MP','72':'PR','78':'VI'}
       var currentState = state_tiger_dict[this.value]
       pub.currentState = currentState
       map1.setFilter("counties",["==","stateAbbr",pub.currentState])
       map2.setFilter("counties",["==","stateAbbr",pub.currentState])
       drawNewLists()
       //console.log(pub.currentState)
       
       
    })
    $('select').val("36")
}

