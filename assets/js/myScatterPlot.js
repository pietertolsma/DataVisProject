
// http://bl.ocks.org/NelsonMinar/11524926
// https://bl.ocks.org/hrecht/f84012ee860cb4da66331f18d588eee3

// https://www.d3-graph-gallery.com/graph/scatter_animation_start.html

function scatterPlot(input_data = undefined, size = undefined) {

    function generate_dummy_data(from, to) {
        let data = []
        for (let i = 0; i < EU_COUNTRIES.length; i++) {
            data.push({
                "x" : Math.random() * (to - from) - from,
                "y" : Math.random() * (to - from) - from,
                "r" : Math.random() * 15
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
        left: 100
    }

    let data = (typeof input_data === 'undefined' ? generate_dummy_data(0, 50000) : dictToPairObject(input_data));
    data = data.sort((a, b) => d3.ascending(a.value, b.value));

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
            .domain([0, 0])
            .range([0, width]);

        svg.append("g")
            .attr("class", "myXAxis")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .attr("opacity", 0);

        let y = d3.scaleLinear()
            .domain([0, 50000])
            .range([height, 0]);

        svg.append("g")
            .call(d3.axisLeft(y));

        svg.append("g")
            .call(d3.axisLeft(y));

        svg.append("g")
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
                .attr("cx", (d) => x(d.x))
                .attr("cy", (d) => y(d.y))
                .attr("r", (d) => d.r)
                .style("fill", "black")

        x.domain([0, 50000]);
        svg.select(".myXAxis")
            .transition()
            .duration(2000)
            .attr("opacity", "1")
            .call(d3.axisBottom(x));

        svg.selectAll("circle")
            .transition()
            .delay((d, i) => i*3)
            .duration(2000)
            .attr("cx", (d) => x(d.x))
            .attr("cy", (d) => y(d.y));

            
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