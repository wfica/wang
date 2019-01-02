import React from "react";
import Calendar from "./Calendar";
import BookingForm from "./BookingForm";
import axios from "axios";
import utils from "./utils";
import { Alert } from "react-bootstrap";

class BookingCreate extends React.Component {
  constructor() {
    super();
    this.state = {
      dismissInstructions: false,
      clicked: []
    };
  }

  handleClick = date => {
    console.log(this.state.clicked);
    const prev = this.state.clicked.findIndex(d => utils.sameDay(d, date));
    console.log("prev index", prev);
    if (prev === 0 || prev === 1) {
      // unclick clicked day
      this.setState((state, props) => {
        state.clicked.splice(prev, 1);
        return {
          clicked: state.clicked
        };
      });
      return;
    }
    if (this.state.clicked.length === 2) {
      return;
    }
    this.setState((state, props) => {
      const new_clicked = utils.addClickedDay(state.clicked, date);
      console.log("new cl", new_clicked);
      return { clicked: new_clicked };
    });
  };

  handleSubmit = booking => {
    axios
      .post(
        "/catalog/booking/create",
        Object.assign(
          {
            start: this.state.clicked[0],
            end: this.state.clicked[1],
            price: 500
          },
          booking
        )
      )
      .then(response => {
        console.log(response);
        if ("errors" in response.data) {
          this.setState({ errors: response.data.errors });
        } else {
          this.setState({ errors: [], booking_created: response.data.booking });
        }
      })
      .catch(error => {
        this.setState({ errors: error });
      });
  };

  render() {
    const instr = !this.state.dismissInstructions ? (
      <div className="col-xs-12">
        <Alert
          bsStyle="info"
          onDismiss={() => this.setState({ dismissInstructions: true })}
        >
          Wybierz termin od-do. Aby zmienić wybór kliknij na początek lub koniec
          wybranego terminu.
        </Alert>{" "}
      </div>
    ) : null;
    return (
      <div>
        {instr}
        <Calendar
          clicked={this.state.clicked}
          handleDayClick={this.handleClick}
          readOnly={false}
        />

        <BookingForm
          booking={this.state.booking_created}
          fromBookingCreate={true}
          fromBookingUpdate={false}
          errors={this.state.errors}
          handleSubmit={this.handleSubmit}
        />
      </div>
    );
  }
}

export default BookingCreate;
