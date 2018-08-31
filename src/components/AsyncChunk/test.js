import React from 'react';
import { mount, shallow } from 'enzyme';
import ViewHOC from './index';
const gD = require('UTILS/getData');
const gCK = require('UTILS/genCacheKey');
const rUT = require('UTILS/replaceUrlToken');

jest.spyOn(gD, 'default');
const getData = gD.default;
let promiseAPI, reqPromise;
getData.mockImplementation(() => {
  reqPromise = new Promise((resolve, reject) => {
    promiseAPI = {
      resolve,
      reject,
    };
  });
  return reqPromise;
});

jest.spyOn(gCK, 'default');
const genCacheKey = gCK.default;

jest.spyOn(rUT, 'default');
const replaceUrlToken = rUT.default;

// TODO - change to AsyncChunk
describe.skip('ViewHOC', () => {
  let reqOpts, wrapper, View, props, state, instance;

  const buildWrapper = (hocProps) => {
    View = ViewHOC(hocProps);
    wrapper = mount(shallow(<View {...props} />).get(0));
    instance = wrapper.instance();
  };

  beforeEach(() => {
    reqOpts = {
      method: 'GET',
      params: { fu: 'bar' },
      url: 'http://test.com/api/v1/get/wrecked',
    };
    state = {
      viewData: {},
    };
    props = {
      store: {
        dispatch: jest.fn(),
        getState: jest.fn(() => state),
        subscribe: jest.fn(),
      },
    };
    getData.mockClear();
  });

  describe('getDerivedStateFromProps', () => {
    let _props, _state;

    beforeEach(() => {
      _props = {
        getViewData: jest.fn(),
      };
      _state = {};
      buildWrapper();
      View = instance.constructor;
    });

    it("shouldn't return anything", () => {
      expect(View.getDerivedStateFromProps(_props, _state))
        .toEqual(null);
    });

    it('should parse a matched route to get the cache key', () => {
      const parsedURL = '/all/cleaned/up';
      replaceUrlToken.mockReturnValue(parsedURL);
      _props.match = {
        params: {},
      };

      View.getDerivedStateFromProps(_props, _state);

      expect(genCacheKey).toHaveBeenCalledWith(expect.objectContaining({
        url: parsedURL,
      }));
    });

    it('should return updated `data`', () => {
      _props.data = { fu: 'bar' };
      expect(View.getDerivedStateFromProps(_props, _state))
        .toEqual({
          data: _props.data,
        });
    });

    it('should return `data` from the store if there is any', () => {
      const storeData = { fu: 'bar' };
      _props.data = undefined;
      _props.getViewData.mockReturnValue(storeData);
      expect(View.getDerivedStateFromProps(_props, _state))
        .toEqual({
          data: storeData,
        });
    });
  });

  describe('constructor', () => {
    let vProps, view;

    beforeEach(() => {
      vProps = {
        store: props.store,
      };
      buildWrapper();
      View = instance.constructor;
    });

    it('should use the `data` that was passed in', () => {
      const vData = {
        top: 'seeecret',
      };
      vProps.data = vData;
      view = new View(vProps);

      expect(view.state.data).toEqual(vData);
    });

    it("should pull view data from state if it wasn't passed in", () => {
      const vData = {
        top: 'secret',
      };
      genCacheKey.mockReturnValue(vData);
      vProps.getViewData = jest.fn((val) => val),
      view = new View(vProps);

      expect(view.state.data).toEqual(vData);
    });

    it('should parse a matched route to get the cache key', () => {
      const parsedURL = '/all/cleaned/up';
      replaceUrlToken.mockReturnValue(parsedURL);
      vProps.getViewData = jest.fn();
      vProps.match = {
        params: {},
      };
      view = new View(vProps);

      expect(genCacheKey).toHaveBeenCalledWith(expect.objectContaining({
        url: parsedURL,
      }));
    });

    it('should allow for the `data` to be an Array', () => {
      vProps.data = ['zippy'];
      view = new View(vProps);

      expect(view.state.loading).toBe(false);
    });
  });

  describe('componentDidMount', () => {
    it('should just render if View `data` was passed in', () => {
      props.data = { fu: 'bar' };
      buildWrapper();

      expect(wrapper.state().loading).toBe(false);
      expect(getData).not.toHaveBeenCalled();
    });

    it('should request data for the view', async () => {
      buildWrapper({
        reqOpts,
      });
      wrapper.update();

      expect(wrapper.state().loading).toBe(true);
      expect(getData).toHaveBeenCalledWith(
        props.store,
        reqOpts
      );
      await promiseAPI.resolve();
      expect(wrapper.state()).toEqual({
        dataURL: reqOpts.url,
        loading: false,
      });
    });

    it('should NOT try to set state when not mounted', async () => {
      buildWrapper({
        reqOpts,
      });
      jest.spyOn(instance, 'setState');

      instance.mounted = false;
      await promiseAPI.resolve();

      expect(instance.setState).not.toHaveBeenCalled();
    });

    it('should handle request errors', async () => {
      const errMsg = 'Ruh-Roh!';
      const errorMock = jest.spyOn(console, 'error');
      errorMock.mockImplementation(jest.fn());
      buildWrapper({
        reqOpts: {
          url: reqOpts.url,
        },
      });
      await promiseAPI.reject(errMsg);
      wrapper.update();

      reqPromise.catch((err) => {
        expect(errorMock).toHaveBeenCalledWith(errMsg);

        errorMock.mockRestore();
      });
    });

    it('should parse a matched route to get the cache key', () => {
      const parsedURL = '/all/cleaned/up';
      replaceUrlToken.mockReturnValue(parsedURL);
      props.match = {
        params: {},
      };
      buildWrapper({
        reqOpts: {
          url: reqOpts.url,
        },
      });

      expect(getData).toHaveBeenCalledWith(props.store, expect.objectContaining({
        url: parsedURL,
      }));
    });
  });

  describe('componentWillUnmount', () => {
    it("should update `mounted` prop so setState won't get called after Promises", () => {
      props.data = { fu: 'bar' };
      buildWrapper();

      expect(instance.mounted).toBe(true);

      instance.componentWillUnmount();

      expect(instance.mounted).toBe(false);
    });
  });
});
