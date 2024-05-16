import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  ImageBackground,
} from 'react-native';
import React, {useState} from 'react';
import {Colors, Fonts, Sizes} from '../../assets/style';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MyStatusBar from '../../components/MyStatusBar';
import {SCREEN_WIDTH} from '../../config/Screen';
import LinearGradient from 'react-native-linear-gradient';
import {Input} from '@rneui/themed';
import DateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Dropdown} from 'react-native-element-dropdown';
import moment from 'moment';
import {api2_create_kundali, api_url} from '../../config/constants';
import axios from 'axios';
import {connect} from 'react-redux';
import * as UserActions from '../../redux/actions/UserActions';
import {showToastWithGravityAndOffset} from '../../methods/toastMessage';
import Loader from '../../components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';

const genderData = [
  {label: 'Male', value: 'male'},
  {label: 'Female', value: 'female'},
];

const FreeKundli = ({navigation, customerData, dispatch, selectedLocation}) => {
  const [state, setState] = useState({
    name: '',
    gender: null,
    birthDate: null,
    birthTime: null,
    birthPlace: '',
    timeVisible: false,
    genderFocus: false,
    calenderVisible: false,
    isLoading: false,
  });
  console.log('cu====>',customerData);
  console.log('sl========>',selectedLocation);

  
  const validation = () => {
    if (name.length == 0) {
      showToastWithGravityAndOffset('Please enter your name.');
      return false;
    } else if (gender == null) {
      showToastWithGravityAndOffset('Please select your gender.');
      return false;
    } else if (birthDate == null) {
      showToastWithGravityAndOffset('Please select your birth date.');
      return false;
    } else if (birthTime == null) {
      showToastWithGravityAndOffset('Please select your birth time.');
      return false;
    } else if (selectedLocation == null) {
      showToastWithGravityAndOffset('Please select your birth address.');
      return false;
    } else {
      return true;
    }
  };

  const create_kundli = async () => {
    if (validation()) {
      updateState({isLoading: true});
      await axios({
        method: 'post',
        url: api_url + api2_create_kundali,
        headers: {
          'content-type': 'multipart/form-data',
        },
        data: {
          user_id: customerData.id,
          customer_name: name,
          dob: moment(birthDate).format('YYYY-MM-DD'),
          tob: moment(birthTime).format('HH:mm'),
          gender: gender,
          latitude: selectedLocation?.lat,
          longitude: selectedLocation?.long,
          place: selectedLocation?.address,
        },
      })
        .then(res => {
          updateState({isLoading: false});
          if (res.data.status) {
            navigation.navigate('kundliList');
          }
        })
        .catch(err => {
          updateState({isLoading: false});
          console.log(err);
        });
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
    gender,
    birthDate, 
    birthPlace,
    birthTime,
    timeVisible,
    genderFocus,
    calenderVisible,
    isLoading,
  } = state;

  return (
    <View style={{flex: 1, backgroundColor: Colors.bodyColor}}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      <Loader visible={isLoading} />
      {header()}
      <LinearGradient
        colors={[Colors.primaryLight, Colors.primaryDark]}
        style={{flex: 1}}>
        <FlatList
          ListHeaderComponent={
            <>
              {kundliImageInfo()}
              {addNewProfileInfo()}
              {nameFieldInfo()}
              {genderBirthInfo()}
              {birthTimeBirthPlaceInfo()}
              {nextInfo()}
            </>
          }
        />
      </LinearGradient>
    </View>
  );

  function nextInfo() {
    const on_next = async()=>{
      const check_is_register = await AsyncStorage.getItem('isRegister');
      const isRegister = JSON.parse(check_is_register);
      if(isRegister?.value){
        create_kundli()
      }else{
        if(isRegister?.type == 'profile'){
          navigation.navigate('profile')
        }else{
          navigation.navigate('login')
        }
      }
    }
    return (
      <TouchableOpacity
        onPress={on_next}
        activeOpacity={0.8}
        style={{
          width: '35%',
          alignSelf: 'center',
          backgroundColor: Colors.whiteDark,
          paddingVertical: Sizes.fixPadding,
          borderRadius: 1000,
          marginVertical: Sizes.fixPadding * 2,
        }}>
        <Text
          style={{
            ...Fonts.black16RobotoMedium,
            textAlign: 'center',
            color: Colors.blackLight,
          }}>
          Next
        </Text>
      </TouchableOpacity>
    );
  }

  function birthTimeBirthPlaceInfo() {
    const onSetTime = data => {
      updateState({maleTimeVisible: false});
      if (data.type == 'set') {
        updateState({birthTime: data.nativeEvent.timestamp});
      }
    };

    const show_time = () => {
      DateTimePickerAndroid.open({
        value: birthTime == null ? new Date() : new Date(birthTime),
        mode: 'time',
        is24Hour: true,
        onChange: onSetTime,
      });
    };

    return (
      <View
        style={{
          flex: 0,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          marginVertical: Sizes.fixPadding * 2,
          marginHorizontal: Sizes.fixPadding,
        }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => show_time()}
          style={{
            ...styles.dropdown,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text style={{...Fonts.white14RobotoRegular}}>
            {birthTime == null
              ? 'Birth Time'
              : moment(birthTime).format('HH:mm')}{' '}
          </Text>
          <Ionicons name="chevron-down" color={Colors.white} size={16} />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('locationSearch')}
          style={{
            ...styles.dropdown,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text numberOfLines={1} style={{...Fonts.white14RobotoRegular}}>
            {selectedLocation == null
              ? 'Birth Place'
              : selectedLocation?.address}
          </Text>
          <Ionicons name="chevron-down" color={Colors.white} size={16} />
        </TouchableOpacity>
      </View>
    );
  }

  function genderBirthInfo() {
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

    const renderHeader = date => {
      return (
        <View style={{flex: 0, flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            style={{flex: 0, flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                ...Fonts.black16RobotoMedium,
                marginRight: Sizes.fixPadding * 0.5,
              }}>
              {moment(date.timestamp).format('MMMM')}
            </Text>
            <Ionicons
              name="chevron-down-outline"
              color={Colors.black}
              size={18}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 0,
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: Sizes.fixPadding * 1.5,
            }}>
            <Text
              style={{
                ...Fonts.gray16RobotoMedium,
                marginRight: Sizes.fixPadding * 0.5,
              }}>
              {moment(date.timestamp).format('YYYY')}
            </Text>
            <Ionicons
              name="chevron-down-outline"
              color={Colors.gray}
              size={18}
            />
          </TouchableOpacity>
        </View>
      );
    };

    const renderArrow = item => {
      return (
        <View
          style={{
            width: 30,
            height: 30,
            borderWidth: 1,
            borderRadius: Sizes.fixPadding * 0.4,
            borderColor: Colors.gray,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {item == 'left' ? (
            <MaterialCommunityIcons
              name="arrow-left-thin"
              color={Colors.black + '99'}
              size={20}
            />
          ) : (
            <MaterialCommunityIcons
              name="arrow-right-thin"
              color={Colors.black + '99'}
              size={20}
            />
          )}
        </View>
      );
    };

    const onChange = gender => {
      updateState({gender: gender.value});
    };

    const get_current_data = date => {
      let currentDate = date;
      let previousDate = new Date(currentDate);
      previousDate.setDate(currentDate.getDate() - 1);
      return previousDate;
    };

    const onSetDate = (event, date) => {
      if (event.type == 'set') {
        updateState({birthDate: date});
      }
    };

    const show_date = () => {
      DateTimePickerAndroid.open({
        value: birthDate == null ? new Date() : birthDate,
        mode: 'date',
        display: 'calendar',
        onChange: onSetDate,
      });
    };

    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding,
          marginBottom: Sizes.fixPadding,
        }}>
        <View
          style={{
            flex: 0,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
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
            iconColor="#fff"
          />
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => show_date()}
            style={{
              ...styles.dropdown,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={{...Fonts.white14RobotoRegular}}>
              {' '}
              {birthDate == null
                ? 'Birth Date'
                : moment(birthDate).format('Do MMM YYYY')}
            </Text>
            <Ionicons name="chevron-down" color={Colors.white} size={16} />
          </TouchableOpacity>
        </View>
        {calenderVisible && (
          <Calendar
            maxDate={get_current_data(new Date()).toString()}
            enableSwipeMonths
            markingType="custom"
            allowSelectionOutOfRange={false}
            onDayPress={day => {
              updateState({
                birthDate: day.dateString,
                calenderVisible: false,
              });
            }}
            markedDates={{
              [birthDate]: {
                selected: true,
                disableTouchEvent: true,
                selectedDotColor: 'orange',
                customStyles: {
                  container: {
                    borderRadius: 5,
                  },
                },
              },
            }}
            renderHeader={renderHeader}
            renderArrow={renderArrow}
            // dayComponent={dayComponent}
            theme={{
              backgroundColor: '#ffffff',
              calendarBackground: '#ffffff',
              textSectionTitleColor: '#b6c1cd',
              selectedDayBackgroundColor: Colors.primaryDark,
              selectedDayTextColor: '#ffffff',
              todayTextColor: Colors.primaryDark,
              dayTextColor: '#2d4150',
              textDisabledColor: Colors.grayLight,
            }}
            style={{
              borderWidth: 2,
              // marginHorizontal: Sizes.fixPadding * 2,
              marginTop: Sizes.fixPadding,
              borderColor: Colors.primaryDark,
              borderRadius: Sizes.fixPadding,
            }}
          />
        )}
      </View>
    );
  }

  function nameFieldInfo() {
    return (
      <Input
        value={name}
        placeholder="Your Name"
        placeholderTextColor={Colors.white}
        inputStyle={{textAlign: 'center', ...Fonts.white18RobotMedium}}
        onChangeText={text => updateState({name: text})}
        inputContainerStyle={{
          borderBottomColor: Colors.white,
          borderBottomWidth: 2,
        }}
        containerStyle={{
          marginVertical: Sizes.fixPadding,
          width: '80%',
          alignSelf: 'center',
        }}
        cursorColor={Colors.white}
      />
    );
  }

  function addNewProfileInfo() {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('kundliList')}
        activeOpacity={0.8}
        style={{
          width: '45%',
          alignSelf: 'center',
          backgroundColor: Colors.whiteDark,
          paddingVertical: Sizes.fixPadding,
          borderRadius: 1000,
          marginVertical: Sizes.fixPadding * 2,
        }}>
        <Text
          style={{
            ...Fonts.black16RobotoMedium,
            textAlign: 'center',
            color: Colors.blackLight,
          }}>
          Previous Profile
        </Text>
      </TouchableOpacity>
    );
  }

  function kundliImageInfo() {
    return (
      <ImageBackground
        source={require('../../assets/images/kundli_background.png')}
        style={{
          width: SCREEN_WIDTH,
          height: SCREEN_WIDTH * 0.7,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        resizeMode="contain">
        <Image
          source={require('../../assets/images/kundli.png')}
          style={{
            width: SCREEN_WIDTH * 0.9,
            height: '100%',
            resizeMode: 'contain',
            tintColor: 'yellow',
          }}
        />
      </ImageBackground>
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
          Free Kundli
        </Text>
      </View>
    );
  }
};

const mapStateToProps = state => ({
  selectedLocation: state.user.selectedLocation,
  customerData: state.user.userData,
  maleLocation: state.user.maleLocation,
  femaleLocation: state.user.femaleLocation,
});

const mapDispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, mapDispatchToProps)(FreeKundli);

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
  dropdown: {
    flex: 0.45,
    height: 35,
    borderColor: Colors.white,
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
    ...Fonts.white14RobotoRegular,
  },
  selectedTextStyle: {
    ...Fonts.white14RobotoRegular,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 14,
  },
});
