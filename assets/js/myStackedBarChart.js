function myStackedBarChart(input_data = undefined, size = undefined) {

    // Default width and height if not defined using .style("width", width) etc
    let width = typeof size === 'undefined' ? 720 : size.width;
    let height = typeof size === 'undefined' ? 480 : size.height;

    let data = dictToPairObject(input_data);
    data = data.sort((a) => d3.ascending(a.value));
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
        return (d.value.country);
    })


    function my(selection) {
        const svg = d3.select("#stackedBarChart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // Add X axis
        const x = d3.scaleBand()
            .domain(groups)
            .range([0, width])
            .padding([0.2])
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickSizeOuter(0));

        // Add Y axis
        const y = d3.scaleLinear()
            .domain([0, 100000])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        // color palette = one color per subgroup
        const color = d3.scaleOrdinal()
            .domain(subgroups)
            .range(['#e41a1c', '#377eb8', '#4daf4a', '#e41a1c', '#377eb8', '#4daf4a'])


        //stack the data? --> stack per subgroup
        const stackedData = d3.stack()
            .keys(subgroups)
            (data)

        // Show the bars
        svg.append("g")
            .selectAll("g")
            // Enter in the stack data = loop key per key = group per group
            .data(stackedData)
            .enter().append("g")
            .attr("fill", function(d) {
                return color(d.key);
            })
            .selectAll("rect")
            // enter a second time = loop subgroup per subgroup to add all rectangles
            .data(function(d) {
                return d;
            })
            .enter().append("rect")
            .attr("x", function(d) {
                return x(d.data.group);
            })
            .attr("y", function(d) {
                return y(d[1]);
            })
            .attr("height", function(d) {
                return y(d[0]) - y(d[1]);
            })
            .attr("width", x.bandwidth())
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

    return my;



}