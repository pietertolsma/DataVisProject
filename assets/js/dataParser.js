
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
                        "key" : "Tax-Based",
                        "value" : data[i]["VAT-based own resource"]
                    },
                    {
                        "key" : "Economy-Based",
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

                for (const [countryName, value] of Object.entries(incomeCategories)) {
                    let cats = value;
                    totalIncome[countryName] = 0;

                    cats.forEach((d) => totalIncome[countryName] += d.value);
                }

                for (const [countryName, value] of Object.entries(expenseCategories)) {
                    let cats = value;
                    totalExpense[countryName] = 0;

                    cats.forEach((d) => totalExpense[countryName] += d.value);
                }
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