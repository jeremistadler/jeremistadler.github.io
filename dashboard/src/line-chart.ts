
var drawText = function(chart: TextChart) {
    chart.elm
      .append("p")
      .attr("class", "box__title")
      .html(chart.text);
}

var drawLine = function(chart: LineChart) {
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


  var svg = chart.elm
    .attr("class", "box")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    ;

  svg.append('rect')
    .attr('width', width)
    .attr('height', height)
    .attr('x', -margin.left)
    .attr('y', -margin.top)
    .attr("class", "debugSvg")

  svg.append('rect')
    .attr('width', innerWidth)
    .attr('height', innerHeight)
    .attr("class", "debugSvgInner")

  for (let ww = 0; ww < chart.lines.length; ww++) {
    var line = chart.lines[ww];

    var maxY = d3.max(line.points, f => f.y);
    var minY = d3.min(line.points, f => f.y);
    var maxX = d3.max(line.points, f => f.x);
    var minX = d3.min(line.points, f => f.x);


    var x = d3.time.scale()
      .range([margin.left, innerWidth])
      .domain([chart.start, chart.end]);

    var y = d3.scale.linear()
      .range([innerHeight, 0])
      .domain(d3.extent([0, maxY]));

    var color = d3.scale.linear()
    .range(["hsl(100, 50, 50)", "hsl(150, 50, 50)"])
    .interpolate(d3.interpolateHcl);

    for (var i = line.points.length - 1; i >= 0; i--) {
      var lineData = d3.svg.line()
        .x(function(d: any) {
            var q = x(d.x)
            return  q;
         })
        .y(function(d: any) {
            return y(d.y);
        });

    if (chart.smooth)
        lineData = lineData.interpolate("basis")

      svg.append("path")
        .datum(line.points)
      //.attr("transform", "translate(0," + 15 + ")")
        .attr("class", "line")
        .attr("stroke", (f, i) => color(i * 4 + 3))
        .attr("d", lineData)
    }
  }
}
