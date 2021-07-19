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
import GoodbyePage from "./GoodbyePage";

import ProtectedRoute from "./utils/ProtectedRoute";
import ProtectedRouteAboDetail from "./utils/ProtectedRouteAboDetail";
import {auth, deleteUserDocument, updateUserDocument} from "../config/firebase";
import {UserContext} from "../providers/UserProvider";

import '../assets/style/App.css'

export class App extends Component {
    static contextType = UserContext

    constructor(props) {
        super(props)
        this.handleLogIn = this.handleLogIn.bind(this)
        this.handleLogOut = this.handleLogOut.bind(this)
        this.changeDeliveryAddress = this.changeDeliveryAddress.bind(this)
        this.handleStartDateChange = this.handleStartDateChange.bind(this)
        this.handleChangeHint = this.handleChangeHint.bind(this)
        this.onAboCreate = this.onAboCreate.bind(this)
        this.onCustomerUpdate = this.onCustomerUpdate.bind(this)
        this.clearAbo = this.clearAbo.bind(this)
        this.onCustomerDelete = this.onCustomerDelete.bind(this)
        this.getMinDate = this.getMinDate.bind(this)

        this.state = {
            tempDeliveryAddress: {},
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

    handleLogIn() {
        if (Object.keys(this.state.abo).length === 0 && this.state.abo.constructor === Object) {
            this.props.history.push(`/`)
        } else {
            this.props.history.push(`/konfigurator/checkout`)
        }
    }

    handleLogOut() {
        this.setState({
            tempDeliveryAddress: {},
            abo: {},
            startDate: this.getMinDate(),
            hint: "",
        })
        auth.signOut()
            .then(this.props.history.push(`/`))
            .catch(err => console.error("Error during signout", err))
        return null
    }

    async changeDeliveryAddress(deliveryAddress) {
        if (this.context.user) {
            const newDeliveryAddress = {...this.context.user.deliveryAddress, ...deliveryAddress}
            await this.onCustomerUpdate({deliveryAddress: newDeliveryAddress})
        } else {
            this.setState({
                tempDeliveryAddress: deliveryAddress,
            })
        }
    }

    async onCustomerUpdate(updatedCustomer) {
        await updateUserDocument(this.context.user, updatedCustomer)
        await this.context.updateUser()
    }

    onCustomerDelete() {
        return new Promise((resolve, reject) => {
            const user = auth.currentUser
            user.delete().then(async () => {
                await deleteUserDocument(user)
                resolve()
            }).catch((error) => {
                reject(error)
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

        const {startDate, hint, abo, tempDeliveryAddress} = this.state

        return (
            <>
                <Header/>
                <Switch>
                    <Route exact path="/konfigurator">
                        <Step1Delivery changeDeliveryAddress={this.changeDeliveryAddress}/>
                    </Route>
                    <ProtectedRouteAboDetail exact path="/konfigurator/detail" deliveryAddress={tempDeliveryAddress}
                                             component={Step2Detail} startDate={startDate}
                                             handleStartDateChange={this.handleStartDateChange} hint={hint}
                                             handleChangeHint={this.handleChangeHint} onAboCreate={this.onAboCreate}/>
                    <ProtectedRoute exact path="/konfigurator/checkout" component={Step3Checkout} abo={abo}
                                    onCustomerUpdate={this.onCustomerUpdate} clearAbo={this.clearAbo}/>
                    <ProtectedRoute exact path="/checkout" component={GoodbyePage} showToast/>
                    <ProtectedRoute exact path="/benutzerprofil" component={Userprofile}
                                    onCustomerUpdate={this.onCustomerUpdate} onCustomerDelete={this.onCustomerDelete}/>
                    <ProtectedRoute exact path="/abonnements" component={Abonnements}/>
                    <Route exact path="/anmelden">
                        <Login handleLogIn={this.handleLogIn}/>
                    </Route>
                    <Route exact path="/registrieren">
                        <Registrieren handleLogIn={this.handleLogIn} deliveryAddress={tempDeliveryAddress}/>
                    </Route>
                    <Route exact path="/abmelden">
                        {this.handleLogOut}
                    </Route>
                    <Route exact path="/">
                        <LandingPage/>
                    </Route>
                </Switch>
            </>
        )
    }
}

export default withRouter(App)