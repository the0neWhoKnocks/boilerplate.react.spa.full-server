import React from 'react';
import { shallow } from 'enzyme';

describe('app', () => {
  let wrapper, hydrate, data, cookie, logger, footerProps, headerProps,
    mainProps, Loadable;

  beforeEach(() => {
    jest.resetModules();
    jest.mock('react-dom', () => jest.genMockFromModule('react-dom'));
    jest.mock('react-loadable', () => jest.genMockFromModule('react-loadable'));
    jest.mock('react-router-dom', () => jest.genMockFromModule('react-router-dom'));
    jest.mock('./data', () => ({
      footerProps: {
        isFooter: true,
      },
      headerProps: {
        isHeader: true,
      },
      mainProps: {
        isMain: true,
      },
    }));

    // require all deps that need mocking, instead of importing
    require('react-router-dom');
    Loadable = require('react-loadable');
    hydrate = require('react-dom').hydrate;
    cookie = require('UTILS/cookie');
    logger = require('UTILS/logger');
    data = require('./data');
    footerProps = data.footerProps;
    headerProps = data.headerProps;
    mainProps = data.mainProps;

    window.WP_GLOBALS = {
      app: {
        version: '1.0.0',
      },
    };
    window._glam = [];
    jest.spyOn(cookie, 'getCookie');
    jest.spyOn(logger, 'default');
    logger.default.mockImplementation(() => {});
    document.body.innerHTML = '<div id="root"></div>';
    Loadable.preloadReady.mockReturnValue({
      then: (cb) => cb(),
    });
  });

  afterEach(() => {
    cookie.getCookie.mockRestore();
    logger.default.mockRestore();
  });

  it('should render the app', () => {
    hydrate.mockImplementation((Comp, el) => {
      wrapper = shallow(<div>{Comp}</div>);
      const shell = wrapper.find('Shell');

      expect(shell.length).toBe(1);
      expect(shell.props()).toEqual({
        footerProps,
        headerProps,
        mainProps,
      });
      expect(footerProps.loggingEnabled).toBe(undefined);
    });

    require('./index');

    expect(logger.default).toHaveBeenCalledWith(
      `${ logger.GREEN_ON_BLACK } APP`, 'data under', `${ logger.BLUE } globals.app`
    );
    expect(logger.default).toHaveBeenCalledWith(
      JSON.stringify(window.WP_GLOBALS.app, null, 2)
    );
  });

  it('should enable logging', () => {
    cookie.getCookie.mockImplementation(name => name == 'logging' && true);
    hydrate.mockImplementation((Comp, el) => {
      expect(footerProps.loggingEnabled).toBe(true);
    });

    require('./index');
  });
});
