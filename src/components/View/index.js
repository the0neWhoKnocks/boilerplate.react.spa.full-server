import React, { Component } from 'react';
import Spinner from 'COMPONENTS/Spinner';
import './styles';

class View extends Component {
  render() {
    return [
      <div
        key="overlay"
        className="overlay"
      >{ this.props.loading && <Spinner label="Loading" /> }</div>,
      <div
        key="view"
        className="view"
      >
        <h1>{ this.props.title }</h1>
        <div className="view__body">
          {this.props.data && this.props.data.map((par, ndx) => (
            <p key={ ndx }>{ par }</p>
          ))}
        </div>
      </div>
    ];
  }
}

export default View;
