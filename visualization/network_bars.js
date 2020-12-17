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
    console.log(SA_data)
    console.log(countries_data)
    drawBarLegend()
    drawNetwork(UK_data, "div#my_network")
    drawBars(countries_data, "#chart1", "UK", 20, "United Kingdom")  
    drawNetwork(USA_data, "div#my_network2")  
    drawBars(countries_data, "#chart2", "USA", 20, "United States")   
    drawNetwork(IN_data, "div#my_network3") 
    drawBars(countries_data, "div#chart3", "India", 20, "India")   
    drawNetwork(SA_data, "div#my_network4") 
    drawBars(countries_data, "#chart4", "South Africa", 20, "South Africa")  
     }
        )

  // d3.json("../data/processed/word_connections_UK.json").then(data=>drawNetwork(data))
  
function drawBarLegend() {
  svg = d3.select("#barLegend")

  legendLine = svg.append("g")
    .selectAll("line")
      .data([{x1:0, x2:185, y1:28, y2:28}, {x1:0, x2:0, y1:28, y2:20}, {x1:185, x2:185, y1:28, y2:20}])
      .join("line")
      .attr("x1", d=>d.x1 )
      .attr("x2", d=> d.x2)
      .attr("y1", d=>d.y1 )
      .attr("y2", d=>d.y2)
      .attr("stroke", "red")
      .attr("stroke-width", "1px")
 
      svg.append("text")
          .text("number of headlines containing this word")
          .attr("x", 0)
          .attr("y", 45)
          // .style("text-anchor", "middle")
          .attr("class", "barLegendText")
          .call(wrap, 170)
}
  function drawNetwork(data, network) {
    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 30, bottom: 30, left: 30},
    // big network
      // width = 2500 - margin.left - margin.right,
      // height = 2500 - margin.top - margin.bottom;
    width5 = 1500;
    // country networks
    width = width5/2 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    // d3.select(network).selectAll("circle").remove()
    var svg = d3.select(network)
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 "+ width +"," + height+"")
    // .classed("svg-content", true);
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
                .range([1, 20])

  
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

     .force("charge", d3.forceManyBody().strength(-30))         // This adds repulsion between nodes. Play with the -400 for the repulsion strength
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
    .attr("class", 'netLink')
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
      // .attr("r", d=>bubbleRadius(d.perc_freq))
      .attr("r", 0)
      .attr("opacity", d=>nodeOpacity(d.perc_freq))
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
    .attr("id", function(d,i) { return "nodeText" + d.id; })
    .on('mouseover.fade', fade(0.05))
    .on('mouseover.log', d=>console.log(d))
    .on('mouseout.fade', fade(1))
    // .on('mouseover.test', d=>console.log(d))
    // .call(d=>textCheck(d));

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

    function fade(opacity) {
      return d => {
        circle.style('opacity', function (o) { 
          // console.log(d)
          // console.log(o)
          return isConnected(d, o) ?d=>nodeOpacity(d.perc_freq): opacity });
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
      // console.log(a)
      // console.log(b)
      // console.log(linkedByIndex)
      return linkedByIndex[`${a.index},${b.index}`] || linkedByIndex[`${b.index},${a.index}`] || a.index === b.index;
    }

    console.log(links)
    // console.log(linkedByIndex)
    barInteract()

    // d3.select("#chart1").selectAll("rect").on("mouseover", d => console.log(text._groups[0].filter(c=>c.textContent===d.word)[0].__data__)) //console.log(d.word) textContent === d.word
    // d3.select("#chart1").selectAll("rect").on("mouseover", d => console.log(text._groups[0].filter(c=>c.textContent===d.word)[0]))
    // d3.select("#chart1").selectAll("rect").on("mouseover.t", d => console.log(text._groups[0].filter(c=>c.textContent===d.word)[0].call(fade(0.05))))
    // d3.select("#chart1").selectAll("rect").on("mouseover.t", d => console.log(text.data(nodes.filter(c => (c.id === d.word)))))
    // d3.select("#chart1").selectAll("rect").on("mouseover.t", d => text.data(nodes.filter(c => (c.id === d.word)).style("fill", "yellow")))
    // d3.select("#chart1").selectAll("rect").on("mouseover", d => console.log(text.filter(c => c.id === d.word)))

    // d3.select("#chart1").selectAll("rect").on("mouseover.t", d => d3.select(text.filter(c => c.id === d.word).attr("font-size", "50px")))
    // d3.select("#chart1").selectAll("rect").on("mouseover.t", d => d3.select("#my_network").selectAll("text").attr("font-size", "50px"))
    // d3.select("#chart1").selectAll("rect").on("mouseover.t", d => console.log(d3.select("#my_network").selectAll('.nodeText')._groups.map(c=>c[0].textContent).attr("font-size", "50px")))
    
    // d3.select("#chart1").selectAll("rect").on("mouseover.t", d => 
    // d3.select("#chart1").selectAll("rect").on("mouseover.t", function(d) {

    //     text = d3.select("#my_network").selectAll('.nodeText')
    //     link = d3.select("#my_network").selectAll('.netLink')
    //     console.log(d3
    //                   .select("#my_network").selectAll('.nodeText')
    //                   .filter(function(c) { return this.textContent.match(d.word); })
    //                   .style('visibility', function (o) { return isConnected(d, o) ? "visible" : "hidden" })
    //                   )
    
    function barInteract() {
      d3.select("#chart1").selectAll("rect").on("mouseover.t", function(d) {

      // console.log(links)

      text = d3.select("#my_network").selectAll('.nodeText')
      links_sel = d3.select("#my_network").selectAll('.netLink')
      // const linkedByIndex = {};
      // links_sel.forEach(d => {
      //   linkedByIndex[`${d.source.index},${d.target.index}`] = 1;
      // });

      console.log(d.word)
      // console.log(links_sel)
      // console.log(linkedByIndex)
      // console.log(d3.select("#my_network").selectAll('.nodeText'))
      console.log(d3
                    .select("#my_network").selectAll('text#nodeText'+d.word)
                    // .filter(function(c) { return this.textContent.match(d.word); })
                    // .style('visibility', function (o) { return isConnected(d, o) ? "visible" : "hidden" })
                    )
        // console.log(

        // PICK UP HERE

        selected = d3.select("#my_network").selectAll('text#nodeText'+d.word)._groups[0][0].__data__
        // console.log(selected)
        all = d3.select("#my_network").selectAll('.nodeText')
        console.log(all)
        // all.style('visibility', function (o) { return console.log(o)})
        // all.style('visibility', function (o) { return console.log([`${selected.index},${o.index}`])})
        all.style('visibility', function (o) { return isConnected(selected, o)? "visible" : "hidden"})







        

        // all.style('visibility', function (o) { return console.log(selected, o)})

        // console.log(all.filter(function (o) { return console.log(linkedByIndex[`${selected.index},${o.index}`])}))
        // console.log(all.filter(function (o) { return console.log(linkedByIndex["70,71"])}))

        // console.log(all.filter(function (o) { return console.log(isConnected(selected, o))}))


          // d3
          // .select("#my_network").selectAll('.nodeText')
          // .filter(function(c) { return this.textContent.match(d.word); })//._groups[0][0].__data__
          // // .style('visibility', function (o) { 
          // //   console.log(d)
          // //   console.log(o)
          // //   return isConnected(d, o) ? "visible" : "hidden" })
          // .call(d=>
          //   text.style('visibility', function (o) {
          //   // console.log(d._groups[0][0].__data__)
          //   // console.log(o)
          //   console.log(isConnected(d._groups[0][0].__data__, o))
          //   return isConnected(d._groups[0][0].__data__, o) ? "visible" : "hidden" }))
          
          // .call(d=> link.style('opacity', o => (o.source === d || o.target === d ? 1 : 0.05)))
            
      })//)
    }
                      
    d3.select("#chart1").selectAll("rect").on("mouseout.t", d => 
          text.style('visibility', "visible" ))

        // console.log(d3.select("#my_network").selectAll('.nodeText').filter(function(c) { return this.textContent.match(d.word); }).style('visibility', "visible" )))

    // d3.select("#chart1").selectAll("rect").on("mouseover.test", d => 
    // text._groups[0].filter(c=>c.textContent===d.word)[0].class)//call(fade(0.05))

    // function textCheck() {
    //       d3.select("#chart1").selectAll("rect").on("mouseover.test", d => 
    //       text._groups[0].filter(c=>c.textContent===d.word)[0].__data__.remove)//call(fade(0.05))
    //   }

};

