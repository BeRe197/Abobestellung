import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'

import {saveCustomer} from "../api/Api"
import Toast from "react-bootstrap/Toast";
import Spinner from "react-bootstrap/Spinner";

class Registrieren extends Component {

    constructor(props) {
        super(props);
        this.onChangeDifferentBillingAddress = this.onChangeDifferentBillingAddress.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.toggleDuplicateEmailAddress = this.toggleDuplicateEmailAddress.bind(this)

        this.state = {
            differentBillingAddress: false,
            validated: false,
            signIn: false,
            duplicateEmailAddress: false,
        }
    }

    onChangeDifferentBillingAddress() {
        this.setState((prevState) => ({
            differentBillingAddress: !prevState.differentBillingAddress
        }))
    }

    handleSubmit(event) {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation()
        } else {
            console.log("Erstelle Kunde")
            let newCustomer = {
                id: 0,
                titleAddress: form[1].value,
                firstname: form[2].value,
                lastname: form[3].value,
                companyname: form[0].value,
                email: form[8].checked ? form[13].value : form[9].value,
                password: form[8].checked ? form[15].value : form[11].value,
                phone: form[8].checked ? form[14].value : form[10].value,
                deliveryAddress: {
                    city: form[5].value,
                    plz: form[6].value,
                    street: form[4].value,
                    state: form[7].value,
                },
                billingAddress: {
                    city: form[8].checked ? form[10].value : form[5].value,
                    plz: form[8].checked ? form[11].value : form[6].value,
                    street: form[8].checked ? form[9].value : form[4].value,
                    state: form[8].checked ? form[12].value : form[7].value,
                },
            }

            saveCustomer(newCustomer).then((erg) => {
                console.log("Kunde erstellt")
                if (erg.success[0]) {
                    this.setState({
                        signIn: false,
                    })
                    this.props.handleLogIn(newCustomer)
                } else {
                    this.setState({
                        duplicateEmailAddress: true,
                        signIn: false,
                    })
                }
            })
        }
        event.preventDefault()

