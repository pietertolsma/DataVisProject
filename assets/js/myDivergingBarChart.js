
// http://bl.ocks.org/NelsonMinar/11524926
// https://bl.ocks.org/hrecht/f84012ee860cb4da66331f18d588eee3

// https://observablehq.com/@d3/diverging-bar-chart
function myDivergingBarChart(input_data = undefined, size = undefined) {

    // Default width and height if not defined using .style("width", width) etc
    let width = typeof size === 'undefined' ? 720 : size.width;
    let height = typeof size === 'undefined' ? 480 : size.height;


    let data = dictToPairObject(input_data);
    data = data.sort((a, b) => d3.ascending(a.value, b.value));
    positiveCountries = data.filter((obj) => obj.value > 0);
    negativeCountries = data.filter((obj) => obj.value <= 0);
    mean = Object.values(input_data).reduce((acc, curr) => acc + curr) / Object.values(input_data).length;
    console.log(mean);

    function handleMouseOver(d, i) {
        d3.select(this).attr("opacity", 0.4);
    }

    function handleMouseOut(d, i) {
        d3.select(this).attr("opacity", 1);
    }


    let margin = {
        top: 0,
        right: 100,
        bottom: 0,
        left: 120
    }

    function my(selection) {
        let svg = selection.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        let x = d3.scaleLinear()
                .range([0, width - margin.left - margin.right])
                .domain([d3.min(data, (d) => d.value), d3.max(data, (d) => d.value)]);
        
        let yPos = d3.scaleBand()
                .rangeRound([(height * positiveCountries.length / data.length) - margin.top - margin.bottom, 0])
                .padding(0.1)
                .domain(positiveCountries.map((d) => d.key));
        
        let yNeg = d3.scaleBand()
                .rangeRound([(height * negativeCountries.length / data.length) - margin.top - margin.bottom, 0])
                .padding(0.1)
                .domain(negativeCountries.map((d) => d.key));

        let yPosAxis = d3.axisLeft(yPos).tickSize(0);
        let yNegAxis = d3.axisRight(yNeg).tickSize(0);


        let gy = svg.append("g")
            .attr("class", "y axis")
        
        let gyPos = gy.append("g").call(yPosAxis);

        let gyNeg= gy.append("g")
            .attr("class", "y axis")
            .attr("transform", `translate(0,${(height * positiveCountries.length / data.length) - margin.top - margin.bottom})`)
            .call(yNegAxis);
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