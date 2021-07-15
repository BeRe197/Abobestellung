import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Container from "react-bootstrap/Container";
import {Tab, Tabs} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import {Grid, Switch, Typography} from "@material-ui/core";
import ListGroup from "react-bootstrap/ListGroup";

class Step3Checkout extends Component {

    constructor(props) {
        super(props);
        this.handleTabChange = this.handleTabChange.bind(this)
        this.handlePaymentChange = this.handlePaymentChange.bind(this)
        this.getAboVersion = this.getAboVersion.bind(this)

        this.state = {
            key: "#1",
            lastschrift: false,
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

    render() {

        const {key, lastschrift} = this.state
        const {user, abo} = this.props

        return (
            <div className="landingPageContainer">
                <Container>
                    <h2 className="detailVersionChapter">Sie haben es gleich geschafft!</h2>
                    <Tabs activeKey={key} id="checkout-tabs" className="mb-3">
                        <Tab tabClassName="tabCheckout" eventKey="#1" title="Rechnungsadresse">
                            <Form>
                                <Form.Group controlId="formGridAddress2">
                                    <Form.Control required value={user.billingAddress.street} placeholder="Straße"/>
                                    <Form.Control.Feedback type="invalid">
                                        Bitte geben Sie Ihre Straße ein.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Row>
                                    <Form.Group as={Col} controlId="formGridCity2">
                                        <Form.Control required value={user.billingAddress.city} name="city"
                                                      placeholder="Stadt"/>
                                        <Form.Control.Feedback type="invalid">
                                            Bitte geben Sie Ihre Stadt ein.
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formGridZip2">
                                        <Form.Control required type="number" value={user.billingAddress.plz} name="zip"
                                                      placeholder="PLZ"/>
                                        <Form.Control.Feedback type="invalid">
                                            Bitte geben Sie Ihre Postleitzahl ein.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Form.Row>

                                <Form.Group controlId="formGridState2">
                                    <Form.Control required name="state" value={user.billingAddress.state} as="select"
                                                  defaultValue="Deutschland">
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
                                            <Form.Control required placeholder="IBAN"/>
                                            <Form.Control.Feedback type="invalid">
                                                Bitte geben Sie Ihre IBAN ein.
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group controlId="formGridBIC">
                                            <Form.Control required placeholder="BIC"/>
                                            <Form.Control.Feedback type="invalid">
                                                Bitte geben Sie Ihre BIC ein.
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group controlId="formGridAccountHolder">
                                            <Form.Control required defaultValue={user.firstname + " " + user.lastname}
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
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <h3>Kundeninformationen</h3>
                                    <p><b>Anrede:</b> {user.titleAddress}</p>
                                    <p><b>Vorname:</b> {user.firstname}</p>
                                    <p><b>Nachname:</b> {user.lastname}</p>
                                    <p><b>Firmenname:</b> {user.companyname}</p>
                                    <p><b>E-Mail:</b> {user.email}</p>
                                    <p><b>Phone:</b> {user.phone}</p>
                                    <p><b>Lieferadresse:</b></p>
                                    <p>{user.deliveryAddress.street}</p>
                                    <p>{user.deliveryAddress.city + " " + user.deliveryAddress.plz}</p>
                                    <p>{user.deliveryAddress.state}</p>
                                    <p><b>Rechnungsadresse:</b></p>
                                    <p>{user.billingAddress.street}</p>
                                    <p>{user.billingAddress.city + " " + user.billingAddress.plz}</p>
                                    <p>{user.billingAddress.state}</p>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <h3>Aboinformationen</h3>
                                    <p><b>Ausgabe:</b> {this.getAboVersion()}</p>
                                </ListGroup.Item>
                                <ListGroup.Item>Morbi leo risus</ListGroup.Item>
                                <ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
                            </ListGroup>
                            <Button variant="outline-secondary" style={{marginRight: "10px"}}
                                    onClick={() => (this.handleTabChange("#2"))}>Zurück</Button>
                            <Button variant="outline-primary">Fertig</Button>
                        </Tab>
                    </Tabs>
                </Container>
            </div>
        );
    }
}

Step3Checkout.propTypes = {};

export default Step3Checkout;
