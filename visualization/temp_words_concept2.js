// dimensions
margin = ({top: 100, bottom: 20, left: 40, right: 40})
visWidth = 900 - margin.left - margin.right
visHeight = 10000 - margin.top - margin.bottom
// structure of plots
cols = 1
rows = 200/cols
// grid data
grid = d3.cross(d3.range(rows), d3.range(cols), (row, col) => ({ row, col }))

console.log(grid)

// row/col scales
row = d3.scaleBand()
    .domain(d3.range(rows))
    .range([0, visHeight])
    .paddingInner(-1.2)

col = d3.scaleBand()
    .domain(d3.range(cols))
    .range([0, visWidth])
    .paddingInner(0.2) 

// load and render data
// d3.csv("../hosted_data/country_time_freq_rapi.csv", d3.autoType).then(function(dataset) {
    d3.csv("../data/processed/country_time_freqrank_rapi.csv", d3.autoType).then(function(dataset) {

    filter_years = [2009, 2020]
    country = "USA"
    variable = "frequency" //freq_prop_headlines // frequency
    dataset = dataset.filter(d=>(d.word!=="thehill")&&(d.word!=="time.com")&&(d.word!=="ew.com"))
    renderChart(dataset, filter_years, country, variable)

    // update chart when country is changed
    d3.selectAll("button.country").on("click", function() {
        // Remove previous chart
        d3.select(".mainContainer").remove()
        let country = d3.select(this).property("value")
        console.log(country)
        renderChart(dataset, filter_years, country, variable)
    })
    // update chart when variable is changed
    d3.selectAll("button.freq").on("click", function() {
        // Remove previous chart
        d3.select(".mainContainer").remove()
        let variable = d3.select(this).property("value")
        console.log(variable)
        renderChart(dataset, filter_years, country, variable)
    })
})

// tooltip functions
function showTooltip(event, d) {
    
    d3.selectAll(".wordArea").attr("opacity", 0.25)
    d3.selectAll(".wordLine").attr("opacity", 0.4)
    d3.selectAll(".wordText").attr("opacity", 0.5)
    // console.log(d3.max(d.rates, c=>c.date))
    // console.log(d3.max(d.rates, c=>c.frequency))
    console.log(d.rates)
    console.log(d.rates[d.rates.length-1].frequency)

    const endDate = d3.max(d.rates, c=>c.date)
    const endFreq = d.rates[d.rates.length-1].frequency
    const startFreq = 0.00001 + d.rates[0].frequency
    const percFreqInc = ((endFreq-startFreq)/startFreq)*100

    d3.select('#area'+ d.word)
        .attr("opacity", 0.85)
    d3.select('#line'+ d.word)
        .attr("opacity", 1)
    d3.select('#text'+ d.word)
        .attr("opacity", 1)
    // % increase/decrease text
    d3.//.select('#line'+ d.word).append("g")
    select('#cell'+ d.word)
        .append("text")
        .text(percFreqInc>0? "+" + percFreqInc.toFixed(0) + "%": percFreqInc.toFixed(0)+ "%")
        .attr("fill", "grey")
        .attr("font-weight", 800)
        .style("font-size", 12)
        .style("font-family", "sans-serif")
        .attr("class", "wordText")
        .attr("x", x(endDate)+5)
        .attr("y", wordToScaleAndArea[d.word].y(endFreq))
        .attr("class", "incText")

}

function hideTooltip(event, d) {
    d3.selectAll(".wordArea").attr("opacity", 0.5)
    d3.selectAll(".wordLine").attr("opacity", 1)
    d3.selectAll(".wordText").attr("opacity", 1)
    d3.selectAll(".incText").remove()
}

