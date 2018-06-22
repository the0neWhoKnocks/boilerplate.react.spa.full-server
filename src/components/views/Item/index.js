import React from 'react';
import { arrayOf, bool, number, shape, string } from 'prop-types';
import ViewLoader from 'COMPONENTS/ViewLoader';

const ItemView = ({
  data,
  loading,
  match,
  title,
}) => {
  return (
    <ViewLoader loading={ loading }>
      <h1>{ title }</h1>
      <div className="view__body">
        <img
          src={ data.image }
          alt={ `${ data.name } thumbnail` }
        />
        <div>{ data.name }</div>
      </div>
    </ViewLoader>
  );
};

ItemView.propTypes = {
  data: shape({
    created: string,
    episode: arrayOf(string),
    gender: string,
    id: number,
    image: string,
    location: shape({
      name: string,
      url: string,
    }),
    name: string,
    origin: shape({
      name: string,
      url: string,
    }),
    species: string,
    status: string,
    type: string,
    url: string,
  }),
  loading: bool,
  match: shape({
    params: shape({}),
  }),
  title: string,
};
ItemView.defaultProps = {
  data: {},
};

export default ItemView;
