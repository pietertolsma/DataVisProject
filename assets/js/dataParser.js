
var GDP = {};

var netContribution = {}

async function readJSON() {
    return new Promise((resolve, reject) => {
        $.getJSON("./data/merged_new_data.json", (data) => {
            console.log(data[0]);
            for (let i = 0; i < data.length; i++) {
                GDP[String(data[i].Country)] = data[i].GDP;
                countryNetContribution = parseInt(data[i]["TOTAL own resources"]) - parseInt(data[i]["TOTAL EXPENDITURE"]) + parseInt(data[i]["ADMINISTRATION"]);
                netContribution[data[i].Country] = isNaN(countryNetContribution) ? 0 : countryNetContribution;
            }
            resolve();
        })
    });
}

function getTotalGPT() {
    return GDP;
}

function getNetContribution() {
    console.log(netContribution);
    return netContribution;
}