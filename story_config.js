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
            description: 'We hear a lot about it these days. About how COVID19 affectsour communities. And yet the impact has not been the same everywhere. Vulnerabilities that predated the pandemic have fueled these uneven effects across the country. Unless we address  the immediate needs of the pandemic  along with the the longstanding inequalities embedded in the social and political landscape of the US we will come out of the current crisis just as vulnerable when this all began. Thus, we have proposed a New Deal for Public Health with a Community Health Corps of 1 million people to lift up the health of Americans: it confronts the pandemic and the centuries of neglect and discrimination that have mired our communities in sickness and disease for generations by investing in health from the ground up .’ Let’s start talking about vulnerability, what it means, what it looks like in America, before we turn to talk about how to address it with a new Community Health Corps and a New Politics of Care.',
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
        image: '',
        description: 'But vulnerability can be expressed in many different ways. For example the CDC\'s Social Vulnerability Index (SVI) uses census data and takes into account factors including socioeconomic status, household composition and disability, minority status and language, and housing type to define vulnerability in one, specific way. But measured at a national scale, county by county, no single metric can account for all of the communities that need resources and we need to examine vulnerability from many angles and perspectives.'
            +'<br><br>Let\'s go to Arizona and we can show you what we mean ..<br><br>'
            +'<br><br><br><br><br><br><img src="images/story/key.png" width="300px">',
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
            description: 'SVI is a composite index and calls attention to counties where there are a high '
            +'proportion of residents which fit into multiple of its categories of vulnerability. '
            +'In Arizona we have ranked each county according to its SVI score relative to the other counties '
            +'in the state. The state’s more rural counties stand out with the highest vulnerability. '
            +'Many of these are sites in Arizona are  Indian reservations. But this is not the only way to locate vulnerable populations.'
            +'<br><img src="images/story/vulneralbilities.png" width="1000px">',
            location: {
                center: [-111.730422, 34.232006],
                zoom: 6,
                pitch: 0,
                bearing: 0
            },
            onChapterEnter: [
                {
                    layer: 'mapbox-satellite',
                    opacity: .2
                }
            ],
            onChapterExit: [
                {
                    layer: 'mapbox-satellite',
                    opacity: 0
                }
            ]
        },
        {
            id: 'ypll',
            title: 'YPLL',
            image: '',
            description: 'Years-of-Potential-Life-Lost (YPLL) is another way to understand how structural disinvestment has created vulnerability in health in America YPLL in these maps  is an indicator which shows where a large proportion of the population dies young. YPLL measures the cumulative number of years that were not lived by people who died before the age of 75--it’s a signal of premature death. Some of the counties which had the state’s highest values for SVI also have the highest YPLL. But other counties are newly visible as vulnerable.',
            location: {
                center: [-111.730422, 34.232006],
                zoom: 6,
                pitch: 0,
                bearing: 0
            },
            onChapterEnter: [
                {
                    layer: 'YPLL',
                    opacity: 0
                }
            ],
            onChapterExit: [
                {
                    layer:'YPLL',
                    opacity: 0
                }
            ]
        },
        {
            id: 'medicaid',
            title: 'Medicaid',
            image: '',
            description: 'Yet another means to measure vulnerability is how many residents use Medicaid. The enrollment criteria [link] includes similar factors to SVI, such as age, income, household composition and point to social and economic vulnerability that can affect health .  And if we look at where medicaid enrollees are concentrated in AZ we see places that are dense and ...',
            location: {
                center: [-111.730422, 34.232006],
                zoom: 6,
                pitch: 0,
                bearing: 0
            },
            onChapterEnter: [
                {
                    layer: 'Medicaid_capita',
                    opacity: 1
                }
            ],
            onChapterExit: [
                {
                    layer: 'Medicaid_capita',
                    opacity: 0
                }
            ]
        },
        {
            id: 'unemployement',
            title: 'unemployement',
            image: '',
            description: 'And finally, as the pandemic has rolled through the US, unemployment has dramatically riseng in the past few months, and is a signof the economic toll the virus has taken. While unemployment may not seem like a measure of health vulnerability, many Americans’ health care is tied to their jobs. With rising unemployment, many in the US are left uninsured or underinsured.  [still need stats here for AZ]... <br><br>some stats.... <br><br>In Arizona, we see it here and here....',
            location: {
                center: [-111.730422, 34.232006],
                zoom: 6,
                pitch: 0,
                bearing: 0
            },
            onChapterEnter: [
                {
                    layer: 'Unemployment_capita',
                    opacity: 1
                }
            ],
            onChapterExit: [
                {
                    layer: 'Unemployment_capita',
                    opacity: 0
                }
            ]
        },
        {
            id: 'covid1',
            title: 'Of course, Covid has changed this landscape',
            image: '',
            description: 'The direct effectsof COVID19 have exacerbated many of the pre-existing vulnerablities in the US But the pandemic has also revealed placesh with acute and immediate needs and where combating the epidemic requires an influx of community health workerss. Sometimes long-term vulnerabilities and the impact of COVID19 co-incide in our maps, but sometimes they do not.  On September 24, here is the distribution of recent COVID cases over past two weeks in Arizona. Maricopa county, the most populous county in the state which had relatively lower values for the socioeconomic and preexisting health vulnerabilities has the highest current rate of infection.',
            location: {
                center: [-111.730422, 34.232006],
                zoom: 6,
                pitch: 0,
                bearing: 0
            },
            onChapterEnter: [
                {
                    layer: 'Covid',
                    opacity: 1
                }
            ],
            onChapterExit: [
                {
                    layer: 'Covid',
                    opacity: 0
                }
            ]
        },
        {
            id: 'covid2',
            title: 'When we look at recent COVID cases  normalized by population...',
            image: '',
            description: 'we see something different. In big cities, the number of COVID19 cases in absolute terms may be large but do not necessarily represent hotspots were large proportions of a community have been infected with the virus. COVID19 cases per capita shows SARSCOV2 infections as a proportion of population, which indicates a highly concentrated epidemic ...',
            location: {
                center: [-111.730422, 34.232006],
                zoom: 6,
                pitch: 0,
                bearing: 0
            },
            onChapterEnter: [
                {
                    layer: "Covid_capita",
                    opacity: 1
                }
            ],
            onChapterExit: [
                {
                    layer: "Covid_capita",
                    opacity: 0
                }
            ]
        },
        {
            id: 'covid3',
            title: 'And when we look at covid deaths ...',
            image: '',
            description: 'Cumulative COVID19 deaths tell yet another story about the pandemic. New York City was hard hit by SARSCOV2 early, and the toll of deaths there was horrific. However, current cases over the past 14 days in NYC aren’t reflective of the current state of the epidemic there, which has shifted to other places in the country. Cumulative COVID19 cases can tell different stories--they can indicate a severe epidemic at any time since March 2020, whether those deaths were recent or occurred months ago. In Arizona….The patterns are most similar to YPLL and SVI. [say something more here] ....',
            location: {
                center: [-111.730422, 34.232006],
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
            id: 'highlightAZ',
            title: 'Taken all together these 4 indexes and 3 measures of Covid19 burden show us where vulnerabilities are in the state but the terrain of vulnerability shifts depending on which  of the seven measures we use to define it.',
            image: '',
            description: 'All 7 expose different places as vulnerable...<br><br> [This will be a map that shows a layer that points to counties for the most for each of the 7], [SO WILL THIS SHOW ALL SEVEN METRICS FOR AZ SIDE-BY-SIDE?]', 
            location: {
                center: [-111.730422, 34.232006],
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
