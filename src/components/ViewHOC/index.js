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

const DefaultView = () => (
  <div>
    <h1>View Title</h1>
    <p>This is the default view</p>
  </div>
);

const ViewHOC = ({
  reqOpts={},
  View=DefaultView,
} = {}) => {
  class Wrapper extends Component {
    static getDerivedStateFromProps(props, state){
      // use parsed url if it exists
      const parsedOpts = { ...reqOpts };
      if( props.match ) parsedOpts.url = replaceUrlToken(props.match.params, parsedOpts.url);

      const viewData = props.getViewData(genCacheKey(parsedOpts));

      if(props.data && props.data !== state.data) return { data: props.data };
      if(!props.data && viewData) return { data: viewData };

      return null;
    }

    constructor(props){
      super();

      // use parsed url if it exists
      const parsedOpts = { ...reqOpts };
      if( props.match ) parsedOpts.url = replaceUrlToken(props.match.params, parsedOpts.url);

      // passed in data always takes precedence
      const data = props.data || props.getViewData(genCacheKey(parsedOpts));

      this.state = {
        data,
        dataURL: reqOpts.url,
        loading: !(
          data
          && (Array.isArray(data) && data.length)
          || (typeof data === 'object' && Object.keys(data).length)
        ),
      };
    }

    componentDidMount(){
      if(this.state.loading){
        const {
          match,
          store,
        } = this.props;
        // use parsed url if it exists
        const parsedOpts = { ...reqOpts };
        if( match ) parsedOpts.url = replaceUrlToken(match.params, parsedOpts.url);

        getData(store, parsedOpts)
          .then(resp => {
            this.setState({
              loading: false,
              dataURL: parsedOpts.url,
            });
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
        <View { ...mergedProps } />
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
    store: shape({}),
  };

  return connect(mapStateToProps)(Wrapper);
};

export default ViewHOC;
