import React, { Component } from "react";
import {
  ListGroup,
  ListGroupItem,
  Alert,
  Button,
  ButtonToolbar
} from "react-bootstrap";
import { Redirect } from "react-router-dom";
import axios from "axios";
import DbError from "./DbError";

class Guest extends Component {
  constructor() {
    super();
    this.state = {
      fromGuestCreateAlert: false,
      deleteSuccess: null
    };
  }

  componentWillMount() {
    if (this.props.location.state && "guest" in this.props.location.state) {
      this.setState({
        guest: this.props.location.state.guest,
        fromGuestCreateAlert: false || this.props.location.state.fromGuestCreate
      });
    }
  }

  onDismissCreateAlert = () => {
    this.setState({ fromGuestCreateAlert: false });
  };

  onDismissDeleteSuccessAlert = () => {
    this.setState({ guest: null });
  };

  deleteGuest = () => {
    axios
      .post("/catalog/guest/" + this.state.guest._id + "/delete")
      .then(response => {
        if ("errors" in response.data) {
          this.setState({ deleteSuccess: false });
        } else {
          this.setState({ deleteSuccess: response.data.success });
          setTimeout(() => this.setState({ guest: null }), 5000);
        }
      })
      .catch(err => this.setState({ deleteSuccess: false }));
  };

  render() {
    if (!this.state.guest) {
      return <Redirect to="/catalog/calendar" />;
    }
    if (this.state.deleteSuccess === false) {
      return <DbError />;
    }
    if (this.state.deleteSuccess === true) {
      return (
        <div className="col-sm-4 col-xs-12">
          <Alert bsStyle="info" onDismiss={this.onDismissDeleteSuccessAlert}>
            <strong> Usunięto gościa.</strong> <br /> Zostaniesz przekierowny na
            główną stronę.
          </Alert>
        </div>
      );
    }
    const guest = this.state.guest;
    const createSuccess = this.state.fromGuestCreateAlert ? (
      <Alert bsStyle="info" onDismiss={this.onDismissCreateAlert}>
        {" "}
        Zapisano nowego gościa.{" "}
      </Alert>
    ) : null;
    return (
      <div className="col-sm-4 col-xs-12">
        {createSuccess}
        <ListGroup>
          <ListGroupItem>
            <strong>{guest.first_name + " " + guest.family_name}</strong>
          </ListGroupItem>
          <ListGroupItem> {guest.email}</ListGroupItem>
          <ListGroupItem> {guest.phone}</ListGroupItem>
        </ListGroup>
        <hr />
        <ButtonToolbar>
          <Button bsStyle="danger" onClick={this.deleteGuest}>
            Usuń gościa
          </Button>
        </ButtonToolbar>
      </div>
    );
  }
}

export default Guest;
