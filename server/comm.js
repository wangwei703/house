function showTable(arr, prefix = 0) {
    let tabs = num => {
        if (num <= 0)
            return "";
        return new Array(num).fill("\t").join('');
    };
    let getLen = str => {
        let txt = "";
        if (typeof str === "string") {
            txt = str;
        } else if (typeof str === "number") {
            txt = str.toString();
        }
        return txt.length>6?1:2;
    }
    arr.forEach(row => {
        let rowTxt = tabs(prefix);
        if (Array.isArray(row)) {
            row.forEach((cell, idx) => {
                let len =getLen(cell);
                rowTxt += cell + tabs(len);
            });
        }
        console.log(rowTxt);
    });
}

module.exports = {
    showTable
}