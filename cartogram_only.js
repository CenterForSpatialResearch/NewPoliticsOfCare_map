
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
var minMaxDictionary = {}
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
//var allData =d3.csv("County_level_proportional_allocation_for_all_policies.csv")
//var timeStamp = d3.csv("https://raw.githubusercontent.com/CenterForSpatialResearch/allocation_chw/master/Output/time_stamp.csv")
var timeStamp = d3.csv("https://raw.githubusercontent.com/CenterForSpatialResearch/newpoliticsofcare_analysis/master/Output/time_stamp.csv")
var allData = d3.csv("https://raw.githubusercontent.com/CenterForSpatialResearch/newpoliticsofcare_analysis/master/Output/County_level_proportional_allocation_for_all_policies.csv")

var states = d3.json("simplestates.geojson")

var carto= d3.json("cartogram.geojson")
var stateAllocations = d3.csv("state_level_allocation.csv")
 var measureSet = [
     "Proportional_allocation_to_Medicaid_demand",
     "Proportional_allocation_to_Unemployment",
     "Proportional_allocation_to_SVI",
     "Proportional_allocation_to_YPLL",
       "Proportional_allocation_to_Covid",
     "Proportional_allocation_to_Covid_capita",
     "Proportional_allocation_to_Covid_death_capita"
]


 var measureDisplayText = {
      Proportional_allocation_to_Medicaid_demand:"MEDICAID ENROLLEES",
      Proportional_allocation_to_SVI:"SOCIAL VULNERALBILITY INDEX <span class=\"sviAster\">*</span>",
      Proportional_allocation_to_YPLL:"YEARS OF POTENTIAL LIFE LOST RATE",
      Proportional_allocation_to_Unemployment:"UNEMPLOYMENT",
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
  
    cartogram(carto,stateAllocations)
    
}

