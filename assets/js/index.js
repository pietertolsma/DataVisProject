function isScrolledIntoView(elem)
{
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();

    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}

let state = {
    renderedOne : false,
    viewed : false

}

async function renderSectionOne(map, bar, width, height) {

    if ($(window).scrollTop() > $(".pageOneDrawing").offset().top / 2) {
        state.renderedOne = true;
        d3.select("#firstMap").call(map)
        .style("width", width / 2 + "px")
        .style("height", height + "px");

        d3.select("#firstBarChart").call(bar)
            .style("width", width / 2 + "px")
            .style("height", height + "px");
    }
}

async function counter(){
    const counters = document.querySelectorAll('.countingvalue');
    const speed = 2000;
    viewed = true;

    counters.forEach( counter => {
    const animate = () => {
        const value = +counter.getAttribute('akhi');
        const data = +counter.innerText;
        
        const time = value / speed;
        if(data < value) {
            counter.innerText = Math.ceil(data + time);
            setTimeout(animate, 1);
            }else{
            counter.innerText = value;
            }
        
    }
    
    animate();
    });
}


$(document).ready(() => {


    async function renderCharts() {
        let WIDTH = $(window).width(),
            HEIGHT = $(window).height();

        await readJSON();

        let map = europeMap(getNetContribution(), WIDTH/2, HEIGHT/2);
        let bar = myDivergingBarChart(getNetContribution(), size={"width": WIDTH / 2 , "height" : HEIGHT/1.8});
        
        $(window).scroll(() => {

            if (!state.renderedOne) {
                renderSectionOne(map, bar, WIDTH, HEIGHT); 
            }

            if (!state.viewed) {
                counter()
            }



        });

    }

    renderCharts();

});
