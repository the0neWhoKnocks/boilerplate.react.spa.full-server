import React, { Component } from 'react';
import { arrayOf, bool, func, shape, string } from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import styles from './styles';

class Main extends Component {
  render() {
    const {
      routes,
    } = this.props;

    return (
      <main className={`${ styles.root }`}>
        <Switch>
          {routes.map((route, ndx) => {
            const View = route.view;

            return (
              <Route
                key={ ndx }
                exact={ route.exact }
                path={ route.url }
                render={() => (
                  <View { ...route.viewProps } />
                )}
              />
            );
          })}
        </Switch>
      </main>
    );
  }
}

Main.propTypes = {
  routes: arrayOf(shape({
    exact: bool,
    url: string,
    view: func,
    viewProps: shape({}),
  })),
};
Main.defaultProps = {
  routes: [],
};

export default Main;
