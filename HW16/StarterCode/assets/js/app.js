// @TODO: YOUR CODE HERE!

var d3data;

d3.csv('assets/data/data.csv').then(data => {
	d3data = data;
	parseData();
	console.log(d3data);
	//withPlotly(data);
	withD3();
});

function parseData() {
  d3data.forEach(function(data) {
  	data.income = parseFloat(data.income);
  	data.smokes = parseFloat(data.smokes);
  	data.healthcare = parseFloat(data.healthcare);
  	data.poverty = parseFloat(data.poverty);
  	data.obesity = parseFloat(data.obesity);
  	data.age = parseFloat(data.age);
  });
}

function withPlotly(data) {
	var trace = [{
		x: data.map(r => parseFloat(r.income)),
		y: data.map(r => parseFloat(r.smokes)),
		text: data.map(r => r.abbr),
		type: 'scatter',
		mode: 'markers'
	}];

	Plotly.newPlot('scatter', trace);
}

function withD3() {

  var curX = 'income';
  var curY = 'smokes';

  var svgArea = d3.select("#scatter").select("svg");

  if (!svgArea.empty()) {
    svgArea.remove();
  }

  var svgWidth = window.innerWidth * 0.8;
  var svgHeight = window.innerHeight * 0.7;

  var margin = {
    top: 50,
    bottom: 50,
    right: 50,
    left: 50
  };

  var height = svgHeight - margin.top - margin.bottom;
  var width = svgWidth - margin.left - margin.right;

  var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  var xScale = d3.scaleLinear()
    .domain(d3.extent(d3data, d => d[curX]))
    .range([0, width]);

  var yScale = d3.scaleLinear()
    .domain(d3.extent(d3data, d => d[curY]))
    .range([height, 0]);

  // create axes
  var xAxis = d3.axisBottom(xScale);
  var yAxis = d3.axisLeft(yScale);

  // append axes
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);

  chartGroup.append("g")
    .call(yAxis);

  var circlesGroup = chartGroup.selectAll("circle")
    .data(d3data)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d[curX]))
    .attr("cy", d => yScale(d[curY]))
    .attr("r", "15")
    .attr("class", d => "stateCircle " + d.abbr)
    .attr("fill", "lightblue")
    .attr("stroke-width", "1")
    .attr("stroke", "grey");

  var circlesName = chartGroup.selectAll("text")
  	.data(d3data)
  	.enter()
  	.append("text")
  	.text(d => d.abbr)
  	.attr("dx", d => xScale(d[curX]))
  	.attr("dy", d => yScale(d[curY]))
  	.attr("class", "stateText")
  	.attr("font-size", 10);

  // Step 1: Initialize Tooltip
  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.abbr}</br>${curX}: ${d[curX]}</br>${curY}: ${d[curY]}`);
    });

  // Step 2: Create the tooltip in chartGroup.
  chartGroup.call(toolTip);

  // Step 3: Create "mouseover" event listener to display tooltip
  circlesGroup.on("mouseover", function(d) {
    toolTip.show(d, this);
  })
  // Step 4: Create "mouseout" event listener to hide tooltip
    .on("mouseout", function(d) {
      toolTip.hide(d);
    });
}