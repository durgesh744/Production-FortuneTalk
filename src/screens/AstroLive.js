import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Alert,
  Button,
  Text,
  StatusBar,
  findNodeHandle,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import React, {Component} from 'react';
import ZegoExpressEngine, {
  ZegoTextureView,
  ZegoMixerTask,
  ZegoAudioConfig,
  ZegoAudioConfigPreset,
  ZegoMixerInputContentType,
  ZegoScenario,
} from 'zego-express-engine-reactnative';
import Footer from '../components/AstroLive/Footer';
import GiftCall from '../components/AstroLive/GiftCall';
import Chats from '../components/AstroLive/Chats';
import RecievedGifts from '../components/AstroLive/RecievedGifts';
import Timer from '../components/AstroLive/Timer';
import Header from '../components/AstroLive/Header';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../config/Screen';
import {Colors, Sizes} from '../assets/style';
import MyStatusBar from '../components/MyStatusBar';
import {
  live_streaming_app_id,
  live_streaming_app_sign,
} from '../config/constants';
import CallRequests from '../components/AstroLive/CallRequests';

const granted =
  Platform.OS == 'android'
    ? PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.RECORD_AUDIO,
      )
    : undefined;

export class AstroLive extends Component {
  constructor(props) {
    super(props);
    this.version = '';
    this.state = {
      userID: this.props.route.params.userID,
      comments: [],
      giftsData: [],
      isCoHosting: false,
      viewMode: 0,
      vedioRequests: [],
      callRequestVisible: false,
      coHostStreamId: null,
    };
    console.log(this.props.route.params);
  }

