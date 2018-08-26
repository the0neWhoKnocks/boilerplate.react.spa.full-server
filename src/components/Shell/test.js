import React from 'react';
import { shallow } from 'enzyme';

describe('Shell', () => {
  let props, wrapper, mockStore, index, Shell, composeShell, store,
    mapStateToProps, ShellWrap;

  const setupEnv = (isClient) => {
    if(isClient) process.env.IS_CLIENT = 'true';
    else delete process.env.IS_CLIENT;

    index = require('./index');
    store = require('STATE/store').default;

    Shell = index.default;
    composeShell = index.composeShell;
    mapStateToProps = index.mapStateToProps;
    ShellWrap = index.ShellWrap;

    mockStore = {
      dispatch: jest.fn(),
      getState: jest.fn(),
      subscribe: jest.fn(),
    };
    store.app = mockStore;
    props = {
      footerProps: { footer: true },
      headerProps: { header: true },
      mainProps: {
        main: true,
        store: store.app,
      },
    };
  };

  beforeEach(() => {
    jest.resetModules();
  });

  describe('mapStateToProps', () => {
    it('should return state props', () => {
      const shellClass = 'blah';
      setupEnv();

      const props = mapStateToProps({
        shellClass,
      });

      expect(props).toEqual({
        shellClass,
      });
    });
  });

  describe('ShellWrap', () => {
    it("shouldn't do much if nothing was passed to it", () => {
      setupEnv();
      wrapper = shallow(<ShellWrap></ShellWrap>);

      expect(wrapper.props().className).toEqual('shell ');
      expect(wrapper.children().length).toBe(0);
    });

    it('should apply shell specific class and render children', () => {
      const cl = 'customShiz';
      const childClass = 'fu';
      const childContent = 'bar';

      setupEnv();
      wrapper = shallow(
        <ShellWrap shellClass={cl}>
          <div className={childClass}>{childContent}</div>
        </ShellWrap>
      );
      const children = wrapper.children();

      expect(wrapper.props().className).toEqual(`shell ${ cl }`);
      expect(children.length).toBe(1);
      expect(children.get(0).props).toEqual({
        className: childClass,
        children: childContent,
      });
    });
  });

  describe('Client', () => {
    beforeEach(() => {
      setupEnv(true);
    });

    it('should use default components', () => {
      wrapper = shallow(<Shell { ...props } />);

      expect(wrapper.find('Header').length).toBe(1);
      expect(wrapper.find('withRouter(Connect(Main))').length).toBe(1);
      expect(wrapper.find('Footer').length).toBe(1);
    });

    it('should use BrowserRouter on client', () => {
      wrapper = shallow(<Shell { ...props } />);
      expect(wrapper.find('BrowserRouter').length).toBe(1);
    });

    it('should allow for component composition', () => {
      const CustomHeader = () => (<div />);
      const CustomMain = () => (<div />);
      const CustomFooter = () => (<div />);
      const CustomShell = composeShell(CustomHeader, CustomMain, CustomFooter);

      wrapper = shallow(<CustomShell { ...props } />);
      const header = wrapper.find('CustomHeader');
      const main = wrapper.find('CustomMain');
      const footer = wrapper.find('CustomFooter');

      expect(header.length).toBe(1);
      expect(header.props()).toEqual(props.headerProps);
      expect(main.length).toBe(1);
      expect(main.props()).toEqual(props.mainProps);
      expect(footer.length).toBe(1);
      expect(footer.props()).toEqual(props.footerProps);
    });
  });

  describe('Server', () => {
    beforeEach(() => {
      setupEnv(false);
      props.context = {};
      props.request = {
        url: 'http://fake.com/some/path',
      };
    });

    it('should use StaticRouter on server', () => {
      wrapper = shallow(<Shell { ...props } />);
      expect(wrapper.find('StaticRouter').length).toBe(1);
    });
  });
});
