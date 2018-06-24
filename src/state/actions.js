import { routePaths } from 'SRC/data';
import {
  SET_PREVIOUS_PAGE,
  SET_SHELL_CLASS,
  SET_VIEW_DATA,
} from './actionTypes';

const setPreviousPage = url => ({
  type: SET_PREVIOUS_PAGE,
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

const setViewData = data => ({
  type: SET_VIEW_DATA,
  payload: data,
});

export {
  setPreviousPage,
  setShellClass,
  setViewData,
};
