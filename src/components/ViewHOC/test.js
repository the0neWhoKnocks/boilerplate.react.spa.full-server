import React from 'react';
import axios from 'axios';
import { mount } from 'enzyme';
import ViewHOC from './index';

jest.mock('axios', () => jest.genMockFromModule('axios'));

describe('ViewHOC', () => {
  let getOpts, postOpts, reqPromise, wrapper, View;

  beforeEach(() => {
    getOpts = {
      method: 'GET',
      params: { fu: 'bar' },
      url: 'http://test.com/api/v1/get/wrecked',
    };
    postOpts = {
      body: { fu: 'bar' },
      method: 'POST',
      url: 'http://test.com/api/v1/post/it',
    };
    const promise = new Promise((resolve, reject) => {
      reqPromise = {
        resolve,
        reject,
      };
    });
    axios.get.mockReturnValue(promise);
    axios.post.mockReturnValue(promise);
  });

  it('should just render if no URL provided', () => {
    View = ViewHOC();
    wrapper = mount(<View />);

    expect(wrapper.state().loading).toBe(false);
    expect(axios).not.toHaveBeenCalled();
  });

  it('should request data for the view', (done) => {
    const resp = {
      data: { fu: 'bar' },
    };
    View = ViewHOC({
      reqOpts: getOpts,
    });
    wrapper = mount(<View />);
    wrapper.update();

    expect(wrapper.state().loading).toBe(true);
    expect(axios.get).toHaveBeenCalledWith(getOpts.url, { params: getOpts.params });

    reqPromise.resolve(resp);

    process.nextTick(() => {
      expect(wrapper.state()).toEqual({
        data: resp.data,
        loading: false,
      });

      done();
    });
  });

  it('should handle request errors', (done) => {
    const errMsg = 'Ruh-Roh!';
    const errorMock = jest.spyOn(console, 'error');
    errorMock.mockImplementation(jest.fn());
    View = ViewHOC({
      reqOpts: {
        url: getOpts.url,
      },
    });
    wrapper = mount(<View />);
    wrapper.update();

    // validate that a default `method` gets set and no params added
    expect(axios.get).toHaveBeenCalledWith(getOpts.url);

    reqPromise.reject(errMsg);

    process.nextTick(() => {
      expect(errorMock).toHaveBeenCalledWith(errMsg);

      errorMock.mockRestore();
      done();
    });
  });

  it('should handle request errors', () => {
    View = ViewHOC({
      reqOpts: postOpts,
    });
    wrapper = mount(<View />);
    wrapper.update();

    // validate that a default `method` gets set and no params added
    expect(axios.post).toHaveBeenCalledWith(postOpts.url, postOpts.body);

    // just calling this so the Promise doesn't linger
    reqPromise.resolve({ data: '' });
  });
});
