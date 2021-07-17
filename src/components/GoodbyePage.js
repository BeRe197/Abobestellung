import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom'

import Container from 'react-bootstrap/Container'
import Image from 'react-bootstrap/Image'
import Button from 'react-bootstrap/Button'
import Toast from "react-bootstrap/Toast"

import logo from '../assets/images/logo.png'
import {ImCheckmark} from "react-icons/all";

class GoodbyePage extends Component {

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

        const {user} = this.props
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
                        <h1>Vielen Dank {user.titleAddress + " " + user.firstname + " " + user.lastname}!</h1>
                        <p>
                            Sie haben Ihr Abonnement erfolgreich abgeschlossen. Herzlichen Dank an Ihrem Vertrauen.
                        </p>
                    </Container>
                </div>
                <div className={"landingPageContainer"}>
                    <Container>
                        <h1>Möchten sie noch etwas tun?</h1>
                        <p>
                            Zurück zur Startseite:
                        </p>
                        <p>
                            <Button variant="outline-info" onClick={() => {
                                this.props.history.push(`/`)
                            }}>Zur Startseite</Button>
                        </p>
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

GoodbyePage.propTypes = {
    user: PropTypes.object.isRequired,
    showToast: PropTypes.bool,
};

export default withRouter(GoodbyePage);
