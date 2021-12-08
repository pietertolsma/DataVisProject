
let EXPENSE_COLORS = {
    "Smart and Inclusive Growth" : "#FF9AA2",
    "Sustainable Growth" : "#FFB7B2",
    "Security and Citizenship" : "#FFDAC1",
    "Global Europe" : "#E2F0CB",
    "Administration" : "#B5EAD7",
    "Special Instruments" : "#C7CEEA"
}

let INCOME_COLORS = {
    "VAT-based own resource" : "#C7CEEA",
    "GNI-based own resource" : "#B5EAD7",
    "Traditional own resources (TOR) (80%)" : "#E2F0CB",
}

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
let incomeBar = verticalBarChart(state, INCOME_COLORS, undefined, size={"width": WIDTH / 4 , "height" : HEIGHT });
let expenseBar = verticalBarChart(state, EXPENSE_COLORS, undefined, size={"width": WIDTH / 4 , "height" : HEIGHT });

function updateCountryView() {
    $(".selectedCountryName").text(state.selectedCountry);
    $("#totalExpense").text(Math.round(totalExpense[state.selectedCountry] / 100) / 10);
    $("#totalIncome").text(Math.round(totalIncome[state.selectedCountry] / 100) / 10);

    incomeBar.setData(getIncomeCategories()[state.selectedCountry]);
    expenseBar.setData(getExpenseCategories()[state.selectedCountry]);
}
            
state.update = function(highlight = "none", select = "none") {
    state.highlightedCountry = highlight;

    if (select !== "none" & EU_COUNTRIES.includes(select)) {
        state.selectedCountry = select;
        updateCountryView();

        incomeBar.update();
        expenseBar.update();
    }

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

        state.update();
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

$(document).ready(() => {


    async function renderCharts() {

        await readJSON();

        updateCountryView();

        $(window).scroll(() => {

            if (!state.renderedOne) {
                renderSectionOne(map, bar, WIDTH, HEIGHT); 
            } else if (!state.renderedFour) {
               // renderSectionFour(scatter, Math.min(1280, WIDTH), HEIGHT);
            }
        });

        d3.select("#incomeBarChart").call(incomeBar)
            .style("width", WIDTH/ 4 + "px")
            .style("height", HEIGHT + "px");
        d3.select("#expenseBarChart").call(expenseBar)
            .style("width", WIDTH/ 4 + "px")
            .style("height", HEIGHT + "px");

    }

    renderCharts();

});
