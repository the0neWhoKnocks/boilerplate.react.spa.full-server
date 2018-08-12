import React, { Component } from 'react';
import { bool, func, string } from 'prop-types';
import styles from './styles';

// The Header creates links that can be used to navigate
// between routes.
class Toggle extends Component {
  constructor(props) {
    super();

    this.state = {
      toggled: props.toggled,
    };
    this.handleToggle = this.handleToggle.bind(this);
  }

  handleToggle(ev) {
    const toggled = ev.currentTarget.checked;
    this.setState({
      toggled,
    }, () => {
      this.props.onToggle(toggled);
    });
  }

  render() {
    const {
      id,
      suffix,
    } = this.props;
    const {
      toggled,
    } = this.state;
    const toggleId = `${ id }Toggle`;

    return (
      <div className="toggle">
        <div className={`${ styles.toggle }`}>
          <input
            className={`${ styles.checkbox }`}
            id={ toggleId }
            type="checkbox"
            onChange={ this.handleToggle }
            checked={ toggled }
          />
          <label
            className={`${ styles.label }`}
            htmlFor={ toggleId }
          ></label>
        </div>
        {suffix && (
          <label>{suffix}</label>
        )}
      </div>
    );
  }
}

Toggle.propTypes = {
  id: string,
  suffix: string,
  onToggle: func,
  toggled: bool,
};
Toggle.defaultProps = {
  id: 'default',
  toggled: false,
};

export default Toggle;
