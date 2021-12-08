
var GDP = {};

var netContribution = {};

var incomeCategories = {};

var expenseCategories = {};

let totalExpense = {};

let totalIncome = {};

async function readJSON() {
    return new Promise((resolve, reject) => {
        $.getJSON("./data/merged_new_data.json", (data) => {
            console.log(data);
            for (let i = 0; i < data.length; i++) {
                GDP[String(data[i].Country)] = data[i].GDP;
                countryNetContribution = parseInt(data[i]["TOTAL own resources"]) - parseInt(data[i]["TOTAL EXPENDITURE"]);// + parseInt(data[i]["ADMINISTRATION"]);
                netContribution[data[i].Country] = isNaN(countryNetContribution) ? 0 : countryNetContribution;

                incomeCategories[data[i].Country] = [
                    {
                        "key" : "VAT-based",
                        "value" : data[i]["VAT-based own resource"]
                    },
                    {
                        "key" : "GNI-based",
                        "value" : data[i]["GNI-based own resource"]
                    },
                    {
                        "key" : "Own Resources",
                        "value" : data[i]["Traditional own resources (TOR) (80%)"]
                    }
                ]

                expenseCategories[data[i].Country] = [
                    {
                        "key" : "Smart and Inclusive Growth",
                        "value" : data[i]["SMART AND INCLUSIVE GROWTH"]
                    },
                    {
                        "key" : "Sustainable Growth",
                        "value" : data[i]["SUSTAINABLE GROWTH: NATURAL RESOURCES"]
                    },
                    {
                        "key" : "Security and Citizenship",
                        "value" : data[i]["SECURITY AND CITIZENSHIP"]
                    },
                    {
                        "key" : "Global Europe",
                        "value" : data[i]["GLOBAL EUROPE"]
                    },
                    {
                        "key" : "Administration",
                        "value" : data[i]["ADMINISTRATION"]
                    },
                    {
                        "key" : "Special Instruments",
                        "value" : data[i]["SPECIAL INSTRUMENTS"]
                    }
                ]

                Object.entries(incomeCategories).forEach( ([k, v]) => v.forEach((d, i) => {
                    if (totalIncome[k] === undefined) {
                        totalIncome[k] = 0;
                    }
                    totalIncome[k] += d.value
                }));
                Object.entries(expenseCategories).forEach( ([k, v]) => v.forEach((d, i) => {
                    if (totalExpense[k] === undefined) {
                        totalExpense[k] = 0;
                    }
                    totalExpense[k] += d.value
                }));
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