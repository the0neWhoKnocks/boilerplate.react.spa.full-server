import React, { Component } from 'react';
import { connect } from 'react-redux';
import { arrayOf, func, object, oneOfType, string } from 'prop-types';
import getData from 'UTILS/getData';
import genCacheKey from 'UTILS/genCacheKey';
import { getViewData } from 'STATE/selectors';

const mapStateToProps = (state) => ({
  getViewData: (key) => getViewData(state, key),
});

const DefaultView = () => (
  <div>
    <h1>View Title</h1>
  </div>
);

const ViewHOC = ({
  reqOpts={},
  View=DefaultView,
} = {}) => {
  class Wrapper extends Component {
    static getDerivedStateFromProps(props, state){
      const viewData = props.getViewData(genCacheKey(reqOpts));

      if(props.data && props.data !== state.data) return { data: props.data };
      if(!props.data && viewData) return { data: viewData };

      return null;
    }

    constructor(props){
      super();

      // passed in data always takes precedence
      const data = props.data || props.getViewData(genCacheKey(reqOpts));

      this.state = {
        data,
        loading: !(data && data.length),
      };
    }

    componentDidMount(){
      if(this.state.loading){
        getData(reqOpts)
          .then(resp => {
            this.setState({
              loading: false,
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
  };

  return connect(mapStateToProps)(Wrapper);
};

export default ViewHOC;
