 
Promise.all([
    d3.csv("../data/processed/country_freqtheme_pivoted.csv", d3.autoType),
    d3.csv("../data/processed/word_themes.csv", d3.autoType)]).then((datasets) => {
        
        dataWords = datasets[0]
        themes = datasets[1]

        renderStackedBars(dataWords, themes)
    
    })


// // const themes = [{}]
// const container = d3.select('#scrolly-side');
// var figure = container.select('stickyStackedChart');
// var article = container.select('article');
// const stepSel = article.selectAll('.step');

// // instantiate the scrollama
// const scroller = scrollama();

// // generic window resize listener event
// function handleResize() {
//     // 1. update height of step elements
//     var stepH = Math.floor(window.innerHeight * 0.75);
//     stepSel.style('height', stepH + 'px');
//     var figureHeight = window.innerHeight / 2
//     var figureMarginTop = (window.innerHeight - figureHeight) / 2  
//     figure
//         .style('height', figureHeight + 'px')
//         .style('top', figureMarginTop + 'px');
//     // 3. tell scrollama to update new element dimensions
//     scroller.resize();
// }

// // scrollama event handlers
// function handleStepEnter(response) {
//     console.log(response)
//     updateChart(response.index)
// }

// function updateChart(index) {
//     const sel = container.select(`[data-index='${index}']`);
//     const width = sel.attr('data-width');
//     stepSel.classed('is-active', (d, i) => i === index);
//     container.select('.bar-inner').style('width', width);
// }

// function init() {
//     Stickyfill.add(d3.select('.sticky').node());

//     // 1. force a resize on load to ensure proper dimensions are sent to scrollama
//     handleResize();

//     // 2. setup the scroller passing options
//     // this will also initialize trigger observations
//     // 3. bind scrollama event handlers (this can be chained like below)
//     scroller.setup({
//         step: '#scrolly-side article .step',
//         offset: 0.5,
//         debug: false
//     })
//     .onStepEnter(handleStepEnter)

//     // setup resize event
//     window.addEventListener('resize', handleResize);

// }

// init()

