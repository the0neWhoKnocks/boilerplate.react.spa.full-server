import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { arrayOf, number, shape, string } from 'prop-types';
import { Link } from 'react-router-dom';
import ImageLoader from '@noxx/react-image-loader';
import LoadIndicator from 'COMPONENTS/LoadIndicator';
import {
  getPreviousView,
} from 'STATE/selectors';
import {
  ITEM_BG_COLOR,
  ITEM_LOADER_COLOR,
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
  previousView,
  title,
}) => {
  globalStyles();

  return (
    <Fragment>
      <span dangerouslySetInnerHTML={{ __html: loadFonts() }} />
      {data && (
        <div className={ `${ styles.container } ${ (previousView) ? 'has--back-btn' : '' }` }>
          <h1 className={ `${ styles.title }` }>{ data.name }</h1>
          <div className={`view__body ${ styles.root }`}>
            <div className={`view__body ${ styles.infoWrapper }`}>
              <ImageLoader
                alt={ `${ data.name } thumbnail` }
                className={ `${ styles.img }` }
                LoadingIndicator={() => (
                  <LoadIndicator
                    overlayColor={ITEM_BG_COLOR}
                    spinnerBGColor="transparent"
                    spinnerColor={ITEM_LOADER_COLOR}
                  />
                )}
                src={ data.image }
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
        </div>
      )}
    </Fragment>
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
  previousView: string,
  title: string,
};

export default connect(mapStateToProps)(ItemView);
