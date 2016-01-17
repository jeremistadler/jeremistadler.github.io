

interface LineSettings {
	header: string;
	elm: HTMLElement;
	lines: LineSettingsChart[];
}

interface LineSettingsChart {
	data: any;
	start: number;
	end: number;
}

var drawLine = function(chart: LineSettings) {
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
		.html(chart.lines[0].data.map(f => f.key).join(', '));


	var svg = d3.select(chart.elm)
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
	    var lineConfig = chart.lines[ww];

		var max = d3.max(lineConfig.data, (d:any) => d3.max(d.dates.buckets, (q:any) => q.doc_count));
		var min = d3.min(lineConfig.data, (d:any) => d3.min(d.dates.buckets, (q:any) => q.doc_count));


		var x = d3.time.scale()
			.range([margin.left, innerWidth])
			.domain([lineConfig.start, lineConfig.end]);

		var y = d3.scale.linear()
			.range([innerHeight, 0])
			.domain(d3.extent([0, max]));

		for (var i = lineConfig.data.length - 1; i >= 0; i--) {
			var line = d3.svg.line()
				//.interpolate("basis")
				.x(function(d:any) { return x(d.key); })
				//.y(function(d:any) { return y(d.times.value); });
				.y(function(d:any) { return y(d.doc_count); });

			svg.append("path")
				.datum(lineConfig.data[i].dates.buckets)
				//.attr("transform", "translate(0," + 15 + ")")
				.attr("class", "line")
				.attr("d", line)
		}
	}
}
