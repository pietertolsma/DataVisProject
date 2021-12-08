
// http://bl.ocks.org/NelsonMinar/11524926
// https://bl.ocks.org/hrecht/f84012ee860cb4da66331f18d588eee3

// https://observablehq.com/@d3/diverging-bar-chart
function verticalBarChart(state, category, input_data = undefined, size = undefined) {

    // Default width and height if not defined using .style("width", width) etc
    let width = typeof size === 'undefined' ? 720 : size.width;
    let height = typeof size === 'undefined' ? 480 : size.height;

    let tooltip = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);

    function dummy_data() {
        return [
            {
                "key" : "category1",
                "value" : 1900
            },
            {
                "key" : "category2",
                "value" : 2900
            },
            {
                "key" : "category3",
                "value" : 900
            },
            {
                "key" : "category4",
                "value" : 3900
            }
        ]
    }

    function normalize_data(dat) {
        let sum = 0;
        dat.forEach((d, i) => sum += d.value);
        dat.forEach((d, i) => dat[i].value = d.value / sum);
        dat.sort((a, b) => d3.ascending(a.value, b.value))
        return dat;
    }

    let raw_data = input_data;

    let data = normalize_data(dummy_data());
    function handleMouseOver(d, i) {
        $(this).attr("opacity", 0.6);

        tooltip.style("opacity", 1)
            .style("left", d.clientX + "px")
            .style("top", (d.layerY) + "px")
            .text(category[d.originalTarget.__data__.key].desc);
        console.log(d);
    }

    function handleMouseOut(d, i) {
        $(this).attr("opacity", 1);
        tooltip.style("opacity", 0);
    }

    function handleClick(d, i) {
        state.update(d.target.__data__.key, d.target.__data__.key);
    }


    let margin = {
        top: 0,
        right: 0,
        bottom: 200,
        left: 0
    }

    let rheight = height - margin.top - margin.bottom;

    let svg = undefined;

    function my(selection) {
        svg = selection.append("g").attr("transform", "translate(" + parseInt(0) + "," + margin.top + ")");

        let bars = svg.selectAll(".bar")
            .data(data)
            .enter()
            .append("g")
            .attr("class", "subbar")
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut)
            .on("click", handleClick);
        
        bars.append("rect")
            .attr("stroke", (d, i) => category[d.key].color)
            .attr("stroke-width", 0)
            .attr("fill", (d, i) => category[d.key].color)
            .attr("y", (d, i) => {
                let sofar = 0;
                for (let j = 0; j < i; j++) {
                    sofar += data[j].value;
                }
                return sofar * rheight;
            })
            .attr("height", (d, i) => rheight * d.value)
            .attr("width", width)
            .attr("x", (d) => {
                return 0;
            });

        bars.append("text")
            .text((d, i) => d.value > 0.02 ? d.key + " (" + Math.round(d.value * 1000) / 10 + "%)" : "")
            .attr("text-anchor", "middle")
            .attr("font-weight", 600)
            .style("font-size", "0.8em")
            .attr("x", (d, i) => width/2)
            .attr("y", (d, i) => {
                let sofar = 0;
                for (let j = 0; j < i; j++) {
                    sofar += data[j].value;
                }
                return sofar * rheight + d.value * rheight/2 + 5;
            })
        
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
        data = normalize_data(new_data);
    } 

    my.update = function() {
        svg.selectAll(".subbar").remove();

        let bars = svg.selectAll(".bar")
            .data(data)
            .enter()
            .append("g")
            .attr("class", "subbar")
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut)
            .on("click", handleClick);

        bars.append("rect")
            .attr("stroke", (d, i) => category[d.key].color)
            .attr("stroke-width", 0)
            .attr("fill", (d, i) => category[d.key].color)
            .attr("y", (d, i) => {
                let sofar = 0;
                for (let j = 0; j < i; j++) {
                    sofar += data[j].value;
                }
                return sofar * rheight;
            })
            .attr("height", (d, i) => rheight * d.value)
            .attr("width", width)
            .attr("x", (d) => {
                return 0;
            });

        bars.append("text")
            .text((d, i) => d.value > 0.02 ? d.key + " (" + Math.round(d.value * 1000) / 10 + "%)" : "")
            .attr("text-anchor", "middle")
            .attr("font-weight", 600)
            .style("font-size", "0.8em")
            .attr("x", (d, i) => width/2)
            .attr("y", (d, i) => {
                let sofar = 0;
                for (let j = 0; j < i; j++) {
                    sofar += data[j].value;
                }
                return sofar * rheight + d.value * rheight/2 + 5;
            })
    }

    return my;
}