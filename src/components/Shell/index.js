import React, { Component } from 'react';
import defaultHeader from 'COMPONENTS/Header';
import defaultMain from 'COMPONENTS/Main';
import defaultFooter from 'COMPONENTS/Footer';

const composeShell = (
  Header=defaultHeader,
  Main=defaultMain,
  Footer=defaultFooter
) => (
  class Shell extends Component {
    render() {
      return (
        <div className="shell">
          <Header { ...this.props.headerProps } />
          <Main { ...this.props.mainProps } />
          <Footer  { ...this.props.footerProps } />
        </div>
      );
    }
  }
);

export default composeShell();
export {
  composeShell
};
