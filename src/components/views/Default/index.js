import React from 'react';
import { arrayOf, bool, string } from 'prop-types';
import ViewLoader from 'COMPONENTS/ViewLoader';
import { globals as globalStyles } from './styles';

const DefaultView = ({
  data,
  dataURL,
  loading,
  title,
}) => {
  globalStyles();

  return (
    <ViewLoader
      loading={ loading }
      uid={ dataURL }
    >
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
  dataURL: string,
  loading: bool,
  title: string,
};
DefaultView.defaultProps = {
  data: [],
};

export default DefaultView;
