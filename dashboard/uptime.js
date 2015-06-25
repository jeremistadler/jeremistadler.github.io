var drawResponseGraph = function (data) {
    var chart = d3
        .select("#responseChart")
        .append('svg')
        .attr('width', 300)
        .attr('height', 150)
        .append("g")
        .attr("transform", "translate(20,20)");
    var color = d3.scale.linear()
        .domain([100, 5000])
        .range(['green', 'red']);
    var verticalScale = d3.scale.linear()
        .domain([100, 5000])
        .range([130, 10]);
    var minTime = d3.min(data, function (d) { return d.datetime; });
    var maxTime = d3.max(data, function (d) { return d.datetime; });
    var timeScale = d3.time.scale()
        .domain([minTime, maxTime])
        .range([0, 270]);
    chart
        .selectAll("div")
        .data(data)
        .enter().append('circle')
        .attr('r', 3)
        .attr('fill', function (d) { return color(d.value); })
        .attr('transform', function (d) { return 'translate(' + timeScale(d.datetime) + ',' + verticalScale(d.value) + ')'; });
};
var updateMonitorGraph = function () {
    var apiKey = 'm776903669-4c9d4e88a25c513045a2e656';
    var url = 'https://api.uptimerobot.com/getMonitors?apiKey=' + apiKey + '&logs=1&responseTimes=1&format=json&noJsonCallback=1';
    d3.json(url, function (error, json) {
        if (error)
            return console.warn(error);
        var format = d3.time.format("%m/%d/%y %H:%M:%S");
        var responseTimes = json.monitors.monitor[0].responsetime;
        for (var i = 0; i < responseTimes.length; i++)
            responseTimes[i].datetime = format.parse(responseTimes[i].datetime);
        drawResponseGraph(responseTimes);
    });
};
updateMonitorGraph();
