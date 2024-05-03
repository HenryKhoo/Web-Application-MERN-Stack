import React from 'react';
import {render} from 'react-dom';
import {Router, Switch, Route} from "react-router-dom";
import history from "./history";
import App from "./components/App";
import Blocks from "./components/Blocks"
import ConductTransaction from './components/ConductTransaction';
import TransactionPool from './components/TransactionPool';

import Login from './components/Login';
import Register from './components/Register';
import "./index.css";

render(

    <Router history={history}>
        <Switch>
            <Route exact={true} path="/" component={Login} />
            <Route path="/app" component={App} />
            <Route path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route path="/blocks" component={Blocks} />
            <Route path="/conduct-transaction" component={ConductTransaction} />
            <Route path="/transaction-pool" component={TransactionPool} />
        </Switch>
    </Router>,
    document.getElementById("root") 
 
 );

