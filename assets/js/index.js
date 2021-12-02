$(document).ready(() => {


    async function renderCharts() {
        let WIDTH = $(window).width(),
            HEIGHT = $(window).height();

        await readJSON();

        let map = europeMap(getNetContribution(), WIDTH/2, HEIGHT/2);
        let bar = horizontalBar(undefined, size={"width": WIDTH / 2 , "height" : HEIGHT/2});

        d3.select("#firstMap").call(map)
            .style("width", WIDTH / 2 + "px")
            .style("height", HEIGHT + "px");

        d3.select("#firstBarChart").call(bar)
            .style("width", WIDTH / 2 + "px")
            .style("height", HEIGHT + "px");
    }

    renderCharts();

});