var Chart = (function () {
    function Chart(parent) {
        this.onDataFetch = [];
        this.elm = document.createElement('div');
        this.elm.classList.add('box');
        parent.appendChild(this.elm);
    }
    Chart.prototype.addHeader = function (text) {
        d3.select(this.elm)
            .append("p")
            .attr("class", "box__title")
            .html(text);
        return this;
    };
    Chart.prototype.addLine = function (start, end, selector) {
        var g = d3.select(this.elm)
            .append('svg')
            .attr('width', 500)
            .attr('height', 250)
            .append('g')
            .attr('transform', 'translate(10,10)');
        this.onDataFetch.push({
            g: g,
            fun: function (g) {
                var request = {
                    selector: selector,
                    start: start,
                    end: end,
                    samples: 10,
                    groups: 2,
                };
                fetchRequests(request).then(function (data) {
                    g.selectAll('*').remove();
                    drawLine({
                        elm: g,
                        start: start,
                        end: end,
                        smooth: false,
                        width: 400,
                        height: 200,
                        lines: data.map(function (line) { return ({
                            name: line.key,
                            points: line.dates.buckets.map(function (x) { return ({
                                x: x.key,
                                y: x.times.value,
                            }); })
                        }); })
                    });
                });
            }
        });
        return this;
    };
    Chart.prototype.fetch = function () {
        for (var i = 0; i < this.onDataFetch.length; i++)
            this.onDataFetch[i].fun(this.onDataFetch[i].g);
        return this;
    };
    return Chart;
}());
var createRequestsChart = function (hours, selector, header) {
    var elm = document.createElement('div');
    var onFetched = function (data, settings) {
        elm.innerHTML = '';
        drawLine({
            elm: d3.select(elm).append('g'),
            start: dateStart,
            end: dateEnd,
            smooth: true,
            width: 300,
            height: 200,
            lines: data.map(function (line) { return ({
                name: line.key,
                points: line.dates.buckets.map(function (x) { return ({
                    x: x.key,
                    y: x.times.value,
                }); })
            }); })
        });
    };
    fetchRequests({
        selector: selector,
        start: dateStart,
        end: dateEnd,
        samples: 30,
        groups: 3,
        onComplete: onFetched,
        xSelector: function (d) { return d; },
        ySelector: function (d) { return d; },
        nameSelector: function (d) { return d; },
    });
    return elm;
};
var createLongRequestChart = function (header) {
    var elm = document.createElement('div');
    var dateEnd = new Date().getTime() - 1000 * 10;
    var dateStart = dateEnd - 1000 * 60 * 60;
    var onFetched = function (data, settings) {
        drawTimeline({
            elm: elm,
            lines: [
                {
                    start: dateStart,
                    end: dateEnd,
                    data: data
                }
            ]
        });
    };
    fetchLongRequests({
        selector: '',
        start: dateStart,
        end: dateEnd,
        samples: 15,
        groups: 10,
        onComplete: onFetched,
        xSelector: function (d) { return d; },
        ySelector: function (d) { return d; },
        nameSelector: function (d) { return d; },
    });
    return elm;
};
document.addEventListener('DOMContentLoaded', function () {
    var oneMinute = 60 * 1000;
    var oneHour = oneMinute * 60;
    var dateEnd = new Date().getTime() - oneMinute;
    var dateStart = dateEnd - oneMinute * 60;
    var container = document.getElementById('container-js');
    var chart1 = new Chart(container)
        .addHeader('Requests')
        .addLine(dateStart, dateEnd, 'machene')
        .fetch();
});
var fetchRequests = function (request) {
    var secondsPerSample = ((request.end - request.start) / 1000) / request.samples;
    var query = {
        "size": 0,
        "query": {
            "filtered": {
                "filter": {
                    "range": {
                        "time": {
                            "gte": request.start,
                            "lte": request.end
                        }
                    }
                }
            }
        },
        "aggs": {
            "routes": {
                "terms": {
                    "field": request.selector,
                    "size": request.groups,
                    "order": {
                        "_count": "desc"
                    }
                },
                "aggs": {
                    "dates": {
                        "date_histogram": {
                            "field": "time",
                            "interval": secondsPerSample + "s",
                            "pre_zone": "+01:00",
                            "pre_zone_adjust_large_interval": true,
                            "min_doc_count": 0,
                            "extended_bounds": {
                                "min": request.start,
                                "max": request.end
                            }
                        },
                        "aggs": {
                            "times": {
                                "avg": {
                                    "field": "processTime"
                                }
                            }
                        }
                    }
                }
            }
        }
    };
    return new Promise(function (resolve, reject) {
        var client = new elasticsearch.Client({
            host: 'http://elastic.laget.se/'
        });
        client.search({
            index: ElasticHelper.getDateIndexNames('requests-', new Date(request.start), new Date(request.end)),
            size: 0,
            body: query
        }).then(function (resp) {
            console.log(resp.aggregations.routes.buckets);
            resolve(resp.aggregations.routes.buckets);
        });
    });
};
var ElasticHelper = (function () {
    function ElasticHelper() {
    }
    ElasticHelper.appendDate = function (name, date) {
        var month = '' + (date.getMonth() + 1);
        var day = '' + date.getDate();
        var year = date.getFullYear();
        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        return name + [year, month, day].join('-');
    };
    ElasticHelper.getDateIndexNames = function (name, startDate, endDate) {
        var indices = [];
        while (startDate < endDate) {
            indices.push(ElasticHelper.appendDate(name, startDate));
            startDate = new Date(startDate.getTime() + 1000 * 60 * 60 * 24);
        }
        return indices.join(',');
    };
    return ElasticHelper;
}());
var fetchLongRequests = function (request) {
    var query = {
        "size": 0,
        "query": {
            "filtered": {
                "query": {
                    "query_string": {
                        "query": "*",
                        "analyze_wildcard": true
                    }
                },
                "filter": {
                    "range": {
                        "startTime": {
                            "gte": request.start,
                            "lte": request.end
                        }
                    }
                }
            }
        },
        "aggs": {
            "data": {
                "terms": {
                    "field": "requestId",
                    "size": request.groups
                },
                "aggs": {
                    "1": {
                        "min": {
                            "field": "startTime"
                        }
                    },
                    "perRequest": {
                        "terms": {
                            "field": "url",
                            "size": 1,
                        },
                        "aggs": {
                            "startTime": {
                                "min": {
                                    "field": "startTime"
                                }
                            },
                            "processTime": {
                                "max": {
                                    "field": "processTimeMs"
                                }
                            }
                        }
                    }
                }
            }
        }
    };
    var client = new elasticsearch.Client({
        host: 'http://elastic.laget.se/'
    });
    client.search({
        index: ElasticHelper.getDateIndexNames('long-requests_', new Date(request.start), new Date(request.end)),
        size: 0,
        body: query
    }).then(function (resp) {
        console.log(resp.aggregations.data.buckets);
        request.onComplete(resp.aggregations.data.buckets, request);
    });
};
var drawLine = function (chart) {
    var svg = chart.elm;
    var maxY = d3.max(chart.lines, function (f) { return d3.max(f.points, function (q) { return q.y; }); });
    var minY = 0;
    var maxX = chart.end;
    var minX = chart.start;
    var x = d3.time.scale()
        .range([0, chart.width])
        .domain([minX, maxX]);
    var y = d3.scale.linear()
        .range([chart.height, 0]).nice()
        .domain(d3.extent([minY, maxY]));
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + chart.height + ")")
        .call(xAxis);
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .attr("class", "axisText")
        .style("text-anchor", "end")
        .text("Price ($)");
    var color = d3.scale.linear()
        .range(["hsl(100, 50, 50)", "hsl(150, 50, 50)"])
        .interpolate(d3.interpolateHcl);
    for (var ww = 0; ww < chart.lines.length; ww++) {
        var line = chart.lines[ww];
        line.points[0].x = 0;
        line.points[1].x = 0;
        for (var i = 0; i < line.points.length; i++) {
            var lineData = d3.svg.line()
                .x(function (d) {
                var q = x(d.x);
                return q;
            })
                .y(function (d) {
                return y(d.y);
            });
            if (chart.smooth)
                lineData = lineData.interpolate("basis");
            svg.append("path")
                .datum(line.points)
                .attr("class", "line")
                .attr("stroke", function (f, i) { return color(i * 4 + 3); })
                .attr("d", lineData);
        }
    }
};
var drawTimeline = function (chart) {
    var margin = {
        top: 90,
        right: 10,
        bottom: 10,
        left: 10
    };
    var width = 300;
    var height = 400;
    var innerWidth = width - (margin.left + margin.right);
    var innerHeight = height - (margin.top + margin.bottom);
    var svg = chart.elm
        .attr("class", "box")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    for (var ww = 0; ww < chart.lines.length; ww++) {
        var lineConfig = chart.lines[ww];
        var x = d3.time.scale()
            .range([margin.left, innerWidth])
            .domain([lineConfig.start, lineConfig.end]);
        svg.append("rect")
            .attr("x", function (a, b) { return i * 10; })
            .attr("fill", "white")
            .attr("width", 10)
            .attr("height", 10);
    }
};
//# sourceMappingURL=app.js.map