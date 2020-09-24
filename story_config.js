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
            description: 'We hear a lot about it these days. About how COVID impacts our communities. But before COVID our communities were vulnerable to all kinds of health threats. We think both COVID and other health threats should be met with a historic challenge; A New Deal for Public Health, a Communty Health Corps of million people to lift up the health of Americans.',
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
        description: 'But vulnerablility can be expressed in may different ways. For example the CDC\'s Social Vulnerability Index takes into account '
            +'15 factors in socioeconomic status, household composition and disability...'
            +'<br><br>Let\'s go to Arizona and we can show you what we mean ..<br><br>'
            +'<br><img src="images/key.png" width="300px">',
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
            description: 'SVI is focuses on populations that ..... The way we have visualized SVI here highlights large populations with high vulnerability, we did this to show ... <br><br>In Arizona, it is located in ... and .... <br><br>But this is not the only way to locate vulnerable populations.',
            location: {
                center: [-111.730422, 34.232006],
                zoom: 6,
                pitch: 0,
                bearing: 0
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
            description: 'YPLL is another, YPLL is ... <br><br>When we use YPLL to locate vulnerability....',
            location: {
                center: [-111.730422, 34.232006],
                zoom: 6,
                pitch: 0,
                bearing: 0
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
            description: 'Yet another is how many residents use medicaid ... <br><br> And if we look at where medicaid enrolees are concentrated in AZ we see places that are dense and ...',
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
            description: 'And finally unemplyement has been rising in the past few months ... <br><br>some stats.... <br><br>In Arizona, we see it here and here....',
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
            description: 'Here is where covid cases are in AZ ...',
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
            title: 'When we look at how covid intersects with concentrations in population ...',
            image: '',
            description: 'Here is where the highest rates are ...',
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
            description: 'here is where covid deaths are ....',
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
            title: 'All together these 4 indexes and 3 measures of Covid show us where vulnerabilities are in the state.',
            image: '',
            description: 'all 7 expose different places as ...<br><br> This will be a map that shows a layer that points to counties for the most for each of the 7', 
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
            description: 'for example, _____ county  ranks high in this, but not that. Its population makeup is ... average income is ... age ...'
            +'during the pandemic it has been ... where unemplyement has been ... and this other thing has been ...', 
            location: {
                center: [-114, 34.232006],
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
            title: 'And across the state, _____ county shows a different story',
            image: '',
            description: '______county has consistently high vulnerability..... across these 3 measures ... its population is older ... with ...', 
            location: {
                center: [-109.5, 34.232006],
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
