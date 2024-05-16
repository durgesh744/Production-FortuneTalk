import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Image,
  StyleSheet,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Colors, Fonts, Sizes } from '../assets/style';
import MyStatusBar from '../components/MyStatusBar';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Input } from '@rneui/themed';
import { Dropdown } from 'react-native-element-dropdown';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import axios from 'axios';
import {
  api_url,
  get_expert,
  user_req_admin,
} from '../config/constants';
import { connect } from 'react-redux';
import { showToastWithGravityAndOffset } from '../methods/toastMessage';
import Loader from '../components/Loader';

const genderData = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
];

const experienceData = [
  { label: '1 Years', value: '1' },
  { label: '2 Years', value: '2' },
  { label: '3 Years', value: '3' },
  { label: '4 Years', value: '4' },
  { label: '5 Years', value: '5' },
  { label: '5 Years+', value: '5+' },
];

const languageData = [
  { label: 'Hindi', value: 'Hindi' },
  { label: 'English', value: 'English' },
  { label: 'Marathi', value: 'Marathi' },
  { label: 'Haryanvi', value: 'Haryanvi' },
  { label: 'Malyalam', value: 'Malyalam' },
  { label: 'Bangla', value: 'Bangla' },
];

const { width, height } = Dimensions.get('window');

const AstrologerApply = ({
  navigation,
  selectedLocation,
  route,
  dispatch,
  userData,
}) => {
  const [gender, setGender] = useState(null);
  const [experties, setExpertiesData] = useState(null);
  const [state, setState] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    pinCode: '',
    genderFocus: false,
    birthDate: null,
    time: null,
    currentAddress: '',
    baseSixtyFour: null,
    selectedLanguage: null,
    languageFocus: false,
    selectedExperience: null,
    experienceFocus: false,
    selectedExperties: null,
    expertiesFocus: false,
    isLoading: false,
  });



  const validation = () => {
    if (firstName.length == 0) {
      showToastWithGravityAndOffset('Please enter your first name.');
      return false;
    } else if (lastName.length == 0) {
      showToastWithGravityAndOffset('Please enter your last name.');
      return false;
    } else if (gender == null) {
      showToastWithGravityAndOffset('Please select your gender.');
      return false;
    } else if (birthDate == null) {
      showToastWithGravityAndOffset('Please select your birth date.');
      return false;
    } else if (email.length == 0) {
      showToastWithGravityAndOffset('Please enter your email address.');
      return false;
    } else if (selectedLanguage == null) {
      showToastWithGravityAndOffset('Please select your language.');
      return false;
    } else if (currentAddress.length == 0) {
      showToastWithGravityAndOffset('Please enter your current address.');
      return false;
    } else if (selectedExperience == null) {
      showToastWithGravityAndOffset('Please select your experience.');
      return false;
    } else if (selectedExperties == null) {
      showToastWithGravityAndOffset('Please select your experties.');
      return false;
    } else {
      return true;
    }
  };

  const applyAsAstrologer = async () => {
    if (validation()) {
      updateState({ isLoading: true });
      let data = new FormData();
      data.append('user_id', userData?.id),
        data.append('first_name', firstName),
        data.append('last_name', lastName),
        data.append('dob', moment(birthDate).format('YYYY-MM-DD'));
      data.append('gender', gender),
        data.append('email', email.length == 0 ? 'null' : email),
        data.append('phone_no', phoneNumber),
        data.append('experience', selectedExperience),
        data.append('expertise', selectedExperties),
        data.append('current_address', currentAddress);
      data.append('language', selectedLanguage);
      data.append('pincode', pinCode);

      await axios({
        method: 'post',
        url: api_url + user_req_admin,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: data,
      })
        .then(res => {
          if (res.data?.success) {
            showToastWithGravityAndOffset('Your request has been send.');
            setGender(null)
            updateState({
              firstName: '',
              lastName: '',
              email: '',
              phoneNumber: '',
              pinCode: '',
              birthDate: null,
              currentAddress: '',
              selectedLanguage: null,
              selectedExperience: null,
              selectedExperties: null,
            });
          }
          updateState({ isLoading: false });
        })
        .catch(err => {
          updateState({ isLoading: false });
          console.log(err);
        });
    }
  };

  useEffect(() => {
    get_experties();
  }, []);

  const get_experties = async () => {
    axios({
      method: 'get',
      url: api_url + get_expert,
    })
      .then(res => {
        if (res.data) {
          setExpertiesData(res.data.data);
        }
      })
      .catch(err => {
        console.log(err);
      })
  }

  const updateState = data => {
    setState(prevState => {
      const newState = { ...prevState, ...data };
      return newState;
    });
  };

  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    pinCode,
    genderFocus,
    birthDate,
    time,
    baseSixtyFour,
    selectedLanguage,
    languageFocus,
    selectedExperience,
    experienceFocus,
    selectedExperties,
    expertiesFocus,
    currentAddress,
    isLoading,
  } = state;


  console.log("selectedExperties =>>>>>>>>", selectedExperties)

  return (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      <Loader visible={isLoading} />
      <View style={{ flex: 1 }}>
        {header()}
        <FlatList
          ListHeaderComponent={
            <>
              {topNoteInfo()}
              {firstNameLastNameInfo()}
              {GenderBirthInfo()}
              {phoneInput()}
              {emailInfo()}
              {languageInfo()}
              {currentAddresInfo()}
              {pincodeInfo()}
              {experienceInfo()}
              {experties && expertiesInfo()}
              {proceedButton()}
            </>
          }
        />
      </View>
    </View>
  );

  function proceedButton() {
    return (
      <LinearGradient
        colors={[Colors.primaryLight, Colors.primaryDark]}
        style={{
          width: '70%',
          borderRadius: Sizes.fixPadding * 1.5,
          alignSelf: 'center',
          marginVertical: Sizes.fixPadding,
          overflow: 'hidden',
        }}>
        <TouchableOpacity
          onPress={applyAsAstrologer}
          activeOpacity={0.8}
          style={{ flex: 0, paddingVertical: Sizes.fixPadding * 0.8 }}>
          <Text style={{ ...Fonts.white18RobotMedium, textAlign: 'center' }}>
            Proceed
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  function expertiesInfo() {
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
                ? { ...Fonts.primaryLight15RobotoLight, textAlign: 'center' }
                : { ...Fonts.gray14RobotoRegular, textAlign: 'center' }
            }>
            {item.name}
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
          justifyContent: 'space-between',
          marginHorizontal: Sizes.fixPadding * 2,
          marginVertical: Sizes.fixPadding * 2,
        }}>
        <View style={{ flex: 0.25 }}>
          <Text style={{ ...Fonts.gray14RobotoRegular }}>Expertise</Text>
        </View>
        <Dropdown
          style={[
            styles.dropdown,
            expertiesFocus && { borderColor: Colors.primaryLight },
            { flex: 0.6 },
          ]}
          placeholderStyle={{ ...styles.placeholderStyle }}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          containerStyle={styles.dropdownContainer}
          iconStyle={styles.iconStyle}
          data={experties}
          maxHeight={300}
          dropdownPosition="top"
          labelField={experties.id}
          valueField={experties.name}
          placeholder={
            expertiesFocus ? '...' : selectedExperties
          }
          value={selectedExperties}
          onFocus={() => updateState({ expertiesFocus: true })}
          onBlur={() => updateState({ expertiesFocus: false })}
          onChange={item => {
            updateState({ selectedExperties: item.name });
          }}
          renderItem={renderItem}
        />
      </View>
    );
  }

  function experienceInfo() {
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
                ? { ...Fonts.primaryLight15RobotoLight, textAlign: 'center' }
                : { ...Fonts.gray14RobotoRegular, textAlign: 'center' }
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
          justifyContent: 'space-between',
          marginHorizontal: Sizes.fixPadding * 2,
          marginTop: Sizes.fixPadding * 2,
        }}>
        <View style={{ flex: 0.25 }}>
          <Text style={{ ...Fonts.gray14RobotoRegular }}>Experience</Text>
        </View>

        <Dropdown
          style={[
            styles.dropdown,
            experienceFocus && { borderColor: Colors.primaryLight },
            { flex: 0.6 },
          ]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          containerStyle={styles.dropdownContainer}
          iconStyle={styles.iconStyle}
          data={experienceData}
          dropdownPosition="top"
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!experienceFocus ? 'Select an Option' : '...'}
          value={selectedExperience}
          onFocus={() => updateState({ experienceFocus: true })}
          onBlur={() => updateState({ experienceFocus: false })}
          onChange={item => {
            updateState({
              selectedExperience: item.value,
            });
          }}
          renderItem={renderItem}
        />
      </View>
    );
  }

  function pincodeInfo() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginHorizontal: Sizes.fixPadding * 2,
        }}>
        <View style={{ flex: 0.25 }}>
          <Text style={{ ...Fonts.gray14RobotoRegular }}>Pincode</Text>
        </View>

        <Input
          value={pinCode}
          placeholder="000 000"
          keyboardType="number-pad"
          maxLength={10}
          onChangeText={text => updateState({ pinCode: text })}
          placeholderTextColor={Colors.grayMedium}
          inputContainerStyle={{
            ...styles.inputContainer,
            marginHorizontal: 0,
            height: 35,
          }}
          containerStyle={{ height: 35, flex: 0.62, paddingHorizontal: 0 }}
          inputStyle={{ ...Fonts.black14RobotoRegular }}
        />
      </View>
    );
  }

  function currentAddresInfo() {
    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding,
          marginVertical: Sizes.fixPadding,
        }}>
        <Input
          value={currentAddress}
          placeholder="Current Address"
          numberOfLines={2}
          placeholderTextColor={Colors.grayDark}
          onChangeText={text => updateState({ currentAddress: text })}
          containerStyle={{ flex: 0.45, padding: 0 }}
          inputContainerStyle={{ height: 30, borderBottomColor: Colors.gray }}
          inputStyle={{ ...Fonts.black14RobotoRegular }}
          rightIcon={
            <Ionicons name="location-sharp" color={Colors.gray} size={25} />
          }
        />
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
                ? { ...Fonts.primaryLight15RobotoLight, textAlign: 'center' }
                : { ...Fonts.gray14RobotoRegular, textAlign: 'center' }
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
        updateState({ birthDate: date });
      }
    };

    const show_date = () => {
      DateTimePickerAndroid.open({
        value: birthDate == null ? new Date() : birthDate,
        maximumDate: new Date(),
        minimumDate: new Date(1900, 1, 1),
        mode: 'date',
        display: 'calendar',
        onChange: onSetDate,
      });
    };

    return (
      <View
        style={{
          flex: 0,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginHorizontal: Sizes.fixPadding * 2,
          marginTop: Sizes.fixPadding * 1.5,
        }}>
        <Dropdown
          style={[
            styles.dropdown,
            genderFocus && { borderColor: Colors.primaryLight },
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
          onFocus={() => updateState({ genderFocus: true })}
          onBlur={() => updateState({ genderFocus: false })}
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
          <Text style={birthDate == null ? Fonts.gray14RobotoRegular : Fonts.black14RobotoRegular}>
            {' '}
            {birthDate == null
              ? 'Birth Date'
              : moment(birthDate).format('Do MMM YYYY')}
          </Text>
          <Ionicons name="chevron-down" color={Colors.black + '90'} size={16} />
        </TouchableOpacity>
      </View>
    );
  }

  function phoneInput() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginHorizontal: Sizes.fixPadding * 2,
          marginTop: Sizes.fixPadding * 3,
        }}>
        <View style={{ flex: 0.25 }}>
          <Text style={{ ...Fonts.gray14RobotoRegular }}>Mobile No.</Text>
        </View>

        <Input
          value={phoneNumber}
          placeholder="00000 00000"
          keyboardType="number-pad"
          maxLength={10}
          onChangeText={text => updateState({ phoneNumber: text })}
          placeholderTextColor={Colors.grayMedium}
          inputContainerStyle={{
            ...styles.inputContainer,
            marginHorizontal: 0,
            height: 35,
          }}
          containerStyle={{ height: 35, flex: 0.6, paddingHorizontal: 0 }}
          inputStyle={{ ...Fonts.black14RobotoRegular }}
        />
      </View>
    );
  }

  function languageInfo() {
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
                ? { ...Fonts.primaryLight15RobotoLight, textAlign: 'center' }
                : { ...Fonts.gray14RobotoRegular, textAlign: 'center' }
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
          justifyContent: 'space-between',
          marginHorizontal: Sizes.fixPadding * 2,
          marginVertical: Sizes.fixPadding * 1.5,
        }}>
        <View style={{ flex: 0.25 }}>
          <Text style={{ ...Fonts.gray14RobotoRegular }}>Language</Text>
        </View>

        <Dropdown
          style={[
            styles.dropdown,
            languageFocus && { borderColor: Colors.primaryLight },
            { flex: 0.6 },
          ]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          containerStyle={styles.dropdownContainer}
          iconStyle={styles.iconStyle}
          data={languageData}
          dropdownPosition="top"
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!languageFocus ? 'Select an Option' : '...'}
          value={selectedLanguage}
          onFocus={() => updateState({ languageFocus: true })}
          onBlur={() => updateState({ languageFocus: false })}
          onChange={item => {
            updateState({
              selectedLanguage: item.value,
            });
          }}
          renderItem={renderItem}
        />
      </View>
    );
  }

  function emailInfo() {
    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding,
          height: 45,
          marginTop: Sizes.fixPadding * 1.5,
        }}>
        <Input
          value={email}
          placeholder="Email address"
          placeholderTextColor={Colors.grayMedium}
          keyboardType="email-address"
          onChangeText={text => updateState({ email: text })}
          containerStyle={{ flex: 0.45, padding: 0 }}
          inputContainerStyle={{ height: 30, borderBottomColor: Colors.gray }}
          inputStyle={{ ...Fonts.black14RobotoRegular }}
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
          marginHorizontal: Sizes.fixPadding,
          justifyContent: 'space-between',
          marginTop: Sizes.fixPadding * 1.5,
          height: 40,
        }}>
        <Input
          value={firstName}
          placeholder="First Name"
          placeholderTextColor={Colors.grayMedium}
          onChangeText={text => updateState({ firstName: text })}
          containerStyle={{ flex: 0.45, padding: 0 }}
          inputContainerStyle={{ height: 30, borderBottomColor: Colors.gray }}
          inputStyle={{ ...Fonts.black14RobotoRegular }}
        />
        <Input
          value={lastName}
          placeholder="Last Name"
          placeholderTextColor={Colors.grayMedium}
          onChangeText={text => updateState({ lastName: text })}
          containerStyle={{ flex: 0.45, borderBottomColor: Colors.primaryDark }}
          inputContainerStyle={{ height: 30, borderBottomColor: Colors.gray }}
          inputStyle={{ ...Fonts.black14RobotoRegular }}
        />
      </View>
    );
  }

  function topNoteInfo() {
    return (
      <View
        style={{
          margin: Sizes.fixPadding * 1.5,
          padding: Sizes.fixPadding,
          backgroundColor: Colors.whiteDark,
          borderRadius: Sizes.fixPadding,
        }}>
        <Text style={{ ...Fonts.gray12RobotoMedium }}>
          Please Fill the form, after you submit the form. Our team will reach
          you soon.
        </Text>
      </View>
    );
  }

  function header() {
    return (
      <View
        style={{
          padding: Sizes.fixPadding * 1.5,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
          borderBottomWidth: 1,
          borderBottomColor: Colors.grayLight,
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
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
          Apply as an Astrologer
        </Text>
      </View>
    );
  }
};

const mapStateToProps = state => ({
  selectedLocation: state.user.selectedLocation,
  userData: state.user.userData,
});

const mapDispatchToProps = dispatch => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(AstrologerApply);

const styles = StyleSheet.create({
  imageContainer: {
    width: width * 0.3,
    height: width * 0.3,
    alignSelf: 'center',
    backgroundColor: Colors.white,
    borderRadius: 1000,
    borderWidth: 4,
    overflow: 'hidden',
    borderColor: Colors.white,
    elevation: 8,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    marginBottom: Sizes.fixPadding,
    shadowColor: Colors.blackLight,
  },
  inputContainer: {
    marginHorizontal: Sizes.fixPadding * 2,
    borderWidth: 1,
    borderColor: Colors.grayMedium,
    borderRadius: Sizes.fixPadding * 2,
    paddingHorizontal: Sizes.fixPadding,
    paddingVertical: 0,
    height: 45,
  },
  dropdown: {
    flex: 0.45,
    height: 35,
    borderColor: Colors.grayMedium,
    borderWidth: 1,
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
    ...Fonts.black14RobotoRegular,
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
});
