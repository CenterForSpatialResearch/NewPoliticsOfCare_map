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
                ,//+"<div id=\"userLocation\">Click here to start where you are.</div><br><br>",
                location: {
                    center:[-98.57868040403291,39.82847358985151],
                    zoom:4
                },
                onChapterEnter: [
                    // {
//                         layer: measureSet[0],
//                         opacity: 0
                        //                     }
                ],
                onChapterExit: [
                    // {
 //                        layer:measureSet[0],
 //                        opacity:0
 //                    }
                ]
            },
            {
                id: 'user',
                title: 'You are here',
                image: '',
                description: "<br>",
                location: {
                    center:userCoordinates,
                    zoom:18
                },
                onChapterEnter: [
                    // {
//                         layer: measureSet[0],
//                         opacity: 0
                        //                     }
                ],
                onChapterExit: [
                    // {
 //                        layer:measureSet[0],
 //                        opacity:0
 //                    }
                ]
            },
            {
                id: 'medicaid',
                title: 'Medicaid',
                image: '',
                description: "<br>",
                location: {
                    zoom:16
                },
                onChapterEnter: [
                    // {
//                         layer: measureSet[0],
//                         opacity: 0
                        //                     }
                ],
                onChapterExit: [
                    // {
 //                        layer:measureSet[0],
 //                        opacity:0
 //                    }
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
           // config["chapters"][0]["onChapterEnter"].push({layer:"least_"+label,opacity:0})
 //           config["chapters"][0]["onChapterEnter"].push({layer:"most_"+label,opacity:0})
 //
        var newChapter = {}
        newChapter["id"]=label
       // console.log(label)
        newChapter["title"]=measureDisplayTextPop[label]
        // newChapter["location"]={center:filteredStateCentroid,zoom:6}
        newChapter["description"]=introDescription[label]+"<br>"
        newChapter["location"]={center:userCoordinates}
         newChapter["onChapterEnter"] = [
 //            {layer: label,opacity:1} ,
 //            {layer: "least_"+label,opacity:1},
 //             {layer: "most_"+label,opacity:1}
        ]
          newChapter["onChapterExit"] = [
 //             {layer: label,opacity:0},
 //             {layer: "least_"+label,opacity:0},
 //              {layer: "most_"+label,opacity:0}
           ]
        config.chapters.push(newChapter)
    }



}
