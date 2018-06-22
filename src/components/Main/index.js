import React from 'react';
import { arrayOf, bool, func, shape, string } from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import styles from './styles';

const Main = ({
  routes,
  store,
}) => (
  <main className={`${ styles.root }`}>
    <Switch>
      {routes.map((route, ndx) => {
        const View = route.view;

        return (
          <Route
            key={ ndx }
            exact={ route.exact }
            path={ route.url }
            render={({ match }) => (
              <View
                match={ match }
                store={ store }
                { ...route.viewProps }
              />
            )}
          />
        );
      })}
    </Switch>
  </main>
);

Main.propTypes = {
  routes: arrayOf(shape({
    exact: bool,
    url: string,
    view: func,
    viewProps: shape({}),
  })),
  store: shape({}),
};
Main.defaultProps = {
  routes: [],
};

export default Main;
