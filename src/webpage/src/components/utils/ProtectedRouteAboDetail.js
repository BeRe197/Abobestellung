import React from 'react'
import {Redirect, Route} from 'react-router-dom'
import {UserContext} from "../../providers/UserProvider";

function ProtectedRouteAboDetail({component: Component, deliveryAddress: deliveryAddress, ...rest}) {
    return (
        <UserContext.Consumer>
            {value => (
                <Route {...rest} render={
                    (props) => {
                        if (value.user || deliveryAddress) {
                            return <Component {...rest} deliveryAddress={deliveryAddress} />
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

export default ProtectedRouteAboDetail
