import React from "react"
import ReactDom from "react-dom"
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Register from './components/register'
import Login from './components/login'
import Dashboard from './components/dashboard'
import { initializeIcons } from '@fluentui/font-icons-mdl2';

initializeIcons();

ReactDom.render(
    <Router>
        <Switch>
            <Route path="/register">
                <Register />
            </Route>

            <Route path="/login">
                <Login />
            </Route>

            <Route path="/">
                <Dashboard />
            </Route>
        </Switch>
    </Router>
    ,
    document.getElementById('app'))