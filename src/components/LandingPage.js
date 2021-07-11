import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container'
import Image from 'react-bootstrap/Image'
import Button from 'react-bootstrap/Button'

import logo from '../assets/images/logo.png'

class LandingPage extends Component {
    render() {

        const {isLoggedIn, userName} = this.props

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
                                <h1>Herzlich Willkommen zurück {userName}!</h1>
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
                <div className={"landingPageContainer"}>
                    <Container>
                        <h1>Schließe noch heute ein Abo ab!</h1>
                        <p>
                            In unserem individuellen Abokonfigurator finden Sie bestimmt das wonach Sie suchen.
                        </p>
                        <p>
                            <Button variant="primary">Konfigurator starten</Button>
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
                            <Button variant="primary">Konfigurator starten</Button>
                        </p>
                    </Container>
                </div>
            </>
        )
            ;
    }
}

LandingPage.propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
    userName: PropTypes.string.isRequired,
};

export default LandingPage;
