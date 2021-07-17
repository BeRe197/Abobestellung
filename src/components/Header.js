import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Dropdown from 'react-bootstrap/Dropdown'
import Button from 'react-bootstrap/Button'

import logo from '../assets/images/logo.png'
import avatar from '../assets/images/avatar.jpg'

export class Header extends Component {
    render() {

        const {isLoggedIn, userName} = this.props

        return (
            <Navbar collapseOnSelect expand="md" bg="light" variant="light" sticky="top">
                <Link to="/">
                    <Navbar.Brand>
                        <img
                            alt="logo"
                            src={logo}
                            width="55"
                            className="d-inline-block align-top"
                            style={{marginRight: "10px"}}
                        />{' '}
                        Die Zeitung
                    </Navbar.Brand>
                </Link>
                <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        <Link to="/konfigurator">
                            Produktkonfigurator
                        </Link>
                    </Nav>
                    <Nav>
                        {
                            !isLoggedIn ?
                                <>
                                    <Link to="/anmelden">
                                        <Button variant="outline-primary" style={{marginRight: "10px"}}>
                                            Anmelden
                                        </Button>
                                    </Link>
                                    <Link to="/registrieren">
                                        <Button variant="outline-secondary">
                                            Registrieren
                                        </Button>
                                    </Link>
                                </>
                                :
                                <Dropdown alignRight navbar>
                                    <Dropdown.Toggle className="headerProfileBtn">
                                        <div className="headerName">{userName}</div>
                                        <img
                                            alt="Avatar"
                                            src={avatar}
                                            className="d-inline-block align-top avatar"
                                        />{' '}
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Link className="headerLink, dropdown-item" to="/benutzerprofil">Benutzerprofil</Link>
                                        <Link className="headerLink, dropdown-item" to="/abonnements">Abonnements</Link>
                                        <Dropdown.Divider/>
                                        <Link className="headerLink, dropdown-item" to="/abmelden">Abmelden</Link>
                                    </Dropdown.Menu>
                                </Dropdown>
                        }
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}

Header.propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
    userName: PropTypes.string.isRequired,
}

export default Header
