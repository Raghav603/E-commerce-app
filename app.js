import React from 'react';
import { Provider } from 'react-redux';

import AppNavigator from './navigation/AppNavigator';
import store from './components/redux/store';

const App = () => {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
};

export default App;