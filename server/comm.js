function showTable(arr, prefix = 0) {
    let size = [];
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
        let len=txt.length/4,
            len2=Math.ceil(len);
        if(len===len2){
            return len2+2;
        }
        return len2+1;
    }
    arr.forEach(row => {
        if (Array.isArray(row)) {
            row.forEach((cell, idx) => {
                let len = getLen(cell);
                size[idx] = Math.max(size[idx] || 0, len);
            })
        }
    });
    arr.forEach(row => {
        let rowTxt = tabs(prefix);
        if (Array.isArray(row)) {
            row.forEach((cell, idx) => {
                let maxLen = size[idx] || 1;
                let len =getLen(cell);
                len = maxLen - len+1;
                rowTxt += cell + tabs(len);
            });
        }
        console.log(rowTxt);
    });
}

module.exports = {
    showTable
}