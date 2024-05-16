/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import 'react-native-gesture-handler';
import {Provider} from 'react-redux';
import messaging from '@react-native-firebase/messaging';
import NotificationManager from './NotificationManager';
import store from './src/redux/store/store';

const onMessaging = message => {
  console.log(message);
  NotificationManager.initNotification()
  NotificationManager.onNotification(message);
};

console.log(store)

const RNRedux = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

AppRegistry.registerComponent(appName, () => RNRedux);

messaging().onMessage(onMessaging);
messaging().setBackgroundMessageHandler(onMessaging);
