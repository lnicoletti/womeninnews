    // constants for charts
    let width5 = 1500;
    let height5 = 540;

    let heightCluster =  height5*3

    // constants for clusterchart
    padding = 1.5, // separation between same-color nodes
    clusterPadding = 6, // separation between different-color nodes
    maxRadius = 12;

    Promise.all([
        // d3.csv("https://cdn.jsdelivr.net/gh/lnicoletti/womeninnews@d5a987c/hosted_data/headlines_site.csv"),
        d3.csv("../data/processed/headlines_site_rapi.csv"),
        d3.csv("../data/processed/country_time_freqrank_rapi_clean.csv", d3.autoType),
        // d3.csv("https://cdn.jsdelivr.net/gh/lnicoletti/womeninnews@d5a987c/hosted_data/countries_clusters.csv"),
        // d3.csv("https://raw.githubusercontent.com/lnicoletti/womeninnews/master/hosted_data/headlines_cl_sent_pol.csv"),
        d3.csv("../data/processed/headlines_cl_sent_sm_rapi.csv"),
        d3.csv("../data/processed/country_time_freqrank_rapi_clean.csv", d3.autoType),
        d3.csv("../data/processed/polarity_comparison.csv", d3.autoType),
      ])
        .then((datasets) => {
            // define each dataset
            headlinesSite = datasets[0]
            countries_data = datasets[1]
            // countriesCls = datasets[1]
            headlines = datasets[2]
            tempWords = datasets[3]
            polComparison = datasets[4]
            
            // 1) bar charts
            drawBar(countries_data, "#chart0", "All", 8)
            drawBar(countries_data, "#chart1", "India", 5)    
            drawBar(countries_data, "#chart2", "USA", 5)   
            drawBar(countries_data, "#chart3", "UK", 5)   
            drawBar(countries_data, "#chart4", "South Africa", 5) 
            
        })


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

            //countries_data = if (selected_country == "All"){return}

            // set the dimensions and margins of the graph
            var margin = {top: 50, right: 10, bottom: 10, left: 10},
            width = 150 - margin.left - margin.right,
            height = 200 - margin.bottom - margin.top;

            // data = function(d) {if (selected_country !='All') {return countries_data.filter(d=>d.country == selected_country)}
            // else {return countries_data}}
            // console.log(data)

            data = [{country:"South Africa", data:countries_data.filter(d=>d.country == selected_country)}, 
            {country:"USA", data:countries_data.filter(d=>d.country == selected_country)}, 
            {country:"India", data:countries_data.filter(d=>d.country == selected_country)}, 
            {country:"UK", data:countries_data.filter(d=>d.country == selected_country)},
            {country:'All', data: countries_data}]

            dataBars = data.filter(c=>c.country===selected_country)[0]['data']
            // dataBars = countries_data.filter(d=>d.country == selected_country)
            dataBars = dataBars.filter(d=>d.year == 2020)
            //console.log(dataBars)
            dataBars = dataBars.sort(function(a,b) { return d3.descending(+a.frequency, +b.frequency) })
            //console.log(dataBars)
            
            top10 = dataBars.filter(function(d,i){ return i<word_count })
            console.log(top10)


            flags = [{country:"South Africa", flag:"flags/south-africa.svg"}, {country:"USA", flag:"flags/united-states.svg"}, 
                     {country:"India", flag:"flags/india.svg"}, {country:"UK", flag:"flags/united-kingdom.svg"}, {country: 'All', flag:'None'}]

            countryNames = [{country:"South Africa", name:"South Africa"}, {country:"USA", name:"United States of America"}, 
                     {country:"India", name:"India"}, {country:"UK", name:"United Kingdom"}, {country: 'All', name:'All 4 countries'}]
        
            var svg = d3.select(chart)
            .append("svg")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 "+ width +"," + (height + margin.top)+"")
            // .attr("class", "svgBars")
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
            .padding(0.1);      
             
            //Bars
            barHeight = height/5 - 10
            barWidth = width - 30
            svg.selectAll("myRect")
            .data(top10)
            .join("rect")
            //.attr("x", x(0) )
            .attr("y", function(d) { return y(d.word); })
            .attr("width", barWidth)
            .attr("height", barHeight)
            .attr("class", "scoreChartBar")
            .style("fill", function(d) { if (d.word == 'man') {return 'yellow'} else {return 'white'}})

            svg.selectAll("g")
            .data(top10)
            .join("text")
            .attr("x", barWidth/2.5)
            .attr("y", function(d) { return y(d.word) + barHeight/1.5; })
            .attr("text-anchor", "left")
            .text(function(d) { return d.word; })
            .style("font-weight", function(d) { if (d.word == 'man') {return 'bold'} else {return 'normal'}})
            .style("font-size", 9)

        

            svg.append("svg:image")
            .attr('width', "20px")
            .attr("x", (width / 3))             
            .attr("y", 0 - (margin.top / 5))           
            .attr("transform", "translate(0, -40)")
            .attr("xlink:href", flags.filter(c=>c.country===selected_country)[0]['flag'])

            svg.append("text")
            .attr("x", (width / 2.5))             
            .attr("y", 0-margin.top/4)
            .attr("text-anchor", "middle")  
            .text(countryNames.filter(c=>c.country===selected_country)[0]['name'])
            .attr("class", "scoreChartTitle");

        }
