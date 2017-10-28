import React, { Component } from 'react';
import './styles';

class Spinner extends Component {
  render() {
    return (
      <div className="spinner" data-label={ this.props.label }>
        <div className="spinner__icon"></div>
      </div>
    );
  }
}

export default Spinner;
