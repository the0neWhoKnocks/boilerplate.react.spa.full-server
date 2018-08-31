import { NAME } from './constants';

const namespace = `SPA/${ NAME }`;
const SET_ITEM_LOADED = `${ namespace }/SET_ITEM_LOADED`;
const SET_ITEM_RESULTS = `${ namespace }/SET_ITEM_RESULTS`;
const SET_PREVIOUS_VIEW = `${ namespace }/SET_PREVIOUS_VIEW`;
const SET_SHELL_CLASS = `${ namespace }/SET_SHELL_CLASS`;
const SET_SCROLL_POS = `${ namespace }/SET_SCROLL_POS`;
const SET_VIEW_DATA = `${ namespace }/SET_VIEW_DATA`;

export {
  SET_ITEM_LOADED,
  SET_ITEM_RESULTS,
  SET_PREVIOUS_VIEW,
  SET_SHELL_CLASS,
  SET_SCROLL_POS,
  SET_VIEW_DATA,
};
