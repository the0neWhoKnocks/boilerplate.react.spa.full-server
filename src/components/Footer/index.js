import React from 'react';
import { NavLink } from 'react-router-dom';
import { arrayOf, bool, shape, string } from 'prop-types';
import { deleteCookie, setCookie } from 'UTILS/cookie';
import Toggle from 'COMPONENTS/Toggle';
import styles from './styles';

const handleToggle = (toggled) => {
  if(toggled) setCookie('logging', true);
  else deleteCookie('logging');
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
