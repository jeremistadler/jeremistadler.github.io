
var drawTimeline = function(chart: LineSettings) {
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
    .html(chart.lines[0].data.map(f => f.perRequest.buckets[0].key).join(', '));

  var svg = d3.select(chart.elm)
    .attr("class", "box")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    ;

  for (let ww = 0; ww < chart.lines.length; ww++) {
    var lineConfig = chart.lines[ww];

    var maxX = d3.max(lineConfig.data, (d: any) => d.perRequest.buckets[0].startTime.value);
    var minX = d3.min(lineConfig.data, (d: any) => d.perRequest.buckets[0].startTime.value);

    var x = d3.time.scale()
      .range([margin.left, innerWidth])
      .domain([lineConfig.start, lineConfig.end]);

    var y = d3.scale.linear()
      .range([innerHeight, 0])
      .domain(d3.extent([minX, maxX]));

    for (var i = 0; i < lineConfig.data.length; i++) {
			svg.append("rect")
				.x((a,b) => i * 10)
				.attr("fill", "white")
				.attr("width", 10)
        .attr("height", 10)
    }
  }
}
