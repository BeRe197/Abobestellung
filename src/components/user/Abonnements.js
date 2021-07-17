import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Container from "react-bootstrap/Container";
import {readAllAbosForCustomer} from "../../api/Api";
import {Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import Abonnement from "../fragment/Abonnement";

class Abonnements extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            abos: {}
        }
    }

    componentDidMount() {
        readAllAbosForCustomer(this.props.user.id).then((erg) => {
            console.log("Abos geladen")
            this.setState({
                isLoading: false,
                abos: erg.allAbos,
            })
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
                            <div className={"landingPageContainer"}>
                                <Container>
                                    <h2>Abonnement {index + 1}</h2>
                                    <br/>
                                    <Abonnement key={abo.id} abo={abo} allowCancel={true}/>
                                </Container>
                            </div>
                        ))
                }
            </>
        );
    }

}

Abonnements.propTypes = {
    user: PropTypes.object.isRequired,
}

;

export default Abonnements;
