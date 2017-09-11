import React, { Component, PropTypes } from 'react'

import Community from "../cfg/comm.js";
import RealTimeRpt from "containers/charts/home";

class Report extends Component {
    state = {
        data: []
    }
    componentDidMount() {
        var url = `./data/home.json?_dc=${new Date().getTime()}`;
        fetch(url, {
            method: 'GET'
        }).then(response => {
            if (response.ok) {
                response.json().then(json => {
                    let data = [];
                    Community.forEach(c => {
                        let dayData = json.day.filter(d => d.c === c.key);
                        let monData = json.mon.filter(d => d.c === c.key);
                        data.push({
                            key: c.key,
                            name: c.name,
                            data: {
                                day: dayData,
                                mon: monData,
                                source: json.source
                            }
                        });
                    })
                    this.setState({
                        data
                    });
                });
            } else {
                throw response.statusText;
            }
        }).catch(e => {
            message.error(typeof e === "string" ? e : '加载数据文件失败');
        });
    }
    getCardRepot(json) {
        return Object.entries(json.source).map((s,idx) => {
            let sk = s[0], sn = s[1];
            let dayData = json.day.find(d => d.s === sk),
                monData = json.mon.find(d => d.s === sk),
                rptdata={};
            if (dayData)
                rptdata.day = {
                    v: dayData.a,
                    p: dayData.p
                }
            if (monData) {
                rptdata.mon = {
                    v: monData.a,
                    p: monData.p
                }
            }
            return <RealTimeRpt key={sk+"_"+idx} name={sn} rptdata={rptdata} style={{ height: '100%', width: "100%", margin: 0, paddingTop: ".8rem" }} />
        });
    }
    render() {
        return (
            <div className="report-main">
                {
                    this.state.data.map((c,idx) => {
                        return <div key={idx} className="home-rpt-card">
                            <h2 className="home-rpt-card-title">{c.name}</h2>
                            <div className="home-rpt-card-body">
                                {this.getCardRepot(c.data)}
                            </div>
                        </div>
                    })
                }
            </div>
        )
    }
}

export default Report