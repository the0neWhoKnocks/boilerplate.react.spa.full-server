import React from 'react';
import { string } from 'prop-types';
import styles from './styles';

const Spinner = ({
  className,
  label,
}) => (
  <div
    className={`spinner ${ styles.root } ${ className }`}
    data-label={label}
  >
    <div className={`${ styles.icon }`} />
  </div>
);

Spinner.propTypes = {
  className: string,
  label: string,
};
Spinner.defaultProps = {
  className: '',
};

export default Spinner;
