/* eslint-disable import/no-extraneous-dependencies */
import React from "react";
import "./Calendar.scss";

const booked = [
  { start: new Date(2018, 11, 17), lenght: 3 },
  { start: new Date(2018, 10, 18), lenght: 10 }
];

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
      month_ref: null
    };
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

  render_days = month_num => {
    const year = this.props.year;
    let currDate = new Date(year, month_num, 1);
    let days = new Array(currDate.getDay()).fill(
      <td className="day old"> </td>
    );
    const lastDate = new Date(year, month_num + 1, 1);
    while (currDate < lastDate) {
      days.push(
        <td className="day">
          <div className="day-content">{currDate.getDate()}</div>
        </td>
      );
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

    return <div className="months-container">{months}</div>;
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
        <CalendarMonths year={this.state.currDate.getFullYear()} />
      </div>
    );
  }
}

export default Calendar;
