
var GDP = {};

var netContribution = {};

var incomeCategories = {};

var expenseCategories = {};

// ADMINISTRATION: 5415.6
// ​​
// Country: "Belgium"
// ​​
// GDP: 478160.7
// ​​
// "GLOBAL EUROPE": 0
// ​​
// "GNI-based own resource": 3067.6
// ​​
// "Other revenue***": null
// ​​
// Population: "11455519"
// ​​
// "SECURITY AND CITIZENSHIP": 349.5
// ​​
// "SMART AND INCLUSIVE GROWTH": 2338
// ​​
// "SPECIAL INSTRUMENTS": 0.1
// ​​
// "SUSTAINABLE GROWTH: NATURAL RESOURCES": 673.8
// ​​
// "TOTAL EXPENDITURE": 8776.9
// ​​
// "TOTAL own resources": 6097
// ​​
// "Tourism expenditure": 16.724
// ​​
// "Tourism expenditure relative to GDP": 3.5
// ​​
// "Tourism income": 7.923
// ​​
// "Tourism income relative to GDP": 1.7
// ​​
// "Traditional own resources (TOR) (80%)": 2235.2
// ​​
// "VAT-based own resource": 611.9
// ​​
// avg_income: 24608
// ​​
// min_wage: 1593.81
// ​​
// "tourism balance": -8.801

async function readJSON() {
    return new Promise((resolve, reject) => {
        $.getJSON("./data/merged_new_data.json", (data) => {
            console.log(data);
            for (let i = 0; i < data.length; i++) {
                GDP[String(data[i].Country)] = data[i].GDP;
                countryNetContribution = parseInt(data[i]["TOTAL own resources"]) - parseInt(data[i]["TOTAL EXPENDITURE"]) + parseInt(data[i]["ADMINISTRATION"]);
                netContribution[data[i].Country] = isNaN(countryNetContribution) ? 0 : countryNetContribution;

                incomeCategories[data[i].Country] = [
                    {
                        "key" : "VAT-based own resource",
                        "value" : data[i]["VAT-based own resource"]
                    },
                    {
                        "key" : "GNI-based own resource",
                        "value" : data[i]["GNI-based own resource"]
                    },
                    {
                        "key" : "Traditional own resources (TOR) (80%)",
                        "value" : data[i]["Traditional own resources (TOR) (80%)"]
                    }
                ]

                expenseCategories[data[i].Country] = [
                    {
                        "key" : "SMART AND INCLUSIVE GROWTH",
                        "value" : data[i]["SMART AND INCLUSIVE GROWTH"]
                    },
                    {
                        "key" : "SUSTAINABLE GROWTH: NATURAL RESOURCES",
                        "value" : data[i]["SUSTAINABLE GROWTH: NATURAL RESOURCES"]
                    },
                    {
                        "key" : "SECURITY AND CITIZENSHIP",
                        "value" : data[i]["SECURITY AND CITIZENSHIP"]
                    },
                    {
                        "key" : "GLOBAL EUROPE",
                        "value" : data[i]["GLOBAL EUROPE"]
                    },
                    {
                        "key" : "ADMINISTRATION",
                        "value" : data[i]["ADMINISTRATION"]
                    },
                    {
                        "key" : "SPECIAL INSTRUMENTS",
                        "value" : data[i]["SPECIAL INSTRUMENTS"]
                    }
                ]
            }
            delete netContribution["EU"];
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

function getIncomeCategories() {
    return incomeCategories;
}

function getExpenseCategories() {
    return expenseCategories;
}