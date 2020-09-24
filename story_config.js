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
            description: 'We hear a lot about it these days. About how COVID impacts our communities. But before COVID our communities were vulnerable to all kinds of health threats. We think both COVID and other health threats should be met with a historic challenge; A New Deal for Public Health, a COmmunty Health Corps of million people to lift up the health of Americans.'
            +"<br><br>donec et odio pellentesque diam volutpat commodo sed egestas egestas fringilla phasellus faucibus scelerisque eleifend donec pretium vulputate sapien nec sagittis aliquam malesuada bibendum arcu vitae elementum curabitur vitae nunc sed velit dignissim sodales ut eu sem integer vitae justo eget magna fermentum iaculis eu non diam phasellus vestibulum lorem sed risus ultricies tristique nulla aliquet enim tortor at auctor urna nunc id cursus metus aliquam eleifend mi in nulla posuere sollicitudin aliquam ultrices sagittis orci a scelerisque purus semper eget duis at tellus at urna condimentum mattis pellentesque id nibh tortor id aliquet lectus proin nibh nisl condimentum id",
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
            description: 'YPLL is another, YPLL is ... When we use YPLL to locate vulnerability....',
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
            description: 'And if we look at where medicaid enrolees are concentrated ...',
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
            description: 'Unemplyement has been rising in the past few months ... some stats...., in arizona, ....',
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
            title: 'Covid has changed this landscape',
            image: '',
            description: 'here is where covid cases are ....',
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
            title: 'when we look at how covid intersects with concentrations in population ...',
            image: '',
            description: 'here is where the highest rates are ...',
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
            title: 'and when we look at covid deaths ...',
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
            title: 'here is what each vulnerability identifies as the hotspot',
            image: '',
            description: 'all 7 vulnerabilities expose different places as ...<br><br> This will be a map that shows a layer that points to counties for the most for each of the 7', 
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
            title: 'Each county has a range depending on which vulnerability is measured',
            image: '',
            description: 'for example, _____ county  ranks high in this, but not that.', 
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
                // {
  //                   layer: "mapbox-satellite",
  //                   opacity: 0
  //               }
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
                pitch: 0,
                bearing: 0
            },
            onChapterEnter: [
                // {
   //                  layer: "Covid_death_capita",
   //                  opacity: 1
   //              }
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
            title: 'While New York is completely different ...',
            image: '',
            description: 'Here, ___ is concentrated in ___ and ... is concentrated in ...', 
            location: {
                center: [-74.668854,43],
                zoom: 7,
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
            title: 'how do we help?',
            image: '',
            description: 'community health workers do this... each of these vulnerabilities mean a different way of allocating community health workers.'
            +'<br><br>Imagine 1,000,000  Community Health Workers ... '
            +'<br><br>Where should they go? all these vulnerability measures show that we are vulnerable in different ways, but we all need CHWs, especially now ...', 
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
