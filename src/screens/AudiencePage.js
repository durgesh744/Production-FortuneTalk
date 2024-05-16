import React, {useEffect, useRef} from 'react';
import {
  Alert,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
} from 'react-native';

import {StyleSheet, View, Text, Button} from 'react-native';
import {
  live_streaming_app_id,
  live_streaming_app_sign,
} from '../config/constants';
import ZegoExpressEngine, {
  ZegoTextureView,
  ZegoMixerTask,
  ZegoAudioConfig,
  ZegoAudioConfigPreset,
  ZegoMixerInputContentType,
  ZegoScenario,
} from 'zego-express-engine-reactnative';

const granted =
  Platform.OS === 'android'
    ? PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      )
    : undefined;

export default function AudiencePage(props) {
  const {route} = props;
  const {params} = route;
  const {userID, userName, liveID} = params;

  const localViewRef = useRef(null);

  useEffect(() => {
    console.log('componentDidMount');
    let profile = {
      appID: live_streaming_app_id,
      appSign: live_streaming_app_sign,
      scenario: ZegoScenario.General,
    };
    ZegoExpressEngine.createEngineWithProfile(profile).then(engine => {
      // Dynamically request device permissions (Android)
      if (Platform.OS === 'android') {
        granted
          .then(data => {
            console.log(
              'Whether camera and microphone permissions are granted: ' + data,
            );
            if (!data) {
              const permissions = [
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                PermissionsAndroid.PERMISSIONS.CAMERA,
              ];
              // Returns an object
              PermissionsAndroid.requestMultiple(permissions);
            }
          })
          .catch(err => {
            console.log('Permission check error: ' + err.toString());
          });
      }
      engine.getVersion().then(ver => {
        console.log('Express SDK Version: ' + ver);
      });
      const localViewTag = localViewRef.current;
      if (localViewTag != null) {
        start_preview(localViewTag);
      }
    });
    return () => {
      console.log('componentWillUnmount');
      if (ZegoExpressEngine.instance()) {
        console.log('[LZP] destroyEngine');
        ZegoExpressEngine.destroyEngine();
      }
    };
  }, []);

  const start_preview = async (localViewTag) => {
    await ZegoExpressEngine.instance().startPreview({
      reactTag: localViewTag,
      viewMode: 0,
      backgroundColor: 0,
    });
  };

  const on_start = async () => {
    ZegoExpressEngine.instance().on(
      'roomStateUpdate',
      (roomID, state, errorCode, extendedData) => {
        console.log(
          'JS onRoomStateUpdate: ' +
            state +
            ' roomID: ' +
            roomID +
            ' err: ' +
            errorCode +
            ' extendData: ' +
            extendedData,
        );
      },
    );

    ZegoExpressEngine.instance().on(
      'IMRecvBroadcastMessage',
      (roomID, messageList) => {
        console.log(
          'JS onIMRecvBroadcastMessage: ' +
            ' roomID: ' +
            roomID +
            ' messageList: ' +
            messageList,
        );
        for (let msg of messageList) {
          console.log(
            'current broadcast msg: message: ' +
              msg.message +
              ' messageID' +
              msg.messageID +
              ' sendTime: ' +
              msg.sendTime +
              ' from user :' +
              msg.fromUser.userID +
              ' x ' +
              msg.fromUser.userName,
          ); // "0", "1", "2",
        }
      },
    );

    ZegoExpressEngine.instance().on(
      'IMRecvBarrageMessage',
      (roomID, messageList) => {
        console.log('JS onIMRecvBarrageMessage: ' + ' roomID: ' + roomID);
        for (let msg of messageList) {
          console.log(
            'current barrage msg: message: ' +
              msg.message +
              ' messageID' +
              msg.messageID +
              ' sendTime: ' +
              msg.sendTime +
              ' from user :' +
              msg.fromUser.userID +
              ' x ' +
              msg.fromUser.userName,
          ); // "0", "1", "2",
        }
      },
    );

    ZegoExpressEngine.instance().on(
      'IMRecvCustomCommand',
      (roomID, fromUser, command) => {
        console.log(
          'JS onIMRecvCustomCommand: ' +
            ' roomID: ' +
            roomID +
            ' from user: ' +
            fromUser.userID +
            ' x ' +
            fromUser.userName +
            ' command: ' +
            command,
        );
      },
    );

    ZegoExpressEngine.instance().on(
      'publisherStateUpdate',
      (streamID, state, errorCode, extendedData) => {
        console.log(
          'JS onPublisherStateUpdate: ' +
            state +
            ' streamID: ' +
            streamID +
            ' err: ' +
            errorCode +
            ' extendData: ' +
            extendedData,
        );
      },
    );

    ZegoExpressEngine.instance().on(
      'playerStateUpdate',
      (streamID, state, errorCode, extendedData) => {
        console.log(
          'JS onPlayerStateUpdate: ' +
            state +
            ' streamID: ' +
            streamID +
            ' err: ' +
            errorCode +
            ' extendData: ' +
            extendedData,
        );
      },
    );

    ZegoExpressEngine.instance().on('mixerSoundLevelUpdate', soundLevels => {
      /*soundLevels.array.forEach(element => {
        console.log("JS onMixerSoundLevelUpdate: " + element)
      });*/
      var level = soundLevels[0];

      console.log(
        'JS onMixerSoundLevelUpdate: ' +
          soundLevels[0] +
          ' type of: ' +
          typeof level,
      );
    });

    ZegoExpressEngine.instance().on(
      'mixerRelayCDNStateUpdate',
      (taskID, infoList) => {
        console.log('JS onMixerRelayCDNStateUpdate: ' + taskID);
        infoList.forEach(item => {
          console.log(
            'item: ' +
              item.url +
              ' ,state: ' +
              item.state +
              ' ,reason: ' +
              item.updateReason,
            ' ,time: ' + item.stateTime,
          );
        });
      },
    );

    await ZegoExpressEngine.instance().loginRoom('9999', {
      userID: userID,
      userName: 'zego',
    });

    await ZegoExpressEngine.instance().startPreview({
      reactTag: localViewRef.current,
      viewMode: 0,
      backgroundColor: 0,
    });

    await ZegoExpressEngine.instance().startPublishingStream('333');

    // ZegoExpressEngine.instance().startPlayingStream('333', {
    //   reactTag: findNodeHandle(this.refs.zego_play_view),
    //   viewMode: 0,
    //   backgroundColor: 0,
    // });
  };

  return (
    <View style={styles.container}>
      <View style={{height: 200}}>
        <ZegoTextureView ref={localViewRef} />
      </View>
      <TouchableOpacity>
        <Text>Start</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
  },
  avView: {
    flex: 1,
    width: '100%',
    height: '100%',
    zIndex: 1,
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: 'red',
  },
  ctrlBar: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 50,
    width: '100%',
    height: 50,
    zIndex: 2,
  },
  ctrlBtn: {
    flex: 1,
    width: 48,
    height: 48,
    marginLeft: 37 / 2,
    position: 'absolute',
  },
});
