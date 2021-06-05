// dimensions
margin = ({top: 400, bottom: 20, left: 40, right: 40})
visWidth = 1200 - margin.left - margin.right
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
    .paddingInner(-1.5)

col = d3.scaleBand()
    .domain(d3.range(cols))
    .range([0, visWidth])
    .paddingInner(0.2) 

// world events data
numberOfCategories = 5
categories = ["0", "1", "2", "3", "4"]
dateRange = [new Date(2010, 0).getTime(), new Date(2019, 0).getTime()];

eventsWorld = [
       {uid: 1, 
        name: "Horrifying gang rape and murder in New Delhi, India", 
        category: 4, 
        date: new Date(2012, 1, 0)},
       {uid: 1, 
        name: "Caitlyn Jenner comes out in an interview", 
        category: 4, 
        date: new Date(2015, 1, 0)},
       {uid: 1, 
        name: "#EndRapeCulture in South Africa", 
        category: 4, 
        date: new Date(2016, 1, 0)},
       {uid: 2, 
        name: "Trump: “Grab her by the pussy”", 
        category: 4, 
        date: new Date(2016, 1, 0)},
       {uid: 1, 
        name: "#MeToo in U.S.A.", 
        category: 4, 
        date: new Date(2017, 1, 0)},
       {uid: 2, 
        name: "Harvey Weinstein Trial", 
        category: 4, 
        date: new Date(2017, 1, 0)},
       {uid: 3, 
        name: "Release of Wonder Woman", 
        category: 4, 
        date: new Date(2017, 1, 0)},
       {uid: 4, 
        name: "#MeToo in India", 
        category: 4, 
        date: new Date(2017, 1, 0)},
       {uid: 1, 
        name: "Meghan Markle’s wedding to Prince Harry", 
        category: 4, 
        date: new Date(2018, 1, 0)},
       {uid: 2, 
        name: "Priyanka Chopra marries Nick Jonas", 
        category: 4, 
        date: new Date(2018, 1, 0)},
       {uid: 3, 
        name: "People v. Turner", 
        category: 4, 
        date: new Date(2018, 1, 0)},
       {uid: 1, 
        name: "Greta Thunberg: Climate Action Summit and sail to NYC", 
        category: 4, 
        date: new Date(2019, 1, 0)},
       {uid: 1, 
        name: "#SayHerName: Murder of Breonna Taylor", 
        category: 4, 
        date: new Date(2020, 1, 0)},
       {uid: 2, 
        name: "Meghan Markle: scandal with royal family", 
        category: 4, 
        date: new Date(2020, 1, 0)},
       {uid: 3, 
        name: "Kamala Harris: first vice president Black/Indian woman", 
        category: 4, 
        date: new Date(2020, 1, 0)},
       {uid: 1, 
        name: "International Women’s Cricket T20", 
        category: 4, 
        date: new Date(2021, 1, 0)},
       {uid: 2, 
        name: "Makiyah Bryant murder", 
        category: 4, 
        date: new Date(2021, 1, 0)}]

events = eventsWorld.map(d=>{
  return {
    uid: d.uid,
    name: d.name, 
    category: Math.floor(Math.random() * numberOfCategories),
    position: Math.round(Math.random()) === 1,
    date: d.date
  }
})

groupedEvents = d3.group(
    events.filter(e => categories.includes(`${e.category}`)), 
    d => new Date(d.date.getFullYear(), d.date.getMonth()).toDateString(),
    d => d.position)



console.log(events)

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
//// area charts hover
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

// timeline ruler
const tooltip = d3
                .select("body")
                .append("div")
                .attr("class", "tooltip")
                // .style("font-size", "10pt")
                // .style("font-family", "Lato")
                .style("position", "absolute")
                .style("text-align", "left")
                // .style("width", "auto")
                // .style("height", "auto")
                .style("padding", "5px")
                .style("background", "none")
                .attr("border", "grey")
                .style("border-width", 1)
                .style("pointer-events", "none")
                .style("opacity", 0)

