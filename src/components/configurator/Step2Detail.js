import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withRouter} from "react-router-dom";

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import Card from "react-bootstrap/Card";
import {Grid, Typography, Switch} from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import {MuiPickersUtilsProvider, KeyboardDatePicker} from "@material-ui/pickers";

class Step2Detail extends Component {

    constructor(props) {
        super(props);
        this.handleYearlyChange = this.handleYearlyChange.bind(this)
        this.handleAboChange = this.handleAboChange.bind(this)

        this.cardSport = React.createRef()
        this.cardStadt = React.createRef()
        this.cardLand = React.createRef()

        this.state = {
            checkedYearly: true,
            aboWeekend: false,
            period: "Jährlich",
            price: {
                sport: [
                    120,
                    12,
                ],
                stadt: [
                    110,
                    11,
                ],
                land: [
                    130,
                    13,
                ],
            },
            currentPriceID: 0,
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
                break;
            case "stadt":
                this.cardSport.current.classList.remove("recommended")
                this.cardStadt.current.classList.add("recommended")
                this.cardLand.current.classList.remove("recommended")
                break;
            case "land":
                this.cardSport.current.classList.remove("recommended")
                this.cardStadt.current.classList.remove("recommended")
                this.cardLand.current.classList.add("recommended")
                break;
        }
    }

    render() {

        const {checkedYearly, period, price, currentPriceID, aboWeekend} = this.state
        const {startDate, handleStartDateChange} = this.props

        return (
            <div className="detailVersionBackground">
                <Container style={{paddingTop: "4rem"}}>
                    <h2 style={{paddingBottom: "2rem", textAlign: "center"}}>Wählen Sie die Ausgabe, die am besten zu
                        Ihnen passt:</h2>
                    <Typography component="div">
                        <Grid component="label" container alignItems="center" justifyContent="center" spacing={0}>
                            <Grid item>Monatliche Zahlung</Grid>
                            <Grid item>
                                <Switch color={"primary"} size="medium" checked={checkedYearly}
                                        onChange={this.handleYearlyChange} name="checkedYearly"/>
                            </Grid>
                            <Grid item>Jährliche Zahlung</Grid>
                        </Grid>
                    </Typography>
                    <Typography component="div">
                        <Grid component="label" container alignItems="center" justifyContent="center" spacing={0}>
                            <Grid item>Tägliches Abo (Mo-So)</Grid>
                            <Grid item>
                                <Switch color={"secondary"} size="medium" checked={aboWeekend}
                                        onChange={this.handleAboChange} name="aboDailyWeekend"/>
                            </Grid>
                            <Grid item>Wochenendabo (Fr+Sa)</Grid>
                        </Grid>
                    </Typography>
                    <div className="detailVersionList">
                        <div className="detailVersionListInner">
                            <Card ref={this.cardSport} className="detailVersion">
                                <Card.Header className="detailVersionHeader">
                                    SPORTVERSION<br/>
                                    <span><span
                                        className="detailVersionHeaderValue">{aboWeekend ? Math.round(price.sport[currentPriceID] * 0.6) : price.sport[currentPriceID]}</span>€/{period}</span>
                                </Card.Header>
                                <ListGroup variant="flush" style={{borderBottom: "1px solid rgba(0,0,0,.125)"}}>
                                    <ListGroup.Item className="detailVersionItem">Globaler Teil inkl. ausgewählter
                                        Lokalteil</ListGroup.Item>
                                    <ListGroup.Item className="detailVersionItem">Geliefert durch
                                        Austräger</ListGroup.Item>
                                    <ListGroup.Item
                                        className="detailVersionItem">{aboWeekend ? "Wochnendausgabe (Fr+Sa)" : "Tägliche Ausgabe"}</ListGroup.Item>
                                    <ListGroup.Item
                                        className="detailVersionItem">{checkedYearly ? "Jährliche " : "Monatliche "} Zahlung</ListGroup.Item>
                                </ListGroup>
                                <Card.Footer className="detailVersionFooter">
                                    <Button onClick={() => (this.handleVariantSelect("sport"))}>Auswählen</Button>
                                </Card.Footer>
                            </Card>
                            <Card ref={this.cardStadt} className="detailVersion recommended">
                                <Card.Header className="detailVersionHeader">
                                    STADTAUSGABE<br/>
                                    <span><span
                                        className="detailVersionHeaderValue">{aboWeekend ? Math.round(price.stadt[currentPriceID] * 0.6) : price.stadt[currentPriceID]}</span>€/{period}</span>
                                </Card.Header>
                                <ListGroup variant="flush" style={{borderBottom: "1px solid rgba(0,0,0,.125)"}}>
                                    <ListGroup.Item className="detailVersionItem">Globaler Teil inkl. ausgewählter
                                        Lokalteil</ListGroup.Item>
                                    <ListGroup.Item className="detailVersionItem">Geliefert durch
                                        Austräger</ListGroup.Item>
                                    <ListGroup.Item
                                        className="detailVersionItem">{aboWeekend ? "Wochnendausgabe (Fr+Sa)" : "Tägliche Ausgabe"}</ListGroup.Item>
                                    <ListGroup.Item
                                        className="detailVersionItem">{checkedYearly ? "Jährliche " : "Monatliche "} Zahlung</ListGroup.Item>
                                </ListGroup>
                                <Card.Footer className="detailVersionFooter">
                                    <Button onClick={() => (this.handleVariantSelect("stadt"))}>Auswählen</Button>
                                </Card.Footer>
                            </Card>
                            <Card ref={this.cardLand} className="detailVersion">
                                <Card.Header className="detailVersionHeader">
                                    LANDKREISINFO<br/>
                                    <span><span
                                        className="detailVersionHeaderValue">{aboWeekend ? Math.round(price.land[currentPriceID] * 0.6) : price.land[currentPriceID]}</span>€/{period}</span>
                                </Card.Header>
                                <ListGroup variant="flush" style={{borderBottom: "1px solid rgba(0,0,0,.125)"}}>
                                    <ListGroup.Item className="detailVersionItem">Globaler Teil inkl. ausgewählter
                                        Lokalteil</ListGroup.Item>
                                    <ListGroup.Item className="detailVersionItem">Geliefert durch
                                        Austräger</ListGroup.Item>
                                    <ListGroup.Item
                                        className="detailVersionItem">{aboWeekend ? "Wochnendausgabe (Fr+Sa)" : "Tägliche Ausgabe"}</ListGroup.Item>
                                    <ListGroup.Item
                                        className="detailVersionItem">{checkedYearly ? "Jährliche " : "Monatliche "} Zahlung</ListGroup.Item>
                                </ListGroup>
                                <Card.Footer className="detailVersionFooter">
                                    <Button onClick={() => (this.handleVariantSelect("land"))}>Auswählen</Button>
                                </Card.Footer>
                            </Card>
                        </div>
                    </div>
                    <div>
                        <h2>Wann soll Ihr Abo beginnen?</h2>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <Grid container justifyContent="space-around">
                                <KeyboardDatePicker
                                    disableToolbar
                                    minDate={new Date()}
                                    variant="inline"
                                    format="MM/dd/yyyy"
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
                    </div>
                </Container>
            </div>
        );
    }
}

Step2Detail.propTypes = {};

export default withRouter(Step2Detail);
