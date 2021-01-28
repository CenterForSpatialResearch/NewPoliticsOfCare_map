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
            description:
            "COVID-19 affects our communities differently. Health and social vulnerabilities that predate the pandemic have fueled uneven effects across the United States. Unless we address the long-standing inequalities embedded in the social and political landscape of the country along with the immediate needs produced by the pandemic, we will come out of the current crisis just as vulnerable as when this all began."
            +"<br><br>We propose a New Deal for Public Health, with a Community Health Corps of one million community health workers (CHWs), to attend to the health needs of America's residents. CHWs will help people get tested for COVID-19 and trace their contacts, but they will have to tackle more than that in the short term. They will have to take on the role of social workers, navigating the web of services that address the social and economic burdens of social distancing and isolation; they will also have to deliver food and medicine, supply rent assistance and protection from eviction, and offer child care and elder care."
            +'<img src="images/story_draft2/introNumbers.png" width="200px">'
            +"<br><br>Beyond delivering comprehensive and holistic health-care services, CHWs are unique in their role as advocates of the people whom they serve. It is in this capacity as community members that CHWs are empowered to redress the health disparities that have multiplied for generations."
            +'<br><br><br>Skip intro and <span id=\"skipStory\"><a href="vulnerabilities.html">go to map</a></span>'
            , 
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
        +"Communities can be vulnerable in many different ways. For example, the Centers for Disease Control’s Social Vulnerability Index (SVI*) aggregates 15 factors related to socioeconomic status, household composition and disability, minority status and language, and housing type to capture vulnerability in a single metric. But measured at a national scale, county by county, neither a single factor nor a single index can represent all of a community’s resource needs. Instead, we need to examine vulnerability from many angles and perspectives."
            +"<br><br>For an example of what we mean, let’s go to Arizona.",
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
            title: 'SVI* in Arizona',
            image: '',
            description: 
            '<br><br><br><img src="images/story_draft2/svi.jpg">'
            +"<br><br>SVI* calls attention to counties with the greatest number of its highly vulnerable per-capita factors across the four areas of socioeconomic status, household composition and disability, minority status and language, and housing type. In Arizona we have ranked each of the 15 counties according to its SVI* score relative to the other counties in the state. But SVI* is not the only way to locate vulnerable populations, and we have compiled multiple ways of defining vulnerability in order to compare them.",
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
            title: 'Years of Potential Life Lost',
            image: '',
            description: 
            '<br><br><br><img src="images/story_draft2/ypll.jpg" width="800px">'
            +"<br><br>Years of Potential Life Lost (YPLL) represents community-specific health vulnerability in the United States by measuring rates of premature death. Some of the counties that have the state’s highest values for SVI* also have the highest levels of YPLL. But other counties are newly visible as vulnerable."
            ,
            location: {},
            onChapterEnter: [],
            onChapterExit: []
        },
        {
            id: 'medicaidArizona',
            title: 'Medicaid enrollment',
            image: '',
            description: 
            '<br><br><br><img src="images/story_draft2/medicaid.jpg" width="800px">'
            +'<br><br>Vulnerability is also reflected by the number of residents enrolled in Medicaid, a means-tested health insurance program with eligibility largely determined by income. The enrollment criteria share some factors with SVI*, such as income, household composition, disability, and employment status.'
            ,
            location: {},
            onChapterEnter: [],
            onChapterExit: []
        },
        {
            id: 'unemployementArizona',
            title: 'Unemployment rate',
            image: '',
            description: 
            '<br><br><br><img src="images/story_draft2/unemployement.jpg" width="800px">'
            +"<br><br>As the pandemic has rolled through the United States, unemployment has increased dramatically; this increase is a sign of the economic toll the virus has taken. For many workers in America, health care access is tied to a job. With rising unemployment, many have been left uninsured or underinsured."
            +"<br><br>An influx of CHWs could help to address each of the underlying conditions revealed by these forms of vulnerability."
            ,
            location: {},
            onChapterEnter: [],
            onChapterExit: []
        },
        {
            id: 'covid1',
            title: 'How COVID-19 has changed the landscape of vulnerabilities',
            image: '',
            description: 
            '<img src="images/story_draft2/cases.jpg">'
            +'<br><br>The direct effects of COVID-19 have exacerbated many of the preexisting vulnerabilities in the United States. Sometimes long-term vulnerabilities and the impact of COVID-19 coincide in our maps, but sometimes they do not.' 
            +"<br><br>Here is the distribution of new COVID-19 cases over the two weeks from October 8 to October 22 in Arizona. Maricopa County, the most populous county in the state, had relatively lower values for socioeconomic and other preexisting health vulnerabilities, and it had the largest outbreak."
            ,
            location: {},
            onChapterEnter: [],
            onChapterExit: []
        },
        {
            id: 'covid2',
            title: '',
            image: '',
            description: 
            '<img src="images/story_draft2/casesPer100K.jpg">'
             + "<br><br>Normalizing recent COVID-19 cases by population highlights the less populous counties where large proportions of a community have acquired the virus, such as Gila County."
            ,
            location: {},
            onChapterEnter: [],
            onChapterExit: []
        },
        {
            id: 'covid3',
            title: '',
            image: '',
            description: 
            '<img src="images/story_draft2/deaths.jpg">'
            +"<br><br>Cumulative COVID-19 deaths normalized by population show places that have had a severe epidemic at any time since March 2020, whether those deaths were recent or occurred months ago."
            +"<br><br><br>",
            location: {},
            onChapterEnter: [],
            onChapterExit: []
        },
        {
            id: 'highlightAZ',
            title: 'Seven measures of vulnerability, taken all together',
            image: '',
            description:'<br><br><br><img src="images/story_draft2/ALL7.png">'
            +'These four metrics of socioeconomic vulnerability and three measures of COVID-19 burden show us where vulnerabilities exist in the state, but the terrain of vulnerability shifts depending on which of the seven measures we use to define it. All seven expose different places as vulnerable.'
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
            title: 'For some counties the levels of vulnerability described by each metric are similar, but for others they can be very different',
            image: '',
            description: 'For example, Apache County—where much of the county falls within the Navajo Nation and the Fort Apache Reservation—has among the highest levels of vulnerability across multiple metrics. It ranks the highest in Arizona in YPLL; it has the second highest unemployment rate and the second highest number of Medicaid enrollees per capita. As of late October, Apache County ranks in the middle for the number of COVID-19 cases but has the greatest total number of COVID-19 deaths per capita.', 
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
            title: 'Across the state, in the southwest corner, Yuma County tells a different story',
            image: '',
            description: 'Yuma County ranks highest in the state in terms of SVI*, just above Apache County, but it has a relatively low rate of YPLL and the second lowest unemployment rate in the state. In late October, the county ranked fifth in terms of total recent COVID-19 cases but third in terms of total deaths per capita from COVID-19. In other words, the county shows varying levels of vulnerability across the different metrics.', 
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
            title: 'Maricopa County had the highest total number of recent COVID-19 cases in late October',
            image: '',
            description: "As the most populous county in the state, including the city of Phoenix and many of its suburbs, Maricopa's high COVID-19 case rate is not surprising. However, the county is less vulnerable according to other metrics. Normalized by population, the county’s number of recent COVID-19 cases was near the state’s median. Maricopa has the lowest number of Medicaid enrollees per capita and relatively low rates of unemployment and YPLL.", 
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
            title: 'Allocating Community Health Corps workers to states',
            image: '',
            description: 
            '<img src="images/story_draft2/cartogram.png" id="cartogram">'
            +"To address a nation in crisis, how should we deploy a Community Health Corps? The terrain of vulnerability in the United States shifts from county to county and state to state, and it will continue to shift over time as the pandemic waxes and wanes. Yet we must start somewhere. One approach would be to allocate CHWs according to the maximum estimated number of lives or dollars saved. However, the data that would be needed to estimate the benefits of CHWs does not exist outside a narrow range of research studies."
            +"<br><br> CHWs are urgently needed in the United States. How they should be distributed is a choice. It should be up to the communities that will be impacted."
            +" <br><br> In this map of the United States, we propose to allocate one million CHWs to states based on the proportion of Medicaid enrollees, so that large states like New York, California, and Texas begin with 8.2%, 15.5%, and 5.8%, respectively, of the nation’s total CHW pool.", 
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
            title: 'Allocating CHWs within states',
            image: '',
            description:
            '<img src="images/story_draft2/20201008_comparisons_graphic-04.png">' 
            +"How do we define communities in the greatest need? Here we have allocated each state’s total CHWs proportionally based on the seven types of vulnerabilities we have considered."
            +"<br><br>These maps show us how the allocation of CHWs changes based on which metric of the seven is used. Advocates, public officials, community members, and leaders can compare different metrics to understand variations across different types of vulnerability."
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
            title: 'The trade-offs',
            image: '',
            description: '<br><br><br><img src="images/story_draft2/all_comparisons.png">'
            +'Any pair of choices sends more resources to some areas and fewer to others. By comparing vulnerabilities, you can see how each county differs by need: who is included in each, and who is left out.'
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
            '<span id="gotoMap"><a href="vulnerabilities.html">GO TO MAP</a></span>', 
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
