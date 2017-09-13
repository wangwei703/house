import React, { Component, PropTypes } from 'react'

import Community from "../cfg/comm.js";
import RealTimeRpt from "containers/home";
import fetchData from 'libs/comm/fetch';

class Report extends Component {
    state = {
        data: []
    }
    componentDidMount() {
        fetchData("home").then(json => {
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
        })
    }
    getCardRepot(json) {
        let rptdata = Object.entries(json.source).map((s, idx) => {
            let sk = s[0], sn = s[1];
            let dayData = json.day.find(d => d.s === sk),
                monData = json.mon.find(d => d.s === sk),
                data = {};
            if (dayData)
                data.day = {
                    v: dayData.a,
                    p: dayData.p
                }
            if (monData) {
                data.mon = {
                    v: monData.a,
                    p: monData.p
                }
            }
            return {
                name: sn,
                data
            };
        });
        return <RealTimeRpt rptdata={rptdata} />
    }
    render() {
        return (
            <div className="report-main">
                {
                    this.state.data.map((c, idx) => {
                        return <div key={idx} className="report-main-item">
                            <h2 className="report-main-item-title">{c.name}</h2>
                            <div className="report-main-item-body">
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