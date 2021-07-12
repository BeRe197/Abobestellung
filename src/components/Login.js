import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Toast from "react-bootstrap/Toast"

import {readCustomer} from '../api/Api'

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
                    this.props.handleLogIn(erg)
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
                <Form noValidate validated={validated} onSubmit={this.handleSubmit}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Control disabled={logIn} required type="email" placeholder="E-Mail-Adresse"/>
                        <Form.Control.Feedback type="invalid">
                            Bitte geben Sie Ihre E-Mail-Adresse ein.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Control disabled={logIn} required type="password" placeholder="Passwort"/>
                        <Form.Control.Feedback type="invalid">
                            Bitte geben Sie Ihr Passwort ein.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Toast className={"toastErrorBorder"} show={userMissing} onClose={this.toggleUserMissing}>
                        <Toast.Header className={"toastError"}>
                            <strong className="mr-auto">Fehler</strong>
                        </Toast.Header>
                        <Toast.Body>Die eingegebene E-Mail-Adresse ist nicht vorhanden. Wollen Sie sich <Link
                            to="/registrieren">registrieren</Link>?</Toast.Body>
                    </Toast>

                    <Toast className={"toastErrorBorder"} show={passwordWrong} onClose={this.togglePasswordWrong}>
                        <Toast.Header className={"toastError"}>
                            <strong className="mr-auto">Fehler</strong>
                        </Toast.Header>
                        <Toast.Body>Das eingegebe Passwort ist falsch. Bitte versuchen Sie es erneut!</Toast.Body>
                    </Toast>

                    <Button variant="primary" type="submit" style={{width: "100%"}}>
                        {
                            logIn ?
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="md"
                                    role="status"
                                    aria-hidden="true"
                                />
                                :
                                "Anmelden"
                        }
                    </Button>

                    <Form.Text muted style={{textAlign: "right"}}>
                        Sie haben noch keinen User? <Link to="/registrieren">Registrieren</Link>
                    </Form.Text>
                </Form>
            </div>
        );
    }
}

Login.propTypes = {
    handleLogIn: PropTypes.func.isRequired,
}

export default Login
