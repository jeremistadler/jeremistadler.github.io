
var updateMonitorGraph = function(){
  var apiKey = 'm776903669-4c9d4e88a25c513045a2e656';

  var url = 'https://api.uptimerobot.com/getMonitors?apiKey=' + apiKey + '&logs=1&responseTimes=1&format=json&noJsonCallback=1';
  d3.json(url, function(error, json) {
  if (error) return console.warn(error);

  var format = d3.time.format("%m/%d/%y %H:%M:%S");
  var color = d3.scale.ordinal()
                .domain([1, 2, 98, 99])
                .range(['red', 'green', 'orange', 'gray']);

  var chart = d3
  .select("#uptimeChart")
  .append('svg')
  .attr('width', 300)
  .attr('height', 150)
  .append("g")
  .attr("transform", "translate(20,20)")
  ;


      var minTime = d3.min(json.monitors.monitor[0].log, d => format.parse(d.datetime));
      var maxTime = d3.max(json.monitors.monitor[0].log, d => format.parse(d.datetime));

  var uptimeDateScale = d3.time.scale()
                          .domain([minTime, maxTime])
                          .range([10, 200]);

  var widthScale = d3.scale.linear()
                     .domain([0, maxTime.getTime() - minTime.getTime()])
                     .range([20, 50]);

var logs = <any[]>json.monitors.monitor[0].log;
logs.sort(f => format.parse(f.datetime).getTime());


   chart
      .selectAll("div")
      .data(json.monitors.monitor[0].log)
      .enter().append('rect')
      .attr('width', (d, i) => {
        var nextTime = (i > logs.length - 2 ? maxTime : format.parse(logs[i + 1].datetime)).getTime()
        var currentTime = format.parse(d.datetime).getTime();
        return widthScale(nextTime - currentTime);
      })
      .attr('height', 10)
      .attr('fill', d => color(d.type));


var chart = d3
      .select("#responseChart")
      .append('svg')
      .attr('width', 300)
      .attr('height', 150)
      .append("g")
      .attr("transform", "translate(20,20)")
      ;


    var color = d3.scale.linear()
                  .domain([100, 5000])
                  .range(['green', 'red']);

    var verticalScale = d3.scale.linear()
                  .domain([100, 5000])
                  .range([130, 10]);

    var minTime = d3.min(json.monitors.monitor[0].responsetime, d => format.parse(d.datetime));
    var maxTime = d3.max(json.monitors.monitor[0].responsetime, d => format.parse(d.datetime));

    var timeScale = d3.time.scale()
                      .domain([minTime, maxTime])
                      .range([0, 270]);

    var i = 0;
        var bar = chart
          .selectAll("div")
          .data(json.monitors.monitor[0].responsetime)
          .enter().append('circle')
          .attr('r', 3)
          .attr('fill', d => color(d.value))
          .attr('transform', d => 'translate(' + timeScale(format.parse(d.datetime)) + ',' + verticalScale(d.value) + ')');

});
}

updateMonitorGraph();
