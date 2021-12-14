

// http://bl.ocks.org/NelsonMinar/11524926

function europeMap(state, input_data, width=720, height=480) {

    state.highlightedCountry = "Netherlands";

    function generate_dummy_data(from, to) {
        let data = {}
        for (let i = 0; i < EU_COUNTRIES.length; i++) {
            data[EU_COUNTRIES[i]] = Math.random() * (to - from) - from;
        }
        return data;
    }

    let data = generate_dummy_data(0, 1000000);

    let tooltip = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);

    let min = Number.MAX_VALUE,
        max = -Number.MAX_VALUE;
    
    function handleMouseOver(d, i) {
        state.update(d.target.__data__.properties.NAME);
    }

    function handleMouseOut(d, i) {
        state.update("none");
    }

    function handleClick(d, i) {
        let name = d.target.__data__.properties.NAME;
        state.update(name, name);
    }


    function my(selection) {

        new Promise((resolve, reject) => {
            resolve(d3.json('https://pietertolsma.github.io/DataVisProject/data/raw_data/europe.geojson'));
        })
        .then((bb) => {
            let projection = d3.geoEqualEarth();
            projection.fitSize([width, height], bb);
        
            let geoGenerator = d3.geoPath()
                .projection(projection);
        
            selection.append('g').selectAll('path')
                .data(bb.features)
                .join('path')
                .attr("class", "individualCountry")
                .attr('d', geoGenerator)
                .on("mouseover", handleMouseOver)
                .on("mouseout", handleMouseOut)
                .on("click", handleClick)
                .attr('fill-opacity', 1)
                .attr('stroke', '#000')
                .attr('stroke-opacity', 0.09)
                .attr("fill", "white")
                .transition()
                .duration(1150)
                .attr("fill", (d, i) => {
                    if ( ! EU_COUNTRIES.includes(d.properties.NAME) ) {
                        return "#f8f9fa";
                        // return "#003399";
                    }
                    if ( data[d.properties.NAME] == undefined || data[d.properties.NAME] == undefined) {
                        //console.log(d.properties.name + ":" + data[d.properties.name]);
                        return "#fff";
                    }
                    let color = d3.interpolateHsl("red", "white");
                    if (data[d.properties.NAME] > 0) {
                        color = d3.interpolateHsl("white", "#2ecc71")
                    }

                    const expScale = d3.scalePow()
                        .exponent(1.5)
                        .domain([min, max]);
                    let point = data[d.properties.NAME];
                    return color(expScale(point));
                    //return color(country_data[d.properties.name]);
                });
            selection.select("g").attr("transform", 'scale(1.2), translate(0, 0)');
        });    
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
        data = new_data;
        for (const key in new_data) {
            min = Math.min(min, data[key]);
            max = Math.max(max, data[key]);
        }
    } 

    my.update = function() {

        d3.selectAll(".individualCountry")
            // .attr("fill-opacity", (d, i) => {
            //     if (d.properties.NAME === state.highlightedCountry) {
            //         return 0.6;
            //     }

            //     return 1;
            // })
            .attr("stroke-opacity", (d, i) => {
                if (d.properties.NAME === state.selectedCountry | d.properties.NAME === state.selectedCountry2 ) {
                    return 1;
                } else if (d.properties.NAME === state.highlightedCountry & EU_COUNTRIES.includes(d.properties.NAME)) {
                    return 0.5;
                }

                return 0.06;
            })
            // .attr("transform-origin", "center")
            // .attr("transform", (d, i) => {
            //     if (d.properties.NAME === state.highlightedCountry & EU_COUNTRIES.includes(d.properties.NAME)) {
            //         return "scale(1.3)";
            //     }

            //     return "scale(1)";
            // })

    }

    return my;
}