import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect
} from "react-router-dom";
import { Alert, Navbar, NavItem, Nav } from "react-bootstrap";
import Calendar from "./Calendar";
import Guests from "./Guests";
import GuestCreate from "./GuestCreate";

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
                active={window.location.pathname === "/catalog/guests"}
              >
                Goście
              </NavItem>

              <NavItem
                componentClass={Link}
                href="/catalog/guest/create"
                to="/catalog/guest/create"
                active={window.location.pathname === "/catalog/guest/create"}
              >
                Dodaj gościa
              </NavItem>
            </Nav>
          </Navbar>

          <Switch>
            <Route path="/catalog/calendar" component={Calendar} />
            <Route path="/catalog/guests" component={Guests} />
            <Route path="/catalog/guest/create" component={GuestCreate} />
            {/* <Redirect from="/" to="/calendar" />*/}
            <Route component={NotImplemented} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default Catalog;
