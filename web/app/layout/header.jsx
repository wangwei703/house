import React, { Component } from 'react'

import { NavLink } from "react-router-dom";

const LINKS = [{
    key: "home",
    name: "首页"
}, {
    key: "avgprice",
    name: "日走势"
}, {
    key: "avgpricemon",
    name: "月走势"
}, {
    key: "quantity",
    name: "房源数"
}]
class componentName extends Component {
    render() {
        return <header className="navbar">
            {LINKS.map(l => <div key={l.key} className="navbar-item">
                <NavLink className="navbar-item-link" to={"/" + l.key} activeClassName="active">{l.name}</NavLink>
            </div>)
            }
        </header>
    }
}

export default componentName