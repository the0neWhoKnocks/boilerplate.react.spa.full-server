import React from 'react';
import { shallow } from 'enzyme';

import LoadIndicator from './index';

describe('LoadIndicator', () => {
  let props;

  beforeEach(() => {
    props = {
      overlayColor: '#ff0000',
      spinnerBGColor: '#000',
      spinnerColor: '#fff',
      spinnerSize: '1em',
      spinnerSpeed: '0.25s',
      spinnerThickness: '0.1em',
    };
  });

  it('should render with defaults', () => {
    const wrapper = shallow(
      <LoadIndicator />
    );

    expect(wrapper.find('.indicator__overlay').props().className).toContain('css-13ulmoi');
    expect(wrapper.find('.indicator__spinner').props().className).toContain('css-y2jzjb');
  });

  it('should render with custom styles applied', () => {
    const wrapper = shallow(
      <LoadIndicator { ...props } />
    );

    expect(wrapper.find('.indicator__overlay').props().className).toContain('css-gxurh3');
    expect(wrapper.find('.indicator__spinner').props().className).toContain('css-fa4b8m');
  });
});
