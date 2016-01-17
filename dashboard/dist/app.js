var createRequestsChart = function (hours, selector, header) {
    var elm = document.createElement('div');
    var dateEnd = new Date().getTime() - 1000 * 10;
    var dateStart = dateEnd - 1000 * 60 * 60 * hours;
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
        onComplete: onFetched
    });
    return elm;
};
document.addEventListener('DOMContentLoaded', function () {
    var container = document.getElementById('container-js');
    container.appendChild(createRequestsChart(1, 'environment', 'All Requests'));
    container.appendChild(createRequestsChart(1, 'route', 'Top route'));
    container.appendChild(createRequestsChart(1, 'url', 'Top Url'));
    container.appendChild(createRequestsChart(1, 'siteName', 'Top Site'));
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
        index: ElasticHelper.getIndicesNames('requests'),
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
    ElasticHelper.getIndicesName = function (name, date) {
        var month = '' + (date.getMonth() + 1);
        var day = '' + date.getDate();
        var year = date.getFullYear();
        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        return name + '-' + [year, month, day].join('-');
    };
    ElasticHelper.getIndicesNames = function (name) {
        var now = new Date();
        return [
            ElasticHelper.getIndicesName(name, now),
            ElasticHelper.getIndicesName(name, new Date(now.getTime() - 1000 * 60 * 60 * 24))
        ].join(',');
    };
    return ElasticHelper;
}());
var drawLine = function (chart) {
    var margin = {
        top: 90,
        right: 10,
        bottom: 10,
        left: 10
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
//# sourceMappingURL=app.js.map