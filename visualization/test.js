// Text transition
var TxtRotate = function(el, toRotate, period) {
  this.toRotate = toRotate;
  this.el = el;
  this.loopNum = 0;
  this.period = parseInt(period, 10) || 2000;
  this.txt = '';
  this.tick();
  this.isDeleting = false;
};

TxtRotate.prototype.tick = function() {
  var i = this.loopNum % this.toRotate.length;
  var fullTxt = this.toRotate[i];

  if (this.isDeleting) {
    // 0,0 remove the entire sentence at once as opposed to going one by one. 
    this.txt = fullTxt.substring(0, 0);
  } else {
    // increase how many words appear at once
    this.txt = fullTxt.substring(0, this.txt.length + 1);
  }

  this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';

  var that = this;
  // increase speed of typing
  var delta = 50 - Math.random() ;

  if (this.isDeleting) { delta /= 2; }

  //Change this to change the time the headline waits before changing
  if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;
  } else if (this.isDeleting && this.txt === '') {
    this.isDeleting = false;
    this.loopNum++;
    delta = 500;
  }

  setTimeout(function() {
    that.tick();
  }, delta);
};

window.onload = function() {
  var elements = document.getElementsByClassName('txt-rotate');
  for (var i=0; i<elements.length; i++) {
    var toRotate = elements[i].getAttribute('data-rotate');
    var period = elements[i].getAttribute('data-period');
    if (toRotate) {
      new TxtRotate(elements[i], JSON.parse(toRotate), period);
    }
  }
  // INJECT CSS
  var css = document.createElement("style");
  //css.type = "text/css";
  css.innerHTML = ".txt-rotate > .wrap { border-right: 0.08em solid #666 }";
  document.body.appendChild(css);
};



// Bar charts

    // set the dimensions and margins of the graph
    var margin = {top: 15, right: 30, bottom: 0, left: 90},
    width = 300 - margin.left - margin.right,
    height = 300 - margin.bottom;

// Parse the Data
Promise.all([d3.csv("../data/processed/country_time_freqrank_rapi_clean.csv", d3.autoType)]).then(function(dataset) {
// Promise.all([
// d3.csv("https://gist.githubusercontent.com/SahitiSarva/33f33d7b8945eb134219fe95314aba34/raw/ef51e091077f805922dbab570ab0ae444a03c7cf/countries_freq.csv")
//     ]).then(function(data) {
countries_data = dataset[0]
//console.log(dataset[0])
drawBar(countries_data, "#chart1", "India", 10)    
drawBar(countries_data, "#chart2", "USA", 10)   
drawBar(countries_data, "#chart3", "UK", 10)   
drawBar(countries_data, "#chart4", "South Africa", 10)  
 }
    )

// append the svg object to the body of the page
function drawBar(countries_data, chart, selected_country, word_count) {

    dataBars = countries_data.filter(d=>d.country == selected_country)
    dataBars = dataBars.filter(d=>d.year == 2020)
    //dataBars = dataBars.sort(function(a,b) { return d3.descending(+a.frequency, +b.frequency) })
    dataBars = dataBars.sort(function(a,b) { return d3.descending(+a.frequency, +b.frequency) })
   console.log(dataBars)
    
    top10 = dataBars.filter(function(d,i){ return i<word_count })

    //margin = {top: 69, right: 90, bottom: 5, left: 90},
    //width = width/1.5,
    //height = height;
    //barpad = 20

    var svg = d3.select(chart)
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 "+ width +"," + height+"")
    //.attr("width", width + margin.left + margin.right)
    //.attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")")
    .attr("id", "wordBars");

    // Add X axis
    var x = d3.scaleLinear()
    .domain([0, d3.max(top10,d=>+d.frequency)])

    .range([ 0, width/2]);
     svg.append("g")
    .attr("transform", "translate(0," + height + ")")
     .call(d3.axisBottom(x))
     .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
     .style("text-anchor", "end");
    
    // Y axis
    var y = d3.scaleBand()
    .range([ 0, height ])
    .domain(top10.map(function(d) { return d.word; }))
    // change this to change the distance of the word from the bar
    .padding(0.5);
    svg.append("g")
    .call(d3.axisLeft(y).tickSize(0))
    .attr("class", "yAxis")
    .attr("transform", "translate(0, -1)")
    

    // var y = d3.scaleBand()
    // .range([ 0, height/1.2])
    // .domain(top10.map(function(d) { return d.word; }))
    // .padding(.1);
    
    // svg.append("g")
    // .call(d3.axisLeft(y).tickSize(0))
    //         .attr("class", "yAxis")
    //         .selectAll("text")
    //             .attr("font-size", font_size)
    //             .attr("transform", "translate(0, -2)")
    //             .attr("fill", "silver")
    //             .attr("font-family", "arial")
    //             .attr("font-weight", "bold")
    
    //Bars
    svg.selectAll("myRect")
    .data(top10)
    .enter()
    .append("rect")
    .attr("x", x(0) )
    .attr("y", function(d) { return y(d.word); })
    .attr("width", function(d) { return x(d.frequency); })
    .attr("height", 15 )
    .attr("class", "barChart")
    
    //.attr("fill", "#69b3a2")

    // change name of country for bar chart
    // TODO: Fix this
    svg.append("text")
        .attr("x", (width/10))             
        //.attr("y", 0 - (margin.top/3))
        .attr("class", "barLegendText") 
        .text(selected_country);

// .attr("x", function(d) { return x(d.Country); })
// .attr("y", function(d) { return y(d.Value); })
// .attr("width", x.bandwidth())
// .attr("height", function(d) { return height - y(d.Value); })
// .attr("fill", "#69b3a2")

// function drawBarLegend() {
//     svg = d3.select("#barLegend")
  
//     legendLine = svg.append("g")
//       .selectAll("line")
//         .data([{x1:0, x2:185, y1:28, y2:28}, {x1:0, x2:0, y1:28, y2:20}, {x1:185, x2:185, y1:28, y2:20}])
//         .join("line")
//         .attr("x1", d=>d.x1 )
//         .attr("x2", d=> d.x2)
//         .attr("y1", d=>d.y1 )
//         .attr("y2", d=>d.y2)
//         .attr("stroke", "red")
//         .attr("stroke-width", "1px")
   
//         svg.append("text")
//             .text("number of headlines containing this word")
//             .attr("x", 0)
//             .attr("y", 45)
//             // .style("text-anchor", "middle")
//             .attr("class", "barLegendText")
//             .call(wrap, 170)
// }



}


