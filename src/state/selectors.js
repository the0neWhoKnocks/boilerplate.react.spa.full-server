const getNextPage = (state) => state.nextPage;
const getPreviousPage = (state) => state.previousPage;
const getResults = (state) => state.results;
const getShellClass = (state) => state.shellClass;
const getScrollPos = (state, uid) => state.scrollPos[uid];
const getViewData = (state, key) => state.viewData[key];

export {
  getNextPage,
  getPreviousPage,
  getResults,
  getShellClass,
  getScrollPos,
  getViewData,
};
