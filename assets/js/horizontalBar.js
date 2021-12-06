// http://bl.ocks.org/NelsonMinar/11524926
// https://bl.ocks.org/hrecht/f84012ee860cb4da66331f18d588eee3

// https://observablehq.com/@d3/diverging-bar-chart

function horizontalBar(input_data = undefined, size = undefined) {

    function generate_dummy_data(from, to) {
        let data = []
        for (let i = 0; i < EU_COUNTRIES.length; i++) {
            data.push({
                "key": [EU_COUNTRIES[i]],
                "value": Math.random() * (to - from) - from
            });
        }
        return data;
    }

    // Default width and height if not defined using .style("width", width) etc
    let width = typeof size === 'undefined' ? 720 : size.width;
    let height = typeof size === 'undefined' ? 480 : size.height;

    let margin = {
        top: 0,
        right: 100,
        bottom: 0,
        left: 120
    }

    console.log(height);

    let data = (typeof input_data === 'undefined' ? generate_dummy_data(0, 1000) : dictToPairObject(input_data));
    data = data.sort((a, b) => d3.ascending(a.value, b.value));
    console.log(data)

    function handleMouseOver(d, i) {
        d3.select(this).attr("opacity", 0.4);
    }

    function handleMouseOut(d, i) {
        d3.select(this).attr("opacity", 1);
    }


    function my(selection) {
        let svg = selection.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        let x = d3.scaleLinear()
            .range([0, width - margin.left - margin.right])
            .domain([d3.min(data, (d) => d.value), d3.max(data, (d) => d.value)]);

        let y = d3.scaleBand()
            .rangeRound([height - margin.top - margin.bottom, 0])
            .padding(0.1)
            .domain(data.map((d) => d.key));

        let yAxis = d3.axisLeft(y).tickSize(0);

        let gy = svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        let bars = svg.selectAll(".bar")
            .data(data)
            .enter()
            .append("g");

        bars.append("rect")
            .style("fill", COLORS.EU_BLUE)
            .attr("y", (d) => y(d.key))
            .attr("height", y.bandwidth())
            .attr("x", 0)
            .attr("width", (d) => x(d.value))
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut);

        bars.append("text")
            .attr("class", "label")
            .attr("y", (d) => y(d.key) + y.bandwidth() / 2 + 4)
            .attr("x", (d) => x(d.value) + 3)
            .style("fill", "black")
            .text((d) => Math.round(d.value));

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