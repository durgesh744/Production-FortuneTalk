import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Platform,
  Button,
  PermissionsAndroid,
  TouchableOpacity,
} from 'react-native';
import RNCallKeep from 'react-native-callkeep';
// import AsyncStorage from "@react-native-community/async-storage";

// Polyfill WebRTC

const isIOS = Platform.OS === 'ios';

// Can't be put in react state or it won't be updated in callkeep events.
let currentSession;

const Dialer = () => {
  const [ringing, inCall] = useState(false);
  let currentCallId;
  let localStream;
  let remoteStream;

  useEffect(() => {
    addCallListener();
  }, []);

  const init = async () => {
    await initializeCallKeep();
  };

  const addCallListener = async () => {
    try {
      const data = await AsyncStorage.getItem('customerData');
      const userData = JSON.parse(data);
      if (!userData) {
        const options = {
          ios: {
            appName: 'My app name',
          },
          android: {
            alertTitle: 'Permissions required',
            alertDescription:
              'This application needs to access your phone accounts',
            cancelButton: 'Cancel',
            okButton: 'ok',
            imageName: 'phone_account_icon',
            additionalPermissions: [PermissionsAndroid.PERMISSIONS.example],
            // Required to get audio in background when using Android 11
            foregroundService: {
              channelId: 'com.ksbm.fortunetalk',
              channelName: 'Foreground service for my app',
              notificationTitle: 'My app is running on background',
              notificationIcon: 'Path to the resource icon of the notification',
            },
          },
        };
        RNCallKeep.setup(options).then(accepted => {});
        // RNCallKeep.addEventListener('didReceiveStartCallAction', onNativeCall);
        // RNCallKeep.addEventListener('answerCall', onAnswerCallAction);
        // RNCallKeep.addEventListener('endCall', onEndCallAction);
        // RNCallKeep.addEventListener(
        //   'didDisplayIncomingCall',
        //   onIncomingCallDisplayed,
        // );
        // RNCallKeep.addEventListener('didPerformSetMutedCallAction', onToggleMute);
        // RNCallKeep.addEventListener('didPerformDTMFAction', onDTMF);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const initializeCallKeep = async () => {
    try {
      const options = {
        ios: {
          appName: 'My app name',
        },
        android: {
          alertTitle: 'Permissions required',
          alertDescription:
            'This application needs to access your phone accounts',
          cancelButton: 'Cancel',
          okButton: 'ok',
          imageName: 'phone_account_icon',
          additionalPermissions: [PermissionsAndroid.PERMISSIONS.example],
          // Required to get audio in background when using Android 11
          foregroundService: {
            channelId: 'com.ksbm.fortunetalk',
            channelName: 'Foreground service for my app',
            notificationTitle: 'My app is running on background',
            notificationIcon: 'Path to the resource icon of the notification',
          },
        },
      };
      RNCallKeep.setup(options).then(accepted => {});
    } catch (err) {
      console.error('initializeCallKeep error:', err.message);
    }

    // Add RNCallKit Events
    RNCallKeep.addEventListener('didReceiveStartCallAction', onNativeCall);
    RNCallKeep.addEventListener('answerCall', onAnswerCallAction);
    RNCallKeep.addEventListener('endCall', onEndCallAction);
    RNCallKeep.addEventListener(
      'didDisplayIncomingCall',
      onIncomingCallDisplayed,
    );
    RNCallKeep.addEventListener('didPerformSetMutedCallAction', onToggleMute);
    RNCallKeep.addEventListener('didPerformDTMFAction', onDTMF);
  };

  const call = async (number, video = false) => {
    // const session = await Wazo.Phone.call(number, video);
    // setupCallSession(session);
    // RNCallKeep.startCall(getCurrentCallId(), number, number, 'number', video);
  };

  const answer = withVideo => {
    RNCallKeep.setCurrentCallActive();

    // Wazo.Phone.accept(currentSession, withVideo);
  };

  const hangup = async () => {
    // const currentCallId = getCurrentCallId();
    // if (!currentSession || !currentCallId) {
    //   return;
    // }

    // try {
    //   await Wazo.Phone.hangup(currentSession);
    // } catch (e) {
    //   // Nothing to do
    // }

    onCallTerminated();
  };

  const onCallTerminated = () => {};

  const onAnswerCallAction = ({callUUID}) => {};

  const onIncomingCallDisplayed = ({callUUID, handle, fromPushKit}) => {
    // Incoming call displayed (used for pushkit on iOS)
  };

  const onNativeCall = ({handle}) => {};

  const onEndCallAction = ({callUUID}) => {
    hangup();
  };

  const onToggleMute = muted => {
    // Called when the system or the user mutes a call
    // Wazo.Phone[muted ? 'mute' : 'unmute'](currentSession);
  };

  const onDTMF = action => {
    console.log('onDTMF', action);
  };

  return (
    <View style={styles.content}>
      <View style={styles.content}>
        {/* {!ringing && !inCall && (
          <View style={styles.buttonsContainer}>
            <Button block disabled={!ready} onPress={() => call(number, false)} style={styles.button}>
              <Text>Call</Text>
            </Button>
            <Button block disabled={!ready} onPress={() => call(number, true)} style={styles.button}>
              <Text>Video call</Text>
            </Button>
          </View>
        )} */}
        {ringing && (
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              onPress={() => answer(false)}
              style={styles.button}>
              <Text style={styles.centeredText}>
                Answer audio call from {currentSession.number}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => answer(true)}
              style={styles.button}>
              <Text style={styles.centeredText}>
                Answer video call from {currentSession.number}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {inCall && (
          <View style={styles.buttonsContainer}>
            <TouchableOpacity onPress={hangup} style={styles.button}>
              <Text>Hangup</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default Dialer;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    position: 'relative',
  },
  form: {
    backgroundColor: 'white',
  },
  buttonsContainer: {
    flex: 1,
    paddingHorizontal: 10,
    flexDirection: 'row',
  },
  button: {
    margin: 10,
    flex: 1,
    alignItems: 'center',
    textAlign: 'center',
  },
  centeredText: {
    flex: 1,
    alignItems: 'center',
    textAlign: 'center',
  },
  localVideo: {
    width: 100,
    height: 100,
    position: 'absolute',
    right: 10,
    bottom: 60,
  },
  remoteVideo: {
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    margin: 0,
    padding: 0,
    aspectRatio: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    overflow: 'hidden',
    alignItems: 'center',
  },
});