function cartogram(data,stateAllocations){
  // Draw the map
// The svg
    var formattedState = formatState(stateAllocations)[0]
    var max = formatState(stateAllocations)[1]
    var min = formatState(stateAllocations)[2]
    var total = formatState(stateAllocations)[3]
    
    console.log(formattedState)
   // console.log([max,min,total])
  var width =800
  var height = 600
  var svg = d3.select("#cartogram").append("svg").attr("width",width).attr("height",height)
  // Map and projection
    var projection = d3.geoMercator().scale(500).translate([1300, 640]);
formatState(stateAllocations)
    var colorsArray =["#17DCFF","#7E6EFF","#E400FF"]
  var tooltip = d3.select("#nav").append("div").attr("class", "toolTip");
  
  var cScale = d3.scaleLinear().domain([min,max]).range(["#17DCFF","#E400FF"])
    // Path generator
  var path = d3.geoPath()
        .projection(projection)
  
  
    svg.append("g")
        .selectAll("path")
        .data(data.features)
        .enter()
        .append("path")
        .attr("fill",function(d){
            var state = d.properties["google_name"].replace(" (United States)","")
            var caps = state.toUpperCase()
            return cScale(formattedState[caps]);
        })
        .attr("d", path)
        .attr("stroke", "white")
        .style("cursor","pointer")
        .attr("id",function(d){return  d.properties["iso3166_2"]+"_carto"})
        .attr("class",function(d){return d.properties["iso3166_2"]+"_hex hex"})
        .on("click",function(d){
            var state = d.properties["iso3166_2"]
            cartoGoToState(state)
            d3.selectAll(".hex").attr("opacity",0.5)
            d3.select("."+state+"_hex").attr("opacity",1)
        })
        .on("mouseover",function(d){
            var state = d.properties["google_name"].replace(" (United States)","")
            var caps = state.toUpperCase()
           
            var displayString = caps+"<br>"
            +Math.floor(formattedState[caps])+" workers<br>"
            +Math.round((formattedState[caps])/total*10000)/100+"%"+" of nationwide workers"
            
            console.log(displayString)
            
            tooltip
            .style("position","absolute")
            .style("padding","5px")
            .style("border","1px solid black")
            .style("background-color","rgba(255,255,255,.9)")
              .style("left", d3.event.pageX - 50 + "px")
              .style("top", d3.event.pageY - 70 + "px")
              .style("visibility", "visible")
              .html(displayString);
        })
		.on("mouseout", function(d){ tooltip.style("visibility", "hidden");});
        
        
           //add percent
  svg.append("g")
      .selectAll("labels")
      .data(data.features)
      .enter()
      .append("text")
        .attr("x", function(d){return path.centroid(d)[0]})
        .attr("y", function(d){return path.centroid(d)[1]+10})
        .text(function(d){ 
            var state = d.properties["google_name"].replace(" (United States)","")
            var caps = state.toUpperCase()
           
            var displayString = caps+"<br>"
            +Math.floor(formattedState[caps])+" workers<br>"
            +Math.round((formattedState[caps])/total*10000)/100+"%"+" of nationwide workers"
            return Math.round((formattedState[caps])/total*10000)/100+"%"
        })
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "central")
        .style("font-size", 6)
        .style("font-family", "helvetica")
        .style("fill", "white")
        .attr("id",function(d){return  d.properties["iso3166_2"]+"_carto"})
        .attr("class",function(d){return d.properties["iso3166_2"]+"_label hexLabel"})
        .style("padding","5px")
        .style("border","1px solid black")
        .style("cursor","pointer")
  svg.append("g")
      .selectAll("labels")
      .data(data.features)
      .enter()
      .append("text")
        .attr("x", function(d){return path.centroid(d)[0]})
        .attr("y", function(d){return path.centroid(d)[1]+2})
        .text(function(d){ 
            var state = d.properties["google_name"].replace(" (United States)","")
            var caps = state.toUpperCase()
           
            return Math.floor(formattedState[caps])+" CHWs"
        })
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "central")
        .style("font-size", 6)
        .style("font-family", "helvetica")
        .style("fill", "white")
        .attr("id",function(d){return  d.properties["iso3166_2"]+"_carto"})
        .attr("class",function(d){return d.properties["iso3166_2"]+"_label hexLabel"})
        .style("padding","5px")
        .style("border","1px solid black")
        .style("cursor","pointer")

  // Add the labels
  svg.append("g")
      .selectAll("labels")
      .data(data.features)
      .enter()
      .append("text")
        .attr("x", function(d){return path.centroid(d)[0]})
        .attr("y", function(d){return path.centroid(d)[1]-10})
        .text(function(d){ return d.properties.iso3166_2})
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "central")
        .style("font-size", 12)
        .style("font-family", "helvetica")
        .style("fill", "white")
        .attr("id",function(d){return  d.properties["iso3166_2"]+"_carto"})
        .attr("class",function(d){return d.properties["iso3166_2"]+"_label hexLabel"})
        .style("padding","5px")
        .style("border","1px solid black")
        .style("cursor","pointer")
        .on("click",function(d){
            var state = d.properties["iso3166_2"]
            pub.currentState = state
            cartoGoToState(state)
            d3.selectAll(".hex").attr("opacity",0.5)
            d3.select("."+state+"_hex").attr("opacity",1)
        })
        .on("mouseover",function(d){
            console.log(d)
            var state = d.properties["google_name"].replace(" (United States)","")
            var caps = state.toUpperCase()
            var displayString = caps+"<br>"
            +Math.floor(formattedState[caps])+" workers<br>"
            +Math.round((formattedState[caps])/total*10000)/100+"%"+" of nationwide workers"
            
            tooltip
            .style("position","absolute")
            .style("padding","5px")
            .attr("border","1px solid black")
            .style("background-color","rgba(255,255,255,.9)")
              .style("left", d3.event.pageX - 50 + "px")
              .style("top", d3.event.pageY - 70 + "px")
              .style("visibility", "visible")
              .html(displayString);
        })
		.on("mouseout", function(d){ tooltip.style("visibility", "hidden");});
        
}
function formatState(stateAllocations){
   // console.log(stateAllocations)
    var max = 0
    var min = 999999999
    var total = 0
    var formatted = {}
    for(var i in stateAllocations){
        var state = stateAllocations[i]["State"]
        var value = parseFloat(stateAllocations[i]["CHW_allocation"])
        formatted[state]= value
        if(value>max){max=value}
        if(value<min){min=value}
        if(isNaN(value)==false){
            total += value
        }
    }
    return [formatted,max,min,total]
}

