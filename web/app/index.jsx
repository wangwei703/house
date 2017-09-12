import "./index.less";

import { HashRouter, Redirect, Route, Switch } from "react-router-dom";
import React, { Component } from 'react'

import Content from './layout/content';
import Header from './layout/header';

export default class App extends Component {

  render() {
    return (
      <HashRouter>
        <div className="layout">
          <Header />
          <Content />
        </div>
      </HashRouter>
    );
  }
}