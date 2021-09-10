 
Promise.all([
    d3.csv("../data/processed/country_freqtheme_pivoted_all.csv", d3.autoType),
    // d3.csv("../data/processed/country_freqtheme_pivoted.csv", d3.autoType),
    // d3.csv("../data/processed/word_themes.csv", d3.autoType),
    d3.csv("../data/processed/word_themes_all.csv", d3.autoType),
    // d3.csv("../data/processed/word_themes_rank_old.csv", d3.autoType)]).then((datasets) => {
    d3.csv("../data/processed/word_themes_rank.csv", d3.autoType),
    d3.csv("../data/processed/words_theme_freq.csv", d3.autoType)]).then((datasets) => {
        
        data = datasets[0]
        themes = datasets[1]
        themesRank = datasets[2]
        themesFreq = datasets[3]
        console.log(data)
        console.log(themes)
        console.log(themesRank)
        console.log(themesFreq)
        // renderStackedBars(dataWords, themes)
        dataWords = prepareWordData(data, themes)
        // dataThemes = prepareThemesData(data, themes)
        console.log(data)
        console.log("stacked",dataWords)
        renderBarAxis(data, dataWords)
        stackedBarScroll(dataWords, themes, themesRank, themesFreq)
    
    })


function prepareWordData (data, themes) {


    // themes = themes.filter(d=>d.word!=="youtube")

    series = d3.stack()
        .keys(data.columns.slice(2))
        // .keys(data.map(d=>d.country))
    (data)
        .map(d => (d.forEach(v => v.key = themes.filter(c=>c.word===d.key)[0]!== undefined?
                                        {"word": d.key, "theme": themes.filter(c=>c.word===d.key)[0].theme}:
                                        {"word": d.key, "theme": "No theme"}), d))
    
        // console.log(series)

    return series

}

// function prepareThemeData (data, themes) {

//     data.map

//     return themesData

// }

function stackedBarScroll(words, themes, themesRank, themesFreq) {

    const container = d3.select('#scrolly-side');
    var figure = container.select('stickyStackedChart');
    var article = container.select('article');
    const stepSel = article.selectAll('.step');
    // instantiate the scrollama
    const scroller = scrollama();

    // generic window resize listener event
    function handleResize() {
        // 1. update height of step elements
        var stepH = Math.floor(window.innerHeight * 0.75);
        stepSel.style('height', stepH + 'px');
        var figureHeight = window.innerHeight / 2
        var figureMarginTop = (window.innerHeight - figureHeight) / 2  
        figure
            .style('height', figureHeight + 'px')
            .style('top', figureMarginTop + 'px');
        // 3. tell scrollama to update new element dimensions
        scroller.resize();
    }

    // scrollama event handlers
    function handleStepEnter(response) {
        // console.log(response)
        updateChart(response.index, "enter")
    }

    function handleStepExit (response) {
        // console.log(response)
        updateChart(response.index, "exit")
    }

    function updateChart(index, action) {
        const sel = container.select(`[data-index='${index}']`);
        // const width = sel.attr('data-width');
        const task = sel.attr('task')
        console.log(task)
        if (task==="highlightwords") {
            const word = sel.attr('word');
            if (action==="enter") {
                stepSel.classed('is-active', (d, i) => i === index);
            // container.select('.bar-inner').style('width', width);
                highlightWords(word, "inTextHover")
            } else {
                unHighlightWords(word)
            }  

        } else if (task === "drawbars") {
            renderStackedBars(words)
            sel.attr('task', 'none')
        } else if (task === "highlightthemes") {
            colorThemes()
            sel.attr('task', 'none')
        } else if (task === "tooltip") {
            activateTooltip()
        // } else if (task === "exploreChart") {
        //     d3.select("#stickyStackedChart").style("position", "absolute")
        } else if (task === "themeBarsTransition") {
            renderThemeBars(themesRank, themesFreq)
        }
        
    }

    function init() {
        Stickyfill.add(d3.select('.sticky').node());

        // 1. force a resize on load to ensure proper dimensions are sent to scrollama
        handleResize();

        // 2. setup the scroller passing options
        // this will also initialize trigger observations
        // 3. bind scrollama event handlers (this can be chained like below)
        scroller.setup({
            step: '#scrolly-side article .step',
            offset: 0.5,
            debug: false
        })
        .onStepEnter(handleStepEnter)
        .onStepExit(handleStepExit)

        // setup resize event
        window.addEventListener('resize', handleResize);

    }

    init()

}

