import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom'

import Container from 'react-bootstrap/Container'
import Image from 'react-bootstrap/Image'
import Button from 'react-bootstrap/Button'
import Toast from "react-bootstrap/Toast"

import logo from '../assets/images/logo.png'
import {ImCheckmark} from "react-icons/all";

class LandingPage extends Component {

    constructor(props) {
        super(props);
        this.handleClose = this.handleClose.bind(this)

        this.state = {
            show: false
        }
    }

    componentDidMount() {
        if (this.props.showToast) {
            this.setState({
                show: true,
            })
        }
    }

    handleClose() {
        this.setState({
            show: false,
        })
    }

    render() {

        const {isLoggedIn, user} = this.props
        const {show} = this.state

        return (
            <>
                <div className={"landingPageContainer"}>
                    <Container>
                        <Image
                            alt="logo"
                            src={logo}
                            width={"80%"}
                            className="d-inline-block align-top"
                            style={{marginRight: "10%", marginLeft: "10%"}}
                            fluid
                        />{' '}
                    </Container>
                </div>
                <div className={"landingPageContainer"}>
                    <Container>
                        {
                            !isLoggedIn ?
                                <h1>Herzlich Willkommen!</h1>
                                :
                                <h1>Herzlich Willkommen zurück {user.firstname + " " + user.lastname}!</h1>
                        }
                        <p>
                            Hier bei deiner Zeitung vor Ort!<br/>
                            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
                            invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam
                            et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est
                            Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                            diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
                            voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd
                            gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
                            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
                            invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam
                            et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est
                            Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                            diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
                            voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd
                            gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
                        </p>
                    </Container>
                </div>
                {
                    isLoggedIn ?
                        <div className={"landingPageContainer"}>
                            <Container>
                                <h1>Was möchten Sie heute tun?</h1>
                                <p>
                                    Ihre Daten können Sie im Benutzerprofil einsehen und ändern:
                                </p>
                                <p>
                                    <Button variant="outline-success" onClick={() => {
                                        this.props.history.push(`/benutzerprofil`)
                                    }}>Zum Benutzerprofil</Button>
                                </p>
                                <p>
                                    Einen Überblick über Ihre abgeschlossenen Abonnements finden Sie hier.<br/>
                                    Ebenfalls können Sie ganz gemütlich ein Abonnement über das Abonnement Menu stornieren.
                                </p>
                                <p>
                                    <Button variant="outline-warning" onClick={() => {
                                        this.props.history.push(`/abonnements`)
                                    }}>Zu Ihren Abonnements</Button>
                                </p>
                            </Container>
                        </div>
                        : ""
                }
                <div className={"landingPageContainer"}>
                    <Container>
                        <h1>Schließe noch heute ein Abo ab!</h1>
                        <p>
                            In unserem individuellen Abokonfigurator finden Sie bestimmt das wonach Sie suchen.
                        </p>
                        <p>
                            <Button variant="outline-primary" onClick={() => {
                                this.props.history.push(`/konfigurator`)
                            }}>Konfigurator starten</Button>
                        </p>
                    </Container>
                </div>
                <div className={"landingPageContainer"}>
                    <Container>
                        <h1>Jetzt auch online!</h1>
                        <p>
                            Seit neustem gibt es unsere Ausgabe auch ganz bequem online auf das Gerät Ihrer Wahl.
                            Konfigurieren Sie Ihr ganz persönliches Abonnement jetzt!
                        </p>
                        <p>
                            <Button variant="outline-primary" onClick={() => {
                                this.props.history.push(`/konfigurator`)
                            }}>Konfigurator starten</Button>
                        </p>
                    </Container>
                </div>
                <Toast className="p-3 toastSuccess" onClose={this.handleClose} position={"bottom-center"} bg="success" show={show} delay={3000} autohide>
                    <Toast.Header closeButton={false}>
                        <ImCheckmark style={{marginRight: "0.4rem"}}/>
                        <strong className="me-auto">Erfolgreich</strong>
                    </Toast.Header>
                    <Toast.Body>Sie haben Ihr Abo erfolgreich abgeschlossen!</Toast.Body>
                </Toast>
            </>
        )
            ;
    }
}

LandingPage.propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
    user: PropTypes.object.isRequired,
    showToast: PropTypes.bool,
};

export default withRouter(LandingPage);
