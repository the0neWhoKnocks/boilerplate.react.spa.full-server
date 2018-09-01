import React from 'react';
import { shallow } from 'enzyme';
import View from './index';

describe('View', () => {
  let props, wrapper;

  beforeEach(() => {
    props = {
      data: [
        "I'm a paragraph!",
        'No shit? Me to!!',
      ],
      dataURL: 'http://fake.com/some/path',
      loading: false,
      title: 'Page 1',
    };
  });

  it('should NOT return anything if there is no data', () => {
    props.data = [];

    wrapper = shallow(<View { ...props } />);

    expect(wrapper.children().length).toBe(0);
  });

  it('should populate content', () => {
    wrapper = shallow(<View { ...props } />);
    const paragraphs = wrapper.find('.view__body p');

    expect(wrapper.find('h1').text()).toEqual(props.title);
    expect(paragraphs.length).toBe(props.data.length);
    for(let i=0; i<paragraphs.length; i++){
      expect(paragraphs.at(i).text()).toEqual(props.data[i]);
    }
  });
});
