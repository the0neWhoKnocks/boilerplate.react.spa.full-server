import React from 'react';
import { shallow } from 'enzyme';
import { render } from 'react-dom';
import 'react-router-dom';
import {
  footerProps,
  headerProps,
  mainProps,
} from './data';

jest.mock('react-dom', () => jest.genMockFromModule('react-dom'));
jest.mock('react-router-dom', () => jest.genMockFromModule('react-router-dom'));

describe('app', () => {
  it('should render the app', () => {
    window.WP_GLOBALS = {
      app: {},
    };
    const logMock = jest.spyOn(console, 'log');
    logMock.mockImplementation(jest.fn());
    render.mockImplementation((Comp, el) => {
      const wrapper = shallow(<div>{Comp}</div>);
      const router = wrapper.find('BrowserRouter');
      const shell = router.find('Shell');

      expect(router.length).toBe(1);
      expect(shell.length).toBe(1);
      expect(shell.props()).toEqual({
        footerProps,
        headerProps,
        mainProps,
      });
    });
    document.body.innerHTML = '<div id="root"></div>';
    require('./index');

    logMock.mockRestore();
  });
});
