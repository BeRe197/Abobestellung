import React, {Component} from 'react';
import PropTypes from 'prop-types'

import {readCustomer} from '../api/Api'
import LoginForm from "./fragment/LoginForm";

class Login extends Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this)
        this.toggleUserMissing = this.toggleUserMissing.bind(this)
        this.togglePasswordWrong = this.togglePasswordWrong.bind(this)
        this.state = {
            validated: false,
            logIn: false,
            userMissing: false,
            passwordWrong: false,
        }
    }

    handleSubmit(event) {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation()
        } else {
            this.setState({
                logIn: true,
            })

            readCustomer(form[0].value).then((erg) => {
                if (erg.customer[0] === undefined) {
                    this.setState({
                        logIn: false,
                        userMissing: true,
                    })
                } else if (erg.customer[0].password !== form[1].value) {
                    this.setState({
                        logIn: false,
                        passwordWrong: true,
                    })
                } else {
                    this.props.handleLogIn(erg.customer[0])
                }
            })
        }
        event.preventDefault()

        this.setState({
            validated: true,
        })
    }

    toggleUserMissing() {
        this.setState({
            userMissing: false,
        })
    }

    togglePasswordWrong() {
        this.setState({
            passwordWrong: false,
        })
    }

    render() {

        const {validated, logIn, userMissing, passwordWrong} = this.state

        return (
            <div className={"registrieren"}>
                <h1 className={"registrierenHeadline"}>Anmelden</h1>
                <LoginForm validated={validated} handleSubmit={this.handleSubmit} logIn={logIn}
                           passwordWrong={passwordWrong} togglePasswordWrong={this.togglePasswordWrong}
                           toggleUserMissing={this.toggleUserMissing} userMissing={userMissing}/>
            </div>
        );
    }
}

Login.propTypes = {
    handleLogIn: PropTypes.func.isRequired,
}

export default Login
