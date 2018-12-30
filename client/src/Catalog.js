import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import { Alert, Navbar, NavItem, Nav } from "react-bootstrap";
import Calendar from "./Calendar";
import Guests from "./Guests";
import Guest from "./Guest";
import GuestCreate from "./GuestCreate";
// import { createBrowserHistory } from 'history';

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
            </Nav>
          </Navbar>

          <Switch>
            <Route exact path="/catalog/calendar" component={Calendar} />
            <Route exact path="/catalog/guests" component={Guests} />
            <Route exact path="/catalog/guest/create" component={GuestCreate} />
            <Route exact path="/catalog/guest" component={Guest} />
            {/* <Redirect from="/" to="/calendar" />*/}
            <Route component={NotImplemented} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default Catalog;
