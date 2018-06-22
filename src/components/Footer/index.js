import React from 'react';
import { NavLink } from 'react-router-dom';
import { arrayOf, bool, shape, string } from 'prop-types';
import styles from './styles';

// The Header creates links that can be used to navigate
// between routes.
const Footer = ({
  navItems,
}) => (
  <footer className={`${ styles.root }`}>
    <nav>
      {navItems.map((item, ndx) => (
        <NavLink
          className={`${ styles.link }`}
          key={ ndx }
          exact={ item.exact }
          activeClassName="current"
          to={ item.url }
        >{item.label}</NavLink>
      ))}
    </nav>
  </footer>
);

Footer.propTypes = {
  navItems: arrayOf(shape({
    exact: bool,
    label: string,
    url: string,
  })),
};
Footer.defaultProps = {
  navItems: [],
};

export default Footer;
