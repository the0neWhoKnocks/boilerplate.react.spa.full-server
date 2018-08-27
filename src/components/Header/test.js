import React from 'react';
import { shallow } from 'enzyme';
import Header, {
  CLOSE_DELAY,
} from './index';
import styles from './styles';

describe('Header', () => {
  let instance, props, wrapper, clickEv, changeEv, mockContains;

  beforeEach(() => {
    props = {
      navItems: [{
        exact: true,
        label: 'Nav Item',
        url: 'http://test.com/some/page',
      }],
    };
    mockContains = false;
    clickEv = {
      currentTarget: {
        classList: {
          contains: jest.fn(() => mockContains),
        },
      },
    };
    changeEv = {
      currentTarget: {
        checked: false,
      },
    };
  });

  it('should have required markup', () => {
    wrapper = shallow(<Header />);

    expect(wrapper.find('Logo').length).toBe(1);
    expect(wrapper.find(`.${ styles.toggle }`).length).toBe(1);
    expect(wrapper.find(`.${ styles.nav }`).length).toBe(1);
  });

  it('should close mobile menu after an item is clicked', () => {
    wrapper = shallow(<Header { ...props } />);
    wrapper.setState({ menuOpen: true }, () => {
      instance = wrapper.instance();
      instance.toggleTimeout = 1234;
      wrapper.find('NavLink').simulate('click', clickEv);

      // timeout cleared
      expect(instance.toggleTimeout).toBe(1);
      // menu is open
      expect(wrapper.state().menuOpen).toBe(true);
      expect(wrapper.state().menuOpen).toBe(true);

      jest.runTimersToTime(CLOSE_DELAY);
      wrapper.update();

      // menu closed
      expect(wrapper.state().menuOpen).toBe(false);
      expect(instance.toggleTimeout).toBe(undefined);
    });
  });

  it('should NOT do anything if the menu is closed or the same item was clicked', () => {
    const initialNdx = 0;

    wrapper = shallow(<Header { ...props } />);
    instance = wrapper.instance();
    instance.navNdx = initialNdx;

    wrapper.find('NavLink').simulate('click', clickEv);
    jest.runTimersToTime(CLOSE_DELAY);

    expect(instance.navNdx).toBe(initialNdx);

    mockContains = true;
    wrapper.setState({ menuOpen: true });
    wrapper.update();
    wrapper.find('NavLink').simulate('click', clickEv);
    jest.runTimersToTime(CLOSE_DELAY);

    expect(instance.navNdx).toBe(initialNdx);
    expect(wrapper.state().menuOpen).toBe(true);
  });

  it('should toggle the state of the menu', () => {
    wrapper = shallow(<Header { ...props } />);
    const input = wrapper.find(`.${ styles.toggleInput }`);

    expect(wrapper.state().menuOpen).toBe(false);

    changeEv.currentTarget.checked = true;
    input.simulate('change', changeEv);
    wrapper.update();
    expect(wrapper.state().menuOpen).toBe(true);

    changeEv.currentTarget.checked = false;
    input.simulate('change', changeEv);
    wrapper.update();
    expect(wrapper.state().menuOpen).toBe(false);
  });
});
