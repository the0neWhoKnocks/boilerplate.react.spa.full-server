import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bool, func, node, number, shape, string } from 'prop-types';
import classnames from 'classnames';
import Spinner from 'COMPONENTS/Spinner';
import {
  setScrollPos,
} from 'STATE/actions';
import { getScrollPos } from 'STATE/selectors';
import styles from './styles';


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

    if(
      // currently in a loading state
      state.loading
      // components have loaded
      && props.children
      // the data needed to render the component has loaded
      && props.dataLoaded
    ){
      newState.loading = false;
    }

    return newState;
  }

  constructor(props) {
    super();

    this.state = {
      loading: props.loading || false,
      pastDelay: props.pastDelay || false,
    };
    this.wasLoading = this.state.loading;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentDidMount() {
    const {
      dataLoaded,
      delay,
      loading,
      scrollPos,
    } = this.props;

    this.mounted = true;

    if(loading || !dataLoaded){
      const state = {
        loading: true,
      };

      if(delay){
        state.pastDelay = false;
        setTimeout(() => {
          if(this.mounted){
            this.setState({
              pastDelay: true,
            });
          }
        }, delay);
      }

      this.wasLoading = true;
      this.setState(state);
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
      chunkType,
      dataLoaded,
      error,
      retry: reloadHandler,
      timedOut,
    } = this.props;
    const {
      loading,
      pastDelay,
    } = this.state;

    const overlayClass = classnames(
      `overlay ${ styles.overlay }`,
      { 'is--loading': loading && pastDelay },
    );
    let viewModifier = (chunkType)
      ? `is--${ chunkType }`
      : '';
    let contentTransition = (children && this.wasLoading && dataLoaded)
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
          { (loading && pastDelay) && (
            <Spinner className={`${ styles.spinner }`} label="Loading" />
          )}
        </div>
        <div className={`view-content ${ contentTransition }`}>
          {error && (
            <div className={ `${ styles.msg } is--error` }>
              There was an error.
              <button onClick={ reloadHandler }>Reload Page</button>
              <pre>{error.stack}</pre>
            </div>
          )}

          {/* TODO - style timeout messaging */}
          {timedOut && (
            <div className={ `${ styles.msg } is--warning` }>
              The request may have timed out.
              <button onClick={ reloadHandler }>Reload Page</button>
            </div>
          )}

          { children && children }
        </div>
      </div>
    );
  }
}

AsyncLoader.propTypes = {
  children: node,
  chunkType: string,
  className: string,
  dataLoaded: bool,
  delay: number,
  error: shape({}),
  loading: bool,
  pastDelay: bool,
  retry: func,
  scrollPos: number,
  setScrollPos: func,
  timedOut: bool,
  uid: string,
};

const ConnectedLoader = connect(mapStateToProps, mapDispatchToProps)(AsyncLoader);

const composeLoader = ({
  chunkType,
  delay,
}) => {
  const WrappedLoader = ({
    children,
    dataLoaded,
    uid,
    // props passed from react-loadable `loading` component
    error,
    isLoading,
    pastDelay,
    retry,
    timedOut,
  }) => {
    return (
      <ConnectedLoader
        chunkType={chunkType}
        dataLoaded={dataLoaded}
        delay={delay}
        uid={uid}

        error={error}
        loading={isLoading}
        pastDelay={pastDelay}
        retry={retry}
        timedOut={timedOut}
      >{children}</ConnectedLoader>
    );
  };

  WrappedLoader.propTypes = {
    children: node,
    dataLoaded: bool,
    error: shape({}),
    isLoading: bool,
    pastDelay: bool,
    retry: func,
    timedOut: bool,
    uid: string,
  };

  return WrappedLoader;
};

export default AsyncLoader;
export {
  composeLoader,
  ConnectedLoader,
};
