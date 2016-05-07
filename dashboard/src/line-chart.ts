

var drawLine = function(chart: LineChart) {
    var svg = chart.elm;

    var maxY = d3.max(chart.lines, f => d3.max(f.points, q => q.y));
    var minY = 0;
    var maxX = chart.end;
    var minX = chart.start;

    var x = d3.time.scale()
      .range([0, chart.width])
      .domain([minX, maxX]);

    var y = d3.scale.linear()
      .range([chart.height, 0]).nice()
      .domain(d3.extent([minY, maxY]));

    var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

    var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

    svg.append("g")
       .attr("class", "x axis")
       .attr("transform", "translate(0," + chart.height + ")")
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
