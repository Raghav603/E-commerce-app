import { combineReducers } from 'redux';
import Reducer from './reducer';

import wishlistReducer from './wishlistReducer';

export default combineReducers({
  Reducer,
  WishlistReducer: wishlistReducer,
});


