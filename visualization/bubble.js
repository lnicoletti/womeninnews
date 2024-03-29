    let width5 = 1500;
    let height5 = 540;

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

    console.log(logoData.filter(d=>d.site=='bloomberg.com')[0]["link"])
    Promise.all([
        d3.csv("../data/processed/headlines_site.csv"),
        d3.csv("../data/processed/headlines_cl_sent.csv"),
        d3.csv("../data/processed/sites_freq.csv"),
        d3.csv("../data/processed/countries_clusters.csv"),
        d3.csv("https://gist.githubusercontent.com/lnicoletti/c312a25a680167989141e8315b26c92a/raw/707ead31e5bdbb886ff8f7dc5635d5d0568a0a81/citiesYearDeathsHT_party_n.csv"),
      ])
    // d3.csv("../data/processed/headlines_site.csv")
    // d3.csv("data/citiesYearDeathsHT_party_n.csv")
        .then((datasets) => {
            headlinesSite = datasets[0]
            headlines = datasets[1]
            sitesFreq = datasets[2]
            countriesFreq = datasets[3]
            police = datasets[4]
            console.log(headlinesSite) 
            console.log(headlines) 
            console.log(sitesFreq) 
            console.log(countriesFreq) 
            console.log(police) 
            type = "most"
            kind = "tot"
            // add logo links
            // dataLogos = data2.map((item, i) => Object.assign({}, item, logoData[i]));
            // let dataLogos = [];

            // for(let i=0; i<data2.length; i++) {
            //     dataLogos.push({
            //     ...data2[i], 
            //     ...(logoData.find((itmInner) => itmInner.site === data2[i].site))}
            //     );
            // }
            // drawBubbleChart(data, type, 2020, kind)
            drawBubbleChart(headlinesSite)
            drawWordClusters(countriesFreq)
        })

        function showTooltip5(ttip, text1, text2, text3, coords, data, county, c) {
            let x = coords[0]-120;
            let y = coords[1]-200;
            // party = c.party
            console.log(c)
    
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
            data = data.filter(d=>d.site === text1)
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
            // popFilter = 50000
            // remove all previous text
            // console.log(data)
            // Store data with the right variable (hthou or tot) for line chart
            // dataType = data
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
                .attr("fill", "grey")
                .attr("opacity", "0.8")
                .style('stroke', "#323232")
                .attr('r', d=>radius(+d.monthly_visits))
                
                .on("mouseenter", (d) => {
                    showTooltip5(ttip, d.site, d.country_of_pub, d.monthly_visits, [d3.event.clientX, d3.event.clientY], headlines, d.polarity, d)
                })
                .on("mousemove", (d) => {
                    showTooltip5(ttip, d.site, d.country_of_pub, d.monthly_visits,  [d3.event.clientX, d3.event.clientY], headlines, d.polarity, d)
                })
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

        console.log(xScale(wp))
        console.log(wp)
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

        function drawWordClusters(data) {

            var clusterColors = d3.scaleOrdinal()
                .range(d3.schemeTableau10)
                .domain(data.map(d =>d.cluster))

            extentWordFreq = d3.extent(data, d=>+d.perc_freq)
            // console.log(extentWordFreq)
            var bubbleRadius = d3.scaleSqrt()
                .domain(extentWordFreq)
                .range([3, 60])

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

            var svg = wordClusters
                // .attr("width", width)
                // .attr("height", height);


            var node = svg.selectAll("circle")
                .data(nodes)
                .enter().append("g")//.call(force.drag);

            console.log(node)

            node.append("circle")
                .style("fill", function (d) {
                return color(d.cluster);
                })
                .attr("r", function(d){return d.radius})
            
        const simulation = d3.forceSimulation(nodes)
                .force("x", d3.forceX(width5 / 2).strength(0.01))
                .force("y", d3.forceY(height5 / 2).strength(0.01))
                // .force("cluster", forceCluster())
                // .force("collide", forceCollide());
        console.log(centroid(nodes))

        function create_nodes(data,node_counter) {
            var i = cs.indexOf(data[node_counter].cluster),
                r = Math.sqrt((i + 1) / m * -Math.log(Math.random())) * maxRadius,
                d = {
                    cluster: i,
                    clusterName: data[node_counter].cluster,
                    radius: bubbleRadius(data[node_counter].perc_freq),
                    text: data[node_counter].word,
                    x: Math.cos(i / m * 2 * Math.PI) * 200 + width5 / 2 + Math.random(),
                    y: Math.sin(i / m * 2 * Math.PI) * 200 + height5 / 2 + Math.random()
                };
            if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d;
            return d;
            };
            
        function forceCluster() {
            const strength = 0.2;
            let nodes;
            
            function force(alpha) {
                const centroids = d3.nest(nodes, centroid, d => d.data.cluster);
                const l = alpha * strength;
                for (const d of nodes) {
                const {x: cx, y: cy} = centroids.get(d.data.cluster);
                d.vx -= (d.x - cx) * l;
                d.vy -= (d.y - cy) * l;
                }
            }
            
            force.initialize = _ => nodes = _;
            
            return force;
            }

        function centroid(nodes) {
            let x = 0;
            let y = 0;
            let z = 0;
            for (const d of nodes) {
                let k = d.r ** 2;
                x += d.x * k;
                y += d.y * k;
                z += k;
            }
            return {x: x / z, y: y / z};
            }

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


        