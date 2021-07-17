import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Col from "react-bootstrap/Col";

class UserForm extends Component {

    render() {

        const {
            validated,
            handleSubmit,
            update,
            user,
        } = this.props

        return (
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group controlId="formCompanyName">
                    <Form.Control disabled={update} defaultValue={user.companyname} name="companyName" placeholder="Firmenname"/>
                </Form.Group>

                <Form.Group controlId="formAnrede">
                    <Form.Control disabled={update} defaultValue={user.titleAddress} required as="select">
                        <option>Herr</option>
                        <option>Frau</option>
                    </Form.Control>
                </Form.Group>

                <Form.Row>
                    <Form.Group as={Col} controlId="formFirstName">
                        <Form.Control disabled={update} defaultValue={user.firstname} required name="firstName" placeholder="Vorname"/>
                        <Form.Control.Feedback type="invalid">
                            Bitte geben Sie Ihren Vornamen ein.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} controlId="formLastName">
                        <Form.Control disabled={update} defaultValue={user.lastname} required name="lastName" placeholder="Nachname"/>
                        <Form.Control.Feedback type="invalid">
                            Bitte geben Sie Ihren Nachnamen ein.
                        </Form.Control.Feedback>
                    </Form.Group>
                </Form.Row>

                <Form.Group controlId="formBasicEmail">
                    <Form.Control disabled={update} defaultValue={user.email} required type="email" placeholder="E-Mail-Adresse"/>
                    <Form.Control.Feedback type="invalid">
                        Bitte geben Sie Ihre E-Mail-Adresse ein.
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formBasicPhone">
                    <Form.Control disabled={update} defaultValue={user.phone} required type="number" placeholder="Telefonnummer"/>
                    <Form.Control.Feedback type="invalid">
                        Bitte geben Sie Ihre Telefonnummer ein.
                    </Form.Control.Feedback>
                </Form.Group>

                <Button variant="primary" type="submit" style={{width: "100%"}}>
                    {
                        update ?
                            <Spinner
                                as="span"
                                animation="border"
                                size="md"
                                role="status"
                                aria-hidden="true"
                            />
                            :
                            "Aktualisieren"
                    }
                </Button>
            </Form>
        );
    }
}

UserForm.propTypes = {
    validated: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    update: PropTypes.bool.isRequired,
    user: PropTypes.object.isRequired,
};

export default UserForm;
