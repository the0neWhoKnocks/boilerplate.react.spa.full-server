import React, { Component, Fragment } from 'react';
import { arrayOf, bool, string } from 'prop-types';
import classnames from 'classnames';
import Spinner from 'COMPONENTS/Spinner';
import styles from './styles';

class View extends Component {
  render() {
    const {
      data,
      loading,
      title,
    } = this.props;
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
          <h1>{ title }</h1>
          <div className="view__body">
            {data.map((par, ndx) => (
              <p key={ ndx }>{ par }</p>
            ))}
          </div>
        </div>
      </Fragment>
    );
  }
}

View.propTypes = {
  data: arrayOf(string),
  loading: bool,
  title: string,
};
View.defaultProps = {
  data: [],
};

export default View;
