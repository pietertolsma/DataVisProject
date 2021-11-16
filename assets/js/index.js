
const svg = d3.select("#mainWindow");

const data = [30,50,60];

svg.selectAll("circle")
    .data(data)
    .join("circle")
    .attr("r", (d, i) => d)
    .attr("cx", (d, i) => 50 + i * 120)
    .attr("cy", 100)
    .style("color", 'black');