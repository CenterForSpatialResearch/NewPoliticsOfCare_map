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

var colors = ["rgb(16, 182, 163)","rgb(133, 205, 98)","rgb(236, 235, 16)"]
// var colors = ["#17DCFF","#7E6EFF","#E400FF"]
// var colors = ["#E0ECF4","#9EBCDA","#8856A7"]
// var colors = ["#2D7FB8",
// "#7FCDBB",
// "#2D7FB8"]
var measureSet = [
     "Adult_pop",
     "Firstphase",
     "SVI",
     "SVI_no_race"
]
var measureDisplayText = {
     Adult_pop:"Adult Population",
     Firstphase:"Phase 1a",
     SVI:"Phase 1a w/ SVI",
     SVI_no_race:"Phase 1a w/ SVI (ex. Race)"
}
var measureDefinitionText = {
     Adult_pop:"Allocation is in proportion to the estimated adult population of each county.",
     Firstphase:"Phase 1a includes healthcare personnel & long-term care facility residents",
     SVI:"County Phase 1a estimates are weighted by the county’s Social Vulnerability Index (SVI) ranking’s 15 social factors.",
     SVI_no_race:"County Phase 1a estimates are weighted by the county’s only 14 social factors from SVI as the race/ethnicity variable (i.e., “Minority Status”) is excluded."
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
    d3.select("#title1").html("Estimated vaccines by county if allocated by: ")//+measureDisplayText[pub.column1])
    d3.select("#title2").html("Estimated vaccines by county if allocated by: ")//+measureDisplayText[pub.column2])
   
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
    
    var keySvg = d3.select("#key").append("svg").attr("width",250).attr("height",50)
    var defs = keySvg.append("defs");
     var gradient = defs.append("linearGradient")
        .attr("id", "svgGradient")
        .attr("x1", "0%")
        .attr("x2", "100%")
        .attr("y1", "0%")
        .attr("y2", "0%");

     gradient.append("stop")
        .attr('class', 'start')
        .attr("offset", "0%")
        .attr("stop-color", colors[2])
        .attr("stop-opacity", 1);

     gradient.append("stop")
        .attr('class', 'end')
        .attr("offset", "50%")
        .attr("stop-color",colors[1])
        .attr("stop-opacity", 1);
        
     gradient.append("stop")
        .attr('class', 'end')
        .attr("offset", "100%")
        .attr("stop-color", colors[0])
        .attr("stop-opacity", 1);
        
    
    keySvg.append("text").text("Maps and bar charts are colored in order of priority:")
    .attr("x",10).attr("y",10).attr("fill","white")
    .style("font-size","10px")

    keySvg.append("rect").attr("width",180).attr("height",10).attr("x",30).attr("y",30).attr("fill","url(#svgGradient)")


    keySvg.append("text").text("High Priority").attr("x",12).attr("y",25).attr("fill","white")    .style("font-size","10px")
    keySvg.append("text").text("1").attr("x",12).attr("y",39).attr("fill","white")    .style("font-size","10px")

    keySvg.append("text").attr("id","keyMaxCounties").text("62").attr("x",220).attr("y",39).attr("fill","white")    .style("font-size","10px")
    keySvg.append("text").text("Low Priority").attr("x",230).attr("y",25).attr("fill","white")    
        .style("font-size","10px")
        .attr("text-anchor","end")

    
    
    
    var s = 12
    var svgList = d3.select("#list")
            .append("svg")
            .attr("width",400)
            .attr("height",pub.dataByState[pub.currentState].length*s+180)
    
    pub.stateTotals = makeStateTotalsDictionary(stateAllocations)
      var currentStateTotal =  pub.stateTotals[stateNameDictionary[pub.currentState].split(" ").join("_").split(".").join("_")]
        
        
    svgList.append("text")
    .text(stateNameDictionary[pub.currentState]+" is allocated  "
        +numberWithCommas(currentStateTotal)
    +" total doses")
    .attr("id","stateTotals")
    .attr("x",10)
    .attr("y",135)
    .attr("font-size","14px")
    .attr("font-weight","bold")
    
    var combined = {}
    
    pub.maxDoses = 0 
    var list1 = sortList(pub.dataByState[pub.currentState],pub.column1)
   // drawList(list1,100,"end","list1",svgList,pub.column1)   
    combined1 = combinedList(list1,combined,pub.column1)
    
    var list2 = sortList(pub.dataByState[pub.currentState],pub.column2)
   // drawList(list2,300,"start","list2",svgList,pub.column2)
    combined2 = combinedList(list2,combined1,pub.column2)
        
   // drawLines(combined2,svgList)
    drawBars(combined2,svgList)
    
    for(var m in measureSet){
        //console.log(measureSet[m])
        d3.select("#columns1")
            .append("div")
            .attr("class","measures1popUp")
            .html(measureDefinitionText[measureSet[m]])
            .attr("id",measureSet[m]+"popUp")
            .style("visibility","hidden")
            .style("position","absolute")
            .style("left","150px")
            .style("width","150px")
            .style("background-color","rgba(255,255,255,.8)")
        
        d3.select("#columns1")
            .append("div")
            .attr("class","measures1")
            .html(measureDisplayText[measureSet[m]])
            .attr("id",measureSet[m])
            .style("cursor","pointer")
            .on("mouseover",function(d){
                d3.select("#"+d3.select(this).attr("id")+"popUp").style("visibility","visible")
                d3.select(this).style("font-weight","bold")
            })
            .on("mouseout",function(d){
                d3.select("#"+d3.select(this).attr("id")+"popUp").style("visibility","hidden")
                d3.select(this).style("font-weight","normal")
            })
            .on("click",function(){
                if(d3.select(this).attr("id")!=pub.column1 && d3.select(this).attr("id")!=pub.column2){
                    d3.selectAll(".measures1").style("background-color","#fff").style("color","#000").style("border","1px solid #000")
                    d3.selectAll(".measures2").style("color","#000").style("border","1px solid #000")
                    d3.select(this).style("background-color","gold").style("color","#000").style("border","1px solid #000")
                    pub.column1 = d3.select(this).attr("id")
                    updateColumns()
                    d3.select("#columns1").select("#"+pub.column2).style("color","#aaa").style("border","1px solid #aaa")
                    d3.select("#columns2").select("#"+pub.column1).style("color","#aaa").style("border","1px solid #aaa")
                    colorByPriority(map1,pub.column1)
                }
            })
            
        d3.select("#columns2")
            .append("div")
            .attr("class","measures1popUp")
            .html(measureDefinitionText[measureSet[m]])
            .attr("id",measureSet[m]+"popUp2")
            .style("visibility","hidden")
            .style("position","absolute")
            .style("right","150px")
            .style("width","150px")
            .style("background-color","rgba(255,255,255,.8)")
       
        d3.select("#columns2")
            .append("div")
            .attr("class","measures2")
            .html(measureDisplayText[measureSet[m]])
            .attr("id",measureSet[m])
            .style("cursor","pointer")
            .on("mouseover",function(d){
                d3.select("#"+d3.select(this).attr("id")+"popUp2").style("visibility","visible")
                d3.select(this).style("font-weight","bold")
            })
            .on("mouseout",function(d){
                d3.select("#"+d3.select(this).attr("id")+"popUp2").style("visibility","hidden")
                d3.select(this).style("font-weight","normal")
            })
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

function makeStateTotalsDictionary(data){
    var dict = {}
    for(var i in data){
        if(data[i].State!=undefined){
            var state = data[i].State.split(" ").join("_").split(".").join("_")
            var doses = data[i]["Vaccine_allocation"]
            var stateLabel = data[i].State
            dict[state]=doses
        }
    }

    return dict
}
function drawNewLists(){
    var s = 12
    
    d3.select("#list svg").remove()
    var svgList = d3.select("#list")
            .append("svg")
            .attr("width",400)
            .attr("height",pub.dataByState[pub.currentState].length*s+200)
    
    var state = pub.currentState
    var currentStateTotal =  pub.stateTotals[stateNameDictionary[pub.currentState].split(" ").join("_").split(".").join("_")]
    svgList.append("text")
    .text(stateNameDictionary[pub.currentState]+" is allocated  "
        +numberWithCommas(currentStateTotal)
    +" total doses")
    .attr("id","stateTotals")
    .attr("x",10)
    .attr("y",135)
    .attr("font-size","14px")
    .attr("font-weight","bold")
    
    
    
    var c1 = pub.column1
    var c2 = pub.column2
    
    var combined = {}
    pub.maxDoses = 0 
    //do lists
    var list1 = sortList(pub.dataByState[pub.currentState],pub.column1)
    //console.log(list1.length)
    d3.select("#keyMaxCounties").text(list1.length)
   // drawList(list1,100,"end","list1",svgList,pub.column1)   
    combined1 = combinedList(list1,combined,pub.column1)
    
    var list2 = sortList(pub.dataByState[pub.currentState],pub.column2)
   // drawList(list2,300,"start","list2",svgList,pub.column2)
    combined2 = combinedList(list2,combined1,pub.column2)
    
    //drawLines(combined2,svgList)
    drawBars(combined2,svgList)
}

function updateColumns(){
    //console.log("update")
    pub.maxDoses = 0 
    
    var combined = {}
    var list1 = sortList(pub.dataByState[pub.currentState],pub.column1)
    
    //updateListColumn(list1,"list1",pub.column1)
    
    combined1 = combinedList(list1,combined,pub.column1)
    
    var list2 = sortList(pub.dataByState[pub.currentState],pub.column2)
    
  //  updateListColumn(list2,pub.column2)
    
    combined2 = combinedList(list2,combined1,pub.column2)
    var orderedColumn = 0
    updateBars(combined2,orderedColumn)
       
    
}
function updateBars(data,orderedColumn){
    //console.log(data)
        var wScale = d3.scaleLinear().domain([0,pub.maxDoses]).range([3,100])
    
    d3.select("#bartitle1").text(measureDisplayText[pub.column1])
    d3.select("#bartitle2").text(measureDisplayText[pub.column2])
    
    d3.selectAll(".countyNameText")
    .data(Object.keys(data))
    .each(function(d,i){
        var fips = d        
        d3.select("#label_"+fips)
            .transition()
            .duration(1000)
            .attr("y",parseInt(data[d][orderedColumn].order)*12)
        
        
        
        d3.select("#bar1_"+fips)
            .transition()
            .duration(1000)
            .attr("y",parseInt(data[d][orderedColumn].order)*12)
            .attr("width",function(){
                return wScale(data[d][0].doses)
            })
            .attr("x",function(){
                return 230 - wScale(data[d][0].doses)
            })
        
        
        d3.select("#bar2_"+fips)
            .transition()
            .duration(1000)
            .attr("y",parseInt(data[d][orderedColumn].order)*12)
            .attr("width",function(){
                return wScale(data[d][1].doses)
            })
            
        d3.select("#num1_"+fips)
            .transition()
            .duration(1000)
            .attr("y",parseInt(data[d][orderedColumn].order)*12)
            .attr("x",function(){
                return 230 -3- wScale(data[d][0].doses)
            })
            .text(Math.floor(data[d][0].doses))
            
        d3.select("#num2_"+fips)
            .transition()
            .duration(1000)
            .attr("y",parseInt(data[d][orderedColumn].order)*12)
            .attr("x",function(){
                return 230+3+wScale(data[d][1].doses)
            })
            .text(Math.floor(data[d][1].doses))
    })
}



function mouseout(){
             d3.select("#mapPop").style("visibility","hidden")
            d3.selectAll(".compare1").attr("opacity",1)
            d3.selectAll(".compare2").attr("opacity",1)
            d3.selectAll(".compare2Text").attr("opacity",1)
            d3.selectAll(".compare1Text").attr("opacity",1)
            d3.selectAll(".countyNameText").attr("opacity",1)                 
             map1.setFilter("county_outline",["==","FIPS",""])
             map2.setFilter("county_outline",["==","FIPS",""])
}    
function mouseoverText(county,fips,doses1,doses2){
    if(parseFloat(doses1)>parseFloat(doses2)){
        var difference = "Allocating by "+measureDisplayText[pub.column1]+" means <strong><span class=\"morePopup\">"
        +numberWithCommas(Math.floor(doses1-doses2))
        +" doses more</span></strong> <br>or <strong><span class=\"morePopup\">"
        + numberWithCommas(Math.floor((doses1-doses2)/doses1*10000)/100)
        +"% more</span></strong> doses than allocating by "+measureDisplayText[pub.column2]+" for this county."
    }else{
        var difference = "Allocating by "+measureDisplayText[pub.column1]+" means <strong><span class=\"lessPopup\">"+numberWithCommas(Math.floor(doses2-doses1))
        +" doses less</span> </strong><br>or <strong><span class=\"lessPopup\">"
        + numberWithCommas(Math.floor((doses2-doses1)/doses1*10000)/100)
        +"% less</span></strong></span> doses than allocating by "+measureDisplayText[pub.column2]+" for this county."
    }
    d3.select("#mapPop")
    .html("<strong>"+county+" County</strong>"
        +"<br>Total Adult Population: <strong>"+numberWithCommas(pub.modelDictionary[fips]["Adult_pop"])+" Persons</strong>"
        +"<br><br>Doses allocated proportional to <br>"+measureDisplayText[pub.column1]+": <strong>"+numberWithCommas(Math.floor(doses1))+" doses</strong>"
        +"<br>"+measureDisplayText[pub.column2]+": <strong>"+numberWithCommas(Math.floor(doses2))+" doses</strong>"
        +"<br><br> Difference: "+ difference
    )
    //console.log(window.event.clientY,window.event.clientX)
    if(window.event.clientX+150>window.innerWidth){
        var popupLeft = window.event.clientX-180+"px"
    }else{
        var popupLeft = window.event.clientX+30+"px"
    }
    if(window.event.clientY+250>window.innerHeight){
        var popupTop = window.innderHeight-200+"px"
    }else{
        var popupTop = window.event.clientY+20+"px"
    }
    
    
    d3.select("#mapPop").style("visibility","visible")
    .style("left",popupLeft)
    .style("top",popupTop)

    d3.selectAll(".countyNameText").attr("opacity",.3)
    d3.select("#label_"+fips).attr("opacity",1)

    d3.selectAll(".compare1Text").attr("opacity",.3)
    d3.select("#num1_"+fips).attr("opacity",1)

    d3.selectAll(".compare2Text").attr("opacity",.3)
    d3.select("#num2_"+fips).attr("opacity",1)

    d3.selectAll(".compare2").attr("opacity",.3)
    d3.select("#bar2_"+fips).attr("opacity",1)

    d3.selectAll(".compare1").attr("opacity",.3)
    d3.select("#bar1_"+fips).attr("opacity",1)

     map1.setFilter("county_outline",["==","FIPS",fips])
     map2.setFilter("county_outline",["==","FIPS",fips])
}

function drawBars(combined,svg){
    // console.log("bars")
 //    console.log(combined)
    var c = 230
    var g = 1
    var topMargin =160
    
    svg.append("text").text("County")
    .attr("x",10)
    .attr("y",0)
    .attr("text-anchor","start")
    .attr("transform","translate(0,"+topMargin+")")
    .attr("font-size","13px")
    .attr("font-weight","bold")
    
    
    svg.append("text").text(measureDisplayText[pub.column1])
    .attr("id","bartitle1")
    .attr("x",c-25)
    .attr("y",0)
    .attr("class","columnHeader")
    .attr("text-anchor","end")
    .attr("transform","translate(0,"+topMargin+")")
    .attr("font-size","12px")
    .attr("font-weight","bold")
   // .style('text-decoration',"underline")
    .attr("cursor","pointer")
    .on("click",function(){
        updateBars(combined,0)
        // d3.select("#title1").style('text-decoration',"none")
//         d3.select("#title2").style('text-decoration',"underline")
        d3.select("#downArrow").transition().attr("x",c-20)
    })
    
    svg.append("text").text(" \uf063").attr("id","downArrow")
      .attr("font-family","FontAwesome")
        .attr("x",c-20)
        .attr("y",0)
    .attr("transform","translate(0,"+topMargin+")")
    .attr("font-size","12px")
    
    svg.append("text").text(measureDisplayText[pub.column2])
    .attr("id","bartitle2")
    .attr("x",c+g*25)
    .attr("y",0)
    .attr("text-anchor","start")
    .attr("class","columnHeader")
    
    .attr("transform","translate(0,"+topMargin+")")
    .attr("font-size","12px")
    .attr("font-weight","bold")
    .attr("cursor","pointer")
    .on("click",function(){
        updateBars(combined,1)
        // d3.select("#title1").style('text-decoration',"none")
 //        d3.select("#title2").style('text-decoration',"underline")//.text(measureDisplayText[pub.column2])
        d3.select("#downArrow").transition().attr("x",c+10)
    })
    
    
 svg.selectAll(".countyNameText")
    .data(Object.keys(combined))
    .enter()
    .append("text")
    .attr("class","countyNameText")
    .attr("id",function(d){return "label_"+d})
    .attr("opacity",function(d){
       return 1
    })
    .text(function(d,i){
        return combined[d][0].county
    })
    .attr("y",function(d,i){return combined[d][0].order*12})
    .attr("x",function(d,i){
        return 10
    })
    .attr("cursor","pointer")
    .attr("transform","translate(0,"+(topMargin+15)+")")  
    .on("mouseover",function(d){
        mouseoverText(combined[d][0].county,d,combined[d][0].doses,combined[d][1].doses)
    })
    .on("mouseout",function(d){
         mouseout()
        
    })
    
    
    var opacityScale = d3.scaleLinear().domain([0,40]).range([.1,1])
    var wScale = d3.scaleLinear().domain([0,pub.maxDoses]).range([3,100])
 
   // var colorScale = d3.scaleLinear().domain([Object.keys(combined).length,Object.keys(combined).length/2,0])
     var colorScale = d3.scaleLinear().domain([0,50,100])
    .range([colors[0],colors[1],colors[2]])
   
    
 svg.selectAll(".compare1Text")
    .data(Object.keys(combined))
    .enter()
    .append("text")
    .attr("cursor","pointer")
    .attr("class","compare1Text")
    .attr("opacity",function(d){
       return 1
    })
    .attr("id",function(d){return "num1_"+d})
    .text(function(d,i){
        return numberWithCommas(Math.floor(combined[d][0].doses))
    })
    .attr("y",function(d,i){return combined[d][0].order*12})
    .attr("text-anchor","end")
    .attr("x",function(d,i){
        return c-g*3-wScale(combined[d][0].doses)
    })
    .attr("transform","translate(0,"+(topMargin+15)+")")  
    .on("mouseover",function(d){
        mouseoverText(combined[d][0].county,d,pub.modelDictionary[d]["Proportional_allocation_to_"+pub.column1],pub.modelDictionary[d]["Proportional_allocation_to_"+pub.column2])
       
    })
    .on("mouseout",function(d){
        mouseout()
        
    })
    svg.selectAll(".compare2")
        .data(Object.keys(combined))
        .enter()
        .append("rect")
    .attr("cursor","pointer")
        .attr("class","compare2")
        .attr("id",function(d){return "bar2_"+d})
        .attr("opacity",function(d){
               return 1
            })
        .attr("y",function(d,i){return combined[d][0].order*12})
        .attr("x",function(d,i){
            return c+g
        })
        .attr("width",function(d,i){
            return wScale(combined[d][1].doses)
        }
        )
        .attr("height",10)
        .attr("fill",function(d){
            return colorScale(pub.modelDictionary[d]["Percentile_ranks_"+pub.column1])
            //return colorScale(combined[d][1].order)
        })
        .attr("transform","translate(0,"+(topMargin+5)+")")  
        .on("mouseover",function(d){
            
        mouseoverText(combined[d][0].county,d,pub.modelDictionary[d]["Proportional_allocation_to_"+pub.column1],pub.modelDictionary[d]["Proportional_allocation_to_"+pub.column2])
          
        })
        .on("mouseout",function(d){
             mouseout()
        })  
        
        
     svg.selectAll(".compare2Text")
        .data(Object.keys(combined))
        .enter()
        .append("text")
    .attr("cursor","pointer")
        .attr("class","compare2Text")
        .attr("id",function(d){return "num2_"+d})
        .attr("opacity",function(d){
           return 1
        })
        .text(function(d,i){
            return numberWithCommas(Math.floor(combined[d][1].doses))
        })
        .attr("y",function(d,i){return combined[d][0].order*12})
        .attr("text-anchor","start")
        .attr("x",function(d,i){
            return c+g*3+wScale(combined[d][1].doses)
        })
            .attr("transform","translate(0,"+(topMargin+15)+")")  
        .on("mouseover",function(d){
        mouseoverText(combined[d][0].county,d,pub.modelDictionary[d]["Proportional_allocation_to_"+pub.column1],pub.modelDictionary[d]["Proportional_allocation_to_"+pub.column2])
            
        })
        .on("mouseout",function(d){
            
        mouseout()
        })
          
          
    svg.selectAll(".compare1")
            .data(Object.keys(combined))
            .enter()
            .append("rect")
            .attr("class","compare1")
    .attr("cursor","pointer")
            .attr("id",function(d){return "bar1_"+d})
            .attr("opacity",function(d){
               return 1
            })
            .attr("y",function(d,i){return combined[d][0].order*12})
            .attr("x",function(d,i){
                return c-g-wScale(combined[d][0].doses)
            })
            .attr("width",function(d,i){
                //console.log(combined[d][0].doses)
                return wScale(combined[d][0].doses)
            }
            )
            .attr("height",10)
            .attr("fill",function(d){
            return colorScale(pub.modelDictionary[d]["Percentile_ranks_"+pub.column1])
                return colorScale(combined[d][0].order)
            })
            .attr("transform","translate(0,"+(topMargin+5)+")")  
            .on("mouseover",function(d){
                mouseoverText(combined[d][0].county,d,pub.modelDictionary[d]["Proportional_allocation_to_"+pub.column1],pub.modelDictionary[d]["Proportional_allocation_to_"+pub.column2])
               
            })
            .on("mouseout",function(d){
               mouseout()
        
            })
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
        
        // svg.append("circle")
    //             .attr("id",function(){return "circle_"+lineData[0].fips})
    //             .attr("cx",200)
    //             .attr("cy",function(){
    //                 var difD = lineData[0].doses-lineData[1].doses
    //                 var difO = Math.abs(lineData[0].order-lineData[1].order)
    //                 if(lineData[1].order<lineData[0].order){
    //                     return lineData[1].order*12-4+(difO*6)
    //                 }
    //                 return lineData[0].order*12-4+(difO*6)
    //             })
    //             .attr("r",10)
    //             .attr("opacity",.5)
    //             .attr("transform","translate(0,130)")
            
            // svg.append("text")
      //           .attr("class","difText")
      //           .attr("id",function(){return "text_"+lineData[0].fips})
      //           .attr("x",200)
      //           .attr("y",function(){
      //               var difD = lineData[0].doses-lineData[1].doses
      //               var difO = Math.abs(lineData[0].order-lineData[1].order)
      //               if(lineData[1].order<lineData[0].order){
      //                   return lineData[1].order*12-4+(difO*6)
      //               }
      //               return lineData[0].order*12-4+(difO*6)
      //           })
      //           .text(
      //               function(){
      //                   if(lineData[1].doses<lineData[0].doses){
      //                       return "-"+Math.floor(lineData[0].doses-lineData[1].doses)
      //                   }
      //                   return "+"+Math.floor(lineData[0].doses-lineData[1].doses)
      //               }
      //           )
      //           .attr("r",10)
      //           .attr("opacity",0)
      //           .attr("transform","translate(0,130)")
        var colorScale = d3.scaleLinear().domain([-1000,0,1000]).range(["blue","black","red"])
  
        svg.append("path")
                .data([lineData])
                .attr("d",line)
               // .attr("class",lineData[0].county)
                .attr("stroke",function(d){
                      return colorScale(lineData[0].doses-lineData[1].doses)
                })
                .attr("id",function(d){return "connector_"+lineData[0].fips})
                .attr("class","connector")
                .attr("opacity",function(d){
                   return .3
                })
                .attr("stroke-width",2)
                .attr("stroke-linecap","round")
                .on("mouseover",function(d){
                    map1.setFilter("county_outline",["==","FIPS",d[0].fips])
                    map2.setFilter("county_outline",["==","FIPS",d[0].fips])
                    d3.selectAll(".list1").attr("opacity",.3)
                    d3.selectAll(".list2").attr("opacity",.3)
                    d3.selectAll(".connector").attr("opacity",.3)
                    d3.select(this).attr("opacity",1)
                     d3.select("#text_"+d[0].fips).attr("opacity",1)
                     d3.select("#list1_"+d[0].fips).attr("opacity",1)
                     d3.select("#list2_"+d[0].fips).attr("opacity",1)
                })
                .on("mouseout",function(d){
                    map1.setFilter("county_outline",["==","FIPS",""])
                    map2.setFilter("county_outline",["==","FIPS",""])
                    d3.selectAll(".list1").attr("opacity",1)
                    d3.selectAll(".list2").attr("opacity",1)
                    d3.selectAll(".connector").attr("opacity",1)
                    d3.selectAll(".difText").attr("opacity",0)
                })
                .attr("transform","translate(0,160)")  
            
        }
}
    

function combinedList(list,combined,column){ 
      
    for(var i in list){
        if(list[i].FIPS!=undefined){
            var fips = list[i].FIPS
            var county = list[i].county
            
            if(list[i]["Proportional_allocation_to_"+column]>pub.maxDoses){
                pub.maxDoses=list[i]["Proportional_allocation_to_"+column]
            }
            
            if(Object.keys(combined).indexOf(fips)==-1){
                combined[fips]=[]
                combined[fips].push({fips:fips,county:county,order:parseInt(i),doses:list[i]["Proportional_allocation_to_"+column]})
            }else{
                combined[fips].push({fips:fips,county:county,order:parseInt(i),doses:list[i]["Proportional_allocation_to_"+column]})
            }
        }
    }
    //console.log(pub.maxDoses)
    return combined
}

function sortList(list,column){
    return list.sort(function(a,b){
            return parseFloat(b["Proportional_allocation_to_"+column])-parseFloat(a["Proportional_allocation_to_"+column])
        })
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


function drawList(list,x,anchor,className,svg,column){
    var wScale = d3.scaleLinear().domain([0,100000]).range([3,100])
    
    svg.append("text").text(measureDisplayText[column])
    .attr("id",className+"_title")
    .attr("x",function(){
        if(anchor=="start"){return 205}
        else{return 195}
    })
    .attr("y",0)
    .attr("text-anchor",function(){
        return anchor
    })
    .attr("transform","translate(0,125)")
    .attr("font-size","16px")
    .attr("font-weight","bold")
    
    svg.append("text").text("COUNTY | DOSES")
    .attr("id",className+"_title")
    .attr("x",x)
    .attr("y",0)
    .attr("text-anchor",anchor)
    .attr("transform","translate(0,140)")
    .attr("font-size","11px")
    .attr("font-weight","bold")
    
        var colorScale = d3.scaleLinear().domain([-1000,0,1000]).range(["blue","black","red"])
    
   var s = 12
    svg.selectAll("."+className)
    .data(list)
    .enter()
    .append("text")
    .attr("class",className)
    .attr("id",function(d){return className+"_"+d.FIPS})
    .text(function(d){return d.county+" "+numberWithCommas(Math.floor(d["Proportional_allocation_to_"+column]))})
    .attr("x",function(d){
        if(className =="list1"){
            return 195-wScale(d["Proportional_allocation_to_"+column])
        }else{
            return 205+wScale(d["Proportional_allocation_to_"+column])
        }
    })
    .attr("fill",function(d){console.log(d);
        if(className=="list1"){
            return "black"
        }else{
            return colorScale(d["Proportional_allocation_to_"+pub.column1]-d["Proportional_allocation_to_"+pub.column2])
        }
    })
    .attr("text-anchor",anchor)
    .attr("y",function(d,i){
        return i*s
    })
    .style("cursor","pointer")
    .attr("transform","translate(0,160)")
    .on("mouseover",function(d){
        map1.setFilter("county_outline",["==","FIPS",d.FIPS])
        map2.setFilter("county_outline",["==","FIPS",d.FIPS])
        d3.selectAll(".list1").attr("opacity",.3)
        d3.selectAll(".list2").attr("opacity",.3)
        d3.selectAll(".connector").attr("opacity",.3)
        var countyId = d3.select(this).attr("id").replace(className+"_","")

         d3.select("#list1_"+countyId).attr("opacity",1)
         d3.select("#list2_"+countyId).attr("opacity",1)
         d3.select("#connector_"+countyId).attr("opacity",1)
         d3.select("#text_"+countyId).attr("opacity",1)
        
    })
    .on("mouseout",function(d){
        map1.setFilter("county_outline",["==","FIPS",""])
        map2.setFilter("county_outline",["==","FIPS",""])
        d3.selectAll(".list1").attr("opacity",1)
        d3.selectAll(".list2").attr("opacity",1)
        d3.selectAll(".connector").attr("opacity",1)
         d3.selectAll(".difText").attr("opacity",0)
        
    })
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
    pub.modelDictionary = modelDictionary
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
   // var maxBounds = [[-190,8],[-20, 74]];
    var map = new mapboxgl.Map({
        container: div,
        style:"mapbox://styles/c4sr-gsapp/ckjiy8jxw03vp19ro3f0h6osn",
        zoom: 7,
        //preserveDrawingBuffer: true,
        minZoom:2.5,
        center:[-75.71912589189347,42.91745518794737]
        //,
    //    maxBounds: maxBounds    
     });

     map.dragRotate.disable();
     map.addControl(new mapboxgl.NavigationControl(),'bottom-right');
     
    map.on("load",function(){
       //  zoomToBounds(map)
        
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
         },"state-abbr");
         
         map.addLayer({
             'id': 'county_outline',
             'type': 'line',
             'source': 'counties',
             'paint': {
                 'line-color':"#000000",
                 'line-width':2
             }             
         });
             //console.log(map.getStyle().layers)
        map.setFilter("county_outline",["==","FIPS",""])
            
     })
   
     map.on('mousemove', 'counties', function(e) {
         map.getCanvas().style.cursor = 'pointer'; 
         var feature = e.features[0]
         if(feature["properties"].FIPS!=undefined){
            //console.log(feature)
             
             var county = feature.properties.county
             var pop = feature.properties.totalPopulation
             var column1Text = measureDisplayText[pub.column1]
             var column2Text = measureDisplayText[pub.column2]
             var column1Value = feature.properties["Proportional_allocation_to_"+pub.column1]
             var column2Value = feature.properties["Proportional_allocation_to_"+pub.column2]
             var fips = feature.properties.FIPS
             
             d3.select("#mapPop")
             .html("<strong>"+county+" County</strong>"
             //+"<br>Population: "+pop
             +"<br><br>Doses allocated by <br>"+column1Text+": "+Math.floor(column1Value)
             +"<br>"+column2Text+": "+Math.floor(column2Value)
             )
             //console.log(window.event.clientY,window.event.clientX)
             // d3.select("#mapPop").style("visibility","visible")
//              .style("left",window.event.clientX+30+"px")
//              .style("top",window.event.clientY+"px")
             mouseoverText(county,fips,column1Value,column2Value)
        }       
         
         map.on("mouseleave",'counties',function(){
             
               mouseout()
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

