$(document).ready(() => {

    let WIDTH = $(window).width(),
        HEIGHT = $(window).height();

    let map = europeMap();
    let bar = horizontalBar();

    d3.select("#firstMap").call(map)
        .style("width", WIDTH / 2 + "px")
        .style("height", HEIGHT + "px");

    d3.select("#firstBarChart").call(bar)
        .style("width", WIDTH / 2 + "px")
        .style("height", HEIGHT + "px");

});