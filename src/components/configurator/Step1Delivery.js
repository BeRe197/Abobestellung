import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import Modal from "react-bootstrap/Modal";

import newspaper from "../../assets/images/newspaper.jpg"
import avatar from "../../assets/images/avatar.jpg";
import LoginForm from "../fragment/LoginForm";
import {readCustomer} from "../../api/Api";

class Step1Delivery extends Component {

    constructor(props) {
        super(props);
        this.handleLogIn = this.handleLogIn.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.toggleUserMissing = this.toggleUserMissing.bind(this)
        this.togglePasswordWrong = this.togglePasswordWrong.bind(this)
        this.onChangeAddress = this.onChangeAddress.bind(this)
        this.startConfig = this.startConfig.bind(this)

        this.formAddress = React.createRef()

        this.state = {
            showModal: false,
            validated: false,
            logIn: false,
            userMissing: false,
            passwordWrong: false,
            validatedAddress: false,
        }
    }

    handleLogIn() {
        this.setState({
            showModal: true,
        })
    }

    handleClose() {
        this.setState({
            showModal: false,
        })
    }

    handleSubmit(event) {
        const form = event.currentTarget;
        event.preventDefault()
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
                    this.props.loginUser(erg.customer[0])
                    this.setState({
                        login: false,
                        showModal: false,
                    })
                }
            })
        }

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

    onChangeAddress(event) {
        let fieldName = event.target.name;
        let fieldVal = event.target.value;

        this.props.changeDeliveryAddress(fieldName, fieldVal)
    }

    startConfig(event) {
        const form = this.formAddress.current
        event.preventDefault()
        if (form.checkValidity() === false) {
            event.stopPropagation()
        } else {
            this.props.history.push(`/konfigurator/detail`)
        }
        this.setState({
            validated: true,
        })
    }

    render() {

        const {showModal, validated, logIn, userMissing, passwordWrong, validatedAddress} = this.state
        const {user, isLoggedIn} = this.props

        return (
            <Container style={{paddingTop: "1.5rem"}}>
                <Card>
                    <Card.Img variant="top" className={"productImage"} src={newspaper}/>
                    <Card.Body>
                        <Card.Title style={{fontSize: "2rem"}}>Die Zeitung - Gedruckt</Card.Title>
                        <Card.Text>
                            Wer sich intelligent informieren möchte, liest die Zeitung: gründlich recherchierte Fakten,
                            präzise Analysen, klug geschriebene Kommentare. Eine Zeitung, gemacht von erstklassigen
                            Journalisten für Leser mit höchsten Ansprüchen.
                        </Card.Text>
                    </Card.Body>
                    <ListGroup className="list-group-flush">
                        <ListGroupItem>
                            Geben Sie unten Ihre Adresse an und wählen Sie anschließend folgende Optionen in unserem
                            Konfigurator:<br/><br/>
                            <ul>
                                <li>Ausgabe</li>
                                <li>Art des Abonnements</li>
                                <li>Zahlungsart und Zahlungszeitpunkt</li>
                                <li>Start-Datum Ihres Abonnements</li>
                            </ul>
                        </ListGroupItem>
                        <ListGroupItem>
                            <Form noValidate validated={validatedAddress} ref={this.formAddress}>
                                <h4 className="deliveryAddress">Lieferadresse</h4>
                                {
                                    isLoggedIn ?
                                        <Button className="headerProfileBtn deliveryLoginBtn">
                                            <img
                                                alt="Avatar"
                                                src={avatar}
                                                className="d-inline-block align-top avatar deliveryAvatar"
                                            />{' '}
                                            <div className="headerName">{user.email}</div>
                                        </Button>
                                        :
                                        <Button className="headerProfileBtn deliveryLoginBtn"
                                                onClick={this.handleLogIn}>
                                            <img
                                                alt="Avatar"
                                                src={avatar}
                                                className="d-inline-block align-top avatar deliveryAvatar"
                                            />{' '}
                                            <div className="headerName">Mit Account fortfahren</div>
                                        </Button>
                                }
                                <Form.Group controlId="formGridAddress">
                                    <Form.Control name="street" required placeholder="Straße"
                                                  value={user.deliveryAddress.street} onChange={this.onChangeAddress}/>
                                    <Form.Control.Feedback type="invalid">
                                        Bitte geben Sie Ihre Straße ein.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Row>
                                    <Form.Group as={Col} controlId="formGridCity">
                                        <Form.Control required name="city" placeholder="Stadt"
                                                      value={user.deliveryAddress.city}
                                                      onChange={this.onChangeAddress}/>
                                        <Form.Control.Feedback type="invalid">
                                            Bitte geben Sie Ihre Stadt ein.
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formGridZip">
                                        <Form.Control required type="number" name="plz"
                                                      placeholder="PLZ" value={user.deliveryAddress.plz}
                                                      onChange={this.onChangeAddress}/>
                                        <Form.Control.Feedback type="invalid">
                                            Bitte geben Sie Ihre Postleitzahl ein.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Form.Row>

                                <Form.Group controlId="formGridState">
                                    <Form.Control required name="state" as="select"
                                                  value={user.deliveryAddress.state}
                                                  onChange={this.onChangeAddress}>
                                        <option>Deutschland</option>
                                        <option>Österreich</option>
                                        <option>Schweiz</option>
                                        <option>Frankreich</option>
                                    </Form.Control>
                                </Form.Group>
                            </Form>
                        </ListGroupItem>
                    </ListGroup>
                    <Card.Footer>
                        <Card>
                            <Card.Body>
                                <div className="priceTag">
                                    <div className="priceTagValue">5€*</div>
                                </div>
                                <div className="priceTagText">
                                    Die Zeitung - Gedruckt
                                    <Button onClick={this.startConfig} style={{float: "inline-end"}}>
                                        Konfigurieren
                                    </Button>
                                </div>
                                <p className="priceTagMuted">*Grundpreis</p>
                            </Card.Body>
                        </Card>
                    </Card.Footer>
                </Card>
                <Modal show={showModal} onHide={this.handleClose} backdrop="static" size="lg"
                       aria-labelledby="contained-modal-title-vcenter" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Anmelden</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <LoginForm validated={validated} handleSubmit={this.handleSubmit} logIn={logIn}
                                   passwordWrong={passwordWrong} togglePasswordWrong={this.togglePasswordWrong}
                                   toggleUserMissing={this.toggleUserMissing} userMissing={userMissing}/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Abbrechen
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        );
    }
}

Step1Delivery.propTypes = {
    loginUser: PropTypes.func.isRequired,
    user: PropTypes.any,
    isLoggedIn: PropTypes.bool.isRequired,
    changeDeliveryAddress: PropTypes.func.isRequired,
};

export default Step1Delivery;
