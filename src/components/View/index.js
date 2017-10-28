import React, { Component } from 'react';
import Spinner from 'COMPONENTS/Spinner';

class View extends Component {
  render() {
    return (
      <div className="view">
        <h1>{ this.props.title }</h1>
        <div className="view__body">
          { this.props.loading && <Spinner label="Loading" /> }
          {this.props.data && this.props.data.map((par, ndx) => (
            <p key={ ndx }>{ par }</p>
          ))}
        </div>
      </div>
    );
  }
}

export default View;
