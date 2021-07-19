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
import Spinner from "react-bootstrap/Spinner";
import AddressForm from "../fragment/AddressForm";
import Toast from "react-bootstrap/Toast";
import {ImCheckmark} from "react-icons/all";
import Abonnement from "../fragment/Abonnement";
import {UserContext} from "../../providers/UserProvider";
import {generateAboDocument} from "../../config/firebase";

class Step3Checkout extends Component {
    static contextType = UserContext

    constructor(props) {
        super(props);
        this.handleTabChange = this.handleTabChange.bind(this)
        this.handlePaymentChange = this.handlePaymentChange.bind(this)
        this.handleLastschriftInfoChange = this.handleLastschriftInfoChange.bind(this)
        this.openModal = this.openModal.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleCheckoutAbo = this.handleCheckoutAbo.bind(this)
        this.handleTabChangeDirectDebit = this.handleTabChangeDirectDebit.bind(this)
        this.handleCloseDelAddress = this.handleCloseDelAddress.bind(this)
        this.handleUserUpdate = this.handleUserUpdate.bind(this)
        this.handleCloseDelAddressToastSuccess = this.handleCloseDelAddressToastSuccess.bind(this)
        this.handleCloseDelAddressToastError = this.handleCloseDelAddressToastError.bind(this)
        this.openChangeDelAddress = this.openChangeDelAddress.bind(this)
        this.getAbo = this.getAbo.bind(this)

        this.formDataSec = React.createRef()
        this.formIBAN = React.createRef()

        this.state = {
            key: "#1",
            lastschrift: false,
            IBAN: "",
            BIC: "",
            AccountHolder: "",
            showModal: false,
            validatedDataSecurity: false,
            validatedIBAN: false,
            saving: false,
            showModalDelAddress: false,
            updateDelAddress: false,
            validatedDelAddress: false,
            showDelAddressToastSuccess: false,
            showDelAddressToastError: false,
        }
    }

    componentDidMount() {
        this.setState({
            AccountHolder: this.context.user.firstname + " " + this.context.user.lastname,
        })
    }

    handleTabChange(key) {
        this.setState({
            key: key,
        })
    }

    handleTabChangeDirectDebit(key) {
        if (this.state.lastschrift) {
            this.setState({
                validatedIBAN: true,
            })
            if (this.formIBAN.current.checkValidity() === true) {
                this.handleTabChange(key)
            }
        } else {
            this.handleTabChange(key)
        }
    }

    handlePaymentChange() {
        this.setState((prevState) => ({
            lastschrift: !prevState.lastschrift,
        }))
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

    handleCloseDelAddress() {
        if (!this.state.saving) {
            this.setState({
                showModalDelAddress: false,
            })
        }
    }

    handleCloseDelAddressToastSuccess() {
        this.setState({
            showDelAddressToastSuccess: false,
        })
    }

    handleCloseDelAddressToastError() {
        this.setState({
            showDelAddressToastError: false,
        })
    }

    async handleCheckoutAbo() {
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
            newAbo.userId = this.context.user.uid
            if (this.state.lastschrift) {
                newAbo.iban = this.state.IBAN
                newAbo.bic = this.state.BIC
                newAbo.AccountHolder = this.state.AccountHolder
            }
            await generateAboDocument(newAbo)
            this.setState({
                saving: false,
            })
            this.props.clearAbo()
            this.props.history.push(`/checkout`)
        }
    }

