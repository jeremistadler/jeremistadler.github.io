/// <reference path="defs/d3.d.ts" />
/// <reference path="defs/jquery.d.ts" />
function buildQuery(startTime, endTime, fields) {
    return {
        "size": 10000,
        "fields": fields,
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
        }
    };
}
var timeEnd = Math.floor(new Date().getTime());
var timeStart = timeEnd - 60 * 60 * 24 * 1 * 4 * 1000;
var query = buildQuery(timeStart, timeEnd, ['score', 'Time']);
function objToArr(obj) {
    var arr = [];
    for (var key in obj)
        if (!isNaN(obj[key]))
            arr.push({ key: key, value: obj[key] });
    return arr;
}
var renderGraph = function (response) {
    var data = response.hits.hits;
    for (var i = 0; i < data.length; i++) {
        data[i] = {
            time: new Date(data[i].fields.Time[0]),
            score: data[i].fields.score[0]
        };
    }
    var margin = { top: 20, right: 40, bottom: 40, left: 40 }, chartWidth = 500 - margin.left - margin.right, chartHeight = 200 - margin.top - margin.bottom;
    var format = d3.time.format("%d");
    var chart = d3
        .select("#chart1")
        .append('svg')
        .attr('width', chartWidth + margin.left + margin.right)
        .attr('height', chartHeight + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var color = d3.scale.linear()
        .domain([0, 100])
        .range(['red', 'green']);
    var verticalScale = d3.scale.linear()
        .domain([0, 100])
        .range([chartHeight, 0]);
    var minTime = d3.min(data, function (d) { return d.time; });
    var maxTime = d3.max(data, function (d) { return d.time; });
    var timeScale = d3.scale.linear()
        .domain([minTime, maxTime])
        .range([0, chartWidth]);
    chart
        .selectAll("div")
        .data(data)
        .enter().append('circle')
        .attr('r', 3)
        .attr('opacity', 0.1)
        .attr('fill', function (d) { return color(d.score); })
        .attr('transform', function (d) { return 'translate(' + timeScale(d.time) + ',' + verticalScale(d.score) + ')'; });
    var xAxis = d3.svg.axis()
        .scale(timeScale)
        .orient('bottom')
        .tickFormat(function (d) { return format(new Date(d)); })
        .ticks(14);
    var yAxis = d3.svg.axis()
        .scale(verticalScale)
        .orient('right')
        .ticks(4);
    chart.append('g')
        .attr("class", 'axis')
        .attr("transform", "translate(0," + chartHeight + ")")
        .call(xAxis);
    chart.append('g')
        .attr("class", 'axis')
        .attr("transform", "translate(" + chartWidth + ",0)")
        .call(yAxis);
};
$(function () {
    $.post('http://elastic.pliq.se/speed-laget-pages-v1/_search', JSON.stringify(query), renderGraph);
});
