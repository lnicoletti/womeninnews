    // set the dimensions and margins of the graph
    var margin = {top: 20, right: 30, bottom: 40, left: 90},
    width = 300 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// Parse the Data
Promise.all([
d3.csv("https://gist.githubusercontent.com/SahitiSarva/33f33d7b8945eb134219fe95314aba34/raw/ef51e091077f805922dbab570ab0ae444a03c7cf/countries_freq.csv")
    ]).then(function(data) {
countries_data = data[0]
console.log(countries_data)
draw_chart(countries_data, "#chart1", "India", 10)    
draw_chart(countries_data, "#chart2", "USA", 10)   
draw_chart(countries_data, "#chart3", "UK", 10)   
draw_chart(countries_data, "#chart4", "South Africa", 10)  
 }
    )

// append the svg object to the body of the page
function draw_chart(countries_data, chart, selected_country, word_count) {

    
 

    country_data = countries_data.filter(d=>d.country == selected_country)
    top10 = country_data.filter(function(d,i){ return i<word_count })

    var svg = d3.select(chart)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");
    
    // Add X axis
    var x = d3.scaleLinear()
    .domain([0, d3.max(top10,d=>+d.frequency)])
    .range([ 0, width]);
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
    .padding(.1);
    svg.append("g")
    .call(d3.axisLeft(y))
    
    //Bars
    svg.selectAll("myRect")
    .data(top10)
    .enter()
    .append("rect")
    .attr("x", x(0) )
    .attr("y", function(d) { return y(d.word); })
    .attr("width", function(d) { return x(d.frequency); })
    .attr("height", 15 )
    .attr("fill", "#69b3a2")

    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .text(selected_country);

// .attr("x", function(d) { return x(d.Country); })
// .attr("y", function(d) { return y(d.Value); })
// .attr("width", x.bandwidth())
// .attr("height", function(d) { return height - y(d.Value); })
// .attr("fill", "#69b3a2")

}