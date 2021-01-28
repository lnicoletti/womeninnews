    // constants for charts
    let width5 = 1500;
    let height5 = 540;

    let heightCluster =  height5*3

    // constants for clusterchart
    padding = 1.5, // separation between same-color nodes
    clusterPadding = 6, // separation between different-color nodes
    maxRadius = 12;
    
    // create constants for bubble chart and cluster chart
    let bubbleChart = d3.select("div#chart").select("#bubblechart")
                    .attr("preserveAspectRatio", "xMinYMin meet")
                    .attr("viewBox", "0 0 "+ width5 +"," + height5+"")
                    .classed("svg-content", true);

    let wordClusters = d3.select("div#clusterChart").select("#bubbleClusters")
                    .attr("preserveAspectRatio", "xMinYMin meet")
                    .attr("viewBox", "0 0 "+ width5 +"," + heightCluster+"")
                    .classed("svg-content", true);

    // create constant for tooltip of first chart and define attributes
    let tooltipHeadline = d3.select("#tooltipHeadline")
    tooltipHeadline.attr("height",height5/4)
    tooltipHeadline.attr("width", width5/5)

    // create dataset to for logos of the first chart
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

    // Load data and run functions to render charts
    Promise.all([
        d3.csv("../hosted_data/headlines_site.csv"),
        d3.csv("../hosted_data/countries_clusters.csv"),
        d3.csv("../hosted_data/headlines_cl_sent_pol.csv"),
        d3.csv("../hosted_data/countries_freq.csv"),
        d3.json("../hosted_data/word_connections_UK.json"),
        d3.json("../hosted_data/word_connections_USA.json"),
        d3.json("../hosted_data/word_connections_IN.json"),
        d3.json("../hosted_data/word_connections_SA.json"),
      ])
        .then((datasets) => {
            // define each dataset
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
            // render second and third chart on scroll (to avoid overloading at the beginning)
            var fired = 0;
            $(window).scroll(function(){
                // detect if the element is scrolled into view
                function elementScrolled(elem)
                {
                  var docViewTop = $(window).scrollTop();
                  var docViewBottom = docViewTop + $(window).height();
                  var elemTop = $(elem).offset().top;
                  return ((elemTop <= docViewBottom) && (elemTop >= docViewTop));
                }
                // detect if "#clusterChart" is scrolled into view, and when it is run the remaining functions to render charts
                if(elementScrolled('#clusterChart')&&(fired == 0)) {
                // draw the second chart
                drawWordClusters(countriesCls)
                // draw the networks and bars of the final chart
                drawNetwork(UK_data, "div#my_network", "United Kingdom", "#chart1", "chart1")
                drawBars(countries_data, "#chart1", "UK", 20, "United Kingdom", "chart1")  
                drawNetwork(USA_data, "div#my_network2", "United States", "#chart2", "chart2")  
                drawBars(countries_data, "#chart2", "USA", 20, "United States", "chart2")   
                drawNetwork(IN_data, "div#my_network3", "India", "#chart3", "chart3") 
                drawBars(countries_data, "div#chart3", "India", 20, "India", "chart3")   
                drawNetwork(SA_data, "div#my_network4", "South Africa", "#chart4", "chart4") 
                drawBars(countries_data, "#chart4", "South Africa", 20, "South Africa", "chart4")
                fired = 1;
                }   

              });

        })

        // tooltip function for the first chart
        function showTooltipHeadline(ttip, text1, text2, text3, coords, data, polarity, c) {
            // set position of tooltip
            let x = coords[0]-120;
            let y = coords[1]-200;

            console.log(c)
            console.log(data)
            // remove previous text: 
            tooltipHeadline.selectAll("#tooltipText").remove()
            // create box
            tooltipHeadline
                .style("display", "block")
                .style("visibility", "visible")
                .style("top", y + "px")
                .style("left", x + "px")
                .style("border", "solid 1px #ccc")

            // remove hoverGuide
            d3.select("#hoverGuide").remove()
            d3.select("#hoverGuideLine").remove()

            // filter data depending on where the user is along x-scale
            data = c.bias>0.5?data.filter(d=>(d.site === text1)&(d.bias > 0.5)):
                     data.filter(d=>(d.site === text1)&(d.bias < 0.5))

            console.log(data)

            // find a random headline
            randHeadline = Math.floor(Math.random() * data.length)
            console.log(data[randHeadline].headline_no_site)
            console.log(data[randHeadline].subtitle)

            // tooltip dimensions
            let ttipMargin = { left: 40, bottom: 110, right: 20, top: 20 }
            let ttipWidth = width5/7 - ttipMargin.left - ttipMargin.right;
            let ttipHeight =height5/2.5 - ttipMargin.top - ttipMargin.bottom;
    
            // below we define the tooltip appearance and contents
            tooltipHeadline.append("text")
                .attr("id", "tooltipText")
                .attr("y", ttipHeight/4)
                .attr("x", 0)
                .attr("font-weight", "bold")
                .attr("font-size", "12px")
                // .attr("fill", party==="red" ? '#DD1F26':'#0076C0')
                .attr("fill", "rgb(230, 230, 230)")
                .html("<b>" + '"' + data[randHeadline].headline_no_site + '"')
                .call(wrap, 300)
    
            tooltipHeadline.append("text")
                .attr("id", "tooltipText")
                .attr("y", ttipHeight/1.5)
                .attr("x", 0)
                .attr("font-size", "11px")
                // .attr("font-weight", "bold")
                .attr("fill", "rgb(196, 195, 195)")
                .html('"' + data[randHeadline].subtitle + '..."')
                .call(wrap, 300)

            tooltipHeadline.append("text")
                .attr("id", "tooltipText")
                .attr("y", ttipHeight*1.5)
                .attr("x", 0)
                .attr("font-size", "12px")
                .attr("font-weight", "bold")
                .attr("fill", "rgb(230, 230, 230)")
                .html(data[randHeadline].site)
                .call(wrap, 300)
        }

        // function to draw the first chart
        function drawBubbleChart(data) {
            
            ttip = "bias"

            // set dimensions
            let margin5 = {left: 30, bottom: 20, right: 30, top: 110}
            let bodywidth5 = width5 - margin5.left - margin5.right;
            let bodyheight5 = height5 - margin5.top - margin5.bottom;
            
            // filter data, removing irrelevant news outlets
            filterData = data.filter(d=>(+d.monthly_visits !== 0)&(+d.bias !== 0))
            filterData = filterData.filter(d=>(d.site !== "msn.com")&(d.site !== "sports.yahoo.com")&
                                              (d.site !== "finance.yahoo.com")&(d.site !== "news.google.com")&
                                              (d.site !== "news.yahoo.com")&(d.site !== "bbc.com"))

            // create chart horizontal scale
            var xScale = d3.scaleLinear()
                    .range([margin5.left+margin5.right, bodywidth5])
                    .domain([0, d3.max(filterData, d => +d.bias)])

            // create radial scale for bubble size
            extentvisits = d3.extent(filterData, d=>+d.monthly_visits)
            console.log(extentvisits)
            console.log(d3.extent(filterData, d=>+d.polarity))

            var radius = d3.scaleSqrt()
                                .domain(extentvisits)
                                .range([3, 60])

            // create linear scale for logo size
            var logoScale = d3.scaleLinear()
                                .domain(extentvisits)
                                .range([18, 100])

            console.log(filterData)

            // initialize the force simulation layout
            let simulation = d3.forceSimulation()
                        .nodes(filterData)
                        .force('charge', d3.forceManyBody().strength(1))
                        .force('x', d3.forceX().x(function(d) {
                            return xScale(+d.bias);
                        }))
                        .force("y", d3.forceY(bodyheight5/1.5).strength(0.05))
                        .force('collide', d3.forceCollide((d)=>{ 
                            return radius(+d.monthly_visits)}))
                        .on('tick', function() {
            
                        // function for collision detection
                        for ( i = 0; i < filterData.length; i++ ) {
                            var node = filterData[i];
                            node.cx = node.x;
                            node.cy = node.y;
                        }
                        
                        // define circles elements
                        circles = bubbleChart.select(".body")
                                        .selectAll('circle')
                                        .data(filterData);

                        // define logos elements
                        logos = bubbleChart.select(".body")
                                        .selectAll('image')
                                        .data(filterData);
                
                        // append the circles and define style properties and hover events (tooltip)
                        newCircles = circles.enter()
                            .append('circle')
                            .attr("class", "forceCircles")
                            .attr("fill", "white")
                            .attr("opacity", "0.8")
                            .style('stroke', "#161616")
                            .attr('r', d=>radius(+d.monthly_visits))
                            .on("mouseenter", (d) => {
                                showTooltipHeadline(ttip, d.site, d.country_of_pub, d.monthly_visits, [d3.event.clientX, d3.event.clientY], headlines, d.polarity, d)
                            })
                            .on("mousemove", (d) => {
                                showTooltipHeadline(ttip, d.site, d.country_of_pub, d.monthly_visits,  [d3.event.clientX, d3.event.clientY], headlines, d.polarity, d)
                            })
                            .on("mouseleave", (d) => {
                                d3.select("#tooltipHeadline").style("display", "none")
                            })
                            .on("mouseover.color", function() { d3.select(this).style("stroke", "white"); })
                            .on("mouseleave.color", function() { d3.select(this).style("stroke", "#323232"); })
                            
                        // append the logos and define style properties and hover events (tooltip)
                        newLogos = logos.enter()
                                .append("svg:image")
                                .attr("class", "forceLogo")
                                // each logo needs to be centered in the bubble (couldnt find better way of doing this)
                                .attr("transform", d=>d.site=="bbc.co.uk" ? "translate(-50,-50)"
                                                    : d.site=="cnn.com" | d.site=="foxnews.com" ? "translate(-30,-30)"
                                                    : d.site=="espn.go.com" ? "translate(-34,-10)"
                                                    : d.site=="nytimes.com" | d.site=="buzzfeed.com" ? "translate(-25,-25)"
                                                    : d.site=="washingtonpost.com" | d.site=="huffingtonpost.com" | d.site== "usatoday.com" ? "translate(-20,-20)"
                                                    : d.site=="dailymail.co.uk" ? "translate(-22,-18)"
                                                    : d.site=="politico.com" | d.site=="ksl.com" | d.site=="abcnews.go.com" | d.site=="nydailynews.com" ? "translate(-12.5,-12.5)"
                                                    : d.site=="telegraph.co.uk" ? "translate(-15,-3)"
                                                    : d.site=="breitbart.com" ? "translate(-14,-10)"
                                                    : "translate(-15,-15)")
                                .attr('width', d=>logoScale(+d.monthly_visits))
                                .attr("xlink:href", d=>+d.monthly_visits>150000000 ? logoData.filter(x=>x.site==d.site)[0]["link"]:'')
                                .on("mouseenter", (d) => {
                                    showTooltipHeadline(ttip, d.site, d.country_of_pub, d.monthly_visits, [d3.event.clientX, d3.event.clientY], headlines, d.polarity, d)
                                })
                                .on("mousemove", (d) => {
                                    showTooltipHeadline(ttip, d.site, d.country_of_pub, d.monthly_visits,  [d3.event.clientX, d3.event.clientY], headlines, d.polarity, d)
                                })
                                .on("mouseleave", (d) => {
                                    d3.select("#tooltipHeadline").style("display", "none")
                                })

                        // show the circles
                        circles.merge(newCircles)
                            .attr('cx', function(d) {
                                return d.x;
                            })
                            .attr('cy', function(d) {
                                return d.y;
                            })

                        // show the logos
                        logos.merge(newLogos)
                            .attr('x', function(d) {
                                return d.x;
                            })
                            .attr('y', function(d) {
                                return d.y;
                            })
                        
                        // this is not used now, but if we want to add a transition it is set up
                        circles.exit().remove();
                });
                
        // add text and line to prompt the user to hover on the bubbles
        bubbleChart.append("text")
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
        bubbleChart.append("line")
            .attr("y1", bodyheight5/3.2)
            .attr("x1",bodywidth5/1.3)
            .attr("x2", xScale(wp))
            .attr("y2", bodyheight5/1.85)
            .attr("stroke-width", 1)
            .attr("id", "hoverGuideLine")
            .attr("stroke", 'silver')

        // label the x axis
        bubbleChart.append("text")
                .attr("id", "xAxisLabel")
                // .attr("transform", "rotate(-90)")
                .attr("y", bodyheight5*1.08)
                .attr("x",margin5.left+margin5.right)
                .attr("dy", "1em")
                .attr("font-size", "17px")
                .style("text-anchor", "start")
                .style("fill", "silver")
                .text("← Less Biased Language")
                .style("font-weight", "bold")  
                .style("font-family", "sans-serif")
    
        bubbleChart.append("text")
                .attr("id", "xAxisLabel")
                // .attr("transform", "rotate(-90)")
                .attr("y", bodyheight5*1.08)
                .attr("x",bodywidth5)
                .attr("dy", "1em")
                .attr("font-size", "17px")
                .style("text-anchor", "end")
                .style("fill", "silver")
                .text("More Biased Language →")
                .style("font-weight", "bold")  
                .style("font-family", "sans-serif")

        // create the dataset for the bubble legend
        legendData = [{level: "", radius: radius(10000000), y: bodyheight5+70, x: bodywidth5/2.2, anchor:"end", xtext: bodywidth5/2.235, ytext: bodyheight5+53,id: ""}, 
        {level: "", radius: radius(100000000), y: bodyheight5+70, x: bodywidth5/2.1,id: ""}, 
        {level: "1B Monthly Viewers", radius: radius(1000000000), y: bodyheight5+70, x: bodywidth5/1.9, anchor:"middle", xtext: bodywidth5/1.9, ytext: bodyheight5+41,id: ""},
        {level: "?", radius: radius(30000000), y: bodyheight5*1.08+11, x: bodywidth5+15, anchor:"middle", xtext: bodywidth5+15, ytext: bodyheight5*1.08+16,id: "info"}]

        // make the bubble legend and initialize the tooltip for methodology info if they hover on the "#info" circle
        legend = bubbleChart.append("g")
                .selectAll("circle")
                .data(legendData)
                .join('circle')
                .attr("cx", d => d.x)
                .attr("cy", d => d.y)
                .attr("r", d => d.radius)
                .attr("fill","#161616")
                .attr("stroke","lightgrey")
                .on("mouseover", d=>d.id==="info" ? tooltipInfo(d3.event.clientX-150, d3.event.clientY-420):"")
                .on("mouseleave", d=>d3.select("#tooltipInfo").style("visibility", "hidden"))
            
        textLegend = bubbleChart.append("g")
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
                .attr("id", "info") 
                .call(wrap, 10)
                .on("mouseover", d=>d.id==="info" ? tooltipInfo(d3.event.clientX-150, d3.event.clientY-420):"")
                .on("mouseleave", d=>d3.select("#tooltipInfo").style("visibility", "hidden"))

        // UPDATE INTERACTION ON BUTTON CLICK
        d3.selectAll("button").on("click", function() {
            // Remove X-Axis
            d3.select("#bubblechart").selectAll("#xAxisLabel").remove()
            let metric = d3.select(this).property("value")
            
            // Update metric data on click (from bias to polarity)
            if (metric === "polarity") {

                bubbleChart.append("text")
                        .attr("id", "xAxisLabel")
                        // .attr("transform", "rotate(-90)")
                        .attr("y", bodyheight5*1.08)
                        .attr("x",margin5.left+margin5.right)
                        .attr("dy", "1em")
                        .attr("font-size", "17px")
                        .style("text-anchor", "start")
                        .style("fill", "silver")
                        .text("← Less Polarizing Language")
                        .style("font-weight", "bold")  
                        .style("font-family", "sans-serif")
            
                bubbleChart.append("text")
                        .attr("id", "xAxisLabel")
                        // .attr("transform", "rotate(-90)")
                        .attr("y", bodyheight5*1.08)
                        .attr("x",bodywidth5)
                        .attr("dy", "1em")
                        .attr("font-size", "17px")
                        .style("text-anchor", "end")
                        .style("fill", "silver")
                        .text("More Polarizing Language →")
                        .style("font-weight", "bold")  
                        .style("font-family", "sans-serif")
                
                // restart simulation
                simulation
                .alpha(1)
                    .restart();

                simulation
                        .force('x', d3.forceX().x(function(d) {
                            return xScale(+d.polarity);
                        }))
                        .force("y", d3.forceY(bodyheight5/1.5).strength(0.05))
                        .force('collide', d3.forceCollide((d)=>{ 
                            return radius(+d.monthly_visits)}).strength(1))
                    
                circles
                    .attr('cx', function(d) {
                        return d.x;
                    })
                    .attr('cy', function(d) {
                        return d.y;
                    })
                    .on("mouseenter", (d) => {
                        showTooltipHeadline(ttip, d.site, d.country_of_pub, d.monthly_visits, [d3.event.clientX, d3.event.clientY], headlines, d.polarity, d)
                    })
                    .on("mousemove", (d) => {
                        showTooltipHeadline(ttip, d.site, d.country_of_pub, d.monthly_visits,  [d3.event.clientX, d3.event.clientY], headlines, d.polarity, d)
                    })
                    .on("mouseleave", (d) => {
                        d3.select("#tooltipHeadline").style("display", "none")
                    })
                    .on("mouseover.color", function() { d3.select(this).style("stroke", "white"); })
                    .on("mouseleave.color", function() { d3.select(this).style("stroke", "#323232"); })

            // Update metric data on click (back from polarity to bias)
            } else {
                bubbleChart.append("text")
                        .attr("id", "xAxisLabel")
                        // .attr("transform", "rotate(-90)")
                        .attr("y", bodyheight5*1.08)
                        .attr("x",margin5.left+margin5.right)
                        .attr("dy", "1em")
                        .attr("font-size", "17px")
                        .style("text-anchor", "start")
                        .style("fill", "silver")
                        .text("← Less Biased Language")
                        .style("font-weight", "bold")  
                        .style("font-family", "sans-serif")
            
                bubbleChart.append("text")
                        .attr("id", "xAxisLabel")
                        // .attr("transform", "rotate(-90)")
                        .attr("y", bodyheight5*1.08)
                        .attr("x",bodywidth5)
                        .attr("dy", "1em")
                        .attr("font-size", "17px")
                        .style("text-anchor", "end")
                        .style("fill", "silver")
                        .text("More Biased Language →")
                        .style("font-weight", "bold")  
                        .style("font-family", "sans-serif")
                // reheat the simulation:
                simulation
                    .alpha(1)
                    .restart();

                simulation
                        .force('x', d3.forceX().x(function(d) {
                            return xScale(+d.bias);
                        }))
                        .force("y", d3.forceY(bodyheight5/1.5).strength(0.05))
                        .force('collide', d3.forceCollide((d)=>{ 
                            return radius(+d.monthly_visits)}).strength(1))

                circles
                    .attr('cx', function(d) {
                        return d.x;
                    })
                    .attr('cy', function(d) {
                        return d.y;
                    })
                    .on("mouseenter", (d) => {
                        showTooltipHeadline(ttip, d.site, d.country_of_pub, d.monthly_visits, [d3.event.clientX, d3.event.clientY], headlines, d.polarity, d)
                    })
                    .on("mousemove", (d) => {
                        showTooltipHeadline(ttip, d.site, d.country_of_pub, d.monthly_visits,  [d3.event.clientX, d3.event.clientY], headlines, d.polarity, d)
                    })
                    .on("mouseleave", (d) => {
                        d3.select("#tooltipHeadline").style("display", "none")
                    })
                    .on("mouseover.color", function() { d3.select(this).style("stroke", "white"); })
                    .on("mouseleave.color", function() { d3.select(this).style("stroke", "#323232"); })
                    }
                })

        }

        // tooltip function for the second chart
        function tooltipCluster(word, freq, theme, country, coords, pc_freq) {
            console.log(word)
            d3.select("#tooltipCluster")
                .style("display", "block")
                .style("top", (coords[1]+10) + "px")
                .style("left", (coords[0]+10) + "px")
                .style('font', '14px sans-serif')
                .style('background-color', clusterColors(pc_freq))
                .attr('stroke', '#ccc')
                .html("<b>" + word + "<br/> </b> Used <b>" + freq + "</b> times in " + "<b>" + country + "</b> headlines")
        }
        // info (bottom right methodology info) tooltip function for the first chart
        function tooltipInfo(width, height) {
            console.log("working")
            info = d3.select("#tooltipInfo")
                .style("display", "block")
                .style("visibility", "visible")
                .style("top", height + "px")
                .style("left", width + "px")
                .style("border", "solid 1px #ccc")
                .style('font', '10px sans-serif')
                .attr('stroke', '#ccc')
                .html("We measure <b> gender bias </b> by tracking the combined occurrence of gendered language and social stereotypes usually associated with women. We do this in two steps: <br> <br> 1) We check if a headline contains gendered language (i.e. 'spokeswoman', 'chairwoman', 'she', 'her', 'bride', 'daughter', 'daughters', 'female', 'fiancee', 'girl', 'girlfriend' etc.) <br> <br> 2) If it contains gendered language, we then count the number of words that are considered to be social stereotypes about women (i.e. 'weak', 'modest', 'virgin', 'slut', 'whore', 'sexy', 'feminine', 'sensitive', 'emotional', 'gentle', 'soft', 'pretty', 'bitch', 'sexual' etc.).<br><br> Finally, we normalize this count for all headlines within each outlet as a score between 0 and 1, and we aggregate (i.e. average) this score for each outlet. <br><br> We measure <b>polarity</b> by performing sentiment analysis on each headline using the Vader python package, where each headline gets a sentiment score from -1 to 1 (from more negative to more positive). Because we are interested in polarity, we take the absolute value of each headline's score.")
        }
        // function to draw the second chart
        function drawWordClusters(data) {

            // create reference dataset for each cluster
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

            // constants for cluster attributes
            cluster_padding = 5;    // Space between nodes in different stages
            padding = 2            // Space between nodes
            radius = 5

            // create color scale for prevalence of clusters
            clusterColors = d3.scaleSequential(d3.interpolateLab("lightgrey", "#F52D4F"))
                        .domain([0.015, 0.14]) 

            // create radial scale for size of bubbles
            extentWordFreq = d3.extent(data, d=>+d.perc_freq)
            var bubbleRadius = d3.scaleSqrt()
                .domain(extentWordFreq)
                .range([2, 10])

            //store unique cluster IDs
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

            // create nodes for simulation
            for (var i = 0; i<n; i++){
                nodes.push(create_nodes(data,i));
            }
            console.log(nodes)

            // select html element, add circles to chart, and define hover event (tooltip showing word frequency)
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

            // Ease in the circles from the middle of each cluster
            circle
                .transition()
                // .delay((d, i) => i * 5)
                .duration(800)
                .attrTween("r", d => {
                    const i = d3.interpolate(0, d.radius);
                    return t => d.radius = i(t);
                });

            // add theme name labels to chart
            svg.selectAll('.cluster')
                .data(d3.keys(groups))
                .join("text")
                .attr("class", "themesText")
                .attr("text-anchor", "middle")
                .attr("x", d => groups[d].x)
                .attr("y", d => groups[d].y - 50)
                .text(d => groups[d].theme);

            // add country labels to chart
            svg.selectAll('.cluster')
                .data(d3.keys(groups))
                .join("text")
                .attr("class", "themesText")
                .attr("text-anchor", "middle")
                .attr("x", d => groups[d].x - 150)
                .attr("y", d => groups[d].y)
                .text(d => groups[d].country);

            // create data for the legend
            legendData = [{level: "Word is less frequent", radius: 3, y: height5+70, x: width5/2.1, anchor:"end"}, 
                          {level: "", radius: 5, y: height5+70, x: width5/2.06}, 
                          {level: "Word is more frequent", radius: 10, y: height5+70, x: width5/2, anchor:"start"}]

            // draw legend for bubble size
            legend = svg.append("g")
                .selectAll("circle")
                .data(legendData)
                .join('circle')
                .attr("cx", d => d.x)
                .attr("cy", d => d.y)
                .attr("r", d => d.radius)
                .attr("fill","#161616")
                .attr("stroke","lightgrey")
            
            textLegend = svg.append("g")
                .selectAll("text")
                .data(legendData)
                .join("text")
                .text(d=>d.level)
                .attr("x", d => d.x)
                .attr("y", d => d.y+35)
                .attr("class", "themesText")
                .style("text-anchor", d=>d.anchor)
                .attr("fill","lightgrey")
                .call(wrap, 100)

            // initialize the simulation forces
            const simulation = d3.forceSimulation(nodes)
                .force("x", d => d3.forceX(d.x))
                .force("y", d => d3.forceY(d.y))
                .force("cluster", forceCluster())
                .force("collide", forceCollide())
                .alpha(.09)
                .alphaDecay(0.2);

            // run the simulation to render the chart
            simulation.on("tick", () => {
            circle
                .attr("cx", d => d.x)
                .attr("cy", d => d.y);
            });
          
            // invalidation.then(() => simulation.stop());

            // define function to create the nodes
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
                    };
                if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d;
                return d;
            };

    
            // define cluster force to make sure each node sticks to their own group
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
            // define force for collision detection (bubbles shouldn't overlap)
            function forceCollide() {
                const alpha = 0.2;
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
        }
        // function to draw the bar legend in the text leading to the final visualization
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
        // function to draw the networks in the final visualization
        function drawNetwork(data, network, country, bars, svgID) {
            // set the dimensions of each graph
            var margin = {top: 10, right: 30, bottom: 30, left: 30},
            width5 = 1500;
            // country networks
            width = width5/2 - margin.left - margin.right,
            height = 700 - margin.top - margin.bottom;

            // create the svg object for each network
            var svg = d3.select(network)
                .append("svg")
                .attr("preserveAspectRatio", "xMinYMin meet")
                .attr("viewBox", "0 0 "+ width +"," + height+"")
            
            // create objects for nodes and links
            const links = data.links.map(d => Object.create(d))
            const nodes = data.nodes.map(d => Object.create(d))
        
            console.log(data)
        
            // define scales
            extentWordFreq = d3.extent(nodes, d=>d.perc_freq)
                        console.log(extentWordFreq)
            
            // scale for node size
            var bubbleRadius = d3.scaleSqrt()
                            .domain(extentWordFreq)
                            // big net
                            // .range([1, 25])
                            .range([0.1, 4])
            
            extentLinkWeight = d3.extent(links, d=>d.weight)
                    console.log(extentLinkWeight)
            // scale for link thickness
            var linkWeight = d3.scaleLinear()
                            .domain(extentLinkWeight)
                            .range([0.00005, 4])
            // scale for link opacity
            var linkOpacity = d3.scaleLinear()
                            .domain(extentLinkWeight)
                            .range([0.05, 1])
            // scale for node opacity
            var nodeOpacity = d3.scaleLinear()
                            .domain(extentWordFreq)
                            .range([0.2, 1])
            // scale for text opacity
            var textOpacity = d3.scaleLinear()
                            .domain(extentWordFreq)
                            .range([0.4, 1])
            // scale for font size of text      
            var fontScale = d3.scaleLinear()
                            .domain(extentWordFreq)
                            .range([1, 20])
            
            // initizilize the simulation and the different forces we need
            simulation = d3.forceSimulation(nodes)
                .force("link", d3.forceLink()                               // This force provides links between nodes
                        .id(function(d) { return d.id; })
                        .links(links)  
                )
                .force("charge", d3.forceManyBody().strength(-30))         // This adds repulsion between nodes
                .force("center", d3.forceCenter(width / 2, height / 2))    // This force attracts nodes to the center of the svg area
                .force("x", d3.forceX())
                .force("y", d3.forceY())
                .on("end", ticked);
            
            // draw paths for each link, and color them by theme
            var link = svg
                .selectAll("line")
                .data(links)
                .join("path")
                .attr("fill", "none")
                .style("stroke-width", d=>linkWeight(d.weight))
                .style("opacity", d=>linkOpacity(d.weight))
                .style("stroke", d=>d.theme === "female_bias"?"pink":
                                    d.theme === "male_bias"?"turquoise":
                                    d.theme === "empowerment"?"#ccad34":
                                    d.theme === "violence"?"red":
                                    d.theme === "politics"?"green":
                                    d.theme === "race"?"#964B00":
                                    "#aaa")
            
            // initialize the node elements 
            var node = svg
                .selectAll("circle")
                .data(nodes.filter( d => (d.perc_freq >= 60) ))

            // draw the circles at the place of each node, and define the hover event (fade function that highlights connected words and links)
            circle = node.join("circle")
                // .attr("r", d=>bubbleRadius(d.perc_freq))
                // We decided to not show the nodes (makes the networks more readable) so radius is 0
                .attr("r", 0)
                .attr("opacity", d=>nodeOpacity(d.perc_freq))
                .style("fill", d=>d.theme === "female_bias"?"pink":
                                    d.theme === "male_bias"?"turquoise":
                                    d.theme === "empowerment"?"#ccad34":
                                    d.theme === "violence"?"red":
                                    d.theme === "politics"?"green":
                                    d.theme === "race"?"#964B00":
                                    "#9b9b9b")
                .on('mouseover.fade', fade(0.1))
                .on('mouseout.fade', fade(1));
            
            // add a the word label to each node and color them by theme, define hover event (same as above)
            var text = svg
                .selectAll("text")
                .data(nodes.filter(d => (d.perc_freq >= 150)))
                .join("text")
                .text(d=>d.id)
                .style("fill", d=>d.theme === "female_bias"?"pink":
                                    d.theme === "male_bias"?"turquoise":
                                    d.theme === "empowerment"?"#ccad34":
                                    d.theme === "violence"?"red":
                                    d.theme === "politics"?"green":
                                    d.theme === "race"?"#964B00":
                                    "#9b9b9b")
                .attr("font-size", d=>fontScale(d.perc_freq))
                .attr("font-weight", "900")
                .attr("opacity", d=>textOpacity(d.perc_freq))
                .attr("class", 'nodeText')
                .on('mouseover.fade', fade(0.05))
                .on('mouseover.bar', d=>barInteract(d))
                .on('mouseout.bar', function(d) {
                d3.select(bars).selectAll(".barLabs").remove()
                d3.select(bars).selectAll('rect').attr("opacity", "1")})
                .on('mouseout.fade', fade(1))
            
            // run the force simulation to draw the networks
            function ticked() {
                link
                // .attr("d", positionLink);
                // use the linkArc function to draw curved links
                .attr("d", linkArc);
                // otherwise we use the attrs below (for straight links)
                // .attr("x1", function(d) { return d.source.x; })
                // .attr("y1", function(d) { return d.source.y; })
                // .attr("x2", function(d) { return d.target.x; })
                // .attr("y2", function(d) { return d.target.y; });
                circle
                    .attr("cx", function (d) { return d.x; })
                    .attr("cy", function(d) { return d.y; });
                text
                    .attr("x", function (d) { return d.x+5; })
                    .attr("y", function(d) { return d.y; })    
            }
            
            // below are functions for the network hover events (fade function that highlights connected words and links)
            // the following two functions (fade and isConnected) were adapted from https://observablehq.com/@danielbustillos/network-of-stack-overflow-tags
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
            // create a dataset containing all the connections between each node using the index
            const linkedByIndex = {};
                links.forEach(d => {
                linkedByIndex[`${d.source.index},${d.target.index}`] = 1;
                });

            // function to check whether two nodes are connected
            function isConnected(a, b) {
                return linkedByIndex[`${a.index},${b.index}`] || linkedByIndex[`${b.index},${a.index}`] || a.index === b.index;
                }
            
            // function to create interaction link between bar charts on the left and networks
            function barInteract(d) {
                console.log(d.id)
                word = d.id
        
                // 1) change opacity of other nodes
                d3.select(bars).selectAll('rect').attr("opacity", "0.3")
                d3.select(bars).select('rect#bar'+d.id).attr("opacity", "1")
                
                // 2) show information about node
                x = parseInt(d3.select(bars).select('rect#bar'+d.id).attr("width"))+120
                y = parseInt(d3.select(bars).select('rect#bar'+d.id).attr("y")) + 86
                fill = d3.select(bars).select('rect#bar'+d.id).attr("fill")
        
                console.log(x, y)
                
                // select the bar that matches the specific node being hovered on and show information about frequency
                d3
                    .select("#"+svgID+"wordBars")
                    .append("text")
                    .attr("text-anchor", "right")
                    .attr("x", x)
                    .attr("y", y)
                    .text(d.id + ": appears " + d.frequency + " times in " + country + " headlines")
                    .attr("font-size", "15")
                    .attr("fill", fill)
                    .attr("font-family", "arial")
                    .attr("font-weight", "bold")
                    .attr("class", "barLabs")
                    .call(wrap, 60)
                }
        
        };
        // function to draw the barcharts in the final visualization
        function drawBars(countries_data, chart, selected_country, word_count, country_name, svgID) {
            // set the dimensions of each chart
            margin = {top: 69, right: 90, bottom: 5, left: 90},
            width = width/1.5,
            height = height;
            // change bar height if we draw more bars
            barpad = word_count===20 ? 20: word_count===50 ? 7:20
            font_size = word_count===20 ? "15px": word_count===50 ? "12px":"15px"

            // filter the data based on the country of interest
            country_data = countries_data.filter(d=>d.country == selected_country)
            // get top 20 bars
            top10 = country_data.filter(function(d,i){ return i<word_count })

            // create svg element that will hold the bars 
            var svg = d3.select(chart)
                .append("svg")
                .attr("preserveAspectRatio", "xMinYMin meet")
                .attr("id", svgID + "wordBars")
                .attr("viewBox", "0 0 "+ width +"," + height+"")
                // .classed("svg-content", true)
                .append("g")
                .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
            
            // create the horizontal scale (frequency)
            var x = d3.scaleLinear()
                .domain([0, d3.max(top10,d=>+d.frequency)])
                .range([ 0, width-margin.left-margin.right]);
            
            // create the vertical scale (categorical word)
            var y = d3.scaleBand()
            .range([ 0, height/1.2])
            .domain(top10.map(function(d) { return d.word; }))
            .padding(.1);
            
            // add the y axis
            svg.append("g")
                .call(d3.axisLeft(y).tickSize(0))
                .attr("class", "yAxis")
                .selectAll("text")
                .attr("font-size", font_size)
                .attr("transform", "translate(0, -2)")
                .attr("fill", "silver")
                .attr("font-family", "arial")
                .attr("font-weight", "bold")
            
            // draw a bar for each word, sized by frequency and colored by theme
            svg.selectAll("myRect")
                .data(top10)
                .join("rect")
                .attr("x", x(20) )
                .attr("y", function(d) { return y(d.word); })
                .attr("id", function(d,i) { return "bar" + d.word; })
                .attr("width", function(d) { return x(+d.frequency); })
                .attr("height", barpad )
                .attr("fill", d=>d.theme === "female"?"pink":
                                d.theme === "male"?"turquoise":
                                d.theme === "empowerment"?"#ccad34":
                                d.theme === "violence"?"red":
                                d.theme === "politics"?"green":
                                d.theme === "race"?"#964B00":
                                "#aaa")

            // add the country name on top of each bar chart
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
        }
        // function to create curved links in the network charts
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