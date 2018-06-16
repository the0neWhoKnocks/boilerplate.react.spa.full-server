import React from 'react';
import { shape } from 'prop-types';
import defaultHeader from 'COMPONENTS/Header';
import defaultMain from 'COMPONENTS/Main';
import defaultFooter from 'COMPONENTS/Footer';
import './styles';

const composeShell = (
  Header=defaultHeader,
  Main=defaultMain,
  Footer=defaultFooter
) => {
  const Shell = ({
    footerProps,
    headerProps,
    mainProps,
  }) => (
    <div className="shell">
      <Header { ...headerProps } />
      <Main { ...mainProps } />
      <Footer { ...footerProps } />
    </div>
  );

  Shell.propTypes = {
    footerProps: shape({}),
    headerProps: shape({}),
    mainProps: shape({}),
  };

  return Shell;
};

export default composeShell();
export {
  composeShell,
};
