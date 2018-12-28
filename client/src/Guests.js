import React from "react";
import { ListGroup, ListGroupItem, Alert } from "react-bootstrap";
import axios from "axios";

class Guests extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      guests_list: null
    };
  }

  componentDidMount() {
    axios
      .get("/catalog/guests")
      .then(data => console.log(data))
      .then(guests_list => this.setState({ guests_list }))
      .catch(err => console.log(err));
  }

  render() {
    const list = this.state.guests_list;
    return Array.isArray(list) && list.length > 0 ? (
      <ListGroup>
        {list.map(guest => (
          <ListGroupItem>{guest}</ListGroupItem>
        ))}
      </ListGroup>
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
