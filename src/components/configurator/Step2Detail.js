import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link, withRouter} from "react-router-dom";

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import Card from "react-bootstrap/Card";
import {Grid, Typography, Switch} from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import {MuiPickersUtilsProvider, KeyboardDatePicker} from "@material-ui/pickers";
import {FormControl, InputGroup, Row} from "react-bootstrap";
import {getDistanceFromCompanyToDestinationPlz, getLocalVersionsForPlz} from "../../api/Api";
import Spinner from "react-bootstrap/Spinner";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";

class Step2Detail extends Component {

    constructor(props) {
        super(props);
        this.handleYearlyChange = this.handleYearlyChange.bind(this)
        this.handleAboChange = this.handleAboChange.bind(this)
        this.getDistanceSupplement = this.getDistanceSupplement.bind(this)
        this._getDistanceFromPLZ = this._getDistanceFromPLZ.bind(this)
        this._getLocalVersionsForPlz = this._getLocalVersionsForPlz.bind(this)
        this.handleCheckout = this.handleCheckout.bind(this)
        this.handleClose = this.handleClose.bind(this)

        this.cardSport = React.createRef()
        this.cardStadt = React.createRef()
        this.cardLand = React.createRef()

        this.state = {
            isLoading: true,
            checkedYearly: true,
            aboWeekend: false,
            period: "Jährlich",
            price: {},
            currentPriceID: 0,
            calcDistance: 0,
            selectedAbo: "stadt",
            showModal: false,
        }
    }

    componentDidMount() {
        this._getDistanceFromPLZ()
            .then(calcDistance => {
                this._getLocalVersionsForPlz()
                    .then(localVersion => {
                        let stadt = false
                        let sport = false
                        let land = false
                        Object.values(localVersion.localversions).forEach((version) => {
                            // eslint-disable-next-line default-case
                            switch (version.name) {
                                case "Stadtausgabe":
                                    stadt = true
                                    break;
                                case "Sportversion":
                                    sport = true
                                    break;
                                case "Landkreisinfos":
                                    land = true
                                    break;
                            }
                        })

                        this.setState({
                            calcDistance: calcDistance,
                            isLoading: false,
                            price: {
                                sport: {
                                    id: 2,
                                    isAvailable: sport,
                                    price: [
                                        120,
                                        12,
                                    ]
                                },
                                stadt: {
                                    id: 1,
                                    isAvailable: stadt,
                                    price: [
                                        110,
                                        11,
                                    ]
                                },
                                land: {
                                    id: 3,
                                    isAvailable: land,
                                    price: [
                                        130,
                                        13,
                                    ]
                                },
                            },
                        })
                        return true;
                    })
                return true;
            })
            .catch(err => console.log('There was an error:' + err))
    }

    _getDistanceFromPLZ() {
        return new Promise((resolve, reject) => {
            getDistanceFromCompanyToDestinationPlz(this.props.user.deliveryAddress.plz).then((erg) => {
                let resultObj = erg.distanceCalcObj[0];
                resolve(resultObj.distance)
            }, () => {
                reject("Error while getting distance")
            })
        })
    }

    _getLocalVersionsForPlz() {
        return new Promise((resolve) => {
            getLocalVersionsForPlz(this.props.user.deliveryAddress.plz).then((erg) => {
                resolve(erg)
            })
        })
    }

    getDistanceSupplement() {
        const calcDistance = this.state.calcDistance
        if (calcDistance === 0) {
            return 0
        } else if (calcDistance > 0 && calcDistance <= 10) {
            return 5
        } else if (calcDistance > 10 && calcDistance <= 30) {
            return 10
        } else if (calcDistance > 30) {
            return 15
        }
    }

    handleYearlyChange() {
        if (this.state.checkedYearly) {
            this.setState((prevState) => ({
                checkedYearly: !prevState.checkedYearly,
                period: "Monatlich",
                currentPriceID: 1,
            }))
        } else {
            this.setState((prevState) => ({
                checkedYearly: !prevState.checkedYearly,
                period: "Jährlich",
                currentPriceID: 0,
            }))
        }
    }

    handleAboChange() {
        this.setState((prevState) => ({
            aboWeekend: !prevState.aboWeekend,
        }))
    }

