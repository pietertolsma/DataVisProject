var GDP = {};
var netContribution = {}
var splitted_expenditures = {} //what does it get from EU 
var splitted_revenue = {} //what does it pay to EU


async function readJSON() {
    return new Promise((resolve, reject) => {
        $.getJSON("./data/merged_new_data.json", (data) => {
            console.log(data[0]);
            for (let i = 0; i < data.length; i++) {
                GDP[String(data[i].Country)] = data[i].GDP;
                countryNetContribution = parseInt(data[i]["TOTAL own resources"]) - parseInt(data[i]["TOTAL EXPENDITURE"]) + parseInt(data[i]["ADMINISTRATION"]);
                netContribution[data[i].Country] = isNaN(countryNetContribution) ? 0 : countryNetContribution;
            }
            delete netContribution["EU"];
            resolve();
        })
        console.log(netContribution)
    });
}

async function readJSON_splitted() {
    return new Promise((resolve, reject) => {
        $.getJSON("./data/merged_new_data.json", (data) => {
            for (let i = 0; i < data.length; i++) {
                splitted_expenditures[String(data[i].Country)] = new Array(data[i]["SMART AND INCLUSIVE GROWTH"], data[i]["SUSTAINABLE GROWTH: NATURAL RESOURCES"],
                    data[i]["SECURITY AND CITIZENSHIP"], data[i]["GLOBAL EUROPE"], data[i]["ADMINISTRATION"], data[i]["SPECIAL INSTRUMENTS"]);
                splitted_revenue[String(data[i].Country)] = new Array(data[i][])
            }
            delete splitted_expenditures["EU"];
            delete splitted_revenue["EU"];
            resolve;
        })
        console.log(splitted_expenditures)
    })

}

function getTotalGPT() {
    //console.log(GDP)
    return GDP;
}

function getNetContribution() {
    console.log(netContribution);
    return netContribution;
}