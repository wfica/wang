import React, { Component } from "react";
import { ListGroup, ListGroupItem, Alert } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import moment from "moment";
import plLocale from "moment/locale/pl";

class Booking extends Component {
  constructor() {
    super();
    this.state = {
      fromBookingCreateAlert: false,
      deleteSuccess: null
    };
    moment.locale("pl", plLocale);
  }

  componentWillMount() {
    if (this.props.location.state && "booking" in this.props.location.state) {
      this.setState({
        booking: this.props.location.state.booking,
        fromBookingCreateAlert:
          false || this.props.location.state.fromBookingCreate
      });
    }
  }

  onDismissCreateAlert = () => {
    this.setState({ fromBookingCreateAlert: false });
  };

  render() {
    if (!this.state.booking) {
      return <Redirect to="/catalog/calendar" />;
    }
    const createSuccess = this.state.fromBookingCreateAlert ? (
      <Alert bsStyle="info" onDismiss={this.onDismissCreateAlert}>
        {" "}
        Zapisano nowegą rezerwację.{" "}
      </Alert>
    ) : null;
    const booking = this.state.booking;
    return (
      <div className="col-sm-4 col-xs-12">
        {createSuccess}
        <ListGroup>
          <ListGroupItem
            bsStyle="info"
            header={
              moment(booking.start).format("Do MMM YYYY") +
              " - " +
              moment(booking.end).format("Do MMM YYYY")
            }
          >
            {booking.price.$numberDecimal} zł
          </ListGroupItem>

          <ListGroupItem
            header={booking.guest.first_name + " " + booking.guest.family_name}
          >
            {booking.guest.email} {booking.guest.phone}
          </ListGroupItem>
        </ListGroup>
        <hr />
      </div>
    );
  }
}

export default Booking;
