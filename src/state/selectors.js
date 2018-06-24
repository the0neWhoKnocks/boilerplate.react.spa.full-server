const getPreviousPage = (state, key) => state.previousPage;
const getShellClass = (state, key) => state.shellClass;
const getViewData = (state, key) => state.viewData[key];

export {
  getPreviousPage,
  getShellClass,
  getViewData,
};
