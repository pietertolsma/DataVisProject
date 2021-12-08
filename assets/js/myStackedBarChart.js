function myStackedBarChart(input_data = undefined, size = undefined) {

    // Default width and height if not defined using .style("width", width) etc
    let width = typeof size === 'undefined' ? 720 : size.width;
    let height = typeof size === 'undefined' ? 480 : size.height;

    let data = input_data
    console.log(data);

    let margin = {
        top: 0,
        right: 90,
        bottom: 0,
        left: 90
    }

    // All different categories for expenditures
    var subgroups = new Array("SMART AND INCLUSIVE GROWTH", "SUSTAINABLE GROWTH: NATURAL RESOURCES",
        "SECURITY AND CITIZENSHIP", "GLOBAL EUROPE", "ADMINISTRATION", "SPECIAL INSTRUMENTS");

    // All different countries
    var groups = d3.map(data, function(d) {
        return (d.country);
    })


    function my(selection) {
        const svg = d3.select("#stackedBarChart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // Transpose the data into layers
        var dataset = d3.stack()(["SMART AND INCLUSIVE GROWTH", "SUSTAINABLE GROWTH: NATURAL RESOURCES",
            "SECURITY AND CITIZENSHIP", "GLOBAL EUROPE", "ADMINISTRATION", "SPECIAL INSTRUMENTS"
        ].map(function(specifics) {
            return data.map(function(d) {
                return { x: d.country, y: +d[specifics] };
            });
        }));

        console.log("ww")

        // Set x, y and colors
        var x = d3.scaleBand()
            .domain(["SMART AND INCLUSIVE GROWTH", "SUSTAINABLE GROWTH: NATURAL RESOURCES",
                "SECURITY AND CITIZENSHIP", "GLOBAL EUROPE", "ADMINISTRATION", "SPECIAL INSTRUMENTS"
            ])
            .range([10, width - 10], 0.02);

        var y = d3.scaleLinear()
            .domain([0, d3.max(dataset, function(d) { return d3.max(d, function(d) { return d.y0 + d.y; }); })])
            .range([height, 0]);

        var colors = ['#e41a1c', '#377eb8', '#4daf4a', '#e41a1c', '#377eb8', '#4daf4a']


        // Define and draw axes
        var yAxis = d3.axisLeft(y)
            .ticks(5)
            .tickSize(-width, 0, 0)
            .tickFormat(function(d) { return d });

        var xAxis = d3.axisBottom(x)
            .tickFormat(function(d) { return d });

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);


        // Create groups for each series, rects for each segment 
        var groups = svg.selectAll("g.cost")
            .data(dataset)
            .enter().append("g")
            .attr("class", "cost")
            .style("fill", function(d, i) { return colors[i]; });

        var rect = groups.selectAll("rect")
            .data(function(d) { return d; })
            .enter()
            .append("rect")
            .attr("x", function(d) { return x(d.x); })
            .attr("y", function(d) { return y(d.y0 + d.y); })
            .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); })
            .attr("width", x.bandwidth())
            .on("mouseover", function() { tooltip.style("display", null); })
            .on("mouseout", function() { tooltip.style("display", "none"); })
            .on("mousemove", function(d) {
                var xPosition = d3.mouse(this)[0] - 15;
                var yPosition = d3.mouse(this)[1] - 25;
                tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
                tooltip.select("text").text(d.y);
            });


        // Draw legend
        var legend = svg.selectAll(".legend")
            .data(colors)
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(30," + i * 19 + ")"; });

        legend.append("rect")
            .attr("x", width - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", function(d, i) { return colors.slice().reverse()[i]; });

        legend.append("text")
            .attr("x", width + 5)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "start")
            .text(function(d, i) {
                switch (i) {
                    case 0:
                        return "Special Instruments";
                    case 1:
                        return "Administration";
                    case 2:
                        return "Global Europe";
                    case 3:
                        return "Security and Citizenship";
                    case 4:
                        return "Sustainable growth";
                    case 5:
                        return "Smarth growth"
                }
            });


        // Prep the tooltip bits, initial display is hidden
        var tooltip = svg.append("g")
            .attr("class", "tooltip")
            .style("display", "none");

        tooltip.append("rect")
            .attr("width", 30)
            .attr("height", 20)
            .attr("fill", "white")
            .style("opacity", 0.5);

        tooltip.append("text")
            .attr("x", 15)
            .attr("dy", "1.2em")
            .style("text-anchor", "middle")
            .attr("font-size", "12px")
            .attr("font-weight", "bold");
    }



    my.width = function(value) {
        if (!arguments.length) return width;
        width = value;
        return my;
    }

    my.height = function(value) {
        if (!arguments.length) return height;
        height = value;
        return my;
    }

    return my();



}