        this.setState({
            validated: true,
        })
    }

    toggleDuplicateEmailAddress() {
        this.setState({
            duplicateEmailAddress: false,
        })
    }

    render() {

        const {differentBillingAddress, validated, signIn, duplicateEmailAddress} = this.state

        return (
            <div className={"registrieren"}>
                <h1 className={"registrierenHeadline"}>Registrieren</h1>
                <Form noValidate validated={validated} onSubmit={this.handleSubmit}>
                    <Form.Group controlId="formCompanyName">
                        <Form.Control disabled={signIn} name="companyName" placeholder="Firmenname"/>
                    </Form.Group>

                    <Form.Group controlId="formAnrede">
                        <Form.Control disabled={signIn} required as="select" defaultValue="Herr">
                            <option>Herr</option>
                            <option>Frau</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Row>
                        <Form.Group as={Col} controlId="formFirstName">
                            <Form.Control disabled={signIn} required name="firstName" placeholder="Vorname"/>
                            <Form.Control.Feedback type="invalid">
                                Bitte geben Sie Ihren Vornamen ein.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} controlId="formLastName">
                            <Form.Control disabled={signIn} required name="lastName" placeholder="Nachname"/>
                            <Form.Control.Feedback type="invalid">
                                Bitte geben Sie Ihren Nachnamen ein.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Form.Row>

                    {
                        !differentBillingAddress ?
                            <p>Adresse</p>
                            :
                            <p>Lieferdresse</p>
                    }

                    <Form.Group controlId="formGridAddress1">
                        <Form.Control disabled={signIn} required placeholder="Straße"/>
                        <Form.Control.Feedback type="invalid">
                            Bitte geben Sie Ihre Straße ein.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Row>
                        <Form.Group as={Col} controlId="formGridCity1">
                            <Form.Control disabled={signIn} required name="city" placeholder="Stadt"/>
                            <Form.Control.Feedback type="invalid">
                                Bitte geben Sie Ihre Stadt ein.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridZip1">
                            <Form.Control disabled={signIn} required type="number" name="zip" placeholder="PLZ"/>
                            <Form.Control.Feedback type="invalid">
                                Bitte geben Sie Ihre Postleitzahl ein.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Form.Row>

                    <Form.Group controlId="formGridState1">
                        <Form.Control disabled={signIn} required name="state" as="select" defaultValue="Deutschland">
                            <option>Deutschland</option>
                            <option>Österreich</option>
                            <option>Schweiz</option>
                            <option>Frankreich</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group>
                        <Form.Check disabled={signIn} onChange={this.onChangeDifferentBillingAddress}
                                    label="Abweichende Rechnungsadresse"/>
                    </Form.Group>

                    {
                        differentBillingAddress ?
                            <>
                                <p>Rechnungsdresse</p>

                                <Form.Group controlId="formGridAddress2">
                                    <Form.Control disabled={signIn} required placeholder="Straße"/>
                                    <Form.Control.Feedback type="invalid">
                                        Bitte geben Sie Ihre Straße ein.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Row>
                                    <Form.Group as={Col} controlId="formGridCity2">
                                        <Form.Control disabled={signIn} required name="city" placeholder="Stadt"/>
                                        <Form.Control.Feedback type="invalid">
                                            Bitte geben Sie Ihre Stadt ein.
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formGridZip2">
                                        <Form.Control disabled={signIn} required type="number" name="zip"
                                                      placeholder="PLZ"/>
                                        <Form.Control.Feedback type="invalid">
                                            Bitte geben Sie Ihre Postleitzahl ein.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Form.Row>

                                <Form.Group controlId="formGridState2">
                                    <Form.Control disabled={signIn} required name="state" as="select"
                                                  defaultValue="Deutschland">
                                        <option>Deutschland</option>
                                        <option>Österreich</option>
                                        <option>Schweiz</option>
                                        <option>Frankreich</option>
                                    </Form.Control>
                                </Form.Group>
                            </>
                            :
                            ""
                    }

                    <br/>

                    <Form.Group controlId="formBasicEmail">
                        <Form.Control disabled={signIn} required type="email" placeholder="E-Mail-Adresse"/>
                        <Form.Control.Feedback type="invalid">
                            Bitte geben Sie Ihre E-Mail-Adresse ein.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="formBasicPhone">
                        <Form.Control disabled={signIn} required type="number" placeholder="Telefonnummer"/>
                        <Form.Control.Feedback type="invalid">
                            Bitte geben Sie Ihre Telefonnummer ein.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Control disabled={signIn} required type="password" placeholder="Passwort"/>
                        <Form.Control.Feedback type="invalid">
                            Bitte geben Sie Ihr Passwort ein.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Toast className={"toastErrorBorder"} show={duplicateEmailAddress}
                           onClose={this.toggleDuplicateEmailAddress}>
                        <Toast.Header className={"toastError"}>
                            <strong className="mr-auto">Fehler</strong>
                        </Toast.Header>
                        <Toast.Body>Die eingegebene E-Mail-Adresse ist bereits vorhanden. Möchten Sie sich <Link
                            to="/anmelden">anmelden</Link>?</Toast.Body>
                    </Toast>

                    <br/>

                    <Button variant="primary" type="submit" style={{width: "100%"}}>
                        {
                            signIn ?
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="md"
                                    role="status"
                                    aria-hidden="true"
                                />
                                :
                                "Registrieren"
                        }
                    </Button>

                    <Form.Text muted style={{textAlign: "right"}}>
                        Sie haben bereits einen User? <Link to="/anmelden">Anmelden</Link>
                    </Form.Text>
                </Form>
            </div>
        );
    }
}

Registrieren.propTypes = {
    handleLogIn: PropTypes.func.isRequired,
}

export default Registrieren;