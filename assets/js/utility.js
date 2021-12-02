function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function dictToPairObject(dict) {
    let res = [];
    for (key in dict) {
        res.push({
            key: key,
            value: dict[key]
        })
    }

    return res;
}