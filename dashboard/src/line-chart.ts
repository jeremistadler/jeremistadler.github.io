

var drawLine = function(chart: LineChart) {
  var margin = {
    top: 0,
    right: 0,
    bottom: 50,
    left: 50
  };
  var innerWidth = chart.width - (margin.left + margin.right);
  var innerHeight = chart.height - (margin.top + margin.bottom);


  var svg = chart.elm
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    ;

  svg.append('rect')
    .attr('width', chart.width)
    .attr('height', chart.height)
    .attr('x', -margin.left)
    .attr('y', -margin.top)
    .attr("class", "debugSvg")

  svg.append('rect')
    .attr('width', innerWidth)
    .attr('height', innerHeight)
    .attr("class", "debugSvgInner")


    var maxY = d3.max(chart.lines, f => d3.max(f.points, q => q.y));
    var minY = 0;
    var maxX = chart.end;
    var minX = chart.start;


    var x = d3.time.scale()
      .range([margin.left, innerWidth])
      .domain([chart.start, chart.end]);

    var y = d3.scale.linear()
      .range([innerHeight, 0])
      .domain(d3.extent([0, maxY]));


    var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

    var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

      svg.append("g")
           .attr("class", "x axis")
           .attr("transform", "translate(0," + innerHeight + ")")
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

  for (let ww = 0; ww < chart.lines.length; ww++) {
    var line = chart.lines[ww];

    line.points[0].x = 0;
    line.points[1].x = 0;

    for (var i = 0; i < line.points.length; i++) {
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
