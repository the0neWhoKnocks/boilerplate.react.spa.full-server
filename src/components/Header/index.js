import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import './styles';

// The Header creates links that can be used to navigate
// between routes.
class Header extends Component {
  constructor(props){
    super(props);

    this.state = {
      menuOpen: false
    };

    this.handleMenuToggle = this.handleMenuToggle.bind(this);
    this.handleNavClick = this.handleNavClick.bind(this);
  }

  handleMenuToggle(ev){
    this.setState({
      menuOpen: ev.currentTarget.checked
    });
  }

  handleNavClick(ev){
    if( this.state.menuOpen ){
      this.toggleInput.click();
    }
  }

  render() {
    return (
      <header>
        <style>{`
          .toggle {
            position: absolute;
            top: 0;
            right: 0;
          }

          .toggle label {
            padding: 1em;
            user-select: none;
            cursor: pointer;
            display: block;
          }

          .toggle input {
            display: none;
          }

          .toggle__indicator {
            width: 0.25em;
            height: 50%;
            background: #666;
            display: none;
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
          }
          .toggle input:checked + .toggle__indicator {
            display: block;
          }
        `}</style>

        <div className="nav__logo">Logo</div>
        <div className="toggle">
          <label>
            <input
              ref={ (toggleInput) => { this.toggleInput = toggleInput; } }
              type="checkbox"
              onChange={ this.handleMenuToggle }
            />
            <div className="toggle__indicator"></div>
            Menu
          </label>
        </div>
        <nav className={ this.state.menuOpen ? 'is--open' : '' }>
          {this.props.navItems.map((item, ndx) => (
            <NavLink
              key={ ndx }
              exact={ item.exact }
              className="nav__btn"
              activeClassName="current"
              to={ item.url }
              onClick={ this.handleNavClick }
            >{item.label}</NavLink>
          ))}
        </nav>
      </header>
    );
  }
}

export default Header;
