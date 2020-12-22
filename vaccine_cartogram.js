function cartogram(data,stateAllocations){
    var formattedState = formatState(stateAllocations)[0]
    var max = formatState(stateAllocations)[1]
    var min = formatState(stateAllocations)[2]
    var total = formatState(stateAllocations)[3]
    // console.log([max,min,total])
    var width =300
    var height = 160
    var svg = d3.select("#cartogram").append("svg").attr("width",width).attr("height",height)
    // Map and projection
    var projection = d3.geoMercator().scale(208).translate([540, 240]);
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
            var caps = state//.toUpperCase()
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
            //console.log(d)
            var state = d.properties["google_name"].replace(" (United States)","")
           // var caps = state//.toUpperCase()
           //console.log(formattedState[caps])
            //console.log(formattedState[state])
            var value = parseFloat(formattedState[state])

            var displayString = state+"<br>"
            +String(formattedState[state])+" doses<br>"
            +Math.round((value/total*10000)/100)+"%"+" of nationwide doses"
            
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
        

  // Add the labels
  svg.append("g")
      .selectAll("labels")
      .data(data.features)
      .enter()
      .append("text")
        .attr("x", function(d){return path.centroid(d)[0]})
        .attr("y", function(d){return path.centroid(d)[1]})
        .text(function(d){ return d.properties.iso3166_2})
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "central")
        .style("font-size", 10)
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
            var state = d.properties["google_name"].replace(" (United States)","")
            var caps = state.toUpperCase()

            var value = parseFloat(formattedState[state])

            var displayString = state+"<br>"
            +String(formattedState[state])+" doses<br>"
            +Math.round((value/total*10000)/100)+"%"+" of nationwide doses"
            
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
        var value = parseFloat(stateAllocations[i]["Vaccine_allocation"])
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
    
          var stateName = stateNameDictionary[pub.currentState]//.toUpperCase()
          var allocated = formatState(pub.stateAllocations)[0][stateName]
          //var max = stateAllocationPercentMaxMin[pub.currentState].max
         // var min = stateAllocationPercentMaxMin[pub.currentState].min
    var max = minMaxDictionary[pub.currentState][pub.column].max
    var min = minMaxDictionary[pub.currentState][pub.column].min
    colorByPriority(map)
    d3.select("#stateHeader").html("<span style=\"font-size:24px; font-weight:bold;\">"+stateName+"</span><br>"
      +"Total doses Allocated: "+numberWithCommas(Math.floor(allocated)) +"<br>"
      )
    
    d3.select("#stateKey").html("")
    d3.select("#stateKey").append("div").attr("id","keyHeader").html("% of state doses allocated to each county")
    d3.select("#stateKey").append("div").attr("id","keyRangeMin").html(">0%").style("display","inline-block").style("padding","5px")
    d3.select("#stateKey").append("div").attr("id","keyRangeGradient")
          .style("width","150px").style("height","10px")
      .style("background-image","linear-gradient(to right, "+colors[0]+" , "+colors[1]+","+colors[2]+")")
      .style("display","inline-block")
      
    d3.select("#stateKey").append("div").attr("id","keyRangeMax").html(Math.round(max)+"%")
      .style("font-size","16px")
      .style("display","inline-block").style("padding","5px")
      
          
}