import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import {Row} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import {updateAboForCustomer} from "../../api/Api";

class Abonnement extends Component {

    constructor(props) {
        super(props);
        this.getAboVersion = this.getAboVersion.bind(this)
        this.getAboPrice = this.getAboPrice.bind(this)
        this.getAboVariant = this.getAboVariant.bind(this)
        this.getDeliveryMethod = this.getDeliveryMethod.bind(this)
        this.getPaymentType = this.getPaymentType.bind(this)
        this.handleCloseCancelAbo = this.handleCloseCancelAbo.bind(this)
        this.handleCancelAbo = this.handleCancelAbo.bind(this)

        this.state = {
            showModalCancelAbo: false,
            cancelAbo: false,
        }
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
        if (this.props.abo.lastschrift === "Direct Debit") {
            return (
                <>
                    <p>Per <b>Lastschrift</b></p>
                    <p><b>IBAN:</b> {this.props.abo.IBAN}</p>
                    <p><b>BIC:</b> {this.props.abo.BIC}</p>
                    <p><b>Kontoinhaber:</b> {this.props.abo.AccountHolder}</p>
                </>
            );
        } else {
            return (
                <p>Per <b>Rechnung</b> an oben angegebene Adresse</p>
            );
        }
    }

    handleCloseCancelAbo() {
        if (!this.state.cencelAbo) {
            this.setState({
                showModalCancelAbo: false,
            })
        }
    }

    handleCancelAbo() {
        this.setState({
            cancelAbo: true,
        })
        let newAbo = this.props.abo
        newAbo.endabodate = new Date().toLocaleString().split(",")[0]

        updateAboForCustomer(newAbo).then((erg) => {
            console.log("Abo storniert")
            this.setState({
                cancelAbo: false,
                showModalCancelAbo: false,
            })
        })
    }

    render() {

        const {abo, allowCancel} = this.props
        const {showModalCancelAbo, cancelAbo} = this.state

        return (
            <>
                <Row>
                    <Col>
                        <ListGroup.Item>
                            <h3>Aboinformationen</h3>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <p><b>Ausgabe:</b> {this.getAboVersion()}</p>
                            <p><b>Start:</b> {abo.startabodate}</p>
                            {
                                abo.endabodate !== "" ?
                                    <p><b>Ende:</b> {abo.endabodate}</p>
                                    : ""
                            }
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
                {
                    allowCancel && abo.endabodate === "" ?
                        <>
                            <br/>
                            <Row>
                                <Col>
                                    <ListGroup.Item>
                                        <h3>Abonnement stornieren</h3>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <p>Wollen Sie das Abonnement stornieren?</p>
                                        <Button variant="danger" onClick={() => {
                                            this.setState({
                                                showModalCancelAbo: true,
                                            })
                                        }}>Abonnement stornieren</Button>{' '}
                                    </ListGroup.Item>
                                </Col>
                            </Row>
                        </>
                        : ""
                }
                <Modal show={showModalCancelAbo} onHide={this.handleCloseCancelAbo} backdrop="static" size="lg"
                       aria-labelledby="contained-modal-title-vcenter" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Abonnement stornieren</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{textAlign: "left"}}>
                        <p>Sind Sie sich sicher, dass Sie das Abonnement stornieren möchten?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" disabled={cancelAbo} onClick={this.handleCloseCancelAbo}>
                            Abbrechen
                        </Button>
                        <Button variant="danger" disabled={cancelAbo} onClick={this.handleCancelAbo}>
                            {
                                cancelAbo ?
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="md"
                                        role="status"
                                        aria-hidden="true"
                                    />
                                    :
                                    "Abonnement stornieren"
                            }
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }

}

Abonnement.propTypes = {
    abo: PropTypes.object.isRequired,
    allowCancel: PropTypes.bool.isRequired,
};

export default Abonnement;
