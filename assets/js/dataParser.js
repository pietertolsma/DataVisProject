var GDP = {};
var netContribution = {}
var splitted_expenditures = [] //what does it get from EU 
var splitted_revenue = [] //what does it pay to EU


async function readJSON() {
    return new Promise((resolve, reject) => {
        $.getJSON("./data/merged_new_data.json", (data) => {
            //console.log(data[5]);
            for (let i = 0; i < data.length; i++) {
                GDP[String(data[i].Country)] = data[i].GDP;
                countryNetContribution = parseInt(data[i]["TOTAL own resources"]) - parseInt(data[i]["TOTAL EXPENDITURE"]) + parseInt(data[i]["ADMINISTRATION"]);
                netContribution[data[i].Country] = isNaN(countryNetContribution) ? 0 : countryNetContribution;
                splitted_revenue[data[i].Country] = new Array();
                splitted_expenditures.push({
                    "country": data[i].Country,
                    "SMART AND INCLUSIVE GROWTH": data[i]["SMART AND INCLUSIVE GROWTH"],
                    "SUSTAINABLE GROWTH: NATURAL RESOURCES": data[i]["SUSTAINABLE GROWTH: NATURAL RESOURCES"],
                    "SECURITY AND CITIZENSHIP": data[i]["SECURITY AND CITIZENSHIP"],
                    "GLOBAL EUROPE": data[i]["GLOBAL EUROPE"],
                    "ADMINISTRATION": data[i]["ADMINISTRATION"],
                    "SPECIAL INSTRUMENTS": data[i]["SPECIAL INSTRUMENTS"]
                })
                splitted_revenue.push({
                    "VAT-based own resource": data[i]["VAT-based own resource"],
                    "GNI-based own resource": data[i]["GNI-based own resource"],
                    "Traditional own resources": data[i]["Traditional own resources (TOR) (80%)"]
                })
            }
            delete netContribution["EU"];
            splitted_expenditures.delete["EU"];
            splitted_revenue.delete["EU"];
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