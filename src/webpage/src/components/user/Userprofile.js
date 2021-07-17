import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import {MdEdit} from "react-icons/all";
import Modal from "react-bootstrap/Modal";
import AddressForm from "../fragment/AddressForm";
import UserForm from "../fragment/UserForm";
import Spinner from "react-bootstrap/Spinner";

class Userprofile extends Component {

    constructor(props) {
        super(props);
        this.handleUserUpdate = this.handleUserUpdate.bind(this)
        this.handleCloseBilAddress = this.handleCloseBilAddress.bind(this)
        this.handleCloseDelAddress = this.handleCloseDelAddress.bind(this)
        this.handleCloseUser = this.handleCloseUser.bind(this)
        this.handleCloseDeleteUser = this.handleCloseDeleteUser.bind(this)
        this.handleDeleteUser = this.handleDeleteUser.bind(this)

        this.state = {
            showModalBilAddress: false,
            validatedBilAddress: false,
            updateBilAddress: false,
            showModalDelAddress: false,
            validatedDelAddress: false,
            updateDelAddress: false,
            showModalUser: false,
            validateUser: false,
            updateUser: false,
            showModalDeleteUser: false,
            deleteUser: false,
        }
    }

    handleUserUpdate(event, type) {
        event.preventDefault()
        const form = event.currentTarget
        if (form.checkValidity() === false) {
            event.stopPropagation()
        }
        // eslint-disable-next-line default-case
        switch (type) {
            case "del":
                this.setState({
                    validatedDelAddress: true,
                })
                if (!form.checkValidity() === false) {
                    this.setState({
                        updateDelAddress: true,
                    })
                    let newUser = this.props.user
                    newUser.deliveryAddress.street = form[0].value
                    newUser.deliveryAddress.city = form[1].value
                    newUser.deliveryAddress.plz = form[2].value
                    newUser.deliveryAddress.state = form[3].value

                    this.props.onCustomerUpdate(newUser)
                        .then((response) => {
                            console.log("User updated " + Object.values(response))
                            this.setState({
                                showModalDelAddress: false,
                                updateDelAddress: false,
                                validatedDelAddress: false,
                            })
                        })
                        .catch((err) => {
                            console.log('There was an error:' + err)
                            this.setState({
                                showModalDelAddress: false,
                                updateDelAddress: false,
                                validatedDelAddress: false,
                            })
                        })
                }
                break;
            case "bil":
                this.setState({
                    validatedBilAddress: true,
                })
                if (!form.checkValidity() === false) {
                    this.setState({
                        updateBilAddress: true,
                    })
                    let newUser = this.props.user
                    newUser.billingAddress.street = form[0].value
                    newUser.billingAddress.city = form[1].value
                    newUser.billingAddress.plz = form[2].value
                    newUser.billingAddress.state = form[3].value

                    this.props.onCustomerUpdate(newUser)
                        .then((response) => {
                            console.log("User updated " + Object.values(response))
                            this.setState({
                                showModalBilAddress: false,
                                updateBilAddress: false,
                                validatedBilAddress: false,
                            })
                        })
                        .catch((err) => {
                            console.log('There was an error:' + err)
                            this.setState({
                                showModalBilAddress: false,
                                updateBilAddress: false,
                                validatedBilAddress: false,
                            })
                        })
                }
                break;
            case "user":
                this.setState({
                    validatedUser: true,
                })
                if (!form.checkValidity() === false) {
                    this.setState({
                        updateUser: true,
                    })
                    let newUser = this.props.user
                    newUser.companyname = form[0].value
                    newUser.titleAddress = form[1].value
                    newUser.firstname = form[2].value
                    newUser.lastname = form[3].value
                    newUser.email = form[4].value
                    newUser.phone = form[5].value

                    this.props.onCustomerUpdate(newUser)
                        .then((response) => {
                            console.log("User updated " + Object.values(response))
                            this.setState({
                                showModalUser: false,
                                updateUser: false,
                                validatedUser: false,
                            })
                        })
                        .catch((err) => {
                            console.log('There was an error:' + err)
                            this.setState({
                                showModalUser: false,
                                updateUser: false,
                                validatedUser: false,
                            })
                        })
                }
                break;
        }
    }

    handleCloseBilAddress() {
        if (!this.state.updateBilAddress) {
            this.setState({
                showModalBilAddress: false,
            })
        }
    }

    handleCloseDelAddress() {
        if (!this.state.updateDelAddress) {
            this.setState({
                showModalDelAddress: false,
            })
        }
    }

    handleCloseUser() {
        if (!this.state.updateUser) {
            this.setState({
                showModalUser: false,
            })
        }
    }

    handleCloseDeleteUser() {
        if (!this.state.deleteUser) {
            this.setState({
                showModalDeleteUser: false,
            })
        }
    }

    handleDeleteUser() {
        this.setState({
            deleteUser: true,
        })
        this.props.onCustomerDelete()
            .then((response) => {
                console.log("User deleted " + Object.values(response))
                this.setState({
                    showModalDeleteUser: false,
                    deleteUser: false,
                })
            })
            .catch((err) => {
                console.log('There was an error:' + err)
                this.setState({
                    showModalDeleteUser: false,
                    deleteUser: false,
                })
            })
    }

