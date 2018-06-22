import React, { Fragment } from 'react';
import { arrayOf, bool, shape } from 'prop-types';
import classnames from 'classnames';
import Spinner from 'COMPONENTS/Spinner';
import styles from './styles';

const ViewLoader = ({
  children,
  loading,
}) => {
  const overlayClass = classnames(
    `overlay ${ styles.overlay }`,
    { 'is--loading': loading },
  );

  return (
    <Fragment>
      <div
        key="overlay"
        className={overlayClass}
      >
        { loading && (
          <Spinner className={`${ styles.spinner }`} label="Loading" />
        )}
      </div>
      <div
        key="view"
        className="view"
      >
        { children }
      </div>
    </Fragment>
  );
};

ViewLoader.propTypes = {
  children: arrayOf(shape({})),
  loading: bool,
};

export default ViewLoader;
