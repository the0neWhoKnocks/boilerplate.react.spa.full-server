import React, { Component } from 'react';
import axios from 'axios';

const DefaultView = () => (
  <div>
    <h1>View Title</h1>
  </div>
);

const ViewHOC = ({
  reqOpts={},
  View=DefaultView,
} = {}) => (
  class Wrapper extends Component {
    constructor(props){
      super();

      this.state = {
        loading: false,
      };
    }

    componentDidMount(){
      this.getData();
    }

    getData(){
      const self = this;
      const { body, params, url } = reqOpts;
      let { method } = reqOpts;
      let reqData;

      if( url ){
        const reqArgs = [url];

        self.setState({
          loading: true,
        });

        // Default to GET if nothing was passed
        if( !method ) method = 'GET';
        // GETs require a `params` prop
        if( params ) reqData = { params };
        // POSTs take whatever Object is passed
        if( body ) reqData = body;
        // only add data to the call if it was provided
        if( reqData ) reqArgs.push(reqData);

        axios[method.toLowerCase()].apply(null, reqArgs)
          .then(resp => {
            self.setState({
              data: resp.data,
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
);

export default ViewHOC;
