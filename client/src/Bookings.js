import React from "react";
import {
  Alert,
  Table,
  Nav,
  NavItem,
  NavDropdown,
  MenuItem
} from "react-bootstrap";
import axios from "axios";
import { Redirect } from "react-router-dom";
import DbError from "./DbError";
import consts from "./consts";
import utils from "./utils";

class Bookings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      booking_list: null,
      error: null,
      redirect_to_guest: null,
      redirect_to_booking: null,
      date: new Date()
    };
  }

  componentDidMount() {
    axios
      .get("/catalog/bookings")
      .then(bookings_list =>
        this.setState({ bookings_list: bookings_list.data, error: null })
      )
      .catch(err => this.setState({ error: err }));
  }

  prevYear = () => {
    this.setState((state, props) => ({
      date: new Date(
        state.date.getFullYear() - 1,
        state.date.getMonth(),
        state.date.getDay()
      )
    }));
  };

  nextYear = () => {
    this.setState((state, props) => ({
      date: new Date(
        state.date.getFullYear() + 1,
        state.date.getMonth(),
        state.date.getDay()
      )
    }));
  };

  setMonth = index => {
    this.setState((state, props) => ({
      date: new Date(state.date.getFullYear(), index, state.date.getDay())
    }));
  };

  showBooking = booking =>
    utils.sameMonth(new Date(booking.start), this.state.date);

  render() {
    if (this.state.redirect_to_booking !== null) {
      return (
        <Redirect
          to={{
            pathname: "/catalog/booking",
            state: { booking: this.state.redirect_to_booking }
          }}
        />
      );
    }
    if (this.state.redirect_to_guest !== null) {
      return (
        <Redirect
          to={{
            pathname: "/catalog/guest",
            state: { guest: this.state.redirect_to_guest }
          }}
        />
      );
    }
    if (this.state.error !== null) {
      return <DbError />;
    }
    const list = this.state.bookings_list;
    return Array.isArray(list) && list.length > 0 ? (
      <div className="col-lg-6">
        <Nav bsStyle="pills" activeKey={1}>
          <NavItem eventKey={0} onSelect={this.prevYear}>
            <span className="glyphicon glyphicon-chevron-left"> </span>
          </NavItem>
          <NavItem eventKey={1}>{this.state.date.getFullYear()}</NavItem>{" "}
          <NavItem eventKey={2} onSelect={this.nextYear}>
            <span className="glyphicon glyphicon-chevron-right"> </span>
          </NavItem>
          <NavDropdown
            id="dropdown"
            title={consts.months[this.state.date.getMonth()]}
          >
            {consts.months.map((month, index) => (
              <MenuItem key={index} onSelect={() => this.setMonth(index)}>
                {month}
              </MenuItem>
            ))}
          </NavDropdown>
        </Nav>
        <Table responsive hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Termin</th>
              <th>Gość</th>
              <th>Cena</th>
            </tr>
          </thead>
          <tbody>
            {list.map((booking, index) =>
              this.showBooking(booking) ? (
                <tr key={index}>
                  <td> {index} </td>
                  <td
                    onClick={() =>
                      this.setState({ redirect_to_booking: booking })
                    }
                  >
                    {booking.start.toString()} - {booking.end.toString()}
                  </td>
                  <td
                    onClick={() =>
                      this.setState({ redirect_to_guest: booking.guest })
                    }
                  >
                    {booking.guest.first_name + " " + booking.guest.family_name}
                  </td>
                  <td> {booking.price.$numberDecimal}</td>
                </tr>
              ) : null
            )}
          </tbody>
        </Table>
      </div>
    ) : (
      <div className="col-lg-3 col-sm-4 col-xs-12">
        <Alert bsStyle="warning">
          <strong> Brak rezerwacji w bazie danych.</strong>
        </Alert>
      </div>
    );
  }
}

export default Bookings;
