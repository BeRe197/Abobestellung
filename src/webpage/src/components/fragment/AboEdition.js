import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";

class AboEdition extends Component {

    render() {

        const {
            edition,
            cssCardClass,
            title,
            aboWeekend,
            currentPriceID,
            period,
            otherCountry,
            otherCountryDelivery,
            checkedYearly
        } = this.props

        return (
            <Card className={"detailVersion " + cssCardClass}>
                <Card.Header className="detailVersionHeader">
                    {title.toUpperCase()}<br/>
                    <span>
                        <span
                            className="detailVersionHeaderValue">{(aboWeekend ? Math.round(edition.price[currentPriceID] * 0.6) : edition.price[currentPriceID]) + this.props.getDistanceSupplement()}</span>
                        €/{period}
                    </span>
                </Card.Header>
                <ListGroup variant="flush"
                           style={{borderBottom: "1px solid rgba(0,0,0,.125)"}}>
                    <ListGroup.Item className="detailVersionItem">Globaler Teil inkl. ausgewählter
                        Lokalteil</ListGroup.Item>
                    {
                        edition.isAvailable ?
                            <ListGroup.Item className="detailVersionItem">Geliefert durch
                                Austräger</ListGroup.Item>
                            :
                            <ListGroup.Item className="detailVersionItem">Wird mit DHL
                                versendet</ListGroup.Item>
                    }
                    {
                        edition.isAvailable ?
                            <ListGroup.Item
                                className="detailVersionItem">inkl. {this.props.getDistanceSupplement()}€
                                Entfernungspauschale</ListGroup.Item>
                            :
                            <ListGroup.Item
                                className="detailVersionItem">inkl. {otherCountry ? otherCountryDelivery : this.props.getDistanceSupplement() === 0 ? "20" : this.props.getDistanceSupplement() * 2}€
                                Versandkosten {otherCountry ? "(International)" : ""}</ListGroup.Item>
                    }
                    <ListGroup.Item
                        className="detailVersionItem">{aboWeekend ? "Wochnendausgabe (Fr+Sa)" : "Tägliche Ausgabe"}</ListGroup.Item>
                    <ListGroup.Item
                        className="detailVersionItem">{checkedYearly ? "Jährliche " : "Monatliche "} Zahlung</ListGroup.Item>
                </ListGroup>
                <Card.Footer className="detailVersionFooter">
                    <Button
                        onClick={() => (this.props.handleVariantSelect(edition.id))}>Auswählen</Button>
                </Card.Footer>
            </Card>
        );
    }
}

AboEdition.propTypes = {
    edition: PropTypes.object.isRequired,
    cssCardClass: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    aboWeekend: PropTypes.bool.isRequired,
    currentPriceID: PropTypes.number.isRequired,
    period: PropTypes.string.isRequired,
    otherCountry: PropTypes.bool.isRequired,
    otherCountryDelivery: PropTypes.number.isRequired,
    checkedYearly: PropTypes.bool.isRequired,
    handleVariantSelect: PropTypes.func.isRequired,
    calcDistance: PropTypes.number.isRequired,
    getDistanceSupplement: PropTypes.func.isRequired,
};

export default AboEdition;
