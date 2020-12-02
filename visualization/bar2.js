// set the dimensions and margins of the graph
var margin = {top: 20, right: 30, bottom: 40, left: 90},
width = 460 - margin.left - margin.right,
height = 700 - margin.top - margin.bottom;

var container = d3.select("#chart2")


// append the svg object to the body of the page
var svg = d3.select(".chart")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
Promise.all([
d3.csv("https://gist.githubusercontent.com/SahitiSarva/33f33d7b8945eb134219fe95314aba34/raw/ef51e091077f805922dbab570ab0ae444a03c7cf/countries_freq.csv")
    ]).then(function(data) {
//dummydata = data[0]
countries_data = data[0]
//console.log(dummydata)
//console.log(countries_data)
//  var data = data[0].data
// console.log(data)
//countries_data = countries_data.sort(d3.descending)
//india_data = countries_data.filter(d=>d.country == 'India')
top10 = countries_data.filter(function(d,i){ return i<100 })

// usa_data = countries_data.filter(d=>d.country == 'USA')
// usa_top10 = usa_data.filter(function(d,i){ return i<10 })

// uk_data = countries_data.filter(d=>d.country == 'UK')
// uk_top10 = uk_data.filter(function(d,i){ return i<10 })

// sa_data = countries_data.filter(d=>d.country == 'South Africa')
// sa_top10 = sa_data.filter(function(d,i){ return i<100 })
//top100 = countries_data.filter((d=>d.country == 'India') && (d=>+d.frequency>200))
//india_top100 = india_data.filter(d=>+d.frequency>200)           

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
.attr("height", y.bandwidth() )
.attr("fill", "#69b3a2")

//nesting
function read(countries_data){
    var nested = d3
    .nest()
    .key(function(d) {
        return d.country
    })
    .entries(countries_data)

console.log(nested)

}


// .attr("x", function(d) { return x(d.Country); })
// .attr("y", function(d) { return y(d.Value); })
// .attr("width", x.bandwidth())
// .attr("height", function(d) { return height - y(d.Value); })
// .attr("fill", "#69b3a2")

})