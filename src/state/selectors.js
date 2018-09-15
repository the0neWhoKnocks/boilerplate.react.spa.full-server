const getLoggingEnabled = (state) => state.loggingEnabled;
const getNextPage = (state) => state.nextPage;
const getPreviousView = (state) => state.previousView;
const getResults = (state) => state.results;
const getShellClass = (state) => state.shellClass;
const getScrollPos = (state, uid) => state.scrollPos[uid];
const getViewData = (state, key) => state.viewData[key];

export {
  getLoggingEnabled,
  getNextPage,
  getPreviousView,
  getResults,
  getShellClass,
  getScrollPos,
  getViewData,
};
