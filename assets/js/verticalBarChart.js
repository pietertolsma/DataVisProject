
// http://bl.ocks.org/NelsonMinar/11524926
// https://bl.ocks.org/hrecht/f84012ee860cb4da66331f18d588eee3

// https://observablehq.com/@d3/diverging-bar-chart
function verticalBarChart(state, input_data = undefined, size = undefined) {

    // Default width and height if not defined using .style("width", width) etc
    let width = typeof size === 'undefined' ? 720 : size.width;
    let height = typeof size === 'undefined' ? 480 : size.height;

    let COLORS = ["#18c61a", "#9817ff", "#d31911", "#24b7f1", "#fa82ce", "#736c31", "#1263e2", "#18c199", "#ed990a", "#f2917f", "#7b637c", "#a8b311", "#a438c0", "#d00d5e", "#1e7b1d", "#05767b", "#aaa1f9", "#a5aea1", "#a75312", "#026eb8", "#94b665", "#91529e", "#caa74f", "#c90392", "#a84e5d", "#6a4cf1", "#1ac463"];

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
    }

    function handleMouseOut(d, i) {
        $(this).attr("opacity", 1);
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
        svg = selection.append("g").attr("transform", "translate(" + parseInt((width / 2) - 60) + "," + margin.top + ")");

        let bars = svg.selectAll(".bar")
            .data(data)
            .enter()
            .append("g")
            .attr("class", "subbar");
        
        bars.append("rect")
            .attr("stroke", (d, i) => COLORS[i])
            .attr("stroke-width", 0)
            .attr("fill", (d, i) => COLORS[i])
            .attr("y", (d, i) => {
                let sofar = 0;
                for (let j = 0; j < i; j++) {
                    sofar += data[j].value;
                }
                return sofar * rheight + 4*i;
            })
            .attr("height", (d, i) => rheight * d.value)
            .attr("width", 120)
            .attr("x", (d) => {
                return 0;
            })
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut)
            .on("click", handleClick)
        
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
            .attr("class", "subbar");

        bars.append("rect")
            .attr("stroke", (d, i) => COLORS[i])
            .attr("stroke-width", 0)
            .attr("fill", (d, i) => COLORS[i])
            .attr("y", (d, i) => {
                let sofar = 0;
                for (let j = 0; j < i; j++) {
                    sofar += data[j].value;
                }
                return sofar * rheight + 4*i;
            })
            .attr("height", (d, i) => rheight * d.value)
            .attr("width", 120)
            .attr("x", (d) => {
                return 0;
            })
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut)
            .on("click", handleClick)
    }

    return my;
}