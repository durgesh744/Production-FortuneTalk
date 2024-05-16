import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import React, {createRef, useEffect, useState} from 'react';
import MyStatusBar from '../components/MyStatusBar';
import {Colors, Fonts, Sizes} from '../assets/style';
import LinearGradient from 'react-native-linear-gradient';
import CountryPicker from 'rn-country-picker';
import {Divider, Input} from '@rneui/themed';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import {
  api2_get_profile,
  api_url,
  facebook_login,
  google_login,
  user_web_api_login,
} from '../config/constants';
import Loader from '../components/Loader';
import {showToastWithGravityAndOffset} from '../methods/toastMessage';
import {CommonActions} from '@react-navigation/native';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {
  LoginManager,
  Profile,
  Settings,
} from 'react-native-fbsdk-next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ApiRequest} from '../config/api_requests';
import * as UserActions from '../redux/actions/UserActions';
import {connect} from 'react-redux';

Settings.initializeSDK('1403757197218563');

const Login = ({navigation, dispatch}) => {
  const [state, setState] = useState({
    callingCode: '91',
    cca2: 'IN',
    phoneNumber: '',
    errorMessage: '',
    isLoading: false,
  });
  const inputRef = createRef();

  useEffect(() => {
    GoogleSignin.configure();
  }, []);

  const reauthorizeDataAccess = async () => {
    try {
      const result = await LoginManager.reauthorizeDataAccess();
      Alert.alert(
        'Reauthorize data access result',
        JSON.stringify(result, null, 2),
      );
    } catch (error) {
      Alert.alert('Reauthorize data access fail with error:', error);
    }
  };

  const validation = () => {
    const numericRegex = /^\d{10}$/;
    if (phoneNumber.length == 0) {
      updateState({errorMessage: 'Please enter phone number'});
      inputRef.current.shake();
      return false;
    } else if (phoneNumber.length != 10) {
      updateState({errorMessage: 'Please enter correct phone number'});
      inputRef.current.shake();
      return false;
    } else if (!numericRegex.test(phoneNumber)) {
      updateState({errorMessage: 'Please enter numeric value'});
      inputRef.current.shake();
      return false;
    } else {
      return true;
    }
  };

  const on_login = async () => {
    let fcm_token = 'sdfdsfjsdfhs';
    if (validation()) {
      updateState({isLoading: true});
      await axios({
        method: 'get',
        url:
          api_url +
          user_web_api_login +
          `number=${phoneNumber}&token=${fcm_token}`,
      })
        .then(res => {
          updateState({isLoading: false});
          if (res.data.status == 1) {
            if (res.data.new_user == 0) {
              navigation.navigate('otp', {
                phone_number: phoneNumber,
                otp: res.data.otp,
              });
            } else {
              // go_home();
            }
          } else {
            showToastWithGravityAndOffset(res.data.msg);
          }
        })
        .catch(err => {
          updateState({isLoading: false});
          console.log(err);
        });
    }
  };

  const on_google_login = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log(userInfo?.user);
      login_with_google(userInfo?.user);
    } catch (error) {
      console.log(error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  const login_with_google = async userData => {
    try {
      updateState({isLoading: true});

      const response = await ApiRequest.postRequest({
        url: api_url + google_login,
        data: {
          social_id: userData?.id,
          email: userData?.email,
          username: userData?.name,
        },
      });

      if (response?.success) {
        if (response?.data) {
          customer_profile(response?.data?.id);
        }
      }

      updateState({isLoading: false});
    } catch (e) {
      console.log(e);

      updateState({isLoading: false});
    }
  };

  const login_with_facebook = async userData => {
    try {
      updateState({isLoading: true});

      const response = await ApiRequest.postRequest({
        url: api_url + facebook_login,
        data: {
          fb_id: userData?.userID,
          first_name: userData?.firstName,
          last_name: userData?.lastName,
          username: userData?.name
        },
      });

      if (response?.success) {
        customer_profile(response?.id);
      }

      updateState({isLoading: false});
    } catch (e) {
      console.log(e);

      updateState({isLoading: false});
    }
  };

  const customer_profile = async id => {
    try {
      updateState({isLoading: true});

      let data = new FormData();
      data.append('user_id', id.toString());

      const response = await ApiRequest.postRequest({
        url: api_url + api2_get_profile,
        data: data,
      });

      if (response?.status) {
        await AsyncStorage.setItem(
          'customerData',
          JSON.stringify(response.user_details[0]),
        );

        dispatch(UserActions.setUserData(response.user_details[0]));
        dispatch(UserActions.setWallet(response.user_details[0].wallet));
        dispatch(UserActions.setISLogged(true))
        if (response.user_details[0]?.username?.length == 0) { 
          await AsyncStorage.setItem(
            'isRegister',
            JSON.stringify({type: 'login', value: true}),
          );
        } else {
          await AsyncStorage.setItem(
            'isRegister',
            JSON.stringify({type: 'profile', value: false}),
          );
        }
        go_home();
        showToastWithGravityAndOffset('You are logged successfully.');
      }

      updateState({isLoading: false});
    } catch (e) {
      console.log(e);
      updateState({isLoading: false});
    }
  };

  const on_facebook_login = () => {
    LoginManager.logInWithPermissions(['public_profile']).then(
      function (result) {
        if (result.isCancelled) {
          console.log('Login cancelled');
        } else {
          console.log(
            'Login success with permissions: ' +
              result.grantedPermissions.toString(),
          );

          Profile.getCurrentProfile().then(function (currentProfile) {
            if (currentProfile) {
              login_with_facebook(currentProfile);
              console.log(currentProfile);
              console.log(
                'The current logged user is: ' +
                  currentProfile.name +
                  '. His profile id is: ' +
                  currentProfile.userID,
              );
            }
          });
        }
      },
      function (error) {
        console.log('Login fail with error: ' + error);
      },
    );
  };

  const go_home = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'home'}],
      }),
    );
  };

  const updateState = data => setState({...state, ...data});

  const {callingCode, cca2, phoneNumber, errorMessage, isLoading} = state;

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
        {skipInfo()}
        {imageInfo()}
        <View style={styles.bottomContainer}>
          <View style={{flex: 1}}>
            {topTitleInfo()}
            {phoneInput()}
            {termsPrivacyInfo()}
            {submiteButtonInfo()}
            {orContinueInfo()}
            {socialLoginInfo()}
          </View>
          {bottomViewInfo()}
        </View>
      </LinearGradient>
    </View>
  );

  function bottomViewInfo() {
    return (
      <View
        style={{
          flex: 0,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-evenly',
          marginBottom: Sizes.fixPadding * 1.5,
        }}>
        <View style={{flex: 0.3, alignItems: 'center'}}>
          <Image
            source={require('../assets/images/icons/user.png')}
            style={{width: 25, height: 25}}
          />
          <Text style={{...Fonts.gray14RobotoRegular, textAlign: 'center'}}>
            Verified Genuine{'\n'}Astrologers
          </Text>
        </View>
        <Divider orientation="vertical" />
        <View style={{flex: 0.3, alignItems: 'center'}}>
          <Image
            source={require('../assets/images/icons/private.png')}
            style={{width: 25, height: 25}}
          />
          <Text style={{...Fonts.gray14RobotoRegular, textAlign: 'center'}}>
            100%{'\n'}Private
          </Text>
        </View>
      </View>
    );
  }

  function socialLoginInfo() {
    return (
      <View
        style={{
          flex: 0,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          marginHorizontal: Sizes.fixPadding * 2,
          marginVertical: Sizes.fixPadding * 2,
        }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => on_facebook_login()}
          style={{
            ...styles.socialButton,
            backgroundColor: Colors.blueFacebook,
          }}>
          <MaterialIcons
            name="facebook"
            color={Colors.white}
            size={Sizes.fixPadding * 2.5}
          />
          <Text
            style={{
              ...Fonts.white14RobotoMedium,
              marginLeft: Sizes.fixPadding,
            }}>
            Facebook
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={on_google_login}
          style={{
            ...styles.socialButton,
            backgroundColor: Colors.white,
            borderWidth: 0.5,
            borderColor: Colors.gray,
          }}>
          <Image
            source={require('../assets/images/icons/google_logo.png')}
            style={{
              width: Sizes.fixPadding * 2.5,
              height: Sizes.fixPadding * 2.5,
            }}
          />
          <Text
            style={{
              ...Fonts.gray14RobotoMedium,
              marginLeft: Sizes.fixPadding,
            }}>
            Google
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  function orContinueInfo() {
    return (
      <Text style={{...Fonts.gray18RobotoRegular, textAlign: 'center'}}>
        Or Continue With
      </Text>
    );
  }

  function submiteButtonInfo() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={on_login}
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
            Send OTP
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  function termsPrivacyInfo() {
    return (
      <Text
        style={{
          fontSize: 11,
          fontFamily: 'Roboto-Regular',
          textAlign: 'center',
          marginHorizontal: Sizes.fixPadding,
        }}>
        By continue you agree to our Terms of use & Privacy Policy
      </Text>
    );
  }

  function phoneInput() {
    const onChangeText = text => {
      updateState({phoneNumber: text, errorMessage: ''});
    };
    return (
      <Input
        ref={inputRef}
        placeholder="Enter Mobile No."
        keyboardType="number-pad"
        maxLength={10}
        onChangeText={text => onChangeText(text)}
        inputContainerStyle={styles.inputContainer}
        inputStyle={{...Fonts.black16RobotoRegular}}
        errorMessage={errorMessage}
        errorStyle={{textAlign: 'center'}}
        leftIcon={
          <View style={styles.flagContainer}>
            <CountryPicker
              countryCode={callingCode}
              containerStyle={styles.pickerStyle}
              pickerTitleStyle={styles.pickerTitleStyle}
              countryFlagStyle={{
                borderRadius: 0,
                width: 30,
                height: 30,
                resizeMode: 'contain',
              }}
              withCallingCode={true}
              withFilter={true}
              withEmoji={true}
              containerButtonStyle={{}}
              onSelect={text => {
                console.log(text);
                // updateState({callingCode: text.callingCode, cca2: text.cca2})
              }}
            />
          </View>
        }
      />
    );
  }

  function topTitleInfo() {
    return (
      <Text
        style={{
          ...Fonts.primaryDark16RobotoMedium,
          textAlign: 'center',
        }}>
        Get Started With Fortune Talk!
      </Text>
    );
  }

  function imageInfo() {
    return (
      <View style={{flex: 0.3}}>
        <Image
          source={require('../assets/images/splash_logo.png')}
          style={{
            width: '40%',
            height: '100%',
            resizeMode: 'contain',
            alignSelf: 'center',
          }}
        />
      </View>
    );
  }

  function skipInfo() {
    const on_skip = async () => {
      await AsyncStorage.setItem(
        'isRegister',
        JSON.stringify({type: 'login', value: false}),
      );
      go_home();
    };
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

export default connect(null, mapDispatchToProps)(Login);

const styles = StyleSheet.create({
  bottomContainer: {
    flex: 0.7,
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

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  titleText: {
    color: '#000',
    fontSize: 25,
    marginBottom: 25,
    fontWeight: 'bold',
  },
  pickerTitleStyle: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  pickerStyle: {
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    fontSize: 16,
    color: '#000',
  },
  selectedCountryTextStyle: {
    color: '#000',
    textAlign: 'right',
  },

  countryNameTextStyle: {
    color: '#000',
    textAlign: 'right',
  },

  searchBarStyle: {
    flex: 1,
  },
});
