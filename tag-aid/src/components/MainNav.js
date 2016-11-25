import React from 'react';
import { Link, IndexLink } from 'react-router';
import { Nav, Navbar, NavItem, Image } from 'react-bootstrap';
import { IndexLinkContainer, LinkContainer } from 'react-router-bootstrap';

const MainNav = () => {
  return (
    <div className="basic-margin hi-Green container-fluid">
    <Navbar>
      <div className="container">
        <Navbar.Header>
          <Navbar.Brand a href="#">
            <Image responsive
            src="https://placeholdit.imgix.net/~text?txtsize=10&bg=cccccc&txtclr=ffffff&txt=%5BTAG-AID+logo%5D&w=150&h=20&txttrack=0"
            className="logo"
            alt=""/>
          </Navbar.Brand>
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight>
            <IndexLinkContainer to="/">
              <NavItem>Texts</NavItem>
            </IndexLinkContainer>
            <LinkContainer to="/help">
              <NavItem>Help</NavItem>
            </LinkContainer>
            <LinkContainer to="/about">
              <NavItem>About</NavItem>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
    </div>
  )
}

export default MainNav;