function drawBars(countries_data, chart, selected_country, word_count, country_name) {
  margin = {top: 69, right: 90, bottom: 5, left: 90},
  width = width/1.5,
  height = height;
  barpad = 20

  country_data = countries_data.filter(d=>d.country == selected_country)
  top10 = country_data.filter(function(d,i){ return i<word_count })
  
  var svg = d3.select(chart)
  .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 "+ width +"," + height+"")
    // .classed("svg-content", true)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");
  
  // Add X axis
  var x = d3.scaleLinear()
    .domain([0, d3.max(top10,d=>+d.frequency)])
    .range([ 0, width-margin.left-margin.right]);
  
  // svg.append("g")
  //   .attr("transform", "translate(0," + height/1.2 + ")")
  //   .call(d3.axisBottom(x))
  //   .selectAll("text")
  //   .attr("transform", "translate(-10,0)rotate(-45)")
  //   .style("text-anchor", "end")
  //   .attr("color", "silver")
  
  // Y axis
  var y = d3.scaleBand()
  .range([ 0, height/1.2])
  .domain(top10.map(function(d) { return d.word; }))
  .padding(.1);
  
  svg.append("g")
  .call(d3.axisLeft(y).tickSize(0))
          .attr("class", "yAxis")
          .selectAll("text")
              .attr("font-size", "15")
              .attr("transform", "translate(0, -2)")
              .attr("fill", "silver")
              .attr("font-family", "arial")
              .attr("font-weight", "bold")
  
  //Bars
  svg.selectAll("myRect")
    .data(top10)
    .join("rect")
    .attr("x", x(20) )
    .attr("y", function(d) { return y(d.word); })
    .attr("width", function(d) { return x(+d.frequency); })
    .attr("height", barpad )
    .attr("fill", d=>d.theme === "female_bias"?"pink":
                      d.theme === "male_bias"?"blue":
                      d.theme === "empowerment"?"#ccad34":
                      d.theme === "violence"?"red":
                      d.theme === "politics"?"green":
                      d.theme === "race"?"#964B00":
                      "#aaa")
    // .on("mouseover", d=>console.log("check"))

  svg.append("text")
      .attr("x", (width / 2-margin.right))             
      .attr("y", 0 - (margin.top / 2))
      .attr("text-anchor", "middle")  
      .attr("font-size", "20")
      .attr("fill", "silver")
      .attr("font-family", "arial")
      .attr("font-weight", "bold")
      // .style("text-decoration", "underline")  
      .text(country_name);

// .attr("x", function(d) { return x(d.Country); })
// .attr("y", function(d) { return y(d.Value); })
// .attr("width", x.bandwidth())
// .attr("height", function(d) { return height - y(d.Value); })
// .attr("fill", "#69b3a2")

}

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

function wrap(text, width) {
  text.each(function () {
      var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.1, // ems
          x = text.attr("x"),
          y = text.attr("y"),
          dy = 0, //parseFloat(text.attr("dy")),
          tspan = text.text(null)
                      .append("tspan")
                      .attr("x", x)
                      .attr("y", y)
                      .attr("dy", dy + "em");
      while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > width) {
              line.pop();
              tspan.text(line.join(" "));
              line = [word];
              tspan = text.append("tspan")
                          .attr("x", x)
                          .attr("y", y)
                          .attr("dy", ++lineNumber * lineHeight + dy + "em")
                          .text(word);
          }
      }
   });
  }