import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { arrayOf, bool, number, shape, string } from 'prop-types';
import { Link } from 'react-router-dom';
import ViewLoader from 'COMPONENTS/ViewLoader';
import {
  getPreviousPage,
} from 'STATE/selectors';
import { globals as globalStyles } from 'COMPONENTS/views/Items/styles';
import styles from './styles';

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
  globalStyles();

  return (
    <ViewLoader
      className={ `${ styles.view } ${ (previousPage) ? 'has--back-btn' : '' }` }
      loading={ loading }
    >
      <link href="https://fonts.googleapis.com/css?family=Schoolbell" rel="stylesheet" />
      {data && (
        <Fragment>
          <h1 className={ `${ styles.title }` }>{ data.name }</h1>
          <div className={`view__body ${ styles.root }`}>
            <div className={`view__body ${ styles.infoWrapper }`}>
              <img
                className={ `${ styles.img }` }
                src={ data.image }
                alt={ `${ data.name } thumbnail` }
              />
              <ul className={ `${ styles.info }` }>
                <li>
                  <label>Location</label>
                  <span>{ data.location && data.location.name || '' }</span>
                </li>
                <li>
                  <label>Origin</label>
                  <span>{ data.origin.name }</span>
                </li>
                <li>
                  <label>Species</label>
                  <span>{ data.species }</span>
                </li>
                <li>
                  <label>Status</label>
                  <span>{ data.status }</span>
                </li>
                <li>
                  <label>Type</label>
                  <span>{ data.type }</span>
                </li>
              </ul>
            </div>
            {previousPage && (
              <div className={ `${ styles.backBtn }` }>
                <Link to={ previousPage }>Back</Link>
              </div>
            )}
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
