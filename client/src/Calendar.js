import React from "react";
import "./Calendar.scss";
import axios from "axios";
import DbError from "./DbError";
import utils from "./utils";

const consts = {
  months: [
    "Styczeń",
    "Luty",
    "Marzec",
    "Kwiecień",
    "Maj",
    "Czerwiec",
    "Lipiec",
    "Sierpień",
    "Wrzesień",
    "Październik",
    "Listopad",
    "Grudzień"
  ],
  days: ["Nd", "Po", "Wt", "Śr", "Cz", "Pt", "Sb"]
};

class CalendarHeader extends React.Component {
  render() {
    const year = this.props.currDate.getFullYear();
    return (
      <div className="calendar-header panel panel-default">
        <table>
          <tbody>
            <tr>
              <th className="prev" onClick={() => this.props.prevYear()}>
                <span className="glyphicon glyphicon-chevron-left"> </span>
              </th>
              <th
                className="year-title year-neighbor2 hidden-sm hidden-xs"
                onClick={() => this.props.changeYear(-2)}
              >
                {year - 2}
              </th>
              <th
                className="year-title year-neighbor hidden-xs"
                onClick={() => this.props.changeYear(-1)}
              >
                {" "}
                {year - 1}{" "}
              </th>
              <th className="year-title"> {year} </th>
              <th
                className="year-title year-neighbor hidden-xs"
                onClick={() => this.props.changeYear(1)}
              >
                {" "}
                {year + 1}{" "}
              </th>
              <th
                className="year-title year-neighbor2 hidden-sm hidden-xs"
                onClick={() => this.props.changeYear(2)}
              >
                {year + 2}
              </th>
              <th className="next" onClick={() => this.props.nextYear()}>
                <span className="glyphicon glyphicon-chevron-right"> </span>
              </th>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

class CalendarMonths extends React.Component {
  constructor() {
    super();
    this.state = {
      width: window.innerWidth,
      month_ref: null,
      bookings_list: []
    };
  }

  componentDidMount() {
    axios
      .get("/catalog/bookings")
      .then(bookings_list => {

        const sanitized = bookings_list.data.map(booking => ({
          start: new Date(booking.start),
          end: new Date(booking.end),
          price: booking.price,
          guest: booking.guest
        }));
        this.setState({ bookings_list: sanitized, db_error: null });
      })
      .catch(err => this.setState({ db_error: err }));
  }

  componentWillMount() {
    window.addEventListener("resize", this.handleWindowSizeChange);
  }

  // make sure to remove the listener
  // when the component is not mounted anymore
  componentWillUnmount() {
    window.removeEventListener("resize", this.handleWindowSizeChange);
  }

  handleWindowSizeChange = () => {
    this.setState({ width: window.innerWidth });
  };

  isDayStartOfBooking = day =>
    this.state.bookings_list.some(booking => utils.sameDay(booking.start, day));

  isDayEndOfBooking = day =>
    this.state.bookings_list.some(booking => utils.sameDay(booking.end, day));

  isNightBooked = night => {
    if (!this.state.bookings_list) {
      return { is_booked: false, info: "" };
    }

    const conflict = this.state.bookings_list.find(
      booking => night > booking.start && night < booking.end
    );
    const is_start = this.isDayStartOfBooking(night);
    const is_end = this.isDayEndOfBooking(night);
    if (conflict || (is_start && is_end)) {
      return {
        is_booked: true,
        info: " day-occupied disabled ",
        conflict: conflict
      };
    }
    if (is_start) {
      return {
        is_booked: false,
        info: " day-half-start ",
        conflict: conflict
      };
    }
    if (is_end) {
      return {
        is_booked: false,
        info: " day-half-end "
      };
    }
    return { is_booked: false, info: "" };
  };

  isDisabled = day => {
    if (this.props.readOnly) {
      return true;
    }
    if (
      this.props.clicked &&
      this.props.clicked.length === 2 &&
      !this.props.clicked.some(e => utils.sameDay(e, day))
    ) {
      return true;
    }
    return false;
  };

  allowClick = date => {
    const new_clicked = utils.addClickedDay(this.props.clicked, date);
    if (new_clicked.length === 2) {
      let currDate = new_clicked[0];
      while (currDate < new_clicked[1]) {
        if (this.isNightBooked(currDate).is_booked) {
          return false;
        }
        currDate = new Date(
          currDate.getFullYear(),
          currDate.getMonth(),
          currDate.getDate() + 1
        );
      }
      return true;
    }
    return true;
  };

  isOneSelected = day => {
    return (
      this.props.clicked &&
      this.props.clicked.length === 1 &&
      utils.sameDay(this.props.clicked[0], day)
    );
  };

  isStartSelected = day => {
    return (
      this.props.clicked &&
      this.props.clicked.length === 2 &&
      utils.sameDay(this.props.clicked[0], day)
    );
  };
  isEndSelected = day => {
    return (
      this.props.clicked &&
      this.props.clicked.length === 2 &&
      utils.sameDay(this.props.clicked[1], day)
    );
  };
  isBetweenSelected = day => {
    return (
      this.props.clicked &&
      this.props.clicked.length === 2 &&
      this.props.clicked[0] < day &&
      this.props.clicked[1] > day
    );
  };

  daySelectedClassName = day => {
    const types = [
      { f: this.isOneSelected, class: "day-selected" },
      { f: this.isStartSelected, class: "day-selected-start" },
      { f: this.isEndSelected, class: "day-selected-end" },
      { f: this.isBetweenSelected, class: "day-selected-between" }
    ];
    return types.find(elem => elem.f(day));
  };
  renderDay = day => {
    const day_selected_class_name = this.daySelectedClassName(day);
    if (typeof day_selected_class_name !== "undefined") {

      return (
        <td
          className={day_selected_class_name.class}
          onClick={
            day_selected_class_name.class !== "day-selected-between"
              ? () => {
                  if (this.allowClick(day)) {
                    this.props.handleDayClick(day);
                  }
                }
              : null
          }
        >
          <div className="day-content">{day.getDate()}</div>
        </td>
      );
    }
    const is_disabled = this.isDisabled(day);
    const is_booked = this.isNightBooked(day);
    if (is_disabled || is_booked.is_booked) {
      return (
        <td className={"day disabled " + is_booked.info}>
          <div className="day-content">{day.getDate()}</div>
        </td>
      );
    }
    return (
      <td
        className={"day " + is_booked.info}
        onClick={() => {

          if (this.allowClick(day)) {
            this.props.handleDayClick(day);
          }
        }}
      >
        <div className="day-content">{day.getDate()}</div>
      </td>
    );
  };

  render_days = month_num => {
    const year = this.props.year;
    let currDate = new Date(year, month_num, 1);
    let days = new Array(currDate.getDay()).fill(
      <td className="day old"> </td>
    );
    const lastDate = new Date(year, month_num + 1, 1);
    while (currDate < lastDate) {
      days.push(this.renderDay(currDate));
      currDate = new Date(year, month_num, currDate.getDate() + 1);
    }
    let res = [];
    while (days.length > 0) {
      let week = days.splice(0, 7);
      res.push(<tr>{week}</tr>);
    }
    return res;
  };

  getColSize = () => {
    if (this.state.month_ref == null) {
      return " col-xs-3";
    }
    const month_width = this.state.month_ref.getBoundingClientRect().width;
    const window_width = this.state.width;

    if (month_width * 6 < window_width) {
      return " col-xs-2";
    }
    if (month_width * 4 < window_width) {
      return " col-xs-3";
    }
    if (month_width * 3 < window_width) {
      return " col-xs-4";
    }
    if (month_width * 2 < window_width) {
      return " col-xs-6";
    }
    return " col-xs-12";
  };

  render() {
    const days_header = consts.days.map(day => (
      <th className="day-header"> {day} </th>
    ));

    const col_size = this.getColSize();

    const months = consts.months.map((name, i) => {
      const days = this.render_days(i);
      return (
        <div className={"month-container " + col_size}>
          <table
            className="month"
            ref={el => {
              if (this.state.month_ref == null) {
                this.setState((state, props) => ({ month_ref: el }));
              }
            }}
          >
            <thead>
              <tr>
                <th className="month-title" colSpan="7">
                  {name}
                </th>
              </tr>
              <tr>{days_header}</tr>
            </thead>
            <tbody>{days}</tbody>
          </table>
        </div>
      );
    });
    const db_error = this.state.db_error !== null ? <DbError /> : null;
    return (
      <div>
        <div className="months-container">{months}</div>
        <hr />
        {db_error}
      </div>
    );
  }
}

class Calendar extends React.Component {
  constructor() {
    super();
    this.state = {
      currDate: new Date()
    };
  }

  changeCurrDate = (yearOffset, monthOffset, dayOffset) => {
    this.setState((state, props) => ({
      currDate: new Date(
        state.currDate.getFullYear() + yearOffset,
        state.currDate.getMonth() + monthOffset,
        state.currDate.getDay() + dayOffset
      )
    }));
  };

  prevYear = () => {
    this.changeCurrDate(-1, 0, 0);
  };

  nextYear = () => {
    this.changeCurrDate(1, 0, 0);
  };

  render() {
    return (
      <div className="calendar">
        <CalendarHeader
          currDate={this.state.currDate}
          prevYear={this.prevYear}
          nextYear={this.nextYear}
          changeYear={offset => this.changeCurrDate(offset, 0, 0)}
        />
        <CalendarMonths
          year={this.state.currDate.getFullYear()}
          readOnly={"readOnly" in this.props ? this.props.readOnly : true}
          clicked={this.props.clicked}
          handleDayClick={this.props.handleDayClick}
        />
      </div>
    );
  }
}

export default Calendar;
