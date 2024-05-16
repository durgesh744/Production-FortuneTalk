import {View, Text, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {Modal} from 'react-native-paper';
import {Colors, Fonts, Sizes} from '../assets/style';
import {SCREEN_WIDTH} from '../config/Screen';
import LinearGradient from 'react-native-linear-gradient';
import Loader from './Loader';
import {api2_get_profile, api_url, deductwallet, deductwallet_chat} from '../config/constants';
import axios from 'axios';
import moment from 'moment';
import {MyMethods} from '../methods/my_methods';
import { connect } from 'react-redux';
import * as UserActions from '../redux/actions/UserActions'
import * as ChatActions  from '../redux/actions/ChatActions'
import AsyncStorage from '@react-native-async-storage/async-storage';
import database from '@react-native-firebase/database';

const ActiveChat = ({
  navigation,
  activeChatVisible,
  updateState,
  chatData,
  userData,
  startTime,
  inVoiceId,
  dispatch
}) => {

  const [isLoading, setIsLoading] = useState(false);
  const astroData = chatData?.records[0]
  const deduct_wallet = async () => {
    let duration = 0;
    if (startTime.length != 0) {
      duration = MyMethods.getSecondsBetweenTimestamps({
        timestamp1: startTime,
        timestamp2: new Date().getTime(),
      });
    }
    setIsLoading(true)

    await axios({
      method: 'post',
      url: api_url + deductwallet_chat,
      data: {
        user_id: userData.id,
        astro_id: astroData.id,
        start_time: moment(startTime).format('YYYY-MM-DD hh:mm:ss'),
        end_time: moment(new Date().getTime()).format('YYYY-MM-DD hh:mm:ss'),
        duration: duration,
        invoice_id: inVoiceId,
        chat_id: ''
      },
    })
      .then(res => {
        setIsLoading(false)
        customer_profile();
      })
      .catch(err => {
        setIsLoading(false)
        console.log(err);
      });
  };

  const customer_profile = async () => {
    await axios({
      method: 'post',
      url: api_url + api2_get_profile,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        user_id: userData?.id,
      },
    })
      .then(async res => {
        console.log(res.data.user_details[0]?.wallet)
        dispatch(UserActions.setWallet(res.data.user_details[0]?.wallet));
        end_chat_in_firebase();
      })
      .catch(err => {
        // updateState({isLoading: false});
        console.log(err);
      });
  };

  const end_chat_in_firebase = () => {
    try {
      database()
        .ref(`UserId/${userData.id}`)
        .once('value', snap => {
          let firebaseId = snap.val();
          database()
            .ref(`/AstroId/${astroData.id}`)
            .once('value', snapshot => {
              const send_msg = {
                message: 'User ended the chat.',
                timestamp: moment(new Date()).format('DD-MM-YYYY HH:MM:ss '),
                to: snapshot.val(),
                type: 'text',
              };
              const node = database()
                .ref(`/AstroId/${astroData.id}`)
                .push();
              const key = node.key;
              database()
                .ref(`/Messages/${firebaseId}/${snapshot.val()}/${key}`)
                .set({
                  from: firebaseId,
                  image: 'image = null',
                  message: 'User ended the chat.',
                  timestamp: new Date().getTime(),
                  to: snapshot.val(),
                  type: 'text',
                });
              database()
                .ref(`/Messages/${snapshot.val()}/${firebaseId}/${key}`)
                .set({
                  from: firebaseId,
                  image: 'image = null',
                  message: 'User ended the chat.',
                  timestamp: new Date().getTime(),
                  to: snapshot.val(),
                  type: 'text',
                });
              database()
                .ref(`/Chat/${firebaseId}/${snapshot.val()}`)
                .update(send_msg);
              database()
                .ref(`/Chat/${snapshot.val()}/${firebaseId}`)
                .update(send_msg);
            });
        })
        .then(() => {
          const nodeRef_a = database().ref(
            `/CustomerCurrentRequest/${userData.id}`,
          );
          nodeRef_a.update({
            astroData: '',
            trans_id: '',
            chat_id: '',
            status: 'End',
          });
          updateState({activeChatVisible: false});
        })
        .catch(err => {
          console.log(err);
        });
    } catch (e) {
      console.log(e);
    }
  };

  const on_resume = async()=>{
    const data = await AsyncStorage.getItem('FirebaseId');
    const astroFirebaseID = (
      await database().ref('UserId').once('value')
    ).child(astroData?.id).val();

    dispatch(ChatActions.setCustomerFirebaseId(data));
    dispatch(ChatActions.setAstroFirebaseId(astroFirebaseID));
    navigation.navigate('chatScreen', {
      astroData: chatData,
      trans_id: "",
      chat_id: "",
    });
  }

  return (
    <Modal
      visible={activeChatVisible}
      // onDismiss={() => updateState({activeChatVisible: false})}
    >
      <Loader visible={isLoading} />
      <View
        style={{
          backgroundColor: Colors.white,
          width: SCREEN_WIDTH * 0.8,
          alignSelf: 'center',
          padding: Sizes.fixPadding,
          borderRadius: Sizes.fixPadding,
        }}>
        <Text
          style={{...Fonts.primaryLight18RobotoMedium, textAlign: 'center'}}>
          Alert!
        </Text>
        <Text
          style={{
            ...Fonts.black16RobotoRegular,
            textAlign: 'center',
            marginVertical: Sizes.fixPadding * 2,
          }}>
          You have an active chat
        </Text>
        <View
          style={{
            flex: 0,
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={deduct_wallet}
            style={{borderRadius: Sizes.fixPadding, overflow: 'hidden'}}>
            <LinearGradient
              colors={[Colors.blackLight, Colors.gray]}
              style={{
                width: SCREEN_WIDTH * 0.3,
                paddingVertical: Sizes.fixPadding * 0.6,
              }}>
              <Text style={{...Fonts.white14RobotoMedium, textAlign: 'center'}}>
                End
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={on_resume}
            style={{borderRadius: Sizes.fixPadding, overflow: 'hidden'}}>
            <LinearGradient
              colors={[Colors.primaryLight, Colors.primaryDark]}
              style={{
                width: SCREEN_WIDTH * 0.3,
                paddingVertical: Sizes.fixPadding * 0.6,
              }}>
              <Text style={{...Fonts.white14RobotoMedium, textAlign: 'center'}}>
                Resume
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const mapDispatchToProps = dispatch =>({dispatch})

export default connect(null, mapDispatchToProps)(ActiveChat);
