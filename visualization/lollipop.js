// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 150},
    width = 600 - margin.left - margin.right,
    height = 2000 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
d3.csv("../data/processed/polarity_comparison.csv", d3.autoType).then(function(data){
//d3.csv("../data/processed/polarity_comparison.csv", function(data) {
    console.log(data)
    data = data.sort((a,b)=>d3.descending(+a.polarity_women, +b.polarity_women)) 
    data = data.filter(d=> Math.abs(d.difference) > 0.05)


  // Add X axis
  var x = d3.scaleLinear()
    .domain([d3.min(data,d=>d.difference),0.8])
    .range([ 0, width-10]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .attr("class", "xAxis")

  // Y axis
  var y = d3.scaleBand()
    .range([ 0, height ])
    .domain(data.map(d=>d.site))
    //.domain(data.map(function(d) { return d.site; }))
    .padding(1);
  svg.append("g")
    .call(d3.axisLeft(y))
    .attr("class", "yAxis")

  // Lines  
  svg.selectAll("myline")
    .data(data)
    .enter()
    .append("line")
      .attr("x1", function(d) { return x(d.polarity_base); })
      .attr("x2", function(d) { return x(d.polarity_women); })
      .attr("y1", function(d) { return y(d.site); })
      .attr("y2", function(d) { return y(d.site); })
      .attr("stroke", "grey")
      .attr("stroke-width", "1px")

  // Circles of variable 1
  svg.selectAll("mycircle")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function(d) { return x(d.polarity_base); })
      .attr("cy", function(d) { return y(d.site); })
      .attr("r", "6")
      .style("fill", "#69b3a2")

  // Circles of variable 2
  svg.selectAll("mycircle")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function(d) { return x(d.polarity_women); })
      .attr("cy", function(d) { return y(d.site); })
      .attr("r", "6")
      .style("fill", "#4C4082")
})