    render() {

        const {user} = this.props
        const {
            showModalBilAddress,
            validatedBilAddress,
            updateBilAddress,
            showModalDelAddress,
            validatedDelAddress,
            updateDelAddress,
            showModalUser,
            validateUser,
            updateUser,
            showModalDeleteUser,
            deleteUser,
        } = this.state

        return (
            <Container>
                <Row>
                    <Col>
                        <ListGroup.Item>
                            <h3 style={{float: "left"}}>Benutzerdaten</h3>
                            <Button variant="info" className="btnEditUserData" onClick={() => {
                                this.setState({
                                    showModalUser: true,
                                })
                            }}><MdEdit
                                style={{color: "white", fontSize: "1.5rem"}}/></Button>{' '}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <p><b>Anrede:</b> {user.titleAddress}</p>
                            <p><b>Vorname:</b> {user.firstname}</p>
                            <p><b>Nachname:</b> {user.lastname}</p>
                            <p><b>Firmenname:</b> {user.companyname}</p>
                            <p><b>E-Mail:</b> {user.email}</p>
                            <p><b>Phone:</b> {user.phone}</p>
                        </ListGroup.Item>
                    </Col>
                </Row>
                <br/>
                <Row>
                    <Col>
                        <ListGroup.Item>
                            <h3 style={{float: "left"}}>Lieferadresse</h3>
                            <Button variant="info" className="btnEditUserData" onClick={() => {
                                this.setState({
                                    showModalDelAddress: true,
                                })
                            }}><MdEdit
                                style={{color: "white", fontSize: "1.5rem"}}/></Button>{' '}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <p>{user.deliveryAddress.street}</p>
                            <p>{user.deliveryAddress.city + " " + user.deliveryAddress.plz}</p>
                            <p>{user.deliveryAddress.state}</p>
                        </ListGroup.Item>
                    </Col>
                    <Col>
                        <ListGroup.Item>
                            <h3 style={{float: "left"}}>Rechnungsadresse</h3>
                            <Button variant="info" className="btnEditUserData" onClick={() => {
                                this.setState({
                                    showModalBilAddress: true,
                                })
                            }}><MdEdit
                                style={{color: "white", fontSize: "1.5rem"}}/></Button>{' '}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <p>{user.billingAddress.street}</p>
                            <p>{user.billingAddress.city + " " + user.billingAddress.plz}</p>
                            <p>{user.billingAddress.state}</p>
                        </ListGroup.Item>
                    </Col>
                </Row>
                <br/>
                <Row>
                    <Col>
                        <ListGroup.Item>
                            <h3>Benutzer löschen</h3>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <p>Auf Ihren Wunsch werden wir ihre Benutzerdaten löschen!</p>
                            <Button variant="danger" onClick={() => {
                                this.setState({
                                    showModalDeleteUser: true,
                                })
                            }}>Benutzer löschen</Button>{' '}
                        </ListGroup.Item>
                    </Col>
                </Row>
                <Modal show={showModalBilAddress} onHide={this.handleCloseBilAddress} backdrop="static" size="lg"
                       aria-labelledby="contained-modal-title-vcenter" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Rechnungsadresse aktualisieren</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{textAlign: "center"}}>
                        <AddressForm validated={validatedBilAddress}
                                     handleSubmit={(event) => this.handleUserUpdate(event, "bil")}
                                     update={updateBilAddress} user={user} addressType={"billingAddress"}/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" disabled={updateBilAddress} onClick={this.handleCloseBilAddress}>
                            Abbrechen
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={showModalDelAddress} onHide={this.handleCloseDelAddress} backdrop="static" size="lg"
                       aria-labelledby="contained-modal-title-vcenter" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Lieferadresse aktualisieren</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{textAlign: "center"}}>
                        <AddressForm validated={validatedDelAddress}
                                     handleSubmit={(event) => this.handleUserUpdate(event, "del")}
                                     update={updateDelAddress} user={user} addressType={"deliveryAddress"}/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" disabled={updateDelAddress} onClick={this.handleCloseDelAddress}>
                            Abbrechen
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={showModalUser} onHide={this.handleCloseUser} backdrop="static" size="lg"
                       aria-labelledby="contained-modal-title-vcenter" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Benutzerdaten aktualisieren</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{textAlign: "center"}}>
                        <UserForm validated={validateUser}
                                  handleSubmit={(event) => this.handleUserUpdate(event, "user")} update={updateUser}
                                  user={user}/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" disabled={updateUser} onClick={this.handleCloseUser}>
                            Abbrechen
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={showModalDeleteUser} onHide={this.handleCloseDeleteUser} backdrop="static" size="lg"
                       aria-labelledby="contained-modal-title-vcenter" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Benutzer löschen</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{textAlign: "left"}}>
                        <p>Sind Sie sich sicher? Diese Option lässt sich nicht rückgängig machen!</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" disabled={deleteUser} onClick={this.handleCloseDeleteUser}>
                            Abbrechen
                        </Button>
                        <Button variant="danger" disabled={deleteUser} onClick={this.handleDeleteUser}>
                            {
                                deleteUser ?
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="md"
                                        role="status"
                                        aria-hidden="true"
                                    />
                                    :
                                    "Benutzer endgültig löschen"
                            }
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        );
    }
}

Userprofile.propTypes = {
    user: PropTypes.object.isRequired,
    onCustomerUpdate: PropTypes.func.isRequired,
    onCustomerDelete: PropTypes.func.isRequired,
};

export default Userprofile;
