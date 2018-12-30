import React from "react";
import axios from "axios";
import GuestForm from "./GuestForm";

class GuestCreate extends React.Component {
  constructor() {
    super();
    this.state = {
      errors: [],
      created_guest: null
    };
  }

  handleSubmit = guest => {
    axios
      .post("/catalog/guest/create", guest)
      .then(response => {
        if ("errors" in response.data) {
          this.setState({ errors: response.data.errors });
        } else {
          this.setState({ errors: [], created_guest: response.data.guest });
        }
      })
      .catch(error => {
        this.setState({ errors: error });
      });
  };

  render() {
    return (
      <GuestForm
        handleSubmit={this.handleSubmit}
        errors={this.errors}
        guest={this.state.created_guest}
        fromGuestCreate={true}
        fromGuestUpdate={false}
      />
    );
  }
}
export default GuestCreate;
