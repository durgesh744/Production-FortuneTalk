import {
  View,
  Alert,
  StatusBar,
  findNodeHandle,
  PermissionsAndroid,
  Platform,
  BackHandler,
  SafeAreaView,
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
import {
  api2_get_profile,
  api_checkfollowing,
  api_follow,
  api_url,
  deductWallet_live_astro,
  get_gifts,
  live_streaming_app_id,
  live_streaming_app_sign,
  sendgift,
} from '../config/constants';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../config/Screen';
import {Colors, Fonts, Sizes} from '../assets/style';
import Footer from '../components/Live/Footer';
import GiftCall from '../components/Live/GiftCall';
import Chats from '../components/Live/Chats';
import RecievedGifts from '../components/Live/RecievedGifts';
import Header from '../components/Live/Header';
import Connecting from '../components/Live/Connecting';
import Gifts from '../components/Live/Gifts';
import {connect} from 'react-redux';
import axios from 'axios';
import Loader from '../components/Loader';
import {showToastWithGravityAndOffset} from '../methods/toastMessage';
import CoHostModal from '../components/Live/CoHostModal';
import StartVedio from '../components/Live/StartVedio';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {TouchableOpacity} from 'react-native';
import WaitListModal from '../components/Live/WaitListModal';
import database from '@react-native-firebase/database';
import WaitListInfo from '../components/Live/WaitListInfo';
import {ApiRequest} from '../config/api_requests';
import moment from 'moment';
import * as UserActions from '../redux/actions/UserActions';
import NewGift from '../components/Live/NewGift';
import AstroRating from '../components/Live/AstroRating';
import ExitAlert from '../components/Live/ExitAlert';

let heartCount = 1;

let giftInterval;

function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomColor() {
  // Adjusted RGB values for pinkish tones
  return `rgb(${getRandomNumber(220, 255)}, ${getRandomNumber(
    50,
    100,
  )}, ${getRandomNumber(50, 100)})`;
}

const granted =
  Platform.OS == 'android'
    ? PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.RECORD_AUDIO,
      )
    : undefined;

export class GoLive extends Component {
  constructor(props) {
    super(props);
    this.version = '';
    this.state = {
      userID: this.props.route.params.userID,
      userName: this.props.route.params.userName,
      liveID: this.props.route.params.liveID,
      astroData: this.props.route.params.astroData,
      myStreamId: null, 
      coHostedData: null,
      hostType: 'vedio',
      waitListData: [],
      waitListVisible: false,
      orginalWaitListData: null,
      isWaited: false,
      conected: true,
      giftVisible: false,
      comments: [],
      giftsData: [],
      isLoading: false,
      giftData: [],
      callModalVisible: false,
      startVedioVisible: false,
      isCoHosting: false,
      coHostStreamId: null,
      totalUser: 0,
      isTimerStart: false,
      vedioStartedTime: null,
      time: 30,
      isFollow: null,
      hearts: [],
      timeValue: 2000,
      newGiftVisible: false,
      newGiftData: null,
      reviewVisible: false,
      exitVisible: false,
    };
  }

