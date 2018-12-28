import React from "react";
import axios from "axios";
import validator from "validator";
import { FormGroup, ControlLabel, FormControl } from "react-bootstrap";

function FieldGroup({ id, label, validationState, ...props }) {
  return (
    <FormGroup controlId={id} validationState={validationState}>
      <ControlLabel>{label}</ControlLabel>
      <FormControl {...props} />
      <FormControl.Feedback />
    </FormGroup>
  );
}

class GuestCreate extends React.Component {
  constructor() {
    super();
    this.state = {
      first_name: "",
      family_name: "",
      email: "",
      phone: ""
    };
  }

  validateName = name => {
    if (name === null) return null;
    const length = name.length;
    if (length > 1) return "success";
    if (length > 0) return "error";
    return null;
  };

  validateEmail = () => {
    if (this.state.email === null || this.state.email === "") return null;
    return validator.isEmail(this.state.email) ? "success" : "error";
  };

  validatePhoneNumber = () => {
    if (this.state.phone === null || this.state.email === "") return null;
    const phone = String(this.state.phone).replace(/ /g, "");
    if (phone === null) return null;
    return validator.isNumeric(phone) && phone.length === 9
      ? "success"
      : "error";
  };

  render() {
    return (
      <div className="col-sm-4 col-xs-12">
        <form>
          <FieldGroup
            id="form_first_name"
            type="text"
            label="Imię"
            placeholder="Wpisz imię"
            value={this.state.first_name}
            onChange={event =>
              this.setState({ first_name: event.target.value })
            }
            validationState={this.validateName(this.state.first_name)}
          />
          <FieldGroup
            id="form_family_name"
            type="text"
            label="Nazwisko"
            placeholder="Wpisz nazwisko"
            value={this.state.family_name}
            onChange={event =>
              this.setState({ family_name: event.target.value })
            }
            validationState={this.validateName(this.state.family_name)}
          />
          <FieldGroup
            id="form_email"
            type="text"
            label="Email"
            placeholder="Wpisz email"
            value={this.state.email}
            onChange={event => this.setState({ email: event.target.value })}
            validationState={this.validateEmail()}
          />
          <FieldGroup
            id="form_phone"
            type="text"
            label="Numer telefonu"
            placeholder="Wpisz numer telefonu"
            value={this.state.phone}
            onChange={event => this.setState({ phone: event.target.value })}
            validationState={this.validatePhoneNumber()}
          />
        </form>
      </div>
    );
  }
}

export default GuestCreate;
