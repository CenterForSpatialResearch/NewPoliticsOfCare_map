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
            description:"COVID affects our communities differently. Vulnerabilities that predated the pandemic have fueled uneven effects across the United States. Unless we address the immediate needs of the pandemic along with the longstanding inequalities embedded in the social and political landscape of the US we will come out of the current crisis just as vulnerable as when this all began."
            +"<br><br>We propose a New Deal for Public Health with a Community Health Corps of 1 million community health workers (CHWs) to lift up the health of Americans. Community health workers in the midst of a pandemic will help people get tested and trace their contacts, but they will have to tackle more than that in the short-term. They will have to take on the role of social workers, navigating the web of services that address the social and economic burdens of social distancing and isolation, from food and medicine delivery, rent assistance and protection from eviction, to child care and elder care."
            +"<br><br>Beyond providing comprehensive and holistic healthcare services, community health workers are unique in their role as advocates of the people who they serve. It is in this capacity as community members that community health workers are empowered to redress the health disparities that have lingered for generations.",
            location: {
                center: [-73, 30],
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
        description:
            '<br><br><br><img src="images/story_draft2/key.png" width="200px">'
        +"But communities can be vulnerable in many different ways. For example, the Centers for Disease Control's (CDC) Social Vulnerability Index (SVI*) aggregates fifteen factors related to socioeconomic status, household composition and disability, minority status and language, and housing type to define vulnerability in one single metric. But measured at a national scale, county by county, neither a single factor nor a single index can capture all of a community’s resource needs. Instead, we must examine vulnerability from many angles and perspectives."
            +"<br><br>Let's go to Arizona and we can show you what we mean.",
         location: {
               center: [-111, 34],
                   zoom:4,
  //             pitch: 0.00,
  //             bearing: 0.00
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
            +"<br><br>SVI* calls attention to counties with the greatest number of its highly-vulnerable per-capita factors across the four areas of socioeconomic status, household composition and disability, minority status and language, and housing type. In Arizona we have ranked each of the fifteen counties according to its SVI* score relative to the other counties in the state. But this is not the only way to locate vulnerable populations.",
            location: {
                //center: [-73, 30],
                zoom:1
            },
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
            +"<br><br>And finally, as the pandemic has rolled through the US, unemployment has dramatically risen in the past few months, and is a sign of the economic toll the virus has taken. While unemployment may not seem like a measure of health vulnerability, for many Americans health care is tied to a job. With rising unemployment, many in the US are left uninsured or underinsured."
            +"<br><br>An influx of community health workers could help to address each of the underlying conditions revealed by these forms of vulnerability."
            ,
            location: {},
            onChapterEnter: [],
            onChapterExit: []
        },
        {
            id: 'covid1',
            title: 'Of course, COVID has changed this landscape',
            image: '',
            description: 
            '<img src="images/story_draft2/10062020_covid.png">'
            +'<br><br>The direct effects of COVID have exacerbated many of the pre-existing vulnerabilities in the US. Sometimes long-term vulnerabilities and the impact of COVID coincide in our maps, but sometimes they do not.' 
            +"<br><br>Here is the distribution of new COVID cases over the two weeks from September 21th to October 5th in Arizona. Maricopa County, the most populous county in the state which had relatively lower values for the socioeconomic and preexisting health vulnerabilities, had the largest epidemic."
            +"Normalizing recent COVID cases by population highlights the less populous counties where large proportions of a community have acquired the virus, such as Gila County."
            +"Cumulative COVID deaths normalized by population show places that have had a severe epidemic at any time since March 2020, whether those deaths were recent or occurred months ago. As of late September 2020 cumulative deaths for Arizona have the most similar patterns as YPLL and SVI*. Apache County, which contains a large portion of the Navajo Nation, ranks highest in the state for this metric."
            +"<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>",
            location: {},
            onChapterEnter: [],
            onChapterExit: []
        },
        {
            id: 'highlightAZ',
            title: 'Taken all together',
            image: '',
            description:'<br><br><br><img src="images/story_draft2/ALL7.png">'
                    +'these four metrics of socio-economic vulnerability and three measures of COVID burden show us where vulnerabilities are in the state, but the terrain of vulnerability shifts depending on which of the seven measures we use to define it. All seven expose different places as vulnerable...'
            +"<br><br><br><br><br><br><br><br><br>",  
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
            title: 'For some counties the levels of vulnerability described by each metric are similar, but for others they can be very different.',
            image: '',
            description: 'For example, Apache County — where much of the county falls within the Navajo Nation and the Fort Apache Reservation — has among the highest levels of vulnerability across multiple metrics. It ranks the highest in the state in Years of Potential Life Lost, has the second highest unemployment rate, and the second highest number of Medicaid enrollees per capita. As of late September, Apache county ranks in the middle for the number of COVID cases but has the greatest total of COVID deaths per capita.', 
            location: {
                center: [-109.508795, 35.601732],
                zoom: 8,
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
            title: 'Across the state in the southwest corner, Yuma County tells a different story.',
            image: '',
            description: 'Yuma County ranks highest in the state in terms of SVI*, just above Apache County, but it has a relatively low rate of YPLL, and the second lowest unemployment rate in the state. In late September the county ranked fifth in terms of total recent COVID cases, but third in terms of total deaths from COVID per capita. In other words the county shows varying levels of vulnerability across the different metrics.', 
            location: {
                center: [-114.616099,32.685676],
                zoom: 8,
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
            title: 'Maricopa County had the highest total number of recent COVID cases in late September.',
            image: '',
            description: 'As the most populous county in the state, in which Phoenix and many of its suburbs are located this is not surprising. However the county is less vulnerable according to other metrics. Normalized by population, the county’s number of recent COVID cases was near the state’s median. Maricopa has the lowest number of medicaid enrollees per capita, and relatively low rates of unemployment and YPLL. ', 
            location: {
                center: [-112.067965, 33.446035],
                zoom: 8,
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
            title: 'Allocating workers for a new Community Health Corps',
            image: '',
            description: 
            '<img src="images/story_draft2/cartogram.png" id="cartogram">'
            +"To address a nation in crisis, how should we deploy a new Community Health Corps? The terrain of vulnerability in the US shifts from county to county, state to state, and will shift over time as the pandemic waxes and wanes. And yet, we must start somewhere. One approach would be to allocate CHWs according to the maximum estimated number of lives or dollars saved. However the data that would be needed to estimate the benefits of CHWs does not exist outside a narrow range of research studies."
            +"<br><br> CHWs are urgently needed in the U.S. How they should be distributed is a subjective choice."
            +" <br><br> In the map of the US here, we propose to allocate 1 million CHWs to states based on the proportion of Medicaid enrollees, so big states like New York, California and Texas, start off with 8.15%, 15.54% and 5.84% of the nation’s total CHW pool.", 
            location: {
                center: [-112.039339, 33.459597],
                zoom: 0,
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
            description:
            '<img src="images/story_draft2/20201008_comparisons_graphic-04.png">' 
            +"It is about how you define communities in greatest need. Here we have allocated each state’s total CHWs proportionally based on the seven types of vulnerabilities we just discussed."
            +"<br><br>These maps then can show you how allocation of CHWs changes based on which metric among the seven you would like to use to distribute CHWs."
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
            title: 'Explore each state on your own',
            image: '',
            description: 
            '<span id="gotoMap"><a href="index.html">GO TO MAP</a></span>', 
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