function renderBarAxis(data, series) {

    margin = ({top: 100, right: 0, bottom: 0, left: 100})

    var height = 2000 - margin.top - margin.bottom
    var width = 500 - margin.left - margin.right
    // var height = 600 - margin.top - margin.bottom
    // var width = 200 - margin.left - margin.right


    var svg = d3.select("#stackedChart")
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom);

    // // stack data
    // series = d3.stack()
    //     .keys(data.columns.slice(2))
    //     // .keys(data.map(d=>d.country))
    // (data)
    //     .map(d => (d.forEach(v => v.key = d.key), d))

     x = d3.scaleBand()
    .domain(data.map(d => d.country))
    .range([margin.left, width - margin.right])
    .padding(0.1)

    y = d3.scaleLinear()
    // .domain([d3.max(series, d => d3.max(d, d => d[1])), 0])
    .domain([series.length, 0])
    // .domain([0, series.length])
    .range([height - margin.bottom, margin.top])

    // draw axes
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
     .attr("class", "stackedChartyAxis")
    
    yAxis.selectAll(".tick text").remove()


    formatValue = x => isNaN(x) ? "N/A" : x.toLocaleString("en")

    xAxis = svg.append("g")
    .call(xAxis)
    .attr("class", "stackedChartCountries")

    xAxis.selectAll(".tick text").remove()
            // .call(wrap, x.bandwidth());


    xAxis.selectAll(".tick")
        .append("text")
        .text(d=>d)
        .attr("x", 0)             
        .attr("y", 0)
        .attr("class", "stackedChartTicks")
        .call(wrap, x.bandwidth())

    // country names and flags
    flags = [{country:"South Africa", flag:"flags/south-africa.svg"}, {country:"USA", flag:"flags/united-states.svg"}, 
    {country:"India", flag:"flags/india.svg"}, {country:"UK", flag:"flags/united-kingdom.svg"}, {country: 'All countries', flag:''}]


    xAxis.selectAll(".tick")
        .append("svg:image")
            .attr('height', "35px")
            .attr("x", 0)             
            .attr("y", 0)
            .attr("transform", "translate(-17, -50)")
            .attr("xlink:href", d => console.log(d))
            .attr("xlink:href", d => flags.filter(c=>c.country===d)[0].flag)


}

function renderStackedBars(series) {

    
    margin = ({top: 100, right: 0, bottom: 0, left: 100})

    var height = 5000 - margin.top - margin.bottom
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
    // console.log(data)
    // console.log(data)
    // console.log(themes.filter(d=>d.word==="accuse")[0].theme)

//     // stack data
//     test = d3.stack()
//     .keys(data.columns.slice(2))
//     // .keys(data.map(d=>d.country))
//   (data)
//     .map(d => (d.forEach(v => v.key = d.key), d))

//     series = d3.stack()
//     .keys(data.columns.slice(2))
//     // .keys(data.map(d=>d.country))
//   (data)
//     .map(d => (d.forEach(v => v.key = {"word": d.key, "theme": themes.filter(c=>c.word===d.key)[0].theme}), d))
  
//     console.log(series)
    // console.log(test)
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

    // legend
    d3.select(".stackedChartyAxis")
        .selectAll(".tick")
        .append("text")
        .text((d, i) => i == 8 ?"Frequency of use in headlines ⇢": "")
        // .text((d, i)=>console.log("ytick"+i))
        .attr("x", 0)             
        .attr("y", 0)
        .attr("class", "stackedChartyTicks")
        .style("text-transform", "lowercase")
        .style("transform", "rotate(-90deg)")
        // .call(wrap, 10)

      
    rects = svg.append("g")
          .attr("class", "stackedBars")
          .selectAll("g")
          .data(series)
          .join("g")
          .selectAll("rect")
          .data(d => d)
          
    rect = rects.join("rect")
            // .attr("class", d=>d.key)
            .attr("class", d=>d.key.word)
            // .attr("id", "stackedRects")
            // .attr("fill", "#FEFAF1")
            .attr("fill", "lightgrey")
            // .attr("fill", d=>themes.filter(c=>c.word===d.key)[0].theme==="female_bias"?"#0BBF99":
            //                  themes.filter(c=>c.word===d.key)[0].theme==="empowerement"?"#F7DC5B":
            //                  themes.filter(c=>c.word===d.key)[0].theme==="violence"?"#F2C5D3":"#ccc")
            // .attr("fill", d => color(d.key))
            .attr("stroke", "#FEFAF1")
            .attr("stroke-width", "0.2px")
            .attr("x", (d, i) => x(d.data.country))
            // .attr("height", "4px")
            .attr("height", d => d.data[d.key.word]===0 || d.data[d.key.word]===null? 0:height/series.length)
            .attr("width", x.bandwidth())
            // .on("mouseover", (event, d) => highlightWords(d.key, "chartHover", d))
            // .on("mouseleave", (event,d)=> unHighlightWords(d.key))
            .transition().duration("4000")
                .ease(d3.easeCubic)
                .delay((d, i) => {
                    // console.log(d, i)
                    return i * 200;
                    // return i * Math.random() * 50;
                    
                })
            // .attr("y", d => y(d[1]))
            // .attr("y", d => y(d.data[d.key]))
            // .attr("y", d => y(d.data[d.key.word]))
            .attr("y", d => d.data[d.key.word]!==0 || d.data[d.key.word]!==null? y(d.data[d.key.word]):y(null))


};

