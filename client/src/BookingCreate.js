import React from "react";
import Calendar from "./Calendar";
import BookingForm from "./BookingForm";
import axios from "axios";
import utils from "./utils";
import { FormGroup, ControlLabel, HelpBlock } from "react-bootstrap";
import { eachDay, addDays } from "date-fns";
import { reduce } from "ramda";

class BookingCreate extends React.Component {
  constructor() {
    super();
    this.state = {
      clicked: [],
      default_price: { $numberDecimal: 250 },
      prices: [],
      price: 0
    };
  }

  componentDidMount() {
    axios
      .get("/catalog/prices/")
      .then(prices => {
        const sanitized = prices.data.map(price => ({
          date: new Date(price.date),
          price: parseInt(price.price.$numberDecimal)
        }));
        this.setState({ prices: sanitized });
      })
      .catch(err => this.setState({ db_error: err }));

    axios
      .get("/catalog/price/default")
      .then(price =>
        this.setState({
          default_price: parseInt(price.data.price.$numberDecimal)
        })
      )
      .catch(err => this.setState({ db_error: err }));
  }

  handleClick = date => {
    const prev = this.state.clicked.findIndex(d => utils.sameDay(d, date));

    if (prev === 0 || prev === 1) {
      // unclick clicked day
      this.setState((state, props) => {
        state.clicked.splice(prev, 1);
        return {
          clicked: state.clicked
        };
      }, this.updatePrice);
      return;
    }
    if (this.state.clicked.length === 2) {
      return;
    }
    this.setState((state, props) => {
      const new_clicked = utils.addClickedDay(state.clicked, date);
      return { clicked: new_clicked };
    }, this.updatePrice);
  };

  updatePrice = () => {
    if (this.state.clicked.length !== 2) {
      this.setState({ price: 0 });
      return;
    }
    const days = eachDay(
      this.state.clicked[0],
      addDays(this.state.clicked[1], -1)
    );
    const total_price = reduce(
      (acc, date) => {
        const custom_price = this.state.prices.find(price =>
          utils.sameDay(date, price.date)
        );
        return (
          acc + (custom_price ? custom_price.price : this.state.default_price)
        );
      },
      0,
      days
    );
    this.setState({ price: total_price });
  };

  handleSubmit = booking => {
    axios
      .post(
        "/catalog/booking/create",
        Object.assign(
          {
            start: this.state.clicked[0],
            end: this.state.clicked[1],
            price: this.state.price
          },
          booking
        )
      )
      .then(response => {
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

  handlePriceChange = (event) => {
    event.preventDefault();
    const price = Math.abs(parseInt(event.target.value));
    if(isNaN(price)){
      this.updatePrice();
      return;
    }
    this.setState({price: price});
  }

  render() {
    return (
      <div className="col-xs-12">
        <FormGroup>
          <ControlLabel> 1. Wybierz termin od-do</ControlLabel>
          <HelpBlock>
            {" "}
            Aby zmienić wybór kliknij na początek lub koniec wybranego terminu.
          </HelpBlock>
        </FormGroup>
        <Calendar
          clicked={this.state.clicked}
          handleDayClick={date => {
            this.handleClick(date);
          }}
          readOnly={false}
        />

        <BookingForm
          booking={this.state.booking_created}
          fromBookingCreate={true}
          fromBookingUpdate={false}
          errors={this.state.errors}
          handleSubmit={this.handleSubmit}
          price={this.state.price}
          handlePriceChange={this.handlePriceChange}
          findDefaultPrice={this.updatePrice}
          days={this.state.clicked}
        />
      </div>
    );
  }
}

export default BookingCreate;
