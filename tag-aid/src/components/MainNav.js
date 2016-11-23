import React from 'react';
import { Link, IndexLink } from 'react-router'

const MainNav = () => {
  return (
    <div className="basic-margin hi-Green container-fluid">
      <nav className="navbar ">
        <div className="container">
          <div className="navbar-header">
            <a className="navbar-brand" href="#">
              <img className="img-responsive"
              src="https://placeholdit.imgix.net/~text?txtsize=10&bg=cccccc&txtclr=ffffff&txt=%5BTAG-AID+logo%5D&w=150&h=20&txttrack=0"
              className="logo"
              alt=""/>
            </a>
          </div>
          <div id="navbar" className="navbar-collapse collapse">
            <ul className="nav navbar-nav navbar-right">
              <li><IndexLink to="/">Texts</IndexLink></li>
              <li><Link to="/help">Help</Link></li>
              <li><Link to="/about">About</Link></li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default MainNav;
