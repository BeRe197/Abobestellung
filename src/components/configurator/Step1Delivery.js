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
import Login from "../Login";

class Step1Delivery extends Component {

    constructor(props) {
        super(props);
        this.handleLogIn = this.handleLogIn.bind(this)
        this.handleClose = this.handleClose.bind(this)

        this.state = {
            showModal: false,
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

    render() {

        const {showModal} = this.state

        return (
            <Container style={{paddingTop: "1.5rem"}}>
                <Card>
                    <Card.Img variant="top" className={"productImage"} src={newspaper}/>
                    <Card.Body>
                        <Card.Title style={{fontSize: "2rem"}}>Gedruckte Zeitung</Card.Title>
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
                            <form>
                                <h4 className="deliveryAddress">Lieferadresse</h4>
                                <Button className="headerProfileBtn deliveryLoginBtn" onClick={this.handleLogIn}>
                                    <img
                                        alt="Avatar"
                                        src={avatar}
                                        className="d-inline-block align-top avatar deliveryAvatar"
                                    />{' '}
                                    <div className="headerName">Mit Account fortfahren</div>
                                </Button>
                                <Form.Group controlId="formGridAddress2">
                                    <Form.Control required placeholder="Straße"/>
                                    <Form.Control.Feedback type="invalid">
                                        Bitte geben Sie Ihre Straße ein.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Row>
                                    <Form.Group as={Col} controlId="formGridCity2">
                                        <Form.Control required name="city" placeholder="Stadt"/>
                                        <Form.Control.Feedback type="invalid">
                                            Bitte geben Sie Ihre Stadt ein.
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formGridZip2">
                                        <Form.Control required type="number" name="zip"
                                                      placeholder="PLZ"/>
                                        <Form.Control.Feedback type="invalid">
                                            Bitte geben Sie Ihre Postleitzahl ein.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Form.Row>

                                <Form.Group controlId="formGridState2">
                                    <Form.Control required name="state" as="select"
                                                  defaultValue="Deutschland">
                                        <option>Deutschland</option>
                                        <option>Österreich</option>
                                        <option>Schweiz</option>
                                        <option>Frankreich</option>
                                    </Form.Control>
                                </Form.Group>
                            </form>
                        </ListGroupItem>
                    </ListGroup>
                    <Card.Footer>
                        <Card>
                            <Card.Body>
                                <div className="priceTag">
                                    <div className="priceTagValue">5€</div>
                                </div>
                                <div className="priceTagText">
                                    Grundpreis
                                    <Button style={{float: "inline-end"}}>
                                        Konfigurieren
                                    </Button>
                                </div>
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
                        ...
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Abbrechen
                        </Button>
                        <Button variant="primary" onClick={this.handleClose}>
                            Anmelden
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        );
    }
}

Step1Delivery.propTypes = {};

export default Step1Delivery;
