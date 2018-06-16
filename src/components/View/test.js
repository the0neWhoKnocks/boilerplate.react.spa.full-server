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
      loading: false,
      title: 'Page 1',
    };
  });

  it('should NOT be in a loading state', () => {
    wrapper = shallow(<View { ...props } />);

    expect(wrapper.find('.is--loading').length).toBe(0);
    expect(wrapper.find('Spinner').length).toBe(0);
  });

  it('should be in a loading state', () => {
    props.loading = true;
    wrapper = shallow(<View { ...props } />);

    expect(wrapper.find('.is--loading').length).toBe(1);
    expect(wrapper.find('Spinner').length).toBe(1);
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
