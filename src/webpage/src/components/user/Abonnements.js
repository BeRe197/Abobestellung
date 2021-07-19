import React, {Component} from 'react';

import Container from "react-bootstrap/Container";
import {Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import Abonnement from "../fragment/Abonnement";
import {UserContext} from "../../providers/UserProvider";
import {getAllAbosForUserDocument} from "../../config/firebase";

class Abonnements extends Component {
    static contextType = UserContext

    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            abos: {}
        }
    }

    componentDidMount() {
        getAllAbosForUserDocument(this.context.user.uid)
            .then((abos) => {
                console.log("Abos geladen")
                this.setState({
                    isLoading: false,
                    abos: abos,
                })
            })
            .catch((error) => {
                console.error("Error while trying to get the Abos for user " + this.context.user.uid + " Error: ", error)
            })
    }

    render() {

        const {isLoading, abos} = this.state

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
                        abos.map((abo, index) => (
                            <div key={abo.aboId} className={"landingPageContainer"}>
                                <Container>
                                    <h2>Abonnement {index + 1}</h2>
                                    <br/>
                                    <Abonnement abo={abo} allowCancel={true}/>
                                </Container>
                            </div>
                        ))
                }
            </>
        );
    }

}

export default Abonnements;
