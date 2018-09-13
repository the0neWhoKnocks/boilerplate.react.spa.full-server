import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { arrayOf, bool, shape, string } from 'prop-types';
import classnames from 'classnames';
import Logo from 'COMPONENTS/Logo';
import styles from './styles';

const CLOSE_DELAY = 300;
const ACTIVE_CLASS = 'current';

// The Header creates links that can be used to navigate
// between routes.
class Header extends Component {
  constructor(props){
    super();

    this.state = {
      menuOpen: false,
    };

    this.handleMenuToggle = this.handleMenuToggle.bind(this);
    this.handleNavClick = this.handleNavClick.bind(this);
  }

  handleMenuToggle(ev){
    this.setState({
      menuOpen: ev.currentTarget.checked,
    });
  }

  handleNavClick(ev){
    if(
      this.state.menuOpen
      && !ev.currentTarget.classList.contains(ACTIVE_CLASS)
    ){
      clearTimeout(this.toggleTimeout);

      // close mobile nav after item click
      this.toggleTimeout = setTimeout(() => {
        delete this.toggleTimeout;
        this.setState({
          menuOpen: false,
        });
      }, CLOSE_DELAY);
    }
  }

  render() {
    const {
      navItems,
    } = this.props;
    const {
      menuOpen,
    } = this.state;
    const navClass = classnames(
      `${ styles.nav }`,
      { 'is--open': this.state.menuOpen }
    );

    return (
      <header className={`${ styles.header }`}>
        <Logo className={`${ styles.navLogo }`} />
        <div className={`${ styles.toggle }`}>
          <label className={`${ styles.toggleLabel }`}>
            <input
              className={`${ styles.toggleInput }`}
              type="checkbox"
              onChange={ this.handleMenuToggle }
              checked={ menuOpen }
            />
            <div className={`toggle__indicator ${ styles.toggleIndicator }`}></div>
            Menu
          </label>
        </div>
        <nav className={ navClass }>
          {navItems.map((item, ndx) => (
            <NavLink
              key={ ndx }
              exact={ item.exact }
              className={`nav__btn ${ styles.navBtn }`}
              activeClassName={ ACTIVE_CLASS }
              to={ item.path }
              onClick={ this.handleNavClick }
            >{item.label}</NavLink>
          ))}
        </nav>
      </header>
    );
  }
}

Header.propTypes = {
  navItems: arrayOf(shape({
    exact: bool,
    label: string,
    url: string,
  })),
};
Header.defaultProps = {
  navItems: [],
};

export default Header;
export {
  CLOSE_DELAY,
};
