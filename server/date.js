function padStart(num) {
    if (num < 10)
        return `0${num}`;
    return `${num}`;
}
let dateComm = {
    now() {
        return new Date();
    },
    getYMD(date) {
        let y = date.getFullYear(),
            m = date.getMonth() + 1,
            d = date.getDate();
        return [y, m, d];
    },
    formatYMD(date) {
        let [y, m, d] = this.getYMD(date);
        return `${y}-${padStart(m)}-${padStart(d)}`;
    },
    formatYM(date) {
        let [y, m] = this.getYMD(date);
        return `${y}${padStart(m)}`;
    },
    today() {
        let date = this.now();
        return this.formatYMD(date);
    },
    yesterday() {
        let date = this.now();
        date.setDate(date.getDate() - 1);//设置天数 -1 天  
        return this.formatYMD(date);
    },
    mon() {
        let date = this.now();
        return this.formatYM(date);
    },
    lastMon() {
        let date = this.now();
        date.setMonth(date.getMonth() - 1);
        return this.formatYM(date);
    }
}
module.exports = dateComm;