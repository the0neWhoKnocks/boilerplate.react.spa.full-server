import genCacheKey from 'UTILS/genCacheKey';
import log, {
  BLUE,
  BLACK_ON_GREEN,
  BLACK_ON_GRAY,
} from 'UTILS/logger';
import { initialState } from './constants';
import {
  SET_ITEM_RESULTS,
  SET_PREVIOUS_PAGE,
  SET_SHELL_CLASS,
  SET_SCROLL_POS,
  SET_VIEW_DATA,
} from './actionTypes';

function reducer(extendedData = {}){
  const st = {
    ...initialState(),
    ...extendedData,
  };

  return (state = st, action) => {
    const { payload, type } = action;

    if(type.indexOf('INIT') < 0)
      log(`${ BLACK_ON_GREEN } REDUCER`, type);

    switch( type ){
      case SET_ITEM_RESULTS: {
        const { nextPage, results } = payload;
        log('  ', `${ BLACK_ON_GRAY } SET`, 'nextPage & reults');
        return {
          ...state,
          nextPage,
          results: [
            ...state.results,
            ...results,
          ],
        };
      }

      case SET_PREVIOUS_PAGE: {
        log('  ', `${ BLACK_ON_GRAY } SET`, 'previous page to:', `${ BLUE } "${ payload }"`);
        return {
          ...state,
          previousPage: payload,
        };
      }

      case SET_SHELL_CLASS: {
        log('  ', `${ BLACK_ON_GRAY } SET`, 'Shell class to:', `${ BLUE } "${ payload }"`);
        return {
          ...state,
          shellClass: payload,
        };
      }

      case SET_SCROLL_POS: {
        const { pos, uid } = payload;

        if(uid){
          log('  ', `${ BLACK_ON_GRAY } SET`, 'Scroll position for', `${ BLUE } "${ uid }"` ,'to:', `${ BLUE } ${ pos }`);
          return {
            ...state,
            scrollPos: {
              ...state.scrollPos,
              [uid]: pos,
            },
          };
        }

        return state;
      }

      case SET_VIEW_DATA: {
        const { data, reqOpts } = payload;
        // fake a caching structure for data
        const uniqueKey = genCacheKey(reqOpts);

        if(state.viewData[uniqueKey]) return state;
        else{
          const newState = { ...state };
          newState.viewData[uniqueKey] = data;
          log('  ', `${ BLACK_ON_GRAY } SET`, 'unique key for:', `${ BLUE } "${ uniqueKey }"`);
          return newState;
        }
      }

      default: return { ...state };
    }
  };
}

export default reducer;