    handleVariantSelect(variant) {
        // eslint-disable-next-line default-case
        switch (variant) {
            case "sport":
                this.cardSport.current.classList.add("recommended")
                this.cardStadt.current.classList.remove("recommended")
                this.cardLand.current.classList.remove("recommended")
                this.setState({
                    selectedAbo: "sport",
                })
                break;
            case "stadt":
                this.cardSport.current.classList.remove("recommended")
                this.cardStadt.current.classList.add("recommended")
                this.cardLand.current.classList.remove("recommended")
                this.setState({
                    selectedAbo: "stadt",
                })
                break;
            case "land":
                this.cardSport.current.classList.remove("recommended")
                this.cardStadt.current.classList.remove("recommended")
                this.cardLand.current.classList.add("recommended")
                this.setState({
                    selectedAbo: "land",
                })
                break;
        }
    }

    handleCheckout() {
        let newAbo = {
            id: 0,
            cid: this.props.isLoggedIn ? this.props.user.id : 0,
            created: new Date().toLocaleString().split(",")[0],
            startabodate: this.props.startDate.toLocaleString().split(",")[0],
            endabodate: "",
            dataprivacyaccepted: false,
            abotype: "Printed",              //Printed or E-paper or Website
            deliverymethod: this.state.price[this.state.selectedAbo].isAvailable ? "Delivery man" : "Post",          //Post or Delivery man
            paymenttype: "",      //Credit Card or Direct debit
            payment: this.state.checkedYearly ? "Annual" : "Monthly",               //Monthly or Annual
            subscriptiontype: this.state.aboWeekend ? "Weekend" : "Daily",       //Daily or Weekend
            calculatedprice: this.state.price[this.state.selectedAbo].price[1],          //Each paper
            calculatedyearprice: this.state.price[this.state.selectedAbo].price[0],      //Pay Yearly
            localpaperversions: this.state.price[this.state.selectedAbo].id,         //Id from localpaperversions
            hintDeliveryMan: this.state.price[this.state.selectedAbo].isAvailable ? this.state.hint : "", //additional hint for the Delivery man
        }
        this.props.onAboCreate(newAbo)

        if (this.props.isLoggedIn) {
            this.props.history.push(`/konfigurator/checkout`)
        } else {
            this.setState({
                showModal: true,
            })
        }
    }

    handleClose() {
        this.setState({
            showModal: false,
        })
    }

