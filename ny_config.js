var config = {
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
        id: 'vulnerabilities',
        title: 'Vulnerabilities',
        description:
        "Communities can b",
         location: {
               center: [-75.210964,42.348886],
                   zoom:14,
  //             pitch: 0.00,
  //             bearing: 0.00
       },
        onChapterEnter: [
            {
                layer:"mapbox-satellite",
                opacity: 1
            }
        ],
        onChapterExit: [
            {
                
            }
        ]
    },
        {
            id: 'sviArizona',
            title: 'SVI* in Arizona',
            image: '',
            description: 
            "vulnerability in order to compare them.",
            location: {
                center: [-73, 30],
                zoom:1
            },
            onChapterEnter: [
                
            ],
            onChapterExit: [
                {
                    layer:"mapbox-satellite",
                    opacity: 0
                }
            ]
        },
        {
            id: 'ypllArizona',
            title: 'Years of Potential Life Lost',
            image: '',
            description: 
            'aaa'
            ,
            location: {
                  center: [-75.210964,42.348886],
                      zoom:14,
     //             pitch: 0.00,
     //             bearing: 0.00
          },
            onChapterEnter: [],
            onChapterExit: []
        }
    ]
};
