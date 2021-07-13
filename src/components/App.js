import React, {Component} from 'react'
import {Route, Switch, withRouter} from 'react-router-dom'

import Header from './Header'
import LandingPage from "./LandingPage";
import Registrieren from "./Registrieren";
import Login from "./Login";
import Step1Delivery from "./configurator/Step1Delivery";

import '../assets/style/App.css'

export class App extends Component {

    constructor(props) {
        super(props)
        this.handleLogIn = this.handleLogIn.bind(this)
        this.handleLogOut = this.handleLogOut.bind(this)
        this.loginUser = this.loginUser.bind(this)
        this.changeDeliveryAddress = this.changeDeliveryAddress.bind(this)
        this.state = {
            isLoggedIn: false,
            user: {
                email: "",
                deliveryAddress: {
                    city: "",
                    plz: "",
                    street: "",
                    state: "",
                },
            },
        }
    }

    handleLogIn(user) {
        this.loginUser(user)
        // TODO: Check from where the login form was called and route correctly back
        this.props.history.push(`/`)
    }

    handleLogOut() {
        this.setState({
            isLoggedIn: false,
            user: {
                email: "",
                deliveryAddress: {
                    city: "",
                    plz: "",
                    street: "",
                    state: "",
                },
            },
        })
        this.props.history.push(`/`)
        return null
    }

    loginUser(user) {
        this.setState({
            isLoggedIn: true,
            user: user,
        })
    }

    changeDeliveryAddress(field, value) {
        const newUser = this.state.user
        newUser.deliveryAddress[field] = value
        this.setState({
            user: newUser
        })
    }

    render() {

        const {isLoggedIn, user} = this.state

        return (
            <>
                <Header isLoggedIn={isLoggedIn} userName={user.email}/>
                <Switch>
                    <Route exact path="/konfigurator">
                        <Step1Delivery loginUser={this.loginUser} user={user} isLoggedIn={isLoggedIn}
                                       changeDeliveryAddress={this.changeDeliveryAddress}/>
                    </Route>
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
                        <LandingPage isLoggedIn={isLoggedIn} userName={user.email}/>
                    </Route>
                </Switch>
            </>
        )
    }
}

export default withRouter(App)