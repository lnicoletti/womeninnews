// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 40},
// big network
  // width = 2500 - margin.left - margin.right,
  // height = 2500 - margin.top - margin.bottom;
width5 = 1500;
// country networks
width = width5/2 - margin.left - margin.right,
height = 600 - margin.top - margin.bottom;

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
  // d3.json("../data/processed/word_connections_4.json").then(function(data) {
// d3.json("../data/processed/word_connections_4_themes_filtered.json").then(function(data) {
  Promise.all([
    d3.csv("../data/processed/countries_freq.csv"),
    d3.json("../data/processed/word_connections_UK.json"),
    d3.json("../data/processed/word_connections_USA.json"),
    d3.json("../data/processed/word_connections_IN.json"),
    d3.json("../data/processed/word_connections_SA.json"),
        ]).then(function(data) {
    countries_data = data[0]
    UK_data = data[1]
    USA_data = data[2]
    IN_data = data[3]
    SA_data = data[4]
    console.log(countries_data)
    console.log(UK_data)
    drawNetwork(UK_data)
    // draw_chart(countries_data, "#chart1", "India", 10)    
    // draw_chart(countries_data, "#chart2", "USA", 10)   
    // draw_chart(countries_data, "#chart3", "UK", 10)   
    // draw_chart(countries_data, "#chart4", "South Africa", 10)  
     }
        )

  // d3.json("../data/processed/word_connections_UK.json").then(data=>drawNetwork(data))
  
  function drawNetwork(data) {
    // d3.json("../data/processed/word_connections_IN_small.json").then(function(data) {
    const links = data.links.map(d => Object.create(d))
    const nodes = data.nodes.map(d => Object.create(d))

    console.log(data)
    // console.log(data.nodes.filter(d=>d.frequency>50))
  // Initialize the links

  // scales
  extentWordFreq = d3.extent(nodes, d=>d.perc_freq)
            console.log(extentWordFreq)
  var bubbleRadius = d3.scaleSqrt()
                .domain(extentWordFreq)
                // big net
                // .range([1, 25])
                .range([0.1, 4])

  extentLinkWeight = d3.extent(links, d=>d.weight)
          console.log(extentLinkWeight)
  var linkWeight = d3.scaleLinear()
                .domain(extentLinkWeight)
                .range([0.00005, 4])
  
  var linkOpacity = d3.scaleLinear()
                .domain(extentLinkWeight)
                .range([0.05, 1])

  var nodeOpacity = d3.scaleLinear()
                .domain(extentWordFreq)
                .range([0.2, 1])

  var textOpacity = d3.scaleLinear()
                .domain(extentWordFreq)
                .range([0.4, 1])
                
  var fontScale = d3.scaleLinear()
                .domain(extentWordFreq)
                // big net
                // .range([7, 60])
                .range([1, 12])

  
  // var linkWeight = d3.scaleLinear()
  //               .domain(extentLinkWeight)
  //               .range([0.005, 10])

  // Let's list the force we wanna apply on the network
  // var simulation = d3.forceSimulation(data.nodes)                 // Force algorithm is applied to data.nodes
  simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink()                               // This force provides links between nodes
            .id(function(d) { return d.id; })                     // This provide  the id of a node
            // .links(data.links)                                    // and this the list of links
            .links(links)  
      )

     .force("charge", d3.forceManyBody().strength(-15))         // This adds repulsion between nodes. Play with the -400 for the repulsion strength
      // word_connections_4_themes_filtered
     .force("center", d3.forceCenter(width / 2, height / 2)) 
     .force("x", d3.forceX())
     .force("y", d3.forceY())
      // .force("charge", d3.forceManyBody().strength(-400))         
      //  // word_connections_4_themes_filtered
      // .force("center", d3.forceCenter(width / 1.7, height / 1.3)) 
      // word_connections_4_themes
      // .force("center", d3.forceCenter(width / 2, height / 2)) 
          // This force attracts nodes to the center of the svg area
      .on("end", ticked);

  var link = svg
    .selectAll("line")
    // .data(data.links)
    .data(links)
    // .join("line")
    .join("path")
    .attr("fill", "none")
      // .style("stroke", "#aaa")
      .style("stroke-width", d=>linkWeight(d.weight))
      .style("opacity", d=>linkOpacity(d.weight))
      .style("stroke", d=>d.theme === "female_bias"?"pink":
                        d.theme === "male_bias"?"blue":
                        d.theme === "empowerment"?"#ccad34":
                        d.theme === "violence"?"red":
                        d.theme === "politics"?"green":
                        d.theme === "race"?"#964B00":
                        "#aaa")

  // Initialize the nodes
  var node = svg
    .selectAll("circle")
    // .data(data.nodes)
    .data(nodes.filter( d => (d.perc_freq >= 60) ))
    // .data(nodes)

    circle = node.join("circle")
      .attr("r", d=>bubbleRadius(d.perc_freq))
      .attr("opacity", d=>nodeOpacity(d.perc_freq))
      // .attr("r", 5)
      .style("fill", d=>d.theme === "female_bias"?"pink":
                        d.theme === "male_bias"?"blue":
                        d.theme === "empowerment"?"#ccad34":
                        d.theme === "violence"?"red":
                        d.theme === "politics"?"green":
                        d.theme === "race"?"#964B00":
                        "#9b9b9b")
      .on('mouseover.fade', fade(0.1))
      .on('mouseout.fade', fade(1));

  // label each node
  // add a label to each node
  var text = svg
    .selectAll("text")
    // .data(data.nodes.filter( d => (d.frequency >= 70) ))
    .data(nodes.filter(d => (d.perc_freq >= 150)))
    .join("text")
    .text(d=>d.id)
    // .style("fill", "black")
    .style("fill", d=>d.theme === "female_bias"?"pink":
                        d.theme === "male_bias"?"blue":
                        d.theme === "empowerment"?"#ccad34":
                        d.theme === "violence"?"red":
                        d.theme === "politics"?"green":
                        d.theme === "race"?"#964B00":
                        "#9b9b9b")
    // .attr("font-size", 10);
    .attr("font-size", d=>fontScale(d.perc_freq))
    .attr("font-weight", "900")
    .attr("opacity", d=>textOpacity(d.perc_freq))
    .attr("class", 'nodeText')
    .on('mouseover.fade', fade(0.05))
    .on('mouseout.fade', fade(1));
    // .style("stroke-width", 0.5)
    // .style("fill", function(d) {
    //     return d.colour;
    // });

  // This function is run at each iteration of the force algorithm, updating the nodes position.
  function ticked() {
    link
      // .attr("d", positionLink);
      .attr("d", linkArc);
        // .attr("x1", function(d) { return d.source.x; })
        // .attr("y1", function(d) { return d.source.y; })
        // .attr("x2", function(d) { return d.target.x; })
        // .attr("y2", function(d) { return d.target.y; });

    circle
         .attr("cx", function (d) { return d.x; })
         .attr("cy", function(d) { return d.y; });
    // link.attr("d", positionLink);
    // circle.attr("transform", positionNode)
    text
         .attr("x", function (d) { return d.x+5; })
         .attr("y", function(d) { return d.y; })
    
  }

  console.log("data plotted")

  function fade(opacity) {
    return d => {
      circle.style('opacity', function (o) { return isConnected(d, o) ?d=>nodeOpacity(d.perc_freq): opacity });
      text.style('visibility', function (o) { return isConnected(d, o) ? "visible" : "hidden" });
      link.style('opacity', o => (o.source === d || o.target === d ? 1 : opacity));
      if(opacity === 1){
        circle.style('opacity', d=>nodeOpacity(d.perc_freq))
        text.style('visibility', 'visible')
        text.style('opacity', d=>textOpacity(d.perc_freq))
        link.style('opacity', d=>linkOpacity(d.weight))
      }
    };
  }
  
  const linkedByIndex = {};
  links.forEach(d => {
    linkedByIndex[`${d.source.index},${d.target.index}`] = 1;
  });
  
  function isConnected(a, b) {
    return linkedByIndex[`${a.index},${b.index}`] || linkedByIndex[`${b.index},${a.index}`] || a.index === b.index;
  }

};

