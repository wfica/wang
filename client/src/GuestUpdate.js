import React from "react";
import axios from "axios";
import GuestForm from "./GuestForm";

class GuestUpdate extends React.Component {
  constructor() {
    super();
    this.state = {
      errors: [],
      updated_guest: null
    };
  }

  componentWillMount() {
    this.setState({ guest_to_update: this.props.location.state.guest });
  }

  handleSubmit = guest => {
    axios
      .post("/catalog/guest/" + guest._id + "/update", guest)
      .then(response => {
        console.log(response);
        if ("errors" in response.data) {
          this.setState({ errors: response.data.errors });
        } else {
          this.setState({ errors: [], updated_guest: response.data.guest });
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
        guest={this.state.updated_guest}
        guest_to_update={this.state.guest_to_update}
        fromGuestCreate={false}
        fromGuestUpdate={true}
      />
    );
  }
}
export default GuestUpdate;
