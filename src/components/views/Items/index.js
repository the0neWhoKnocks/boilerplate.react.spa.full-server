import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import Waypoint from 'react-waypoint';
import { arrayOf, func, number, shape, string } from 'prop-types';
import ImageLoader from 'COMPONENTS/ImageLoader';
import Spinner from 'COMPONENTS/Spinner';
import {
  fetchMoreItems,
  setItemLoaded,
  setPreviousView,
} from 'STATE/actions';
import {
  getNextPage,
  getResults,
} from 'STATE/selectors';
import styles, {
  ITEM_BG_COLOR,
  ITEM_LOADER_COLOR,
  globals as globalStyles,
  loadFonts,
} from './styles';

const mapStateToProps = (state) => ({
  nextPage: getNextPage(state),
  results: getResults(state),
});
const mapDispatchToProps = {
  fetchMoreItems,
  setItemLoaded,
  setPreviousView,
};

class ItemsView extends Component {
  constructor(){
    super();

    this.handleClick = this.handleClick.bind(this);
    this.handleImageLoad = this.handleImageLoad.bind(this);
    this.handleWaypoint = this.handleWaypoint.bind(this);
  }

  componentDidMount(){
    globalStyles();
  }

  handleClick() {
    this.props.setPreviousView(this.props.location.pathname);
  }
  
  // NOTE - to facilitate consitent view transitions, we need to record the
  // images that have loaded so that the loaded images don't flicker a loading
  // state on initial render.
  handleImageLoad(ndx) {
    this.props.setItemLoaded(ndx);
  }

  handleWaypoint(url) {
    this.props.fetchMoreItems(url);
  }

  render(){
    const {
      linkPrefix,
      nextPage,
      results,
      title,
    } = this.props;

    return (
      <Fragment>
        <span dangerouslySetInnerHTML={{ __html: loadFonts() }} />
        {results.length && (
          <Fragment>
            <h1 className={ `${ styles.title }` }>{ title }</h1>
            <div className={`view__body ${ styles.grid }`}>
              {results.length && results.map((item, ndx) => (
                <Link
                  key={ item.id }
                  className={ styles.item }
                  to={ `${ linkPrefix }${ item.id }` }
                  onClick={ this.handleClick }
                >
                  { item._loaded && (
                    <img
                      alt={ `${ item.name } thumbnail` }
                      src={ item.image }
                    />
                  )}
                  { !item._loaded && (
                    <ImageLoader
                      alt={ `${ item.name } thumbnail` }
                      onLoad={ this.handleImageLoad.bind(null, ndx) }
                      overlayColor={ITEM_BG_COLOR}
                      spinnerBGColor="transparent"
                      spinnerColor={ITEM_LOADER_COLOR}
                      src={ item.image }
                    />
                  )}
                  <div className={ `name ${ styles.name }` }>{ item.name }</div>
                </Link>
              ))}
              {nextPage && (
                <Waypoint
                  onEnter={ this.handleWaypoint.bind(null, nextPage) }
                  bottomOffset="-400px"
                >
                  <div className={ `${ styles.loadBar }` }>
                    <Spinner />
                    <span>Loading...</span>
                  </div>
                </Waypoint>
              )}
            </div>
          </Fragment>
        )}
      </Fragment>
    );
  }
}

ItemsView.propTypes = {
  fetchMoreItems: func,
  linkPrefix: string,
  location: shape({}),
  nextPage: string,
  results: arrayOf(shape({
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
  setItemLoaded: func,
  setPreviousView: func,
  title: string,
};
ItemsView.defaultProps = {
  results: [],
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ItemsView));
