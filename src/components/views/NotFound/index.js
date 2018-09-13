import React from 'react';
import Logo from 'COMPONENTS/Logo';
import styles from './styles';

const NotFound = () => (
  <div className={`${ styles.root }`}>
    <Logo className={`${ styles.icon }`} />
    <div className={`${ styles.info }`}>
      Sorry, nothing found matching that request.
    </div>
  </div>
);

export default NotFound;