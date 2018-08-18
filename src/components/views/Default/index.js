import React, { Fragment } from 'react';
import { arrayOf, string } from 'prop-types';
import { globals as globalStyles } from './styles';

const DefaultView = ({
  data,
  title,
}) => {
  globalStyles();

  if(!data.length) return null;

  return (
    <Fragment>
      <h1>{ title }</h1>
      <div className="view__body">
        {data.map((par, ndx) => (
          <p key={ ndx }>{ par }</p>
        ))}
      </div>
    </Fragment>
  );
};

DefaultView.propTypes = {
  data: arrayOf(string),
  title: string,
};
DefaultView.defaultProps = {
  data: [],
};

export default DefaultView;
