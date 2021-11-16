
const svg = d3.select("#mainWindow");

function handleMouseOver(d, i) {
    d3.select(this).attr("fill", "#088");
}

function handleMouseOut(d, i) {
    d3.select(this).attr("fill", "#000");
}

d3.json('./../../data/raw_data/countries.geojson').then((bb) => {
    let width = 1000, height = 550;

    let projection = d3.geoEqualEarth();
    projection.fitSize([width, height], bb);
    let geoGenerator = d3.geoPath()
        .projection(projection);

    svg.style("Width", width).style("height", height);

    svg.append('g').selectAll('path')
        .data(bb.features)
        .join('path')
        .attr('d', geoGenerator)
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut)
        .attr("fill", '#000')
        .attr('fill-opacity', 0.1)
        .attr('stroke', '#000')
        .attr('stroke-opacity', 0.08);
});