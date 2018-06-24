import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { arrayOf, bool, number, shape, string } from 'prop-types';
import { Link } from 'react-router-dom';
import ViewLoader from 'COMPONENTS/ViewLoader';
import styles from './styles';
import {
  getPreviousPage,
} from 'STATE/selectors';

const mapStateToProps = (state) => ({
  previousPage: getPreviousPage(state),
});

const ItemView = ({
  backURL,
  data,
  loading,
  match,
  previousPage,
  title,
}) => {
  return (
    <ViewLoader loading={ loading }>
      {data && (
        <Fragment>
          {previousPage && (
            <Link to={ previousPage }>Back</Link>
          )}
          <h1>{ data.name }</h1>
          <div className={`view__body ${ styles.root }`}>
            <img
              src={ data.image }
              alt={ `${ data.name } thumbnail` }
            />
            <ul>
              <li><label>Location</label>{ data.location && data.location.name || '' }</li>
              <li><label>Origin</label>{ data.origin.name }</li>
              <li><label>Species</label>{ data.species }</li>
              <li><label>Status</label>{ data.status }</li>
              <li><label>Type</label>{ data.type }</li>
            </ul>
          </div>
        </Fragment>
      )}
    </ViewLoader>
  );
};

ItemView.propTypes = {
  backURL: string,
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
  previousPage: string,
  title: string,
};

export default connect(mapStateToProps)(ItemView);
