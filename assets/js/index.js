
let EXPENSE_CATEGORIES = {
    "Smart and Inclusive Growth" : {
        desc: "Developing the economy based on knowledge and innovation. This economy aims for high employment delivering social and territorial cohesion. ",
        color: "#FF9AA2"
    },
    "Sustainable Growth" : {
        desc: "Promoting a more resource-efficient, greener and more competitive economy. ",
        color: "#FFB7B2"
    },
    "Security and Citizenship" : {
        desc: "Focussing on security and rights of its citizens. Ranges from migration and border to control to food safety programs. ",
        color: "#FFDAC1"
    },
    "Global Europe" : {
        desc: "Putting the EU in world's perspective. It covers all foreign policy, including international development and humanitarian aid. ",
        color: "#E2F0CB"
    },
    "Administration" : {
        desc: "All expenditures to EU institutions and its staff. ",
        color: "#FF6961"
    },
    "Special Instruments" : {
        desc: "Funding for unforeseen events for example natural disasters or major world trade patterns that displace workers. ",
        color: "#C7CEEA"
    }
}

let INCOME_CATEGORIES= {
    "VAT-based" : {
        desc: "VAT is a harmonised tax rate based on the total taxes a country collects. It is capped at 50% of a country's Gross National Income (GNI).",
        color: "#B5EAD7"
    },
    "GNI-based" : {
        desc: "An additional resource based on the GNI of a country. It ensures that the general budget of the Union is always initially balanced. ",
        color: "#daeaf6"
    },
    "Own Resources" : {
        desc: "Consists of customs duties on imports from outside the EU. Each individual country pays this directly to the EU. In the past there was also a sugar production quoate system, but this has come to an end in 2017. ",
        color: "#9AC3E3"
    },
}

let state = {
    highlightedCountry: "none",
    selectedCountry: "Netherlands",
    selectedCountry2: "Greece",
    absoluteBudget: true,
    renderedOne : false,
    renderedFour : false,
    viewed: false,
    nextSelectCount: 1,
    update : () => {

    }
} 

let WIDTH = $(window).width(),
    HEIGHT = $(window).height();

let map = europeMap(state, undefined, WIDTH/2, HEIGHT/2);
let bar = myDivergingBarChart(state, undefined, size={"width": WIDTH / 2 , "height" : HEIGHT/1.8});
let incomeBar = verticalBarChart(state, INCOME_CATEGORIES, undefined, size={"width": $("#incomeBarChart").parent().width() , "height" : HEIGHT - 100});
let expenseBar = verticalBarChart(state, EXPENSE_CATEGORIES, undefined, size={"width": $("#expenseBarChart").parent().width() , "height" : HEIGHT - 100});
let incomeBar2 = verticalBarChart(state, INCOME_CATEGORIES, undefined, size={"width": $("#incomeBarChart").parent().width() , "height" : HEIGHT - 100 });
let expenseBar2 = verticalBarChart(state, EXPENSE_CATEGORIES, undefined, size={"width": $("#expenseBarChart").parent().width() , "height" : HEIGHT - 100 });

function updateCountryView() {
    $(".selectedCountryName").text(state.selectedCountry);
    $(".selectedCountryName2").text(state.selectedCountry2);
    $("#totalExpense").text(Math.round(totalExpense[state.selectedCountry] / 100) / 10);
    $("#totalIncome").text(Math.round(totalIncome[state.selectedCountry] / 100) / 10);
    $("#incomeSum1").text(Math.round(totalIncome[state.selectedCountry] / 100) / 10);
    $("#incomeSum2").text(Math.round(totalIncome[state.selectedCountry2] / 100) / 10);
    $("#expenseSum1").text(Math.round(totalExpense[state.selectedCountry] / 100) / 10);
    $("#expenseSum2").text(Math.round(totalExpense[state.selectedCountry2] / 100) / 10);

    let maxExpense = Math.max(totalExpense[state.selectedCountry], totalExpense[state.selectedCountry2]);
    let maxIncome = Math.max(totalIncome[state.selectedCountry], totalIncome[state.selectedCountry2]);

    incomeBar.setData(getIncomeCategories()[state.selectedCountry], totalIncome[state.selectedCountry], maxIncome );
    expenseBar.setData(getExpenseCategories()[state.selectedCountry], totalExpense[state.selectedCountry], maxExpense);
    incomeBar2.setData(getIncomeCategories()[state.selectedCountry2], totalIncome[state.selectedCountry2], maxIncome);
    expenseBar2.setData(getExpenseCategories()[state.selectedCountry2], totalExpense[state.selectedCountry2], maxExpense);
}
            
state.update = function(highlight = "none", select = "none") {
    state.highlightedCountry = highlight;

    if (select !== "none" & EU_COUNTRIES.includes(select)) {
        if (state.nextSelectCount == 0 & state.selectedCountry2 !== select) {
            state.selectedCountry = select;
            state.nextSelectCount = 1;
        } else if (state.selectedCountry !== select) {
            state.selectedCountry2 = select;
            state.nextSelectCount = 0;
        }
        updateCountryView();

        incomeBar.update();
        expenseBar.update();
        incomeBar2.update();
        expenseBar2.update();
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
            .style("width", $("#incomeBarChart").parent().width() + "px")
            .style("height", HEIGHT - 300 + "px");
        d3.select("#expenseBarChart").call(expenseBar)
            .style("width", $("#expenseBarChart").parent().width() + "px")
            .style("height", HEIGHT - 300 + "px");

        d3.select("#incomeBarChart2").call(incomeBar2)
            .style("width", $("#incomeBarChart2").parent().width() + "px")
            .style("height", HEIGHT - 300 + "px");
        d3.select("#expenseBarChart2").call(expenseBar2)
            .style("width", $("#expenseBarChart2").parent().width() + "px")
            .style("height", HEIGHT - 300 + "px");

    }

    renderCharts();

});
