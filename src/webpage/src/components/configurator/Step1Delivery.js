import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom'

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
import {UserContext} from "../../providers/UserProvider";

class Step1Delivery extends Component {
    static contextType = UserContext

    constructor(props) {
        super(props);
        this.handleLogIn = this.handleLogIn.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleSuccessfullyLogIn = this.handleSuccessfullyLogIn.bind(this)
        this.onChangeAddress = this.onChangeAddress.bind(this)
        this.startConfig = this.startConfig.bind(this)

        this.formAddress = React.createRef()

        this.state = {
            showModal: false,
            validatedAddress: false,
            deliveryAddress: {
                state: "Deutschland"
            },
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

    handleSuccessfullyLogIn() {
        this.setState({
            showModal: false,
        })
    }

    onChangeAddress(event) {
        let fieldName = event.target.name;
        let fieldVal = event.target.value;
        let newDeliveryAddress = this.state.deliveryAddress
        newDeliveryAddress[fieldName] = fieldVal

        this.setState({
            deliveryAddress: newDeliveryAddress,
        })
    }

    startConfig(event) {
        const form = this.formAddress.current
        event.preventDefault()
        if (form.checkValidity() === false) {
            event.stopPropagation()
        } else {
            this.props.changeDeliveryAddress(this.state.deliveryAddress)
            this.props.history.push(`/konfigurator/detail`)
        }
        this.setState({
            validatedAddress: true,
        })
    }

    render() {

        const {showModal, validatedAddress} = this.state

        return (
            <Container style={{paddingTop: "1.5rem"}}>
                <Card>
                    <Card.Img variant="top" className={"productImage"} src={newspaper}/>
                    <Card.Body>
                        <Card.Title style={{fontSize: "2rem"}}>Die Zeitung - Gedruckt</Card.Title>
                        <Card.Text>
                            Wer sich intelligent informieren möchte, liest <em>die Zeitung</em>: gründlich recherchierte
                            Fakten,
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
                                    this.context.user ?
                                        <Button className="headerProfileBtn deliveryLoginBtn">
                                            <img
                                                alt="Avatar"
                                                src={avatar}
                                                className="d-inline-block align-top avatar deliveryAvatar"
                                            />{' '}
                                            <div className="headerName">{this.context.user.email}</div>
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
                                                  defaultValue={this.context.user ? this.context.user.deliveryAddress.street : ""}
                                                  onChange={this.onChangeAddress}/>
                                    <Form.Control.Feedback type="invalid">
                                        Bitte geben Sie Ihre Straße ein.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Row>
                                    <Form.Group as={Col} controlId="formGridCity">
                                        <Form.Control required name="city" placeholder="Stadt"
                                                      defaultValue={this.context.user ? this.context.user.deliveryAddress.city : ""}
                                                      onChange={this.onChangeAddress}/>
                                        <Form.Control.Feedback type="invalid">
                                            Bitte geben Sie Ihre Stadt ein.
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formGridZip">
                                        <Form.Control required type="number" name="plz"
                                                      placeholder="PLZ"
                                                      defaultValue={this.context.user ? this.context.user.deliveryAddress.plz : ""}
                                                      onChange={this.onChangeAddress}/>
                                        <Form.Control.Feedback type="invalid">
                                            Bitte geben Sie Ihre Postleitzahl ein.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Form.Row>

                                <Form.Group controlId="formGridState">
                                    <Form.Control required name="state" as="select"
                                                  defaultValue={this.context.user ? this.context.user.deliveryAddress.state : ""}
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
                                    <div className="priceTagValue">10€*</div>
                                </div>
                                <div className="priceTagText">
                                    Die Zeitung - Gedruckt
                                    <Button onClick={this.startConfig} style={{float: "right"}}>
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
                        <LoginForm handleSuccessfullyLogIn={this.handleSuccessfullyLogIn}/>
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
    changeDeliveryAddress: PropTypes.func.isRequired,
};

export default withRouter(Step1Delivery);
