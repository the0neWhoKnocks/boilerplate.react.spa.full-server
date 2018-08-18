import React, { Component } from 'react';
import { connect } from 'react-redux';
import { arrayOf, func, object, oneOfType, shape, string } from 'prop-types';
import getData from 'UTILS/getData';
import genCacheKey from 'UTILS/genCacheKey';
import replaceUrlToken from 'UTILS/replaceUrlToken';
import { getViewData } from 'STATE/selectors';

const mapStateToProps = (state) => ({
  getViewData: (key) => getViewData(state, key),
});

const AsyncChunk = ({
  chunk: Chunk,
  reqOpts = {},
  viewType,
  ...remaining
} = {}) => {

  class Wrapper extends Component {
    static _parseOpts(props) {
      const { match } = props;
      // use parsed URL if it exists
      const parsedOpts = { ...reqOpts };
      // ensure the URL's parsed if there are any tokens
      if( match ) parsedOpts.url = replaceUrlToken(match.params, parsedOpts.url);

      return parsedOpts;
    }

    static _getInfo(props, state={}) {
      const parsedOpts = Wrapper._parseOpts(props);
      const info = {
        // get the cache key based on the request options
        cacheKey: genCacheKey(parsedOpts),
      };

      // passed in data always takes precedence
      if(props.data && props.data !== state.data){
        info.data = props.data;
        return info;
      }

      if(!props.data){
        // retrieve cached data, if there is any
        const viewData = props.getViewData(info.cacheKey);

        if(viewData){
          info.data = viewData;
          return info;
        }
      }

      return info;
    }

    static getDerivedStateFromProps(props, state){
      const { data } = Wrapper._getInfo(props, state);
      if(data) return { data };

      return null;
    }

    constructor(props){
      super();

      // NOTE - Getting the data in the constructor is mainly for SSR. Due to
      // limitations with React (not allowing for delaying the inital render of
      // a component if a Promise is returned), it's up to the consumer to
      // ensure any data required by the component (to render on the Server),
      // needs to be pre-loaded before this component is ever ready to render.
      // Currently that's being handled via `awaitSSRData`, and the `ssr` prop
      // in the route configs.
      const {
        cacheKey,
        data,
      } = Wrapper._getInfo(props);

      this.state = {
        cacheKey,
        data,
        // dataURL: reqOpts.url,
        loading: !(
          data
          && (Array.isArray(data) && data.length)
          || (typeof data === 'object' && Object.keys(data).length)
        ),
      };
    }

    componentWillUnmount(){
      this.mounted = false;
    }

    componentDidMount(){
      this.mounted = true;

      if(this.state.loading){
        const parsedOpts = Wrapper._parseOpts(this.props);

        // used on the Client to get updated data
        getData(parsedOpts)
          .then(resp => {
            if(this.mounted){
              const { cacheKey } = Wrapper._getInfo(this.props);

              this.setState({
                cacheKey,
                // dataURL: parsedOpts.url,
                loading: false,
              });
            }
          })
          .catch(err => {
            console.error(err);
          });
      }
    }

    render() {
      const mergedProps = {
        ...this.props,
        ...this.state,
      };

      // trim un-needed props
      delete mergedProps.ssr;

      return (
        <Chunk { ...mergedProps } />
      );
    }
  }

  Wrapper.reqOpts = reqOpts;
  Wrapper.propTypes = {
    data: oneOfType([
      arrayOf(string),
      object,
    ]),
    getViewData: func,
    match: shape({}),
  };

  return connect(mapStateToProps)(Wrapper);
};

export default AsyncChunk;
