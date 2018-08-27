import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { arrayOf, bool, number, shape, string } from 'prop-types';
import { Link } from 'react-router-dom';
import ViewLoader from 'COMPONENTS/ViewLoader';
import {
  getPreviousView,
} from 'STATE/selectors';
import {
  globals as globalStyles,
  loadFonts,
} from 'COMPONENTS/views/Items/styles';
import styles from './styles';

const mapStateToProps = (state) => ({
  previousView: getPreviousView(state),
});

const ItemView = ({
  backURL,
  data,
  dataURL,
  loading,
  match,
  previousView,
  title,
}) => {
  globalStyles();

  return (
    <ViewLoader
      className={ `${ styles.view } ${ (previousView) ? 'has--back-btn' : '' }` }
      loading={ loading }
      uid={ dataURL }
    >
      <span dangerouslySetInnerHTML={{ __html: loadFonts() }} />
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
            {previousView && (
              <div className={ `${ styles.backBtn }` }>
                <Link to={ previousView }>Back</Link>
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
  dataURL: string,
  loading: bool,
  match: shape({
    params: shape({}),
  }),
  previousView: string,
  title: string,
};

export default connect(mapStateToProps)(ItemView);
