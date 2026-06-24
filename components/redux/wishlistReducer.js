import { ADD_TO_WISHLIST, REMOVE_FROM_WISHLIST } from './wishlistConstants';

const initialState = [];

export default function wishlistReducer(state = initialState, action) {

  switch (action.type) {
    case ADD_TO_WISHLIST: {
      const item = action.data;
      const key = item?.id ?? item?.name;
      if (key == null) return state;

      const exists = state.some(x => (x?.id ?? x?.name) === key);
      if (exists) return state;

      return [...state, item];
    }

    case REMOVE_FROM_WISHLIST: {
      const data = action.data;
      const index = state.findIndex(x => (x?.id ?? x?.name) === data);
      if (index < 0) return state;
      const next = [...state];
      next.splice(index, 1);
      return next;
    }

    default:
      return state;
  }
}

