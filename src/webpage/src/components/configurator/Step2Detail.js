import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link, withRouter} from "react-router-dom";

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import {Grid, Typography, Switch} from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import deLocale from "date-fns/locale/de";
import {MuiPickersUtilsProvider, KeyboardDatePicker} from "@material-ui/pickers";
import {FormControl, InputGroup, Row} from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import AboEdition from "../fragment/AboEdition";
import {UserContext} from "../../providers/UserProvider";

class Step2Detail extends Component {
    static contextType = UserContext

    constructor(props) {
        super(props);
        this.handleYearlyChange = this.handleYearlyChange.bind(this)
        this.handleAboChange = this.handleAboChange.bind(this)
        this.handleCheckout = this.handleCheckout.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleVariantSelect = this.handleVariantSelect.bind(this)
        this.getDistanceSupplement = this.getDistanceSupplement.bind(this)

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
            otherCountry: false,
            otherCountryDelivery: 50,
            cssEdition: {
                sport: "",
                stadt: "recommended",
                land: "",
            },
        }
    }

    componentDidMount() {
        let state = this.context.user ? this.context.user.deliveryAddress.state : this.props.deliveryAddress.state
        if (state === "Deutschland") {
            let plz = this.context.user ? this.context.user.deliveryAddress.plz : this.props.deliveryAddress.plz
            const headers = {'Access-Control-Allow-Origin': '*'}
            fetch(`http://localhost:4500/functions/getDistanceFromCompanyToDestinationPlz/${plz}`, {
                method: 'GET',
                header: headers
            })
                .then((response) => response.json())
                .then((json) => {
                    const calcDistance = json.distance
                    console.log("Got Distance " + calcDistance);

                    fetch(`http://localhost:4500/functions/getLocalVersionsForPlz/${plz}`, {
                        method: 'GET',
                        header: headers
                    })
                        .then((response) => response.json())
                        .then((localVersions) => {
                            console.log("Got " + Object.values(localVersions).length + " LocalVersions");
                            let stadt = false
                            let sport = false
                            let land = false
                            Object.values(localVersions).forEach((version) => {
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
                                            130,
                                            17,
                                        ]
                                    },
                                    stadt: {
                                        id: 1,
                                        isAvailable: stadt,
                                        price: [
                                            120,
                                            16,
                                        ]
                                    },
                                    land: {
                                        id: 3,
                                        isAvailable: land,
                                        price: [
                                            140,
                                            18,
                                        ]
                                    },
                                },
                            })
                        });
                });
        } else {
            this.setState({
                calcDistance: 0,
                isLoading: false,
                otherCountry: true,
                price: {
                    sport: {
                        id: 2,
                        isAvailable: false,
                        price: [
                            130 + this.state.otherCountryDelivery,
                            17 + (this.state.otherCountryDelivery / 2),
                        ]
                    },
                    stadt: {
                        id: 1,
                        isAvailable: false,
                        price: [
                            120 + this.state.otherCountryDelivery,
                            16 + (this.state.otherCountryDelivery / 2),
                        ]
                    },
                    land: {
                        id: 3,
                        isAvailable: false,
                        price: [
                            140 + this.state.otherCountryDelivery,
                            18 + (this.state.otherCountryDelivery / 2),
                        ]
                    },
                },
            })
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
            case 2:
                this.setState({
                    selectedAbo: "sport",
                    cssEdition: {
                        sport: "recommended",
                        stadt: "",
                        land: "",
                    },
                })
                break;
            case 1:
                this.setState({
                    selectedAbo: "stadt",
                    cssEdition: {
                        sport: "",
                        stadt: "recommended",
                        land: "",
                    },
                })
                break;
            case 3:
                this.setState({
                    selectedAbo: "land",
                    cssEdition: {
                        sport: "",
                        stadt: "",
                        land: "recommended",
                    },
                })
                break;
        }
    }

    handleCheckout() {
        const minDate = new Date();
        minDate.setDate(minDate.getDate() + 2);

        if (this.props.startDate.setHours(0, 0, 0, 0) >= minDate.setHours(0, 0, 0, 0)) {
            let newAbo = {
                userId: this.context.user ? this.context.user.uid : 0,
                created: new Date().toLocaleString().split(",")[0],
                startabodate: this.props.startDate.toLocaleString().split(",")[0],
                endabodate: "",
                dataprivacyaccepted: false,
                abotype: "Printed",              //Printed or E-paper or Website
                deliverymethod: this.state.price[this.state.selectedAbo].isAvailable ? "Delivery man" : "Post",          //Post or Delivery man
                paymenttype: "",      //Invoice or Direct debit
                payment: this.state.checkedYearly ? "Annual" : "Monthly",               //Monthly or Annual
                subscriptiontype: this.state.aboWeekend ? "Weekend" : "Daily",       //Daily or Weekend
                calculatedprice: (this.state.aboWeekend ? Math.round(this.state.price[this.state.selectedAbo].price[1] * 0.6) : this.state.price[this.state.selectedAbo].price[1]) + this.getDistanceSupplement(), //Pay Monthly
                calculatedyearprice: (this.state.aboWeekend ? Math.round(this.state.price[this.state.selectedAbo].price[0] * 0.6) : this.state.price[this.state.selectedAbo].price[0]) + this.getDistanceSupplement(), //Pay Yearly
                localpaperversions: this.state.price[this.state.selectedAbo].id,         //Id from localpaperversions
                hintDeliveryMan: this.state.price[this.state.selectedAbo].isAvailable ? this.props.hint : "", //additional hint for the Delivery man
            }
            this.props.onAboCreate(newAbo)

            if (this.context.user) {
                this.props.history.push(`/konfigurator/checkout`)
            } else {
                this.setState({
                    showModal: true,
                })
            }
        }
    }

    handleClose() {
        this.setState({
            showModal: false,
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

    render() {

        const {
            checkedYearly,
            period,
            price,
            currentPriceID,
            aboWeekend,
            isLoading,
            selectedAbo,
            showModal,
            otherCountry,
            otherCountryDelivery,
            cssEdition,
            calcDistance,
        } = this.state
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
                                        <Row>
                                            <Col style={{marginBottom: "1rem"}}>
                                                <AboEdition cssCardClass={cssEdition.sport} title={"SPORTVERSION"}
                                                            aboWeekend={aboWeekend} edition={price.sport}
                                                            currentPriceID={currentPriceID} period={period}
                                                            otherCountry={otherCountry} calcDistance={calcDistance}
                                                            otherCountryDelivery={otherCountryDelivery}
                                                            checkedYearly={checkedYearly}
                                                            getDistanceSupplement={this.getDistanceSupplement}
                                                            handleVariantSelect={this.handleVariantSelect}/>
                                            </Col>
                                            <Col style={{marginBottom: "1rem"}}>
                                                <AboEdition cssCardClass={cssEdition.stadt} title={"STADTAUSGABE"}
                                                            aboWeekend={aboWeekend} edition={price.stadt}
                                                            currentPriceID={currentPriceID} period={period}
                                                            otherCountry={otherCountry} calcDistance={calcDistance}
                                                            otherCountryDelivery={otherCountryDelivery}
                                                            checkedYearly={checkedYearly}
                                                            getDistanceSupplement={this.getDistanceSupplement}
                                                            handleVariantSelect={this.handleVariantSelect}/>
                                            </Col>
                                            <Col style={{marginBottom: "1rem"}}>
                                                <AboEdition cssCardClass={cssEdition.land} title={"LANDKREISINFO"}
                                                            aboWeekend={aboWeekend} edition={price.land}
                                                            currentPriceID={currentPriceID} period={period}
                                                            otherCountry={otherCountry} calcDistance={calcDistance}
                                                            otherCountryDelivery={otherCountryDelivery}
                                                            checkedYearly={checkedYearly}
                                                            getDistanceSupplement={this.getDistanceSupplement}
                                                            handleVariantSelect={this.handleVariantSelect}/>
                                            </Col>
                                        </Row>
                                    </div>
                                </Container>
                            </div>
                            <div className="landingPageContainer">
                                <Container>
                                    <h2 className="detailVersionChapter">Wann soll Ihr Abo beginnen?</h2>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={deLocale}>
                                        <Grid container justifyContent="space-around">
                                            <KeyboardDatePicker
                                                disableToolbar
                                                minDate={minDate}
                                                variant="inline"
                                                format="dd.MM.yyyy"
                                                margin="normal"
                                                id="date-picker-startDate"
                                                label="Start des Abos:"
                                                value={startDate}
                                                onChange={handleStartDateChange}
                                                KeyboardButtonProps={{
                                                    'aria-label': 'change date',
                                                }}
                                                invalidDateMessage="Bitte geben Sie ein Datum in folgendem Format ein: dd.MM.yyyy"
                                                minDateMessage="Das Abo kann frühestens in zwei Tagen starten!"
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
                        <p>Bitte melden Sie sich an. Wenn Sie noch keinen User haben, dann können Sie sich
                            registrieren.</p>
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
    onAboCreate: PropTypes.func.isRequired,
    deliveryAddress: PropTypes.object,
};

export default withRouter(Step2Detail);
