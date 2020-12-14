    let width5 = 1500;
    let height5 = 540;

    let heightCluster =  height5*3

    padding = 1.5, // separation between same-color nodes
    clusterPadding = 6, // separation between different-color nodes
    maxRadius = 12;

    color = d3.scaleOrdinal()
      .range(["#7A99AC", "#E4002B"]);
    
    let barchart = d3.select("div#chart").select("#bubblechart")
                    .attr("preserveAspectRatio", "xMinYMin meet")
                    .attr("viewBox", "0 0 "+ width5 +"," + height5+"")
                    .classed("svg-content", true);

    let wordClusters = d3.select("div#clusterChart").select("#bubbleClusters")
                    .attr("preserveAspectRatio", "xMinYMin meet")
                    .attr("viewBox", "0 0 "+ width5 +"," + heightCluster+"")
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

    // define links to logos
    logoData = [{site:"nytimes.com", link:"https://www.vectorlogo.zone/logos/nytimes/nytimes-icon.svg"},
                {site:"dailymail.co.uk", link:"https://seeklogo.com/images/D/Daily_Mail-logo-EBD7A83A1F-seeklogo.com.gif"},
                {site:"cnn.com", link:"https://www.vectorlogo.zone/logos/cnn/cnn-icon.svg"},//https://www.vectorlogo.zone/logos/cnn/cnn-wordmark.svg
                {site:"bbc.co.uk", link:"https://www.vectorlogo.zone/logos/bbc/bbc-icon.svg"},
                {site:"telegraph.co.uk", link:"https://upload.wikimedia.org/wikipedia/commons/4/48/The_Telegraph_logo.svg"},
                {site:"washingtonpost.com", link:"https://www.vectorlogo.zone/logos/washingtonpost/washingtonpost-icon.svg"},
                {site:"forbes.com", link:"https://www.vectorlogo.zone/logos/forbes/forbes-icon.svg"},
                {site:"abcnews.go.com", link:"https://www.vectorlogo.zone/logos/abcgo/abcgo-icon.svg"},
                {site:"foxnews.com", link:"https://www.vectorlogo.zone/logos/fox/fox-icon.svg"},
                {site:"ksl.com", link:"https://logodix.com/logo/2090138.png"},
                {site:"bloomberg.com", link: "https://www.vectorlogo.zone/logos/bloomberg/bloomberg-icon.svg"},
                {site:"breitbart.com", link:"https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Breitbart_News.svg/1280px-Breitbart_News.svg.png"},
                {site:"popsugar.com", link:"https://all-4-one.com/wp-content/uploads/2015/07/PopSugar-Logo-logo.png"},
                {site:"nbcnews.com", link:"https://www.vectorlogo.zone/logos/nbc/nbc-icon.svg"},
                {site:"buzzfeed.com", link:"https://www.vectorlogo.zone/logos/buzzfeed/buzzfeed-icon.svg"},
                {site:"cnet.com", link:"https://www.vectorlogo.zone/logos/cnet/cnet-icon.svg"},
                {site:"politico.com", link:"https://www.vectorlogo.zone/logos/politico/politico-icon.svg"},
                {site:"usatoday.com", link:"https://www.vectorlogo.zone/logos/usatoday/usatoday-icon.svg"},
                {site:"nydailynews.com", link:"https://cdn6.myket.ir/icons/large/b0f31373-17ec-46d5-b6ef-66135cc1b242_.png"},
                {site:"businessinsider.com", link:""},
                {site:"espn.go.com", link:"https://cdn.worldvectorlogo.com/logos/espn.svg"},
                {site:"huffingtonpost.com", link:"https://www.vectorlogo.zone/logos/huffingtonpost/huffingtonpost-icon.svg"}
            ]

    // groups = {
    //         "South Africa, male": { x: width5 - 300, y: height5, color: "#93D1BA"},
    //         "South Africa, violence": { x: width5-600, y: height5, color: "#BEE5AA"},
    //         "South Africa, female": { x: width5 - 900, y: height5, color: "#79BACE"},
    //         "South Africa, empowerment": { x: width5 - 1200, y: height5, color: "lightblue", country: "South Africa"},

    //         "USA, male": { x: width5- 300, y: height5 - 160, color: "#93D1BA"},
    //         "USA, violence": { x: width5- 600, y: height5 - 160, color: "#BEE5AA"},
    //         "USA, female": { x: width5- 900, y: height5 - 160, color: "#79BACE"},
    //         "USA, empowerment": { x: width5- 1200, y: height5 - 160, color: "lightblue", country: "United States"},

    //         "UK, male": { x: width5- 300, y: height5 -320, color: "#93D1BA"},
    //         "UK, violence": { x: width5- 600, y: height5-320, color: "#BEE5AA"},
    //         "UK, female": { x: width5- 900, y: height5-320, color: "#79BACE"},
    //         "UK, empowerment": { x: width5- 1200, y: height5-320, color: "lightblue", country: "United Kingdom"},

    //         "India, male": { x: width5- 300, y: height5-480, color: "#93D1BA", theme: "Male Dominance"},
    //         "India, violence": { x: width5- 600, y: height5-480, color: "#BEE5AA", theme: "Violence"},
    //         "India, female": { x: width5 - 900, y: height5-480, color: "#79BACE", theme: "Female Bias"},
    //         "India, empowerment": { x: width5- 1200, y: height5-480, color: "lightblue", theme: "Empowerment", country: "India"},
    //     }
    

    console.log(logoData.filter(d=>d.site=='bloomberg.com')[0]["link"])
    Promise.all([
        d3.csv("../data/processed/headlines_site.csv"),
        d3.csv("../data/processed/countries_clusters.csv"),
        d3.csv("../data/processed/headlines_cl_sent_pol.csv"),
        d3.csv("../data/processed/countries_freq.csv"),
        d3.json("../data/processed/word_connections_UK.json"),
        d3.json("../data/processed/word_connections_USA.json"),
        d3.json("../data/processed/word_connections_IN.json"),
        d3.json("../data/processed/word_connections_SA.json"),
        // d3.csv("../data/processed/sites_freq.csv"),
        // d3.csv("https://gist.githubusercontent.com/lnicoletti/c312a25a680167989141e8315b26c92a/raw/707ead31e5bdbb886ff8f7dc5635d5d0568a0a81/citiesYearDeathsHT_party_n.csv"),
      ])
    // d3.csv("../data/processed/headlines_site.csv")
    // d3.csv("data/citiesYearDeathsHT_party_n.csv")
        .then((datasets) => {
            headlinesSite = datasets[0]
            countriesCls = datasets[1]
            headlines = datasets[2]
            countries_data = datasets[3]
            UK_data = datasets[4]
            USA_data = datasets[5]
            IN_data = datasets[6]
            SA_data = datasets[7]
            console.log(SA_data)
            console.log(countries_data)
            console.log(headlinesSite) 
            console.log(countriesCls) 
            console.log(headlines) 
            drawBubbleChart(headlinesSite)
            drawBarLegend()

            var fired = 0;
            $(window).scroll(function(){
                // This is then function used to detect if the element is scrolled into view
                function elementScrolled(elem)
                {
                  var docViewTop = $(window).scrollTop();
                  var docViewBottom = docViewTop + $(window).height();
                  var elemTop = $(elem).offset().top;
                  return ((elemTop <= docViewBottom) && (elemTop >= docViewTop));
                }
              
                // This is where we use the function to detect if ".box2" is scrolled into view, and when it is add the class ".animated" to the <p> child element
                if(elementScrolled('div#clusterChart')&&(fired == 0)) {
                // Your function here
                drawWordClusters(countriesCls)
                drawNetwork(UK_data, "div#my_network")
                drawBars(countries_data, "#chart1", "UK", 20, "United Kingdom")  
                drawNetwork(USA_data, "div#my_network2")  
                drawBars(countries_data, "#chart2", "USA", 20, "United States")   
                drawNetwork(IN_data, "div#my_network3") 
                drawBars(countries_data, "div#chart3", "India", 20, "India")   
                drawNetwork(SA_data, "div#my_network4") 
                drawBars(countries_data, "#chart4", "South Africa", 20, "South Africa")
                fired = 1;
              
                }   

              });

        })

        function showTooltip5(ttip, text1, text2, text3, coords, data, county, c) {
            let x = coords[0]-120;
            let y = coords[1]-200;
            // party = c.party
            console.log(c)
            console.log(data)
            // remove previous text: 
            timeline.selectAll("#tooltipText").remove()
            // console.log(party)
            // tooltip = d3.select("#tooltipBar")
            //     .style("display", "block")
            //     .style("top", y + "px")
            //     .style("left", x + "px")
            //     // .html(text2>100? "hthough": "count")
                // .html(ttip === "tot" ? "<b>" + text1 + "<br/>" + text2 + "</b> deaths by police in " + "<b>" + text3 + "</b>" : 
                //     "<b>" + text1 + "<br/>" + text2 + "</b> deaths by police per 100,000 individuals in " + "<b>" + text3 + "</b>")
            timeline
                .style("display", "block")
                .style("visibility", "visible")
                .style("top", y + "px")
                .style("left", x + "px")
                .style("border", "solid 1px #ccc")
                // .syle("display", "block")
    
            // console.log(data)
            // // remove all previous text
            d3.select("#timeline").selectAll("#yAxisLabel").remove()
            // // remove all previous dots
            d3.select("#timeline").selectAll("circle").remove()
            // remove hoverGuide
            d3.select("#hoverGuide").remove()
            d3.select("#hoverGuideLine").remove()
            // // data = data.history;
            // console.log(ttip)
            // data = data.filter(d=>d.county === county)
            // data = c.bias>0.8?data.filter(d=>(d.site === text1)&(d.bias > 0.8)):
            //       (c.bias>0.5)&(c.bias<0.8)?data.filter(d=>(d.site === text1)&(d.bias > 0.5)&(d.bias < 0.8)):
            //        data.filter(d=>(d.site === text1)&(d.bias < 0.5))
            data = c.bias>0.5?data.filter(d=>(d.site === text1)&(d.bias > 0.5)):
                     data.filter(d=>(d.site === text1)&(d.bias < 0.5))

            // data = d3.filter(data, d=>d.site === text1) 
            console.log(data)

            // find a random headline
            randHeadline = Math.floor(Math.random() * data.length)
            console.log(data[randHeadline].headline_no_site)
            console.log(data[randHeadline].subtitle)

            // console.log(data.length)
            let ttipMargin = { left: 40, bottom: 110, right: 20, top: 20 }
    
            let ttipWidth = width5/7 - ttipMargin.left - ttipMargin.right;
            let ttipHeight =height5/2.5 - ttipMargin.top - ttipMargin.bottom;
    
            timeline.append("text")
                .attr("id", "tooltipText")
                .attr("y", ttipHeight/4)
                .attr("x", 0)
                .attr("font-weight", "bold")
                .attr("font-size", "12px")
                // .attr("fill", party==="red" ? '#DD1F26':'#0076C0')
                .attr("fill", "rgb(230, 230, 230)")
                .html("<b>" + '"' + data[randHeadline].headline_no_site + '"')
                .call(wrap, 300)
    
            timeline.append("text")
                .attr("id", "tooltipText")
                .attr("y", ttipHeight/1.5)
                .attr("x", 0)
                .attr("font-size", "11px")
                // .attr("font-weight", "bold")
                .attr("fill", "rgb(196, 195, 195)")
                .html('"' + data[randHeadline].subtitle + '..."')
                .call(wrap, 300)

            timeline.append("text")
                .attr("id", "tooltipText")
                .attr("y", ttipHeight*1.5)
                .attr("x", 0)
                .attr("font-size", "12px")
                .attr("font-weight", "bold")
                .attr("fill", "rgb(230, 230, 230)")
                .html(data[randHeadline].site)
                .call(wrap, 300)
        }

        function drawBubbleChart(data) {
            
            ttip = "bias"
            // console.log(ttip)
            let margin5 = {left: 30, bottom: 20, right: 30, top: 110}
    
            let bodywidth5 = width5 - margin5.left - margin5.right;
            let bodyheight5 = height5 - margin5.top - margin5.bottom;
    
            // filterData = data.filter(d=>+d.population > popFilter)
            filterData = data.filter(d=>(+d.monthly_visits !== 0)&(+d.bias !== 0))
            filterData = filterData.filter(d=>(d.site !== "msn.com")&(d.site !== "sports.yahoo.com")&
                                              (d.site !== "finance.yahoo.com")&(d.site !== "news.google.com")&
                                              (d.site !== "news.yahoo.com")&(d.site !== "bbc.com"))

            console.log(filterData)
            // var xScale = d3.scaleSymlog()
            var xScale = d3.scaleLinear()
                    .range([margin5.left+margin5.right, bodywidth5])
                    .domain([0, d3.max(filterData, d => +d.bias)])

            // var colorScale = d3.scaleOrdinal()
            //         .range(d3.schemeTableau10)
            //         .domain(filterData.map(d =>d.country_of_pub))

            // var colorScale = d3.scaleQuantile()
            //     .domain([0, d3.max(filterData, d => +d.polarity)]) // pass the whole dataset to a scaleQuantile’s domain
            //     .range(d3.schemeReds[9])
            
            // console.log(colorScale("UK"))
            // draw X-axis
            // barchart.append("g")
            //     .call(d3.axisBottom(xScale))
            //     .attr("transform", "translate("+0+", "+bodyheight5+")")
            //     // .call(d3.axisTop(xScale).tickSize(300).ticks(7))
            //     // .attr("transform", "translate(0, "+bodyheight5+")")
            //     .attr("class", "yAxis")
            //     .selectAll("text")
            //         .attr("font-size", "10px")
            //         .attr("fill", "silver")
            //         .attr("font-family", "arial")
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

            var logoScale = d3.scaleLinear()
                                .domain(extentvisits)
                                .range([18, 100])

            // var logoPosScale = d3.scaleLinear()
            //                     .domain(extentvisits)
            //                     .range([-50, 0])
    
            // filterdata['transform'] = filterData.map(d=>logoPosScale(+d.monthly_visits))
            // filterData['test'] = 1
            console.log(filterData)
            // xScale.domain(d3.extent(filterData, function(d) { return +d.death_count; }));
            // var init_decay; 
            // init_decay = setTimeout(function(){
            //     console.log('init alpha decay');
            //     simulation.alphaDecay(0.1);
            // }, 8000);

            console.log(filterData.filter(d=>+d.monthly_visits>150000000))
    
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

            logos = barchart.select(".body")
                            .selectAll('image')
                            .data(filterData);
                
            newCircles = circles.enter()
                .append('circle')
                .attr("class", "forceCircles")
                // .attr("fill", "#03071e")
                // .attr("fill", d=>+d.polarity > 0.5? 'darkred':'grey')
                // .attr("fill", d=>colorScale(d.country_of_pub))
                // .attr("fill", "#d9cac9")
                .attr("fill", "white")
                // .attr("fill", d=>colorScale(+d.polarity))
                .attr("opacity", "0.8")
                .style('stroke', "#161616")
                .attr('r', d=>radius(+d.monthly_visits))
                // v5
                .on("mouseenter", (d) => {
                    showTooltip5(ttip, d.site, d.country_of_pub, d.monthly_visits, [d3.event.clientX, d3.event.clientY], headlines, d.polarity, d)
                })
                .on("mousemove", (d) => {
                    showTooltip5(ttip, d.site, d.country_of_pub, d.monthly_visits,  [d3.event.clientX, d3.event.clientY], headlines, d.polarity, d)
                })
                // v6
                // .on("mouseenter", (event, d) => {
                //     showTooltip5(ttip, d.site, d.country_of_pub, d.monthly_visits, [event.clientX, event.clientY], headlines, d.polarity, d)
                // })
                // .on("mousemove", (event, d) => {
                //     showTooltip5(ttip, d.site, d.country_of_pub, d.monthly_visits,  [event.clientX, event.clientY], headlines, d.polarity, d)
                // })
                .on("mouseleave", (d) => {
                    d3.select("#timeline").style("display", "none")
                })
                .on("mouseover.color", function() { d3.select(this).style("stroke", "white"); })
                .on("mouseleave.color", function() { d3.select(this).style("stroke", "#323232"); })
                
    
            // newText = annot.enter()
            //         .append("text")
            //         .attr("class", "forceText")
            //         .text(d=>+d.monthly_visits>150000000 ? d.site:'')
            //         // .text(d=>d.site)
            //         .style("font-size", d=>fontScale(+d.monthly_visits)+"px")
            
            newLogos = logos.enter()
                    .append("svg:image")
                    // .attr("class", "forceLogo")
                    // .attr('x', d => d.cx)
                    // .attr('y', d => d.cy)
                    // .attr("transform", "translate("+(d=>logoPosScale(+d.monthly_visits))+","+(d=>logoPosScale(+d.monthly_visits))+")")
                    // .attr("transform", "translate("+(d=>logoPosScale(+d.monthly_visits))+","+(d=>logoPosScale(+d.monthly_visits))+")")
                    // .attr("transform", d=>+d.monthly_visits<600000000?"translate("+-25+","+-25+")":"translate("+-50+","+-50+")")
                    // .attr("transform", "translate(-25,-25)")
                    .attr("transform", d=>d.site=="bbc.co.uk" ? "translate(-50,-50)"
                                        : d.site=="cnn.com" | d.site=="foxnews.com" ? "translate(-30,-30)"
                                        : d.site=="espn.go.com" ? "translate(-34,-10)"
                                        : d.site=="nytimes.com" | d.site=="buzzfeed.com" ? "translate(-25,-25)"
                                        : d.site=="washingtonpost.com" | d.site=="huffingtonpost.com" | d.site== "usatoday.com" ? "translate(-20,-20)"
                                        : d.site=="dailymail.co.uk" ? "translate(-22,-18)"
                                        : d.site=="politico.com" | d.site=="abcnews.go.com" | d.site=="nydailynews.com" ? "translate(-12.5,-12.5)"
                                        : d.site=="telegraph.co.uk" ? "translate(-15,-3)"
                                        : d.site=="breitbart.com" ? "translate(-14,-10)"
                                        : "translate(-15,-15)")
                    .attr('width', d=>logoScale(+d.monthly_visits))
                    // .attr('width', 50)
                    // .attr('height', 4)
                    // .attr("xlink:href", d=>d.site === "bbc.co.uk" ? "https://www.vectorlogo.zone/logos/bbc/bbc-icon.svg":'')
                    // .style("fill", d=>+d.monthly_visits>150000000 ? logoData.filter(x=>x.site==d.site)[0]["link"]:'')
                    .attr("xlink:href", d=>+d.monthly_visits>150000000 ? logoData.filter(x=>x.site==d.site)[0]["link"]:'')
                    // .attr('x', -200)
                    // .attr('y', 0)

            // transition to new updated year
            circles.merge(newCircles)
                .attr('cx', function(d) {
                    return d.x;
                })
                .attr('cy', function(d) {
                    return d.y;
                })
    
            // annot.merge(newText)
            //     .attr('x', function(d) {
            //         return d.x;
            //     })
            //     .attr('y', function(d) {
            //         return d.y;
            //     })

            logos.merge(newLogos)
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
                .attr("id", "hoverGuide")
                // .attr("transform", "rotate(-90)")
                .attr("y", bodyheight5/4)
                .attr("x",bodywidth5/1.7)
                .attr("dy", "1em")
                .attr("font-size", "17px")
                .style("text-anchor", "start")
                .style("fill", "silver")
                .text("Hover over a bubble to explore headlines from that outlet!")
                .style("font-weight", "bold")  
                .style("font-family", "sans-serif")

        // line y coordinate
        wp = +data.filter(d=>d.site==="telegraph.co.uk")[0].bias+0.01

        barchart.append("line")
            .attr("y1", bodyheight5/3.2)
            .attr("x1",bodywidth5/1.3)
            .attr("x2", xScale(wp))
            .attr("y2", bodyheight5/1.85)
            .attr("stroke-width", 1)
            .attr("id", "hoverGuideLine")
            .attr("stroke", 'silver')

        // barchart.append("line")
        // .attr("y1", 100)
        // .attr("x1",200)
        // .attr("x2",300)
        // .attr("y2",400)
        // .attr("color", 'white')

        // console.log(xScale(wp))
        // console.log(wp)
        barchart.append("text")
                .attr("id", "xAxisLabel")
                // .attr("transform", "rotate(-90)")
                .attr("y", bodyheight5*1.08)
                .attr("x",margin5.left+margin5.right)
                .attr("dy", "1em")
                .attr("font-size", "17px")
                .style("text-anchor", "start")
                .style("fill", "silver")
                .text("← Less Gendered Language")
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
                .text("More Gendered Language →")
                .style("font-weight", "bold")  
                .style("font-family", "sans-serif")

                // 10M Monthly Viewers
                legendData = [{level: "", radius: radius(10000000), y: bodyheight5+70, x: bodywidth5/2.2, anchor:"end", xtext: bodywidth5/2.235, ytext: bodyheight5+53}, 
                {level: "", radius: radius(100000000), y: bodyheight5+70, x: bodywidth5/2.1}, 
                {level: "1B Monthly Viewers", radius: radius(1000000000), y: bodyheight5+70, x: bodywidth5/1.9, anchor:"middle", xtext: bodywidth5/1.9, ytext: bodyheight5+41}]
                // legendData = [{level: "Word is less frequent", radius: 3, y: 20, x: 1000, anchor:"end"}, 
                //               {level: "", radius: 5, y: height5+70, x: width5/2.06}, 
                //               {level: "Word is more frequent", radius: 10, y: 20, x: 200, anchor:"start"}]
                // clusters composed of more bubbles indicate more words used for a specific category

                legend = barchart.append("g")
                // legend.append("g")
                    .selectAll("circle")
                    .data(legendData)
                    .join('circle')
                    .attr("cx", d => d.x)
                    .attr("cy", d => d.y)
                    .attr("r", d => d.radius)
                    .attr("fill","none")
                    .attr("stroke","lightgrey")
                
                textLegend = barchart.append("g")
                // textLegend = legend.append("g")
                    .selectAll("text")
                    .data(legendData)
                    .join("text")
                    .text(d=>d.level)
                    .attr("x", d => d.xtext)
                    .attr("y", d => d.ytext)
                    .attr("class", "themesText")
                    .style("text-anchor", d=>d.anchor)
                    .attr("fill","lightgrey")
                    .call(wrap, 10)

        }
        
        function tooltipCluster(word, freq, theme, country, coords, pc_freq) {
            console.log(word)
            d3.select("#tooltipCluster")
                .style("display", "block")
                .style("top", (coords[1]+10) + "px")
                .style("left", (coords[0]+10) + "px")
                // .style("top", (d3.mouse(this)[0]+90) + "px")
                // .style("left", (d3.mouse(this)[1]) + "px")
                .style('font', '14px sans-serif')
                .style('background-color', clusterColors(pc_freq))
                // .style('fill-opacity', 0.5)
                .attr('stroke', '#ccc')
                // .text(text)
                .html("<b>" + word + "<br/> </b> Used <b>" + freq + "</b> times in " + "<b>" + country + "</b> headlines")
        }

        function drawWordClusters(data) {

            // console.log(d3.sum(data.filter(d=>(d.cluster === "South Africa, male"), c => +c.frequency)/d3.sum(d=>d.frequency)))
            // cl = data.filter(d=>(d.cluster === "South Africa, male"))
            // console.log(d3.sum(data.filter(d=>(d.cluster === "South Africa, male")), d=>+d.frequency)/d3.sum(data, d=>d.frequency))

            groups = {
                "South Africa, male": { x: width5 - 300, y: height5, color: "#93D1BA", pc_freq: d3.sum(data.filter(d=>(d.cluster === "South Africa, male")), d=>+d.frequency)/d3.sum(data, d=>d.frequency)},
                "South Africa, violence": { x: width5-600, y: height5, color: "#BEE5AA", pc_freq: d3.sum(data.filter(d=>(d.cluster === "South Africa, violence")), d=>+d.frequency)/d3.sum(data, d=>d.frequency)},
                "South Africa, female": { x: width5 - 900, y: height5, color: "#79BACE", pc_freq: d3.sum(data.filter(d=>(d.cluster === "South Africa, female")), d=>+d.frequency)/d3.sum(data, d=>d.frequency)},
                "South Africa, empowerment": { x: width5 - 1200, y: height5, color: "lightblue", country: "South Africa", pc_freq: d3.sum(data.filter(d=>(d.cluster === "South Africa, empowerment")), d=>+d.frequency)/d3.sum(data, d=>d.frequency)},
    
                "USA, male": { x: width5- 300, y: height5 - 160, color: "#93D1BA", pc_freq: d3.sum(data.filter(d=>(d.cluster === "USA, male")), d=>+d.frequency)/d3.sum(data, d=>d.frequency)},
                "USA, violence": { x: width5- 600, y: height5 - 160, color: "#BEE5AA", pc_freq: d3.sum(data.filter(d=>(d.cluster === "USA, violence")), d=>+d.frequency)/d3.sum(data, d=>d.frequency)},
                "USA, female": { x: width5- 900, y: height5 - 160, color: "#79BACE", pc_freq: d3.sum(data.filter(d=>(d.cluster === "USA, female")), d=>+d.frequency)/d3.sum(data, d=>d.frequency)},
                "USA, empowerment": { x: width5- 1200, y: height5 - 160, color: "lightblue", country: "United States", pc_freq: d3.sum(data.filter(d=>(d.cluster === "USA, empowerment")), d=>+d.frequency)/d3.sum(data, d=>d.frequency)},
    
                "UK, male": { x: width5- 300, y: height5 -320, color: "#93D1BA", pc_freq: d3.sum(data.filter(d=>(d.cluster === "UK, male")), d=>+d.frequency)/d3.sum(data, d=>d.frequency)},
                "UK, violence": { x: width5- 600, y: height5-320, color: "#BEE5AA", pc_freq: d3.sum(data.filter(d=>(d.cluster === "UK, violence")), d=>+d.frequency)/d3.sum(data, d=>d.frequency)},
                "UK, female": { x: width5- 900, y: height5-320, color: "#79BACE", pc_freq: d3.sum(data.filter(d=>(d.cluster === "UK, female")), d=>+d.frequency)/d3.sum(data, d=>d.frequency)},
                "UK, empowerment": { x: width5- 1200, y: height5-320, color: "lightblue", country: "United Kingdom", pc_freq: d3.sum(data.filter(d=>(d.cluster === "UK, empowerment")), d=>+d.frequency)/d3.sum(data, d=>d.frequency)},
    
                "India, male": { x: width5- 300, y: height5-480, color: "#93D1BA", theme: "Male Dominance", pc_freq: d3.sum(data.filter(d=>(d.cluster === "India, male")), d=>+d.frequency)/d3.sum(data, d=>d.frequency)},
                "India, violence": { x: width5- 600, y: height5-480, color: "#BEE5AA", theme: "Violence", pc_freq: d3.sum(data.filter(d=>(d.cluster === "India, violence")), d=>+d.frequency)/d3.sum(data, d=>d.frequency)},
                "India, female": { x: width5 - 900, y: height5-480, color: "#79BACE", theme: "Women Stereotypes", pc_freq: d3.sum(data.filter(d=>(d.cluster === "India, female")), d=>+d.frequency)/d3.sum(data, d=>d.frequency)},
                "India, empowerment": { x: width5- 1200, y: height5-480, color: "lightblue", theme: "Empowerment", country: "India", pc_freq: d3.sum(data.filter(d=>(d.cluster === "India, empowerment")), d=>+d.frequency)/d3.sum(data, d=>d.frequency)},
            }

            // console.log(Array(groups).map(d =>+d.pc_freq))
            console.log(groups['UK, empowerment'].pc_freq)


            cluster_padding = 5;    // Space between nodes in different stages
            padding = 2            // Space between nodes
            radius = 5

            // var clusterColors = d3.scaleOrdinal()
            //     .range(d3.schemeTableau10.reverse())
            //     .domain(data.map(d =>d.cluster))

            // clusterColors = d3.scaleSequentialQuantile(d3.interpolateLab("lightgrey", "#F52D4F"))
            //             .domain(data.map(d =>+d.frequency)) 
            
            // color intensity === the proportion of words from all headlines from a country that fall within a specific theme
            clusterColors = d3.scaleSequential(d3.interpolateLab("lightgrey", "#F52D4F"))
                        .domain([0.015, 0.14]) 

            extentWordFreq = d3.extent(data, d=>+d.perc_freq)
            // console.log(extentWordFreq)
            var bubbleRadius = d3.scaleSqrt()
                .domain(extentWordFreq)
                .range([2, 10])

            //unique cluster/group id's
            var cs = [];
            data.forEach(function(d){
                    if(!cs.includes(d.cluster)) {
                        cs.push(d.cluster);
                    }
            });
            console.log(cs)
            
            n = data.length, // total number of nodes
            m = cs.length; // number of distinct clusters

            clusters = new Array(m);
            nodes = [];

            for (var i = 0; i<n; i++){
                nodes.push(create_nodes(data,i));
            }
            console.log(nodes)
            // console.log(data)
            // console.log(groups[data[0].cluster].y + Math.random())

            var svg = wordClusters

            // Circle for each node.
            const circle = svg.append("g")
                .selectAll("circle")
                .data(nodes)
                .join("circle")
                .attr("cx", d => d.x)
                .attr("cy", d => d.y)
                .attr("fill", "lightgrey")
                .style('stroke', "#323232")
                .style('stroke-width', "0.1")
                // .attr("fill", d => clusterColors(d.theme))
                // .attr("fill", d => clusterColors(+d.frequency))
                .attr("fill", d => clusterColors(groups[d.clusterName].pc_freq))
                .on("mouseenter", (d) => {
                    tooltipCluster(d.text, d.frequency, d.theme, d.country, [d3.event.clientX, d3.event.clientY], groups[d.clusterName].pc_freq)
                })
                .on("mousemove", (d) => {
                    tooltipCluster(d.text, d.frequency, d.theme, d.country, [d3.event.clientX, d3.event.clientY], groups[d.clusterName].pc_freq)
                })
                .on("mouseleave", d => {
                    d3.select("#tooltipCluster").style("display", "none")
                });
                // .attr("fill", d => d.color);

            // Ease in the circles.
            circle
                .transition()
                // .delay((d, i) => i * 5)
                .duration(800)
                .attrTween("r", d => {
                    const i = d3.interpolate(0, d.radius);
                    return t => d.radius = i(t);
                });

            // Group name labels
            svg.selectAll('.cluster')
            .data(d3.keys(groups))
            .join("text")
            .attr("class", "themesText")
            .attr("text-anchor", "middle")
            .attr("x", d => groups[d].x)
            .attr("y", d => groups[d].y - 50)
            .text(d => groups[d].theme);

            // Country labels
            svg.selectAll('.cluster')
            .data(d3.keys(groups))
            .join("text")
            .attr("class", "themesText")
            .attr("text-anchor", "middle")
            .attr("x", d => groups[d].x - 150)
            .attr("y", d => groups[d].y)
            .text(d => groups[d].country);

            // // Group counts
            // svg.selectAll('.grpcnt')
            // .data(d3.keys(groups))
            // .join("text")
            // .attr("class", "grpcnt")
            // .attr("text-anchor", "middle")
            // .attr("x", d => groups[d].x)
            // .attr("y", d => groups[d].y - 50)
            // .text(d => groups[d].cnt);

            // legend

            // legend = d3.select("#legendDiv")
            //             // .append("svg")
            //             .attr("width", "300")
            //             .attr("heigh", "300")

            legendData = [{level: "Word is less frequent", radius: 3, y: height5+70, x: width5/2.1, anchor:"end"}, 
                          {level: "", radius: 5, y: height5+70, x: width5/2.06}, 
                          {level: "Word is more frequent", radius: 10, y: height5+70, x: width5/2, anchor:"start"}]
            // legendData = [{level: "Word is less frequent", radius: 3, y: 20, x: 1000, anchor:"end"}, 
            //               {level: "", radius: 5, y: height5+70, x: width5/2.06}, 
            //               {level: "Word is more frequent", radius: 10, y: 20, x: 200, anchor:"start"}]
            // clusters composed of more bubbles indicate more words used for a specific category

            legend = svg.append("g")
            // legend.append("g")
                .selectAll("circle")
                .data(legendData)
                .join('circle')
                .attr("cx", d => d.x)
                .attr("cy", d => d.y)
                .attr("r", d => d.radius)
                .attr("fill","lightgrey")
            
            textLegend = svg.append("g")
            // textLegend = legend.append("g")
                .selectAll("text")
                .data(legendData)
                .join("text")
                .text(d=>d.level)
                .attr("x", d => d.x)
                .attr("y", d => d.y+35)
                .attr("class", "themesText")
                .style("text-anchor", d=>d.anchor)
                .attr("fill","lightgrey")

            // Forces
            const simulation = d3.forceSimulation(nodes)
            .force("x", d => d3.forceX(d.x))
            .force("y", d => d3.forceY(d.y))
            .force("cluster", forceCluster())
            .force("collide", forceCollide())
            .alpha(.09)
            .alphaDecay(0.2);

            // Adjust position (and color) of circles.
            simulation.on("tick", () => {
            circle
                .attr("cx", d => d.x)
                .attr("cy", d => d.y);
                // .attr("fill", d => groups[d.group].color);
            });
          
            // invalidation.then(() => simulation.stop());

 
            function create_nodes(data,node_counter) {
                var i = cs.indexOf(data[node_counter].cluster),
                    r = Math.sqrt((i + 1) / m * -Math.log(Math.random())) * maxRadius,
                    d = {
                        cluster: i,
                        clusterName: data[node_counter].cluster,
                        radius: bubbleRadius(data[node_counter].perc_freq),
                        country: data[node_counter].country,
                        theme: data[node_counter].theme,
                        text: data[node_counter].word,
                        frequency: data[node_counter].frequency,
                        x: groups[data[node_counter].cluster].x + Math.random(),
                        y: groups[data[node_counter].cluster].y + Math.random(),
                        // x: Math.cos(i / m * 2 * Math.PI) * 200 + width5 / 2 + Math.random(),
                        // y: Math.sin(i / m * 2 * Math.PI) * 200 + height5 / 2 + Math.random()
                    };
                if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d;
                return d;
            };

    
            // Force to increment nodes to groups.
            function forceCluster() {
                const strength = .01;
                let nodes;
            
                function force(alpha) {
                const l = alpha * strength;
                for (const d of nodes) {
                    d.vx -= (d.x - groups[d.clusterName].x) * l;
                    d.vy -= (d.y - groups[d.clusterName].y) * l;
                }
                }
                force.initialize = _ => nodes = _;
            
                return force;
            }
            // Force for collision detection.
            function forceCollide() {
                const alpha = 0.2; // fixed for greater rigidity!
                const padding1 = padding; // separation between same-color nodes
                const padding2 = cluster_padding; // separation between different-color nodes
                let nodes;
                let maxRadius;
            
                function force() {
                const quadtree = d3.quadtree(nodes, d => d.x, d => d.y);
                for (const d of nodes) {
                    const r = d.radius + maxRadius;
                    const nx1 = d.x - r, ny1 = d.y - r;
                    const nx2 = d.x + r, ny2 = d.y + r;
                    
                    quadtree.visit((q, x1, y1, x2, y2) => {
                    if (!q.length) do {
                        if (q.data !== d) {
                        const r = d.radius + q.data.radius + (d.clusterName === q.data.clusterName ? padding1 : padding2);
                        let x = d.x - q.data.x, y = d.y - q.data.y, l = Math.hypot(x, y);
                        if (l < r) {
                            l = (l - r) / l * alpha;
                            d.x -= x *= l, d.y -= y *= l;
                            q.data.x += x, q.data.y += y;
                        }
                        }
                    } while (q = q.next);
                    return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
                    });
                }
                }
            
                force.initialize = _ => maxRadius = d3.max(nodes = _, d => d.r) + Math.max(padding1, padding2);
            
                return force;
            }

            // Move d to be adjacent to the cluster node.
            function clusterOld(alpha) {
                return function (d) {
                    var cluster = clusters[d.cluster];
                    if (cluster === d) return;
                    var x = d.x - cluster.x,
                        y = d.y - cluster.y,
                        l = Math.sqrt(x * x + y * y),
                        r = d.radius + cluster.radius;
                    if (l != r) {
                        l = (l - r) / l * alpha;
                        d.x -= x *= l;
                        d.y -= y *= l;
                        cluster.x += x;
                        cluster.y += y;
                    }
                };
            }

        }
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
            .on('mouseover.fade', fade(0.05))
            .on('mouseout.fade', fade(1));
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
                circle.style('opacity', function (o) { return isConnected(d, o) ?d=>nodeOpacity(d.perc_freq): opacity });
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
            return linkedByIndex[`${a.index},${b.index}`] || linkedByIndex[`${b.index},${a.index}`] || a.index === b.index;
            }
        
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
            .attr("fill", d=>d.theme === "female"?"pink":
                            d.theme === "male"?"blue":
                            d.theme === "empowerment"?"#ccad34":
                            d.theme === "violence"?"red":
                            d.theme === "politics"?"green":
                            d.theme === "race"?"#964B00":
                            "#aaa")
        
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


        