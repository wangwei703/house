import React, { Component } from 'react'
import {Redirect, Route, Switch} from "react-router-dom";

import AvgPrice from 'app/avgprice';
import AvgPriceMon from 'app/avgpricemon';
import HOME from 'app/home';
import Quantity from 'app/quantity';

class Content extends Component {
    render() {
        return (
            <div className="content">
                <Switch>
                    <Route exact path="/home" component={HOME} />
                    <Route exact path="/avgprice" component={AvgPrice} />
                    <Route exact path="/avgpricemon" component={AvgPriceMon} />
                    <Route exact path="/quantity" component={Quantity} />
                    <Redirect from='/' to='/home' />
                </Switch>
            </div>
        )
    }
}

export default Content