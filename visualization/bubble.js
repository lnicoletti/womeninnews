let width5 = 1500;
    let height5 = 540;
    
    let barchart = d3.select("div#chart").select("#bubblechart")
                    .attr("preserveAspectRatio", "xMinYMin meet")
                    .attr("viewBox", "0 0 "+ width5 +"," + height5+"")
                    .classed("svg-content", true);
    // let barchart = d3.select("#barchart")

    let timeline = d3.select("#timeline")

    // let width5 = 1500;
    // let height5 = 540;

    // barchart.attr("height", height5)
    // barchart.attr("width", width5)

    timeline.attr("height",height5/4)
    timeline.attr("width", width5/5)

    // let selectedCountry = undefined;

    Promise.all([
        d3.csv("https://gist.githubusercontent.com/lnicoletti/c312a25a680167989141e8315b26c92a/raw/707ead31e5bdbb886ff8f7dc5635d5d0568a0a81/citiesYearDeathsHT_party_n.csv"),
        d3.csv("../data/processed/headlines_site.csv")
      ])
    // d3.csv("../data/processed/headlines_site.csv")
    // d3.csv("data/citiesYearDeathsHT_party_n.csv")
        .then((datasets) => {
            data = datasets[0]
            data2 = datasets[1]
            console.log(data) 
            console.log(data2) 
            type = "most"
            kind = "tot"
            // drawBubbleChart(data, type, 2020, kind)
            drawBubbleChart2(data2)
        })

        function drawBubbleChart2(data2) {
            // popFilter = 50000
            // remove all previous text
            // console.log(data)
            // Store data with the right variable (hthou or tot) for line chart
            // dataType = data2
            // ttip = kind
            // console.log(ttip)
            let margin5 = {left: 30, bottom: 20, right: 30, top: 110}
    
            let bodywidth5 = width5 - margin5.left - margin5.right;
            let bodyheight5 = height5 - margin5.top - margin5.bottom;
    
            // filterData = data.filter(d=>+d.population > popFilter)
            filterData = data2.filter(d=>(+d.monthly_visits !== 0)&(+d.bias !== 0))
            filterData = filterData.filter(d=>(d.site !== "msn.com")&(d.site !== "sports.yahoo.com")&
                                              (d.site !== "finance.yahoo.com")&(d.site !== "news.google.com"))

            console.log(filterData)
            // var xScale = d3.scaleSymlog()
            var xScale = d3.scaleLinear()
                    .range([margin5.left+margin5.right, bodywidth5])
                    .domain([0, d3.max(filterData, d => +d.bias)])

            var colorScale = d3.scaleOrdinal()
                    .range(d3.schemeTableau10)
                    .domain(filterData.map(d =>d.country_of_pub))
            
            console.log(colorScale("UK"))
            // draw X-axis
            barchart.append("g")
                .call(d3.axisBottom(xScale))
                .attr("transform", "translate("+0+", "+bodyheight5+")")
                // .call(d3.axisTop(xScale).tickSize(300).ticks(7))
                // .attr("transform", "translate(0, "+bodyheight5+")")
                .attr("class", "yAxis")
                .selectAll("text")
                    .attr("font-size", "10px")
                    .attr("fill", "silver")
                    .attr("font-family", "arial")
                    // .attr("z-index", "-1")
    
            // var xScale = d3.scaleLog()
            //         .rangeRound([0, width]);
            
            extentvisits = d3.extent(filterData, d=>+d.monthly_visits)
            console.log(extentvisits)
            console.log(d3.extent(filterData, d=>+d.polarity))
            var radius = d3.scaleSqrt()
                                .domain(extentvisits)
                                .range([3, 60])
    
            var fontScale = d3.scaleLinear()
                                .domain(extentvisits)
                                .range([1, 20])
    
            console.log(fontScale(10000000)+"px")
            // xScale.domain(d3.extent(filterData, function(d) { return +d.death_count; }));
            // var init_decay; 
            // init_decay = setTimeout(function(){
            //     console.log('init alpha decay');
            //     simulation.alphaDecay(0.1);
            // }, 8000);
    
            let simulation = d3.forceSimulation()
                        .nodes(filterData)
                        .force('charge', d3.forceManyBody().strength(1))
                        .force('x', d3.forceX().x(function(d) {
                            return xScale(+d.bias);
                        }))
                        .force("y", d3.forceY(bodyheight5/1.5).strength(0.05))
                        .force('collide', d3.forceCollide((d)=>{ 
                            return radius(+d.monthly_visits)}))
                        // .alpha(0.5)
                        // .alphaTarget(0.5)
                        // .alphaDecay(0)
                        // .alpha(1)
                        .on('tick', function() {
            
            // collision detection
            for ( i = 0; i < filterData.length; i++ ) {
                var node = filterData[i];
                node.cx = node.x;
                node.cy = node.y;
            }
            
            circles = barchart.select(".body")
                            .selectAll('circle')
                            .data(filterData);
    
            annot = barchart.select(".body")
                            .selectAll('text')
                            .data(filterData);
                
            newCircles = circles.enter()
                .append('circle')
                .attr("class", "forceCircles")
                // .attr("fill", "#03071e")
                .attr("fill", d=>+d.polarity > 0.5? 'darkred':'grey')
                // .attr("fill", d=>colorScale(d.country_of_pub))
                // .attr("fill", "black")
                .attr("opacity", "0.8")
                // .style('stroke', "white")
                .style('stroke', "#323232")
                .attr('r', d=>radius(+d.monthly_visits))
                // .attr('r', 10)

                // .attr("fill", "#03071e")
                // .attr("opacity", "0.8")
                // .style('stroke', "white")
                // .merge(circles)
                // .attr('cx', function(d) {
                //     return d.x;
                // })
                // .attr('cy', function(d) {
                //     return d.y;
                // })
                // .on("mouseenter", (d) => {
                //     showTooltip5(ttip, d.county, Math.round(d.death_count), d.date, [d3.event.clientX, d3.event.clientY], dataType, d.county, d)
                // })
                // .on("mousemove", (d) => {
                //     showTooltip5(ttip, d.county, Math.round(d.death_count), d.date, [d3.event.clientX, d3.event.clientY], dataType, d.county, d)
                // })
                // // .on("mouseleave", (d) => {
                // //     d3.select("#tooltipBar").style("display", "none")
                // // })
                // .on("mouseleave", (d) => {
                //     d3.select("#timeline").style("display", "none")
                // })
                // // .on("mouseover.colorAll", function() { d3.selectAll(".forceCircles").attr("fill", d=>d.party==="red" ? '#DD1F26':'#0076C0').attr("opacity", "0.5"); })
                // // .on("mouseleave.colorAll", function() { d3.selectAll(".forceCircles").attr("fill", d=>d.party==="red" ? '#DD1F26':'#0076C0').attr("opacity", "0.8"); })
                // // .on("mouseover.color", function() { d3.select(this).attr("fill", d=>d.party==="red" ? '#DD1F26':'#0076C0').attr("opacity", "0.8"); })
                // // .on("mouseleave.color", function() { d3.select(this).attr("fill", d=>d.party==="red" ? '#DD1F26':'#0076C0').attr("opacity", "0.8"); })
                // .on("mouseover.color", function() { d3.select(this).style("stroke", "black"); })
                // .on("mouseleave.color", function() { d3.select(this).style("stroke", "white"); })
                
                // on hover update line chart
                // .on("mouseover.update", d => {
                //     selectedCountry = d.county;
                //     console.log(d)
                //     drawLineChart(dataType, d.county, ttip)
                // })
    
            newText = annot.enter()
                    .append("text")
                    .attr("class", "forceText")
                    .text(d=>+d.monthly_visits>100000000 ? d.site:'')
                    // .text(d=>d.site)
                    .style("font-size", d=>fontScale(+d.monthly_visits)+"px")
    
            // transition to new updated year
            circles.merge(newCircles)
                .attr('cx', function(d) {
                    return d.x;
                })
                .attr('cy', function(d) {
                    return d.y;
                })
    
            annot.merge(newText)
                .attr('x', function(d) {
                    return d.x;
                })
                .attr('y', function(d) {
                    return d.y;
                })
    
            circles.exit().remove();
            annot.exit().remove();
    
                });
        
        barchart.append("text")
                .attr("id", "xAxisLabel")
                // .attr("transform", "rotate(-90)")
                .attr("y", bodyheight5*1.08)
                .attr("x",margin5.left+margin5.right)
                .attr("dy", "1em")
                .attr("font-size", "17px")
                .style("text-anchor", "start")
                .style("fill", "silver")
                .text("← No Gender Bias")
                .style("font-weight", "bold")  
                .style("font-family", "sans-serif")
    
        barchart.append("text")
                .attr("id", "xAxisLabel")
                // .attr("transform", "rotate(-90)")
                .attr("y", bodyheight5*1.08)
                .attr("x",bodywidth5)
                .attr("dy", "1em")
                .attr("font-size", "17px")
                .style("text-anchor", "end")
                .style("fill", "silver")
                .text("Extreme Gender Bias →")
                .style("font-weight", "bold")  
                .style("font-family", "sans-serif")

            }


        // function drawBubbleChart(data, type, year, kind) {
        //     popFilter = 50000
        //     // remove all previous text
        //     // console.log(data)
        //     // Store data with the right variable (hthou or tot) for line chart
        //     dataType = data
        //     ttip = kind
        //     // console.log(ttip)
        //     let margin5 = { left: 20, bottom: 20, right: 20, top: 110}
    
        //     let bodywidth5 = width5 - margin5.left - margin5.right;
        //     let bodyheight5 = height5 - margin5.top - margin5.bottom;
    
        //     filterData = data.filter(d=>+d.population > popFilter)
        //     filterData = filterData.filter(d=>+d.date === year)
    
        //     console.log(filterData)
        //     var xScale = d3.scaleSymlog()
        //             .range([5, bodywidth5])
        //             .domain([0, d3.max(filterData, d => +d.death_count)+4])
    
        //     // draw X-axis
        //     barchart.append("g")
        //         .call(d3.axisBottom(xScale))
        //         .attr("transform", "translate(0, "+bodyheight5+")")
        //         // .call(d3.axisTop(xScale).tickSize(300).ticks(7))
        //         // .attr("transform", "translate(0, "+bodyheight5+")")
        //         .attr("class", "yAxis")
        //         .selectAll("text")
        //             .attr("font-size", "10px")
        //             .attr("fill", "silver")
        //             .attr("font-family", "arial")
        //             // .attr("z-index", "-1")
    
        //     // var xScale = d3.scaleLog()
        //     //         .rangeRound([0, width]);
            
        //     maxpop = d3.max(filterData, d=>+d.population)
        //     console.log(maxpop)
        //     var radius = d3.scaleSqrt()
        //                         .domain([20000, maxpop])
        //                         .range([0, 60])
    
        //     var fontScale = d3.scaleLinear()
        //                         .domain([600000, maxpop])
        //                         .range([4.5, 10])
    
        //     console.log(fontScale(3000000)+"px")
        //     // xScale.domain(d3.extent(filterData, function(d) { return +d.death_count; }));
        //     // var init_decay; 
        //     // init_decay = setTimeout(function(){
        //     //     console.log('init alpha decay');
        //     //     simulation.alphaDecay(0.1);
        //     // }, 8000);
    
        //     let simulation = d3.forceSimulation()
        //                 .nodes(filterData)
        //                 .force('charge', d3.forceManyBody().strength(1))
        //                 .force('x', d3.forceX().x(function(d) {
        //                     return xScale(+d.death_count);
        //                 }))
        //                 .force("y", d3.forceY(bodyheight5/1.5).strength(0.05))
        //                 .force('collide', d3.forceCollide((d)=>{ 
        //                     return radius(+d.population)}))
        //                 // .alpha(0.5)
        //                 // .alphaTarget(0.5)
        //                 // .alphaDecay(0)
        //                 // .alpha(1)
        //                 .on('tick', function() {
            
        //     // collision detection
        //     for ( i = 0; i < filterData.length; i++ ) {
        //         var node = filterData[i];
        //         node.cx = node.x;
        //         node.cy = node.y;
        //     }
            
        //     circles = barchart.select(".body")
        //                     .selectAll('circle')
        //                     .data(filterData);
    
        //     annot = barchart.select(".body")
        //                     .selectAll('text')
        //                     .data(filterData);
                
        //     newCircles = circles.enter()
        //         .append('circle')
        //         .attr("class", "forceCircles")
        //         // .attr("fill", "#03071e")
        //         .attr("fill", d=>d.party==="red" ? '#DD1F26':'#0076C0')
        //         .attr("opacity", "0.8")
        //         .style('stroke', "white")
        //         .attr('r', d=>radius(+d.population))
        //         // .attr("fill", "#03071e")
        //         // .attr("opacity", "0.8")
        //         // .style('stroke', "white")
        //         // .merge(circles)
        //         // .attr('cx', function(d) {
        //         //     return d.x;
        //         // })
        //         // .attr('cy', function(d) {
        //         //     return d.y;
        //         // })
        //         .on("mouseenter", (d) => {
        //             showTooltip5(ttip, d.county, Math.round(d.death_count), d.date, [d3.event.clientX, d3.event.clientY], dataType, d.county, d)
        //         })
        //         .on("mousemove", (d) => {
        //             showTooltip5(ttip, d.county, Math.round(d.death_count), d.date, [d3.event.clientX, d3.event.clientY], dataType, d.county, d)
        //         })
        //         // .on("mouseleave", (d) => {
        //         //     d3.select("#tooltipBar").style("display", "none")
        //         // })
        //         .on("mouseleave", (d) => {
        //             d3.select("#timeline").style("display", "none")
        //         })
        //         // .on("mouseover.colorAll", function() { d3.selectAll(".forceCircles").attr("fill", d=>d.party==="red" ? '#DD1F26':'#0076C0').attr("opacity", "0.5"); })
        //         // .on("mouseleave.colorAll", function() { d3.selectAll(".forceCircles").attr("fill", d=>d.party==="red" ? '#DD1F26':'#0076C0').attr("opacity", "0.8"); })
        //         // .on("mouseover.color", function() { d3.select(this).attr("fill", d=>d.party==="red" ? '#DD1F26':'#0076C0').attr("opacity", "0.8"); })
        //         // .on("mouseleave.color", function() { d3.select(this).attr("fill", d=>d.party==="red" ? '#DD1F26':'#0076C0').attr("opacity", "0.8"); })
        //         .on("mouseover.color", function() { d3.select(this).style("stroke", "black"); })
        //         .on("mouseleave.color", function() { d3.select(this).style("stroke", "white"); })
                
        //         // on hover update line chart
        //         // .on("mouseover.update", d => {
        //         //     selectedCountry = d.county;
        //         //     console.log(d)
        //         //     drawLineChart(dataType, d.county, ttip)
        //         // })
    
        //     newText = annot.enter()
        //             .append("text")
        //             .attr("class", "forceText")
        //             .text(d=>+d.population>600000 ? d.county:'')
        //             .style("font-size", d=>fontScale(+d.population)+"px")
    
        //     // transition to new updated year
        //     circles.merge(newCircles)
        //         .attr('cx', function(d) {
        //             return d.x;
        //         })
        //         .attr('cy', function(d) {
        //             return d.y;
        //         })
    
        //     annot.merge(newText)
        //         .attr('x', function(d) {
        //             return d.x;
        //         })
        //         .attr('y', function(d) {
        //             return d.y;
        //         })
    
        //     circles.exit().remove();
        //     annot.exit().remove();
    
        //         });
        
        // barchart.append("text")
        //         .attr("id", "xAxisLabel")
        //         // .attr("transform", "rotate(-90)")
        //         .attr("y", bodyheight5*1.08)
        //         .attr("x",0)
        //         .attr("dy", "1em")
        //         .attr("font-size", "17px")
        //         .style("text-anchor", "start")
        //         .style("fill", "silver")
        //         .text("← Less Deaths by Police")
        //         .style("font-weight", "bold")  
        //         .style("font-family", "sans-serif")
    
        // barchart.append("text")
        //         .attr("id", "xAxisLabel")
        //         // .attr("transform", "rotate(-90)")
        //         .attr("y", bodyheight5*1.08)
        //         .attr("x",bodywidth5)
        //         .attr("dy", "1em")
        //         .attr("font-size", "17px")
        //         .style("text-anchor", "end")
        //         .style("fill", "silver")
        //         .text("More Deaths by Police →")
        //         .style("font-weight", "bold")  
        //         .style("font-family", "sans-serif")

        //     }


