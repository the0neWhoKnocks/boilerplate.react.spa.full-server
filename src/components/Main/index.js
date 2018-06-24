import React from 'react';
import { arrayOf, bool, func, shape, string } from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import { withRouter } from 'react-router';
import ViewTransition from 'COMPONENTS/ViewTransition';
import { routePaths } from 'SRC/data';
import styles, {
  HOME_TO_RIGHT,
  HANG_IN_BACK,
  RIGHT_TO_HOME,
  animDuration,
} from './styles';

const NoRouteMatch = () => (
  <h1>No Matching Route Found</h1>
);

const transitionMiddleware = ({
  from,
  to,
}) => {
  // from root view to item view
  if(from === routePaths.ROOT && to.includes(routePaths.ITEM)) return {
    enter: RIGHT_TO_HOME,
    exit: HANG_IN_BACK,
  };
  // from item view back to root
  else if(from.includes(routePaths.ITEM) && to === routePaths.ROOT) return {
    enter: HANG_IN_BACK,
    exit: HOME_TO_RIGHT,
  };

  return {};
};

const Main = ({
  location,
  routes,
  store,
}) => (
  <main>
    <ViewTransition
      className={ `${ styles.viewTransition }` }
      classPrefix="view"
      middleware={ transitionMiddleware }
      timeout={ animDuration * 1000 }
      uid={ location.pathname }
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
    </ViewTransition>
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
