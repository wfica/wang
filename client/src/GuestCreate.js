import React from "react";
import axios from "axios";
import validator from "validator";
import {
  FormGroup,
  ControlLabel,
  FormControl,
  Button,
  Alert
} from "react-bootstrap";
import ReactPhoneInput from "react-phone-input-2";
import { Redirect } from "react-router-dom";
import { withRouter } from "react-router";

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
      phone: "",
      created_guest: null,
      errors: []
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
    const phone = String(this.state.phone)
      .replace(/ /g, "")
      .replace(/\(/g, "")
      .replace(/\)/g, "")
      .replace(/\+/g, "")
      .replace(/-/g, "");
    if (phone === null) return null;
    return validator.isNumeric(phone) &&
      (!(this.state.phone.substring(0, 3) === "+48") || phone.length === 11)
      ? "success"
      : "error";
  };

  validateForm = () => {
    if (this.validateName(this.state.first_name) !== "success") return false;
    if (this.validateName(this.state.family_name) !== "success") return false;
    if (this.validateEmail(this.state.email) !== "success") return false;
    if (this.validatePhoneNumber(this.state.phone) !== "success") return false;
    return true;
  };

  handleSubmit = event => {
    axios
      .post("/catalog/guest/create", this.state)
      .then(response => {
        console.log(response);
        if ("errors" in response.data) {
          this.setState({ errors: response.data.errors, created_guest: null });
        } else {
          this.setState({ errors: [], created_guest: response.data.guest });
        }
      })
      .catch(error => {
        this.setState({ errors: error, created_guest: null });
      });
    event.preventDefault();
  };

  render() {
    const disabled = this.validateForm() ? (
      <Button type="submit" bsStyle="success">
        Zapisz
      </Button>
    ) : (
      <Button type="submit" bsStyle="danger" disabled>
        Uzupełnj pola poprawnie
      </Button>
    );
    const errors =
      Array.isArray(this.state.errors) && this.state.errors.length > 0 ? (
        <div>
          <p>
            {" "}
            <strong> Błędy przy zapisie użytkownika </strong>{" "}
          </p>
          {this.state.errors.map((err, index) => (
            <Alert bsStyle="danger" key={index}>
              {err.msg}
            </Alert>
          ))}
        </div>
      ) : null;
    return this.state.created_guest !== null ? (
      <Redirect
        to={{
          pathname: "/catalog/guest",
          state: { guest: this.state.created_guest, fromGuestCreate: true }
        }}
      />
    ) : (
      <div className="col-sm-4 col-xs-12">
        <form onSubmit={this.handleSubmit}>
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
          {/*<FieldGroup
            id="form_phone"
            type="text"
            label="Numer telefonu"
            placeholder="Wpisz numer telefonu"
            value={this.state.phone}
            onChange={event => this.setState({ phone: event.target.value })}
            validationState={this.validatePhoneNumber()}
          /> */}
          <ReactPhoneInput
            defaultCountry="pl"
            regions={"europe"}
            value={this.state.phone}
            onChange={value => this.setState({ phone: value })}
          />
          <br />
          {disabled}
        </form>
        <hr />
        {errors}
      </div>
    );
  }
}
const GuestCreateWithRouter = withRouter(GuestCreate);
export default GuestCreateWithRouter;
