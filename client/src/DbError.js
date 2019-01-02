import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Alert } from "react-bootstrap";

class DbError extends Component {
  constructor() {
    super();
    this.state = {
      dismissAlert: false
    };
  }

  render() {
    return this.state.dismissAlert ? (
      <Redirect to="/catalog/calendar" />
    ) : (
      <div className="col-sm-4 col-xs-12">
        <Alert
          bsStyle="danger"
          onDismiss={() => this.setState({ dismissAlert: true })}
        >
          <strong> Błąd bazy danych.</strong> <br /> Skontaktuj się z
          administratorem. <br />
          {this.props.alert}
        </Alert>
      </div>
    );
  }
}

export default DbError;
