import { combineReducers } from 'redux';
import Reducer from './cart/reducer';

import wishlistReducer from './wishlist/wishlistReducer';

export default combineReducers({
  Reducer,
  WishlistReducer: wishlistReducer,
});
