var GDP = {};
var netContribution = {}
var splitted_expenditures = {} //what does it get from EU 
var splitted_revenue = {} //what does it pay to EU


async function readJSON() {
    return new Promise((resolve, reject) => {
        $.getJSON("./data/merged_new_data.json", (data) => {
            //console.log(data[5]);
            for (let i = 0; i < data.length; i++) {
                GDP[String(data[i].Country)] = data[i].GDP;
                countryNetContribution = parseInt(data[i]["TOTAL own resources"]) - parseInt(data[i]["TOTAL EXPENDITURE"]) + parseInt(data[i]["ADMINISTRATION"]);
                netContribution[data[i].Country] = isNaN(countryNetContribution) ? 0 : countryNetContribution;
                splitted_expenditures[data[i].Country] = new Array(data[i]["SMART AND INCLUSIVE GROWTH"], data[i]["SUSTAINABLE GROWTH: NATURAL RESOURCES"],
                    data[i]["SECURITY AND CITIZENSHIP"], data[i]["GLOBAL EUROPE"], data[i]["ADMINISTRATION"], data[i]["SPECIAL INSTRUMENTS"]);
                splitted_revenue[data[i].Country] = new Array(data[i]["VAT-based own resource"], data[i]["GNI-based own resource"], data[i]["Traditional own resources (TOR) (80%)"], data[i]["Other revenue***"] || 0);

            }
            delete netContribution["EU"];
            delete splitted_expenditures["EU"];
            delete splitted_revenue["EU"];
            resolve();
        })
    });
}


function getTotalGPT() {
    return GDP;
}

function getNetContribution() {
    return netContribution;
}

function getExpenditures() {
    return splitted_expenditures;
}

function getRevenue() {
    return splitted_revenue;
}