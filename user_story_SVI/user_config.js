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
                title: 'There are many ways to measure vulnerability - SVI VERY ROUGH DRAFT',
                image: '',
                description: "One of them, the CDC's Social Vulnerability Index<sup>*</sup>, uses 15 demographic data points from the American Community Survey <sup>*</sup> to provide a vulnerability score for each county and census tract in the country. Here we are looking at data on the county level."
                +"<div id=\"ipAddress\">"
                +"<br>click on a county on the map to start there</div>",
                //+"<div id=\"userLocation\">Click here to start where you are.</div><br><br>",
                location: {
                    // center:[-95,39],
    //                 zoom:3.5,
    //                 speed: .4
                },
                onChapterEnter: [
                     {
                         layer: "base",
                         opacity: .1
                                             }
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


    var newChapter = {
        id: 'user',
        title: 'You are here',
        image: '',
        description: "",
        location: {},
        onChapterEnter: [],
        onChapterExit: []
    }
    
    config.chapters.push(newChapter)
    
    
    var newChapter = {
        id: 'neighbors',
        title: 'How does your county compare to neighboring counties?',
        image: '',
        description: "Here is how your county ranks when compared to adjacent counties.",
        location: {
           
        },
        onChapterEnter: [
            
        ],
        onChapterExit: []
    }

    config.chapters.push(newChapter)
    
    var newChapter = {
        id: 'state',
        title: 'How does your county compare to the rest of the state?',
        image: '',
        description: "Here is how your county compares in its own state.",
        location: {
           
        },
        onChapterEnter: [
            
        ],
        onChapterExit: []
    }

    config.chapters.push(newChapter)
    
    var newChapter = {
        id: 'percentile',
        title: 'How does your county compare?',
        image: '',
        description: "Here is how your county ranks across the country for the same data points "
        +"(higher % = more vulnerable)"
        +"<div id=\"percentiles\"></div>",
        location: {
            center:[-95,39],
            zoom:3.5,
            speed: .4
        },
        onChapterEnter: [
            
        ],
        onChapterExit: []
    }

    config.chapters.push(newChapter)
    
    //console.log(config["chapters"][0]["onChapterEnter"])


    // var filteredStateCentroid = formatStateCentroids(stateCentroids)[filteredToState]
    //
    // function formatStateCentroids(data){
    //     var stateCentroids = {}
    //     for(var i in data.features){
    //         var gid = data.features[i].id
    //         var centroid = data.features[i].geometry.coordinates
    //         var stateAbbr = state_tiger_dict[gid]
    //         stateCentroids[stateAbbr]=centroid
    //     }
    //     return stateCentroids
    // }

 
    


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
