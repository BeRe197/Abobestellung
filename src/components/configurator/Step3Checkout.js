import React, {Component} from 'react';
import {withRouter} from "react-router-dom";
import PropTypes from 'prop-types';

import Container from "react-bootstrap/Container";
import {Row, Tab, Tabs} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import {Grid, Switch, Typography} from "@material-ui/core";
import ListGroup from "react-bootstrap/ListGroup";
import Modal from "react-bootstrap/Modal";
import {saveAboForCustomer} from "../../api/Api";
import Spinner from "react-bootstrap/Spinner";

class Step3Checkout extends Component {

    constructor(props) {
        super(props);
        this.handleTabChange = this.handleTabChange.bind(this)
        this.handlePaymentChange = this.handlePaymentChange.bind(this)
        this.getAboVersion = this.getAboVersion.bind(this)
        this.getAboPrice = this.getAboPrice.bind(this)
        this.getAboVariant = this.getAboVariant.bind(this)
        this.getDeliveryMethod = this.getDeliveryMethod.bind(this)
        this.getPaymentType = this.getPaymentType.bind(this)
        this.handleLastschriftInfoChange = this.handleLastschriftInfoChange.bind(this)
        this.openModal = this.openModal.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleCheckoutAbo = this.handleCheckoutAbo.bind(this)

        this.formDataSec = React.createRef()

        this.state = {
            key: "#1",
            lastschrift: false,
            IBAN: "",
            BIC: "",
            AccountHolder: this.props.user.firstname + " " + this.props.user.lastname,
            showModal: false,
            validatedDataSecurity: false,
            saving: false,
        }
    }

    handleTabChange(key) {
        this.setState({
            key: key,
        })
    }

    handlePaymentChange() {
        this.setState((prevState) => ({
            lastschrift: !prevState.lastschrift,
        }))
    }

    getAboVersion() {
        // eslint-disable-next-line default-case
        switch (this.props.abo.localpaperversions) {
            case 1:
                return "Stadtausgabe"
            case 2:
                return "Sportversion"
            case 3:
                return "Landkreisinfo"
        }
    }

    getAboPrice() {
        let price
        let deliveryMethod

        if (this.props.abo.payment === "Annual") {
            price = this.props.abo.calculatedyearprice
            deliveryMethod = "Jahr"
        } else {
            price = this.props.abo.calculatedprice
            deliveryMethod = "Monat"
        }

        return price + "€/" + deliveryMethod
    }

    getAboVariant() {
        return this.props.abo.subscriptiontype === "Weekend" ? "Wochenende" : "Täglich"
    }

    getDeliveryMethod() {
        return this.props.abo.deliverymethod === "Post" ? "Post" : "Austräger"
    }

    getPaymentType() {
        if (this.state.lastschrift) {
            return (
                <>
                    <p>Per <b>Lastschrift</b></p>
                    <p><b>IBAN:</b> {this.state.IBAN}</p>
                    <p><b>BIC:</b> {this.state.BIC}</p>
                    <p><b>Kontoinhaber:</b> {this.state.AccountHolder}</p>
                </>
            );
        } else {
            return (
                <p>Per <b>Rechnung</b> an oben angegebene Adresse</p>
            );
        }
    }

    handleLastschriftInfoChange(event) {
        let fieldName = event.target.name;
        let fieldVal = event.target.value;

        switch (fieldName) {
            case "IBAN":
                this.setState({
                    IBAN: fieldVal,
                })
                break;
            case "BIC":
                this.setState({
                    BIC: fieldVal,
                })
                break;
            case "AccountHolder":
                this.setState({
                    AccountHolder: fieldVal,
                })
                break;
            default:
                break;
        }
    }

    openModal() {
        this.setState({
            showModal: true,
        })
    }

    handleClose() {
        if (!this.state.saving) {
            this.setState({
                showModal: false,
            })
        }
    }

