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
            onChapterEnter: [],
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
             +"<br><br><br><br><br><br>",
            location: {},
            onChapterEnter: [],
            onChapterExit: []
        },
        {
            id: 'highlightAZ',
            title: 'Taken all together these 4 indexes and 3 measures of Covid19 burden show us where vulnerabilities are in the state but the terrain of vulnerability shifts depending on which  of the seven measures we use to define it.',
            image: '',
            description: 'All 7 expose different places as vulnerable...<br><br> [This will be a map that shows a layer that points to counties for the most for each of the 7], [SO WILL THIS SHOW ALL SEVEN METRICS FOR AZ SIDE-BY-SIDE?]', 
            location: {
                center: [-109, 34.232006],
                zoom: 6,
                pitch: 0,
                bearing: 0
            },
            onChapterEnter: [
                {
                    layer: "Covid_death_capita",
                    opacity: 1
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
            title: 'Each county has a range depending on which vulnerability is measured, let\'s look closer...',
            image: '',
            description: 'for example, Navajo County in AZ ranks the highest the state in Medicaid enrollment, but not that. Its population makeup is ... average income is ... age ...', 
            location: {
                center: [-110.146788,34.906213],
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
            title: 'And across the state in the southwest corner,',
            image: '',
            description: 'Yuma county tells a  a different story, and ranks the highest in unemployment and SVI', 
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
            title: 'But you have to cross back to the northeast of the state to Apache County to find the highest rates of YPLL',
            image: '',
            description: '', 
            location: {
                center: [-109.5399656,35.780524],
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
            id: 'highlightAZCounty4',
            title: 'But for COVID19',
            image: '',
            description: 'it all changes. Maricopa County has the highest recent COVID19 cases', 
            location: {
                center: [-112.039339, 33.459597],
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
            id: 'highlightAZCounty5',
            title: 'But for COVID19',
            image: '',
            description: 'While Coconino County to the north has the highest per capita burden of recent COVID19 cases. ', 
            location: {
                center: [-111.662871,35.227247],
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
            id: 'highlightAZCounty6',
            title: 'But for COVID19',
            image: '',
            description: 'But for COVID19, it all changes. Maricopa County has the highest recent COVID19 cases.', 
            location: {
                center: [-112.098988,33.649693],
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
            id: 'highlightAZCounty7',
            title: 'While we are back to Apache county in the northeast of the state to find the highest number of cumulative deaths in the state.',
            image: '',
            description: '', 
            location: {
                center: [-109.463005,35.052533],
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
            id: 'highlightAZCounty8',
            title: 'Seven ways to look at vulnerability',
            image: '',
            description: 'and the counties with the highest need are different in many cases. only apache county with ypll and cumulative covid19 cases and yuma county with unemployment and svi rank highest in more than one metric. in fact the correlations between each of these measures can be seen here for arizona (suzan’s graphic)  but these patterns and correlations change by state...', 
            location: {
                center: [-109.463005,35.052533],
                zoom: 6,
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
            id: 'CT',
            title: 'And across the country, CT exhibits similar patterns',
            image: '',
            description: 'Here, ___ is concentrated in ___ and ... is concentrated in ...', 
            location: {
                center: [-72.661883, 41.704817],
                zoom: 9,
                pitch: 0,
                bearing: 0
            },
            onChapterEnter: [
                {
                    layer: "CT",
                    opacity: 1
                }
            ],
            onChapterExit: [
                {
                    layer: "CT",
                    opacity: 0
                }
            ]
        },
        {
            id: 'NY',
            title: 'While its neighbor New York is completely different ...',
            image: '',
            description: 'Here, ___ is concentrated in ___ and ... is concentrated in ...', 
            location: {
                center: [-74.668854,43],
                zoom: 6,
                pitch: 0,
                bearing: 0
            },
            onChapterEnter: [
                {
                    layer: "NY",
                    opacity: 1
                }
            ],
            onChapterExit: [
                {
                    layer: "NY",
                    opacity: 0
                }
            ]
        },
        {
            id: 'allocation',
            title: 'if all these vulnerabilities are in different places ... how do we help?',
            image: '',
            description: 'We can start here ...Imagine 1,000,000  Community Health Workers ...  community health workers do this... each of these vulnerabilities mean a different way of allocating community health workers.'
            +'<br><br>Where should they go? ...', 
            location: {
                center: [-95, 39],
                zoom:3,
                pitch: 0.00,
                bearing: 0.00
            },
            onChapterEnter: [
                {
                    layer: 'allocation',
                    opacity: 1
                }
            ],
            onChapterExit: [
                {
                    layer: 'allocation',
                    opacity: 0
                }
            ]
        }
    ]
};
