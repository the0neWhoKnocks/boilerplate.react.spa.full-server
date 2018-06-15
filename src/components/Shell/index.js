import React from 'react';
import { shape } from 'prop-types';
import defaultHeader from 'COMPONENTS/Header';
import defaultMain from 'COMPONENTS/Main';
import defaultFooter from 'COMPONENTS/Footer';
import './styles';

/**
 * Composes the Shell using the provided Header, Main, and Footer.
 *
 * @param {Function} [Header=defaultHeader] - A React component
 * @param {Function} [Main=defaultMain] - A React component
 * @param {Function} [Footer=defaultFooter] - A React component
 * @return {Function}
 */
const composeShell = (
  Header=defaultHeader,
  Main=defaultMain,
  Footer=defaultFooter
) => {
  /**
   * The Shell for the app
   *
   * @param {Object} footerProps - The props for the Footer component
   * @param {Object} headerProps -  The props for the Header component
   * @param {Object} mainProps -  The props for the Main component
   * @param {Object}
   */
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
