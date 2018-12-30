import React from "react";
import { Alert, Table } from "react-bootstrap";
import axios from "axios";
import { Redirect } from "react-router-dom";

class Guests extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      guests_list: null,
      error: null,
      redirect_to: null
    };
  }

  componentDidMount() {
    axios
      .get("/catalog/guests")
      .then(guests_list =>
        this.setState({ guests_list: guests_list.data, error: null })
      )
      .catch(err => this.setState({ error: err }));
  }

  handleClick = guest => {
    console.log("clicked on ", guest);
    this.setState({ redirect_to: guest });
  };

  render() {
    if (this.state.redirect_to !== null) {
      return (
        <Redirect
          to={{
            pathname: "/catalog/guest",
            state: { guest: this.state.redirect_to }
          }}
        />
      );
    }
    if (this.state.error !== null) {
      return (
        <div className="col-sm-4 col-xs-12">
          <Alert bsStyle="danger">
            <strong>
              {" "}
              Błąd bazy danych. Skontaktuj się z administratorem.
            </strong>
          </Alert>
        </div>
      );
    }
    const list = this.state.guests_list;
    return Array.isArray(list) && list.length > 0 ? (
      <div className="col-lg-6">
        <Table responsive hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Imię</th>
              <th>Nazwisko</th>
              <th>Email</th>
              <th>Telefon</th>
            </tr>
          </thead>
          <tbody>
            {list.map((guest, index) => (
              <tr key={index} onClick={() => this.handleClick(guest)}>
                <td> {index} </td>
                <td> {guest.first_name}</td>
                <td> {guest.family_name}</td>
                <td> {guest.email}</td>
                <td> {guest.phone}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    ) : (
      <div className="col-lg-3 col-sm-4 col-xs-12">
        <Alert bsStyle="warning">
          <strong> Brak gości w bazie danych.</strong>
        </Alert>
      </div>
    );
  }
}

export default Guests;
