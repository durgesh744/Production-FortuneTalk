import {View, Text, Image, Dimensions, StyleSheet, Modal} from 'react-native';
import React, {useEffect} from 'react';
import MyStatusBar from '../components/MyStatusBar';
import LinearGradient from 'react-native-linear-gradient';
import {Colors} from '../assets/style';
import {CommonActions} from '@react-navigation/native';
import Video from 'react-native-video';
import {SCREEN_WIDTH} from '../config/Screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {api2_get_profile, api_url} from '../config/constants';
import * as UserActions from '../redux/actions/UserActions';
import {connect} from 'react-redux';
import {requestMultiple, PERMISSIONS} from 'react-native-permissions';
import database from '@react-native-firebase/database';

const Splash = ({navigation, dispatch}) => {
  useEffect(() => {
    request_multiple_permissions();
    setTimeout(() => {
      navigate();
    }, 1000);
  }, []);

  const navigate = async () => {
    let userData = await AsyncStorage.getItem('customerData');
    let check_is_register = await AsyncStorage.getItem('isRegister');
    let isRegister = JSON.parse(check_is_register);
    let parsedData = JSON.parse(userData);
    if (parsedData) {
      customer_profile(parsedData?.id);
    } else if (isRegister != null) {
      go_home();
    } else {
      go_login();
    }
  };

  const customer_profile = async id => {
    let data = new FormData();
    data.append('user_id', id);
    await axios({
      method: 'post',
      url: api_url + api2_get_profile,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: data,
    })
      .then(async res => {
        dispatch(UserActions.setUserData(res.data.user_details[0]));
        dispatch(UserActions.setWallet(res.data.user_details[0]?.wallet));
        dispatch(UserActions.setISLogged(true))
        go_home();
      })
      .catch(err => {
        // updateState({isLoading: false});
        console.log(err);
      });
  };

  const go_home = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'home',
            params: {
              userID: '2553',
              userName: 'Ranjeet',
            },
          },
        ],
      }),
    );
  };

  const go_login = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'login'}],
        // routes: [{name: 'kundliCategory'}]
      }),
    );
  };

  const request_multiple_permissions = async () => {
    try {
      const results = await requestMultiple([
        PERMISSIONS.ANDROID.CAMERA,
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
        PERMISSIONS.ANDROID.POST_NOTIFICATIONS,
      ]);

      // Check if permissions were granted
      if (
        results[PERMISSIONS.ANDROID.CAMERA] === 'granted' &&
        results[PERMISSIONS.ANDROID.POST_NOTIFICATIONS] == 'granted'
      ) {
        // Permissions granted, you can now use these features.
      } else {
        // Permissions not granted, handle accordingly.
        console.log(results);
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
    }
  };

  return (
    <View style={{flex: 1}}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      <LinearGradient
        colors={[Colors.primaryLight, Colors.primaryDark]}
        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Image
          source={require('../assets/gifs/splash.gif')}
          style={{width: SCREEN_WIDTH * 0.65, height: SCREEN_WIDTH * 0.65}}
        />
      </LinearGradient>
      {/* {modalInfo()} */}
    </View>
  );
};

const mapDispatchToProps = dispatch => ({dispatch});

export default connect(mapDispatchToProps, null)(Splash);

const styles = StyleSheet.create({
  backgroundVideo: {
    height: SCREEN_WIDTH * 0.6,
    width: SCREEN_WIDTH * 0.6,
    backgroundColor: 'transparent',
  },
});
