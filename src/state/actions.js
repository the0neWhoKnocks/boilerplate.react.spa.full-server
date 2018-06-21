import {
  SET_VIEW_DATA,
} from './actionTypes';

const setViewData = data => ({
  type: SET_VIEW_DATA,
  payload: data,
});


export {
  setViewData,
};
