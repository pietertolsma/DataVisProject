
// http://bl.ocks.org/NelsonMinar/11524926
// https://bl.ocks.org/hrecht/f84012ee860cb4da66331f18d588eee3

// https://observablehq.com/@d3/diverging-bar-chart
function myDivergingBarChart(state, input_data = undefined, size = undefined) {

    // Default width and height if not defined using .style("width", width) etc
    let width = typeof size === 'undefined' ? 720 : size.width;
    let height = typeof size === 'undefined' ? 480 : size.height;


    let raw_data = input_data;
    let data = undefined;
    positiveCountries = {};
    negativeCountries = {};
    mean = 0;

    function handleMouseOver(d, i) {
        state.update(d.target.__data__.key);
    }

    function handleMouseOut(d, i) {
        state.update("none");
    }

    function handleClick(d, i) {
        state.update(d.target.__data__.key, d.target.__data__.key);
    }


    let margin = {
        top: 0,
        right: 90,
        bottom: 0,
        left: 90
    }

    let svg = undefined;

    function my(selection) {
        svg = selection.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        let xPos = d3.scaleLinear()
                .range([0, width / 2 - margin.left - margin.right])
                .domain([0, d3.max(data, (d) => d.value)]);
        
        let xNeg = d3.scaleLinear()
                .range([0, width / 2 - margin.left - margin.right])
                .domain([d3.min(data, (d) => d.value), 0]);
        
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
            .attr("transform", `translate(${(width - margin.left - margin.right)/2},0)`)
            .attr("class", "y axis")
        
        let gyPos = gy.append("g")
            .call(yPosAxis);

        let gyNeg= gy.append("g")
            .attr("transform", `translate(0,${(height * positiveCountries.length / data.length) - margin.top - margin.bottom})`)
            .call(yNegAxis);

        let bars = svg.selectAll(".bar")
            .data(data)
            .enter()
            .append("g");

        bars.append("rect")
            .attr("stroke", "black")
            .attr("stroke-width", 0)
            .attr("fill", (d) => raw_data[d.key] >= 0 ? "#2ecc71" : "red")
            .attr("y", (d) => {
                if (raw_data[d.key] >= 0) {
                    return yPos(d.key);
                }
                return (height * positiveCountries.length / data.length) - margin.top - margin.bottom + yNeg(d.key);
            })
            .attr("height", yPos.bandwidth())
            .attr("x", (d) => {
                if (raw_data[d.key] >= 0) {
                    return (width - margin.left - margin.right) / 2;
                }
                
                return margin.left + xNeg(d.value);
            })
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut)
            .on("click", handleClick)
            .attr("width", 0)
                .transition()
                .duration(750)
                .attr("width", (d) => {
                if (raw_data[d.key] >= 0) {
                    return xPos(d.value)
                }
                return (width / 2 - margin.left - margin.right) - xNeg(d.value);
                });

        bars.append("text")
            .attr("class", "divergeChartLabel")
            .attr("y", (d) => {
                if (raw_data[d.key] >= 0) {
                    return yPos(d.key) + yPos.bandwidth() - 3;
                }
                return (height * positiveCountries.length / data.length) - margin.top - margin.bottom + yNeg(d.key) + yNeg.bandwidth() - 3;
            })
            .attr("x", (d) => {
                if (raw_data[d.key] >= 0) {
                    return xPos(d.value) + (width - margin.left - margin.right)/2 + 3;
                }
                
                return margin.left + xNeg(d.value) - 45;
            })
            .style("fill", "black")
            .text((d) => numberWithCommas(Math.round(d.value)) + "M")
            .attr("opacity", 0)
            .transition()
            .duration(800)
            .attr("opacity", 1);
        
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

    my.setData = function(new_data) {
        raw_data = new_data;
        data = dictToPairObject(new_data);
        data = data.sort((a, b) => d3.ascending(a.value, b.value));
        positiveCountries = data.filter((obj) => obj.value >= 0 && obj.key);
        negativeCountries = data.filter((obj) => obj.value < 0);
        mean = Object.values(new_data).reduce((acc, curr) => acc + curr) / Object.values(new_data).length;
    
    } 

    my.update = function() {
        svg.selectAll("rect")
            .attr("opacity", (d, i) => {
                return d.key === state.highlightedCountry ? 0.4 : 1;
            })
            .style("stroke-width", (d, i) => {
                return (d.key === state.selectedCountry | d.key === state.selectedCountry2) ? 2 : 0;
            });
            
        // .each((d, i) => {
        //     if (d.key === state.highlightedCountry) {
        //         d3.select(this).attr("opacity", 0.4);
        //     } else {
        //         d3.select(this).attr("opacity", 1);
        //     }
        // })
    }

    return my;
}