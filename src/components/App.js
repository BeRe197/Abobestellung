import React, {Component} from 'react'
import {Route, Switch, withRouter} from 'react-router-dom'

import Header from './Header'
import LandingPage from "./LandingPage";
import Registrieren from "./Registrieren";
import Login from "./Login";

import '../assets/style/App.css'

export class App extends Component {

    constructor(props) {
        super(props)
        this.handleLogIn = this.handleLogIn.bind(this)
        this.handleLogOut = this.handleLogOut.bind(this)
        this.state = {
            isLoggedIn: false,
            userName: "",
        }
    }

    handleLogIn(userName) {
        this.setState({
            isLoggedIn: true,
            userName: userName,
        })
        // TODO: Check from where the login form was called and route correctly back
        this.props.history.push(`/`)
    }

    handleLogOut() {
        this.setState({
            isLoggedIn: false,
            userName: "",
        })
        this.props.history.push(`/`)
        return null
    }

    render() {

        const {isLoggedIn, userName} = this.state

        return (
            <>
                <Header isLoggedIn={isLoggedIn} userName={userName}/>
                <Switch>
                    <Route exact path="/anmelden">
                        <Login handleLogIn={this.handleLogIn}/>
                    </Route>
                    <Route exact path="/registrieren">
                        <Registrieren handleLogIn={this.handleLogIn}/>
                    </Route>
                    <Route exact path="/abmelden">
                        {this.handleLogOut}
                    </Route>
                    <Route exact path="/">
                        <LandingPage isLoggedIn={isLoggedIn} userName={userName}/>
                    </Route>
                </Switch>
            </>
        )
    }
}

export default withRouter(App)