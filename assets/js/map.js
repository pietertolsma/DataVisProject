

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
        d3.select(this).attr("fill-opacity", 1);
        tooltip.transition()
                    .duration(200)
                    .style("opacity", 0);
    }


    function my(selection) {

        new Promise((resolve, reject) => {
            resolve(d3.json('./../../data/raw_data/europe.geojson'));
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
                    let point = data[d.properties.NAME];
                    return color((point - min) / (max - min));
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
            .attr("fill-opacity", (d, i) => {
                return d.properties.NAME === state.highlightedCountry ? 0.6 : 1;
            })
            
        // d3.select(this).attr("fill-opacity", 0.6)
        // .attr("test", (item) => {
        //     let name = item.properties.NAME;
        //     if (! EU_COUNTRIES.includes(name)) {
        //         return;
        //     }
        //     tooltip.transition()
        //         .duration(200)
        //         .style("opacity", 1);
        //     tooltip.html(name + "<br /><br />Net. Result: €" + numberWithCommas(Math.round(data[name]))+"M")
        //         .style("left", (d.clientX) + "px")
        //         .style("top", (d.clientY + document.documentElement.scrollTop) + "px");
        //     return "";
        // });
    }

    return my;
}