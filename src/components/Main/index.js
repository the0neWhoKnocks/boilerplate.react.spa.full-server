import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import './styles';

class Main extends Component {
  render() {
    return (
      <main>
        <Switch>
          {this.props.routes.map((route, ndx) => {
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
            )
          })}
        </Switch>
      </main>
    );
  }
}

export default Main;
