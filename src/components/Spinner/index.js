import React, { Component } from 'react';
import { string } from 'prop-types';
import styles from './styles';

class Spinner extends Component {
  render() {
    const {
      className,
      label,
    } = this.props;

    return (
      <div
        className={`spinner ${ styles.root } ${ className }`}
        data-label={label}
      >
        <div className={`${ styles.icon }`} />
      </div>
    );
  }
}

Spinner.propTypes = {
  className: string,
  label: string,
};
Spinner.defaultProps = {
  className: '',
};

export default Spinner;
