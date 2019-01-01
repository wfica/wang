import React from "react";
import { Alert, Table } from "react-bootstrap";
import axios from "axios";
import { Redirect } from "react-router-dom";
import DbError from "./DbError";

class Bookings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      booking_list: null,
      error: null,
      redirect_to_guest: null,
      redirect_to_booking: null
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
            {list.map((booking, index) => (
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
                <td> {booking.price}</td>
              </tr>
            ))}
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