    async handleUserUpdate(event) {
        event.preventDefault()
        this.setState({
            validatedDelAddress: true,
        })
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation()
        } else {
            this.setState({
                updateDelAddress: true,
            })
            let billingAddress = {}
            billingAddress.street = form[0].value
            billingAddress.city = form[1].value
            billingAddress.plz = form[2].value
            billingAddress.state = form[3].value

            await this.props.onCustomerUpdate({billingAddress: billingAddress})

            this.setState({
                showModalDelAddress: false,
                updateDelAddress: false,
                showDelAddressToastSuccess: true,
                validatedDelAddress: false,
            })
        }
    }

    openChangeDelAddress() {
        this.setState({
            showModalDelAddress: true,
        })
    }

    getAbo() {
        let newAbo = this.props.abo
        newAbo.paymenttype = this.state.lastschrift ? "Direct Debit" : "Invoice"
        if (this.state.lastschrift) {
            newAbo.IBAN = this.state.IBAN
            newAbo.BIC = this.state.BIC
            newAbo.AccountHolder = this.state.AccountHolder
        }

        return newAbo
    }

    render() {

        const {
            key,
            lastschrift,
            IBAN,
            BIC,
            AccountHolder,
            showModal,
            validatedDataSecurity,
            validatedIBAN,
            saving,
            showModalDelAddress,
            updateDelAddress,
            validatedDelAddress,
            showDelAddressToastSuccess,
            showDelAddressToastError,
        } = this.state

        return (
            <div className="landingPageContainer">
                <Container>
                    <h2 className="detailVersionChapter">Sie haben es gleich geschafft!</h2>
                    <Tabs activeKey={key} id="checkout-tabs" className="mb-3">
                        <Tab tabClassName="tabCheckout" eventKey="#1" title="Rechnungsadresse">
                            <Button className="btnEditAddress" onClick={this.openChangeDelAddress} variant="primary">Rechnungsadresse
                                bearbeiten</Button>
                            <Form>
                                <Form.Group controlId="formGridAddress2">
                                    <Form.Control required disabled value={this.context.user.billingAddress.street}
                                                  onChange={() => {}} placeholder="Straße"/>
                                    <Form.Control.Feedback type="invalid">
                                        Bitte geben Sie Ihre Straße ein.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Row>
                                    <Form.Group as={Col} controlId="formGridCity2">
                                        <Form.Control required disabled value={this.context.user.billingAddress.city}
                                                      name="city" onChange={() => {}}
                                                      placeholder="Stadt"/>
                                        <Form.Control.Feedback type="invalid">
                                            Bitte geben Sie Ihre Stadt ein.
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formGridZip2">
                                        <Form.Control required type="number" disabled onChange={() => {}}
                                                      value={this.context.user.billingAddress.plz} name="zip"
                                                      placeholder="PLZ"/>
                                        <Form.Control.Feedback type="invalid">
                                            Bitte geben Sie Ihre Postleitzahl ein.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Form.Row>

                                <Form.Group controlId="formGridState2">
                                    <Form.Control required name="state" disabled as="select" onChange={() => {}}
                                                  value={this.context.user.billingAddress.state}>
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
                                    <Form noValidate validated={validatedIBAN} ref={this.formIBAN}>
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
                                    onClick={() => (this.handleTabChangeDirectDebit("#3"))}>Weiter</Button>
                        </Tab>
                        <Tab tabClassName="tabCheckout" eventKey="#3" title="Übersicht">
                            <Row>
                                <Col>
                                    <ListGroup.Item>
                                        <h3>Kundeninformationen</h3>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <p><b>Anrede:</b> {this.context.user.titleAddress}</p>
                                        <p><b>Vorname:</b> {this.context.user.firstname}</p>
                                        <p><b>Nachname:</b> {this.context.user.lastname}</p>
                                        <p><b>Firmenname:</b> {this.context.user.companyname}</p>
                                        <p><b>E-Mail:</b> {this.context.user.email}</p>
                                        <p><b>Phone:</b> {this.context.user.phone}</p>
                                    </ListGroup.Item>
                                </Col>
                                <Col>
                                    <ListGroup.Item>
                                        <h3>Adresse</h3>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <p><b>Lieferadresse:</b></p>
                                        <p>{this.context.user.deliveryAddress.street}</p>
                                        <p>{this.context.user.deliveryAddress.city + " " + this.context.user.deliveryAddress.plz}</p>
                                        <p>{this.context.user.deliveryAddress.state}</p>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <p><b>Rechnungsadresse:</b></p>
                                        <p>{this.context.user.billingAddress.street}</p>
                                        <p>{this.context.user.billingAddress.city + " " + this.context.user.billingAddress.plz}</p>
                                        <p>{this.context.user.billingAddress.state}</p>
                                    </ListGroup.Item>
                                </Col>
                            </Row>
                            <br/>
                            <Abonnement abo={this.getAbo()} allowCancel={false}/>
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
                <Modal show={showModalDelAddress} onHide={this.handleCloseDelAddress} backdrop="static" size="lg"
                       aria-labelledby="contained-modal-title-vcenter" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Rechnungsadresse aktualisieren</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{textAlign: "center"}}>
                        <AddressForm validated={validatedDelAddress} handleSubmit={this.handleUserUpdate}
                                     update={updateDelAddress} addressType={"billingAddress"}/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" disabled={saving} onClick={this.handleCloseDelAddress}>
                            Abbrechen
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Toast className="p-3 toastSuccess" onClose={this.handleCloseDelAddressToastSuccess}
                       position={"bottom-center"} bg="success" show={showDelAddressToastSuccess} delay={3000} autohide>
                    <Toast.Header closeButton={false}>
                        <ImCheckmark style={{marginRight: "0.4rem"}}/>
                        <strong className="me-auto">Erfolgreich</strong>
                    </Toast.Header>
                    <Toast.Body>Ihre Rechnungsadresse wurde erfolgreich aktualisiert!</Toast.Body>
                </Toast>
                <Toast className="p-3 toastError" onClose={this.handleCloseDelAddressToastError}
                       position={"bottom-center"} show={showDelAddressToastError} delay={3000} autohide>
                    <Toast.Header closeButton={false}>
                        <ImCheckmark style={{marginRight: "0.4rem"}}/>
                        <strong className="me-auto">Fehlgeschlagen</strong>
                    </Toast.Header>
                    <Toast.Body>Ihre Rechnungsadresse wurde leider nicht aktualisiert. Bitte versuchen Sie es später
                        erneut!</Toast.Body>
                </Toast>
            </div>
        );
    }
}

Step3Checkout.propTypes = {
    abo: PropTypes.object.isRequired,
    onCustomerUpdate: PropTypes.func.isRequired,
    clearAbo: PropTypes.func.isRequired,
};

export default withRouter(Step3Checkout);
