/// <reference path="defs/d3.d.ts" />
/// <reference path="defs/jquery.d.ts" />
function buildQuery(startTime, endTime, aggs) {
    return {
        "query": {
            "filtered": {
                "filter": {
                    "bool": {
                        "must": [
                            {
                                "range": {
                                    "Time": {
                                        "gte": startTime,
                                        "lte": endTime
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        },
        "size": 0,
        "aggs": aggs
    };
}
var timeEnd = Math.floor(new Date().getTime());
var timeStart = timeEnd - 60 * 60 * 24 * 7 * 2 * 1000;
var query = buildQuery(timeStart, timeEnd, {
    "1": {
        "date_histogram": {
            "field": "Time",
            "interval": "1h",
            "pre_zone": "+02:00",
            "pre_zone_adjust_large_interval": true,
            "min_doc_count": 0,
            "extended_bounds": {
                "min": timeStart,
                "max": timeEnd
            }
        },
        "aggs": {
            "1": {
                "percentiles": {
                    "field": "score",
                    "percents": [1, 5, 25, 50, 75, 95, 99]
                }
            }
        }
    }
});
function objToArr(obj) {
    var arr = [];
    for (var key in obj)
        if (!isNaN(obj[key]))
            arr.push({ key: key, value: obj[key] });
    return arr;
}
var renderGraph = function (response) {
    var data = response.aggregations['1'].buckets;
    var margin = { top: 20, right: 40, bottom: 40, left: 40 }, chartWidth = 500 - margin.left - margin.right, chartHeight = 200 - margin.top - margin.bottom;
    var barWidth = chartWidth / data.length;
    var yScale = d3.scale.linear()
        .domain([100, 30])
        .range([0, chartHeight]);
    var xScale = d3.time.scale()
        .range([0, chartWidth])
        .domain([data[0].key, data[data.length - 1].key]);
    var score = d3.scale.linear()
        .domain([90, 50])
        .range([0, 1]);
    var format = d3.time.format("%a");
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom')
        .tickFormat(format)
        .ticks(14);
    ;
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('right')
        .ticks(4);
    var chart = d3
        .select("#chart1")
        .append('svg')
        .attr('width', chartWidth + margin.left + margin.right)
        .attr('height', chartHeight + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    chart.append('g')
        .attr("class", 'axis')
        .attr("transform", "translate(0," + chartHeight + ")")
        .call(xAxis);
    chart.append('g')
        .attr("class", 'axis')
        .attr("transform", "translate(" + chartWidth + ",0)")
        .call(yAxis);
    var bar = chart
        .selectAll("div")
        .data(data)
        .enter().append('g')
        .attr('transform', function (d) { return 'translate(' + xScale(d.key) + ',0)'; });
    bar.selectAll('div')
        .data(function (d) { return objToArr(d['1'].values); })
        .enter().append("rect")
        .style('height', function (d) { return '5px'; })
        .style('width', (barWidth + 0.5) + 'px')
        .style('fill', function (d) { return d3.hsl(1, 0.5, 1 - score(d.value)).toString(); })
        .attr('y', function (d) { return yScale(d.value); })
        .attr('opacity', 0.8);
    var line = d3.svg.line()
        .defined(function (d) { return !isNaN(d['1'].values['50.0']); })
        .x(function (d) { return xScale(d.key); })
        .y(function (d) { return yScale(d['1'].values['50.0']); })
        .interpolate("basis");
    chart
        .append("path")
        .attr("d", line(data))
        .attr('stroke', 'black');
};
$(function () {
    $.post('http://elastic.pliq.se/speed-laget-pages-v1/_search', JSON.stringify(query), renderGraph);
});
