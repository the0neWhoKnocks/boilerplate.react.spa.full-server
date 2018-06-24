import {
  SET_PREVIOUS_PAGE,
  SET_VIEW_DATA,
} from './actionTypes';

const setPreviousPage = url => ({
  type: SET_PREVIOUS_PAGE,
  payload: url,
});
const setViewData = data => ({
  type: SET_VIEW_DATA,
  payload: data,
});

export {
  setPreviousPage,
  setViewData,
};
