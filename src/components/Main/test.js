import React from 'react';
import { MemoryRouter as Router } from 'react-router-dom';
import { mount } from 'enzyme';
import * as routePaths from 'CONSTANTS/routePaths';
import Main from './index';
import styles, {
  HOME_TO_RIGHT,
  HANG_IN_BACK,
  RIGHT_TO_HOME,
  animDuration,
} from './styles';

describe('Main', () => {
  let props, wrapper;

  beforeEach(() => {
    const View1 = () => (<div />);
    const View2 = () => (<div />);
    props = {
      routes: [
        {
          exact: true,
          url: '/fake/1',
          view: View1,
          viewProps: { view1: true },
        },
        {
          exact: false,
          url: '/fake/2',
          view: View2,
          viewProps: { view2: true },
        },
      ],
      store: {
        dispatch: jest.fn(),
        getState: jest.fn(),
        subscribe: jest.fn(),
      },
    };
  });

  it('should render views if a match is found', () => {
    props.routes.forEach((r, ndx) => {
      wrapper = mount(
        <Router initialEntries={[ r.path ]}>
          <Main { ...props } />
        </Router>
      );
      const viewTransition = wrapper.find('ViewTransition');
      const route = viewTransition.find('Route');
      const routeProps = route.props();
      const routeView = routeProps.render({ match: {} });

      expect(routeView.type).toEqual(props.routes[ndx].view);
      expect(routeView.props).toEqual(expect.objectContaining({
        ...props.routes[ndx].viewProps,
      }));
    });
  });

  it('should render a Not Found route', () => {
    wrapper = mount(
      <Router initialEntries={[ '/asdfasdf' ]}>
        <Main { ...props } />
      </Router>
    );

    expect(wrapper.find('NoRouteMatch').length).toBe(1);
  });

  it('should apply View transitions', () => {
    const url = '/asdfasdf';
    wrapper = mount(
      <Router initialEntries={[ url ]}>
        <Main { ...props } />
      </Router>
    );
    const vtProps = wrapper.find('ViewTransition').props();
    const middleware = vtProps.middleware;
    routePaths.ROOT = '/';
    routePaths.ITEM = '/item';

    expect(vtProps).toEqual(expect.objectContaining({
      className: `${ styles.viewTransition }`,
      classPrefix: 'view',
      middleware,
      timeout: animDuration * 1000,
      uid: url,
    }));
    expect(middleware({
      from: routePaths.ROOT,
      to: `${ routePaths.ITEM }/2`,
    })).toEqual({
      enter: RIGHT_TO_HOME,
      exit: HANG_IN_BACK,
    });
    expect(middleware({
      from: `${ routePaths.ITEM }/2`,
      to: routePaths.ROOT,
    })).toEqual({
      enter: HANG_IN_BACK,
      exit: HOME_TO_RIGHT,
    });
    expect(middleware({
      from: routePaths.ROOT,
      to: '/no/transition/4/u',
    })).toEqual({});
  });

  it('should set shell class on route change', () => {
    props.setShellClass = jest.fn();
    wrapper = mount(
      <Router initialEntries={[ '/' ]}>
        <Main { ...props } />
      </Router>
    );
    wrapper.find('Main').instance().componentDidUpdate.call({ props });

    expect(props.setShellClass).toHaveBeenCalledWith(props.location);
  });
});
