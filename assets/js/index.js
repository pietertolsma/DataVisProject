let current_year = 2005;


const svg = d3.select("#mainWindow");

function handleMouseOver(d, i) {
    d3.select(this).attr("fill-opacity", 1);
}

function handleMouseOut(d, i) {
    d3.select(this).attr("fill-opacity", 0.6);
}

function zoomed({transform}) {
    svg.select("g").attr("transform", transform);
}

function update() {
    d3.select("#currentYear").text(current_year);
}

let WIDTH = svg.style("width").replace("px", "");
let HEIGHT = WIDTH  * 2 / 5;
svg.style("width", WIDTH + "px").style("height", HEIGHT + "px");
svg.attr("viewBox", [0, 0, WIDTH, HEIGHT]);

let country_data = {};

d3.json("../../data/merged_data.json").then(function(data) {
    for (let i = 0; i < data.length; i++) {
        year_data = {}
        for (let k = 0; k < data[i]['Data'].length; k++) {
            year_data[data[i]['Data'][k]['Year']] = data[i]['Data'][k];
        } 
        country_data[data[i]["Country Name"]] = year_data;
    }
})
.then(d3.json('./../../data/raw_data/low_res_countries.geojson')
.then((bb) => {
    let projection = d3.geoEqualEarth();
    projection.fitSize([WIDTH, HEIGHT], bb);

    let geoGenerator = d3.geoPath()
        .projection(projection);

    svg.append('g').selectAll('path')
        .data(bb.features)
        .join('path')
        .attr('d', geoGenerator)
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut)
        .attr("fill", (d, i) => {
            if ( country_data[d.properties.name] == undefined || country_data[d.properties.name][current_year] == undefined) {
                //console.log(d.properties.name + ":" + country_data[d.properties.name]);
                return "#fff";
            }
            let color = d3.interpolateHsl("red", "green")
            let life_exp = country_data[d.properties.name][current_year]['Life Expectancy'];
            return color((life_exp - 50) / 35);
            //return color(country_data[d.properties.name]);
        })
        .attr('fill-opacity', 0.6)
        .attr('stroke', '#000')
        .attr('stroke-opacity', 0.08);
    //https://observablehq.com/@d3/zoom
    svg.call(d3.zoom()
        .extent([[0, 0], [WIDTH, HEIGHT]])
        .scaleExtent([1, 8])
        .on("zoom", zoomed));
}));    

update();
