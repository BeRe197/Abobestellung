import React, { Component } from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'

import Container from 'react-bootstrap/Container'

export class App extends Component {

  constructor(props) {
    super(props)

  }


  render() {

    return (
        <Container>

        </Container>
    )
  }
}

export default withRouter(App)