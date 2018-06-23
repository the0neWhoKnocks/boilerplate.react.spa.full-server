import React from 'react';
import { arrayOf, bool, func, shape, string } from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import { withRouter } from 'react-router';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { animDuration } from 'COMPONENTS/ViewLoader/styles';

const NoRouteMatch = () => (
  <h1>No Matching Route Found</h1>
);

const Main = ({
  location,
  routes,
  store,
}) => (
  <main>
    <TransitionGroup>
      <CSSTransition
        key={ location.key }
        classNames="view"
        timeout={ animDuration * 1000 }
      >
        <Switch location={ location }>
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
          <Route path="*" component={ NoRouteMatch } />
        </Switch>
      </CSSTransition>
    </TransitionGroup>
  </main>
);

Main.propTypes = {
  location: shape({}),
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

export default withRouter(Main);