    render() {

        const {checkedYearly, period, price, currentPriceID, aboWeekend, isLoading, selectedAbo, showModal} = this.state
        const {startDate, handleStartDateChange, hint, handleChangeHint} = this.props

        const minDate = new Date();
        minDate.setDate(minDate.getDate() + 2);

        return (
            <>
                {
                    isLoading ?
                        <Container>
                            <Row>
                                <Col style={{textAlign: "center"}}>
                                    <Spinner className="loadingSpinner" animation="border" variant="info"/>
                                </Col>
                            </Row>
                        </Container>
                        :
                        <>
                            <div className="landingPageContainer">
                                <Container>
                                    <h1 className="detailVersionChapter">Konfigurieren Sie Ihr Abonnement</h1>
                                    <p>
                                        Wer sich intelligent informieren möchte, liest <em>die Zeitung</em>: gründlich
                                        recherchierte
                                        Fakten,
                                        präzise Analysen, klug geschriebene Kommentare. Eine Zeitung, gemacht von
                                        erstklassigen
                                        Journalisten für Leser mit höchsten Ansprüchen.
                                    </p>
                                </Container>
                            </div>
                            <div className="landingPageContainer">
                                <Container>
                                    <h2 className="detailVersionChapter">Wählen Sie die Ausgabe, die am besten zu
                                        Ihnen passt:</h2>
                                    <Typography component="div">
                                        <Grid component="label" container alignItems="center" justifyContent="center"
                                              spacing={0}>
                                            <Grid item>Monatliche Zahlung</Grid>
                                            <Grid item>
                                                <Switch color={"primary"} size="medium" checked={checkedYearly}
                                                        onChange={this.handleYearlyChange} name="checkedYearly"/>
                                            </Grid>
                                            <Grid item>Jährliche Zahlung</Grid>
                                        </Grid>
                                    </Typography>
                                    <Typography component="div">
                                        <Grid component="label" container alignItems="center" justifyContent="center"
                                              spacing={0}>
                                            <Grid item>Tägliches Abo (Mo-So)</Grid>
                                            <Grid item>
                                                <Switch color={"secondary"} size="medium" checked={aboWeekend}
                                                        onChange={this.handleAboChange} name="aboDailyWeekend"/>
                                            </Grid>
                                            <Grid item>Wochenendabo (Fr+Sa)</Grid>
                                        </Grid>
                                    </Typography>
                                    <div className="detailVersionList">
                                        <Card ref={this.cardSport} className="detailVersion">
                                            <Card.Header className="detailVersionHeader">
                                                SPORTVERSION<br/>
                                                <span><span
                                                    className="detailVersionHeaderValue">{(aboWeekend ? Math.round(price.sport.price[currentPriceID] * 0.6) : price.sport.price[currentPriceID]) + this.getDistanceSupplement()}</span>€/{period}</span>
                                            </Card.Header>
                                            <ListGroup variant="flush"
                                                       style={{borderBottom: "1px solid rgba(0,0,0,.125)"}}>
                                                <ListGroup.Item className="detailVersionItem">Globaler Teil inkl.
                                                    ausgewählter
                                                    Lokalteil</ListGroup.Item>
                                                {
                                                    price.sport.isAvailable ?
                                                        <ListGroup.Item className="detailVersionItem">Geliefert durch
                                                            Austräger</ListGroup.Item>
                                                        :
                                                        <ListGroup.Item className="detailVersionItem">Wird mit DHL
                                                            versendet</ListGroup.Item>
                                                }
                                                {
                                                    price.sport.isAvailable ?
                                                        <ListGroup.Item
                                                            className="detailVersionItem">inkl. {this.getDistanceSupplement()}€
                                                            Entfernungspauschale</ListGroup.Item>
                                                        :
                                                        <ListGroup.Item
                                                            className="detailVersionItem">inkl. {this.getDistanceSupplement() === 0 ? "20" : this.getDistanceSupplement() * 2}€
                                                            Versandkosten</ListGroup.Item>
                                                }
                                                <ListGroup.Item
                                                    className="detailVersionItem">{aboWeekend ? "Wochnendausgabe (Fr+Sa)" : "Tägliche Ausgabe"}</ListGroup.Item>
                                                <ListGroup.Item
                                                    className="detailVersionItem">{checkedYearly ? "Jährliche " : "Monatliche "} Zahlung</ListGroup.Item>
                                            </ListGroup>
                                            <Card.Footer className="detailVersionFooter">
                                                <Button
                                                    onClick={() => (this.handleVariantSelect("sport"))}>Auswählen</Button>
                                            </Card.Footer>
                                        </Card>
                                        <Card ref={this.cardStadt} className="detailVersion recommended">
                                            <Card.Header className="detailVersionHeader">
                                                STADTAUSGABE<br/>
                                                <span><span
                                                    className="detailVersionHeaderValue">{(aboWeekend ? Math.round(price.stadt.price[currentPriceID] * 0.6) : price.stadt.price[currentPriceID]) + this.getDistanceSupplement()}</span>€/{period}</span>
                                            </Card.Header>
                                            <ListGroup variant="flush"
                                                       style={{borderBottom: "1px solid rgba(0,0,0,.125)"}}>
                                                <ListGroup.Item className="detailVersionItem">Globaler Teil inkl.
                                                    ausgewählter
                                                    Lokalteil</ListGroup.Item>
                                                {
                                                    price.stadt.isAvailable ?
                                                        <ListGroup.Item className="detailVersionItem">Geliefert durch
                                                            Austräger</ListGroup.Item>
                                                        :
                                                        <ListGroup.Item className="detailVersionItem">Wird mit DHL
                                                            versendet</ListGroup.Item>
                                                }
                                                {
                                                    price.stadt.isAvailable ?
                                                        <ListGroup.Item
                                                            className="detailVersionItem">inkl. {this.getDistanceSupplement()}€
                                                            Entfernungspauschale</ListGroup.Item>
                                                        :
                                                        <ListGroup.Item
                                                            className="detailVersionItem">inkl. {this.getDistanceSupplement() === 0 ? "20" : this.getDistanceSupplement() * 2}€
                                                            Versandkosten</ListGroup.Item>
                                                }
                                                <ListGroup.Item
                                                    className="detailVersionItem">{aboWeekend ? "Wochnendausgabe (Fr+Sa)" : "Tägliche Ausgabe"}</ListGroup.Item>
                                                <ListGroup.Item
                                                    className="detailVersionItem">{checkedYearly ? "Jährliche " : "Monatliche "} Zahlung</ListGroup.Item>
                                            </ListGroup>
                                            <Card.Footer className="detailVersionFooter">
                                                <Button
                                                    onClick={() => (this.handleVariantSelect("stadt"))}>Auswählen</Button>
                                            </Card.Footer>
                                        </Card>
                                        <Card ref={this.cardLand} className="detailVersion">
                                            <Card.Header className="detailVersionHeader">
                                                LANDKREISINFO<br/>
                                                <span><span
                                                    className="detailVersionHeaderValue">{(aboWeekend ? Math.round(price.land.price[currentPriceID] * 0.6) : price.land.price[currentPriceID]) + this.getDistanceSupplement()}</span>€/{period}</span>
                                            </Card.Header>
                                            <ListGroup variant="flush"
                                                       style={{borderBottom: "1px solid rgba(0,0,0,.125)"}}>
                                                <ListGroup.Item className="detailVersionItem">Globaler Teil inkl.
                                                    ausgewählter
                                                    Lokalteil</ListGroup.Item>
                                                {
                                                    price.land.isAvailable ?
                                                        <ListGroup.Item className="detailVersionItem">Geliefert durch
                                                            Austräger</ListGroup.Item>
                                                        :
                                                        <ListGroup.Item className="detailVersionItem">Wird mit DHL
                                                            versendet</ListGroup.Item>
                                                }
                                                {
                                                    price.land.isAvailable ?
                                                        <ListGroup.Item
                                                            className="detailVersionItem">inkl. {this.getDistanceSupplement()}€
                                                            Entfernungspauschale</ListGroup.Item>
                                                        :
                                                        <ListGroup.Item
                                                            className="detailVersionItem">inkl. {this.getDistanceSupplement() === 0 ? "20" : this.getDistanceSupplement() * 2}€
                                                            Versandkosten</ListGroup.Item>
                                                }
                                                <ListGroup.Item
                                                    className="detailVersionItem">{aboWeekend ? "Wochnendausgabe (Fr+Sa)" : "Tägliche Ausgabe"}</ListGroup.Item>
                                                <ListGroup.Item
                                                    className="detailVersionItem">{checkedYearly ? "Jährliche " : "Monatliche "} Zahlung</ListGroup.Item>
                                            </ListGroup>
                                            <Card.Footer className="detailVersionFooter">
                                                <Button
                                                    onClick={() => (this.handleVariantSelect("land"))}>Auswählen</Button>
                                            </Card.Footer>
                                        </Card>
                                    </div>
                                </Container>
                            </div>
                            <div className="landingPageContainer">
                                <Container>
                                    <h2 className="detailVersionChapter">Wann soll Ihr Abo beginnen?</h2>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <Grid container justifyContent="space-around">
                                            <KeyboardDatePicker
                                                disableToolbar
                                                minDate={minDate}
                                                variant="inline"
                                                format="dd.MM.yyyy"
                                                margin="normal"
                                                id="date-picker-inline"
                                                label="Date picker inline"
                                                value={startDate}
                                                onChange={handleStartDateChange}
                                                KeyboardButtonProps={{
                                                    'aria-label': 'change date',
                                                }}
                                            />
                                        </Grid>
                                    </MuiPickersUtilsProvider>
                                </Container>
                            </div>
                            {
                                price[selectedAbo].isAvailable ?
                                    <div className="landingPageContainer">
                                        <Container>
                                            <h2 className="detailVersionChapter">Haben Sie noch einen Hinweis für
                                                den Austräger?</h2>
                                            <InputGroup>
                                                <FormControl as="textarea"
                                                             placeholder="z.B. Wo befindet sich ihr Zeitungsrohr? etc."
                                                             value={hint} onChange={handleChangeHint}
                                                             aria-label="With textarea"/>
                                            </InputGroup>
                                        </Container>
                                    </div>
                                    : ""
                            }
                            <div className="landingPageContainer">
                                <Container>
                                    <h2 className="detailVersionChapter">Wenn Sie fertig sind, dann können Sie zur Kasse
                                        gehen</h2>
                                    <Row>
                                        <Col style={{textAlign: "center"}}>
                                            <Button onClick={this.handleCheckout} variant="success" size="lg">Zur
                                                Kasse</Button>
                                        </Col>
                                    </Row>
                                </Container>
                            </div>
                        </>
                }
                <Modal show={showModal} onHide={this.handleClose} backdrop="static" size="lg"
                       aria-labelledby="contained-modal-title-vcenter" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Checkout</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{textAlign: "center"}}>
                        <p>Bitte melden Sie sich an. Wenn Sie noch keinen User haben, dann können Sie sich registrieren.</p>
                        <Link to="/anmelden">
                            <Button variant="outline-primary" style={{marginRight: "10px"}}>
                                Anmelden
                            </Button>
                        </Link>
                        <Link to="/registrieren">
                            <Button variant="outline-secondary">
                                Registrieren
                            </Button>
                        </Link>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Abbrechen
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}

Step2Detail.propTypes = {
    startDate: PropTypes.instanceOf(Date).isRequired,
    handleStartDateChange: PropTypes.func.isRequired,
    hint: PropTypes.string.isRequired,
    handleChangeHint: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    onAboCreate: PropTypes.func.isRequired,
};

export default withRouter(Step2Detail);
