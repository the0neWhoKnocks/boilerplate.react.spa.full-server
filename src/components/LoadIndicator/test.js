import React from 'react';
import { shallow } from 'enzyme';

import LoadIndicator from './index';

describe('LoadIndicator', () => {
  it('should render with defaults', () => {
    const wrapper = shallow(
      <LoadIndicator />
    );

    expect(wrapper.props().className).not.toEqual('is--visible');
  });

  it('should display the loader', () => {
    const wrapper = shallow(
      <LoadIndicator visible />
    );

    expect(wrapper.props().className).toEqual('is--visible');
  });
});
