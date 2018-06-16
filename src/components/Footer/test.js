import React from 'react';
import { shallow } from 'enzyme';
import Footer from './index';

describe('Footer', () => {
  it('should append given links in order provided', () => {
    const props = {
      navItems: [
        {
          exact: true,
          label: 'Link 1',
          url: 'http://test.com/fake/1',
        },
        {
          exact: false,
          label: 'Link 2',
          url: 'http://test.com/fake/2',
        },
        {
          exact: true,
          label: 'Link 3',
          url: 'http://test.com/fake/3',
        },
      ],
    };
    const wrapper = shallow(<Footer { ...props } />);
    const links = wrapper.find('NavLink');

    expect(links.length).toBe(props.navItems.length);
    for(let i=0; i<links.length; i++){
      expect(links.at(i).props().children).toEqual(props.navItems[i].label);
    }
  });
});