function timeRuler(event, d, g) {
    
    const ruler = g.append("g")
                    .append("line")
                    .attr("class", "timeRuler")
                    .attr('transform', `translate(${col(0)}, -${margin.top/3})`)
                    .attr("x1", x(d.date))
                    .attr("x2", x(d.date))
                    .attr("y1", 0)
                    .attr("y2", visHeight)
                    .attr("stroke", "grey")
                    // .attr("fill", "grey")
                    .attr("stroke-width", 20)
                    .attr("opacity", 0.2)

    // rect dimensions
    const boxWidth = 200
    const boxHeight = 100
    
    tooltip
        .transition()
        .duration(0)
        .style("opacity", 1)
        .style("width", boxWidth)
        .style("height", boxHeight)
        
    tooltip
        // .html(`<b>${d.title}</b><br>
        // <b>${format(+d[metric_t])+"</b> "+legend_label_t.toLowerCase()}<br>
        // <b>${format(+d[metric_p])+"</b> "+legend_label_p.toLowerCase()}`)
        .html(`<b>${d.date}</b><br>
        <b>${(d.name)}`)
        .style("left", event.pageX + 10+ "px")
        .style("top", event.pageY - 28 + "px")
        .style("font-family", "sans-serif")
        .attr("font-size", "10px")
        .style("color", "grey");

    // const textBox = g.append("g")
    //                   .append("rect")
    //                   .attr('transform', `translate(${col(0)}, -${d.uid * 12 + margin.top/1.5})`)
    //                   .attr("x", x(d.date)-boxWidth/2)
    //                   .attr("y", 0)
    //                   .attr("width", boxWidth)
    //                   .attr("height", boxHeight)
    //                 //   .attr("fill", "grey")
    //                 //   .attr("fill", "none")
    //                   .attr("stroke", "grey")
    //                   .attr("opacity", 0.5)
    //                 //   .attr("class", "timeRuler")

    // const text = g.append("g")
    //                     .append("text")
    //                     .text(d.name)
    //                     .attr("x", x(d.date)-boxWidth/2)
    //                     .attr("y", 0)
    //                     // .attr("font-family", "Georgia")
    //                     .attr("font-size", "12px")
    //                     .style("color", "white")
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
            .tickFormat((d, i) => i == 0 || i == 9 ? d3.timeFormat('%Y')(new Date(d)):
                                //   i == 5 ? "Caitlyn Jenner comes out":
                                //   i == 6 ? "Trump: 'Grab her by the pussy'":
                                //   i == 7 ? "#MeToo":
                                //   i == 8 ? "People v. Turner":
                                //   i == 9 ? "Greta":
                                //   i == 9 ? "#SayHerName":                                  
                                  "");//.tickFormat(d3.format(".0s"))

    g.append("g")
            .attr('transform', `translate(${col(0)}, -${margin.top/3})`)
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

    // circles for timeline
    const circleEvents = 
            g.append("g")
                    .attr('transform', `translate(${col(0)}, -${margin.top/3})`)
                    .selectAll("circle")
                    .data(events)

    const circles = circleEvents
                    .join("circle")
                    .attr('transform', (d, i) => `translate(0, ${d.uid * 12 * (d.position ? 1 : -1 )})`)
                    .attr("cx", d=>x(d.date))
                    .attr("cy", 0)
                    .attr("fill", "red")
                    .attr("r", 6)
                    .attr("opacity", "0.5")
                    .on("mouseover", (event, d) => timeRuler(event, d, g))
                    // .on("mousemove", (event, d) => timeRuler(event, d, g))
                    .on("mouseleave", (event, d) => {
                                    d3.selectAll(".timeRuler").remove()
                                    // tooltip
                                    //         .transition()
                                    //         .duration(500)
                                    //         .style("opacity", 0)
                                        }
                                            )


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

