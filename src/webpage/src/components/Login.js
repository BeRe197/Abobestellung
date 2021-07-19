import React, {Component} from 'react';
import PropTypes from 'prop-types'

import LoginForm from "./fragment/LoginForm";

class Login extends Component {

    constructor(props) {
        super(props);
        this.handleSuccessfullyLogIn = this.handleSuccessfullyLogIn.bind(this)
    }

    handleSuccessfullyLogIn() {
        this.props.handleLogIn()
    }

    render() {
        return (
            <div className={"registrieren"}>
                <h1 className={"registrierenHeadline"}>Anmelden</h1>
                <LoginForm handleSuccessfullyLogIn={this.handleSuccessfullyLogIn}/>
            </div>
        );
    }
}

Login.propTypes = {
    handleLogIn: PropTypes.func.isRequired,
}

export default Login
