module.exports=[{
    code: "jy-dfds",
    id: 796278,
    name: "佳源.东方都市",
    city: "jx",
    filters: ["亚欧路"],
    url(page) {
        page = page ? `-p${page}` : "";
        return `https://${this.city}.anjuke.com/sale/o5${page}/?kw=${encodeURIComponent(this.name)}`;
    }
}, {
    code: "hrhy",
    id: 792052,
    name: "宏润花园",
    city: "jx",
    filters: ["广益路"],
    url(page) {
        page = page ? `-p${page}` : "";
        return `https://${this.city}.anjuke.com/sale/o5${page}/?kw=${encodeURIComponent(this.name)}`;
    }
},{
    code: "jntyc",
    id: 350489,
    name: "江南太阳城",
    city: "jx",
    filters: ["三元路"],
    url(page) {
        page = page ? `-p${page}` : "";
        return `https://${this.city}.anjuke.com/sale/o5${page}/?kw=${encodeURIComponent(this.name)}`;
    }
}, {
    code: "zgtjgjc-hcy",
    id: 797774,
    name: "中国铁建国际城和畅园",
    city: "hf",
    filters: ["清源路"],
    url(page) {
        page = page ? `-p${page}` : "";
        return `https://${this.city}.anjuke.com/sale/b220-o5${page}/?kw=${encodeURIComponent(this.name)}`;
    }
}]