  componentDidMount() {
    console.log('componentDidMount');
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

      this.onClickA();
    });
  }

  componentDidUpdate(prevProps, prevState) {
    // Check your condition based on state updates
    if (this.state.isCoHosting) {
      ZegoExpressEngine.instance().startPlayingStream('333', {
        reactTag: findNodeHandle(this.refs.zego_play_view),
        viewMode: 0,
        backgroundColor: 0,
      });
    }
  }

  componentWillUnmount() {
    console.log('componentWillUnmount');
    //ZegoExpressEngine.instance().off('RoomStateUpdate');
    if (ZegoExpressEngine.instance()) {
      console.log('[LZP] destroyEngine');
      ZegoExpressEngine.destroyEngine();
    }
  }

  onClickA() {
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
        let new_comments = this.state.comments;
        new_comments.push({
          message: messageList[0].message,
          sendTime: messageList[0].sendTime,
          fromUser: {
            userID: messageList[0].fromUser.userID,
            userName: messageList[0].fromUser.userID,
          },
        });
        this.setState({comments: new_comments});
      },
    );

    ZegoExpressEngine.instance().on(
      'IMRecvBarrageMessage',
      (roomID, messageList) => {
        let new_gifts = this.state.giftsData;
        new_gifts.push({
          message: JSON.parse(messageList[0].message),
          messageID: messageList[0].messageID,
          sendTime: messageList[0].sendTime,
          fromUser: {
            userID: messageList[0].fromUser.userID,
            userName: messageList[0].fromUser.userID,
          },
        });
        this.setState({giftsData: new_gifts});
      },
    );

    ZegoExpressEngine.instance().on(
      'IMRecvCustomCommand',
      (roomID, fromUser, command) => {
        if (command == 'vedio_host') {
          let new_vedio_request = this.state.vedioRequests;
          new_vedio_request.push({
            id: this.state.vedioRequests.length,
            fromUser: {
              userID: fromUser.userID,
              userName: fromUser.userName,
            },
          });
          this.setState({vedioRequests: new_vedio_request});
        } else if (JSON.parse(command)?.command == 'start_co_host') {
          console.log('sfsfsfsf')
          this.updateState({
            isCoHosting: true,
            coHostStreamId: JSON.parse(command)?.streamID,
          });
          // this.playStreaming(JSON.parse(command)?.streamID);
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
        }
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

    // ZegoExpressEngine.instance().on('mixerSoundLevelUpdate', soundLevels => {
    //   /*soundLevels.array.forEach(element => {
    //         console.log("JS onMixerSoundLevelUpdate: " + element)
    //       });*/
    //   var level = soundLevels[0];

    //   console.log(
    //     'JS onMixerSoundLevelUpdate: ' +
    //       soundLevels[0] +
    //       ' type of: ' +
    //       typeof level,
    //   );
    // });

    // ZegoExpressEngine.instance().on(
    //   'mixerRelayCDNStateUpdate',
    //   (taskID, infoList) => {
    //     console.log('JS onMixerRelayCDNStateUpdate: ' + taskID);
    //     infoList.forEach(item => {
    //       console.log(
    //         'item: ' +
    //           item.url +
    //           ' ,state: ' +
    //           item.state +
    //           ' ,reason: ' +
    //           item.updateReason,
    //         ' ,time: ' + item.stateTime,
    //       );
    //     });
    //   },
    // );

    ZegoExpressEngine.instance().loginRoom('12345', {
      userID: this.state.userID,
      userName: 'zego',
    });

    ZegoExpressEngine.instance().startPreview({
      reactTag: findNodeHandle(this.refs.zego_preview_view),
      viewMode: 0,
      backgroundColor: 0,
    });

    ZegoExpressEngine.instance().startPublishingStream('12345');

    // ZegoExpressEngine.instance().startPlayingStream('12345', {
    //   reactTag: findNodeHandle(this.refs.zego_play_view),
    //   viewMode: 1,
    //   backgroundColor: 0,
    // });
  }

  playStreaming = streamID => {
    // ZegoExpressEngine.instance().startPlayingStream(streamID, {
    //   reactTag: findNodeHandle(this.refs.zego_play_view),
    //   viewMode: 1,
    //   backgroundColor: 0,
    // });
  };

  acceptHost = user_id => {
    try {
      ZegoExpressEngine.instance().sendCustomCommand('12345', 'accept_vedio', [
        {userID: user_id},
      ]);
      this.updateState({callRequestVisible: false});
    } catch (e) {
      console.log(e);
    }
  };

  sendMessage = message => {
    ZegoExpressEngine.instance()
      .sendBroadcastMessage('12345', message)
      .then(result => {
        let new_comments = this.state.comments;
        new_comments.push({
          message: message,
          sendTime: new Date().getTime(),
          fromUser: {
            userID: '12',
            userName: 'Ranjeet',
          },
        });
        this.setState({comments: new_comments});
      });
  };

  updateState = data => {
    this.setState(prevData => {
      const newData = {...prevData, ...data};
      return newData;
    });
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <MyStatusBar
          backgroundColor={Colors.gray2}
          barStyle={'light-content'}
        />
        <View style={{width: SCREEN_WIDTH, height: SCREEN_HEIGHT}}>
          {this.state.isCoHosting ? (
            <>
              <View
                style={{
                  height: SCREEN_HEIGHT / 2,
                  // width: SCREEN_WIDTH * 3,
                  // alignSelf: 'center',
                }}>
                <ZegoTextureView
                  ref="zego_preview_view"
                  style={{
                    flex: 1,
                    width: SCREEN_WIDTH * 1,
                    alignSelf: 'center',
                  }}
                  resizeMode="cover"
                />
              </View>
              <View style={{height: SCREEN_HEIGHT / 2}}>
                <ZegoTextureView
                  ref="zego_play_view"
                  style={{
                    flex: 1,
                    width: SCREEN_WIDTH,
                    alignSelf: 'center',
                  }}
                  resizeMode="cover"
                />
              </View>
            </>
          ) : (
            <ZegoTextureView
              ref="zego_preview_view"
              style={{flex: 1, width: SCREEN_WIDTH * 1.2, alignSelf: 'center'}}
              resizeMode="cover"
            />
          )}

          <View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              top: 0,
            }}>
            <View style={{flex: 1}}>
              <View style={{flex: 1}}>
                <Header />
                <Timer />
              </View>
              <View style={{flex: 0}}>
                <View
                  style={{
                    height: SCREEN_HEIGHT * 0.12,
                    marginHorizontal: Sizes.fixPadding,
                    marginBottom: Sizes.fixPadding,
                  }}>
                  <RecievedGifts giftsData={this.state.giftsData} />
                </View>
                <View
                  style={{
                    height: SCREEN_HEIGHT * 0.25,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginHorizontal: Sizes.fixPadding,
                  }}>
                  <Chats comments={this.state.comments} />
                  <GiftCall
                    updateState={this.updateState}
                    totalRequests={this.state.vedioRequests.length}
                  />
                </View>
              </View>
            </View>
            <Footer sendMessage={this.sendMessage} />
          </View>
        </View>
        <CallRequests
          callRequestVisible={this.state.callRequestVisible}
          updateState={this.updateState}
          vedioRequests={this.state.vedioRequests}
          acceptHost={this.acceptHost}
        />
      </View>
    );
  }
}

export default AstroLive;
