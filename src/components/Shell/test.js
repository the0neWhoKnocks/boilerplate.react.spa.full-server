import React from 'react';
import { shallow } from 'enzyme';
import Shell, { composeShell } from './index';

describe('Shell', () => {
  let props, wrapper;

  it('should use default components', () => {
    wrapper = shallow(<Shell />);

    expect(wrapper.find('Header').length).toBe(1);
    expect(wrapper.find('Main').length).toBe(1);
    expect(wrapper.find('Footer').length).toBe(1);
  });

  it('should allow for component composition', () => {
    const CustomHeader = () => (<div />);
    const CustomMain = () => (<div />);
    const CustomFooter = () => (<div />);
    const CustomShell = composeShell(CustomHeader, CustomMain, CustomFooter);
    props = {
      footerProps: { footer: true },
      headerProps: { header: true },
      mainProps: { main: true },
    };
    wrapper = shallow(<CustomShell { ...props } />);
    const header = wrapper.find('CustomHeader');
    const main = wrapper.find('CustomMain');
    const footer = wrapper.find('CustomFooter');

    expect(header.length).toBe(1);
    expect(header.props()).toEqual(props.headerProps);
    expect(main.length).toBe(1);
    expect(main.props()).toEqual(props.mainProps);
    expect(footer.length).toBe(1);
    expect(footer.props()).toEqual(props.footerProps);
  });
});
