var config = null
//configureStory()
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
                description: "test",
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
            }
        ]
    };

    //console.log(config["chapters"][0]["onChapterEnter"])


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

 



 //    for(var c in capitaSet){
 //        var label = measureSet[i]+"capita"
 //        var newChapter = {}
 //        newChapter["id"]=label
 //        newChapter["title"]=capitaSetDisplayTitle[measureSet[i]]
 //        newChapter["description"]="temp"
 //        newChapter["location"]={center:userCoordinates}
 //        newChapter["onChapterEnter"] = [
 // //            {layer: label,opacity:1} ,
 // //            {layer: "least_"+label,opacity:1},
 // //             {layer: "most_"+label,opacity:1}
 //        ]
 //          newChapter["onChapterExit"] = [
 // //             {layer: label,opacity:0},
 // //             {layer: "least_"+label,opacity:0},
 // //              {layer: "most_"+label,opacity:0}
 //           ]
 //        config.chapters.push(newChapter)
 //    }

}