    handleCheckoutAbo() {
        this.setState({
            validatedDataSecurity: true,
        })
        if (this.formDataSec.current.checkValidity() === true) {
            this.setState({
                saving: true,
            })
            let newAbo = this.props.abo
            newAbo.dataprivacyaccepted = true
            newAbo.paymenttype = this.state.lastschrift ? "Direct Debit" : "Invoice"
            newAbo.cid = this.props.user.id
            if (this.state.lastschrift) {
                newAbo.iban = this.state.IBAN
                newAbo.bic = this.state.BIC
                newAbo.AccountHolder = this.state.AccountHolder
            }
            saveAboForCustomer(newAbo).then((erg) => {
                console.log("Save:" + Object.values(erg))
                this.setState({
                    saving: false,
                })
                this.props.history.push(`/checkout`)
            })
        }
    }

    render() {

        const {key, lastschrift, IBAN, BIC, AccountHolder, showModal, validatedDataSecurity, saving} = this.state
        const {user, abo} = this.props

        return (
            <div className="landingPageContainer">
                <Container>
                    <h2 className="detailVersionChapter">Sie haben es gleich geschafft!</h2>
                    <Tabs activeKey={key} id="checkout-tabs" className="mb-3">
                        <Tab tabClassName="tabCheckout" eventKey="#1" title="Rechnungsadresse">
                            <Form>
                                <Form.Group controlId="formGridAddress2">
                                    <Form.Control required disabled defaultValue={user.billingAddress.street}
                                                  placeholder="Straße"/>
                                    <Form.Control.Feedback type="invalid">
                                        Bitte geben Sie Ihre Straße ein.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Row>
                                    <Form.Group as={Col} controlId="formGridCity2">
                                        <Form.Control required disabled defaultValue={user.billingAddress.city}
                                                      name="city"
                                                      placeholder="Stadt"/>
                                        <Form.Control.Feedback type="invalid">
                                            Bitte geben Sie Ihre Stadt ein.
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formGridZip2">
                                        <Form.Control required type="number" disabled
                                                      defaultValue={user.billingAddress.plz} name="zip"
                                                      placeholder="PLZ"/>
                                        <Form.Control.Feedback type="invalid">
                                            Bitte geben Sie Ihre Postleitzahl ein.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Form.Row>

                                <Form.Group controlId="formGridState2">
                                    <Form.Control required name="state" disabled as="select"
                                                  defaultValue={user.billingAddress.state}>
                                        <option>Deutschland</option>
                                        <option>Österreich</option>
                                        <option>Schweiz</option>
                                        <option>Frankreich</option>
                                    </Form.Control>
                                </Form.Group>
                            </Form>
                            <Button variant="outline-primary"
                                    onClick={() => (this.handleTabChange("#2"))}>Weiter</Button>
                        </Tab>
                        <Tab tabClassName="tabCheckout" eventKey="#2" title="Zahlungsinformationen">
                            <Typography component="div">
                                <Grid component="label" container alignItems="center" justifyContent="center"
                                      spacing={0}>
                                    <Grid item>Rechnung</Grid>
                                    <Grid item>
                                        <Switch color={"secondary"} size="medium" checked={lastschrift}
                                                onChange={this.handlePaymentChange} name="aboDailyWeekend"/>
                                    </Grid>
                                    <Grid item>Lastschrift</Grid>
                                </Grid>
                            </Typography>
                            {
                                lastschrift ?
                                    <Form>
                                        <Form.Group controlId="formGridIBAN">
                                            <Form.Control name="IBAN" value={IBAN}
                                                          onChange={this.handleLastschriftInfoChange} required
                                                          placeholder="IBAN"/>
                                            <Form.Control.Feedback type="invalid">
                                                Bitte geben Sie Ihre IBAN ein.
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group controlId="formGridBIC">
                                            <Form.Control name="BIC" value={BIC}
                                                          onChange={this.handleLastschriftInfoChange} required
                                                          placeholder="BIC"/>
                                            <Form.Control.Feedback type="invalid">
                                                Bitte geben Sie Ihre BIC ein.
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group controlId="formGridAccountHolder">
                                            <Form.Control name="AccountHolder" value={AccountHolder}
                                                          onChange={this.handleLastschriftInfoChange} required
                                                          placeholder="Kontoinhalber"/>
                                            <Form.Control.Feedback type="invalid">
                                                Bitte geben Sie den Kontoinhaber ein.
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Form>
                                    : ""
                            }
                            <Button variant="outline-secondary" style={{marginRight: "10px"}}
                                    onClick={() => (this.handleTabChange("#1"))}>Zurück</Button>
                            <Button variant="outline-primary"
                                    onClick={() => (this.handleTabChange("#3"))}>Weiter</Button>
                        </Tab>
                        <Tab tabClassName="tabCheckout" eventKey="#3" title="Übersicht">
                            <Row>
                                <Col>
                                    <ListGroup.Item>
                                        <h3>Kundeninformationen</h3>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <p><b>Anrede:</b> {user.titleAddress}</p>
                                        <p><b>Vorname:</b> {user.firstname}</p>
                                        <p><b>Nachname:</b> {user.lastname}</p>
                                        <p><b>Firmenname:</b> {user.companyname}</p>
                                        <p><b>E-Mail:</b> {user.email}</p>
                                        <p><b>Phone:</b> {user.phone}</p>
                                    </ListGroup.Item>
                                </Col>
                                <Col>
                                    <ListGroup.Item>
                                        <h3>Adresse</h3>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <p><b>Lieferadresse:</b></p>
                                        <p>{user.deliveryAddress.street}</p>
                                        <p>{user.deliveryAddress.city + " " + user.deliveryAddress.plz}</p>
                                        <p>{user.deliveryAddress.state}</p>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <p><b>Rechnungsadresse:</b></p>
                                        <p>{user.billingAddress.street}</p>
                                        <p>{user.billingAddress.city + " " + user.billingAddress.plz}</p>
                                        <p>{user.billingAddress.state}</p>
                                    </ListGroup.Item>
                                </Col>
                            </Row>
                            <br/>
                            <Row>
                                <Col>
                                    <ListGroup.Item>
                                        <h3>Aboinformationen</h3>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <p><b>Ausgabe:</b> {this.getAboVersion()}</p>
                                        <p><b>Start:</b> {abo.startabodate}</p>
                                        <p><b>Preis:</b> {this.getAboPrice()}</p>
                                        <p><b>Abonnementvariante:</b> {this.getAboVariant()}</p>
                                        <p><b>Liefermethode:</b> {this.getDeliveryMethod()}</p>
                                        <p><b>Hinweis:</b> {abo.hintDeliveryMan}</p>
                                    </ListGroup.Item>
                                </Col>
                                <Col>
                                    <ListGroup.Item>
                                        <h3>Zahlungsinformationen</h3>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        {
                                            this.getPaymentType()
                                        }
                                    </ListGroup.Item>
                                </Col>
                            </Row>
                            <br/>
                            <Button variant="outline-secondary" style={{marginRight: "10px"}}
                                    onClick={() => (this.handleTabChange("#2"))}>Zurück</Button>
                            <Button variant="outline-primary" onClick={this.openModal}>Fertig</Button>
                        </Tab>
                    </Tabs>
                </Container>
                <Modal show={showModal} onHide={this.handleClose} backdrop="static" size="lg"
                       aria-labelledby="contained-modal-title-vcenter" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Checkout</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{textAlign: "center"}}>
                        <p>Möchten Sie das Abo verbindlich bestellen?</p>
                        <Form noValidate validated={validatedDataSecurity} ref={this.formDataSec}>
                            <Form.Group>
                                <Form.Check>
                                    <Form.Check.Input disabled={saving} required/>
                                    <Form.Check.Label>Ich akzeptiere die Datenschatzbestimmungen</Form.Check.Label>
                                    <Form.Control.Feedback type="invalid">Sie müssen dem Datenschutz
                                        zustimmen!</Form.Control.Feedback>
                                </Form.Check>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" disabled={saving} onClick={this.handleClose}>
                            Abbrechen
                        </Button>
                        <Button variant="primary" disabled={saving} onClick={this.handleCheckoutAbo}>
                            {
                                saving ?
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="md"
                                        role="status"
                                        aria-hidden="true"
                                    />
                                    :
                                    "Bestellen"
                            }
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

Step3Checkout.propTypes = {};

export default withRouter(Step3Checkout);
