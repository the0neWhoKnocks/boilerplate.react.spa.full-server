import React from 'react';
import { shallow } from 'enzyme';
import Logo from './index';

describe('Logo', () => {
  it('should apply custom CSS class', () => {
    const props = {
      className: 'custom-class',
    };
    const wrapper = shallow(<Logo { ...props } />);

    expect(wrapper.props().className).toEqual(expect.stringMatching(props.className));
  });
});
