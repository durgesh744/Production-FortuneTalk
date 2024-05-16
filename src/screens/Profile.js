import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Image,
  StyleSheet,
} from 'react-native';
import React, {createRef, useCallback, useEffect, useState} from 'react';
import {Colors, Fonts, Sizes} from '../assets/style';
import MyStatusBar from '../components/MyStatusBar';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {BottomSheet, Input} from '@rneui/themed';
import {Dropdown} from 'react-native-element-dropdown';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import  {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import * as ImagePicker from 'react-native-image-picker';
import {camera_options} from '../config/data';
import axios from 'axios';
import {
  api2_get_profile,
  api_url,
  base_url,
  send_otp_to_customer,
  update_customer_phone,
  upload_customer_pic,
} from '../config/constants';
import {connect} from 'react-redux';
import {showToastWithGravityAndOffset} from '../methods/toastMessage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as UserActions from '../redux/actions/UserActions';
import Loader from '../components/Loader';
import CountryPicker from 'rn-country-picker';
import {MyMethods} from '../methods/my_methods';
import {ApiRequest} from '../config/api_requests';
import {
  CodeField,
  Cursor,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import OtpTimer from '../components/OtpTimer';

const genderData = [
  {label: 'Male', value: 'male'},
  {label: 'Female', value: 'female'},
  {label: 'Other', value: 'other'},
];

const occupationData = [
  {label: 'Student', value: 'Student'},
  {label: 'Employee', value: 'Employee'},
  {label: 'Business', value: 'Business'},
  {label: 'Entrepreneur', value: 'Entrepreneur'},
  {label: 'Housewife', value: 'Housewife'},
  {label: 'Unemployment', value: 'Unemployment'},
];

const problemData = [
  {label: 'Relationship Problem', value: 'Relationship Problem'},
  {label: 'Marriage Problem', value: 'Marriage Problem'},
  {label: 'Career Problem', value: 'Career Problem'},
  {label: 'Business Problem', value: 'Business Problem'},
  {label: 'Family Problem', value: 'Family Problem'},
  {label: 'Health Problem', value: 'Health Problem'},
];

const {width, height} = Dimensions.get('window');

const Profile = ({navigation, selectedLocation, route, dispatch, userData}) => {
  const [gender, setGender] = useState(userData?.gender);
  const [value, setValue] = useState('');
  const [otpprops, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const [state, setState] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    callingCode: '91',
    cca2: 'IN',
    genderFocus: false,
    birthDate: null,
    calenderVisible: false,
    timeVisible: false,
    time: null,
    address: '',
    currentAddress: '',
    currentImage: '',
    profileImage: null,
    baseSixtyFour: null,
    bottomSheetVisible: false,
    selectedOccupation: '',
    occupationFocus: false,
    selectedProblem: '',
    problemFocus: false,
    isLoading: false,
    otpVisible: false,
    isPhoneVerified: false,
    otpValue: null,
  });

  useEffect(() => {
    if (selectedLocation) {
      updateState({address: selectedLocation?.address});
    }
  }, [selectedLocation]);

  useEffect(() => {
    get_detailes();
  }, []);

  const get_detailes = async () => {
    const check_is_register = await AsyncStorage.getItem('isRegister');
    const isRegister = JSON.parse(check_is_register);
    if (isRegister) {
      updateState({
        firstName: userData?.first_name,
        lastName: userData?.last_name,
        phoneNumber: userData?.phone,
        email: userData?.email == 'null' ? '' : userData?.email,
        callingCode: '91',
        cca2: 'IN',
        genderFocus: false,
        birthDate:
          userData?.date_of_birth?.length == 0
            ? null
            : moment(
                `${userData?.date_of_birth} ${userData?.time_of_birth}`,
                'YYYY-MM-DD HH:mm:ss',
              ),
        calenderVisible: false,
        timeVisible: false,
        time:
          userData?.time_of_birth?.length == 0
            ? null
            : moment(
                `${userData?.date_of_birth} ${userData?.time_of_birth}`,
                'YYYY-MM-DD HH:mm:ss',
              ),
        address: userData?.place_of_birth,
        currentAddress: userData?.current_address,
        currentImage: base_url + 'admin/' + userData?.user_profile_image,
        profileImage: null,
        baseSixtyFour: null,
        bottomSheetVisible: false,
        selectedOccupation: userData?.occupation,
        occupationFocus: false,
        selectedProblem: userData?.problem,
        problemFocus: false,
        isLoading: false,
        isPhoneVerified: userData?.phone != '0',
      });
    }
  };

  function isValidEmail(email) {
    // Regular expression for basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function isValidName(name) {
    // Allow letters, hyphens, and spaces
    const nameRegex = /^[A-Za-z\- ]+$/;
    return nameRegex.test(name);
  }

  function isValidLastName(name) {
    // Allow letters, hyphens, and spaces
    const nameRegex = /^[A-Za-z\- ]+$/;
    return nameRegex.test(name);
  }

  const validation = () => {
    if (!isValidName(firstName)) {
      showToastWithGravityAndOffset('Please enter your valid first name.');
      return false;
    } else if (lastName.length != 0 && !isValidLastName(lastName)) {
      showToastWithGravityAndOffset('Please enter your valid last name.');
      return false;
    } else if (gender == null) {
      showToastWithGravityAndOffset('Please select your gender.');
      return false;
    } else if (!isValidEmail(email)) {
      showToastWithGravityAndOffset('Please enter valid email.');
      return false;
    } else if (birthDate == null) {
      showToastWithGravityAndOffset('Please select your birth date.');
      return false;
    } else if (time == null) {
      showToastWithGravityAndOffset('Please select your birth time.');
      return false;
    } else if (currentAddress.length == 0) {
      showToastWithGravityAndOffset('Please enter your current city.');
      return false;
    } else if (selectedOccupation == null) {
      showToastWithGravityAndOffset('Please select your occupation.');
      return false;
    } else if (selectedProblem == null) {
      showToastWithGravityAndOffset('Please select your problem.');
      return false;
    } else {
      return true;
    }
  };

  const register = async () => {
    if (validation()) {
      updateState({isLoading: true});
      let data = new FormData();
      data.append('id', userData?.id.toString()),
        data.append('first_name', firstName),
        data.append('last_name', lastName),
        data.append('date_of_birth', moment(birthDate).format('YYYY-MM-DD'));
      data.append('time_of_birth', moment(time).format('HH:mm:ss'));
      data.append('gender', gender),
        data.append('email', email.length == 0 ? 'null' : email),
        data.append('type', 'phone'),
        data.append('mobile', userData?.phone),
        data.append('country', 'India'),
        data.append('country_code', '+91'),
        data.append('occupation', selectedOccupation),
        data.append('problem', selectedProblem),
        data.append('current_address', currentAddress);
      data.append(
        'place_of_birth',
        selectedLocation == null ? address : selectedLocation?.address,
      );
      data.append(
        'lon',
        selectedLocation == null ? userData?.lon : selectedLocation?.long,
      );
      data.append(
        'lat',
        selectedLocation == null ? userData?.lat : selectedLocation?.lat,
      );

      if (baseSixtyFour != null) {
        data.append('image', baseSixtyFour.toString());
      }
      await axios({
        method: 'post',
        url: api_url + upload_customer_pic,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: data,
      })
        .then(res => {
          updateState({isLoading: false});
          customer_profile();
        })
        .catch(err => {
          updateState({isLoading: false});
          console.log(err);
        });
    }
  };

  const customer_profile = async () => {
    updateState({isLoading: true});
    let data = new FormData();
    data.append('user_id', userData?.id);
    await axios({
      method: 'post',
      url: api_url + api2_get_profile,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: data,
    })
      .then(async res => {
        updateState({isLoading: false});
        await AsyncStorage.setItem(
          'customerData',
          JSON.stringify(res.data.user_details[0]),
        );
        await AsyncStorage.setItem(
          'isRegister',
          JSON.stringify({type: 'register', value: true}),
        );
        dispatch(UserActions.setUserData(res.data.user_details[0]));
        dispatch(UserActions.setWallet(res.data.user_details[0]?.wallet));
        MyMethods.create_firebase_account({
          userId: userData?.id,
          userAccount: userData?.phone,
        });
        showToastWithGravityAndOffset('Profile Updated');
        go_home();
      })
      .catch(err => {
        updateState({isLoading: false});
        console.log(err);
      });
  };

  const go_home = () => {
    navigation.goBack();
  };

  const get_profile_pick = useCallback((type, options) => {
    if (type == 'capture') {
      ImagePicker.launchCamera(options, res => {
        updateState({bottomSheetVisible: false});
        if (res.didCancel) {
          console.log('user cancel');
        } else if (res.errorCode) {
          console.log(res.errorCode);
        } else if (res.errorMessage) {
          console.log(res.errorMessage);
        } else {
          updateState({
            profileImage: res.assets[0].uri,
            baseSixtyFour: res.assets[0].base64,
          });
        }
      });
    } else {
      ImagePicker.launchImageLibrary(options, res => {
        updateState({bottomSheetVisible: false});
        if (res.didCancel) {
          console.log('user cancel');
        } else if (res.errorCode) {
          console.log(res.errorCode);
        } else if (res.errorMessage) {
          console.log(res.errorMessage);
        } else {
          updateState({
            profileImage: res.assets[0].uri,
            baseSixtyFour: res.assets[0].base64,
          });
        }
      });
    }
  }, []);

  const updateState = data => {
    setState(prevState => {
      const newState = {...prevState, ...data};
      return newState;
    });
  };

  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    genderFocus,
    birthDate,
    calenderVisible,
    timeVisible,
    time,
    baseSixtyFour,
    currentImage,
    profileImage,
    bottomSheetVisible,
    selectedOccupation,
    occupationFocus,
    selectedProblem,
    problemFocus,
    address,
    currentAddress,
    isLoading,
    callingCode,
    cca2,
    otpVisible,
    isPhoneVerified,
    otpValue,
  } = state;

  return (
    <View style={{flex: 1, backgroundColor: Colors.white}}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      <Loader visible={isLoading} />
      <View style={{flex: 1}}>
        <FlatList
          ListHeaderComponent={
            <>
              {header()}
              {profileImageInfo()}
              {firstNameLastNameInfo()}
              {emailInfo()}
              {phoneInput()}
              {GenderBirthInfo()}
              {TimeBirthBirthPlaceInfo()}
              {currentAddresInfo()}
              {occupationInfo()}
              {problemInfo()}
              {proceedButton()}
            </>
          }
        />
      </View>
      {bottomSheetInfo()}
      {otpVerificationInfo()}
    </View>
  );

  function otpVerificationInfo() {
    const CELL_COUNT = 4;
    const inputRef = createRef();

    const validation = () => {
      if (value == otpValue) {
        return true;
      }
      showToastWithGravityAndOffset('Wrong Otp');
      return false;
    };

    const verify_otp = async () => {
      try {
        if (validation()) {
          updateState({isLoading: true});
          const response = await ApiRequest.postRequest({
            url: api_url + update_customer_phone,
            data: {
              user_id: userData?.id,
              phone: phoneNumber,
            },
          });

          if (response?.success) {
            showToastWithGravityAndOffset(response?.message);
            dispatch(
              UserActions.setUserData({...userData, phone: phoneNumber}),
            );
            updateState({otpVisible: false, isPhoneVerified: true});
          }

          updateState({isLoading: false});
        }
      } catch (e) {
        console.log(e);
        updateState({isLoading: false});
      }
    };

    return (
      <BottomSheet isVisible={otpVisible}>
        <View
          style={{
            flex: 0,
            alignItems: 'center',
            padding: Sizes.fixPadding * 2,
            backgroundColor: Colors.white,
          }}>
          <CodeField
            ref={inputRef}
            {...otpprops}
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

          <TouchableOpacity
            onPress={verify_otp}
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
          <OtpTimer duration={60} onResend={() => {}} />
        </View>
      </BottomSheet>
    );
  }

  function bottomSheetInfo() {
    return (
      <BottomSheet
        isVisible={bottomSheetVisible}
        onBackdropPress={() => updateState({bottomSheetVisible: false})}>
        <View
          style={{
            flex: 0,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            padding: Sizes.fixPadding * 2,
            backgroundColor: Colors.white,
          }}>
          {camera_options.map(item => (
            <TouchableOpacity
              key={item.title}
              onPress={() => get_profile_pick(item.type, item.options)}
              style={{flex: 0, flexDirection: 'row', alignItems: 'center'}}>
              <Ionicons
                name={item.title == 'Camera' ? 'camera' : 'image'}
                size={25}
                color={Colors.blackLight}
              />
              <Text
                style={{
                  ...Fonts.primaryLight15RobotoMedium,
                  marginLeft: 5,
                }}>
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </BottomSheet>
    );
  }

  function proceedButton() {
    return (
      <View style={[styles.row, {justifyContent: 'space-evenly'}]}>
        <View
          style={{
            width: '42%',
            borderRadius: 1000,
            alignSelf: 'center',
            marginVertical: Sizes.fixPadding,
            overflow: 'hidden',
            borderWidth: 2,
            borderColor: Colors.primaryLight,
          }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
            style={{flex: 0, paddingVertical: Sizes.fixPadding * 0.6}}>
            <Text
              style={{
                ...Fonts.primaryLight15RobotoMedium,
                textAlign: 'center',
              }}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
        <LinearGradient
          colors={[Colors.primaryLight, Colors.primaryDark]}
          style={{
            width: '42%',
            borderRadius: 1000,
            alignSelf: 'center',
            marginVertical: Sizes.fixPadding,
            overflow: 'hidden',
          }}>
          <TouchableOpacity
            onPress={register}
            activeOpacity={0.8}
            style={{flex: 0, paddingVertical: Sizes.fixPadding * 0.8}}>
            <Text style={{...Fonts.white16RobotoMedium, textAlign: 'center'}}>
              Save
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }

  function problemInfo() {
    const renderItem = (item, selected) => {
      return (
        <View
          style={{
            padding: Sizes.fixPadding,
            borderBottomWidth: item._index + 1 != 1 ? 1 : 0,
            borderColor: Colors.gray,
            backgroundColor: Colors.white,
          }}>
          <Text
            style={
              selected
                ? {...Fonts.primaryLight15RobotoLight, textAlign: 'center'}
                : {...Fonts.gray14RobotoRegular, textAlign: 'center'}
            }>
            {item.label}
          </Text>
        </View>
      );
    };
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
        <View style={{flex: 0.25}}>
          <Text style={{...Fonts.gray14RobotoMedium}}>Problem</Text>
        </View>

        <Dropdown
          style={[
            styles.dropdown,
            problemFocus && {borderColor: Colors.primaryLight},
            {flex: 0.6},
          ]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          containerStyle={styles.dropdownContainer}
          iconStyle={styles.iconStyle}
          data={problemData}
          maxHeight={300}
          dropdownPosition="top"
          labelField="label"
          valueField="value"
          placeholder={!problemFocus ? 'Options' : '...'}
          value={selectedProblem}
          onFocus={() => updateState({problemFocus: true})}
          onBlur={() => updateState({problemFocus: false})}
          onChange={item => {
            updateState({selectedProblem: item.value, problemFocus: false});
          }}
          renderItem={renderItem}
        />
      </View>
    );
  }

  function occupationInfo() {
    const renderItem = (item, selected) => {
      return (
        <View
          style={{
            padding: Sizes.fixPadding,
            borderBottomWidth: item._index + 1 == 1 ? 0 : 1,
            borderColor: Colors.gray,
            backgroundColor: Colors.white,
          }}>
          <Text
            style={
              selected
                ? {...Fonts.primaryLight15RobotoLight, textAlign: 'center'}
                : {...Fonts.gray14RobotoRegular, textAlign: 'center'}
            }>
            {item.label}
          </Text>
        </View>
      );
    };
    return (
      <View
        style={{
          flex: 0,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          marginHorizontal: Sizes.fixPadding * 2,
        }}>
        <View style={{flex: 0.25}}>
          <Text style={{...Fonts.gray14RobotoMedium}}>Occupation</Text>
        </View>

        <Dropdown
          style={[
            styles.dropdown,
            occupationFocus && {borderColor: Colors.primaryLight},
            {flex: 0.6},
          ]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          containerStyle={styles.dropdownContainer}
          iconStyle={styles.iconStyle}
          data={occupationData}
          dropdownPosition="top"
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!occupationFocus ? 'Occupation' : '...'}
          value={selectedOccupation}
          onFocus={() => updateState({occupationFocus: true})}
          onBlur={() => updateState({occupationFocus: false})}
          onChange={item => {
            updateState({
              selectedOccupation: item.value,
            });
          }}
          renderItem={renderItem}
        />
      </View>
    );
  }

  function currentAddresInfo() {
    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 2,
          marginVertical: Sizes.fixPadding,
        }}>
        <Input
          value={currentAddress}
          placeholder="Current City"
          numberOfLines={2}
          placeholderTextColor={Colors.grayDark}
          onChangeText={text => updateState({currentAddress: text})}
          containerStyle={{flex: 0.45, padding: 0}}
          inputContainerStyle={{height: 30, borderBottomColor: Colors.gray}}
          inputStyle={{...Fonts.black16RobotoRegular}}
          // rightIcon={
          //   <Ionicons name="location-sharp" color={Colors.gray} size={25} />
          // }
        />
      </View>
    );
  }

  function TimeBirthBirthPlaceInfo() {
    const onSetTime = data => {
      updateState({timeVisible: false});
      if (data.type == 'set') {
        updateState({time: data.nativeEvent.timestamp});
      }
    };

    const show_time = () => {
      DateTimePickerAndroid.open({
        value: time == null ? new Date() : new Date(time),
        mode: 'time',
        is24Hour: false,
        onChange: onSetTime,
      });
    };
    return (
      <View>
        <View style={{flexDirection:'row'}}>
          <Text style={{color:'black', top: Sizes.fixPadding*1.5, marginHorizontal: Sizes.fixPadding*3}}> Time of Birth</Text>
          <Text style={{color:'black', top: Sizes.fixPadding*1.5, marginHorizontal: Sizes.fixPadding*4.7}}> Address</Text>
        </View>
      <View
        style={{
          flex: 0,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          margin: Sizes.fixPadding * 2,
        }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => show_time()}
          style={{
            ...styles.dropdown,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text style={{...Fonts.gray14RobotoRegular}}>
            {time == null ? 'Birth Time' : moment(time).format('hh:mm A')}{' '}
          </Text>
          <Ionicons name="chevron-down" color={Colors.black + '90'} size={16} />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('locationSearch')}
          style={{
            ...styles.dropdown,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text
            numberOfLines={1}
            style={{...Fonts.gray14RobotoRegular, flex: 1}}>
            {address.length == 0 ? 'Birth Place' : address}
          </Text>
          {/* <Ionicons name="chevron-down" color={Colors.black + '90'} size={16} /> */}
        </TouchableOpacity>
      </View>
      </View>
    );
  }

  function GenderBirthInfo() {
    const renderItem = (item, selected) => {
      return (
        <View
          style={{
            padding: Sizes.fixPadding,
            borderBottomWidth: item._index + 1 != 3 ? 1 : 0,
            borderColor: Colors.gray,
            backgroundColor: Colors.white,
          }}>
          <Text
            style={
              selected
                ? {...Fonts.primaryLight15RobotoLight, textAlign: 'center'}
                : {...Fonts.gray14RobotoRegular, textAlign: 'center'}
            }>
            {item.label}
          </Text>
        </View>
      );
    };

    const onChange = gender => {
      setGender(gender.value);
    };

    const onSetDate = (event, date) => {
      if (event.type == 'set') {
        updateState({birthDate: date});
      }
    };

    const show_date = () => {
      DateTimePickerAndroid.open({
        value: birthDate == null ? new Date() : new Date(birthDate),
        maximumDate: new Date(),
        minimumDate: new Date(1900, 0, 1),
        mode: 'date',
        display: 'calendar',
        onChange: onSetDate,
      });
    };

    return (
      <View>
        <View style={{flexDirection:'row'}}>
        <Text style={{color: 'black', marginHorizontal: Sizes.fixPadding * 3,marginBottom: Sizes.fixPadding*0.5,}}>Gender</Text>
        <Text style={{color: 'black', marginHorizontal: Sizes.fixPadding * 8.7,marginBottom: Sizes.fixPadding*0.5,}}>Date Of Birth</Text>

       </View>
        <View
          style={{
            flex: 0,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            marginHorizontal: Sizes.fixPadding * 2,
          }}>           
          <Dropdown
            style={[
              styles.dropdown,
              genderFocus && {borderColor: Colors.primaryLight},
            ]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            containerStyle={styles.dropdownContainer}
            iconStyle={styles.iconStyle}
            data={genderData}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!genderFocus ? 'Gender' : '...'}
            value={gender}
            onFocus={() => updateState({genderFocus: true})}
            onBlur={() => updateState({genderFocus: false})}
            onChange={onChange}
            renderItem={renderItem}
          />
          
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => show_date()}
            style={{
              ...styles.dropdown,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={{...Fonts.gray14RobotoRegular}}>
              {' '}
              {birthDate == null
                ? 'Birth Date'
                : moment(birthDate).format('Do MMM YYYY')}
            </Text>
            <Ionicons
              name="chevron-down"
              color={Colors.black + '90'}
              size={16}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function phoneInput() {
    const send_otp = async () => {
      try {
        updateState({isLoading: true});

        const response = await ApiRequest.postRequest({
          url: api_url + send_otp_to_customer,
          data: {
            phone: phoneNumber,
          },
        });

        console.log("response =====>>>>>>>>" , response)

        if (response) {
          if (response?.success) {
            showToastWithGravityAndOffset(response?.message);
            updateState({
              otpValue: response?.otp,
              otpVisible: true,
            });
          } else {
            showToastWithGravityAndOffset(response?.message);
          }
        }
        updateState({isLoading: false});
      } catch (e) {
        console.log(e);
        updateState({isLoading: false});
      }
    };
    return (
      <Input
        disabled={isPhoneVerified}
        value={phoneNumber}
        placeholder="Enter Mobile No."
        keyboardType="number-pad"
        maxLength={10}
        inputContainerStyle={styles.inputContainer}
        containerStyle={{height: 60}}
        onChangeText={text => {
          updateState({phoneNumber: text});
        }}
        inputStyle={{...Fonts.black16RobotoRegular}}
        leftIcon={
          <View style={styles.flagContainer}>
            <CountryPicker
              // disable
              countryCode={callingCode}
              containerStyle={styles.pickerStyle}
              pickerTitleStyle={styles.pickerTitleStyle}
              countryFlagStyle={{
                borderRadius: Sizes.fixPadding * 0.5,
                width: 30,
                height: 20,
                resizeMode: 'contain',
              }}
              dropDownImage={null}
              selectedCountryTextStyle={{
                ...Fonts.gray14RobotoRegular,
                marginLeft: Sizes.fixPadding,
              }}
              dropDownImageStyle={{width: 0}}
              countryNameTextStyle={{...Fonts.gray14RobotoRegular}}
              withCallingCode={false}
              hideCountryCode={false}
              withEmoji={true}
              onSelect={text => {
                console.log(text);
                // updateState({callingCode: text.callingCode, cca2: text.cca2})
              }}
            />
          </View>
        }
        rightIcon={
          !isPhoneVerified &&
          phoneNumber.length == 10 && (
            <TouchableOpacity activeOpacity={0.8} onPress={send_otp}>
              <Text style={{...Fonts.primaryLight14RobotoMedium}}>Verify</Text>
            </TouchableOpacity>
          )
        }
      />
    );
  }

  function emailInfo() {
    return (
      <View style={{marginHorizontal: Sizes.fixPadding * 2, height: 45}}>
        <Input
          value={email}
          placeholder="Email address"
          placeholderTextColor={Colors.grayDark}
          keyboardType="email-address"
          onChangeText={text => updateState({email: text})}
          containerStyle={{flex: 0.45, padding: 0}}
          inputContainerStyle={{height: 30, borderBottomColor: Colors.gray}}
          inputStyle={{...Fonts.black16RobotoRegular}}
        />
      </View>
    );
  }

  function firstNameLastNameInfo() {
    return (
      <View
        style={{
          flex: 0,
          flexDirection: 'row',
          alignItems: 'center',
          marginHorizontal: Sizes.fixPadding * 2,
          justifyContent: 'space-between',
          marginTop: Sizes.fixPadding,
          height: 40,
        }}>
        <Input
          value={firstName}
          placeholder="First Name"
          placeholderTextColor={Colors.grayDark}
          onChangeText={text => updateState({firstName: text})}
          containerStyle={{flex: 0.45, padding: 0}}
          inputContainerStyle={{height: 30, borderBottomColor: Colors.gray}}
          inputStyle={{...Fonts.black16RobotoRegular}}
        />
        <Input
          value={lastName}
          placeholder="Last Name"
          placeholderTextColor={Colors.grayDark}
          onChangeText={text => updateState({lastName: text})}
          containerStyle={{flex: 0.45, borderBottomColor: Colors.primaryDark}}
          inputContainerStyle={{height: 30, borderBottomColor: Colors.gray}}
          inputStyle={{...Fonts.black16RobotoRegular}}
        />
      </View>
    );
  }

  function profileImageInfo() {
    return (
      <TouchableOpacity
        onPress={() => updateState({bottomSheetVisible: true})}
        activeOpacity={0.8}
        style={styles.imageContainer}>
        <Image
          source={
            profileImage != null ? {uri: profileImage} : {uri: currentImage}
          }
          style={{
            width: '90%',
            height: '90%',
            borderRadius: 1000,
            borderWidth: 2,
            borderColor: Colors.primaryLight,
          }}
        />
        <View
          style={{
            width: 25,
            height: 25,
            backgroundColor: Colors.white,
            borderRadius: 100,
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
            right: 5,
            bottom: 5,
            elevation: 5,
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.2,
            shadowColor: Colors.blackLight,
          }}>
          <Image
            source={require('../assets/images/icons/upload.png')}
            style={{width: '70%', height: '70%'}}
          />
        </View>
      </TouchableOpacity>
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
          style={{
            position: 'absolute',
            zIndex: 99,
            padding: Sizes.fixPadding * 1.5,
          }}>
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
          Edit Profile
        </Text>
      </View>
    );
  }
};

const mapStateToProps = state => ({
  selectedLocation: state.user.selectedLocation,
  userData: state.user.userData,
});

const mapDispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);

const styles = StyleSheet.create({
  row: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    width: width * 0.27,
    height: width * 0.27,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginBottom: Sizes.fixPadding,
    shadowColor: Colors.blackLight,
    marginTop: Sizes.fixPadding,
  },
  inputContainer: {
    marginHorizontal: Sizes.fixPadding * 2,
    borderWidth: 1,
    borderColor: Colors.grayLight,
    borderRadius: Sizes.fixPadding * 2,
    paddingHorizontal: Sizes.fixPadding,
    paddingVertical: 0,
    height: 45,
  },
  dropdown: {
    flex: 0.45,
    height: 35,
    borderColor: Colors.gray,
    borderWidth: 1.5,
    borderRadius: Sizes.fixPadding * 1.5,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownContainer: {
    borderRadius: Sizes.fixPadding,
    elevation: 5,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowColor: Colors.gray,
    width: '90%',
    alignSelf: 'flex-end',
    marginTop: Sizes.fixPadding * 0.5,
    overflow: 'hidden',
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    ...Fonts.gray14RobotoRegular,
  },
  selectedTextStyle: {
    ...Fonts.gray14RobotoRegular,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  openButton: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: 'lightblue',
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderColor: 'black',
    borderWidth: 1,
    position: 'relative',
  },
  timeOption: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    backgroundColor: 'lightgray',
    borderRadius: 20,
  },
  selectedTime: {
    marginTop: 20,
    fontSize: 20,
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
    // height: 54,
    // width: 150,
    // marginVertical: 10,
    // borderColor: '#303030',
    alignItems: 'center',
    // marginHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    // borderWidth: 2,
    fontSize: 16,
    color: '#000',
  },
  selectedCountryTextStyle: {
    // paddingLeft: 5,
    color: '#000',
    textAlign: 'right',
  },

  countryNameTextStyle: {
    // paddingLeft: 10,
    color: '#000',
    textAlign: 'right',
  },

  searchBarStyle: {
    flex: 1,
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
