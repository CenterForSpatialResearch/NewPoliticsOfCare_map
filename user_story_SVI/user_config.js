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
                title: 'Communities can be vulnerable in many different ways - ROUGH DRAFT',
                image: '',
                description: 'COVID-19 affects our communities differently. Health and social vulnerabilities that predate the pandemic have fueled uneven effects across the United States.'
                +"<br><br>There are many ways to measure vulnerability." 
                +"<br><br>One of them, the CDC's Social Vulnerability Index<sup>1</sup>, uses 15 demographic data points from the American Community Survey <sup>1</sup> to provide a vulnerability score for each county and census tract. Here we are looking at counties."
                +"<br><br><strong>Let's start where you are</strong><br><div id=\"ipAddress\">click <u>here</u> to use your ip address for location"
                +"<br>or click on your county on the map to start there</div>",
                //+"<div id=\"userLocation\">Click here to start where you are.</div><br><br>",
                location: {
                    center:[-95,39],
                    zoom:3.5,
                    speed: .4
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
        description: "Here is the data for your county."
        +"These numbers are  collected by the Census for the 15 categories that the CDC selected"
        +"<br><br><div id=\"percents\"></div>",
        location: {},
        onChapterEnter: [],
        onChapterExit: []
    }
    
    config.chapters.push(newChapter)
    
    
    var newChapter = {
        id: 'percentile',
        title: 'How does your county compare?',
        image: '',
        description: "Here is how your county ranks across the country for the same data points "
        +"(higher % = more vulnerable)"
        +"<br><br><div id=\"percentiles\"></div>",
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
