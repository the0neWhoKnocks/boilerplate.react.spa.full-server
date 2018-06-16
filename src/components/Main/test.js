import React from 'react';
import { shallow } from 'enzyme';
import Main from './index';

describe('Main', () => {
  it('should set up routes for Views', () => {
    const View1 = () => (<div />);
    const View2 = () => (<div />);
    const props = {
      routes: [
        {
          exact: true,
          url: 'http://test.com/fake/1',
          view: View1,
          viewProps: { view1: true },
        },
        {
          exact: false,
          url: 'http://test.com/fake/2',
          view: View2,
          viewProps: { view2: true },
        },
      ],
    };
    const wrapper = shallow(<Main { ...props } />);
    const routes = wrapper.find('Route');

    expect(routes.length).toBe(props.routes.length);
    
    for(let i=0; i<routes.length; i++){
      const routeView = routes.at(i).props().render();

      expect(routeView.type).toEqual(props.routes[i].view);
      expect(routeView.props).toEqual(props.routes[i].viewProps);
    }
  });
});
