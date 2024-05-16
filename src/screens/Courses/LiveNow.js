import {
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  Text,
  View,
  findNodeHandle,
} from 'react-native';
import React, {Component} from 'react';
import ZegoExpressEngine, {
  ZegoTextureView,
  ZegoMixerTask,
  ZegoAudioConfig,
  ZegoAudioConfigPreset,
  ZegoMixerInputContentType,
  ZegoScenario,
  ZegoVideoSourceType,
  ZegoPublishChannel,
} from 'zego-express-engine-reactnative';

import Orientation, {OrientationLocker} from 'react-native-orientation-locker';
import {
  live_streaming_app_id,
  live_streaming_app_sign,
} from '../../config/constants';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../config/Screen';
import MyStatusBar from '../../components/MyStatusBar';
import Footer from '../../components/LiveClass/Footer';
import Header from '../../components/LiveClass/Header';
import {Colors} from '../../assets/style';
import * as Actions from '../../redux/actions/LiveClassActions';
import {connect} from 'react-redux';
import Comments from '../../components/LiveClass/Comments';
import RightSidebar from '../../components/LiveClass/RightSidebar';

const granted =
  Platform.OS == 'android'
    ? PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.RECORD_AUDIO,
      )
    : undefined;

export class LiveNow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      liveID: this.props.route.params.liveID,
      userID: this.props.route.params.userID,
      userName: this.props.route.params.userName,
      muted: false,
      isScreenSharing: false,
      activeOrientation: 'PORTRAIT',
      commentsVisible: false,
    };
  }

  componentDidMount() {
    let profile = {
      appID: live_streaming_app_id,
      appSign: live_streaming_app_sign,
      scenario: ZegoScenario.General,
    };

    ZegoExpressEngine.createEngineWithProfile(profile).then(engine => {
      // 动态获取设备权限（android）
      if (Platform.OS == 'android') {
        granted
          .then(data => {
            console.log(
              'Do you already have camera and microphone permissions?: ' + data,
            );
            if (!data) {
              const permissions = [
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                PermissionsAndroid.PERMISSIONS.CAMERA,
              ];
              //返回得是对象类型
              PermissionsAndroid.requestMultiple(permissions);
            }
          })
          .catch(err => {
            console.log('check err: ' + err.toString());
          });
      }

      engine.getVersion().then(ver => {
        console.log('Express SDK Version: ' + ver);
      });

      this.onStartLive();
    });
  }

  componentDidUpdate() {}

  componentWillUnmount() {
    this.props.dispatch(Actions.setLiveClassComments([]))
    if (ZegoExpressEngine.instance()) {
      console.log('[LZP] destroyEngine');
      ZegoExpressEngine.instance().logoutRoom();
      ZegoExpressEngine.destroyEngine();
    }
  }

  onStartLive = () => {
    ZegoExpressEngine.instance().on(
      'roomOnlineUserCountUpdate',
      (roomID, data) => {},
    );

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
        let new_comments = this.props.commentsData;
        new_comments.push({
          message: messageList[0].message,
          sendTime: messageList[0].sendTime,
          fromUser: {
            userID: messageList[0].fromUser.userID,
            userName: messageList[0].fromUser.userName,
          },
        });
        this.props.dispatch(Actions.setLiveClassComments(new_comments));
      },
    );

    ZegoExpressEngine.instance().on(
      'IMRecvBarrageMessage',
      (roomID, messageList) => {
        
      },
    );

    ZegoExpressEngine.instance().on(
      'IMRecvCustomCommand',
      (roomID, fromUser, command) => {
        let my_command = JSON.parse(command);
        this.onRecieveCommand(my_command?.command, my_command)
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

    ZegoExpressEngine.instance().loginRoom(this.state.liveID, {
      userID: this.state.userID,
      userName: this.state.userName,
    });

    ZegoExpressEngine.instance().startPlayingStream(this.state.liveID, {
      reactTag: findNodeHandle(this.refs.zego_play_view),
      viewMode: 1,
      backgroundColor: 0,
    });
  };

  onRecieveCommand = (type, data)=>{
    switch(type){
      case 'end_host':{
        this.callEnd()
        break;
      }
      default:{
        console.log('null')
      }
    }
  }

  micHandle = () => {
    if (this.state.muted) {
      this.updateState({muted: false});
    } else {
      this.updateState({muted: true});
    }
  };

  startScreenShare = () => {
    ZegoExpressEngine.instance().setVideoSource(
      ZegoVideoSourceType.ScreenCapture,
      ZegoPublishChannel.Third,
    );
    ZegoExpressEngine.instance().startScreenCapture({});
    ZegoExpressEngine.instance().startPublishingStream(
      this.state.liveID,
      ZegoPublishChannel.Third,
    );
  };

  stopScreenShare = () => {
    ZegoExpressEngine.instance().startPublishingStream(this.state.liveID);
  };

  rotateScreen = () => {
    if (this.state.activeOrientation == 'LANDSCAPE') {
      this.updateState({activeOrientation: 'PORTRAIT'});
      Orientation.lockToPortrait();
    } else {
      this.updateState({activeOrientation: 'LANDSCAPE'});
      Orientation.lockToLandscape();
    }
  };

  cameraFrontChange = () => {
    ZegoExpressEngine.instance().useFrontCamera(true);
    console.log('sdfsfd');
  };

  cameraBackChange = () => {
    ZegoExpressEngine.instance().useFrontCamera(false);
  };

  speeckerHandle = () => {};

  callEnd = () => {
    this.props.navigation.goBack();
  };

  sendMessage = message => {
    ZegoExpressEngine.instance()
      .sendBroadcastMessage(this.state.liveID, message)
      .then(result => {
        let new_comments = this.props.commentsData;
        new_comments.push({
          message: message,
          sendTime: new Date().getTime(),
          fromUser: {
            userID: this.state.userID,
            userName: this.state.userName,
          },
        });
        this.props.dispatch(Actions.setLiveClassComments(new_comments));
      });
  };

  updateState = data => {
    this.setState(prevState => {
      const newData = {...prevState, ...data};
      return newData;
    });
  };

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.black}}>
        <MyStatusBar
          backgroundColor={
            this.state.activeOrientation != 'PORTRAIT'
              ? 'transparent'
              : Colors.black
          }
          barStyle={'light-content'}
          translucent={this.state.activeOrientation != 'PORTRAIT'}
        />
        <OrientationLocker
          orientation={this.state.activeOrientation}
          onChange={orientation => console.log('onChange', orientation)}
          onDeviceChange={orientation =>
            console.log('onDeviceChange', orientation)
          }
        />
        <View
          style={{
            flex: 1,
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT,
            alignSelf: 'center',
          }}>
          <ZegoTextureView
            ref="zego_play_view"
            style={{
              flex: 1,
              width: SCREEN_WIDTH,
              alignSelf: 'center',
            }}
            resizeMode="cover"
          />
          <View
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              right: 0,
              left: 0,
              justifyContent: 'space-between',
            }}>
            <Header
              rotateScreen={this.rotateScreen}
              cameraBackChange={this.cameraBackChange}
              cameraFrontChange={this.cameraFrontChange}
            />
            <RightSidebar updateState={this.updateState} />
            <Footer
              muted={this.state.muted}
              updateState={this.updateState}
              micHandle={this.micHandle}
              startScreenShare={this.startScreenShare}
              stopScreenShare={this.stopScreenShare}
              callEnd={this.callEnd}
            />
          </View>
          <Comments
            sendMessage={this.sendMessage}
            commentsVisible={this.state.commentsVisible}
            updateState={this.updateState}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  commentsData: state.liveClass.commentsData,
  commentsLength: state.liveClass.commentsLength,
});

const mapDispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, mapDispatchToProps)(LiveNow);
