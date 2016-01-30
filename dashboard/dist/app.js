var createRequestsChart = function (hours, selector, header) {
    var elm = document.createElement('div');
    var oneMinute = 60 * 1000;
    var oneHour = oneMinute * 60;
    var dateEnd = new Date().getTime() - oneMinute;
    var dateStart = dateEnd - oneHour * hours;
    var onFetched = function (data, settings) {
        drawLine({
            header: header,
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
    fetchRequests({
        selector: selector,
        start: dateStart,
        end: dateEnd,
        samples: 15,
        groups: 1,
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
            header: header,
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
    var container = document.getElementById('container-js');
    container.appendChild(createRequestsChart(1, 'environment', 'All Requests'));
    container.appendChild(createRequestsChart(1, 'route', 'Top route'));
    container.appendChild(createRequestsChart(1, 'url', 'Top Url'));
    container.appendChild(createRequestsChart(1, 'siteName', 'Top Site'));
    container.appendChild(createLongRequestChart('Long running requests'));
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
    var client = new elasticsearch.Client({
        host: 'http://elastic.laget.se/'
    });
    client.search({
        index: ElasticHelper.getDateIndexNames('requests-', new Date(request.start), new Date(request.end)),
        size: 0,
        body: query
    }).then(function (resp) {
        console.log(resp.aggregations.routes.buckets);
        request.onComplete(resp.aggregations.routes.buckets, request);
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
    var margin = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    };
    var width = 300;
    var height = 200;
    var innerWidth = width - (margin.left + margin.right);
    var innerHeight = height - (margin.top + margin.bottom);
    d3.select(chart.elm)
        .append("p")
        .attr("class", "box__title")
        .html(chart.header);
    d3.select(chart.elm)
        .append("p")
        .attr("class", "box__subtitle")
        .html(chart.lines[0].data.map(function (f) { return f.key; }).join(', '));
    var svg = d3.select(chart.elm)
        .attr("class", "box")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    svg.append('rect')
        .attr('width', width)
        .attr('height', height)
        .attr('x', -margin.left)
        .attr('y', -margin.top)
        .attr("class", "debugSvg");
    svg.append('rect')
        .attr('width', innerWidth)
        .attr('height', innerHeight)
        .attr("class", "debugSvgInner");
    for (var ww = 0; ww < chart.lines.length; ww++) {
        var lineConfig = chart.lines[ww];
        var max = d3.max(lineConfig.data, function (d) { return d3.max(d.dates.buckets, function (q) { return q.doc_count; }); });
        var min = d3.min(lineConfig.data, function (d) { return d3.min(d.dates.buckets, function (q) { return q.doc_count; }); });
        var x = d3.time.scale()
            .range([margin.left, innerWidth])
            .domain([lineConfig.start, lineConfig.end]);
        var y = d3.scale.linear()
            .range([innerHeight, 0])
            .domain(d3.extent([0, max]));
        for (var i = lineConfig.data.length - 1; i >= 0; i--) {
            var line = d3.svg.line()
                .x(function (d) { return x(d.key); })
                .y(function (d) { return y(d.doc_count); });
            svg.append("path")
                .datum(lineConfig.data[i].dates.buckets)
                .attr("class", "line")
                .attr("d", line);
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
    d3.select(chart.elm)
        .append("p")
        .attr("class", "box__title")
        .html(chart.header);
    d3.select(chart.elm)
        .append("p")
        .attr("class", "box__subtitle")
        .html(chart.lines[0].data.map(function (f) { return f.perRequest.buckets[0].key; }).join(', '));
    var svg = d3.select(chart.elm)
        .attr("class", "box")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    for (var ww = 0; ww < chart.lines.length; ww++) {
        var lineConfig = chart.lines[ww];
        var maxX = d3.max(lineConfig.data, function (d) { return d.perRequest.buckets[0].startTime.value; });
        var minX = d3.min(lineConfig.data, function (d) { return d.perRequest.buckets[0].startTime.value; });
        var x = d3.time.scale()
            .range([margin.left, innerWidth])
            .domain([lineConfig.start, lineConfig.end]);
        var y = d3.scale.linear()
            .range([innerHeight, 0])
            .domain(d3.extent([minX, maxX]));
        for (var i = 0; i < lineConfig.data.length; i++) {
            svg.append("rect")
                .x(function (a, b) { return i * 10; })
                .attr("fill", "white")
                .attr("width", 10)
                .attr("height", 10);
        }
    }
};
//# sourceMappingURL=app.js.map