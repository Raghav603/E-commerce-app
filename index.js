import {AppRegistry} from 'react-native'
import {Provider} from 'react-redux'
import App from './app'
import {name as AppName} from './app.json'
import Store from './components/redux/store'

export const AppRedux = () => (
  <Provider store={Store}>
    <App/>
  </Provider>
)

AppRegistry.registerComponent(AppName, () => AppRedux);

