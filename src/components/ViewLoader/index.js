import React from 'react';
import { bool, node, string } from 'prop-types';
import classnames from 'classnames';
import Spinner from 'COMPONENTS/Spinner';
import styles from './styles';

const ViewLoader = ({
  children,
  className,
  loading,
}) => {
  const overlayClass = classnames(
    `overlay ${ styles.overlay }`,
    { 'is--loading': loading },
  );

  return (
    <div
      key="view"
      className={ `view ${ styles.view } ${ className }` }
    >
      <div
        key="overlay"
        className={overlayClass}
      >
        { loading && (
          <Spinner className={`${ styles.spinner }`} label="Loading" />
        )}
      </div>
      <div className="view-content">
        { children }
      </div>
    </div>
  );
};

ViewLoader.propTypes = {
  children: node,
  className: string,
  loading: bool,
};

export default ViewLoader;
