import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  PermissionsAndroid,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors, Fonts, Sizes} from '../../assets/style';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MyStatusBar from '../../components/MyStatusBar';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Input} from '@rneui/themed';
import {showToastWithGravityAndOffset} from '../../methods/toastMessage';
import {connect} from 'react-redux';
import Payment from '../../components/Payment';
import axios from 'axios';
import {google_map_key} from '../../config/constants';
import Geolocation from 'react-native-geolocation-service';
import Loader from '../../components/Loader';

const PersonalDetailes = ({navigation, route, userData}) => {
  console.log(route?.params?.cartData)
  const [state, setState] = useState({
    cartData: route?.params?.cartData,
    name: userData?.username,
    emailId: userData?.email,
    phoneNumber: userData?.phone,
    address: userData?.current_address,
    landmark: '',
    city: '',
    countryState: '',
    pincode: '',
    showPayment: false,
    amount: route?.params?.amount,
    isLoading: false
  });

  const validation = () => {
    if (name.length == 0) {
      showToastWithGravityAndOffset('Please enter your name.');
      return false;
    } else if (emailId.length == 0) {
      showToastWithGravityAndOffset('Please enter your email address.');
      return false;
    } else if (phoneNumber.length == 0) {
      showToastWithGravityAndOffset('Please enter your phone number.');
      return false;
    } else if (phoneNumber.length != 10) {
      showToastWithGravityAndOffset('Please enter your correct phone number.');
      return false;
    } else if (address.length == 0) {
      showToastWithGravityAndOffset('Please enter your address.');
      return false;
    } else if (landmark.length == 0) {
      showToastWithGravityAndOffset('Please enter your landmark.');
      return false;
    } else if (city.length == 0) {
      showToastWithGravityAndOffset('Please enter your city.');
      return false;
    } else if (countryState.length == 0) {
      showToastWithGravityAndOffset('Please enter your state.');
      return false;
    } else if (pincode.length == 0) {
      showToastWithGravityAndOffset('Please enter your pincode.');
      return false;
    } else {
      return true;
    }
  };

  const request_permission = async () => {
    const isAndroid = Platform.OS == 'android';
    if (isAndroid) {
      const result = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (result) {
        get_current_address();
      } else {
        const isGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (isGranted == PermissionsAndroid.RESULTS.GRANTED) {
          ToastAndroid.show('User Granted Permission', ToastAndroid.SHORT);
          get_current_address();
        } else if (isGranted == 'never_ask_again') {
          ToastAndroid.show('Permission Is Always Denied', ToastAndroid.SHORT);
        } else {
          ToastAndroid.show('User Denied Permission', ToastAndroid.SHORT);
          return null;
        }
      }
    }
  };

  const get_current_address = async () => {
    updateState({isLoading: true})
    Geolocation.getCurrentPosition(
      position => {
        checkAvailability(position.coords.latitude, position.coords.longitude);
      },
      error => {
        // See error code charts below.
        updateState({isLoading: false})
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const checkAvailability = async (latitude, longitude) => {
    try {
      updateState({isLoading: true})
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${google_map_key}`,
      );
      let add = response.data.results[1].formatted_address;
      let result = (result = add.split(', '));
      let res = result.splice(result.length - 4, result.length);

      const results = response.data.results[1].address_components;
      var city = '';
      var state = '';
      var pincode = '';

      for (var i = 0; i < results.length; ++i) {
        if (results[i].types[0] == 'locality') {
          city = results[i].long_name;
        }
        if (results[i].types[0] == 'administrative_area_level_1') {
          state = results[i].long_name;
        }
        if(results[i].types[0] == 'postal_code'){
          pincode = results[i]?.long_name
        }
      }

      updateState({
        city: city,
        countryState: state,
        address: add,
        pincode: pincode,
        isLoading: false
      });
    } catch (error) {
      updateState({isLoading: false})
      console.log(error);
    }
  };

  const updateState = data => {
    setState(prevState => {
      const newData = {...prevState, ...data};
      return newData;
    });
  };

  const {
    name,
    emailId,
    phoneNumber,
    address,
    landmark,
    city,
    countryState,
    pincode,
    showPayment,
    amount,
    cartData,
    isLoading
  } = state;

  return (
    <View style={{flex: 1, backgroundColor: Colors.bodyColor}}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      <Loader visible={isLoading} />
      <View style={{flex: 1}}>
        {header()}
        <FlatList
          ListHeaderComponent={
            <>
              {titleInfo()}
              {nameFieldInfo()}
              {emailFieldInfo()}
              {phoneFieldInfo()}
              {addressFieldInfo()}
              {landMarkFieldInfo()}
              {cityAndStateField()}
              {pincodeInfo()}
              {currentLocationInfo()}
              {continueButtonInfo()}
            </>
          }
          contentContainerStyle={{paddingVertical: Sizes.fixPadding}}
        />
      </View>
      <Payment
        showPayment={showPayment}
        updateState={updateState}
        type={'product_buy'} 
        userData={userData}
        amount={amount}
        navigation={navigation}
        apiData={{
          name: name,
          product: JSON.stringify(cartData),
          customer_id: userData?.id,
          email_id: emailId,
          phone_no: phoneNumber,
          address: address,
          landmark: landmark,
          city: city,
          state: countryState,
          pincode: pincode,
        }}
      />
    </View>
  );

  function continueButtonInfo() {
    const on_payment = () => {
      if (validation()) {
        updateState({showPayment: true});
      }
    };
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => on_payment()}
        style={{
          marginHorizontal: Sizes.fixPadding * 2,
          marginVertical: Sizes.fixPadding * 1.5,
          borderRadius: 1000,
          overflow: 'hidden',
        }}>
        <LinearGradient
          colors={[Colors.primaryLight, Colors.primaryDark]}
          style={{paddingVertical: Sizes.fixPadding * 1}}>
          <Text style={{...Fonts.white18RobotMedium, textAlign: 'center'}}>
            Proceed for Payment
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  function currentLocationInfo() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => request_permission()}
        style={[styles.row, {alignSelf: 'center'}]}>
        <MaterialCommunityIcons
          name="crosshairs-gps"
          color={Colors.primaryLight}
          size={26}
        />
        <Text
          style={{
            ...Fonts.primaryLight18RobotoMedium,
            marginLeft: Sizes.fixPadding,
          }}>
          Current Location
        </Text>
      </TouchableOpacity>
    );
  }

  function pincodeInfo() {
    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 2,
          marginBottom: Sizes.fixPadding * 1.5,
        }}>
        <Input
          value={pincode}
          placeholder="Pincode"
          placeholderTextColor={Colors.gray}
          onChangeText={text => updateState({pincode: text})}
          keyboardType="phone-pad"
          inputStyle={styles.inputStyle}
          containerStyle={[styles.containerStyle, {width: '47%'}]}
          inputContainerStyle={styles.inputContainerStyle}
        />
      </View>
    );
  }

  function cityAndStateField() {
    return (
      <View
        style={[
          styles.row,
          {
            marginHorizontal: Sizes.fixPadding * 2,
            justifyContent: 'space-between',
            marginBottom: Sizes.fixPadding * 1.5,
          },
        ]}>
        <Input
          value={city}
          placeholder="City"
          placeholderTextColor={Colors.gray}
          onChangeText={text => updateState({city: text})}
          inputStyle={styles.inputStyle}
          containerStyle={[styles.containerStyle, {width: '47%'}]}
          inputContainerStyle={styles.inputContainerStyle}
        />
        <Input
          value={countryState}
          placeholder="State"
          placeholderTextColor={Colors.gray}
          onChangeText={text => updateState({countryState: text})}
          inputStyle={styles.inputStyle}
          containerStyle={[styles.containerStyle, {width: '47%'}]}
          inputContainerStyle={styles.inputContainerStyle}
        />
      </View>
    );
  }

  function landMarkFieldInfo() {
    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 2,
          marginBottom: Sizes.fixPadding * 1.5,
        }}>
        <Input
          value={landmark}
          placeholder="Landmark"
          placeholderTextColor={Colors.gray}
          onChangeText={text => updateState({landmark: text})}
          inputStyle={styles.inputStyle}
          containerStyle={styles.containerStyle}
          inputContainerStyle={styles.inputContainerStyle}
        />
      </View>
    );
  }

  function addressFieldInfo() {
    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 2,
          marginBottom: Sizes.fixPadding * 1.5,
        }}>
        <Input
          value={address}
          placeholder="Address"
          placeholderTextColor={Colors.gray}
          onChangeText={text => updateState({address: text})}
          inputStyle={styles.inputStyle}
          containerStyle={styles.containerStyle}
          inputContainerStyle={styles.inputContainerStyle}
        />
      </View>
    );
  }

  function phoneFieldInfo() {
    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 2,
          marginBottom: Sizes.fixPadding * 1.5,
        }}>
        <Input
          value={phoneNumber}
          placeholder="Phone No."
          maxLength={10}
          placeholderTextColor={Colors.gray}
          keyboardType="phone-pad"
          onChangeText={text => updateState({phoneNumber: text})}
          inputStyle={styles.inputStyle}
          containerStyle={styles.containerStyle}
          inputContainerStyle={styles.inputContainerStyle}
        />
      </View>
    );
  }

  function emailFieldInfo() {
    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 2,
          marginBottom: Sizes.fixPadding * 1.5,
        }}>
        <Input
          value={emailId}
          placeholder="Email ID"
          placeholderTextColor={Colors.gray}
          inputStyle={styles.inputStyle}
          keyboardType="email-address"
          onChangeText={text => updateState({emailId: text})}
          containerStyle={styles.containerStyle}
          inputContainerStyle={styles.inputContainerStyle}
        />
      </View>
    );
  }

  function nameFieldInfo() {
    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 2,
          marginBottom: Sizes.fixPadding * 1.5,
        }}>
        <Input
          value={name}
          placeholder="Name"
          placeholderTextColor={Colors.gray}
          onChangeText={text => updateState({name: text})}
          inputStyle={styles.inputStyle}
          containerStyle={styles.containerStyle}
          inputContainerStyle={styles.inputContainerStyle}
        />
      </View>
    );
  }

  function titleInfo() {
    return (
      <Text
        style={{
          ...Fonts.black18RobotoRegular,
          color: Colors.red,
          textAlign: 'center',
          marginBottom: Sizes.fixPadding,
        }}>
        Enter the details
      </Text>
    );
  }

  function header() {
    return (
      <View
        style={{
          padding: Sizes.fixPadding * 1.5,
          ...styles.row,
          justifyContent: 'space-between',
          borderBottomWidth: 1,
          borderBottomColor: Colors.grayLight,
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{position: 'absolute', zIndex: 99, padding: Sizes.fixPadding * 1.5}}>
          <AntDesign
            name="leftcircleo"
            color={Colors.primaryLight}
            size={Sizes.fixPadding * 2.2}
          />
        </TouchableOpacity>
        <Text
          style={{
            ...Fonts.primaryLight15RobotoMedium,
            textAlign: 'center',
            flex: 1,
          }}>
          Details
        </Text>
      </View>
    );
  }
};

const mapStateToProps = state => ({
  userData: state.user.userData,
});

export default connect(mapStateToProps, null)(PersonalDetailes);

const styles = StyleSheet.create({
  row: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputStyle: {
    ...Fonts.black14InterMedium,
  },
  containerStyle: {
    backgroundColor: Colors.whiteDark,
    borderRadius: Sizes.fixPadding,
    paddingTop: Sizes.fixPadding * 1,
    height: 60,
  },
  inputContainerStyle: {
    marginBottom: 0,
    paddingBottom: 0,
    height: 40,
    borderBottomColor: Colors.gray + '80',
  },
});
