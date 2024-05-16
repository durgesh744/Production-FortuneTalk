import {
  View,
  Text,
  ImageBackground,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {Sizes, Colors, Fonts} from '../assets/style';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import {SCREEN_HEIGHT} from '../config/Screen';
import MyStatusBar from '../components/MyStatusBar';
import {
  api_astrodetails,
  api_url,
  base_url,
  img_url_2,
} from '../config/constants';
import database from '@react-native-firebase/database';
import axios from 'axios';
import {CommonActions} from '@react-navigation/native';
import {connect} from 'react-redux';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ChatActions from '../redux/actions/ChatActions';

var Sound = require('react-native-sound');
var whoosh = new Sound('chat_request.mp3', Sound.MAIN_BUNDLE, error => {
  if (error) {
    console.log('failed to load the sound', error);
    return;
  }
});

const {width, height} = Dimensions.get('screen');
const AcceptChat = ({navigation, route, customerData, dispatch}) => {
  useEffect(() => {
    whoosh.play(success => {
      if (success) {
        console.log('successfully finished playing');
      } else {
        console.log('playback failed due to audio decoding errors');
      }
    });
    whoosh.setNumberOfLoops(-1);
  }, []);

  const accept_request = async () => {
    whoosh.stop();
    await axios({
      method: 'post',
      url: api_url + api_astrodetails,
      data: {
        id: route.params.astro_id,
        customer_id: customerData?.id
      },
    })
      .then(async res => {
        const nodeRef_a = database().ref(
          `/CustomerCurrentRequest/${customerData.id}`,
        );

        const dateNodeRef = database().ref(
          `/CurrentRequest/${route.params.astro_id}`,
        );
        dateNodeRef.update({
          status: 'AceeptedbyUser', 
          date: new Date().getTime(),
        });

        nodeRef_a.update({
          status: 'active',
          startTime: new Date().getTime(),
          remedies: 'null',
          astromall: 'null'
        });

        const inVoiceId = (await dateNodeRef.once('value'))
          .child('invoice_id')
          .val();

        const astroFirebaseID = (
          await database().ref('AstroId').once('value')
        ).child(res.data.records[0]?.id).val();

        await AsyncStorage.setItem(
          'chatData',
          JSON.stringify({
            astroData: res.data,
            inVoiceId: inVoiceId,
            startTime: new Date().getTime(),
          }),
        );

        const data = await AsyncStorage.getItem('FirebaseId');
        dispatch(ChatActions.setCustomerFirebaseId(data));
        dispatch(ChatActions.setAstroFirebaseId(astroFirebaseID));

        navigation.navigate('chatScreen', {
          astroData: res.data,
          trans_id: route.params.trans_id,
          chat_id: route.params.chat_id, 
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  const reject_request = () => {
    whoosh.stop();
    const dateNodeRef = database().ref(
      `/CurrentRequest/${route.params.astro_id}`,
    );

    const customerNode = database().ref(
      `/CustomerCurrentRequest/${customerData?.id}`,
    );
    customerNode.update({
      status: 'End',
    });
    dateNodeRef.update({
      status: 'RejectByUser',
    });
    go_home();
  };

  const go_home = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'home'}],
      }),
    );
  };

  return (
    <View style={{flex: 1}}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      <LinearGradient
        colors={[Colors.primaryLight, Colors.primaryDark]}
        style={{
          //   flex: 1,

          borderRadius: Sizes.fixPadding,
        }}>
        <ImageBackground
          source={require('../assets/images/ChatBackground.png')}
          resizeMode="cover"
          style={{height: SCREEN_HEIGHT}}>
          <View style={{flex: 1}}>
            <View
              style={{
                flex: 0.3,

                alignItems: 'center',
                justifyContent: 'flex-end',
              }}>
              <Image
                source={{
                  uri: base_url + 'admin/' + customerData?.user_profile_image,
                }}
                style={{
                  width: 150,
                  height: 150,
                  borderRadius: 1000,
                  //   alignSelf: 'flex-end',
                }}
                resizeMode="contain"
              />
            </View>
            <View
              style={{
                flex: 0.3,
                alignItems: 'center',
                marginHorizontal: Sizes.fixPadding,
              }}>
              <Text
                style={{
                  ...Fonts.white18RobotBold,
                  fontSize: 24,
                  fontWeight: '600',
                  marginVertical: Sizes.fixPadding,
                }}>
                {customerData?.username}
              </Text>
              <Text
                style={{
                  ...Fonts.white18RobotMedium,

                  marginVertical: Sizes.fixPadding * 2.0,
                }}>
                Please accept chat request
              </Text>
              <Image
                source={{uri: route?.params?.image}}
                style={{
                  width: height * 0.1,
                  height: height * 0.1,
                  borderRadius: 1000,
                  // position: 'absolute',
                }}
                resizeMode="contain"
              />
              <Text
                style={{
                  ...Fonts.white18RobotMedium,
                  fontSize: 24,
                  marginTop: Sizes.fixPadding,
                }}>
                {route?.params?.name}
              </Text>
            </View>
            <View
              style={{
                flex: 0.3,

                justifyContent: 'space-evenly',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={accept_request}
                style={{
                  //   width: '40%',
                  backgroundColor: '#6CDC2D',
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  alignItems: 'center',
                  padding: Sizes.fixPadding + 5,
                  borderRadius: 40,
                  paddingHorizontal: Sizes.fixPadding * 4.5,
                  alignSelf: 'center',
                }}>
                <Ionicons
                  name="chatbubble-ellipses"
                  size={32}
                  color={Colors.white}
                  //   style={{marginHorizontal: Sizes.fixPadding}}
                />

                <Text
                  style={{
                    ...Fonts.white18RobotMedium,
                    fontSize: 24,
                    marginHorizontal: Sizes.fixPadding - 5,
                    textAlign: 'center',
                  }}>
                  Start Chat
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => reject_request()}
                style={{
                  //   width: '40%',
                  backgroundColor: Colors.red,
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  alignItems: 'center',
                  padding: Sizes.fixPadding - 2,
                  borderRadius: 40,
                  // marginTop: Sizes.fixPadding*2
                  //   paddingHorizontal: Sizes.fixPadding * 2.5,
                }}>
                <Entypo name="cross" size={30} color={Colors.white} />

                <Text
                  style={{
                    ...Fonts.white18RobotMedium,
                    fontSize: 22,
                    marginHorizontal: Sizes.fixPadding - 5,
                    textAlign: 'center',
                  }}>
                  Reject Chat
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </LinearGradient>
    </View>
  );
};

const mapStateToProps = state => ({
  customerData: state.user.userData,
  wallet: state.user.wallet,
});

const mapDispatchToProps = dispatch=>({dispatch})

export default connect(mapStateToProps, mapDispatchToProps)(AcceptChat);
