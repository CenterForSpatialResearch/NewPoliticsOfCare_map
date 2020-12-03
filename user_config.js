var config = null
configureStory()
function configureStory(){
    config = {
        style: 'mapbox://styles/c4sr-gsapp/ckgv55fah2szi19qfea0cnug1',
        accessToken: 'pk.eyJ1IjoiYzRzci1nc2FwcCIsImEiOiJja2J0ajRtNzMwOHBnMnNvNnM3Ymw5MnJzIn0.fsTNczOFZG8Ik3EtO9LdNQ',
        showMarkers: false,
        theme: 'light',
        alignment: 'right',
        title: '',
        subtitle: '',
        byline: '',
        footer: '',
        chapters: [
            {
                id: 'start',
                title: 'Communities can be vulnerable in many different ways',
                image: '',
                description: 'COVID-19 affects our communities differently. Health and social vulnerabilities that predate the pandemic have fueled uneven effects across the United States.'
                +"<br><br>",//+"<br><br>Our map compares four indexes of vulnerability alongside COVID-19 data and presents multiple options for addressing the effects of the pandemic with a Community Health Corps."
                // +"<br><br><strong>For a quick tour of our measures, select a state to start, then scroll down: </strong>"
//                 +"<nav id=\"placesMenu\" ><select id=\"ddlCustomers\"></select></nav>",
                location: {
                    
                },
                onChapterEnter: [
                    {
                        layer: measureSet[0],
                        opacity: 0
                    },
                    {
                        layer:"mapbox-satellite",
                        opacity:1
                    }
                ],
                onChapterExit: [
                    {
                        layer:measureSet[0],
                        opacity:0
                    }
                ]
            }
        ]
    };

    //console.log(config["chapters"][0]["onChapterEnter"])
    var introDescription = {
          "Medicaid_capita":"Vulnerability is also reflected by the number of residents enrolled in Medicaid, a means-tested health insurance program with eligibility largely determined by income. The enrollment criteria share some factors with SVI*, such as income, household composition, disability, and employment status.",
          "Unemployment_capita":"As the pandemic has rolled through the United States, unemployment has increased dramatically; this increase is a sign of the economic toll the virus has taken. For many workers in America, health care access is tied to a job. With rising unemployment, many have been left uninsured or underinsured.",
          "SVI": "SVI* calls attention to counties with the greatest number of its highly vulnerable per-capita factors across the four areas of socioeconomic status, household composition and disability, minority status and language, and housing type.",
          "YPLL":"Years of Potential Life Lost (YPLL) represents community-specific health vulnerability in the United States by measuring rates of premature death. Some of the counties that have the state’s highest values for SVI* also have the highest levels of YPLL. But other counties are newly visible as vulnerable.",
            "Covid":"The direct effects of COVID-19 have exacerbated many of the preexisting vulnerabilities in the United States. Sometimes long-term vulnerabilities and the impact of COVID-19 coincide in our maps, but sometimes they do not.",
          "Covid_capita":"Normalizing recent COVID-19 cases by population highlights the less populous counties where large proportions of a community have acquired the virus",
        "Covid_death_capita":"Cumulative COVID-19 deaths normalized by population show places that have had a severe epidemic at any time since March 2020, whether those deaths were recent or occurred months ago."
    }

    var filteredStateCentroid = formatStateCentroids(stateCentroids)[filteredToState]

    function formatStateCentroids(data){
        var stateCentroids = {}
        for(var i in data.features){
            var gid = data.features[i].id
            var centroid = data.features[i].geometry.coordinates
            var stateAbbr = state_tiger_dict[gid]
            stateCentroids[stateAbbr]=centroid
        }
        return stateCentroids
    }

    for(var i in measureSet){
        var label = measureSet[i]        //      //
           config["chapters"][0]["onChapterEnter"].push({layer:"least_"+label,opacity:0})
           config["chapters"][0]["onChapterEnter"].push({layer:"most_"+label,opacity:0})
        
        var newChapter = {}
        newChapter["id"]=label
       // console.log(label)
        newChapter["title"]=measureDisplayTextPop[label]
        // newChapter["location"]={center:filteredStateCentroid,zoom:6}
        newChapter["description"]=introDescription[label]+"<br>"
        //newChapter["location"]=[pub.centroids[least.county].lng,pub.centroids[least.county].lat]
        newChapter["onChapterEnter"] = [
            {layer: label,opacity:1} ,
            {layer: "least_"+label,opacity:1},
             {layer: "most_"+label,opacity:1}
        ]
         newChapter["onChapterExit"] = [
             {layer: label,opacity:0},
             {layer: "least_"+label,opacity:0},
              {layer: "most_"+label,opacity:0}
          ]
        config.chapters.push(newChapter)
    }

           config["chapters"][0]["onChapterEnter"].push({layer:"least_variance",opacity:0})
           config["chapters"][0]["onChapterEnter"].push({layer:"most_variance",opacity:0})


    var varianceChapter = {}
    varianceChapter["id"]="variance"
    varianceChapter["title"]="In some counties, measures of vulnerability paint very different pictures"
    varianceChapter["description"]="Here are the 2 counties with the most and least variability across the 7 rankings of vulnerability we showed."
    //newChapter["location"]=[pub.centroids[least.county].lng,pub.centroids[least.county].lat]
    varianceChapter["onChapterEnter"] = [
        {layer: "variance",opacity:1} ,
        {layer: "least_variance",opacity:1},
         {layer: "most_variance",opacity:1}
    ]
     varianceChapter["onChapterExit"] = [
         {layer: "variance",opacity:0},
         {layer: "least_variance",opacity:0},
          {layer: "most_variance",opacity:0}
      ]
    config.chapters.push(varianceChapter)
  
      var frequencyChapter = {}
      frequencyChapter["id"]="frequency"
      frequencyChapter["title"]="Counties sometimes show up as most or least vulnerable across more than one measure"
      // frequencyChapter["location"]={center:filteredStateCentroid,zoom:6}
      frequencyChapter["description"]="Here (is)are the county(counties) that displayed the most extremes in the 7 rankings of vulnerability we showed."
      //newChapter["location"]=[pub.centroids[least.county].lng,pub.centroids[least.county].lat]
     frequencyChapter["onChapterEnter"] = [
           {layer: "frequency",opacity:1} ,
     //      {layer: "least_variance",opacity:1},
     //       {layer: "least_variance",opacity:1}
      ]
       frequencyChapter["onChapterExit"] = [
            {layer: "frequency",opacity:0},
           // {layer: "least_variance",opacity:0},
           //  {layer: "most_variance",opacity:0}
        ]
    config.chapters.push(frequencyChapter)
    
    if(filteredToState=="NY"){
      //  console.log(filteredStateCentroid)
        config["chapters"][1]["location"]={center:[-74.645228, 43],zoom:6.3}
    }else{
        config["chapters"][1]["location"]={}
        
    }
    console.log(config)
}
