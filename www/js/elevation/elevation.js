function plotElevation(returnedElevations,source, distance, mymap, LatLng) {

    var elevations = [];
    var marker = 0;
    for (var i = 0; i < returnedElevations.rows.length; i++) {
        if(source == 1) {
            elevations.push(parseInt(returnedElevations.rows.item(i).Altura));
        }
        else
        {
            elevations.push(parseInt(returnedElevations.rows[i].Altura));
        }
    }
    var minElevation = elevations[0];
    var maxElevation = elevations[0];
    for (var i_10 = 0; i_10 < elevations.length; i_10++) {          
        minElevation = Math.min(elevations[i_10], minElevation);
        maxElevation = Math.max(elevations[i_10], maxElevation);          
    }
    console.dir(elevations);
    Highcharts.chart('elevChart', {
        chart: {
            type: 'area'
        },
        title: {
            text: 'Datos de elevación'
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            allowDecimals: true,
            minRange: 1,
            labels: {
                formatter: function () {
                    return (this.value * (parseInt(distance)/256)).toFixed(2) + ' km'; // clean, unformatted number for year
                }
            }
        },
        yAxis: {
            max: maxElevation,
            min: minElevation,
            title: {
                text: 'Elevación del terreno en msnm'
            },
            labels: {
                formatter: function () {
                    return this.value;
                }
            }
        },
        tooltip: {
            formatter: function() {
                if(marker == 0){
                    marker = L.marker(LatLng[this.x]).addTo(mymap);
                }
                else{
                    marker.setLatLng(LatLng[this.x]);
                }
                return  '<b>Distancia: ' + (this.x * (parseInt(distance)/256)).toFixed(2) +' km</b><br/>' + 'Altura: ' + this.y + ' msnm';
            }
        },
        plotOptions: {
            area: {
                pointStart: 0,
                marker: {
                    enabled: false,
                    symbol: 'circle',
                    radius: 2,
                    states: {
                        hover: {
                            enabled: true
                        }
                    }
                }
            }
        },
        series: [{
            showInLegend: false,
            name: ' ',
            data: elevations,
            color: '#55b9a1'
        }]
    });
}    
    
    // function plotElevation(returnedElevations) {
    //     var elevations = [];
    //     var locations = [];
    //     var distance = 0;
    //     for (var i = 0; i < returnedElevations.rows.length; i++) {
    //         elevations.push(returnedElevations.rows.item(i).Altura);
    //         //locations.push(returnedElevations[i].location);
    //     }

    //     // display the results
    //     chartData = [];
    //     var minElevation = elevations[0];
    //     var maxElevation = elevations[0];
    //     for (var i_10 = 0; i_10 < elevations.length; i_10++) {
    //         console.log(minElevation);
    //         minElevation = Math.min(elevations[i_10], minElevation);
    //         maxElevation = Math.max(elevations[i_10], maxElevation);
    //         // calculate distance
    //         if (i_10 > 0) {
    //             var d = 100//google.maps.geometry.spherical.computeDistanceBetween(locations[i_10 - 1], locations[i_10]);
    //             distance += d;
    //         }
    //         var elevation = elevations[i_10];

    //         var displayDistance = distance / 1000;

    //         chartData.push([displayDistance, elevation]);
    //     }
    //     var elevChange = maxElevation - minElevation;
    //     // chart
    //     console.log("elevChart");
    //     var chart = $("#elevChart");
    //     chart.height(150);
    //     var chartMin = elevationChartMin(minElevation, maxElevation);
    //     var chartMax = elevationChartMax(minElevation, maxElevation);
    //     console.log(chartMin);

    //     plot = $.plot(chart, [{ data: chartData, lines: { show: true, fill: true, fillColor: "#D9D9D9" } }], {
    //         grid: {
    //             hoverable: true,
    //             aboveData: true
    //         },
    //         yaxis: {
    //             min: chartMin,
    //             max: chartMax
    //         },
    //         crosshair: {
    //             mode: "x"
    //         },
    //         selection: {
    //             mode: "x",
    //             color: "red"
    //         },
    //         colors: ["#55b9a1"]
    //     });

    //     // chart.on("mouseleave", function () {
    //     //     $("#tooltip").hide();
    //     // });
    //     // chart.bind("plotunselected", function () {
    //     //     if (selectionPolyline != null) {
    //     //         selectionPolyline.setMap(null);
    //     //     }
    //     // });
    //     // chart.bind("plotselected", function (event, ranges) {
    //     //     var from = ranges.xaxis.from;
    //     //     var to = ranges.xaxis.to;
    //     //     // get the start and end altitudes
    //     //     var fromIndex = getIndexForDistance(from);
    //     //     var fromElevation = chartData[fromIndex][1];
    //     //     var toIndex = getIndexForDistance(to);
    //     //     var toElevation = chartData[toIndex][1];
    //     //     var segmentDistance = to - from;
    //     //     // selected average %age
    //     //     var segmentDistanceInMetres = segmentDistance * 1000;
    //     //     var climbInMetres = Math.abs(toElevation - fromElevation);

    //     //     // show the segment on the map
    //     //     if (selectionPolyline != null) {
    //     //         selectionPolyline.setMap(null);
    //     //     }
    //     //     var sectionData = locations.slice(fromIndex, toIndex);
    //     //     var polyOptions = {
    //     //         map: map,
    //     //         strokeColor: "red",
    //     //         strokeWeight: 8,
    //     //         path: sectionData,
    //     //         zIndex: 1000
    //     //     };
    //     //     selectionPolyline = new google.maps.Polyline(polyOptions);
    //     // });
    //     chart.bind("plothover", function (event, pos) {
    //         console.log("Hover");
    //         var dataset = plot.getData();
    //         console.dir(dataset);
    //         var series = dataset[0];
    //         var j = getIndexForDistance(pos.x);
    //         $("#tooltip").hide();
    //         var y = series.data[j][1];
    //         var x = series.data[j][0];
    //         var name = "Elevation: " +
    //             addCommas(roundNumber(y, 0)) +
    //             " Metros" +
    //             "<br/>" +
    //             "Distance: " +
    //             addCommas(roundNumber(x, 1)) +
    //             " KM";
    //         showTooltip(pos.pageX, pos.pageY, name);
    //         // add marker
    //         // if (marker == null || marker.getMap() == null) {
    //         //     marker = new google.maps.Marker({
    //         //         position: locations[j],
    //         //         map: map,
    //         //         icon: {
    //         //             url: "~/img/station6.png",
    //         //             anchor: new google.maps.Point(10, 10)
    //         //         },
    //         //         title: "Elevation: " +
    //         //             addCommas(roundNumber(y, 0)) +
    //         //             " Metros" +
    //         //             ", distance: " +
    //         //             addCommas(roundNumber(x, 1)) +
    //         //             " KM"
    //         //     });
    //         // }
    //         // else {
    //         //     marker.setPosition(locations[j]);
    //         // }
    //     });
    // }


    // function elevationChartMin(n, t) {
    //     var i = (t - n) / 5;
    //     return n - i > 0 ? n - i : null
    // }

    // function elevationChartMax(n, t) {
    //     var i = (t - n) / 5;
    //     return t + i
    // }
    
    // function getIndexForDistance(distance) {
    //     for (var i_11 = 0; i_11 < chartData.length; i_11++) {
    //         if (chartData[i_11][0] >= distance) {
    //             return i_11;
    //         }
    //     }
    //     return chartData.length - 1;
    // }

    // function roundNumber(n, t) {
    //     return Math.round(n * Math.pow(10, t)) / Math.pow(10, t)
    // }

    // function addCommas(n) {
    //     for (var u = n.toString(), i = u.split("."), t = i[0], f = i.length > 1 ? "." + i[1] : "", r = /(\d+)(\d{3})/; r.test(t) ;) t = t.replace(r, "$1,$2");
    //     return t + f
    // }

    // function showTooltip(n, t, i) {
    //     $("#tooltip").length === 0 && $('<div id="tooltip"><\/div>').css({
    //         position: "absolute",
    //         display: "none",
    //         border: "1px solid #fdd",
    //         padding: "2px",
    //         "min-width": "150px",
    //         "background-color": "#fee",
    //         opacity: .8
    //     }).appendTo("body");
    //     n > $("body").width() - $("#tooltip").width() - 30 ? n = n - $("#tooltip").width() - 20 : n += 20;
    //     $("#tooltip").html(i).css({
    //         top: t,
    //         left: n
    //     }).show()
    // }






