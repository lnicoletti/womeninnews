    // constants for charts
    let width5 = 1500;
    let height5 = 540;

    let heightCluster =  height5*3

    // constants for clusterchart
    padding = 1.5, // separation between same-color nodes
    clusterPadding = 6, // separation between different-color nodes
    maxRadius = 12;
    
    // create constants for bubble chart and cluster chart
    let bubbleChartB = d3.select("div#chartB").select("#bubblechartBias")
                    .attr("preserveAspectRatio", "xMinYMin meet")
                    .attr("viewBox", "0 0 "+ width5 +"," + height5+"")
                    .classed("svg-content", true);

    // create constants for bubble chart and cluster chart
    let bubbleChartP = d3.select("div#chartP").select("#bubblechartPolarity")
                    .attr("preserveAspectRatio", "xMinYMin meet")
                    .attr("viewBox", "0 0 "+ width5 +"," + height5+"")
                    .classed("svg-content", true);

    // let wordClusters = d3.select("div#clusterChart").select("#bubbleClusters")
    //                 .attr("preserveAspectRatio", "xMinYMin meet")
    //                 .attr("viewBox", "0 0 "+ width5 +"," + heightCluster+"")
    //                 .classed("svg-content", true);

    // create constant for tooltip of first chart and define attributes
    let tooltipHeadline = d3.select("#tooltipHeadline")
    tooltipHeadline.attr("height",height5/4)
    tooltipHeadline.attr("width", width5/5)

    // create dataset to for logos of the first chart
    logoData = [{site:"nytimes.com", link:"https://www.vectorlogo.zone/logos/nytimes/nytimes-icon.svg"},
                {site:"dailymail.co.uk", link:"https://seeklogo.com/images/D/Daily_Mail-logo-EBD7A83A1F-seeklogo.com.png"},
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
                {site:"businessinsider.com", link:"https://i.insider.com/596e4e7a552be51d008b50fd?width=600&format=jpeg"},
                {site:"aajtak.in", link:"https://static.wikia.nocookie.net/logopedia/images/d/db/Aaj_tak.png"},
                // {site:"ft.com", link:"https://www.ft.com/__origami/service/image/v2/images/raw/ftlogo-v1:brand-ft-logo-square-coloured-dot?source=origami-registry&width=200"},
                {site:"espn.go.com", link:"https://cdn.worldvectorlogo.com/logos/espn.svg"},
                {site:"huffingtonpost.com", link:"https://www.vectorlogo.zone/logos/huffingtonpost/huffingtonpost-icon.svg"}
            ]
    
    // timeline ruler tooltip and function
    const tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "tooltipTL")
        // .style("font-size", "10pt")
        // .style("font-family", "Lato")
        .style("position", "absolute")
        .style("text-align", "left")
        .style("width", "200")
        .style("height", "auto")
        .style("padding", "5px")
        // .style("background", "#161616")
        // .style("background", "grey")
        // .style("border", "1.5px grey solid")
        // .style("stroke", "grey")
        // .style("border-width", 1)
        .style("pointer-events", "none")
        .style("opacity", 0)
        // .attr("z-index", "100")
    
    // draw the legend for first chart
    drawBarLegend()
    // Load data and run functions to render charts
    Promise.all([
        // d3.csv("https://cdn.jsdelivr.net/gh/lnicoletti/womeninnews@d5a987c/hosted_data/headlines_site.csv"),
        d3.csv("../data/processed/headlines_site_rapi.csv"),
        d3.csv("../data/processed/country_time_freqrank_rapi_clean.csv", d3.autoType),
        // d3.csv("https://cdn.jsdelivr.net/gh/lnicoletti/womeninnews@d5a987c/hosted_data/countries_clusters.csv"),
        // d3.csv("https://raw.githubusercontent.com/lnicoletti/womeninnews/master/hosted_data/headlines_cl_sent_pol.csv"),
        d3.csv("../data/processed/headlines_cl_sent_sm_rapi.csv"),
        d3.csv("../data/processed/country_time_freqrank_rapi_clean.csv", d3.autoType),
        d3.csv("../data/processed/polarity_comparison.csv", d3.autoType),
        // d3.csv("https://cdn.jsdelivr.net/gh/lnicoletti/womeninnews@d5a987c/hosted_data/countries_freq.csv"),
        // d3.json("https://cdn.jsdelivr.net/gh/lnicoletti/womeninnews@d5a987c/hosted_data/word_connections_UK.json"),
        // d3.json("https://cdn.jsdelivr.net/gh/lnicoletti/womeninnews@d5a987c/hosted_data/word_connections_USA.json"),
        // d3.json("https://cdn.jsdelivr.net/gh/lnicoletti/womeninnews@d5a987c/hosted_data/word_connections_IN.json"),
        // d3.json("https://cdn.jsdelivr.net/gh/lnicoletti/womeninnews@d5a987c/hosted_data/word_connections_SA.json"),
      ])
        .then((datasets) => {
            // define each dataset
            headlinesSite = datasets[0]
            countries_data = datasets[1]
            // countriesCls = datasets[1]
            headlines = datasets[2]
            tempWords = datasets[3]
            polComparison = datasets[4]
            // countries_data = datasets[3]
            // UK_data = datasets[4]
            // USA_data = datasets[5]
            // IN_data = datasets[6]
            // SA_data = datasets[7]
            // console.log(SA_data)
            // console.log(countries_data)
            // console.log(headlinesSite) 
            // console.log(countriesCls) 
            // console.log(headlines) 

            // 1) lollipop chart
            renderLollipop(polComparison)
            // 1) bar charts
            drawBar(countries_data, "#chart1", "India", 15)    
            drawBar(countries_data, "#chart2", "USA", 15)   
            drawBar(countries_data, "#chart3", "UK", 15)   
            drawBar(countries_data, "#chart4", "South Africa", 15) 
            
            // 2) temporal chart
            filter_years = [2009, 2022]
            country = "USA"
            variable = "freq_prop_headlines" //freq_prop_headlines // frequency
            renderTempChart(tempWords, filter_years, country, variable)
            // update chart when country is changed
            d3.selectAll("button.country").on("click", function() {
                // Remove previous chart
                d3.select(".mainContainer").remove()
                d3.select(".stickyAxis").remove()
                let country = d3.select(this).property("value")
                console.log(country)
                renderTempChart(tempWords, filter_years, country, variable)
            })
            
            // 3) bubble charts
            // console.log("hd", headlinesSite)
            populateDropdown(headlinesSite, "#countrydropdown", "country_of_pub")
            populateDropdown(headlinesSite, "#pubdropdown", "site")
            drawBubbleChart(headlinesSite, bubbleChartB, "bias")
            drawBubbleChart(headlinesSite, bubbleChartP, "polarity")
        })

        // Sticky timeline enabled only during temporal chart
        $(window).scroll(function() {
            if ($(this).scrollTop() - $('#conclusionSection').position().top > -700){
                $('#stickyXaxis').css({'position': 'static', 'top': '0px'}); 
            }else{
                $('#stickyXaxis').css({'position': 'sticky', 'top': '0px'}); 
            }
        });

        $(window).scroll(function() {
            if ($(this).scrollTop() - $('#scoreboardsection').position().top > -700){
                $('.bubbleFilters').css({'position': 'static', 'top': '0px'}); 
            }else{
                $('.bubbleFilters').css({'position': 'sticky', 'top': '0px'}); 
            }
        });

        // Text transition
        var TxtRotate = function(el, toRotate, period) {
            this.toRotate = toRotate;
            this.el = el;
            this.loopNum = 0;
            this.period = parseInt(period, 10) || 2000;
            this.txt = '';
            this.tick();
            this.isDeleting = false;
        };
        
        TxtRotate.prototype.tick = function() {
            var i = this.loopNum % this.toRotate.length;
            var fullTxt = this.toRotate[i];
        
            if (this.isDeleting) {
            // 0,0 remove the entire sentence at once as opposed to going one by one. 
            this.txt = fullTxt.substring(0, 0);
            } else {
            // increase how many words appear at once
            this.txt = fullTxt.substring(0, this.txt.length + 1);
            }
        
            this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';
        
            var that = this;
            // increase speed of typing
            var delta = 50 - Math.random() ;
        
            if (this.isDeleting) { delta /= 2; }
        
            //Change this to change the time the headline waits before changing
            if (!this.isDeleting && this.txt === fullTxt) {
            delta = this.period;
            this.isDeleting = true;
            } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.loopNum++;
            delta = 500;
            }
        
            setTimeout(function() {
            that.tick();
            }, delta);
        };
        
        window.onload = function() {
            var elements = document.getElementsByClassName('txt-rotate');
            for (var i=0; i<elements.length; i++) {
            var toRotate = elements[i].getAttribute('data-rotate');
            var period = elements[i].getAttribute('data-period');
            if (toRotate) {
                new TxtRotate(elements[i], JSON.parse(toRotate), period);
            }
            }
            // INJECT CSS
            var css = document.createElement("style");
            //css.type = "text/css";
            css.innerHTML = ".txt-rotate > .wrap { border-right: 0.08em solid #666}";
            document.body.appendChild(css);
        };

        // BAR CHARTS
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
  
        function drawBar(countries_data, chart, selected_country, word_count) {

            // set the dimensions and margins of the graph
            var margin = {top: 50, right: 30, bottom: 10, left: 50},
            width = 300 - margin.left - margin.right,
            height = 420 - margin.bottom - margin.top;
        
            dataBars = countries_data.filter(d=>d.country == selected_country)
            dataBars = dataBars.filter(d=>d.year == 2020)
            //dataBars = dataBars.sort(function(a,b) { return d3.descending(+a.frequency, +b.frequency) })
            dataBars = dataBars.sort(function(a,b) { return d3.descending(+a.frequency, +b.frequency) })
            console.log(dataBars)
            
            top10 = dataBars.filter(function(d,i){ return i<word_count })
        
            //margin = {top: 69, right: 90, bottom: 5, left: 90},
            //width = width/1.5,
            //height = height;
            // barpad = 20

            flags = [{country:"South Africa", flag:"flags/south-africa.svg"}, {country:"USA", flag:"flags/united-states.svg"}, 
                     {country:"India", flag:"flags/india.svg"}, {country:"UK", flag:"flags/united-kingdom.svg"}]
        
            var svg = d3.select(chart)
            .append("svg")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 "+ width +"," + (height + margin.top)+"")
            .attr("class", "svgBars")
            // .attr("width", width + margin.left + margin.right)
            // .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")")
        
            // Add X axis
            var x = d3.scaleLinear()
            .domain([0, d3.max(top10,d=>+d.frequency)])
            .range([ 0, width-margin.left]).nice();
                
            // Y axis
            var y = d3.scaleBand()
            .range([ 0, height ])
            .domain(top10.map(function(d) { return d.word; }))
            // change this to change the distance of the word from the bar
            .padding(0);
        
            svg.append("g")
            .call(d3.axisLeft(y).tickSize(0))
            .attr("class", "yAxis")
            .attr("transform", "translate(0, -1)")
            
            
            //Bars
            svg.selectAll("myRect")
            .data(top10)
            .join("rect")
            .attr("x", x(0) )
            .attr("y", function(d) { return y(d.word); })
            .attr("width", function(d) { return x(d.frequency); })
            .attr("height", 20)
            // .attr("class", "barChart")
            .attr("fill", "lightgrey")
        
            // change name of country for bar chart
            // TODO: Fix this
            // svg.append("text")
            //     .attr("x", 0)             
            //     .attr("dy", -10)
            //     .attr("class", "barLegendText") 
            //     .text(selected_country);

            svg.append("svg:image")
            .attr('width', "40px")
            .attr("x", 0) 
            .attr("y", 0)            
            .attr("transform", "translate(0, -40)")
            .attr("xlink:href", flags.filter(c=>c.country===selected_country)[0]['flag'])

        }

        // LOLLIPOP CHART
        function renderLollipop(data){

            // set the dimensions and margins of the graph
            var margin = {top: 130, right: 50, bottom: 30, left: 230},
            width = 1000 - margin.left - margin.right,
            height = 1630 - margin.top - margin.bottom;
        
            // append the svg object to the body of the page
            var lollipopChart = d3.select("#lollipopChart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");
        
            // console.log(data)
            //data = data.sort((a,b)=>d3.descending(+a.polarity_women, +b.polarity_women)) 
            data = data.filter(d=>(d.popularity==1)&&(Math.abs(d.difference) > 0.05)
                                                   &&((d.site_clean !== "dailysun.co.za")
                                                   &&(d.site_clean !== "msnbc")))
                                                   
            data = data.sort((a,b)=> d3.descending(+a.polarity_women, +b.polarity_women))
            // data = data.filter(d=> Math.abs(d.difference) > 0.05)
            // data = data.filter(d=>d.site_clean !== "dailysun.co.za")

            console.log(data)
        
        
          // Add X axis
          var x = d3.scaleLinear()
            // .domain([-0.1,d3.max(data, d=>d.difference)+0.1])
            .domain(d3.extent(data, d=>d.polarity_women))
            .range([ margin.left + margin.right, width-20]);
           // .padding(0.001);

           // Y axis
        var y = d3.scaleBand()
            .range([ 0, height ])
            .domain(data.map(d=>d.site_clean))
            // Padding from the top
            .padding(1);
            lollipopChart.append("g")
            .call(d3.axisLeft(y)
                    .tickSize(0))
            // .call(g => g.select(".domain").remove())
            .attr("class", "polarityCompyAxis");
            
          lollipopChart.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .attr("class", "polarityCompxAxis")
        
          // Lines  
        
          lollipopChart.selectAll("gridLine")
          .data(data)
          .join("line")
            .attr("x1", 10)
            .attr("x2", width)
            .attr("y1", function(d) { return y(d.site_clean); })
            .attr("y2", function(d) { return y(d.site_clean); })
            .attr("class", "grid");
        
        
          // Horizontal line between bubbles
          lollipopChart.selectAll("myline")
            .data(data)
            .join("line")
              .attr("x1", function(d) { return x(d.polarity_base); })
              .attr("x2", function(d) { return x(d.polarity_women); })
              .attr("y1", function(d) { return y(d.site_clean); })
              .attr("y2", function(d) { return y(d.site_clean); })
              .attr("class", "polarityCompBubbleLine")
              .attr("stroke", "black")
              .attr("stroke-width", "2.5px")
        
        
             // .attr("class", "polarityCompLine")
        
          // Circles of variable 1
          lollipopChart.selectAll("mycircle")
            .data(data)
            .join("circle")
              .attr("cx", function(d) { return x(d.polarity_base); })
              .attr("cy", function(d) { return y(d.site_clean); })
              .attr("r", "4")
              .attr("class", "polarityCompBubbleLeft")
              // .style("fill", "#69b3a2")
        
          // Circles of variable 2
          lollipopChart.selectAll("mycircle")
            .data(data)
            .join("circle")
              .attr("cx", function(d) { return x(d.polarity_women); })
              .attr("cy", function(d) { return y(d.site_clean); })
              .attr("class", "polarityCompBubbleRight")
              // size of the bubble
              .attr("r", "11")
              // .style("fill", "#4C4082")

            // text of polarity women
          lollipopChart.selectAll("mycircle")
            .data(data)
            .join("text")
                .attr("x", d=>x(d.polarity_women))
                .attr("y", d=> y(d.site_clean))
                .attr("class", "polarityDiffAnnotation")
                .text(d=>((d.polarity_women-d.polarity_base)/d.polarity_base)*100>0?
                            "+"+Math.round(((d.polarity_women-d.polarity_base)/d.polarity_base)*100)+"%":
                            Math.round(((d.polarity_women-d.polarity_base)/d.polarity_base)*100)+"%")


            // LEGEND and axis labels
            // Horizontal line between bubbles
        lollipopChart.append("line")
            .attr("x1", 0)
            .attr("x2", 200)
            .attr("y1", -60)
            .attr("y2", -60)
            .attr("stroke", "black")
            .attr("stroke-width", "2.5px")
      
      
           // .attr("class", "polarityCompLine")
      
        // Circles of variable 1
        lollipopChart.append("circle")
            .attr("cx", 0)
            .attr("cy", -60)
            .attr("r", "4")
            .attr("class", "polarityCompBubbleLeft")
            // .style("fill", "#69b3a2")
      
        // Circles of variable 2
        lollipopChart.append("circle")
            .attr("cx", 200)
            .attr("cy", -60)
            .attr("class", "polarityCompBubbleRight")
            // size of the bubble
            .attr("r", "11")
            // .style("fill", "#4C4082")

        lollipopChart.append("text")
            .attr("class", "xAxisLabel")
            .attr("x", 0)
            .attr("y", -60)
            // .attr("dy", "-2em")
            .text("All headlines")
            .attr("class", "polarityCompAllText")
                      
          
        lollipopChart.append("text")
            .attr("class", "xAxisLabel")
            .attr("x", 200)
            .attr("y", -60)
            .text("Headlines about women")
            .attr("class", "polarityCompFemText")
            .call(wrap, 100)
            // .attr("dy", "-5em")

        lollipopChart.append("text")
            .attr("class", "polarityCompxAxisLabel")
            // .attr("y", height)
            .attr("y", -15)
            .attr("x",margin)
            .attr("dy", "1em")
            .style("text-anchor", "start")
            .text("← Less polarizing language")
                      
          
        lollipopChart.append("text")
            .attr("class", "polarityCompxAxisLabel")
            // .attr("y", height)
            .attr("y", -15)
            .attr("x",width)
            .attr("dy", "1em")
            .style("text-anchor", "end")
            .text("More polarizing language →")


        // sort chart by difference
        d3.select("#sortLollipop").append("button")
            .text("Sort by difference") //I modified the first two lines
            .on("click", function(){
                // reorder site names
                dataSort = data.sort((a,b)=> d3.descending(+a.difference, +b.difference))
                y.domain(dataSort.map(d=>d.site_clean))
                // change axis
                lollipopChart.select(".polarityCompyAxis").transition().duration("1000").call(d3.axisLeft(y)
                            .tickSize(0))                     

                // sort the circles
                lollipopChart.selectAll("circle")//.attr("r", 20)//the bars were added before
                            // .data(data.sort((a,b)=> d3.descending(+a.difference, +b.difference)))
                    .sort((a, b) => a !== undefined? d3.ascending(+a.difference, +b.difference):""
                    ).transition().duration("1000")
                    .attr("cy", (d, i)=>
                        
                        d !== undefined?
                        y(d.site_clean):"-60"//xScale is defined earlier
                    )
                // sort the annotations
                lollipopChart.selectAll(".polarityDiffAnnotation")//.attr("r", 20)//the bars were added before
                            // .data(data.sort((a,b)=> d3.descending(+a.difference, +b.difference)))
                    .sort((a, b) => d3.ascending(+a.difference, +b.difference))
                    .transition().duration("1000")
                    .attr("y", (d, i)=> y(d.site_clean))
                // sort the lines
                lollipopChart.selectAll(".polarityCompBubbleLine")//.attr("r", 20)//the bars were added before
                            // .data(data.sort((a,b)=> d3.descending(+a.difference, +b.difference)))
                    .sort((a, b) => d3.ascending(+a.difference, +b.difference))
                    .transition().duration("1000")
                    .attr("x1", (d, i)=>x(d.polarity_base))
                    .attr("x2", (d, i)=>x(d.polarity_women))
                    .attr("y1", (d, i)=>y(d.site_clean))
                    .attr("y2", (d, i)=>y(d.site_clean))
                    // .attr("cy", (d, i)=>d !== undefined? y(d.site_clean):"-60"//xScale is defined earlier
                    // )
                })

        // sort chart by polarity women
        d3.select("#sortLollipop").append("button")
        .text("Sort by women polarity") //I modified the first two lines
        .on("click", function(){
            // reorder site names
            dataSort = data.sort((a,b)=> d3.descending(+a.polarity_women, +b.polarity_women))
            y.domain(dataSort.map(d=>d.site_clean))
            // change axis
            lollipopChart.select(".polarityCompyAxis").transition().duration("1000").call(d3.axisLeft(y)
                            .tickSize(0))

            // sort the circles
            lollipopChart.selectAll("circle")//.attr("r", 20)//the bars were added before
                        // .data(data.sort((a,b)=> d3.descending(+a.difference, +b.difference)))
                .sort((a, b) => a !== undefined? d3.ascending(+a.polarity_women, +b.polarity_women):""
                ).transition().duration("1000")
                .attr("cy", (d, i)=>
                    
                    d !== undefined?
                    y(d.site_clean):"-60"//xScale is defined earlier
                )
            // sort the annotations
            lollipopChart.selectAll(".polarityDiffAnnotation")//.attr("r", 20)//the bars were added before
                        // .data(data.sort((a,b)=> d3.descending(+a.difference, +b.difference)))
                .sort((a, b) => d3.ascending(+a.polarity_women, +b.polarity_women))
                .transition().duration("1000")
                .attr("y", (d, i)=> y(d.site_clean))
            // sort the lines
            lollipopChart.selectAll(".polarityCompBubbleLine")//.attr("r", 20)//the bars were added before
                        // .data(data.sort((a,b)=> d3.descending(+a.difference, +b.difference)))
                .sort((a, b) => d3.ascending(+a.polarity_women, +b.polarity_women))
                .transition().duration("1000")
                .attr("x1", (d, i)=>x(d.polarity_base))
                .attr("x2", (d, i)=>x(d.polarity_women))
                .attr("y1", (d, i)=>y(d.site_clean))
                .attr("y2", (d, i)=>y(d.site_clean))
                // .attr("cy", (d, i)=>d !== undefined? y(d.site_clean):"-60"//xScale is defined earlier
                // )
            })

        }

        // TEMPORAL CHART
        // temporal multiples chart functions
        function renderTempChart(dataset, filter, country, variable) {
            // dimensions
            // margin = ({top: 400, bottom: 20, left: 40, right: 40})
            margin = ({top: 150, bottom: 20, left: 40, right: 40})
            // margin = ({top: 150, bottom: 20, left: 200, right: 200})
            visWidth = 1200 - margin.left - margin.right
            visHeight = 10000 - margin.top - margin.bottom
            stickyAxisHeight = 200
            // colors
            mainColor = "#3569DC" //"red" //"cyan"
            lineThickness = 1.5 //2.5
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
                .paddingInner(-1)

            col = d3.scaleBand()
                .domain(d3.range(cols))
                .range([0, visWidth])
                .paddingInner(0.2) 

            // world events data
            radius = 6
            padding = 1.5
            numberOfCategories = 5
            categories = ["0", "1", "2", "3", "4"]
            dateRange = [new Date(2010, 0).getTime(), new Date(2021, 0).getTime()];

        eventsWorld = [
                {uid: 1, 
                 name: "Horrifying gang rape and murder in New Delhi, India", 
                 category: 4, 
                 date: new Date(2012, 11, 16)},
          {uid: 1, 
                 name: "The U.S. military removes a ban against women serving in combat positions", 
                 category: 4, 
                 date: new Date(2013, 1, 24)},
          {uid: 1, 
                 name: "A new Pentagon report found a 50% increase in sexual assault reports in 2013", 
                 category: 4, 
                 date: new Date(2014, 5, 1)},
                {uid: 1, 
                 name: "Caitlyn Jenner comes out in an interview", 
                 category: 4, 
                 date: new Date(2015, 4, 24)},
          {uid: 1, 
                 name: "A survey for the Department of Defense finds that in the past year 52% of active service members who reported sexual assault had experienced retaliation in the form of professional, social, and administrative actions or punishments.", 
                 category: 4, 
                 date: new Date(2015, 4, 18)},
         {uid: 2, 
                 name: "People v. Turner: Brock Turner is arrested for sexually assaulting an unconscious woman", 
                 category: 4, 
                 date: new Date(2015, 1, 18)},
                {uid: 1, 
                 name: "#EndRapeCulture in South Africa", 
                 category: 4, 
                 date: new Date(2016, 4, 0)},
          {uid: 2, 
                 name: "Hillary Clinton becomes the first woman to receive a presidential nomination from a major political party", 
                 category: 4, 
                 date: new Date(2016, 7, 26)},
                {uid: 3, 
                 name: "Trump: “Grab ‘em by the pussy”", 
                 category: 4, 
                 date: new Date(2016, 10, 8)},
          {uid: 4, 
                 name: "People v. Turner: Brock Turner is convicted for three counts of felony sexual assault", 
                 category: 4, 
                 date: new Date(2016, 3, 30)},
          {uid: 5, 
                 name: "People v. Turner: Brock Turner is released after spending 3 months in jail", 
                 category: 4, 
                 date: new Date(2016, 9, 2)},
                {uid: 1, 
                 name: "#MeToo in U.S.A.", 
                 category: 4, 
                 date: new Date(2017, 10, 15)},
                {uid: 2, 
                 name: "Harvey Weinstein Trial", 
                 category: 4, 
                 date: new Date(2017, 10, 0)},
         {uid: 3, 
                 name: "#ChurchToo in U.S.A.", 
                 category: 4, 
                 date: new Date(2017, 11, 0)},
             {uid: 4, 
                 name: "#MeTooSTEM and removal of Francisco J. Ayala from UC Irvine", 
                 category: 4, 
                 date: new Date(2017, 11, 0)},
                {uid: 5, 
                 name: "Release of Wonder Woman", 
                 category: 4, 
                 date: new Date(2017, 5, 15)},
                {uid: 6, 
                 name: "Larry Nassar U.S. Gymnastics doctor sexual assault scandal", 
                 category: 4, 
                 date: new Date(2017, 12, 0)},
         {uid: 7, 
                 name: "Jessie Reyez releases “Gatekeeper”", 
                 category: 4, 
                 date: new Date(2017, 4, 26)},
          {uid: 8, 
                 name: "The 2017 Westminster sexual scandals in the U.K. and resignation of Sir Michael Fallon", 
                 category: 4, 
                 date: new Date(2017, 11, 0)},
                {uid: 1, 
                 name: "Meghan Markle’s wedding to Prince Harry in U.K.", 
                 category: 4, 
                 date: new Date(2018, 5, 19)},
          {uid: 2, 
                 name: "MEE TOO bill in U.S. Congress", 
                 category: 4, 
                 date: new Date(2018, 1, 18)},
                {uid: 3, 
                 name: "Priyanka Chopra marries Nick Jonas in India", 
                 category: 4, 
                 date: new Date(2018, 12, 1)},
                {uid: 4, 
                 name: "People v. Turner: Brock Turner is convicted by jury trial of three counts of felony sexual assault", 
                 category: 4, 
                 date: new Date(2018, 1, 0)},
          {uid: 5, 
                 name: "Google’s Andy Rubin sexual misconduct scandal", 
                 category: 4, 
                 date: new Date(2018, 10, 25)},
              {uid: 6, 
                 name: "Global Women’s March", 
                 category: 4, 
                 date: new Date(2018, 1, 20)},
              {uid: 7, 
                 name: "#MeTooMilitary in U.S.A", 
                 category: 4, 
                 date: new Date(2018, 1, 0)},
              {uid: 8, 
                 name: "#MeToo in India", 
                 category: 4, 
                 date: new Date(2018, 10, 0)},
              {uid: 9, 
                 name: "Mass sexual assaults during the 2018 new year's celebrations in Bangalore", 
                 category: 4, 
                 date: new Date(2018, 12, 0)},
              {uid: 10, 
                 name: "Indian actress Tanushree Dutta accuses Nana Patekar of sexual harassment", 
                 category: 4, 
                 date: new Date(2018, 9, 27)},
              {uid: 11, 
                 name: "Indian minister of state for External Affairs, MJ Akbar is accused of sexual harassment by several female colleagues through the 'Me Too' Movement in India", 
                 category: 4, 
                 date: new Date(2018, 10, 0)},
              {uid: 12, 
                 name: "Indian music director Anu Malik is suspended from the jury panel of Indian Idol 2018, after facing multiple allegations of sexual harassment", 
                 category: 4, 
                 date: new Date(2018, 10, 21)},
              {uid: 13, 
                 name: "Marriage of Prince Harry and Meghan Markle", 
                 category: 4, 
                 date: new Date(2018, 5, 19)},
                {uid: 1, 
                 name: "Greta Thunberg: Climate Action Summit and sail to NYC", 
                 category: 4, 
                 date: new Date(2019, 8, 28)},
                {uid: 2, 
                 name: "Release of “Surviving R. Kelly” documentary", 
                 category: 4, 
                 date: new Date(2019, 1, 0)},
                {uid: 3, 
                 name: "Arrest of R. Kelly for 10 counts of sexual abuse against four women", 
                 category: 4, 
                 date: new Date(2019, 2, 0)},
                {uid: 1, 
                 name: "#SayHerName: Murder of Breonna Taylor", 
                 category: 4, 
                 date: new Date(2020, 3, 0)},
                {uid: 2, 
                 name: "International Women’s Cricket T20", 
                 category: 4, 
                 date: new Date(2020, 2, 0)},
         {uid: 3, 
                 name: "Rape and murder of Vanessa Guillén in U.S. military", 
                 category: 4, 
                 date: new Date(2020, 4, 22)},
                {uid: 1, 
                 name: "16 year old Ma'Khia Bryant is fatally shot by police officer Nicholas Reardon in Columbus, Ohio", 
                 category: 4, 
                 date: new Date(2021, 4, 20)},
                {uid: 2, 
                 name: "Kamala Harris is sworn in as the first woman and first woman of color vice president of the United States", 
                 category: 4, 
                 date: new Date(2021, 1, 20)},
                {uid: 3, 
                 name: "Oprah with Meghan and Harry and “Megxit”", 
                 category: 4, 
                 date: new Date(2021, 3, 7)},
         {uid: 3, 
                 name: "Indian Prime Minister, Narendra Modi, follows trolls on twitter”", 
                 category: 4, 
                 date: new Date(2017, 8, 8)},
         {uid: 3, 
                 name: "Study finds that Indian women politicians face more trolling than US, UK counterparts", 
                 category: 4, 
                 date: new Date(2021, 0, 24)},
         {uid: 3, 
                 name: "40% Indian women fear online trolls as they access Internet: Nielson report", 
                 category: 4, 
                 date: new Date(2019, 11, 17)},
         {uid: 3, 
                 name: "Indian central government passes the Citizenship Amendment Act, by providing a pathway to Indian citizenship for persecuted religious minorities from Afghanistan, Bangladesh and Pakistan who are Hindus, Sikhs, Buddhists, Jains, Parsis or Christians, and arrived in India before the end of December 2014", 
                 category: 4, 
                 date: new Date(2019, 11, 12)},
         {uid: 3, 
                 name: "India saw, for the first time, a sustained countrywide movement led by Women against the CAA-NRC bills", 
                 category: 4, 
                 date: new Date(2020, 0, 13)},
         {uid: 3, 
                 name: "defamation case filed by former Union minister M J Akbar's against journalist Priya Ramani who had accused him of sexual harassment", 
                 category: 4, 
                 date: new Date(2021, 4, 05)},
         {uid: 3, 
                 name: "A majority judgement which declared the prohibition of entry of women aged between 10 and 50 into Sabarimala temple, as unconstitutional and discriminatory", 
                 category: 4, 
                 date: new Date(2018, 8, 28)},
         {uid: 3, 
                 name: "A Supreme Court Bench declared muslim instantaneous divorce, triple Talaq, as unconstitutional", 
                 category: 4, 
                 date: new Date(2019, 6, 31)},
         {uid: 3, 
                 name: "Indian court grants bail to Nupur Talwar, a dentist accused in the twin murder of her daughter and domestic help", 
                 category: 4, 
                 date: new Date(2019, 6, 31)},
         {uid: 3, 
                 name: "Kanimozhi Karunanidhi, Member of Parliament, accused in 2G scam, refused bail", 
                 category: 4, 
                 date: new Date(2011, 4, 11)},
         {uid: 3, 
                 name: "Accused who set fire to the rape survivor from Unnao, Uttar Pradesh, India, out on bail", 
                 category: 4, 
                 date: new Date(2019, 11, 5)},
         {uid: 3, 
                 name: "Multiple women enter inner sanctum of temples across the country, after protest", 
                 category: 4, 
                 date: new Date(2016, 2, 3)},
         {uid: 3, 
                 name: "Section 377: Supreme Court legalizes consensual sexual conduct between adults of the same sex", 
                 category: 4, 
                 date: new Date(2018, 8, 6)},
         {uid: 3, 
                 name: "Women’s Cricket World Cup 2017", 
                 category: 4, 
                 date: new Date(2017, 5, 23)},
         {uid: 3, 
                 name: "The Marikana massacre was the killing of 34 miners by the South African Police Service (SAPS). It took place on 16 August 2012, and was the most lethal use of force by South African security forces against civilians since 1976.", 
                 category: 4, 
                 date: new Date(2012, 7, 16)},
         {uid: 3, 
                 name: "On 11 April 2015, several South Africans attacked foreigners in a xenophobic attack in Durban, South Africa, which extended to some parts of Johannesburg. Several people, both foreign and South African alike, were killed with some of the killings captured on camera.", 
                 category: 4, 
                 date: new Date(2015, 3, 11)},
         {uid: 3, 
                 name: "Brutal gang rape and subsequent death of South African teenager", 
                 category: 4, 
                 date: new Date(2013, 1, 02)},
         {uid: 3, 
                 name: "Monica Lewinsky breaks decade-long media silence", 
                 category: 4, 
                 date: new Date(2014, 4, 06)}
          
         ]
         
            words = dataset.filter(d=>(d.year>filter[0])&&(d.year<filter[1])&&(d.country===country))
            console.log("words")
            console.log(words)
            words = words.map(d=> {
                return {
                    year: d.year,
                    frequency: d[variable],
                    word: d.word,
                    word_type: d.word_type
                }
            })

            freqByWord = d3.rollup(
                words,
                g => g.map(({ year, frequency}) => ({date: new Date(year, 0, 1), frequency})),
                d => d.word
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
            console.log("test")
            console.log(data)

            // same x-scale for all charts
            minDate = data[0].rates[0].date
            maxDate = data[0].rates[data[0].rates.length - 1].date
            // maxDate = new Date(2021, 6, 0)

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

            // console.log(words)
            // console.log(freqByWord)
            // console.log(data)
            // console.log(minDate, maxDate)
            // console.log(wordToScaleAndArea)

            // draw the chart
            // create and select an svg element that is the size of the bars plus margins 
            const svg = d3.select("div#smChart")
                .append("svg")
                .attr("class", "mainContainer")
                .attr('width', visWidth + margin.left + margin.right)
                .attr('height', visHeight + margin.top + margin.bottom);
                
                // .attr("preserveAspectRatio", "xMinYMin meet")
                // .attr("viewBox", "0 0 "+ (visWidth + margin.left + margin.right) +"," + (visHeight + margin.top + margin.bottom) +"")
            
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
                .attr("stop-color", mainColor);

            
            linearGradient.append("stop")
                .attr("offset", "90%")
                .attr("stop-color", "#FEFAF1");//#202020

            linearGradient.append("stop")
                .attr("offset", "100%")
                .attr("stop-color", "#FEFAF1") //#161616
                // .attr("opacity", 0.1);

            // append a group element and move it left and down to create space
            // for the left and top margins
            const g = svg.append("g")
                .attr('transform', `translate(${margin.left}, ${margin.top/3})`);

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
                // .attr('fill', mainColor)
                .attr('opacity', 0.5)
                .attr("class", "wordArea")
                .attr("id", d=> 'area'+ d.word)
                .on("mouseover", (event, d) => showTooltip(event, d))
                .on("mouseleave", (event, d) => hideTooltip(event, d))
                // .attr('fill', 'red');

            cells.append('path')
                // .attr('stroke', 'black')
                .style("stroke", "url(#linear-gradient)")
                // .style("stroke", mainColor) // .style("stroke", "url(#linear-gradient)")
                .attr('stroke-width', lineThickness)
                .attr('fill', 'none')
                .attr("class", "wordLine")
                .attr("id", d=> 'line'+ d.word)  
                .attr('d', d => wordToScaleAndArea[d.word].line(d.rates)) 
                .on("mouseover", (event, d) => showTooltip(event, d))
                .on("mouseleave", (event, d) => hideTooltip(event, d))
            
            // append the x axis once on top of the chart

            const xaxis = d3.axisBottom(x)
                    .ticks(10)
                    .tickSizeOuter(0)
                    .tickSizeInner(0)
                    .tickPadding(30)
                    .tickFormat((d, i) => i == 0 || i == 3 || i == 6 || i == 9 || i == 11 ? d3.timeFormat('%Y')(new Date(d)):                                
                                        "");
                                        
                                        //.tickFormat(d3.format(".0s"))

            const stickyAxis = d3.select("div#stickyXaxis").append("svg")
                // .attr('transform', `translate(${margin.left}, ${margin.top})`)
                .attr('transform', `translate(${margin.left}, 0)`)
                .attr('width', visWidth + margin.left + margin.right)
                .attr('height', stickyAxisHeight)
                // .attr("preserveAspectRatio", "xMinYMin meet")
                // .attr("viewBox", "0 0 "+ (visWidth + margin.left + margin.right) +"," + (stickyAxisHeight) +"")
                .attr("class", "stickyAxis");

            // g.append("g")
            stickyAxis.append("g")
                    .attr('transform', `translate(${col(0)}, ${margin.top})`)
                    // .attr('transform', `translate(${margin.left}, ${margin.top})`)
                    .call(xaxis)
                    // .attr("class", "SMaxisSticky")
                    .call(g=>g.selectAll(".tick")
                    // .attr("color", (d, i) => i == 0 || i == 9 ? "grey": "none")
                    // .attr("opacity", (d, i) => i == 0 ||  i == 9 ? 1: 0)
                    // .attr("color", "grey")
                    // .attr('stroke-width', 2)
                    // .attr("font-weight", 800)
                    // .attr("font-size", 12)
                    )
                    .call(g => g.select('.domain').attr('stroke-width', 2).attr("color", "#282828"))//.attr("color", "grey")
                    // .call(g => g.select('.domain').remove())

            // annotation on the left
            stickyAxis.append("g")
                    .attr('transform', `translate(${col(0)}, ${margin.top})`)
                        .append("text")
                        .text("News Events")
                        .attr("class", "annotation")
                        .attr("font-weight", "400")
                        .attr("x", -20)
                        .attr("y", -4)

            // circles for timeline
            const circleEvents = 
                    // g.append("g")
                    stickyAxis.append("g")
                            .attr('transform', `translate(${col(0)}, ${margin.top})`)
                            // .attr('transform', `translate(${col(0)}, -${margin.top/3})`)
                            .selectAll("circle")
                            // .attr("class", "SMaxisSticky")
                            // .data(events)
                            .data(dodge(eventsWorld.filter(d=>d.date<=maxDate), {radius: radius * 2 + padding, x: d => x(d.date)}))

            // console.log(dodge(eventsWorld, {radius: radius * 2 + padding, x: d => x(d.date)}))

            const circles = circleEvents
                            .join("circle")
                            // .attr("class", "SMaxisSticky")
                            // .attr('transform', (d, i) => `translate(0, ${d.uid * 12 * (d.position ? 1 : -1 )})`)
                            // .attr("cx", d=>x(d.date))
                            // .attr("cy", 0)
                            .attr("cx", d => d.x)
                            .attr("cy", d =>  d.y)
                            .attr("fill", mainColor)
                            .attr("r", radius)
                            .attr("opacity", "0.5")
                            .on("mouseover", (event, d) => timeRuler(event, d.data, g, svg))
                            // .on("mousemove", (event, d) => timeRuler(event, d, g))
                            .on("mouseleave", (event, d) => {
                                            d3.selectAll(".timeRuler").remove()
                                            tooltip
                                                    .transition()
                                                    .duration(500)
                                                    .style("opacity", 0)
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
                .attr("class", "wordText")
                .attr("id", d=> 'text'+ d.word) 
                .text(d.word)
                .on("mouseover", (event, d) => showTooltip(event, d))
                .on("mouseleave", (event, d) => hideTooltip(event, d))
        });

        }

        function timeRuler(event, d, g, svg) {
    

            const rulerg = g.append("g")
                            .append("rect")
                            .attr("class", "timeRuler")
                            .attr('transform', `translate(${col(0)}, -${margin.top/3})`)
                            .attr("x", x(d.date)-9)
                            // .attr("x2", x(d.date))
                            .attr("y", 0)
                            // .attr("width", 10)
                            .attr("height", visHeight)
                            // .attr("y2", visHeight)

                            console.log(new Date("2021"))
        
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
                .html(`<b>${d3.timeFormat("%m/%Y")(d.date)}</b><br>
                <i>${(d.name)}`)
                // .style("left", event.pageX + "px")
                // .style("top", event.pageY - 100 + "px")
                .attr('transform', `translate(${-col(0)*3}, -${margin.top/3})`)
                .style("left", x(new Date("01-01-2025")))
                // .style("left", "1500px")
                .style("top", event.pageY + "px")
                .attr("class", "tooltipTL")
                // .style("font-family", "sans-serif")
                // .attr("font-size", "10px")
                // .style("color", "#161616");
                // .style("color", "grey");
        
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
        
        // function for beeswarm timeline
        function dodge(data, {radius = 1, x = d => d} = {}) {
            const radius2 = radius ** 2;
            const circles = data.map((d, i) => ({x: +x(d, i, data), data: d})).sort((a, b) => a.x - b.x);
            const epsilon = 1e-3;
            let head = null, tail = null;
          
            // Returns true if circle ⟨x,y⟩ intersects with any circle in the queue.
            function intersects(x, y) {
              let a = head;
              while (a) {
                if (radius2 - epsilon > (a.x - x) ** 2 + (a.y - y) ** 2) {
                  return true;
                }
                a = a.next;
              }
              return false;
            }
          
            // Place each circle sequentially.
            for (const b of circles) {
          
              // Remove circles from the queue that can’t intersect the new circle b.
              while (head && head.x < b.x - radius2) head = head.next;
          
              // Choose the minimum non-intersecting tangent.
              if (intersects(b.x, b.y = 0)) {
                let a = head;
                b.y = Infinity;
                do {
                  let y1 = a.y + Math.sqrt(radius2 - (a.x - b.x) ** 2);
                  let y2 = a.y - Math.sqrt(radius2 - (a.x - b.x) ** 2);
                  if (Math.abs(y1) < Math.abs(b.y) && !intersects(b.x, y1)) b.y = y1;
                  if (Math.abs(y2) < Math.abs(b.y) && !intersects(b.x, y2)) b.y = y2;
                  a = a.next;
                } while (a);
              }
          
              // Add b to the queue.
              b.next = null;
              if (head === null) head = tail = b;
              else tail = tail.next = b;
            }
          
            return circles;
        }
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
            // d3.//.select('#line'+ d.word).append("g")
            // select('#cell'+ d.word)
            //     .append("text")
            //     .text(percFreqInc>0? "+" + percFreqInc.toFixed(0) + "%": percFreqInc.toFixed(0)+ "%")
            //     .attr("fill", "grey")
            //     .attr("font-weight", 800)
            //     .style("font-size", 12)
            //     .style("font-family", "sans-serif")
            //     .attr("class", "wordText")
            //     .attr("x", x(endDate)+5)
            //     .attr("y", wordToScaleAndArea[d.word].y(endFreq))
            //     .attr("class", "incText")

        }

        function hideTooltip(event, d) {
            d3.selectAll(".wordArea").attr("opacity", 0.5)
            d3.selectAll(".wordLine").attr("opacity", 1)
            d3.selectAll(".wordText").attr("opacity", 1)
            d3.selectAll(".incText").remove()
        }

        // BUBBLE CHART
        // tooltip function for the bubble chart
        function showTooltipHeadline(ttip, text1, text2, text3, coords, data, polarity, c) {
            // set position of tooltip
            let x = coords[0]-120;
            let y = coords[1]-200;

            // console.log(c)
            // console.log(data)
            // remove previous text: 
            tooltipHeadline.selectAll("#tooltipText").remove()
            // create box
            tooltipHeadline
                .style("display", "block")
                .style("visibility", "visible")
                .style("top", y + "px")
                .style("left", x + "px")
                .style("border", "solid 1px #282828")

            // remove hoverGuide
            d3.select("#hoverGuide").remove()
            d3.select("#hoverGuideLine").remove()

            // filter data depending on where the user is along x-scale
            data = c.bias>0.5?data.filter(d=>(d.site === text1)&(d.bias > 0.5)):
                     data.filter(d=>(d.site === text1)&(d.bias < 0.5))

            // console.log(data)

            // find a random headline
            randHeadline = Math.floor(Math.random() * data.length)
            // console.log(d3.timeFormat("%d/%m/%Y")(new Date(data[randHeadline].time)))
            // console.log(data[randHeadline].subtitle)

            // tooltip dimensions
            let ttipMargin = { left: 40, bottom: 110, right: 20, top: 20 }
            let ttipWidth = width5/7 - ttipMargin.left - ttipMargin.right;
            let ttipHeight =height5/2.5 - ttipMargin.top - ttipMargin.bottom;
    
            // below we define the tooltip appearance and contents
            tooltipHeadline.append("text")
                .attr("id", "tooltipText")
                .attr("y", ttipHeight/4)
                .attr("x", 0)
                .attr("font-size", "11px")
                .attr("font-weight", "bold")
                .style("text-transform", "uppercase")
                .attr("fill", "#E75C33")
                .html("<b>" + d3.timeFormat("%b %Y")(new Date(data[randHeadline].time)) + " | " + data[randHeadline].site)
                // .html('"' + data[randHeadline].subtitle + '..."')
                .call(wrap, 300)

            // tooltipHeadline.append("text")
            //     .attr("id", "tooltipText")
            //     .attr("y", ttipHeight/4)
            //     .attr("x", 0)
            //     .attr("font-size", "12px")
            //     .attr("font-weight", "bold")
            //     .attr("fill", "#282828")
            //     .html("<b>" + data[randHeadline].site)
            //     .call(wrap, 300)

            tooltipHeadline.append("text")
                .attr("id", "tooltipText")
                .attr("y", ttipHeight/1.2)
                .attr("x", 0)
                // .attr("font-weight", "bold")
                .attr("font-size", "12px")
                .style("text-transform", "uppercase")
                // .attr("fill", party==="red" ? '#DD1F26':'#0076C0')
                .attr("fill", "#282828")
                .html("<b>" + '"' + data[randHeadline].headline_no_site + '"')
                .call(wrap, 300)

            // tooltipHeadline.append("text")
            //     .attr("id", "tooltipText")
            //     .attr("y", ttipHeight/4)
            //     .attr("x", 0)
            //     .attr("font-weight", "bold")
            //     .attr("font-size", "12px")
            //     // .attr("fill", party==="red" ? '#DD1F26':'#0076C0')
            //     .attr("fill", "#282828")
            //     .html("<b>" + '"' + data[randHeadline].headline_no_site + '"')
            //     .call(wrap, 300)
    
            // tooltipHeadline.append("text")
            //     .attr("id", "tooltipText")
            //     .attr("y", ttipHeight/1.5)
            //     .attr("x", 0)
            //     .attr("font-size", "11px")
            //     // .attr("font-weight", "bold")
            //     .attr("fill", "#282828")
            //     .html(d3.timeFormat("%d/%m/%Y")(new Date(data[randHeadline].time)))
            //     // .html('"' + data[randHeadline].subtitle + '..."')
            //     .call(wrap, 300)

            // tooltipHeadline.append("text")
            //     .attr("id", "tooltipText")
            //     .attr("y", ttipHeight*1.5)
            //     .attr("x", 0)
            //     .attr("font-size", "12px")
            //     .attr("font-weight", "bold")
            //     .attr("fill", "#282828")
            //     .html(data[randHeadline].site)
            //     .call(wrap, 300)
        }

        // function to draw the first chart
        function drawBubbleChart(data, chart, variable) {
            
            ttip = variable //"ttip"
            // console.log(chart, variable)
            // set dimensions
            let margin5 = {left: 50, bottom: 20, right: 30, top: 110}
            let bodywidth5 = width5 - margin5.left - margin5.right;
            let bodyheight5 = height5 - margin5.top - margin5.bottom;
            
            // filter data, removing irrelevant news outlets
            filterD = data.filter(d=>(+d.monthly_visits !== 0)&(+d[variable] !== 0)&
                                        (d.site !== "msn.com")&(d.site !== "sports.yahoo.com")&
                                        (d.site !== "finance.yahoo.com")&(d.site !== "news.google.com")&
                                        (d.site !== "news.yahoo.com")&(d.site !== "bbc.com")&
                                        (d.site !== "makeuseof.com")&(d.site !== "which.co.uk")&
                                        (d.site !== "espncricinfo.com")&(d.site !== "seekingalpha.com")&
                                        (d.site !== "prokerala.com"))

            const filterData = filterD.map((d)=>{
                if (variable==="polarity") {
                    
                    return {
                        site: d.site,
                        polarity: d[variable],
                        monthly_visits: d.monthly_visits,
                        country_of_pub: d.country_of_pub

                    } 
                
                } else {

                    return {
                        site: d.site,
                        bias: d[variable],
                        monthly_visits: d.monthly_visits,
                        country_of_pub: d.country_of_pub

                    }
                
                }
            })

            console.log("fil data", filterData)
            // create chart horizontal scale
            // var xScale = d3.scaleLinear()
            var xScale = d3.scaleSymlog()
                    .range([margin5.left*2+margin5.right, bodywidth5])
                    .domain(d3.extent(filterData, d => +d[variable]))

            // console.log(chart, variable, d3.extent(filterData, d => +d[variable]))

            // create radial scale for bubble size
            extentvisits = d3.extent(filterData, d=>+d.monthly_visits)
            // console.log(extentvisits)
            // console.log(d3.extent(filterData, d=>+d.polarity))

            var radius = d3.scaleSqrt()
                                .domain(extentvisits)
                                .range([3, 70])

            // create linear scale for logo size
            var logoScale = d3.scaleLinear()
                                .domain(extentvisits)
                                .range([18, 100])

            // console.log(filterData)

            // initialize the force simulation layout
            let simulation = d3.forceSimulation()
                        .nodes(filterData)
                        .force('charge', d3.forceManyBody().strength(1))
                        .force('x', d3.forceX().x(function(d) {
                            return xScale(+d[variable]);
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
                    circles = chart.select("#body"+variable)
                                        .selectAll('circle')
                                        .data(filterData);

                        // define logos elements
                    logos = chart.select("#body"+variable)
                                        .selectAll('image')
                                        .data(filterData);
                
                        // append the circles and define style properties and hover events (tooltip)
                        newCircles = circles.join('circle')
                            .attr("class", "forceCircles")
                            // .attr("fill", "white")
                            .style("opacity", "1")
                            // .style('stroke', "#161616")
                            .attr('r', d=>radius(+d.monthly_visits))
                            .on("mouseenter", (event, d) => {
                                showTooltipHeadline(ttip, d.site, d.country_of_pub, d.monthly_visits, [event.clientX, event.clientY], headlines, d.polarity, d)
                            })
                            .on("mousemove", (event, d) => {
                                showTooltipHeadline(ttip, d.site, d.country_of_pub, d.monthly_visits,  [event.clientX, event.clientY], headlines, d.polarity, d)
                            })
                            .on("mouseleave", (event, d) => {
                                d3.select("#tooltipHeadline").style("display", "none")
                            })
                            .on("mouseover.color", function() { d3.select(this).style("stroke", "#E75C33").style("stroke-width", "2px"); })
                            .on("mouseleave.color", function() { d3.select(this).style("stroke", "#323232").style("stroke-width", "0.6px"); })
                            
                        // append the logos and define style properties and hover events (tooltip)
                        newLogos = logos.join("svg:image")
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
                                                    : d.site=="aajtak.in" ? "translate(-25,-20)"
                                                    : d.site=="businessinsider.com" ? "translate(-14,-13)"
                                                    : "translate(-15,-15)")
                                .attr('width', d=>logoScale(+d.monthly_visits))
                                .attr("xlink:href", d=>+d.monthly_visits>150000000 ? logoData.filter(x=>x.site==d.site)[0]["link"]:'')
                                .on("mouseenter", (event, d) => {
                                    showTooltipHeadline(ttip, d.site, d.country_of_pub, d.monthly_visits, [event.clientX, event.clientY], headlines, d.polarity, d)
                                })
                                .on("mousemove", (event, d) => {
                                    showTooltipHeadline(ttip, d.site, d.country_of_pub, d.monthly_visits,  [event.clientX, event.clientY], headlines, d.polarity, d)
                                })
                                .on("mouseleave", (event, d) => {
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
                        // circles.exit().remove();
                });
                
        // add text and line to prompt the user to hover on the bubbles
        chart.append("text")
                .attr("id", "hoverGuide")
                // .attr("transform", "rotate(-90)")
                .attr("y", bodyheight5/4)
                .attr("x",bodywidth5/1.5)
                .attr("dy", "1em")
                .style("text-anchor", "start")
                // .attr("font-size", "17px")
                // .style("fill", "silver")
                // .style("font-weight", "bold")  
                // .style("font-family", "sans-serif")
                .text("Hover over a bubble to explore headlines from that outlet!")
                

        // line coordinates
        wp = +data.filter(d=>d.site==="telegraph.co.uk")[0].bias+0.01
        chart.append("line")
            .attr("y1", bodyheight5/3.2)
            .attr("x1",bodywidth5/1.2)
            .attr("x2", xScale(wp))
            .attr("y2", bodyheight5/1.85)
            .attr("id", "hoverGuideLine")
            // .attr("stroke-width", 1)
            // .attr("stroke", 'silver')

        // label the x axis
        chart.append("text")
                .attr("id", "xAxisLabel")
                // .attr("transform", "rotate(-90)")
                .attr("y", bodyheight5*1.08)
                .attr("x",margin5.left+margin5.right)
                .attr("dy", "1em")
                // .attr("font-size", "17px")
                .style("text-anchor", "start")
                // .style("fill", "silver")
                // .style("font-weight", "bold")  
                // .style("font-family", "sans-serif")
                .text(variable==="bias"?"← Less Biased Language":"← Less Polarizing Language")
               
    
        chart.append("text")
                .attr("id", "xAxisLabel")
                // .attr("transform", "rotate(-90)")
                .attr("y", bodyheight5*1.08)
                .attr("x",bodywidth5)
                .attr("dy", "1em")
                // .attr("font-size", "17px")
                .style("text-anchor", "end")
                // .style("fill", "silver")
                // .style("font-weight", "bold")  
                // .style("font-family", "sans-serif")
                .text(variable==="bias"?"More Biased Language →":"More Polarizing Language →")
                
        // create the dataset for the bubble legend
        legendData = [{level: "", radius: radius(10000000), y: bodyheight5+75, x: bodywidth5/2.2, anchor:"end", xtext: bodywidth5/2.235, ytext: bodyheight5+53,id: ""}, 
        {level: "", radius: radius(100000000), y: bodyheight5+75, x: bodywidth5/2.05,id: ""}, 
        {level: "1B Monthly Viewers", radius: radius(1000000000), y: bodyheight5+75, x: bodywidth5/1.85, anchor:"middle", xtext: bodywidth5/1.85, ytext: bodyheight5+46,id: ""},
        {level: "?", radius: radius(30000000), y: bodyheight5*1.08+11, x: bodywidth5+15, anchor:"middle", xtext: bodywidth5+15, ytext: bodyheight5*1.08+16,id: "info"}]

        // make the bubble legend and initialize the tooltip for methodology info if they hover on the "#info" circle
        legend = chart.append("g")
                .selectAll("circle")
                .data(legendData)
                .join('circle')
                .attr("cx", d => d.x)
                .attr("cy", d => d.y)
                .attr("r", d => d.radius)
                // .attr("fill","#161616")
                // .attr("fill","none")
                // .attr("stroke","lightgrey")
                .attr("class","legendBubble")
                .on("mouseover", (event, d)=>d.id==="info" ? tooltipInfo(event.clientX-150, event.clientY-420):"")
                .on("mouseleave", (event, d)=>d3.select("#tooltipInfo").style("visibility", "hidden"))
            
        textLegend = chart.append("g")
            // textLegend = legend.append("g")
                .selectAll("text")
                .data(legendData)
                .join("text")
                .text(d=>d.level)
                .attr("x", d => d.xtext)
                .attr("y", d => d.ytext)
                .attr("class", "themesText")
                .style("text-anchor", d=>d.anchor)
                // .attr("fill","lightgrey")
                .attr("id", "info") 
                .call(wrap, 10)
                .on("mouseover", (event, d)=>d.id==="info" ? tooltipInfo(event.clientX-150, event.clientY-420):"")
                .on("mouseleave", (event, d)=>d3.select("#tooltipInfo").style("visibility", "hidden"))

        // filter interactions with dropdowns
         // Search functionality
        d3.select("#countrydropdown").on("change", function() {

            const selection = d3.select(this).property("value")

            // selected_city = d3.event.target.value;
            
            // console.log(selection.toLowerCase())
            // console.log(circles._groups[0].filter(d=>d.__data__.country_of_pub.toLowerCase() === selection))
            // console.log(circles._groups[0].filter(d=>d.__data__.country_of_pub.toLowerCase().match(selection.toLowerCase())))

            // allCircs = Array.from(d3.selectAll(".forceCircles")._groups[0])
            allCircs = d3.selectAll(".forceCircles")
            allLogos = d3.selectAll(".forceLogos")
            
            // console.log(allCircs.filter(d=>d.__data__.country_of_pub.toLowerCase() === selection))
            // console.log("up",circles)
            // console.log("all",allCircs)
            // console.log(filterData.map(d=>d.country_of_pub.toLowerCase() === selection.toLowerCase()))

            // circles.style("stroke", d=>d.country_of_pub.toLowerCase() === selection.toLowerCase()?"#E75C33":"#282828")
            // circles.style("stroke-width", d=>d.country_of_pub.toLowerCase() === selection.toLowerCase()?"2px":"0.6px")
            allCircs.style("fill", d=>d.country_of_pub.toLowerCase() === selection.toLowerCase()?"#F7DC5B":"#FEFAF1")
            allCircs.style("opacity", d=>d.country_of_pub.toLowerCase() === selection.toLowerCase()?"1":
                                     selection===""?"1":"0.2")
            allLogos.style("opacity", d=>d.country_of_pub.toLowerCase() === selection.toLowerCase()?"1":
                                     selection===""?"1":"0.2")
                    
            })

        d3.select("#pubdropdown").on("change", function() {

            const selection = d3.select(this).property("value")

            // selected_city = d3.event.target.value;
            
            // console.log(selection.toLowerCase())
            // console.log(circles._groups[0].filter(d=>d.__data__.country_of_pub.toLowerCase() === selection))
            // console.log(circles._groups[0].filter(d=>d.__data__.site.toLowerCase().match(selection.toLowerCase())))

            allCircs = d3.selectAll(".forceCircles")
            allLogos = d3.selectAll(".forceLogos")

            // console.log(filterData.map(d=>d.country_of_pub.toLowerCase() === selection.toLowerCase()))

            // circles.style("stroke", d=>d.country_of_pub.toLowerCase() === selection.toLowerCase()?"#E75C33":"#282828")
            // circles.style("stroke-width", d=>d.country_of_pub.toLowerCase() === selection.toLowerCase()?"2px":"0.6px")
            allCircs.style("fill", d=>d.site.toLowerCase() === selection.toLowerCase()?"#F7DC5B":"#FEFAF1")
            allCircs.style("opacity", d=>d.site.toLowerCase() === selection.toLowerCase()?"1":
                                        selection===""?"1":"0.2")
            allLogos.style("opacity", d=>d.site.toLowerCase() === selection.toLowerCase()?"1":
                                     selection===""?"1":"0.2")
                    
            })

        }

        // dropdown menu population
        // line functions
        function populateDropdown(data, div, attribute) {
            var select = d3.select(div)

            const unique_countries = d3.map(data, d=>d[attribute]).filter(onlyUnique);
            attribute==="country_of_pub"?unique_countries.unshift("Country..."):unique_countries.unshift("Newsroom...")
            // unique_countries.unshift("")
            // console.log("unique",unique_countries)

            select.selectAll("option")
            .data(unique_countries)
            .join("option")
                .attr("value", d=>d==="Country..."||d==="Newsroom..."?"":d)
                .text(d=>d);
        }

        // unique values from array
        function onlyUnique(value, index, self) {
            return self.indexOf(value) === index;
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