function renderStackedBars(data, themes) {

    
    margin = ({top: 100, right: 0, bottom: 0, left: 100})

    var height = 2000 - margin.top - margin.bottom
    var width = 500 - margin.left - margin.right
    // var height = 600 - margin.top - margin.bottom
    // var width = 200 - margin.left - margin.right


    var svg = d3.select("#stackedChart")
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom);
    // .attr("preserveAspectRatio", "xMinYMin meet")
    // .attr("viewBox", "0 0 "+ width +"," + height+"")
    // .classed("svg-content", true);
    // margin = {top: 40, right: 100, bottom: 60, left: 60},
    // width = +svg.attr("width")-200 - margin.left - margin.right,
    // height = +svg.attr("height")+1000 - margin.top - margin.bottom,
    // g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
    console.log(data)
    // console.log(themes.filter(d=>d.word==="accuse")[0].theme)

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
    .call(d3.axisBottom(x).tickSizeOuter(0).tickSizeInner(0))
    .call(g => g.selectAll(".domain").remove())
    

    yAxis = g => g
    // .attr("transform", `translate(${width+margin.right+30},210)`)
    .attr("transform", `translate(${margin.left},220)`)
    .call(d3.axisRight(y).tickSizeOuter(0).tickSizeInner(0))
    .call(g => g.selectAll(".domain").remove())
    // .call(g=>g.selectAll(".tick text")
    //                 .text((d, i) => i == 0 || i == 8 ? "↑ Frequency": "")).call(wrap, 100)

     // y axis
    yAxis = svg.append("g")
     .call(yAxis)
    
    yAxis.selectAll(".tick text").remove()

    yAxis.selectAll(".tick")
        .append("text")
        .text((d, i) => i == 8 ?"Frequency of use in headlines ⇢": "")
        // .text((d, i)=>console.log("ytick"+i))
        .attr("x", 0)             
        .attr("y", 0)
        .attr("class", "stackedChartyTicks")
        .style("text-transform", "lowercase")
        .style("transform", "rotate(-90deg)")
        // .call(wrap, 10)

    // svg.append("g")
    //         .call(yAxis);

    formatValue = x => isNaN(x) ? "N/A" : x.toLocaleString("en")

      
    rects = svg.append("g")
          .attr("class", "stackedBars")
          .selectAll("g")
          .data(series)
          .join("g")
          .selectAll("rect")
          .data(d => d)
          
    rect = rects.join("rect")
            .attr("class", d=>d.key)
            // .attr("id", "stackedRects")
            // .attr("fill", "#FEFAF1")
            .attr("fill", d=>themes.filter(c=>c.word===d.key)[0].theme==="female_bias"?"#0BBF99":
                             themes.filter(c=>c.word===d.key)[0].theme==="empowerement"?"#F7DC5B":
                             themes.filter(c=>c.word===d.key)[0].theme==="violence"?"#F2C5D3":"#ccc")
            // .attr("fill", d => color(d.key))
            .attr("stroke", "#FEFAF1")
            .attr("stroke-width", "0.2px")
            .attr("x", (d, i) => x(d.data.country))
            .attr("height", "4px")
            .attr("width", x.bandwidth())
            .on("mouseover", (event, d) => highlightWords(d.key, "chartHover", d))
            .on("mouseleave", (event,d)=> unHighlightWords(d.key))
            .transition().duration("5000")
            // .attr("y", d => y(d[1]))
            .attr("y", d => y(d.data[d.key]))

        
            // x axis
            xAxis = svg.append("g")
            .call(xAxis)
            .attr("class", "stackedChartCountries")
    
            xAxis.selectAll(".tick text").remove()
                    // .call(wrap, x.bandwidth());

            // console.log(xAxis.selectAll(".tick")._groups[0][1].textContent)

            // country names and flags
            flags = [{country:"South Africa", flag:"flags/south-africa.svg"}, {country:"USA", flag:"flags/united-states.svg"}, 
            {country:"India", flag:"flags/india.svg"}, {country:"UK", flag:"flags/united-kingdom.svg"}, {country: 'All countries', flag:''}]


            xAxis.selectAll(".tick")
                .append("text")
                .text(d=>d)
                .attr("x", 0)             
                .attr("y", 0)
                .attr("class", "stackedChartTicks")
                .call(wrap, x.bandwidth())

            xAxis.selectAll(".tick")
                .append("svg:image")
                    .attr('height', "35px")
                    .attr("x", 0)             
                    .attr("y", 0)
                    .attr("transform", "translate(-17, -50)")
                    .attr("xlink:href", d => console.log(d))
                    .attr("xlink:href", d => flags.filter(c=>c.country===d)[0].flag)


        function highlightWords(word, hoverType, d) {

            // console.log(themes.filter(c=>c.word===word)[0].theme)
            // console.log(themes.filter(c=>c.word===word)[0].theme)
            d3.selectAll("."+ word)
            .attr("fill", "#E75C33")
            //.attr("stroke-width", "0.1px")

            d3.selectAll(".stackedBars")
              .selectAll("rect:not(."+ word+")")
              .attr("opacity", "0.5")

            d3.selectAll(".stackedChartyTicks").style("opacity", "0")

            if (hoverType === "chartHover") {
                
                svg.append("text")
                    .attr("y", y(d.data[word]))
                    .text(word)
                    .attr("class", "stackedBarAnnotation")

            }
        
        }

        function unHighlightWords(word) {
            d3.selectAll("."+ word)
            .attr("fill",   themes.filter(c=>c.word===word)[0].theme==="female_bias"?"#0BBF99":
                            themes.filter(c=>c.word===word)[0].theme==="empowerement"?"#F7DC5B":
                            themes.filter(c=>c.word===word)[0].theme==="violence"?"#F2C5D3":"#ccc")
            // .attr("fill", "#FEFAF1")
            d3.selectAll(".stackedBarAnnotation").remove()

            d3.selectAll(".stackedBars")
              .selectAll("rect")
              .attr("opacity", "1")

            d3.selectAll(".stackedChartyTicks").style("opacity", "1")
        }

        function highlightThemes(theme) {

            // console.log(themes.filter(c=>c.word===word)[0].theme)
            // console.log(themes.filter(c=>c.word===word)[0].theme)

            // d3.selectAll(".stackedBars")
            //         .style("opacity", d=>themes.filter(c=>c.word===word)[0].theme===theme?"1":"0.2")
        

            // d3.selectAll(".stackedBars")
            //   .allLogos.style("opacity", d=>d.site.toLowerCase() === selection.toLowerCase()?"1":
            //   selection===""?"1":"0.2")
        
        }

        // interaction with text
        // words
        $('.stackedBarTextAnnotation').on('mouseover', function () {
            // var word = $(this)[0].innerText.toLowerCase()
            var word = $(this)[0].attributes.value.value
            console.log(word)
            highlightWords(word, "inTextHover")
            // d3.select("#rectsBlock").select("#barchart").select('svg rect[data-key='+key+']').style('fill', 'brown');
        })
        .on('mouseout', function () {
            var word = $(this)[0].attributes.value.value
            // console.log(word)
            unHighlightWords(word)
        })

        // themes
        $('.stackedBarThemeAnnotation').on('mouseover', function () {
            // var word = $(this)[0].innerText.toLowerCase()
            var theme = $(this)[0].attributes.value.value
            console.log(theme)
            // highlightThemes(theme)
            d3.selectAll(".stackedBars")
                    .selectAll("rect")//.attr("fill", d=>d.key==="man"?"red":"blue")
                    .style("opacity", d=>themes.filter(c=>c.word===d.key)[0].theme===theme?"1":"0.2")
        
            // d3.select("#rectsBlock").select("#barchart").select('svg rect[data-key='+key+']').style('fill', 'brown');
        })
        .on('mouseout', function () {
            d3.selectAll(".stackedBars")
                    .selectAll("rect")
                    .style("opacity", "1")
        })



};


// function to wrap text
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
