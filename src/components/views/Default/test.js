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

  it('should pass required props to ViewLoader', () => {
    wrapper = shallow(<View { ...props } />);
    const viewLoader = wrapper.find('Connect(ViewLoader)');

    expect(viewLoader.props()).toEqual(expect.objectContaining({
      loading: props.loading,
      uid: props.dataURL,
    }));
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
