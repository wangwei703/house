module.exports=[{
    code: "jy-dfds",
    id: 3106471,
    name: "佳源.东方都市",
    filters: ["亚欧路"],
    url(page) {
         page = page ? `_p${page}` : "";
        return `http://second.jx.fccs.com/sale/search/fl3106471_ad%25u4F73%25u6E90%25B7%25u4E1C%25u65B9%25u90FD%25u5E02${page}.html`;
    }
}, {
    code: "hrhy",
    id: 4007807,
    name: "宏润花园",
    filters: ["广益路"],
    url(page) {
         page = page ? `_p${page}` : "";
        return `http://second.jx.fccs.com/sale/search/fl4007807_ad%25u5B8F%25u6DA6%25u82B1%25u56ED${page}.html`;
    }
},{
    code: "jntyc",
    id: 165,
    name: "江南太阳城",
    filters: ["三元路"],
    url(page) {
        page = page ? `_p${page}` : "";
        return `http://second.jx.fccs.com/sale/search/fr2_fl165_ad%25u6C5F%25u5357%25u592A%25u9633%25u57CE${page}.html`;
    }
}]