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
            description: 'We hear a lot about it these days. About how COVID impacts our communities. But before COVID our communities were vulnerable to all kinds of health threats. We think both COVID and other health threats should be met with a historic challenge; A New Deal for Public Health, a COmmunty Health Corps of million people to lift up the health of Americans.',
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
        description: 'But vulnerablility can be expressed in mayn different ways--like SVI (we talk a little bit about what it is, why it matters). <br>PUT A KEY HERE<br><br>Let\'s go to Arizona and we can show you what we mean',
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
                opacity: .2
            }
        ]
    },
        {
            id: 'sviArizona',
            title: 'SVI in Arizona',
            image: '',
            description: 'SVI is ..., in Arizona, it is located in ... and .... But this is not the only way to locate vulnerable populations.',
            location: {
                center: [-111.730422, 34.232006],
                zoom: 6,
                pitch: 55.50,
                bearing: -4
            },
            onChapterEnter: [
                {
                    layer: 'SVI',
                    opacity: 1
                }
            ],
            onChapterExit: [
                {
                    layer: 'SVI',
                    opacity: 0
                },
                {
                    layer: 'sviAll',
                    opacity: 0
                }
            ]
        },
        {
            id: 'ypll',
            title: 'YPLL',
            image: '',
            description: 'YPLL is another, YPLL is ... When we use YPLL to locate vulnerability....',
            location: {
                center: [-111.730422, 34.232006],
                zoom: 6,
                pitch: 55.50,
                bearing: -4
            },
            onChapterEnter: [
                {
                    layer: 'YPLL',
                    opacity: 1
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
            description: 'And if we look at where medicaid enrolees are concentrated ...',
            location: {
                center: [-111.730422, 34.232006],
                zoom: 6,
                pitch: 55.50,
                bearing: -4
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
            description: 'Unemplyement has been rising in the past few months ... some stats...., in arizona, ....',
            location: {
                center: [-111.730422, 34.232006],
                zoom: 6,
                pitch: 55.50,
                bearing: -4
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
            title: 'Covid has changed this landscape',
            image: '',
            description: 'here is where covid cases are ....',
            location: {
                center: [-111.730422, 34.232006],
                zoom: 6,
                pitch: 55.50,
                bearing: -4
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
            title: 'when we look at how covid intersects with concentrations in population ...',
            image: '',
            description: 'here is where the highest rates are ...',
            location: {
                center: [-111.730422, 34.232006],
                zoom: 6,
                pitch: 55.50,
                bearing: -4
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
            title: 'and when we look at covid deaths ...',
            image: '',
            description: 'here is where covid deaths are ....',
            location: {
                center: [-111.730422, 34.232006],
                zoom: 6,
                pitch: 55.50,
                bearing: -4
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
            title: 'here is what each vulnerability identifies as the hotspot',
            image: '',
            description: 'all 7 vulnerabilities expose different places as ...<br><br> This will be a map that shows a layer that points to counties for the most for each of the 7', 
            location: {
                center: [-111.730422, 34.232006],
                zoom: 6,
                pitch: 55.50,
                bearing: -4
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
            title: 'Each county has a range depending on which vulnerability is measured',
            image: '',
            description: 'for example, _____ county  ranks high in this, but not that.', 
            location: {
                center: [-114, 34.232006],
                zoom: 10,
                pitch: 55.50,
                bearing: -4
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
            id: 'highlightAZCounty2',
            title: 'And across the state, _____ county shows a different story',
            image: '',
            description: '______county has consistently high ..... across all 7 measures', 
            location: {
                center: [-109.5, 34.232006],
                zoom: 10,
                pitch: 55.50,
                bearing: -4
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
            id: 'allocation',
            title: 'how do we help?',
            image: '',
            description: 'community health workers are .... <br><br>each of these vulnerabilities mean a different way of allocating community health workers.'
            +'<br><br>Imagine 1,000,000  Community Health Workers ... give a sense of what they do .. and why they are going to \'vulnerable\' places ... and then ask where they go.  ', 
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