function cartoGoToState(state){   
    var numberToState= {'01':'AL','02':'AK','04':'AZ','05':'AR','06':'CA','08':'CO','09':'CT','10':'DE','11':'DC','12':'FL','13':'GA','15':'HI','16':'ID','17':'IL','18':'IN','19':'IA','20':'KS','21':'KY','22':'LA','23':'ME','24':'MD','25':'MA','26':'MI','27':'MN','28':'MS','29':'MO','30':'MT','31':'NE','32':'NV','33':'NH','34':'NJ','35':'NM','36':'NY','37':'NC','38':'ND','39':'OH','40':'OK','41':'OR','42':'PA','44':'RI','45':'SC','46':'SD','47':'TN','48':'TX','49':'UT','50':'VT','51':'VA','53':'WA','54':'WV','55':'WI','56':'WY','60':'AS','66':'GU','69':'MP','72':'PR','78':'VI'}//
   var stateToNumber = {'WA': '53', 'DE': '10', 'DC': '11', 'WI': '55', 'WV': '54', 'HI': '15', 'FL': '12', 'WY': '56', 'NH': '33', 'NJ': '34', 'NM': '35', 'TX': '48', 'LA': '22', 'NC': '37', 'ND': '38', 'NE': '31', 'TN': '47', 'NY': '36', 'PA': '42', 'CA': '06', 'NV': '32', 'VA': '51', 'GU': '66', 'CO': '08', 'VI': '78', 'AK': '02', 'AL': '01', 'AS': '60', 'AR': '05', 'VT': '50', 'IL': '17', 'GA': '13', 'IN': '18', 'IA': '19', 'OK': '40', 'AZ': '04', 'ID': '16', 'CT': '09', 'ME': '23', 'MD': '24', 'MA': '25', 'OH': '39', 'UT': '49', 'MO': '29', 'MN': '27', 'MI': '26', 'RI': '44', 'KS': '20', 'MT': '30', 'MP': '69', 'MS': '28', 'PR': '72', 'SC': '45', 'KY': '21', 'OR': '41', 'SD': '46'}// console.log(this.value)
   
       var coords = pub.bounds[stateToNumber[state]]
 
   //    //console.log(coords)
   if(stateToNumber[state]=="02"){
       map.flyTo({
                  zoom:4,
                  center: [-147.653,63.739]//,
              });
          }else{
              var bounds =  new mapboxgl.LngLatBounds(coords);
              map.fitBounds(bounds,{padding:100},{bearing:0})
   
          }
           
           map.setFilter("county-name",["==","STATEFP",stateToNumber[state]])
           map.setFilter("state-abbr",["==","STATEFP",stateToNumber[state]])
           map.setFilter("reservation-name",["==","STATE",state])
           map.setFilter("state_mask",["!=","STATEFP",stateToNumber[state]])     
           map.setFilter("state_mask_outline",["==","STATEFP",stateToNumber[state]])     
          
       
    var currentState = state
   var filter = ["==","stateAbbr",currentState]
   map.setFilter("counties",filter)
           $('select').val(stateToNumber[state])
    
          var stateName = stateNameDictionary[pub.currentState].toUpperCase()
          var allocated = formatState(pub.stateAllocations)[0][stateName]
          //var max = stateAllocationPercentMaxMin[pub.currentState].max
         // var min = stateAllocationPercentMaxMin[pub.currentState].min
    var max = minMaxDictionary[pub.currentState][pub.column].max
    var min = minMaxDictionary[pub.currentState][pub.column].min
    
    d3.select("#stateHeader").html("<span style=\"font-size:24px; font-weight:bold;\">"+stateName+"</span><br>"
      +"Total Workers Allocated: "+numberWithCommas(Math.floor(allocated)) +"<br>"
      )
    
    d3.select("#stateKey").html("")
    d3.select("#stateKey").append("div").attr("id","keyHeader").html("% of state workers allocated to each county")
    d3.select("#stateKey").append("div").attr("id","keyRangeMin").html(">0%").style("display","inline-block").style("padding","5px")
    d3.select("#stateKey").append("div").attr("id","keyRangeGradient")
          .style("width","150px").style("height","10px")
      .style("background-image","linear-gradient(to right, "+colors[0]+" , "+colors[1]+","+colors[2]+")")
      .style("display","inline-block")
      
    d3.select("#stateKey").append("div").attr("id","keyRangeMax").html(max+"%")
      .style("font-size","16px")
      .style("display","inline-block").style("padding","5px")
      
          
}
