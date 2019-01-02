import React from "react";
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
import FieldGroup from "./FieldGroup";
import "./GuestForm.scss";

class GuestForm extends React.Component {
  constructor() {
    super();
    this.state = {
      first_name: "",
      family_name: "",
      email: "",
      phone: ""
    };
  }

  componentWillMount() {
    if ("guest_to_update" in this.props) {
      this.setState(this.props.guest_to_update);
    }
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

  render() {
    console.log(this.props);
    const submitButton = this.validateForm() ? (
      <Button type="submit" bsStyle="success">
        Zapisz
      </Button>
    ) : (
      <Button type="submit" bsStyle="danger" disabled>
        Uzupełnj pola poprawnie
      </Button>
    );
    const errors =
      Array.isArray(this.props.errors) && this.props.errors.length > 0 ? (
        <div>
          <p>
            <strong> Błędy przy zapisie użytkownika </strong>
          </p>
          {this.props.errors.map((err, index) => (
            <Alert bsStyle="danger" key={index}>
              {err.msg}
            </Alert>
          ))}
        </div>
      ) : null;
    return this.props.guest !== null ? (
      <Redirect
        to={{
          pathname: "/catalog/guest",
          state: {
            guest: this.props.guest,
            fromGuestCreate: this.props.fromGuestCreate,
            fromGuestUpdate: this.props.fromGuestUpdate
          }
        }}
      />
    ) : (
      <div className="col-sm-4 col-xs-12">
        <form
          onSubmit={event => {
            event.preventDefault();
            this.props.handleSubmit(this.state);
          }}
        >
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
          <ReactPhoneInput
            defaultCountry="pl"
            regions={"europe"}
            value={this.state.phone}
            onChange={value => this.setState({ phone: value })}
          />
          <br />
          {submitButton}
        </form>
        <hr />
        {errors}
      </div>
    );
  }
}
export default GuestForm;
