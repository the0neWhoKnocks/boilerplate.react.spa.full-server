import React, { Component } from 'react';
import { arrayOf, object, oneOfType, string } from 'prop-types';
import getData from 'UTILS/getData';

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
    constructor(props){
      super();

      this.state = {
        loading: !(props.data && props.data.length),
      };
    }

    componentDidMount(){
      if(this.state.loading){
        getData(reqOpts)
          .then(resp => {
            this.setState({
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

  Wrapper.reqOpts = reqOpts;
  Wrapper.propTypes = {
    data: oneOfType([
      arrayOf(string),
      object,
    ]),
  };

  return Wrapper;
};

export default ViewHOC;
