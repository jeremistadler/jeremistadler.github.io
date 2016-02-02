
var drawTimeline = function(chart: TimelineChart) {
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
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    ;

  for (let ww = 0; ww < chart.lines.length; ww++) {
    var lineConfig = chart.lines[ww];

    var x = d3.time.scale()
      .range([margin.left, innerWidth])
      .domain([lineConfig.start, lineConfig.end]);

    svg.append("rect")
    	.attr("x", (a,b) => i * 10)
    	.attr("fill", "white")
    	.attr("width", 10)
        .attr("height", 10)
  }
}
