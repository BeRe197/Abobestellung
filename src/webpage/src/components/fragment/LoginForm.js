import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from "react-router-dom";

import Form from "react-bootstrap/Form";
import Toast from "react-bootstrap/Toast";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

class LoginForm extends Component {

    render() {

        const {
            validated,
            handleSubmit,
            logIn,
            userMissing,
            passwordWrong,
            toggleUserMissing,
            togglePasswordWrong
        } = this.props

        return (
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
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

                <Toast className={"toastErrorBorder, loginToast"} show={userMissing} onClose={toggleUserMissing}>
                    <Toast.Header className={"toastError"}>
                        <strong className="mr-auto">Fehler</strong>
                    </Toast.Header>
                    <Toast.Body>Die eingegebene E-Mail-Adresse ist nicht vorhanden. Wollen Sie sich <Link
                        to="/registrieren">registrieren</Link>?</Toast.Body>
                </Toast>

                <Toast className={"toastErrorBorder, loginToast"} show={passwordWrong} onClose={togglePasswordWrong}>
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
        );
    }
}

LoginForm.propTypes = {
    validated: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    logIn: PropTypes.bool.isRequired,
    userMissing: PropTypes.bool.isRequired,
    passwordWrong: PropTypes.bool.isRequired,
    toggleUserMissing: PropTypes.func.isRequired,
    togglePasswordWrong: PropTypes.func.isRequired,
};

export default LoginForm;