function colorThemes() {

    // select bars and color them by theme
    d3.selectAll(".stackedBars")
      .selectAll("rect")
    //   .attr("fill", d=>themes.filter(c=>c.word===d.key)[0].theme==="female_bias"?"#0BBF99":
    //                     themes.filter(c=>c.word===d.key)[0].theme==="empowerement"?"#F7DC5B":
    //                     themes.filter(c=>c.word===d.key)[0].theme==="violence"?"#F2C5D3":"lightgrey")
    .attr("fill", d=>d.key.theme==="female stereotypes"?"#0BBF99":
                    d.key.theme==="empowerement"?"#F7DC5B":
                    d.key.theme==="violence"?"#F2C5D3":"lightgrey")
    // .on("mouseover", (event, d) => highlightWords(d.key, "chartHover", d))
    // .on("mouseleave", (event,d)=> unHighlightWords(d.key))

}

function activateTooltip () {

    // select bars and color them by theme
    d3.selectAll(".stackedBars")
      .selectAll("rect")
    .on("mouseover", (event, d) => highlightWords(d.key.word, "chartHover", d))
    .on("mouseleave", (event,d)=> unHighlightWords(d.key.word))

}

function highlightWords(word, hoverType, d, newScale, changeScale, transform) {

    // console.log(themes.filter(c=>c.word===word)[0].theme)
    // console.log(themes.filter(c=>c.word===word)[0].theme)
    console.log(word)
    // console.log(transform)
    d3.selectAll("."+ word)
    .attr("fill", "#E75C33")
    //.attr("stroke-width", "0.1px")

    d3.selectAll(".stackedBars")
      .selectAll("rect:not(."+ word+")")
      .attr("opacity", "0.5")

    d3.selectAll(".stackedChartyTicks").style("opacity", "0")

    if (hoverType === "chartHover") {
        
        d3.select("#stackedChart")
            .append("text")
            // .attr("y", y(d.data[word]))
            .attr("y", y(d.data[word]))
            .text(word)
            .attr("class", "stackedBarAnnotation")

    } 
    
    if (changeScale === "True") {
        console.log(d, newScale(d[1]))
        d3.select("#stackedChart")
            .append("text")
            // .attr("y", y(d.data[word]))
            .attr("y", newScale(d[1])+transform)
            .text(word)
            .attr("class", "stackedBarAnnotation")
            // .attr("transform", `translate(0, ${transform})`)
    }

}

