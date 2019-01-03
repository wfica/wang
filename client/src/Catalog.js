import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import { Alert, Navbar, NavItem, Nav } from "react-bootstrap";
import Calendar from "./Calendar";
import Guests from "./Guests";
import Guest from "./Guest";
import GuestCreate from "./GuestCreate";
import GuestUpdate from "./GuestUpdate";
import Bookings from "./Bookings";
import Booking from "./Booking";
import BookingCreate from "./BookingCreate";
import NightPrice from "./NightPrice";

function NotImplemented() {
  return (
    <Alert bsStyle="danger">
      <strong> Nie zaimplementowane!</strong>
    </Alert>
  );
}

class Catalog extends Component {
  render() {
    return (
      <Router>
        <div>
          <Navbar>
            <Navbar.Header>
              <Navbar.Brand>
                <Link to="/catalog/calendar"> Kalendarz </Link>
              </Navbar.Brand>
            </Navbar.Header>
            <Nav>
              <NavItem
                componentClass={Link}
                href="/catalog/guests"
                to="/catalog/guests"
              >
                Goście
              </NavItem>

              <NavItem
                componentClass={Link}
                href="/catalog/guest/create"
                to="/catalog/guest/create"
              >
                Dodaj gościa
              </NavItem>

              <NavItem
                componentClass={Link}
                href="/catalog/bookings"
                to="/catalog/bookings"
              >
                Rezerwacje
              </NavItem>

              <NavItem
                componentClass={Link}
                href="/catalog/booking/create"
                to="/catalog/booking/create"
              >
                Utwórz rezerwację
              </NavItem>

              <NavItem
                componentClass={Link}
                href="/catalog/price/update"
                to="/catalog/price/update"
              >
                Aktualizuj ceny
              </NavItem>
            </Nav>
          </Navbar>

          <Switch>
            <Route
              exact
              path="/catalog/calendar"
              render={props => <Calendar {...props} readOnly={true} />}
            />
            <Route exact path="/catalog/guests" component={Guests} />
            <Route exact path="/catalog/bookings" component={Bookings} />
            <Route
              exact
              path="/catalog/booking/create"
              component={BookingCreate}
            />
            <Route exact path="/catalog/booking" component={Booking} />
            <Route exact path="/catalog/guest/create" component={GuestCreate} />
            <Route exact path="/catalog/guest/update" component={GuestUpdate} />
            <Route exact path="/catalog/guest" component={Guest} />
            <Route exact path="/catalog/price/update" component={NightPrice} />
            {/* <Redirect from="/" to="/calendar" />*/}
            <Route component={NotImplemented} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default Catalog;
