import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import './styles';

// The Header creates links that can be used to navigate
// between routes.
class Footer extends Component {
  render() {
    return (
      <footer>
        <nav>
          {this.props.navItems.map((item, ndx) => (
            <NavLink
              key={ ndx }
              exact={ item.exact }
              activeClassName="current"
              to={ item.url }
            >{item.label}</NavLink>
          ))}
        </nav>
      </footer>
    );
  }
}

export default Footer;
