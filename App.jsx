import {View, Text, SafeAreaView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {PaperProvider} from 'react-native-paper';
import StackNavigator from './src/navigations/StackNavigator';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import NetworkStatus from './src/components/NetworkStatus';
import NetInfo from '@react-native-community/netinfo';
import NotificationManager from './NotificationManager';
import SpInAppUpdates, {
  NeedsUpdateResponse,
  IAUUpdateKind,
  StartUpdateOptions,
} from 'sp-react-native-in-app-updates';

const inAppUpdates = new SpInAppUpdates(
  false, // isDebug
);

const App = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    NotificationManager.initNotification();
    checkForUpdates()
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const checkForUpdates = () => {
    inAppUpdates.checkNeedsUpdate({curVersion: '2.0.1'}).then(result => {
      if (result.shouldUpdate) {
        let updateOptions: StartUpdateOptions = {};
        if (Platform.OS === 'android') {
          // android only, on iOS the user will be promped to go to your app store page
          updateOptions = {
            updateType: IAUUpdateKind.FLEXIBLE,
          };
        }
        inAppUpdates.startUpdate(updateOptions); // https://github.com/SudoPlz/sp-react-native-in-app-updates/blob/master/src/types.ts#L78
      }
    }).catch(err=>{
      console.log(err)
    });
  };

  return (
    <SafeAreaProvider style={{flex: 1}}>
      <PaperProvider>
        <NetworkStatus status={isConnected} />
        <NavigationContainer>
          <StackNavigator />
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

export default App;
