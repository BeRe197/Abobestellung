import React from 'react'
import {Redirect, Route} from 'react-router-dom'
import {UserContext} from "../../providers/UserProvider";

function ProtectedRoute({component: Component, ...rest}) {
    return (
        <UserContext.Consumer>
            {value => (
                <Route {...rest} render={
                    (props) => {
                        if (value.user) {
                            return <Component {...rest} />
                        } else {
                            return <Redirect to={{
                                pathname: '/',
                                state: {from: props.location}
                            }}/>
                        }
                    }
                }/>
            )}
        </UserContext.Consumer>
    )
}

export default ProtectedRoute
