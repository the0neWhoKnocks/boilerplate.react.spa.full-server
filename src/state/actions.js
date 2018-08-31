import { routePaths } from 'SRC/data';
import getData from 'UTILS/getData';
import {
  SET_ITEM_RESULTS,
  SET_PREVIOUS_VIEW,
  SET_SHELL_CLASS,
  SET_SCROLL_POS,
  SET_VIEW_DATA,
} from './actionTypes';

let pendingItems;

const fetchMoreItems = url => {
  return (dispatch, getState) => {
    // On slow connections this can stack up if the user scrolls up and down
    // quickly.
    if(!pendingItems){
      pendingItems = getData({ url }).then((data) => {
        pendingItems = null;
        dispatch(setItemResults(data));
      });
    }

    return pendingItems;
  };
};

const setItemResults = data => ({
  type: SET_ITEM_RESULTS,
  payload: {
    nextPage: data.info.next,
    results: data.results,
  },
});

const setPreviousView = url => ({
  type: SET_PREVIOUS_VIEW,
  payload: url,
});

const setShellClass = loc => {
  const { pathname } = loc;
  let cssClass = '';

  if(pathname === routePaths.ROOT || pathname.includes(routePaths.ITEM))
    cssClass = 'is--ram';
  else if(pathname !== routePaths.TERMS)
    cssClass = 'is--ipsum';

  return {
    type: SET_SHELL_CLASS,
    payload: cssClass,
  };
};

const setScrollPos = (uid, pos) => ({
  type: SET_SCROLL_POS,
  payload: {
    pos,
    uid,
  },
});

const setViewData = data => ({
  type: SET_VIEW_DATA,
  payload: data,
});

export {
  fetchMoreItems,
  setItemResults,
  setPreviousView,
  setShellClass,
  setScrollPos,
  setViewData,
};
