import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React, {createRef, useEffect, useState} from 'react';
import MyStatusBar from '../components/MyStatusBar';
import {Colors, Fonts, Sizes} from '../assets/style';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {CommonActions} from '@react-navigation/native';
import {
  add_or_update_device_token,
  api2_get_profile,
  api_url,
  call_app_id,
  call_app_sign,
  user_web_api_login,
  user_web_api_verification_otp,
} from '../config/constants';
import Loader from '../components/Loader';
import axios from 'axios';
import {showToastWithGravityAndOffset} from '../methods/toastMessage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {connect} from 'react-redux';
import * as UserActions from '../redux/actions/UserActions';
import messaging from '@react-native-firebase/messaging';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import {MyMethods} from '../methods/my_methods';

const CELL_COUNT = 4;

const Otp = ({navigation, route, dispatch}) => {
  console.log(route.params.otp);
  const [otp, setOtp] = useState(route.params.otp);
  const [value, setValue] = useState('');
  const [counter, setCounter] = useState(59);
  const [isLoading, setIsLoading] = useState(false);
  const [otpprops, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  useEffect(() => {
    const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    return () => clearInterval(timer);
  }, [counter]);

  const validation = () => {
    if (otp.toString() != value) {
      showToastWithGravityAndOffset('Wrong Otp!');
      return false;
    } else {
      return true;
    }
  };

  const handle_otp = async () => {
    if (validation()) {
      setIsLoading(true);
      await axios({
        method: 'get',
        url:
          api_url +
          user_web_api_verification_otp +
          `number=${route.params.phone_number}&otp=${value}`,
      })
        .then(async res => {
          setIsLoading(false);
          update_fcm_token(res.data.id);
          dispatch(UserActions.setISLogged(true))
          if (res.data?.is_new_user == '0') {
            customer_profile(res.data.id);
          } else {
            // MyMethods.create_firebase_account({
            //   userId: res.data.id,
            //   userAccount: route.params.phone_number,
            // });
            navigation.navigate('register', {
              phone_number: route.params.phone_number,
              id: res.data.id,
            });
          }
        })
        .catch(err => {
          setIsLoading(false);
          console.log(err);
        });
    }
  };

  const update_fcm_token = async user_id => {
    setIsLoading(true);
    let fcm_token = await messaging().getToken();
    await axios({
      method: 'post',
      url: api_url + add_or_update_device_token,
      headers: {
        'content-type': 'multipart/form-data',
      },
      data: {
        user_id: user_id,
        user_type: 'user',
        device_token: fcm_token,
        token: '1',
      },
    })
      .then(res => {
        setIsLoading(false);
        database()
          .ref(`UserId/${user_id}`)
          .on('value', snapchat => {
            database().ref(`Users/${snapchat.val()}`).set({
              cover: '',
              token: fcm_token,
            });
          });
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const customer_profile = async id => {
    setIsLoading(true);
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
        setIsLoading(false);
        await AsyncStorage.setItem(
          'customerData',
          JSON.stringify(res.data.user_details[0]),
        );

        dispatch(UserActions.setUserData(res.data.user_details[0]));
        dispatch(UserActions.setWallet(res.data.user_details[0].wallet));
        // MyMethods.create_firebase_account({
        //   userId: id,
        //   userAccount: route.params.phone_number,
        // });
        // onUserLogin(
        //   res.data.user_details[0].id,
        //   res.data.user_details[0].username,
        // );
        await AsyncStorage.setItem('isRegister', JSON.stringify({type: 'login', value: true}))
        go_home();
        // success_toast('You are logged successfully.');
        showToastWithGravityAndOffset('You are logged successfully.');
      })
      .catch(err => { 
        setIsLoading(false);
        console.log(err);
      });
  };

  const resend_otp = async () => {
    let fcm_token = 'sdfdsfjsdfhs';
    setIsLoading(true);
    await axios({
      method: 'get',
      url:
        api_url +
        user_web_api_login +
        `number=${route.params.phone_number}&token=${fcm_token}`,
    })
      .then(res => {
        setIsLoading(false);
        if (res.data.status == 1) {
          setOtp(res.data.otp);
          setCounter(59);
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
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
      <Loader visible={isLoading} />
      <LinearGradient
        colors={[Colors.primaryLight, Colors.primaryDark]}
        style={{flex: 1}}>
        {/* {skipInfo()} */}
        {imageInfo()}
        <View style={styles.bottomContainer}>
          <View style={{flex: 1}}>
            {backHandleInfo()}
            {topTitleInfo()}
            {numberInfo()}
            {phoneInput()}
            {resendOtpInfo()}
            {submiteButtonInfo()}
          </View>
        </View>
      </LinearGradient>
    </View>
  );

  function submiteButtonInfo() {
    return (
      <TouchableOpacity
        onPress={handle_otp}
        activeOpacity={0.8}
        style={{
          width: '70%',
          marginVertical: Sizes.fixPadding * 2,
          alignSelf: 'center',
        }}>
        <LinearGradient
          colors={[Colors.primaryLight, Colors.primaryDark]}
          style={{
            width: '100%',
            paddingVertical: Sizes.fixPadding,
            borderRadius: Sizes.fixPadding * 1.5,
          }}>
          <Text style={{...Fonts.white18RobotBold, textAlign: 'center'}}>
            Verify
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  function resendOtpInfo() {
    return (
      <View
        style={{
          flex: 0,
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'center',
          marginBottom: Sizes.fixPadding * 3,
        }}>
        <Text style={{...Fonts.gray14RobotoRegular}}>Resend code in </Text>
        <Text style={{...Fonts.greenDark14InterMedium}}>{counter} Sec </Text>
        {counter == 0 && (
          <Text
            onPress={resend_otp}
            style={{...Fonts.primaryLight14RobotoMedium}}>
            Resend
          </Text>
        )}
      </View>
    );
  }

  function phoneInput() {
    const inputRef = createRef();
    return (
      <CodeField
        ref={inputRef}
        {...otpprops}
        // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
        value={value}
        onChangeText={setValue}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={({index, symbol, isFocused}) => (
          <Text
            key={index}
            style={[styles.cell, isFocused && styles.focusCell]}
            onLayout={getCellOnLayoutHandler(index)}>
            {symbol || (isFocused ? <Cursor /> : null)}
          </Text>
        )}
      />
    );
  }

  function numberInfo() {
    return (
      <Text
        style={{
          ...Fonts.greenDark14InterMedium,
          textAlign: 'center',
          marginTop: Sizes.fixPadding * 3,
        }}>
        Otp send to +91 {route.params.phone_number}
      </Text>
    );
  }

  function topTitleInfo() {
    return (
      <Text
        style={{
          ...Fonts.primaryDark18RobotoMedium,
          textAlign: 'center',
        }}>
        Verify your Number
      </Text>
    );
  }

  function backHandleInfo() {
    return (
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          padding: Sizes.fixPadding * 0.5,
          alignSelf: 'flex-start',
          marginHorizontal: Sizes.fixPadding * 2,
        }}>
        <AntDesign
          name="leftcircleo"
          color={Colors.primaryDark}
          size={Sizes.fixPadding * 2.2}
        />
      </TouchableOpacity>
    );
  }

  function imageInfo() {
    return <View style={{flex: 0.1}}></View>;
  }

  function skipInfo() {
    const on_skip = async()=>{
      await AsyncStorage.setItem('isRegister', JSON.stringify({type: 'login', value: false}))
      go_home()
    }
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={on_skip}
        style={{
          flex: 0,
          alignSelf: 'flex-end',
          margin: Sizes.fixPadding * 2,
        }}>
        <Text style={{...Fonts.white14RobotoMedium}}>Skip</Text>
      </TouchableOpacity>
    );
  }
};

const mapDispatchToProps = dispatch => ({dispatch});

export default connect(null, mapDispatchToProps)(Otp);

const styles = StyleSheet.create({
  bottomContainer: {
    flex: 0.9,
    backgroundColor: Colors.white,
    borderTopLeftRadius: Sizes.fixPadding * 7,
    paddingTop: Sizes.fixPadding * 2,
  },
  inputContainer: {
    marginHorizontal: Sizes.fixPadding * 3,
    borderWidth: 1,
    borderColor: Colors.grayLight,
    borderRadius: Sizes.fixPadding * 2,
    paddingHorizontal: Sizes.fixPadding,
    paddingVertical: 0,
    marginTop: Sizes.fixPadding * 2,
  },
  flagContainer: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: Sizes.fixPadding * 0.8,
    borderRightWidth: 1,
    borderColor: Colors.grayLight,
  },
  socialButton: {
    flex: 0,
    width: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding * 0.8,
    borderRadius: Sizes.fixPadding,
  },
  root: {flex: 1, padding: 20},
  title: Fonts.greenDark14InterMedium,
  codeFieldRoot: {marginVertical: Sizes.fixPadding * 3, alignSelf: 'center'},
  cell: {
    width: 45,
    height: 45,
    lineHeight: 42,
    borderWidth: 1,
    borderRadius: Sizes.fixPadding,
    borderColor: Colors.grayDark,
    textAlign: 'center',
    backgroundColor: Colors.white,
    marginRight: 5,
    marginHorizontal: 10,
    ...Fonts.gray14RobotoMedium,
    fontSize: 22,
  },
  focusCell: {
    borderColor: Colors.primaryLight,
  },
});
