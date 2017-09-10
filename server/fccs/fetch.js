const nodegrass = require('nodegrass');
module.exports = async url => new Promise((resolve, reject) => {
    nodegrass.get(url, html => {
        setTimeout(()=>{
            resolve(html);
        },6*1e3);
    }, {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.3 (KHTML, like Gecko) Chrome/55.0.2883.9 Safari/537.3',
            'Referer': "http://second.jx.fccs.com"
        }, 'gbk').on('error', e => {
            reject(e);
        });
});
    