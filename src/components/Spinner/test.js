import React from 'react';
import { shallow } from 'enzyme';
import Spinner from './index';

describe('Spinner', () => {
  it('should apply props', () => {
    const props = {
      className: 'custom-class',
      label: 'Loading',
    };
    const wrapper = shallow(<Spinner { ...props } />);

    expect(wrapper.hasClass(props.className)).toBe(true);
    expect(wrapper.prop('data-label')).toEqual(props.label);
  });
});
