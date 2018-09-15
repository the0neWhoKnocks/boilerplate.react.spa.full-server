import React from 'react';
import { NavLink } from 'react-router-dom';
import { arrayOf, bool, shape, string } from 'prop-types';
import Toggle from 'COMPONENTS/Toggle';
import { LOGGING } from 'CONSTANTS/cookies';
import { deleteCookie, setCookie } from 'UTILS/cookie';
import styles from './styles';

const handleToggle = (toggled) => {
  if(toggled) setCookie(LOGGING, true);
  else deleteCookie(LOGGING);
};

// The Header creates links that can be used to navigate
// between routes.
const Footer = ({
  loggingEnabled,
  navItems,
}) => (
  <footer className={`${ styles.root }`}>
    <nav>
      <Toggle
        id="logging"
        onToggle={ handleToggle }
        suffix="Logging"
        toggled={ loggingEnabled }
      />
      {navItems.map((item, ndx) => (
        <NavLink
          className={`${ styles.link }`}
          key={ ndx }
          exact={ item.exact }
          activeClassName="current"
          to={ item.path }
        >{item.label}</NavLink>
      ))}
    </nav>
  </footer>
);

Footer.propTypes = {
  loggingEnabled: bool,
  navItems: arrayOf(shape({
    exact: bool,
    label: string,
    url: string,
  })),
};
Footer.defaultProps = {
  loggingEnabled: false,
  navItems: [],
};

export default Footer;
