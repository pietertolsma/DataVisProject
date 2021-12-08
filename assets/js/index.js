
let state = {
    highlightedCountry: "none",
    selectedCountry: "Netherlands",
    renderedOne : false,
    renderedFour : false,
    viewed: false,
    update : () => {

    }
} 

let WIDTH = $(window).width(),
    HEIGHT = $(window).height();

let map = europeMap(state, undefined, WIDTH/2, HEIGHT/2);
let bar = myDivergingBarChart(state, undefined, size={"width": WIDTH / 2 , "height" : HEIGHT/1.8});
            
state.update = function(highlight, select) {
    state.highlightedCountry = highlight;
    state.selectedCountry = select;

    bar.update();
    map.update();
}

function isScrolledIntoView(elem)
{
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();

    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}

async function renderSectionOne(map, bar, width, height) {

    if ($(window).scrollTop() > $(".pageOneDrawing").offset().top / 2) {
        state.renderedOne = true;
        map.setData(getNetContribution());
        bar.setData(getNetContribution());
        d3.select("#firstMap").call(map)
        .style("width", width / 2 + "px")
        .style("height", height + "px");

        d3.select("#firstBarChart").call(bar)
            .style("width", width / 2 + "px")
            .style("height", height + "px");
    }
}

async function renderSectionFour(scatter, width, height) {
    if ($(window).scrollTop() > $(".pageOneDrawing").offset().top * 6/ 2) { 
        // state.renderedFour = true;
        // d3.select("#myScatterPlot").call(scatter)
        // .style("width", Math.min(1280, width) + "px")
        // .style("height", height + "px");

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

        await readJSON();

        $(window).scroll(() => {

            if (!state.renderedOne) {
                renderSectionOne(map, bar, WIDTH, HEIGHT); 
            } else if (!state.renderedFour) {
               // renderSectionFour(scatter, Math.min(1280, WIDTH), HEIGHT);
            }

            if (!state.viewed) {
                counter()
            }



        });

    }

    renderCharts();

});
