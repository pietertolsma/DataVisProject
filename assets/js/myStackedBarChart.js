function myStackedBarChart(input_data = undefined, size = undefined) {

    // Default width and height if not defined using .style("width", width) etc
    let width = typeof size === 'undefined' ? 720 : size.width;
    let height = typeof size === 'undefined' ? 480 : size.height;

    let data = dictToPairObject(input_data);
    //data = data.sort((a, b) => d3.ascending(a.values, b.values));
    console.log(data);

    let margin = {
            top: 0,
            right: 90,
            bottom: 0,
            left: 90
        },
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    var subgroups = new Array("SMART AND INCLUSIVE GROWTH", "SUSTAINABLE GROWTH: NATURAL RESOURCES",
        "SECURITY AND CITIZENSHIP", "GLOBAL EUROPE", "ADMINISTRATION", "SPECIAL INSTRUMENTS");
    console.log(subgroups);

    var groups = d3.map(data, function(d) {
        return (d.key);
    })


    function my(selection) {
        var svg = d3.select("#stackedBarChart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // Add X axis
        var x = d3.scaleBand()
            .domain(groups)
            .range([0, width])
            .padding([0.2])
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickSizeOuter(0));

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, 60])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));





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