// small multiples chart function
function renderChart(dataset, filter, country, variable) {

    words = dataset.filter(d=>(d.year>filter[0])&&(d.year<filter[1])&&(d.country===country))

    words = words.map(d=> {
        return {
            year: d.year,
            frequency: d[variable],
            word: d.word
        }
    })

    freqByWord = d3.rollup(
        words,
        g => g.map(({ year, frequency}) => ({date: new Date(year, 0, 1), frequency})),
        d => d.word,
        // e => e.frequency//words.filter(c=>(c.word>d.word)&&(c.year==filter[1]))['frequency'],

      )

    // topWords = d3.sort(freqByWord, d=>-d.frequency).filter(function(d,i){ return i<50 })
    
    // add grid data to word data
    data = d3.zip(Array.from(freqByWord), grid).map(
        ([[word, rates], { row, col }]) => ({
          word,
          rates,
          row,
          col,
        })
      )

    // same x-scale for all charts
    minDate = data[0].rates[0].date
    maxDate = data[0].rates[data[0].rates.length - 1].date

    x = d3.scaleTime()
        .domain([minDate, maxDate])
        .range([0, col.bandwidth()])

    // function to calculate y-scale and area generator depending on the word
    wordToScaleAndArea = Object.fromEntries(
        data.map(d => {
        const maxRate = d3.max(d.rates, d => d.frequency);
        // console.log(maxRate)
        const y = d3.scaleLinear()
            .domain([0, maxRate])
            .range([row.bandwidth(), 0]).nice();
        
        curve = d3.curveMonotoneX // d3.curveBasis
        const area = d3.area()
            .x(d => x(d.date))
            .y1(d => y(d.frequency))
            .y0(d => y(0)).curve(d3.curveMonotoneX);

        
        const line = d3.line()
            .x(d => x(d.date))
            .y(d => y(d.frequency)).curve(d3.curveMonotoneX);

        
        return [d.word, {y, area, line}];
        })
    )

    console.log(words)
    console.log(freqByWord)
    console.log(data)
    console.log(minDate, maxDate)
    console.log(wordToScaleAndArea)

    // draw the chart
    // create and select an svg element that is the size of the bars plus margins 
    const svg = d3.select("div#smChart")
        .append("svg")
        .attr("class", "mainContainer")
        .attr('width', visWidth + margin.left + margin.right)
        .attr('height', visHeight + margin.top + margin.bottom);
        // .attr("preserveAspectRatio", "xMinYMin meet")
        // .attr("viewBox", "0 0 "+ visWidth + margin.left + margin.right +"," + visHeight + margin.top + margin.bottom+"")
    
    // Gradient definition (not ideal, using HTML). TODO: refactor
    // svg.append('defs')
    // .html(`<linearGradient id="Gradient2">
    //         <stop offset="30%" stop-color="hsl(120, 50%, 50%)"/>
    //         <stop offset="70%" stop-color="hsl(70, 80%, 50%)"/>
    //         <stop offset="80%" stop-color="hsl(60, 80%, 50%)"/>
    //         <stop offset="100%" stop-color="hsl(10, 50%, 50%)"/>
    //         </linearGradient>`)

    var defs = svg.append("defs");
    var linearGradient = defs.append("linearGradient").attr("id", "linear-gradient");
        
    linearGradient
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "0%")
        .attr("y2", "100%");
        
    linearGradient.append("stop")
        .attr("offset", "0%")
        // .attr("stop-color", "hsl(10, 100%, 50%)");
        .attr("stop-color", "red");

    
    linearGradient.append("stop")
        .attr("offset", "90%")
        .attr("stop-color", "#202020");

    linearGradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#161616")
        // .attr("opacity", 0.1);

    // append a group element and move it left and down to create space
    // for the left and top margins
    const g = svg.append("g")
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // create a group for each small multiple
    const cells = g.append('g')
        .selectAll('g')
        .data(data)
        .join('g')
        .attr('class', 'cell')
        .attr('transform', d => `translate(${col(d.col)}, ${row(d.row)})`);

    // add the area to each cell
    cells.append('path')
        // access the area generator for this word
        .attr('d', d => wordToScaleAndArea[d.word].area(d.rates))
        // .attr('fill', "url(#Gradient2)")
        .attr('fill', "url(#linear-gradient)")
        .attr('opacity', 0.5)
        .attr("class", "wordArea")
        .attr("id", d=> 'area'+ d.word)
        .on("mouseover", (event, d) => showTooltip(event, d))
        .on("mouseleave", (event, d) => hideTooltip(event, d))
        // .attr('fill', 'red');

    cells.append('path')
        // .attr('stroke', 'black')
        .style("stroke", "url(#linear-gradient)")
        .attr('stroke-width', 2)
        .attr('fill', 'none')
        .attr("class", "wordLine")
        .attr("id", d=> 'line'+ d.word)  
        .attr('d', d => wordToScaleAndArea[d.word].line(d.rates)) 
        .on("mouseover", (event, d) => showTooltip(event, d))
        .on("mouseleave", (event, d) => hideTooltip(event, d))
      
    // append the x axis once on top of the chart

    const xaxis = d3.axisBottom(x)
            .ticks(7)
            .tickSizeOuter(20)
            .tickSizeInner(7)
            .tickPadding(20)
            .tickFormat((d, i) => i == 0 || i == 9 ? d3.timeFormat('%Y')(new Date(d)): "");//.tickFormat(d3.format(".0s"))

    g.append("g")
            .attr('transform', `translate(${col(0)}, -50)`)
            // .attr('transform', `translate(${margin.left}, ${margin.top})`)
            .call(xaxis).attr("class", "SMaxis")
            .call(g=>g.selectAll(".tick")
            // .attr("color", (d, i) => i == 0 || i == 9 ? "grey": "none")
            // .attr("opacity", (d, i) => i == 0 ||  i == 9 ? 1: 0)
            .attr("color", "grey")
            .attr('stroke-width', 2)
            .attr("font-weight", 800)
            .attr("font-size", 12))
            .call(g => g.select('.domain').attr("color", "grey").attr('stroke-width', 2))
            // .call(g => g.select('.domain').remove())

     // add the y axis for each cell
    cells.each(function(d) {
        // select the group for this cell
        const group = d3.select(this).attr("class", "SMCell").attr("id", d=>"cell"+d.word);

        // get the y-scale for this industry
        const yaxis = d3.axisLeft(wordToScaleAndArea[d.word].y)
            .ticks(2)
            .tickSizeOuter(0)
            // .tickSizeInner((d, i) => i == 0 ? 0: 10)
            // .tickFormat((d, i) => i == 0 ? "": d);

            // .tickFormat((d, i) => i == 0 || i == 2 ? d: "");
        
        // const xaxis = d3.axisBottom(x)
        //     .ticks(7)
        //     .tickSizeOuter(0)
        //     .tickFormat((d, i) => i == 0 || i == 9 ? d3.timeFormat('%Y')(new Date(d)): "");//.tickFormat(d3.format(".0s"))
        
        // group.call(yaxis)
        //      .call(g=>g.selectAll(".tick").attr("color", "grey"))
        //      .call(g => g.select('.domain').remove())
            //  .call(g =>
            //     g
            //       .select(".tick:last-of-type text")
            //       .clone()
            //       .attr("x", col.bandwidth()/2)
            //     //   .attr("y", +30)
            //       .attr("text-anchor", "start")
            //       .attr("font-weight", 800)
            //       // .attr("font-weight", "bold")
            //     //   .text("↑ more frequent"))
            //     .text(d.word))

        
        // group.append("g")
        //      .attr("transform", `translate(0,${row.bandwidth()})`)
        //      .call(xaxis).attr("class", "SMaxis")
        //      .call(g=>g.selectAll(".tick")
        //         .attr("color", (d, i) => i == 0 || i == 9 ? "grey": "none")
        //         .attr("font-weight", 500))
        //      .call(g => g.select('.domain').remove())


        group.append("g").attr("class", "catLabel").append("text")
        // .attr("x", 110)
        // .attr("y", -12)
        // .attr("text-anchor", "middle")
        .attr("x", -10)
        .attr("y", row.bandwidth())
        .attr("text-anchor", "end")
        .attr("fill", "grey")
        .attr("font-weight", 800)
        .style("font-size", 12)
        .style("font-family", "sans-serif")
        .attr("class", "wordText")
        .attr("id", d=> 'text'+ d.word) 
        .text(d.word)
        .on("mouseover", (event, d) => showTooltip(event, d))
        .on("mouseleave", (event, d) => hideTooltip(event, d))
  });

}

