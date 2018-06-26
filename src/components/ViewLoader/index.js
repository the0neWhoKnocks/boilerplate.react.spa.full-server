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

class ViewLoader extends Component {
  componentDidMount() {
    const { scrollPos } = this.props;

    if(scrollPos) this.viewNode.scrollTop = scrollPos;
  }

  shouldComponentUpdate(nextProps) {
    // This will happen often and it shouldn't trigger updates while the user is
    // on the current view.
    if(
      nextProps.scrollPos !== undefined
      && nextProps.scrollPos !== this.viewNode.scrollTop
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
      className,
      loading,
    } = this.props;

    const overlayClass = classnames(
      `overlay ${ styles.overlay }`,
      { 'is--loading': loading },
    );

    return (
      <div
        key="view"
        className={ `view ${ styles.view } ${ className }` }
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
        <div className="view-content">
          { children }
        </div>
      </div>
    );
  }
}

ViewLoader.propTypes = {
  children: node,
  className: string,
  loading: bool,
  scrollPos: number,
  setScrollPos: func,
  uid: string,
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewLoader);
