// @TODO: YOUR CODE HERE!
let d3data;
let curX = 'income';
let curY = 'smokes';

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

function changeX(newX) {
	curX = newX;
	withD3();
}

function changeY(newY) {
	curY = newY;
	withD3();
}

function withD3() {

  var svgArea = d3.select("#scatter").select("svg");

  if (!svgArea.empty()) {
    svgArea.remove();
  }

  var svgWidth = window.innerWidth * 0.8;
  var svgHeight = window.innerHeight * 0.75;

  var margin = {
    top: 50,
    bottom: 100,
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
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
    .attr("class", "cgroup");

  var xScale = d3.scaleLinear()
    .domain([d3.min(d3data, d => d[curX]) * 0.9, d3.max(d3data, d => d[curX]) * 1.1])
    .range([0, width]);

  var yScale = d3.scaleLinear()
    .domain([d3.min(d3data, d => d[curY]) * 0.9, d3.max(d3data, d => d[curY]) * 1.1])
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

  var incomeLabel = chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top})`)
  	.classed("active", curX === 'income')
  	.classed("inactive", curX != 'income')
  	.text("Income");

  var povertyLabel = chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
  	.classed("active", curX === 'poverty')
  	.classed("inactive", curX != 'poverty')
  	.text("Poverty");

  var ageLabel = chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 40})`)
  	.classed("active", curX === 'age')
  	.classed("inactive", curX != 'age')
  	.text("Age");

  	povertyLabel.on("click", function() {
  		curX = "poverty";
  		withD3();
  	})

  	ageLabel.on("click", function() {
  		curX = "age";
  		withD3();
  	})

  	incomeLabel.on("click", function() {
		curX = "income";
		withD3();
  	})
//  var obeseLabel = chartGroup.append("text")
//    .attr("transform", "rotate(-90)", 'translate(' + width)
//    .attr('text-anchor', 'middle')
//  	.classed("active", curY === 'obesity')
//  	.classed("inactive", curY != 'obesity')
//  	.text("Obese (%)");
//
//  var smokesLabel = chartGroup.append("text")
//    .attr("transform", `translate(${width + margin.top + 20}, ${height/2})`)
//  	.classed("active", curX === 'smokes')
//  	.classed("inactive", curX != 'smokes')
//  	.text("Smokes (%)");
//
//  var healthcareLabel = chartGroup.append("text")
//    .attr("transform", "rotate(-90)", `translate(${width}, ${height/2})`)
//  	.classed("active", curX === 'healthcare')
//  	.classed("inactive", curX != 'healthcare')
//  	.text("Lacks Healthcare (%)");
//
//  	obeseLabel.on("click", function() {
//  		curY = "obesity";
//  		withD3();
//  	})
//
//  	smokesLabel.on("click", function() {
//  		curY = "smokes";
//  		withD3();
//  	})
//
//  	healthcareLabel.on("click", function() {
//		curY = "healthcare";
//		withD3();
//  	})
//
  var circlesGroup = svg.selectAll("circle").data(d3data).enter();
    
  circlesGroup
  	.append("circle")
    .attr("cx", d => xScale(d[curX]))
    .attr("cy", d => yScale(d[curY]))
    .attr("r", "10")
    .attr("class", d => "stateCircle " + d.abbr)
    .classed("stateCircle", true);

  circlesGroup
  	.append("text")
  	.text(d => d.abbr)
  	.attr("dx", d => xScale(d[curX]))
  	.attr("dy", d => yScale(d[curY]))
  	.attr("font-size", "8")
  	.classed("stateText", true);

  // Step 1: Initialize Tooltip
  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.abbr}</br>${curX}: ${d[curX]}</br>${curY}: ${d[curY]}`);
    });

  // Step 2: Create the tooltip in chartGroup.
  chartGroup.call(toolTip);

}

d3.csv('assets/data/data.csv').then(data => {
	d3data = data;
	parseData();
	console.log(d3data);
	//withPlotly(data);
	withD3();
});
