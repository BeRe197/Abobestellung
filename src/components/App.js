import React, {Component} from 'react'
import {Route, Switch, withRouter} from 'react-router-dom'

import Header from './Header'
import LandingPage from "./LandingPage";
import Registrieren from "./Registrieren";
import Login from "./Login";
import Step1Delivery from "./configurator/Step1Delivery";
import Step2Detail from "./configurator/Step2Detail";
import Step3Checkout from "./configurator/Step3Checkout";
import Userprofile from "./user/Userprofile";
import Abonnements from "./user/Abonnements";

import {deleteCustomer, updateCustomer} from "../api/Api";
import ProtectedRoute from "./utils/ProtectedRoute";

import '../assets/style/App.css'

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
        this.onCustomerUpdate = this.onCustomerUpdate.bind(this)
        this.clearAbo = this.clearAbo.bind(this)
        this.onCustomerDelete = this.onCustomerDelete.bind(this)
        this.getMinDate = this.getMinDate.bind(this)

        this.state = {
            isLoggedIn: false,
            user: {
                email: "",
                deliveryAddress: {
                    city: "",
                    plz: "",
                    street: "",
                    state: "Deutschland",
                },
                billingAddress: {
                    city: "",
                    plz: "",
                    street: "",
                    state: "Deutschland",
                },
            },
            startDate: this.getMinDate(),
            hint: "",
            abo: {},
        }
    }

    getMinDate() {
        const minDate = new Date();
        minDate.setDate(minDate.getDate() + 2)

        return minDate
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
        this.setState({
            isLoggedIn: false,
            user: {
                email: "",
                deliveryAddress: {
                    city: "",
                    plz: "",
                    street: "",
                    state: "Deutschland",
                },
                billingAddress: {
                    city: "",
                    plz: "",
                    street: "",
                    state: "Deutschland",
                },
            },
            abo: {},
            startDate: this.getMinDate(),
            hint: "",
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
        this.onCustomerUpdate(newUser)
            .then((response) => {
                console.log("User updated " + response.toString())
            })
            .catch(err => console.log('There was an error:' + err))
    }

    onCustomerUpdate(updatedCustomer) {
        return new Promise((resolve, reject) => {
            updateCustomer(updatedCustomer).then((erg) => {
                this.setState({
                    user: updatedCustomer
                })
                resolve(erg)
            }, () => {
                reject("Error while updating user")
            })
        })
    }

    onCustomerDelete() {
        return new Promise((resolve, reject) => {
            deleteCustomer(this.state.user.id).then((erg) => {
                this.handleLogOut()
                resolve(erg)
            }, () => {
                reject("Error while deleting user")
            })
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

    clearAbo() {
        this.setState({
            abo: {},
            startDate: this.getMinDate(),
            hint: "",
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
                    <ProtectedRoute exact path="/konfigurator/detail" isAuth={user.deliveryAddress.street !== ""}
                                    component={Step2Detail} startDate={startDate}
                                    handleStartDateChange={this.handleStartDateChange} hint={hint}
                                    handleChangeHint={this.handleChangeHint} user={user} isLoggedIn={isLoggedIn}
                                    onAboCreate={this.onAboCreate}/>
                    <ProtectedRoute exact path="/konfigurator/checkout" isAuth={isLoggedIn}
                                    component={Step3Checkout} user={user} abo={abo} isLoggedIn={isLoggedIn}
                                    onCustomerUpdate={this.onCustomerUpdate} clearAbo={this.clearAbo}/>
                    <ProtectedRoute exact path="/checkout" isAuth={isLoggedIn} component={LandingPage}
                                    isLoggedIn={isLoggedIn} userName={user.email} showToast/>
                    <ProtectedRoute exact path="/benutzerprofil" isAuth={isLoggedIn}
                                    component={Userprofile} user={user} onCustomerUpdate={this.onCustomerUpdate}
                                    onCustomerDelete={this.onCustomerDelete}/>
                    <ProtectedRoute exact path="/abonnements" isAuth={isLoggedIn}
                                    component={Abonnements} user={user}/>
                    <Route exact path="/anmelden">
                        <Login handleLogIn={this.handleLogIn}/>
                    </Route>
                    <Route exact path="/registrieren">
                        <Registrieren handleLogIn={this.handleLogIn} user={user}/>
                    </Route>
                    <Route exact path="/abmelden">
                        {this.handleLogOut}
                    </Route>
                    <Route exact path="/">
                        <LandingPage isLoggedIn={isLoggedIn} user={user}/>
                    </Route>
                </Switch>
            </>
        )
    }
}

export default withRouter(App)