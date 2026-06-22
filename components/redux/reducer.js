import { ADD_TO_CART, REMOVE_FROM_CART } from './constants';

const initialState = [];

const Reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      return [...state, action.data];
    
    case REMOVE_FROM_CART:
      // action.data can be either product id or name (fallback)
      const index = state.findIndex(
        item => (item?.id ?? item?.name) === action.data,
      );
      if (index >= 0) {
        const newState = [...state];
        newState.splice(index, 1);
        return newState;
      }
      return state;

    default:
      return state;
  }
};

export default Reducer;