import React, { Component } from 'react'

import AvgPriceMon from "containers/avgpricemon";
import Community from "../cfg/comm.js";
import fetchData from 'libs/comm/fetch';

class componentName extends Component {
    state = {
        community: []
    }
    getMonthStr(date) {
        let m = date.getMonth() + 1;
        m = m < 10 ? "0" + m : m;
        return m;
    }
    getLastYearMonth() {
        var d = new Date();
        var mons = [`${d.getFullYear()}${this.getMonthStr(d)}`];
        for (var i = 0; i < 11; i++) {
            d.setMonth(d.getMonth() - 1);
            mons.push(`${d.getFullYear()}${this.getMonthStr(d)}`);
        }
        return mons;
    }
    componentDidMount() {
        fetchData("avgmon").then(json => {
            let comm = Community.map(c => {
                let data = json.data.filter(h => h.k === c.key),
                    lastYearMonth = this.getLastYearMonth();
                lastYearMonth.sort((d1, d2) => d1 > d2 ? 1 : (d1 < d2 ? -1 : 0));
                let nData = data.map(d => ({
                    s: d.src,
                    a: d.t
                }))
                return {
                    key: c.key,
                    name: c.name,
                    data: {
                        data: nData,
                        lastYearMonth,
                        source: json.source
                    }
                }
            })
            this.setState({
                community: comm
            });
        });
    }
    render() {
        return (
            <div className="report-main">
                {
                    this.state.community.map(c => {
                        return <div key={c.key} className="report-main-item">
                            <h2 className="report-main-item-title">{c.name}</h2>
                            <div className="report-main-item-body">
                                <AvgPriceMon rptdata={c.data} />
                            </div>
                        </div>
                    })
                }
            </div>
        )
    }
}

export default componentName