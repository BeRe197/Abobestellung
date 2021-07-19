import React, {Component, createContext} from "react";
import {auth, generateUserDocument} from "../config/firebase";

export const UserContext = createContext({user: null});

class UserProvider extends Component {

    constructor(props) {
        super(props)
        this.updateUser = this.updateUser.bind(this)

        this.state = {
            user: null
        }
    }

    componentDidMount = () => {
        auth.onAuthStateChanged(async userAuth => {
            const user = await generateUserDocument(userAuth);
            this.setState({
                user: user
            })
        })
    }

    async updateUser() {
        const user = await generateUserDocument(this.state.user);
        this.setState({
            user: user
        })
    }

    render() {
        return (
            <UserContext.Provider value={{user: this.state.user, updateUser: this.updateUser}}>
                {this.props.children}
            </UserContext.Provider>
        )
    }
}

export default UserProvider;