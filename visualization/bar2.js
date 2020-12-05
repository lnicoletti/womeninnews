// Set the margins
var margin = {top: 60, right: 100, bottom: 20, left: 80},
  width = 850 - margin.left - margin.right,
  height = 370 - margin.top - margin.bottom;

// Parse the month variable
var parseMonth = d3.timeParse("%b");
var formatMonth = d3.timeFormat("%b");

// Set the ranges
var x = d3.scaleTime().domain([parseMonth("Jan"),parseMonth("Dec")]).range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// Define the line
var valueLine = d3.line()
    .x(function(d) { return x(d.frequency); })
    .y(function(d) { return y(+d.word); })

// Create the svg canvas in the "graph" div
var svg = d3.select("#chart1")
        .append("svg")
        .style("width", width + margin.left + margin.right + "px")
        .style("height", height + margin.top + margin.bottom + "px")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform","translate(" + margin.left + "," + margin.top + ")")
        .attr("class", "svg");

// Import the CSV data
Promise.all([
d3.csv("https://gist.githubusercontent.com/SahitiSarva/33f33d7b8945eb134219fe95314aba34/raw/ef51e091077f805922dbab570ab0ae444a03c7cf/countries_freq.csv")
    ]).then(function(data) {

        country_data = data
        console.log(country_data)
  
   // Format the data
  data.forEach(function(d) {
      d.word = d.word;
      d.frequency = +d.frequency;
      d.country = d.country;
  });
  console.log(data)

  var nest = d3.nest()
	  .key(function(d){
	    return d.country;
	  })
      .entries(data)
      console.log(nest)

  // Scale the range of the data
  x.domain(d3.extent(data, function(d) { return d.frequency; }));
  y.domain([0, d3.max(data, function(d) { return d.word; })]);
  
  // Set up the x axis
  var xaxis = svg.append("g")
       .attr("transform", "translate(0," + height + ")")
       .attr("class", "x axis")
       .call(d3.axisBottom(x)
          .ticks(d3.timeMonth)
          .tickSize(0, 0)
          .tickFormat(d3.timeFormat("%B"))
          .tickSizeInner(0)
          .tickPadding(10));

  // Add the Y Axis
   var yaxis = svg.append("g")
       .attr("class", "y axis")
       .call(d3.axisLeft(y)
          .ticks(5)
          .tickSizeInner(0)
          .tickPadding(6)
          .tickSize(0, 0));

 // yaxis.select(".domain").style("display","none")
  
  // Add a label to the y axis
  svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - 60)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Monthly Sales")
        .attr("class", "y axis label");
  
  // Draw the line
  svg.selectAll(".line")
      .data(data)
      .enter()
      .append("path")
	      .attr("class", "line")
	      .attr("d", function(d){
	      	return valueLine(d.frequency)});
  
})