function linkArc(d) {
  const r = Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y);
  return `
    M${d.source.x},${d.source.y}
    A${r},${r} 0 0,1 ${d.target.x},${d.target.y}
  `;
}

// drag = simulation => {
  
//   function dragstarted(d) {
//     if (!d3.event.active) simulation.alphaTarget(0.3).restart();
//     d.fx = d.x;
//     d.fy = d.y;
//   }
  
//   function dragged(d) {
//     d.fx = d3.event.x;
//     d.fy = d3.event.y;
//   }
  
//   function dragended(d) {
//     if (!d3.event.active) simulation.alphaTarget(0);
//     d.fx = null;
//     d.fy = null;
//   }
  
//   return d3.drag()
//       .on("start", dragstarted)
//       .on("drag", dragged)
//       .on("end", dragended);
// }

// function linkArc(d) {
//   var dx = d.target.x - d.source.x,
//       dy = d.target.y - d.source.y,
//       dr = Math.sqrt(dx * dx + dy * dy);
//   return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
// }

// function positionLink(d) {
//   return "M" + d[0].x + "," + d[0].y
//        + "S" + d[1].x + "," + d[1].y
//        + " " + d[2].x + "," + d[2].y;
// }

// function positionNode(d) {
//   return "translate(" + d.x + "," + d.y + ")";
// }
// links are drawn as curved paths between nodes
// function linkArc(d) {
//   var offset = 100;

//   var midpoint_x = (d.source.x + d.target.x) / 2;
//   var midpoint_y = (d.source.y + d.target.y) / 2;

//   var dx = (d.target.x - d.source.x);
//   var dy = (d.target.y - d.source.y);

//   var normalise = Math.sqrt((dx * dx) + (dy * dy));

//   var offSetX = midpoint_x + offset*(dy/normalise);
//   var offSetY = midpoint_y - offset*(dx/normalise);

//   return "M" + d.source.x + "," + d.source.y +
//       "S" + offSetX + "," + offSetY +
//       " " + d.target.x + "," + d.target.y;
// }