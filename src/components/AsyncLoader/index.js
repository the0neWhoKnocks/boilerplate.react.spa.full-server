import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bool, func, node, number, string } from 'prop-types';
import classnames from 'classnames';
import Spinner from 'COMPONENTS/Spinner';
import styles from './styles';

import {
  setScrollPos,
} from 'STATE/actions';
import {
  getScrollPos,
} from 'STATE/selectors';

const mapStateToProps = (state, props) => {
  return {
    scrollPos: getScrollPos(state, props.uid),
  };
};
const mapDispatchToProps = {
  setScrollPos,
};

class AsyncLoader extends Component {
  static getDerivedStateFromProps(props, state) {
    const newState = {};

    if(props.children && state.loading){
      newState.loading = false;
    }

    return newState;
  }

  constructor() {
    super();

    this.wasLoading = false;
    this.state = {
      loading: false,
    };
  }

  componentDidMount() {
    const {
      delay,
      loading,
      scrollPos,
    } = this.props;

    if(loading){
      this.wasLoading = true;

      if(delay){
        setTimeout(() => {
          // if the component hasn't loaded yet, show the loader
          if(!this.props.children){
            this.setState({
              loading: true,
            });
          }
        }, delay);
      }
    }

    if(scrollPos) this.viewNode.scrollTop = scrollPos;
  }

  shouldComponentUpdate(nextProps) {
    // Scroll position prop changes happen often so we can maintain scroll
    // position when switching between views, and it shouldn't trigger updates
    // while the user is on the current view.
    if(
      nextProps.scrollPos !== undefined
      && nextProps.scrollPos !== this.viewNode.scrollTop
      && nextProps.scrollPos === this.viewNode.scrollTop
    ) return false;

    return true;
  }

  handleScroll() {
    if(this.scrollTimer) clearTimeout(this.scrollTimer);

    this.scrollTimer = setTimeout(() => {
      const { setScrollPos, uid } = this.props;

      setScrollPos(uid, this.viewNode.scrollTop);
    }, 10); // threshold has to be low to account for mobile scroll inertia
  }

  render() {
    const {
      children,
      error,
      viewType,
    } = this.props;
    const {
      loading,
    } = this.state;
    const overlayClass = classnames(
      `overlay ${ styles.overlay }`,
      { 'is--loading': loading },
    );
    let viewModifier = (viewType)
      ? `is--${ viewType }`
      : '';
    let contentTransition = (children && this.wasLoading)
      ? `${ styles.fadeIn }` : '';

    return (
      <div
        key="view"
        className={ `view ${ styles.view } ${ viewModifier }` }
        ref={ (node) => {
          if(node){
            this.viewNode = node;
            node.addEventListener('scroll', this.handleScroll.bind(this));
          }
        } }
      >
        <div
          key="overlay"
          className={overlayClass}
        >
          { loading && (
            <Spinner className={`${ styles.spinner }`} label="Loading" />
          )}
        </div>
        <div className={`view-content ${ contentTransition }`}>
          {error && (
            <div>Error - {error}</div>
          )}
          { children }
        </div>
      </div>
    );
  }
}

AsyncLoader.propTypes = {
  children: node,
  className: string,
  delay: number,
  error: string,
  loading: bool,
  scrollPos: number,
  setScrollPos: func,
  timeout: number,
  uid: string,
  viewType: string,
};

export default connect(mapStateToProps, mapDispatchToProps)(AsyncLoader);