function unHighlightWords(word, hoverType) {

    if (hoverType === "inTextHover") {

        d3.selectAll("."+ word)
          .attr("fill", "lightgray")

    } else {
        d3.selectAll("."+ word)
          .attr("fill",   themes.filter(c=>c.word===word)[0].theme==="female stereotypes"?"#0BBF99":
                    themes.filter(c=>c.word===word)[0].theme==="empowerement"?"#F7DC5B":
                    themes.filter(c=>c.word===word)[0].theme==="violence"?"#F2C5D3":"lightgrey")
    }
    
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

function renderThemeBars(data, dataFreq) {

    data = data.filter(d=>d.theme!=="No theme")
    // dataFreq = dataFreq.filter(d=>d.theme!=="No theme")
    // console.log("themes, long", dataFreq.columns.slice(2))

    console.log("original datafreq", dataFreq)
    // stack data
    var stackedData = d3.stack()
        .keys(dataFreq.columns.slice(2))
        .order(d3.stackOrderAscending)
        // .keys(data.map(d=>d.country))
    (dataFreq.filter(d=>d.theme!=="No theme"))
        .map(d => (d.forEach(v => v.key = d.key), d))

    console.log("stacked themes", stackedData)

    margin = ({top: 100, right: 0, bottom: 0, left: 100})

    var height = 750 - margin.top - margin.bottom
    // var width = 600 - margin.left - margin.right
    var width = 400 - margin.left - margin.right


    // heightChart = 5000 - margin.top - margin.bottom
    heightChart = height*4.4 - margin.top - margin.bottom
    // heightChart = height*7.5 - margin.top - margin.bottom

    // var height = 600 - margin.top - margin.bottom
    // var width = 200 - margin.left - margin.right


    var svg = d3.select("#stackedChart")
            // .attr('width', width + margin.left + margin.right)
            // .attr('height', height + margin.top + margin.bottom)

    // console.log(data)
     xThemes = d3.scaleBand()
    .domain(data.map(d => d.theme))
    .range([margin.left, width - margin.right])
    .padding(0.1)

    // yThemes = d3.scaleLinear()
    // // .domain([d3.max(series, d => d3.max(d, d => d[1])), 0])
    // // .domain([data.length, 0])
    // .domain([d3.max(dataNotheme.map(d=>d.rank)), 0])
    // // .domain([0, series.length])
    // .range([margin.top, height - margin.bottom])

    yThemesStack = d3.scaleLinear()
        .domain([d3.max(stackedData, d => d3.max(d, d => d[1])), 0])
        .rangeRound([margin.top, height - margin.bottom])

    // console.log(d3.extent(data.map(d=>d.rank)))

    // draw axes
    xAxis = g => g
    // .attr("transform", `translate(0,${height-margin.top})`)
    .call(d3.axisBottom(xThemes).tickSizeOuter(0).tickSizeInner(0))
    .call(g => g.selectAll(".domain").remove())
    

    // yAxis = g => g
    // // .attr("transform", `translate(${width+margin.right+30},210)`)
    // .attr("transform", `translate(${margin.left},0)`)
    // .call(d3.axisRight(yThemes).tickSizeOuter(0).tickSizeInner(0))
    // .call(g => g.selectAll(".domain").remove())
    // // .call(g=>g.selectAll(".tick text")
    // //                 .text((d, i) => i == 0 || i == 8 ? "↑ Frequency": "")).call(wrap, 100)

    yAxis = g => g
    // .attr("transform", `translate(${width+margin.right+30},210)`)
    // .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisRight(yThemesStack).tickSizeOuter(0).tickSizeInner(0))
    .call(g => g.selectAll(".domain").remove())
    // .call(g=>g.selectAll(".tick text")
    //                 .text((d, i) => i == 0 || i == 8 ? "↑ Frequency": "")).call(wrap, 100)

     // y axis
    // yAxis = svg.append("g")
    //  .call(yAxis)
    //  .attr("class", "themesChartyAxis")
    //  .attr("id", "themeAxis")
    //  .attr("transform", `translate(${margin.left},${heightChart-margin.top})`)
    //  .attr("transform", `translate(0, ${heightChart})`)

    
    // yAxis.selectAll(".tick text").remove()

     // legend
    d3.select("#themeAxis")
     .selectAll(".tick")
     .append("text")
     .text((d, i) => i == 8 ?"Frequency of use in headlines ⇢": "")
     // .text((d, i)=>console.log("ytick"+i))
     .attr("x", 0)             
     .attr("y", 0)
     .attr("class", "themesChartyTicks")
     .attr("dx", "250")
     .style("text-transform", "lowercase")
     .style("transform", "rotate(-90deg)")
     // .call(wrap, 10)


    // x axis
    formatValue = x => isNaN(x) ? "N/A" : x.toLocaleString("en")

    xAxis = svg.append("g")
    .call(xAxis)
    .attr("class", "stackedChartCountries")
    // .attr("transform", `translate(0,${heightChart-margin.top})`)

    xAxis.selectAll(".tick text").remove()
            // .call(wrap, x.bandwidth());


    xAxis.selectAll(".tick")
        .append("text")
        // .transition().duration("2000")
        // .ease(d3.easeBounce)
        .text(d=>d)
        .attr("x", 0)             
        .attr("y", 0)
        .attr("class", "stackedChartTicks")
        // .attr("transform", `translate(0,${height-margin.top+25})`)
        .attr("transform", `translate(0,${heightChart-margin.bottom-margin.top + height-margin.top/2-margin.bottom})`)
        .call(wrap, x.bandwidth())


     // select bars with a theme and transition them in new axis
    rectsThemes = d3.selectAll(".stackedBars")
        .selectAll("rect")
        .filter(d=>(d.key.theme!=="No theme")&&(d.data.country==="All countries"))
        .on("mouseover", (event, d) => highlightWords(d.key.word, "chartHover", d, yThemesStack, "True", heightChart-margin.top))
        .on("mouseleave", (event,d)=> unHighlightWords(d.key.word))

        // new
        // .data(stackedData)

        // test filter
        // console.log("test filter", stackedData.filter(d=>d.key === "kill")[0].filter(c=>c.data.theme==="violence"))
        
    // transition the rects into new axis

    // w = 100

    // var totalScale = d3.scaleLinear()
    //     .domain([d3.max(data.map(d=>d.count)), d3.min(data.map(d=>d.count))]) 
    //     .range([w, 5]);

    rectsThemes
        // .attr("height", "4px")
        // .attr("width", xThemes.bandwidth())
        // .on("mouseover", (event, d) => highlightWords(d.key, "chartHover", d))
        // .on("mouseleave", (event,d)=> unHighlightWords(d.key))
        .transition().duration("3000")
        .ease(d3.easeLinear)
        .delay((d, i) => {
            // console.log(d, i)
            return i * 10;
            // return i * Math.random() * 50;
            
          })
        // .attr("y", d => y(d[1]))
        // .attr("y", d => y(d.data[d.key]))
        // OLD
        // .attr("x", (d, i) => xThemes(d.key.theme))
        // .attr("y", d => yThemes(data.filter(c=>c.word===d.key.word)[0].rank))

        // // .attr("y", d => yThemes(data.filter(c=>c.word===d.key.word)[0].rank + totalScale(data.filter(c=>c.word===d.key.word)[0].count)))

        // // .attr("y", d => w - totalScale(data.filter(c=>c.word===d.key.word)[0].rank))
        
        // .attr("height", d => totalScale(data.filter(c=>c.word===d.key.word)[0].count))

        // NEW
        // .attr("x", (d, i) => xThemes(d.data.theme))
        .attr("x", d=> xThemes(stackedData.filter(c=>c.key === d.key.word)[0].filter(e=>e.data.theme===d.key.theme)[0].data.theme))
        .attr("y", d => yThemesStack(stackedData.filter(c=>c.key === d.key.word)[0].filter(e=>e.data.theme===d.key.theme)[0][1]))
        .attr("height", d => yThemesStack(stackedData.filter(c=>c.key === d.key.word)[0].filter(e=>e.data.theme===d.key.theme)[0][0]) - 
                             yThemesStack(stackedData.filter(c=>c.key === d.key.word)[0].filter(e=>e.data.theme===d.key.theme)[0][1]))
        .attr("width", xThemes.bandwidth())
        .attr("transform", `translate(0,${heightChart-margin.top})`)
        // console.log("test scale", stackedData.filter(c=>c.key === "kill")[0].filter(e=>e.data.theme==="violence")[0][1])


        // .attr("y", d => yThemesStack(d[1]))
        // .attr("height", d => yThemesStack(d[0]) - yThemesStack(d[1]))

    // .style("opacity", d=>d.key.theme==="female_bias"?"1":0)

    // select bars with no theme AND not in ALL COUNTRIES and remove them

    rectsNoThemes = d3.selectAll(".stackedBars")
        .selectAll("rect")
        .filter(d=>(d.key.theme==="No theme")||(d.data.country!=="All countries"))
        .transition().duration("3000")
        .ease(d3.easeCubic)
        .delay((d, i) => {
            // console.log(d, i)
            // return i * 10;
            return i * Math.random() * 0.2;
            
          })
        .remove()
    
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
    var hoverType = $(this)[0].attributes.hoverType.value
    // console.log($(this)[0].attributes.hoverType.value)
    // if ATTRIBUTE hoverType === inTextHover do this, otherwise normal hover with themes!
    unHighlightWords(word, hoverType)
})

// themes
// $('.stackedBarThemeAnnotation').on('mouseover', function () {
//     // var word = $(this)[0].innerText.toLowerCase()
//     var theme = $(this)[0].attributes.value.value
//     console.log(theme)
//     // highlightThemes(theme)
//     d3.selectAll(".stackedBars")
//             .selectAll("rect")//.attr("fill", d=>d.key==="man"?"red":"blue")
//             .style("opacity", d=>themes.filter(c=>c.word===d.key)[0].theme===theme?"1":"0.2")

//     // d3.select("#rectsBlock").select("#barchart").select('svg rect[data-key='+key+']').style('fill', 'brown');
// })
// .on('mouseout', function () {
//     d3.selectAll(".stackedBars")
//             .selectAll("rect")
//             .style("opacity", "1")
// })



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
