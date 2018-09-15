import React from 'react';
import { shallow } from 'enzyme';

describe('app', () => {
  let wrapper, hydrate, logger, Loadable;

  beforeEach(() => {
    jest.resetModules();
    jest.mock('react-dom', () => jest.genMockFromModule('react-dom'));
    jest.mock('react-loadable', () => jest.genMockFromModule('react-loadable'));
    jest.mock('react-router-dom', () => jest.genMockFromModule('react-router-dom'));

    // require all deps that need mocking, instead of importing
    require('react-router-dom');
    Loadable = require('react-loadable');
    hydrate = require('react-dom').hydrate;
    logger = require('UTILS/logger');

    window.WP_GLOBALS = {
      app: {
        version: '1.0.0',
      },
    };
    window._glam = [];
    jest.spyOn(logger, 'default');
    logger.default.mockImplementation(() => {});
    document.body.innerHTML = '<div id="root"></div>';
    Loadable.preloadReady.mockReturnValue({
      then: (cb) => cb(),
    });
  });

  afterEach(() => {
    logger.default.mockRestore();
  });

  it('should render the app', () => {
    hydrate.mockImplementation((Comp, el) => {
      wrapper = shallow(<div>{Comp}</div>);
      const shell = wrapper.find('Shell');

      expect(shell.length).toBe(1);
    });

    require('./index');

    expect(logger.default).toHaveBeenCalledWith(
      `${ logger.GREEN_ON_BLACK } APP`, 'data under', `${ logger.BLUE } globals.app`
    );
    expect(logger.default).toHaveBeenCalledWith(
      JSON.stringify(window.WP_GLOBALS.app, null, 2)
    );
  });
});
