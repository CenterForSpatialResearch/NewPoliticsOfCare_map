var config = {
    style: 'mapbox://styles/c4sr-gsapp/ckfg2z1oy1tsl19pehe3qnlzj',
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
            id: 'intro',
            title: 'Vulnerability in health',
            image: '',
            description:"COVID affects our communities differently. Vulnerabilities that predated the pandemic have fueled uneven effects across the country. Unless we address the immediate needs of the pandemic along with the longstanding inequalities embedded in the social and political landscape of the US we will come out of the current crisis just as vulnerable as when this all began."
            +"<br><br>We propose a New Deal for Public Health with a Community Health Corps of 1 million community health workers (CHWs) to lift up the health of Americans. Community health workers in the midst of a pandemic will help people get tested, trace their contacts, but they will have to tackle more than that in the short-term. They’ll have to take on the role of social workers, navigating the web of services that address the social and economic burdens of social distancing and isolation, from food and medicine delivery, rent assistance and protection from eviction,to child care and elder care. "
            +"<br><br>Beyond providing comprehensive and holistic healthcare services, community health workers are unique in their role as advocates of the community members to which they serve. It is in this capacity—as community members—that community health workers are empowered to redress the health disparities that have lingered for generations.",
            location: {
                center: [-95, 39],
                zoom:3,
                pitch: 0.00,
                bearing: 0.00
            },
            onChapterEnter: [
                {
                    layer: 'counties',
                    opacity: 1
                }
            ],
            onChapterExit: [
                {
                    layer: 'counties',
                    opacity: 0
                }
            ]
        },
        {
        id: 'vulnerabilities',
        title: 'Vulnerabilities',
        description:"But communities can be vulnerable in many different ways. For example, the CDC's Social Vulnerability Index (SVI*) aggregates fifteen factors related to socioeconomic status, household composition and disability, minority status and language, and housing type to define vulnerability in one single metric. But measured at a national scale, county by county, neither a single factor nor a single index can capture all of a community’s resource needs. Instead, we must examine vulnerability from many angles and perspectives."
            +"<br><br>Let's go to Arizona and we can show you what we mean.",
        location: {
            center: [-95, 39],
            zoom:3,
            pitch: 0.00,
            bearing: 0.00
        },
        onChapterEnter: [
            {
                layer: 'sviAll',
                opacity: 1
            }
        ],
        onChapterExit: [
            {
                layer: 'sviAll',
                opacity: 0
            }
        ]
    },
        {
            id: 'sviArizona',
            title: 'SVI in Arizona',
            image: '',
            description: 
            '<br><br><br><img src="images/story_draft2/svi.jpg">'
            +"SVI* calls attention to counties with the greatest number of its highly-vulnerable per-capita factors across the four areas of socioeconomic status, household composition and disability, minority status and language, and housing type. In Arizona we have ranked each of the fifteen counties according to its SVI* score relative to the other counties in the state. Several of the most vulnerable counties contain Indian reservations. But this is not the only way to locate vulnerable populations.",
            location: {},
            onChapterEnter: [
                {
                layer: 'state-abbr',
                    opacity: 0
                }
            ],
            onChapterExit: []
        },
        {
            id: 'ypllArizona',
            title: 'Multiple ways of defining vulnerability',
            image: '',
            description: 
            '<br><br><br><img src="images/story_draft2/ypll.jpg" width="800px">'
            +"<br><br>Years-of-Potential-Life-Lost (YPLL) is another way to examine community-specific health vulnerability in the United States, as a metric of premature death. Some of the counties which had the state’s highest values for SVI* also have the highest levels of YPLL. But other counties are newly visible as vulnerable."
            ,
            location: {},
            onChapterEnter: [],
            onChapterExit: []
        },
        {
            id: 'medicaidArizona',
            title: 'Medicaid',
            image: '',
            description: 
            '<br><br><br><img src="images/story_draft2/medicaid.jpg" width="800px">'
            +"<br><br>Another means to measure vulnerability is how many residents are enrolled in  Medicaid. The enrollment criteria shares some factors with SVI*, such as income, household composition, and points to social and economic vulnerability that can affect health."
            ,
            location: {},
            onChapterEnter: [],
            onChapterExit: []
        },
        {
            id: 'unemployementArizona',
            title: 'Unemployement',
            image: '',
            description: 
            '<br><br><br><img src="images/story_draft2/unemployement.jpg" width="800px">'
            +"<br><br>And finally, as the pandemic has rolled through the US, unemployment has dramatically risen in the past few months, and is a sign of the economic toll the virus has taken. While unemployment may not seem like a measure of health vulnerability, many Americans’ health care is tied to their jobs. With rising unemployment, many in the US are left uninsured or underinsured."
            +"<br><br>An influx of community health workers could help to address each of the underlying conditions revealed by these forms of vulnerability."
            ,
            location: {},
            onChapterEnter: [],
            onChapterExit: []
        },
        {
            id: 'covid1',
            title: 'Of course, Covid has changed this landscape',
            image: '',
            description: 
            '<br><br><br><img src="images/story_draft2/10062020_covid.png">'
            +'The direct effectsof COVID19 have exacerbated many of the pre-existing vulnerablities in the US But the pandemic has also revealed placesh with acute and immediate needs and where combating the epidemic requires an influx of community health workerss. Sometimes long-term vulnerabilities and the impact of COVID19 co-incide in our maps, but sometimes they do not.  On September 24, here is the distribution of recent COVID cases over past two weeks in Arizona. Maricopa county, the most populous county in the state which had relatively lower values for the socioeconomic and preexisting health vulnerabilities has the highest current rate of infection.'
            +"<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>"
             +"<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>"
             +"<br><br><br><br><br><br><br><br><br><br><br><br>",
            location: {},
            onChapterEnter: [],
            onChapterExit: []
        },
        {
            id: 'highlightAZ',
            title: 'Taken all together',
            image: '',
            description:'<br><br><br><img src="images/story_draft2/ALL7.png">'
                    +'These four metrics of socio-economic vulnerability and three measures of Covid19 burden show us where vulnerabilities are in the state, but the terrain of vulnerability shifts depending on which of the seven measures we use to define it. All seven expose different places as vulnerable...'
            +"<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>",  
            location: {
                center: [-109, 34.232006],
                zoom: 6,
                pitch: 0,
                bearing: 0
            },
            onChapterEnter: [
                {
                    layer: "Covid_death_capita",
                    opacity: 0
                }
            ],
            onChapterExit: [
                {
                    layer: "Covid_death_capita",
                    opacity: 0
                }
            ]
        },
        {
            id: 'highlightAZCounty',
            title: 'For some counties the levels of vulnerability described by each metric are similar, but for others they can be very different, let\'s look closer..',
            image: '',
            description: 'for example, Apache County—where much of the county falls within the Navajo Nation and the Fort Apache Reservation— has among the highest levels of vulnerability across multiple metrics. It ranks the highest in the state in Years of Potential Life Lost, has the second highest unemployment rate, and the second highest number of Medicaid enrollees per capita. As of late September, Apache county ranks in the middle for the number of Covid cases but  has the greatest total of COVID deaths per capita.', 
            location: {
                center: [-109.508795, 35.601732],
                zoom: 10,
                pitch: 0,
                bearing: 0
            },
            onChapterEnter: [
                {
                    layer: "mapbox-satellite",
                    opacity: 1
                }
            ],
            onChapterExit: [
                 {
                     layer: "mapbox-satellite",
                     opacity: 0
                 }
            ]
        },
        {
            id: 'highlightAZCounty2',
            title: 'Across the state in the southwest corner, Yuma County tells a different story',
            image: '',
            description: 'Yuma County ranks highest in the state in terms of SVI*, just above Apache County, but it has a relatively low rate of YPLL, and the second lowest unemployment rate in the state. In late September the county ranked fifth in terms of total recent COVID cases, but third in terms of total deaths from COVID per capita. In other words the county shows varying levels of vulnerability across the different metrics.', 
            location: {
                center: [-114.616099,32.685676],
                zoom: 10,
                pitch: 0,
                bearing: 0
            },
            onChapterEnter: [
                 {
                     layer: "mapbox-satellite",
                     opacity: 1
                 }
            ],
            onChapterExit: [
                {
                    layer: "mapbox-satellite",
                    opacity: 0
                }
            ]
        },
        {
            id: 'highlightAZCounty3',
            title: 'It is not surprising that Maricopa, in which  Phoenix and many of its suburbs are located–the most populous county in the state–had the highest total number of recent COVID cases in late September.',
            image: '',
            description: 'However the county is less vulnerable according to other metrics. Normalized by population, the county’s number of recent COVID cases was near the state’s median. Maricopa has the lowest number of medicaid enrollees per capita, and relatively low rates of unemployment and YPLL. ', 
            location: {
                center: [-112.067965, 33.446035],
                zoom: 14,
                pitch: 0,
                bearing: 0
            },
            onChapterEnter: [
                 {
                     layer: "mapbox-satellite",
                     opacity: 1
                 }
            ],
            onChapterExit: [
                {
                    layer: "mapbox-satellite",
                    opacity: 0
                }
            ]
        },
        {
            id: 'highlightAZCounty4',
            title: 'These seven different ways to look at vulnerability—although partial and imperfect— highlight different populations and tell sometimes conflicting stories about the needs of each county. ',
            image: '',
            description: 'Nonetheless, these different vulnerabilities help communicate the unequal distribution of risk and needs, and suggest where interventions could have the greatest impact. ', 
            location: {
                center: [-112.039339, 33.459597],
                zoom: 4,
                pitch: 0,
                bearing: 0
            },
            onChapterEnter: [
                 {
                     layer: "mapbox-satellite",
                     opacity: 0
                 }
            ],
            onChapterExit: [
                {
                    layer: "mapbox-satellite",
                    opacity: 0
                }
            ]
        },
        {
            id: 'highlightAZCounty5',
            title: 'But within states? That’s up to you.',
            image: '',
            description: "It is about how you define communities in greatest need. Here we have allocated each state’s total CHWs proportionally based on the seven types of vulnerabilities we just discussed."
            +"<br><br>These maps then can show you how allocation of CHWs changes based on which metric among the seven you would like to use to target CHWs"
            , 
            location: {
                center: [-111.662871,35.227247],
                zoom: 4,
                pitch: 0,
                bearing: 0
            },
            onChapterEnter: [
                 {
                     layer: "mapbox-satellite",
                     opacity: 0
                 }
            ],
            onChapterExit: [
                {
                    layer: "mapbox-satellite",
                    opacity: 0
                }
            ]
        },
        {
            id: 'highlightAZCounty6',
            title: 'We can also show you the trade-offs',
            image: '',
            description: '<br><br><br><img src="images/story_draft2/all_comparisons.png">'
            +'Any pair of choices sends more resources to some areas and less to others. By comparing vulnerabilities you can see how each county differs by need: who is included in each and who is left out.'
            +"<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>"
            +"<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>", 
             
            location: {
                center: [-112.098988,33.649693],
                zoom: 4,
                pitch: 0,
                bearing: 0
            },
            onChapterEnter: [
                 {
                     layer: "mapbox-satellite",
                     opacity: 0
                 }
            ],
            onChapterExit: [
                {
                    layer: "mapbox-satellite",
                    opacity: 0
                }
            ]
        },
        {
            id: 'highlightAZCounty7',
            title: '‘Explore each state on your own',
            image: '',
            description: '<span style=\"font-size:48px; color:black; letter-spacing:10px\"><a href="index.html">GO TO MAP</a></span>', 
            location: {
                center: [-109.463005,35.052533],
                zoom: 4,
                pitch: 0,
                bearing: 0
            },
            onChapterEnter: [
                 {
                     layer: "mapbox-satellite",
                     opacity: 0
                 }
            ],
            onChapterExit: [
                {
                    layer: "mapbox-satellite",
                    opacity: 0
                }
            ]
        }
    ]
};
