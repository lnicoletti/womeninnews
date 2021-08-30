
margin = ({top: 40, right: 60, bottom: 60, left: 100})

var height = 2000 - margin.top - margin.bottom
var width = 600 - margin.left - margin.right


var svg = d3.select("svg")
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom);
    // .attr("preserveAspectRatio", "xMinYMin meet")
    // .attr("viewBox", "0 0 "+ width +"," + height+"")
    // .classed("svg-content", true);
    // margin = {top: 40, right: 100, bottom: 60, left: 60},
    // width = +svg.attr("width")-200 - margin.left - margin.right,
    // height = +svg.attr("height")+1000 - margin.top - margin.bottom,
    // g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  
d3.csv("../data/processed/country_freqtheme_pivoted.csv", d3.autoType).then(renderStackedBars)


// const themes = [{}]

function renderStackedBars(data) {
  
	console.log(data)

    // stack data
    series = d3.stack()
    .keys(data.columns.slice(2))
    // .keys(data.map(d=>d.country))
  (data)
    .map(d => (d.forEach(v => v.key = d.key), d))
  
    console.log(series)
    // console.log(series.length)
    // console.log(series.map(d=>d[1]))

    // xscale
    x = d3.scaleBand()
    .domain(data.map(d => d.country))
    .range([margin.left, width - margin.right])
    .padding(0.1)

    y = d3.scaleLinear()
    // .domain([d3.max(series, d => d3.max(d, d => d[1])), 0])
    .domain([series.length, 0])
    // .domain([0, series.length])
    .range([height - margin.bottom, margin.top])

    // color = d3.scaleOrdinal()
    // .domain(series.map(d => d.data[d.key]))
    // // .range(d3.schemeSpectral[series.length])
    // .range(d3.schemeSpectral[series.length])
    // .unknown("#ccc")

    console.log([series.length, 0])
    // console.log(d3.max(series, d => d3.max(d, d => d[1])))

    xAxis = g => g
    // .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).tickSizeOuter(0))
    .call(g => g.selectAll(".domain").remove())
    


    yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(null, "s"))
    .call(g => g.selectAll(".domain").remove())

    formatValue = x => isNaN(x) ? "N/A" : x.toLocaleString("en")


    // const svg = d3.create("svg")
    //         .attr("viewBox", [0, 0, width, height]);
      
    rects = svg.append("g")
          .selectAll("g")
          .data(series)
          .join("g")
          .selectAll("rect")
          .data(d => d)
          
    rect = rects.join("rect")
            .attr("class", d=>d.key)
            // .attr("id", "stackedRects")
            .attr("fill", "#FEFAF1")
            // .attr("fill", d => color(d.key))
            .attr("stroke", "#282828")
            .attr("stroke-width", "0.1px")
            .attr("x", (d, i) => x(d.data.country))
            .attr("height", "4px")
            .attr("width", x.bandwidth())
            .on("mouseover", (event, d) => highlightWords(d.key, d))
            .on("mouseleave", (event,d)=> unHighlightWords(d.key))
            .transition().duration("5000")
            // .attr("y", d => y(d[1]))
            .attr("y", d => y(d.data[d.key]))

            // .attr("height", d => y(d[0]) - y(d[1]))
            
    //       .append("title")
    //         .text(d => `${d.data.country} ${d.key}
    //   ${formatValue(d.data[d.key])}`)
      
        svg.append("g")
            .call(xAxis).attr("class", "scoreChartTitle");
      
        // svg.append("g")
        //     .call(yAxis);

        function highlightWords(word, d) {

            console.log(word)
            d3.selectAll("."+ word).attr("fill", "#E75C33")
            svg.append("text")
                .attr("y", y(d.data[d.key]))
                .text(d.key)
                .attr("class", "stackedBarAnnotation")
        
        }

        function unHighlightWords(word) {
            d3.selectAll("."+ word).attr("fill", "#FEFAF1")
            d3.selectAll(".stackedBarAnnotation").remove()
        }
};

