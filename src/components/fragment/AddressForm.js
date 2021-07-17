import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Col from "react-bootstrap/Col";

class AddressForm extends Component {

    render() {

        const {
            validated,
            handleSubmit,
            update,
            user,
            addressType,
        } = this.props

        return (
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group controlId="formGridAddress2">
                    <Form.Control required disabled={update} defaultValue={user[addressType].street}
                                  placeholder="Straße"/>
                    <Form.Control.Feedback type="invalid">
                        Bitte geben Sie Ihre Straße ein.
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Row>
                    <Form.Group as={Col} controlId="formGridCity2">
                        <Form.Control required disabled={update} defaultValue={user[addressType].city}
                                      name="city"
                                      placeholder="Stadt"/>
                        <Form.Control.Feedback type="invalid">
                            Bitte geben Sie Ihre Stadt ein.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridZip2">
                        <Form.Control required type="number" disabled={update}
                                      defaultValue={user[addressType].plz} name="zip"
                                      placeholder="PLZ"/>
                        <Form.Control.Feedback type="invalid">
                            Bitte geben Sie Ihre Postleitzahl ein.
                        </Form.Control.Feedback>
                    </Form.Group>
                </Form.Row>

                <Form.Group controlId="formGridState2">
                    <Form.Control required name="state" disabled={update} as="select"
                                  defaultValue={user[addressType].state}>
                        <option>Deutschland</option>
                        <option>Österreich</option>
                        <option>Schweiz</option>
                        <option>Frankreich</option>
                    </Form.Control>
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

AddressForm.propTypes = {
    validated: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    update: PropTypes.bool.isRequired,
    user: PropTypes.object.isRequired,
    addressType: PropTypes.string.isRequired,
};

export default AddressForm;
