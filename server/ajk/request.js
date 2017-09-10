const searchs = [{
    code: "jy-dfds",
    name: "佳源.东方都市",
    filters: ["嘉兴南湖新区科技城与亚欧路交汇处"],
    url(page) {
        if (page) {
            page = `-p${page}`;
        }
        return `https://jx.anjuke.com/sale/o5${page}/?kw=${encodeURIComponent(this.name)}`;
    }
}, {
    code: "hrhy",
    name: "宏润花园",
    filters: ["广益路与三环东路交汇处"],
    url(page) {
        if (page) {
            page = `-p${page}`;
        }
        return `https://jx.anjuke.com/sale/o5${page}/?kw=${encodeURIComponent(this.name)}`;
    }
}, {
    code: "zgtjgjc-hcy",
    name: "中国铁建国际城和畅园",
    filters: ["清源路"],
    url(page) {
        if (page) {
            page = `-p${page}`;
        }
        return `https://jx.anjuke.com/sale/o5${page}/?kw=${encodeURIComponent(this.name)}`;
    }
}];
const path = require('path');
const nodegrass = require('nodegrass');
const jsdom = require("jsdom");
var fs = require('fs');
const { window } = new jsdom.JSDOM(`<!DOCTYPE html>`);
var $ = require('jquery')(window);
let finish = false;

const Req =require("./req2");

function getUrl(page) {
    if (page) {
        page = "-p" + page;
    }
    return `https://hf.anjuke.com/sale/b220-o5${page}/?kw=%E4%B8%AD%E9%93%81%E5%9B%BD%E9%99%85%E5%9F%8E%E5%92%8C%E7%95%85%E5%9B%AD`
}
async function fetchHouseList(page) {
    return new Promise((f, r) => {
        console.log(page);
        nodegrass.get(getUrl(page), (html) => {
            fetchHouseListComplete(html, f, r);
        }, {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.3 (KHTML, like Gecko) Chrome/55.0.2883.9 Safari/537.3',
                'Referer': "https://hf.anjuke.com/sale/"
            }, 'utf8').on('error', e => {
                console.log(e);
            });
    })
}
function fetchHouseListComplete(html, f, r) {
    let $html = $(html),
        $list = $html.find("#houselist-mod-new li.list-item").toArray();

    if ($list.length === 0) r("finish");
    let list = [];
    $list.forEach(item => {
        let $item = $(item),
            $details = $item.find(".house-details"),
            $price = $item.find(".pro-price");
        let href = $details.find(".house-title a[href]").attr("href"),
            $detailsItem = $details.find(".details-item"),
            details = $detailsItem.find("span:eq(0)").html(),
            area = parseFloat($detailsItem.find("span:eq(1)").html()),
            totalprice = parseFloat($price.find(".price-det strong").html()),
            unitprice = parseFloat($price.find(".unit-price").html());
        let obj = {
            href,
            details,
            area,
            totalprice,
            unitprice
        }
        list.push(obj);
    });
    f(list);
}
async function fetchHouseDetails(url) {
    return new Promise((f, r) => {
        nodegrass.get(url, (html) => {
            f($(html).find(".house-encode").html());
        }, {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.3 (KHTML, like Gecko) Chrome/55.0.2883.9 Safari/537.3',
                'Referer': "https://hf.anjuke.com/sale/"
            }, 'utf8').on('error', e => {
                console.log(e);
            });
    })
}
function writeFile(list) {
    var d = new Date().toLocaleDateString().replace(/\//g, '-');
    var txt = JSON.stringify(list); // "module.exports=" + JSON.stringify( points );
    fs.writeFile(`./data/${d}.json`, txt, function (err) {
        if (err)
            console.log("\tfail " + err);
        else
            console.log("\t写入文件ok");
    });
}
function toDate(str) {
    if (str) {
        let matchs = str.match(/[0-9][0-9]*/g);
        if (matchs && matchs.length === 4) {
            let now = new Date(),
                y = parseInt(matchs[1], 10),
                m = parseInt(matchs[2], 10) - 1,
                d = parseInt(matchs[3], 10),
                fbDate = new Date(y, m, d),
                ts = now.getTime() - fbDate.getTime();
            if (ts / 1000 / 3600 / 24 <= 2) {
                return `${y}-${m + 1}-${d}`;
            }
        }
    }
    return;
}
async function fetch(){
   
    console.log(__dirname);
    // let list = []
    // try {
    //     for (let i = 1; i < 300; i++) {
    //         let data = await fetchHouseList(i === 1 ? null : i);
    //         list.push(...data);
    //     }
    // } catch (e) {
    //     console.log("complete!");
    // }
    // for(let i= 1;i<list.length;i++){
    //     console.log(`${i}/${list.length}`)
    //     let d = await fetchHouseDetails(list[i].href);
    //     let date = toDate(d);
    //     if (date) {
    //         list[i].date = date;
    //     }else{
    //         break;
    //     }
    // }
    // list = list.filter(item => {
    //     return item.date;
    // });
    // writeFile(list);
    // console.log("complete!");
    // var files = fs.readdirSync( './music/test/' );
    // console.log(files.length);
}
 var url="https://jx.anjuke.com/prop/view/A945906049?from=ordinary&spread=commsearch_p&ab=expclick-AJKERSHOUFANG_101_post_time_desc&position=61&kwtype=ordinary&now_time=1503970260";

url.match(/\/view\/([^\/]+)\?/)

module.exports=fetch;
//fetch();

