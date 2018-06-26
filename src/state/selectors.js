const getNextPage = (state, key) => state.nextPage;
const getPreviousPage = (state, key) => state.previousPage;
const getResults = (state, key) => state.results;
const getShellClass = (state, key) => state.shellClass;
const getViewData = (state, key) => state.viewData[key];

export {
  getNextPage,
  getPreviousPage,
  getResults,
  getShellClass,
  getViewData,
};
