const NAME = 'APP';
const initialState = () => ({
  loggingEnabled: false,
  nextPage: undefined,
  previousView: undefined,
  results: [],
  shellClass: '',
  scrollPos: {},
  viewData: {},
});

export {
  NAME,
  initialState,
};
