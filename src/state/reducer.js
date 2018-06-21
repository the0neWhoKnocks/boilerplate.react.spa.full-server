import { INIT } from './constants';
import {
  SET_VIEW_DATA,
} from './actionTypes';
import genCacheKey from 'UTILS/genCacheKey';

const reducer = (state = INIT, action) => {
  switch( action.type ){
    case SET_VIEW_DATA: {
      const { data, reqOpts } = action.payload;
      // fake a caching structure for data
      const uniqueKey = genCacheKey(reqOpts);

      if(state.viewData[uniqueKey]) return state;
      else{
        const newState = { ...state };
        newState.viewData[uniqueKey] = data;
        return newState;
      }
    }

    default: return state;
  }
};

export default reducer;
