// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 40},
  width = 2500 - margin.left - margin.right,
  height = 2500 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
.append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 "+ width +"," + height+"")
    .classed("svg-content", true);
//   .attr("width", width + margin.left + margin.right)
//   .attr("height", height + margin.top + margin.bottom)
// .append("g")
//   .attr("transform",
//         "translate(" + margin.left + "," + margin.top + ")");

console.log("before json")

// d3.json("word_connections.json").then(function(data) {
  d3.json("../data/processed/word_connections_4.json").then(function(data) {
    console.log(data)
    // console.log(data.nodes.filter(d=>d.frequency>50))
  // Initialize the links

  // scales
  extentWordFreq = d3.extent(data.nodes, d=>d.frequency)
            console.log(extentWordFreq)
  var bubbleRadius = d3.scaleSqrt()
                .domain(extentWordFreq)
                .range([1, 25])

  extentLinkWeight = d3.extent(data.links, d=>d.weight)
          console.log(extentLinkWeight)
  var linkWeight = d3.scaleLinear()
                .domain(extentLinkWeight)
                .range([0.00005, 10])
  
  var linkOpacity = d3.scaleLinear()
                .domain(extentLinkWeight)
                .range([0.2, 1])
                
  var fontScale = d3.scaleLinear()
                .domain(extentWordFreq)
                .range([7, 60])
  
  // var linkWeight = d3.scaleLinear()
  //               .domain(extentLinkWeight)
  //               .range([0.005, 10])

  var link = svg
    .selectAll("line")
    .data(data.links)
    .join("line")
      .style("stroke", "#aaa")
      .style("stroke-width", d=>linkWeight(d.weight))
      .style("opacity", d=>linkOpacity(d.weight))

  // Initialize the nodes
  var node = svg
    .selectAll("circle")
    .data(data.nodes)
    
  circle = node.join("circle")
      .attr("r", d=>bubbleRadius(d.frequency))
      // .attr("r", 5)
      .style("fill", "black")
    .on("mouseover", (d) => {
        link.style('opacity', function(l) {
          if (d === l.source) return 1;
          else                return 0.08;
        })
      })
      .on("mouseout", (d) => {
          link.style("opacity", d=>linkOpacity(d.weight))
        });
  
  // label each node
  // add a label to each node
  var text = svg
    .selectAll("text")
    .data(data.nodes.filter( d => (d.frequency >= 300) ))
    .join("text")
    .text(d=>d.id)
    .style("fill", "black")
    // .attr("font-size", 10);
    .attr("font-size", d=>fontScale(d.frequency))
    .attr("font-weight", "900")
    .attr("class", 'nodeText')
    // .style("stroke-width", 0.5)
    // .style("fill", function(d) {
    //     return d.colour;
    // });

  // Let's list the force we wanna apply on the network
  var simulation = d3.forceSimulation(data.nodes)                 // Force algorithm is applied to data.nodes
      .force("link", d3.forceLink()                               // This force provides links between nodes
            .id(function(d) { return d.id; })                     // This provide  the id of a node
            .links(data.links)                                    // and this the list of links
      )
      .force("charge", d3.forceManyBody().strength(-400))         // This adds repulsion between nodes. Play with the -400 for the repulsion strength
      .force("center", d3.forceCenter(width / 2, height / 2)) 
          // This force attracts nodes to the center of the svg area
      .on("end", ticked);

  // This function is run at each iteration of the force algorithm, updating the nodes position.
  function ticked() {
    link
      // .attr("d", positionLink);
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    circle
         .attr("cx", function (d) { return d.x; })
         .attr("cy", function(d) { return d.y; });
    text
         .attr("x", function (d) { return d.x+28; })
         .attr("y", function(d) { return d.y-10; })
    
  }

  console.log("data plotted")

});

// links are drawn as curved paths between nodes
function positionLink(d) {
  var offset = 30;

  var midpoint_x = (d.source.x + d.target.x) / 2;
  var midpoint_y = (d.source.y + d.target.y) / 2;

  var dx = (d.target.x - d.source.x);
  var dy = (d.target.y - d.source.y);

  var normalise = Math.sqrt((dx * dx) + (dy * dy));

  var offSetX = midpoint_x + offset*(dy/normalise);
  var offSetY = midpoint_y - offset*(dx/normalise);

  return "M" + d.source.x + "," + d.source.y +
      "S" + offSetX + "," + offSetY +
      " " + d.target.x + "," + d.target.y;
}