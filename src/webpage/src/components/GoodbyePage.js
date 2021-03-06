import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom'

import Container from 'react-bootstrap/Container'
import Image from 'react-bootstrap/Image'
import Button from 'react-bootstrap/Button'
import Toast from "react-bootstrap/Toast"

import logo from '../assets/images/logo.png'
import {ImCheckmark} from "react-icons/all";
import {UserContext} from "../providers/UserProvider";

class GoodbyePage extends Component {
    static contextType = UserContext

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

        const {show} = this.state

        return (
            <>
                <div className={"landingPageContainer"}>
                    <Container>
                        <Image
                            alt="logo"
                            src={logo}
                            width={"50%"}
                            className="d-block align-top"
                            style={{marginRight: "auto", marginLeft: "auto"}}
                            fluid
                        />{' '}
                    </Container>
                </div>
                <div className={"landingPageContainer"}>
                    <Container style={{textAlign: "center"}}>
                        <h1>Vielen
                            Dank {this.context.user.titleAddress + " " + this.context.user.firstname + " " + this.context.user.lastname}!</h1>
                        <p>
                            Sie haben Ihr Abonnement erfolgreich abgeschlossen. Herzlichen Dank an Ihrem Vertrauen.
                        </p>
                    </Container>
                </div>
                <div className={"landingPageContainer"}>
                    <Container>
                        <h1>M??chten sie noch etwas tun?</h1>
                        <p>
                            Zur??ck zur Startseite:
                        </p>
                        <p>
                            <Button variant="outline-info" onClick={() => {
                                this.props.history.push(`/`)
                            }}>Zur Startseite</Button>
                        </p>
                        <p>
                            Ihre Daten k??nnen Sie im Benutzerprofil einsehen und ??ndern:
                        </p>
                        <p>
                            <Button variant="outline-success" onClick={() => {
                                this.props.history.push(`/benutzerprofil`)
                            }}>Zum Benutzerprofil</Button>
                        </p>
                        <p>
                            Einen ??berblick ??ber Ihre abgeschlossenen Abonnements finden Sie hier.<br/>
                            Ebenfalls k??nnen Sie ganz gem??tlich ein Abonnement ??ber das Abonnement Menu stornieren.
                        </p>
                        <p>
                            <Button variant="outline-warning" onClick={() => {
                                this.props.history.push(`/abonnements`)
                            }}>Zu Ihren Abonnements</Button>
                        </p>
                    </Container>
                </div>
                <Toast className="p-3 toastSuccess" onClose={this.handleClose} position={"bottom-center"} bg="success"
                       show={show} delay={3000} autohide>
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

GoodbyePage.propTypes = {
    showToast: PropTypes.bool,
};

export default withRouter(GoodbyePage);
