import React, { Component } from "react";
import {
  Alert,
  Button,
  FormGroup,
  FormControl,
  Form,
  Col,
  ControlLabel
} from "react-bootstrap";
import axios from "axios";
import { isDate } from "date-fns";
import DbError from "./DbError";

class NightPrice extends Component {
  constructor() {
    super();
    this.state = {
      updateSuccess: false,
      start: new Date(),
      end: new Date(),
      price: 250
    };
  }

  validateForm = () => {
    return (
      isDate(this.state.start) &&
      isDate(this.state.end) &&
      Number.isInteger(this.state.price) &&
      this.state.price > 0
    );
  };

  handleSubmit = () => {
    axios
      .post("/catalog/price/update", this.state)
      .then(response => {
        if ("errors" in response.data) {
          this.setState({ errors: response.data.errors });
        } else {
          this.setState({ updateSuccess: true, errors: null });
        }
      })
      .catch(err => this.setState({ errors: err }));
  };

  render() {
    if (this.state.errors) {
      return <DbError alert={this.state.errors} />;
    }
    return (
      <div className="col-xs-12">
        {this.state.deleteSuccess ? (
          <Alert
            bsStyle="info"
            onDismiss={this.setState({ updateSuccess: false })}
          >
            Pomyślenie zaktualizowno cenę.
          </Alert>
        ) : (
          <div>
            <h3> Uzupełnij formularz aby zaktualizować dane. </h3>
            <h4>
              {" "}
              <strong>Uwaga:</strong> zmina ceny nie ma wpływu na zatwierdzone
              rezerwacje.
            </h4>
          </div>
        )}
        <Form
          horizontal
          onSubmit={event => {
            event.preventDefault();
            this.handleSubmit();
          }}
        >
          <FormGroup
            validationState={isDate(this.state.start) ? "success" : "error"}
          >
            <Col componentClass={ControlLabel} sm={2}>
              Od
            </Col>
            <Col sm={10}>
              <FormControl
                type="date"
                value={this.state.start}
                onChange={event => this.setState({ start: event.target.value })}
              />
              <FormControl.Feedback />
            </Col>
          </FormGroup>
          <FormGroup
            validationState={isDate(this.state.end) ? "success" : "error"}
          >
            <Col componentClass={ControlLabel} sm={2}>
              Do
            </Col>
            <Col sm={10}>
              <FormControl
                type="date"
                value={this.state.end}
                onChange={event => this.setState({ end: event.target.value })}
              />
              <FormControl.Feedback />
            </Col>
          </FormGroup>
          <FormGroup
            validationState={
              Number.isInteger(this.state.price) && this.state.price > 0
                ? "success"
                : "error"
            }
          >
            <Col componentClass={ControlLabel} sm={2}>
              Cena
            </Col>
            <Col sm={10}>
              <FormControl
                type="number"
                value={this.state.price}
                onChange={event => {
                  event.preventDefault();
                  console.log(event);
                  this.setState({
                     price: Math.abs(Math.ceil(Number(event.target.value)))
                    // price: event.target.value
                  });
                }}
              />
              <FormControl.Feedback />
            </Col>
          </FormGroup>
          <br />
          {this.validateForm() ? (
            <Button type="submit" bsStyle="success">
              Zapisz
            </Button>
          ) : (
            <Button type="submit" bsStyle="danger" disabled>
              Uzupełnj pola poprawnie
            </Button>
          )}
        </Form>
      </div>
    );
  }
}

export default NightPrice;
