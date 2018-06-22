import React from 'react';
import { arrayOf, bool, string } from 'prop-types';
import ViewLoader from 'COMPONENTS/ViewLoader';

const DefaultView = ({
  data,
  loading,
  title,
}) => {
  return (
    <ViewLoader loading={ loading }>
      <h1>{ title }</h1>
      <div className="view__body">
        {data.map((par, ndx) => (
          <p key={ ndx }>{ par }</p>
        ))}
      </div>
    </ViewLoader>
  );
};

DefaultView.propTypes = {
  data: arrayOf(string),
  loading: bool,
  title: string,
};
DefaultView.defaultProps = {
  data: [],
};

export default DefaultView;
