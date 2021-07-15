import React, {Component} from 'react'
import {Route, Switch, withRouter} from 'react-router-dom'

import Header from './Header'
import LandingPage from "./LandingPage";
import Registrieren from "./Registrieren";
import Login from "./Login";
import Step1Delivery from "./configurator/Step1Delivery";

import '../assets/style/App.css'
import Step2Detail from "./configurator/Step2Detail";
import Step3Checkout from "./configurator/Step3Checkout";

export class App extends Component {

    constructor(props) {
        super(props)
        this.handleLogIn = this.handleLogIn.bind(this)
        this.handleLogOut = this.handleLogOut.bind(this)
        this.loginUser = this.loginUser.bind(this)
        this.changeDeliveryAddress = this.changeDeliveryAddress.bind(this)
        this.handleStartDateChange = this.handleStartDateChange.bind(this)
        this.handleChangeHint = this.handleChangeHint.bind(this)
        this.onAboCreate = this.onAboCreate.bind(this)

        const minDate = new Date();
        minDate.setDate(minDate.getDate() + 2);

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
                billingAddress: {
                    city: "",
                    plz: "",
                    street: "",
                    state: "",
                },
            },
            startDate: minDate,
            hint: "",
            abo: {},
        }
    }

    handleLogIn(user) {
        this.loginUser(user)
        // TODO: Check from where the login form was called and route correctly back
        if (Object.keys(this.state.abo).length === 0 && this.state.abo.constructor === Object) {
            this.props.history.push(`/`)
        } else {
            this.props.history.push(`/konfigurator/checkout`)
        }
    }

    handleLogOut() {
        const minDate = new Date();
        minDate.setDate(minDate.getDate() + 2);

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
                billingAddress: {
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

    handleStartDateChange(date) {
        this.setState({
            startDate: date,
        })
    }

    handleChangeHint(event) {
        this.setState({
            hint: event.target.value,
        })
    }

    onAboCreate(abo) {
        this.setState({
            abo: abo,
        })
    }

    render() {

        const {isLoggedIn, user, startDate, hint, abo} = this.state

        return (
            <>
                <Header isLoggedIn={isLoggedIn} userName={user.email}/>
                <Switch>
                    <Route exact path="/konfigurator">
                        <Step1Delivery loginUser={this.loginUser} user={user} isLoggedIn={isLoggedIn}
                                       changeDeliveryAddress={this.changeDeliveryAddress}/>
                    </Route>
                    <Route exact path="/konfigurator/detail">
                        <Step2Detail startDate={startDate} handleStartDateChange={this.handleStartDateChange}
                                     hint={hint} handleChangeHint={this.handleChangeHint} user={user}
                                     isLoggedIn={isLoggedIn} onAboCreate={this.onAboCreate}/>
                    </Route>
                    <Route exact path="/konfigurator/checkout">
                        <Step3Checkout user={user} abo={abo}/>
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