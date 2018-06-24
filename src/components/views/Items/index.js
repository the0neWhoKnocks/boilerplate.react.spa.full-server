import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { arrayOf, bool, func, number, shape, string } from 'prop-types';
import ViewLoader from 'COMPONENTS/ViewLoader';
import {
  setPreviousPage,
} from 'STATE/actions';

const mapDispatchToProps = {
  setPreviousPage,
};

const ItemsView = ({
  data,
  linkPrefix,
  loading,
  location,
  setPreviousPage,
  title,
}) => {
  const handleClick = () => {
    setPreviousPage(location.pathname);
  };

  return (
    <ViewLoader loading={ loading }>
      <h1>{ title }</h1>
      <div className="view__body">
        {data.map((item, ndx) => (
          <Link
            key={ item.id }
            to={ `${ linkPrefix }${ item.id }` }
            onClick={ handleClick }
          >
            <img
              src={ item.image }
              alt={ `${ item.name } thumbnail` }
            />
            <div>{ item.name }</div>
          </Link>
        ))}
      </div>
    </ViewLoader>
  );
};

ItemsView.propTypes = {
  data: arrayOf(shape({
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
  })),
  linkPrefix: string,
  loading: bool,
  location: shape({}),
  setPreviousPage: func,
  title: string,
};
ItemsView.defaultProps = {
  data: [],
};

export default withRouter(connect(null, mapDispatchToProps)(ItemsView));
