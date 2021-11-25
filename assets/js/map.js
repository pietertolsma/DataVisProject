let EU_COUNTRIES = ['Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Republic of Cyprus', 'Czech Republic',
'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greecy', 'Hungary', 'Ireland', 'Italy',
'Latvia', 'Lithuania', 'Luxembourg', 'Malta', 'Netherlands', 'Poland', 'Portugal', 'Romania', 'Slovakia', 'Slovenia',
'Spain', 'Sweden', 'United Kingdom']

// http://bl.ocks.org/NelsonMinar/11524926

function europeMap() {
    let width = 720,
        height = 480;


    let tooltip = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);

    function handleMouseOver(d, i) {
        d3.select(this).attr("fill-opacity", 0.6)
            .attr("test", (item) => {
                let data = item.properties.NAME;
                if (! EU_COUNTRIES.includes(data)) {
                    return;
                }
                tooltip.transition()
                    .duration(200)
                    .style("opacity", 1);
                tooltip.html(data + "<br />")
                    .style("left", (d.clientX) + "px")
                    .style("top", (d.clientY) + "px");
                return "";
            });
    }

    function handleMouseOut(d, i) {
        d3.select(this).attr("fill-opacity", 1);
        tooltip.transition()
                    .duration(200)
                    .style("opacity", 0);
    }


    function my(selection) {
        d3.json("../../data/merged_data.json").then(function(data) {
            for (let i = 0; i < data.length; i++) {
                year_data = {}
                for (let k = 0; k < data[i]['Data'].length; k++) {
                    year_data[data[i]['Data'][k]['Year']] = data[i]['Data'][k];
                } 
                country_data[data[i]["Country Name"]] = year_data;
            }
        })
        .then(d3.json('./../../data/raw_data/europe.geojson')
        .then((bb) => {
            let projection = d3.geoEqualEarth();
            projection.fitSize([width, height], bb);
        
            let geoGenerator = d3.geoPath()
                .projection(projection);
        
            selection.append('g').selectAll('path')
                .data(bb.features)
                .join('path')
                .attr('d', geoGenerator)
                .on("mouseover", handleMouseOver)
                .on("mouseout", handleMouseOut)
                .attr("fill", (d, i) => {
                    if ( EU_COUNTRIES.includes(d.properties.NAME) ) {
                        return "#003399";
                    }
                    return "#ffffff";
                    // if ( country_data[d.properties.NAME] == undefined || country_data[d.properties.NAME][current_year] == undefined) {
                    //     //console.log(d.properties.name + ":" + country_data[d.properties.name]);
                    //     return "#000";
                    // }
                    let color = d3.interpolateHsl("red", "green")
                    let life_exp = country_data[d.properties.name][current_year]['Life Expectancy'];
                    return color((life_exp - 50) / 35);
                    //return color(country_data[d.properties.name]);
                })
                .attr('fill-opacity', 1)
                .attr('stroke', '#000')
                .attr('stroke-opacity', 0);
        }));    
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