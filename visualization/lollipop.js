// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 250},
    width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

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
    console.log(data)
    //data = data.sort((a,b)=>d3.descending(+a.polarity_women, +b.polarity_women)) 
    data = data.sort((a,b)=> d3.descending(+a.difference, +b.difference))
    data = data.filter(d=> Math.abs(d.difference) > 0.15)


  // Add X axis
  var x = d3.scaleLinear()
    .domain([-0.1,d3.max(data, d=>d.difference)+0.1])
    .range([ 0, width-10]);
   // .padding(0.001);
    
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .attr("class", "polarityCompxAxis")
  svg.append("text")
    .attr("class", "polarityCompxAxisLabel")
    .attr("y", height)
    .attr("x",margin)
    .attr("dy", "1em")
    .style("text-anchor", "start")
    .text("← Less polarizing language")
              
  
  svg.append("text")
    .attr("class", "polarityCompxAxisLabel")
    .attr("y", height)
    .attr("x",width)
    .attr("dy", "1em")
    .style("text-anchor", "end")
    .text("More polarizing language →")

    svg.append("text")
    .attr("class", "xAxisLabel")
    .attr("y", margin)
    .attr("x",50)
    .attr("dy", "1em")
    .style("text-anchor", "start")
    .text("All headlines")
    .attr("class", "polarityCompAllText")
              
  
  svg.append("text")
    .attr("class", "xAxisLabel")
    .attr("y", margin)
    .attr("x",width)
    .attr("dy", "1em")
    .style("text-anchor", "end")
    .text("Headlines about women")
    .attr("class", "polarityCompFemText")

  // Y axis
  var y = d3.scaleBand()
    .range([ 0, height ])
    .domain(data.map(d=>d.site_clean))
    // Padding from the top
    .padding(1);
  svg.append("g")
    .call(d3.axisLeft(y)
            .tickSize(0))
    .call(g => g.select(".domain").remove())
    .attr("class", "polarityCompyAxis");

  // Lines  
  

  svg.selectAll("gridLine")
  .data(data)
  .enter()
  .append("line")
    .attr("x1", 10)
    .attr("x2", width)
    .attr("y1", function(d) { return y(d.site_clean); })
    .attr("y2", function(d) { return y(d.site_clean); })
    .attr("class", "grid");


  // Horizontal line between bubbles
  svg.selectAll("myline")
    .data(data)
    .enter()
    .append("line")
      .attr("x1", function(d) { return x(d.polarity_base); })
      .attr("x2", function(d) { return x(d.polarity_women); })
      .attr("y1", function(d) { return y(d.site_clean); })
      .attr("y2", function(d) { return y(d.site_clean); })
      .attr("stroke", "black")
      .attr("stroke-width", "1px")


     // .attr("class", "polarityCompLine")

  // Circles of variable 1
  svg.selectAll("mycircle")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function(d) { return x(d.polarity_base); })
      .attr("cy", function(d) { return y(d.site_clean); })
      .attr("r", "12")
      .attr("class", "polarityCompBubbleLeft")
      // .style("fill", "#69b3a2")

  // Circles of variable 2
  svg.selectAll("mycircle")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function(d) { return x(d.polarity_women); })
      .attr("cy", function(d) { return y(d.site_clean); })
      .attr("class", "polarityCompBubbleRight")
      // size of the bubble
      .attr("r", "12")
      // .style("fill", "#4C4082")
})