  componentDidMount() {
    let profile = {
      appID: live_streaming_app_id,
      appSign: live_streaming_app_sign,
      scenario: ZegoScenario.General,
    };
    database().ref(`WaitList/${this.state.astroData?.astro_id}`).off();
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
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
      this.check_follow_status();
    });
  }

  componentDidUpdate(prevProps, prevState) {
    // Check your condition based on state updates
    if (this.state.isCoHosting) {
      if (this.state.hostType == 'audio') {
        ZegoExpressEngine.instance().startPlayingStream(this.state.liveID, {
          reactTag: findNodeHandle(this.refs.zego_play_view),
          viewMode: 1,
          backgroundColor: 0,
        });
        ZegoExpressEngine.instance().startPublishingStream(
          this.state.myStreamId,
        );
        ZegoExpressEngine.instance().mutePublishStreamVideo(true);
      } else {
        ZegoExpressEngine.instance().startPreview({
          reactTag: findNodeHandle(this.refs.zego_preview_view),
          viewMode: 1,
          backgroundColor: 0,
        });
        ZegoExpressEngine.instance().startPublishingStream(
          this.state.myStreamId,
        );
        ZegoExpressEngine.instance().startPlayingStream(this.state.liveID, {
          reactTag: findNodeHandle(this.refs.zego_play_view),
          viewMode: 1,
          backgroundColor: 0,
        });
      }
    } else if (this.state.coHostedData) {
      if (this.state.coHostedData?.type == 'audio') {
        ZegoExpressEngine.instance().startPlayingStream(
          this.state.coHostedData?.streamID,
        );
        ZegoExpressEngine.instance().startPlayingStream(this.state.liveID, {
          reactTag: findNodeHandle(this.refs.zego_play_view),
          viewMode: 0,
          backgroundColor: 0,
        });
      } else {
        ZegoExpressEngine.instance().startPlayingStream(this.state.liveID, {
          reactTag: findNodeHandle(this.refs.zego_play_view_a),
          viewMode: 1,
          backgroundColor: 0,
        });
        ZegoExpressEngine.instance().startPlayingStream(
          this.state.coHostedData?.streamID,
          {
            reactTag: findNodeHandle(this.refs.zego_play_view_b),
            viewMode: 1,
            backgroundColor: 0,
          },
        );
      }
    } else {
      ZegoExpressEngine.instance().startPlayingStream(this.state.liveID, {
        reactTag: findNodeHandle(this.refs.zego_play_view),
        viewMode: 0,
        backgroundColor: 0,
      });
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    if (ZegoExpressEngine.instance()) {
      ZegoExpressEngine.instance().logoutRoom();
      ZegoExpressEngine.destroyEngine();
    }
  }

  onClickA() {
    ZegoExpressEngine.instance().on(
      'roomOnlineUserCountUpdate',
      (roomID, data) => {
        this.updateState({totalUser: data});
      },
    );

    ZegoExpressEngine.instance().on(
      'roomStateUpdate',
      (roomID, state, errorCode, extendedData) => {
        // console.log('roomID', roomID)
        // console.log('state',state)
        // console.log('errorCode', errorCode)
        // console.log('extendedData', extendedData)
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
            userName: messageList[0].fromUser.userName,
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
            userName: messageList[0].fromUser.userName,
          },
        });
        this.updateState({giftsData: new_gifts});
        clearTimeout(giftInterval);
        this.updateState({
          newGiftVisible: true,
          newGiftData: {imageUrl: JSON.parse(messageList[0].message)?.icon},
        });
        giftInterval = setTimeout(() => {
          this.updateState({newGiftVisible: false, newGiftData: null});
        }, 3000);
      },
    );

    ZegoExpressEngine.instance().on(
      'IMRecvCustomCommand',
      (roomID, fromUser, command) => {
        let my_command = JSON.parse(command);
        if (my_command?.command == 'accept_call') {
          this.updateState({
            startVedioVisible: true,
            hostType: my_command?.type,
          });
        } else if (my_command?.command == 'start_co_host') {
          console.log(my_command);
          this.updateState({
            coHostedData: {
              ...fromUser,
              streamID: my_command?.streamID,
              time: my_command?.time,
              type: my_command?.type,
            },
            timeValue: my_command?.time,
            isTimerStart: true,
          });
        } else if (my_command?.command == 'stop_host') {
          ZegoExpressEngine.instance().stopPublishingStream();
          if (this.state.isCoHosting) {
            this.customer_profile();
          }
          this.updateState({
            isCoHosting: false,
            coHostedData: null,
            isTimerStart: false,
          });
        } else if (my_command?.command == 'heart') {
          this.addHeart();
        } else if (my_command?.command == 'end_host') {
          showToastWithGravityAndOffset('Astrologer ending the streaming.');
          this.updateState({reviewVisible: true});
        }
      },
    );

    ZegoExpressEngine.instance().on(
      'roomStreamUpdate',
      (roomID, reason, errorCode, extendedData) => {
        console.log(roomID)
        console.log('reason',reason)
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


    ZegoExpressEngine.instance().on('mixerSoundLevelUpdate', soundLevels => {
      /*soundLevels.array.forEach(element => {
        console.log("JS onMixerSoundLevelUpdate: " + element)
      });*/
      var level = soundLevels[0];
    });

    ZegoExpressEngine.instance().on(
      'roomStreamUpdate',
      (roomID, updateType, streamList) => {
        if (
          streamList.filter(
            item => item.user.userID == this.state.astroData?.astro_id,
          ) &&
          updateType != 1
        ) {
          this.updateState({conected: false});
        } else {
          // this.updateState({conected: true});
        }
      },
    );

    ZegoExpressEngine.instance().loginRoom(this.state.liveID, {
      userID: this.state.userID,
      userName: this.state.userName,
    });

    ZegoExpressEngine.instance().startPlayingStream(this.state.liveID, {
      reactTag: findNodeHandle(this.refs.zego_play_view),
      viewMode: 0,
      backgroundColor: 0,
    });

    database()
      .ref(`LiveStreaming/${this.state.liveID}`)
      .once('value', snapshot => {
        if (snapshot?.val()) {
          if (snapshot.val()?.streamID.length != 0) {
            this.updateState({
              coHostedData: {
                ...snapshot.val()?.fromUser,
                streamID: snapshot.val()?.streamID,
                time: snapshot.val()?.time,
                type: snapshot.val()?.type,
              },
              timeValue: snapshot.val()?.time,
              isTimerStart: true,
            });
          }
        }
      });

    database()
      .ref(`WaitList/${this.state.astroData?.astro_id}`)
      .on('value', snapshot => {
        if (snapshot.val()) {
          const myDataObject = snapshot.val();
          if (myDataObject) {
            const myDataArray = Object.keys(myDataObject)
              .sort()
              .map(key => myDataObject[key]);
            this.updateState({
              waitListData: myDataArray.reverse(),
              orginalWaitListData: snapshot.val(),
            });
          }
        } else {
          this.updateState({waitListData: []});
        }
      });
  }

  create_own_stream_id = () => {
    const charset =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 12; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      code += charset.charAt(randomIndex);
    }
    this.updateState({myStreamId: code.toUpperCase()});
  };

  send_request_for_vedio_call = () => {
    try {
      this.create_own_stream_id();
      if (
        this.state.waitListData.filter(item => item.userID == this.state.userID)
          .length != 0
      ) {
        showToastWithGravityAndOffset('You already in waitlist');
      } else {
        const node = database()
          .ref(`WaitList/${this.state.astroData?.astro_id}`)
          .push();
        database()
          .ref(`WaitList/${this.state.astroData?.astro_id}/${node.key}`)
          .set({
            userID: this.state.userID,
            userName: this.state.userName,
            wallet: this.props.wallet,
            time: this.getCallDuration('vedio'),
            type: 'vedio',
          });
        this.updateState({callModalVisible: false});
      }
    } catch (e) {
      console.log(e);
    }
  };

  send_request_for_audio_call = () => {
    try {
      if (
        this.state.waitListData.filter(item => item.userID == this.state.userID)
          .length != 0
      ) {
        showToastWithGravityAndOffset('You already in waitlist');
      } else {
        this.create_own_stream_id();
        const node = database()
          .ref(`WaitList/${this.state.astroData?.astro_id}`)
          .push();
        database()
          .ref(`WaitList/${this.state.astroData?.astro_id}/${node.key}`)
          .set({
            userID: this.state.userID,
            userName: this.state.userName,
            wallet: this.props.wallet,
            time: this.getCallDuration('audio'),
            type: 'audio',
          });
        this.updateState({callModalVisible: false});
      }
    } catch (e) {
      console.log(e);
    }
  };

  send_heart = () => {
    ZegoExpressEngine.instance().sendCustomCommand(
      this.state.liveID,
      JSON.stringify({command: 'heart'}),
    );
    this.addHeart();
  };

  get_astrologer_gifts = async () => {
    this.updateState({isLoading: true});
    await axios({
      method: 'post',
      url: api_url + get_gifts,
    })
      .then(res => {
        this.updateState({isLoading: false});
        if (res.data.status == 1) {
          this.updateState({giftData: res.data.records, giftVisible: true});
        }
      })
      .catch(err => {
        console.log(err);
        this.updateState({isLoading: false});
      });
  };

  send_gifts = async selecteGifts => {
    this.updateState({isLoading: true});
    await axios({
      method: 'post',
      url: api_url + sendgift,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        user_id: this.props.customerData?.id,
        astro_id: this.state.astroData?.astro_id,
        gift_id: selecteGifts?.gifts_id,
        live_id: this.state.liveID,
      },
    })
      .then(res => {
        if (res.data.status == '1') {
          this.props.dispatch(
            UserActions.setWallet(parseFloat(res.data?.wallet).toFixed(2)),
          );
          this.updateState({isLoading: false, giftVisible: false});
          ZegoExpressEngine.instance()
            .sendBarrageMessage(this.state.liveID, JSON.stringify(selecteGifts))
            .then(result => {
              clearTimeout(giftInterval);
              this.updateState({
                newGiftVisible: true,
                newGiftData: {
                  userName: 'Ranjeet',
                  imageUrl: selecteGifts?.icon,
                },
              });
              giftInterval = setTimeout(() => {
                this.updateState({newGiftVisible: false, newGiftData: null});
              }, 3000);
              showToastWithGravityAndOffset('Gifts sended...');
            });
        }
      })
      .catch(err => {
        this.updateState({isLoading: false});
        console.log(err);
      });
  };

  sendMessage = message => {
    ZegoExpressEngine.instance()
      .sendBroadcastMessage(this.state.liveID, message)
      .then(result => {
        let new_comments = this.state.comments;
        new_comments.push({
          message: message,
          sendTime: new Date().getTime(),
          fromUser: {
            userID: this.state.userID,
            userName: this.state.userName,
          },
        });
        this.setState({comments: new_comments});
      });
  };

  startStreaming = () => {
    this.updateState({
      isCoHosting: true,
      startVedioVisible: false,
      isTimerStart: true,
      timeValue: this.getCallDuration(this.state.hostType),
      vedioStartedTime: new Date().getTime(),
    });

    let command = {
      streamID: this.state.myStreamId,
      command: 'start_co_host',
      time: this.getCallDuration(this.state.hostType),
      type: this.state.hostType,
    };

    ZegoExpressEngine.instance().sendCustomCommand(
      this.state.liveID,
      JSON.stringify(command),
    );

    database()
      .ref(`LiveStreaming/${this.state.liveID}`)
      .update({
        fromUser: {
          userID: this.state.userID,
          userName: this.state.userName,
        },
        streamID: this.state.myStreamId,
        type: this.state.hostType,
        time: this.getCallDuration(this.state.hostType),
      });
  };

  searchValue(data, search) {
    for (const key in data) {
      if (typeof data[key] === 'object') {
        if (data[key].userID === search) {
          return key;
        } else {
          const result = this.searchValue(data[key], search);
          if (result) {
            return result;
          }
        }
      }
    }
    return null;
  }

  stopPublishingStream = () => {
    Alert.alert('Alert', 'Are you sure to end your vedio call?', [
      {text: 'No', style: 'cancel'},
      {
        text: 'Yes',
        style: 'destructive',
        onPress: () => this.on_end_call(),
      },
    ]);
  };

  on_end_call = async () => {
    try {
      const duration =
        (new Date().getTime() - this.state.vedioStartedTime) / 1000;
      console.log({
        astro_id: this.state.astroData?.astro_id,
        user_id: this.props.customerData?.id,
        live_id: this.state.liveID,
        end_time: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        start_time: moment(this.state.vedioStartedTime).format(
          'YYYY-MM-DD HH:mm:ss',
        ),
        duration: duration,
        type: this.state.hostType == 'vedio' ? '6' : '7', //"The Type ( video = 1 , audio = 2 ) field is required."
      });
      const response = await ApiRequest.postRequest({
        url: api_url + deductWallet_live_astro,
        data: {
          astro_id: this.state.astroData?.astro_id,
          user_id: this.props.customerData?.id,
          live_id: this.state.liveID,
          end_time: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
          start_time: moment(this.state.vedioStartedTime).format(
            'YYYY-MM-DD HH:mm:ss',
          ),
          duration: duration,
          type: this.state.hostType == 'vedio' ? '6' : '7', //"The Type ( video = 1 , audio = 2 ) field is required."
        },
      });

      if (response?.status == 200) {
        this.customer_profile();
        ZegoExpressEngine.instance().stopPublishingStream();
        ZegoExpressEngine.instance().sendCustomCommand(
          this.state.liveID,
          JSON.stringify({command: 'stop_host'}),
        );
        let node = this.searchValue(
          this.state.orginalWaitListData,
          this.state.userID,
        );
        database()
          .ref(`WaitList/${this.state.astroData?.astro_id}/${node}`)
          .remove();
        database().ref(`LiveStreaming/${this.state.liveID}`).set({
          streamID: '',
          fromUser: '',
          time: '',
          type: '',
        });
        this.updateState({isCoHosting: false, isTimerStart: false});
      }
    } catch (e) {
      console.log(e);
    }
  };

  customer_profile = async () => {
    let data = new FormData();
    data.append('user_id', this.props.customerData?.id);
    await axios({
      method: 'post',
      url: api_url + api2_get_profile,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: data,
    })
      .then(async res => {
        this.props.dispatch(
          UserActions.setWallet(res.data.user_details[0]?.wallet),
        );
      })
      .catch(err => {
        // updateState({isLoading: false});
        console.log(err);
      });
  };

  getCallDuration = type => {
    if (type == 'audio') {
      const audio_price =
        parseFloat(this.state.astroData?.audio_price) +
        parseFloat(this.state.astroData?.audio_commission);
      const totalTime = parseFloat(
        (parseFloat(this.props.wallet) / audio_price) * 60,
      ).toFixed(0);
      return totalTime;
    }
    const vedio_price =
      parseFloat(this.state.astroData?.video_price) +
      parseFloat(this.state.astroData?.video_commission);
    const totalTime = parseFloat(
      (parseFloat(this.props.wallet) / vedio_price) * 60,
    ).toFixed(0);
    // console.log(totalTime)
    return totalTime;
  };

  check_follow_status = async () => {
    await axios({
      method: 'post',
      url: api_url + api_checkfollowing,
      data: {
        user_id: this.state.userID,
        astro_id: this.state.astroData?.astro_id,
      },
    })
      .then(res => {
        if (res.data?.records != null) {
          this.updateState({isFollow: res.data.records.status});
        } else {
          this.updateState({isFollow: 0});
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  follow_astrologer = async () => {
    this.updateState({isLoading: true});
    await axios({
      method: 'post',
      url: api_url + api_follow,
      data: {
        user_id: this.state.userID,
        astro_id: this.state.astroData?.astro_id,
        status: this.state.isFollow == '1' ? 0 : 1,
      },
    })
      .then(res => {
        this.updateState({isLoading: false});
        this.check_follow_status();
      })
      .catch(err => {
        this.updateState({isLoading: false});
        console.log(err);
      });
  };

  addHeart = () => {
    this.setState(
      {
        hearts: [
          ...this.state.hearts,
          {
            id: heartCount,
            right: getRandomNumber(0, 50),
            color: getRandomColor(),
          },
        ],
      },
      () => {
        heartCount++;
      },
    );
  };

  removeHeart = id => {
    this.setState({
      hearts: this.state.hearts.filter(heart => heart.id != id),
    });
  };

  exit_from_room = () => {
    if (this.searchValue(this.state.orginalWaitListData, this.state.userID)) {
      let node = this.searchValue(
        this.state.orginalWaitListData,
        this.state.userID,
      );
      database()
        .ref(`WaitList/${this.state.astroData?.astro_id}/${node}`)
        .remove();
      this.props.navigation.goBack();
    } else {
      this.props.navigation.goBack();
    }
  };

  handleBackPress = () => {
    this.updateState({exitVisible: true});
    // Alert.alert('Alert', 'Are you sure to end this streaming?', [
    //   {text: 'cancel', style: 'cancel'},
    //   {
    //     text: 'Yes',
    //     style: 'destructive',
    //     onPress: () => this.updateState({reviewVisible: true}),
    //   },
    // ]);
    return true;
  };

  updateState = data => {
    this.setState(prevData => {
      const newData = {...prevData, ...data};
      return newData;
    });
  };

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <StatusBar translucent backgroundColor={'transparent'} />
        <Loader visible={this.state.isLoading} />
        <View
          style={{
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT + StatusBar.currentHeight,
          }}>
          {this.state.isCoHosting && this.state.hostType == 'vedio'
            ? coHostingInfo()
            : this.state.coHostedData != null &&
              this.state.coHostedData?.type == 'vedio'
            ? multiHostedInfo()
            : liveScreenInfo()}
          <View
            style={{
              position: 'absolute',
              height: SCREEN_HEIGHT + StatusBar.currentHeight,
              width: SCREEN_WIDTH,
            }}>
            <View style={{flex: 1}}>
              <View style={{flex: 1}}>
                <Header
                  astroData={this.state.astroData}
                  totalUser={this.state.totalUser}
                  coHostedData={this.state.coHostedData}
                  isCoHosting={this.state.isCoHosting}
                  userName={this.state.userName}
                  isTimerStart={this.state.isTimerStart}
                  followAstrologer={this.follow_astrologer}
                  isFollow={this.state.isFollow}
                  time={this.state.timeValue}
                />
                {this.state.isCoHosting && (
                  <TouchableOpacity
                    // activeOpacity={0.8}
                    onPress={() => this.stopPublishingStream()}
                    style={{
                      width: 40,
                      height: 40,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: Colors.black + '50',

                      borderRadius: 1000,
                    }}>
                    <Ionicons
                      name="close-circle-outline"
                      color={Colors.whiteDark}
                      size={24}
                    />
                  </TouchableOpacity>
                )}
                <WaitListInfo
                  updateState={this.updateState}
                  waitListData={this.state.waitListData}
                />
              </View>
              {this.state.newGiftVisible && (
                <NewGift newGiftData={this.state.newGiftData} />
              )}
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
                    get_astrologer_gifts={this.get_astrologer_gifts}
                    astroData={this.state.astroData}
                  />
                </View>
              </View>
            </View>
            <Footer
              sendMessage={this.sendMessage}
              addHeart={this.send_heart}
              removeHeart={this.removeHeart}
              hearts={this.state.hearts}
            />
          </View>
        </View>

        <Connecting
          connected={this.state.conected}
          navigation={this.props.navigation}
        />
        <Gifts
          giftVisible={this.state.giftVisible}
          customerData={this.props.customerData}
          wallet={this.props.wallet}
          updateState={this.updateState}
          giftData={this.state.giftData}
          send_gifts={this.send_gifts}
        />
        <CoHostModal
          wallet={this.props.wallet}
          callModalVisible={this.state.callModalVisible}
          updateState={this.updateState}
          navigation={this.props.navigation}
          astroData={this.state.astroData}
          send_request_for_audio_call={this.send_request_for_audio_call}
          send_request_for_vedio_call={this.send_request_for_vedio_call}
          waitListData={this.state.waitListData}
        />
        <StartVedio
          startVedioVisible={this.state.startVedioVisible}
          updateState={this.updateState}
          startStreaming={this.startStreaming}
        />
        <WaitListModal
          waitListData={this.state.waitListData}
          waitListVisible={this.state.waitListVisible}
          updateState={this.updateState}
        />
        <AstroRating
          userID={this.state.userID}
          astroID={this.state.astroData?.astro_id}
          onDone={this.exit_from_room}
          updateState={this.updateState}
          reviewVisible={this.state.reviewVisible}
          liveID={this.state.liveID}
          astroData={this.state.astroData}
        />
        <ExitAlert
          updateState={this.updateState}
          exitVisible={this.state.exitVisible}
        />
      </SafeAreaView>
    );

    function multiHostedInfo() {
      return (
        <>
          <View
            style={{
              height: SCREEN_HEIGHT / 2,
            }}>
            <ZegoTextureView
              ref="zego_play_view_a"
              style={{
                flex: 1,
                width: SCREEN_WIDTH,
                alignSelf: 'center',
              }}
              resizeMode="cover"
            />
          </View>
          <View style={{height: SCREEN_HEIGHT / 2 + StatusBar.currentHeight}}>
            <ZegoTextureView
              ref="zego_play_view_b"
              style={{
                flex: 1,
                width: SCREEN_WIDTH * 1,
                alignSelf: 'center',
              }}
              resizeMode="cover"
            />
          </View>
        </>
      );
    }

    function coHostingInfo() {
      return (
        <>
          <View
            style={{
              height: SCREEN_HEIGHT / 2,
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
          </View>
          <View style={{height: SCREEN_HEIGHT / 2 + StatusBar.currentHeight}}>
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
        </>
      );
    }

    function liveScreenInfo() {
      return (
        <ZegoTextureView
          ref="zego_play_view"
          style={{flex: 1, width: SCREEN_WIDTH * 1.2, alignSelf: 'center'}}
          resizeMode="cover"
        />
      );
    }
  }
}

const mapStateToProps = state => ({
  customerData: state.user.userData,
  wallet: state.user.wallet,
});

const mapDispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, mapDispatchToProps)(GoLive);
