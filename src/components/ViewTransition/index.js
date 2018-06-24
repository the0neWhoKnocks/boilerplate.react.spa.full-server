import React, { Component, Fragment } from 'react';
import { func, node, number, string } from 'prop-types';

class ViewTransition extends Component {
  static getDerivedStateFromProps(props, state){
    const newState = {};

    if(props.uid !== state.uid){
      newState.uid = props.uid;
      newState.currChildren = props.children;
      newState.prevChildren = state.currChildren;

      if(props.middleware) {
        newState.transModifiers = props.middleware({
          from: state.uid,
          to: props.uid,
        });
      }
    }

    return (Object.keys(newState).length) ? newState : null;
  }

  constructor(props){
    super();

    this.state = {
      animStarted: false,
      currChildren: props.children,
      prevChildren: undefined,
      transModifiers: {},
      uid: props.uid,
    };
  }

  componentDidUpdate(){
    const {
      animStarted,
      prevChildren,
    } = this.state;
    const {
      timeout,
    } = this.props;

    // applies the animation modifier classes
    if(!animStarted && prevChildren){
      this.setState({
        animStarted: true,
      });
    }
    // lets the animation play through before removing children
    else if(animStarted && prevChildren && !this.animRunning){
      this.animRunning = true;

      setTimeout(() => {
        this.animRunning = false;
        this.setState({
          animStarted: false,
          prevChildren: undefined,
        });
      }, timeout);
    }
  }

  render(){
    const {
      className,
      classPrefix,
    } = this.props;
    const {
      animStarted,
      currChildren,
      prevChildren,
      transModifiers,
    } = this.state;

    const prefix = (classPrefix) ? `${ classPrefix }-` : '';
    const exitClass = (animStarted) ? `${ prefix }exit` : '';
    const enterClass = (animStarted) ? `${ prefix }enter` : '';
    const exitModifer = transModifiers.exit || 'default';
    const enterModifer = transModifiers.enter || 'default';

    return (
      <Fragment>
        {prevChildren && (
          <div className={`${ className } ${ exitClass } ${ exitModifer }`}>{prevChildren}</div>
        )}
        {currChildren && (
          <div className={`${ className } ${ enterClass } ${ enterModifer }`}>{currChildren}</div>
        )}
      </Fragment>
    );
  }
}

ViewTransition.propTypes = {
  children: node,
  className: string,
  classPrefix: string,
  middleware: func,
  timeout: number,
  uid: string,
};
ViewTransition.defaultProps = {
  className: '',
};

export default ViewTransition;
