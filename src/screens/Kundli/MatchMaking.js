import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors, Fonts, Sizes} from '../../assets/style';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MyStatusBar from '../../components/MyStatusBar';
import {SCREEN_WIDTH} from '../../config/Screen';
import LinearGradient from 'react-native-linear-gradient';
import {Input} from '@rneui/themed';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import {Dropdown} from 'react-native-element-dropdown';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import axios from 'axios';
import {api2_create_kundali, api_url} from '../../config/constants';
import {match_making} from '../../config/constants';
import {connect} from 'react-redux';
import {showToastWithGravityAndOffset} from '../../methods/toastMessage';
import Loader from '../../components/Loader';
import * as UserActions from '../../redux/actions/UserActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';

const genderData = [
  {label: 'Male', value: 'male'},
  {label: 'Female', value: 'female'},
];
const MatchMaking =  ({
  navigation,
  maleLocation,
  femaleLocation,
  customerData,
  dispatch,
}) => {
  const [state, setState] = useState({
    maleFirstName: '',
    maleLastName: '',
    femaleFirstName: '',
    femaleLastName: '',
    gender: null,
    maleBirthDate: null,
    maleBirthTime: null,
    femaleBirthDate: null,
    femaleBirthTime: null,
    maleTimeVisible: false,
    femaleTimeVisible: false,
    maleGenderFocus: false,
    femaleGenderFocus: false,
    maleCalenderVisible: false,
    femaleCalenderVisible: false,
    isLoading: false,
  });

  
    const route = useRoute();
    

  const validation = () => {
    if (maleFirstName.length == 0) {
      showToastWithGravityAndOffset('Please enter male first name.');
      return false;
    } else if (maleLastName.length == 0) {
      showToastWithGravityAndOffset('Please enter male last name.');
      return false;
    } else if (gender == null) {
      showToastWithGravityAndOffset('Please select Gender.');
      return false;
    } else if (maleBirthDate == null) {
      showToastWithGravityAndOffset('Please select male birth date.');
      return false;
    } else if (maleBirthTime == null) {
      showToastWithGravityAndOffset('Please select male birth time.');
      return false;
    } else if (maleLocation == null) {
      showToastWithGravityAndOffset('Please select male birth address.');
      return false;
    } else if (femaleFirstName.length == 0) {
      showToastWithGravityAndOffset('Please enter female first name.');
      return false;
    } else if (femaleLastName.length == 0) {
      showToastWithGravityAndOffset('Please enter female last name.');
      return false;
    } else if (femaleBirthDate == null) {
      showToastWithGravityAndOffset('Please select female birth date.');
      return false;
    } else if (femaleBirthTime == null) {
      showToastWithGravityAndOffset('Please select female birth time.');
      return false;
    } else if (femaleLocation == null) {
      showToastWithGravityAndOffset('Please select female birth address.');
      return false;
    } else {
      return true;
    }
  };


  const get_matching = async () => {
    if (validation()) {
      try {
        updateState({isLoading: true});
        const male_kundli = await axios({
          method: 'post',
          url: api_url + api2_create_kundali,
          headers: {
            'content-type': 'multipart/form-data',
          },
          data: {
            user_id: customerData.id,
            customer_name: `${maleFirstName} ${maleLastName}`,
            dob: moment(maleBirthDate).format('YYYY-MM-DD'),
            tob: moment(maleBirthTime).format('HH:mm:ss'),
            gender: 'male',
            latitude: maleLocation?.lat,
            longitude: maleLocation?.long,
            place: maleLocation?.address,
          },
        });

        const female_kundli = await axios({
          method: 'post',
          url: api_url + api2_create_kundali,
          headers: {
            'content-type': 'multipart/form-data',
          },
          data: {
            user_id: customerData.id,
            customer_name: `${femaleFirstName} ${femaleLastName}`,
            dob: moment(femaleBirthDate).format('YYYY-MM-DD'),
            tob: moment(femaleBirthTime).format('HH:mm:ss'),
            gender: 'female',
            latitude: femaleLocation?.lat,
            longitude: femaleLocation?.long,
            place: femaleLocation?.address,
          },
        });

        await axios({
          method: 'post',
          url: api_url + match_making,
          headers: {
            'content-type': 'multipart/form-data',
          },
          data: {
            male_dob: moment(maleBirthDate).format('YYYY-MM-DD'),
            male_tob: moment(maleBirthTime).format('HH:mm:ss'),
            male_lat: maleLocation?.lat,
            male_long: maleLocation?.long,
            female_dob: moment(femaleBirthDate).format('YYYY-MM-DD'),
            female_tob: moment(femaleBirthTime).format('HH:mm:ss'),
            female_lat: femaleLocation?.lat,
            female_long: femaleLocation?.long,
          },
        })
          .then(res => {
            updateState({isLoading: false});
            dispatch(UserActions.setFemaleLocation(null));
            dispatch(UserActions.setMaleLocation(null));
            navigation.navigate('matchingReport', {
              data: res.data.match_astro_details,
              maleKundliData: {
                kundali_id: male_kundli.data.kundli_id,
                customer_name: `${maleFirstName} ${maleLastName}`,
                dob: maleBirthDate,
                tob: maleBirthTime,
                latitude: maleLocation?.lat,
                longitude: maleLocation?.long,
                place: maleLocation?.address,
              },
              femaleKundliData: {
                kundali_id: female_kundli.data.kundli_id,
                customer_name: `${femaleFirstName} ${femaleLastName}`,
                dob: femaleBirthDate,
                tob: femaleBirthTime,
                latitude: femaleLocation?.lat,
                latitude: femaleLocation?.long,
                place: femaleLocation?.address,
              },
            });
          })
          .catch(err => {
            updateState({isLoading: false});
            console.log(err);
          });
      } catch (e) {
        updateState({isLoading: false});
        console.log(e);
      }
    }
  };

  const updateState = data => {
    setState(prevState => {
      const newData = {...prevState, ...data};
      return newData;
    });
  };

  const {
    maleFirstName,
    maleLastName,
    femaleFirstName,
    femaleLastName,
    gender,
    maleBirthDate,
    maleBirthTime,
    femaleBirthDate,
    femaleBirthTime,
    maleTimeVisible,
    femaleTimeVisible,
    maleCalenderVisible,
    femaleCalenderVisible,
    maleGenderFocus,
    femaleGenderFocus,
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
      <View style={{flex: 1}}>
        <FlatList
          ListHeaderComponent={
            <>
              {bannerInfo()}
              {firstProfileInfo()}
              {secondProfileInfo()}
              {submitInfo()}
            </>
          }
        />
      </View>
    </View>
  );

  function submitInfo() {
    const on_next = async()=>{
      const check_is_register = await AsyncStorage.getItem('isRegister');
      const isRegister = JSON.parse(check_is_register);
      if(isRegister?.value){
        get_matching()
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
        style={{margin: Sizes.fixPadding * 2}}>
        <LinearGradient
          colors={[Colors.primaryLight, Colors.primaryDark]}
          style={{
            paddingHorizontal: Sizes.fixPadding * 1.5,
            paddingVertical: Sizes.fixPadding,
            borderRadius: 1000,
          }}>
          <Text style={{...Fonts.white14RobotoRegular, textAlign: 'center'}}>
            Submit
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  function secondProfileInfo() {
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

    const onSetTime = data => {
      updateState({femaleTimeVisible: false});
      if (data.type == 'set') {
        updateState({femaleBirthTime: data.nativeEvent.timestamp});
      }
    };

    const onSetDate = (event, date) => {
      updateState({femaleTimeVisible: false});
      if (event.type == 'set') {
        updateState({femaleBirthDate: date});
      }
    };

    const show_time = () => {
      DateTimePickerAndroid.open({
        value: femaleBirthTime == null ? new Date() : new Date(femaleBirthTime),
        mode: 'time',
        is24Hour: true,
        onChange: onSetTime,
      });
    };

    const show_date = () => {
      DateTimePickerAndroid.open({
        value: femaleBirthDate == null ? new Date() : femaleBirthDate,
        mode: 'date',
        onChange: onSetDate,
      });
    };

    return (
      <View
        style={{
          padding: Sizes.fixPadding * 2,
          borderBottomWidth: 1,
          borderBottomColor: Colors.grayLight,
        }}>
        <View
          style={[
            styles.row,
            {
              justifyContent: 'space-between',
              marginBottom: Sizes.fixPadding * 2,
            },
          ]}>
          <Text
            style={{...Fonts.black16RobotoRegular, color: Colors.blackLight}}>
            First Profile
          </Text>
          <TouchableOpacity
          onPress={() => navigation.navigate('MatchingKundliList')}>
            <LinearGradient
              colors={[Colors.primaryLight, Colors.primaryDark]}
              style={{
                paddingHorizontal: Sizes.fixPadding * 1.5,
                paddingVertical: Sizes.fixPadding * 0.6,
                borderRadius: 1000,
              }}>
              <Text style={{...Fonts.white14RobotoRegular}}>Previous Profile</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <View
          style={{
            backgroundColor: Colors.grayLight,
            padding: Sizes.fixPadding,
            borderRadius: Sizes.fixPadding,
          }}>
          <View
            style={{
              flex: 0,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: Sizes.fixPadding,
              height: 40,
            }}>
            <Input
              value={femaleFirstName}
              placeholder="First Name"
              placeholderTextColor={Colors.grayDark}
              onChangeText={text => updateState({femaleFirstName: text})}
              containerStyle={{flex: 0.45, padding: 0}}
              inputContainerStyle={{height: 30, borderBottomColor: Colors.gray}}
              inputStyle={{...Fonts.black14RobotoRegular}}
            />
            <Input
              value={femaleLastName}
              placeholder="Last Name"
              placeholderTextColor={Colors.grayDark}
              onChangeText={text => updateState({femaleLastName: text})}
              containerStyle={{
                flex: 0.45,
                borderBottomColor: Colors.primaryDark,
              }}
              inputContainerStyle={{height: 30, borderBottomColor: Colors.gray}}
              inputStyle={{...Fonts.black14RobotoRegular}}
            />
          </View>
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
                femaleGenderFocus && {borderColor: Colors.primaryLight},
              ]}
              disable
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              containerStyle={styles.dropdownContainer}
              iconStyle={styles.iconStyle}
              data={genderData}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!femaleGenderFocus ? 'Gender' : '...'}
              value={gender == 'male' ? 'female' : 'male'}
              onFocus={() => updateState({femaleGenderFocus: true})}
              onBlur={() => updateState({femaleGenderFocus: false})}
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
                {femaleBirthDate == null
                  ? 'Birth Date'
                  : moment(femaleBirthDate).format('Do MMM YYYY')}
              </Text>
              <Ionicons
                name="chevron-down"
                color={Colors.black + '90'}
                size={16}
              />
            </TouchableOpacity>
          </View>
          {femaleCalenderVisible && (
            <Calendar
              maxDate={get_current_data(new Date()).toString()}
              enableSwipeMonths
              markingType="custom"
              allowSelectionOutOfRange={false}
              onDayPress={day => {
                updateState({
                  femaleBirthDate: day.dateString,
                  femaleCalenderVisible: false,
                });
              }}
              markedDates={{
                [femaleBirthDate]: {
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
                //   marginHorizontal: Sizes.fixPadding * 2,
                marginTop: Sizes.fixPadding,
                borderColor: Colors.primaryDark,
                borderRadius: Sizes.fixPadding,
              }}
            />
          )}
          <View
            style={{
              flex: 0,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
              marginVertical: Sizes.fixPadding * 2,
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
                {femaleBirthTime == null
                  ? 'Birth Time'
                  : moment(femaleBirthTime).format('HH:mm')}{' '}
              </Text>
              <Ionicons
                name="chevron-down"
                color={Colors.black + '90'}
                size={16}
              />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate('locationSearch', {
                  flag: 3,
                })
              }
              style={{
                ...styles.dropdown,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text numberOfLines={1} style={{...Fonts.gray14RobotoRegular}}>
                {femaleLocation == null
                  ? 'Birth Place'
                  : femaleLocation?.address}
              </Text>
              <Ionicons
                name="chevron-down"
                color={Colors.black + '90'}
                size={16}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  function firstProfileInfo() {
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

    const onSetTime = data => {
      updateState({maleTimeVisible: false});
      if (data.type == 'set') {
        updateState({maleBirthTime: data.nativeEvent.timestamp});
      }
    };

    const onSetDate = (event, date) => {
      if (event.type == 'set') {
        updateState({maleBirthDate: date});
      }
    };

    const show_time = () => {
      DateTimePickerAndroid.open({
        value: maleBirthTime == null ? new Date() : new Date(maleBirthTime),
        mode: 'time',
        is24Hour: true,
        onChange: onSetTime,
      });
    };

    const show_date = () => {
      DateTimePickerAndroid.open({
        value: maleBirthDate == null ? new Date() : maleBirthDate,
        mode: 'date',
        display: 'calendar',
        onChange: onSetDate,
      });
    };

    return (
      <View
        style={{
          padding: Sizes.fixPadding * 2,
          borderBottomWidth: 1,
          borderBottomColor: Colors.grayLight,
        }}>
        <View
          style={[
            styles.row,
            {
              justifyContent: 'space-between',
              marginBottom: Sizes.fixPadding * 2,
            },
          ]}>
          <Text
            style={{...Fonts.black16RobotoRegular, color: Colors.blackLight}}>
            First Profile
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('MatchingKundliList')}>
            <LinearGradient
              colors={[Colors.primaryLight, Colors.primaryDark]}
              style={{
                paddingHorizontal: Sizes.fixPadding * 1.5,
                paddingVertical: Sizes.fixPadding * 0.6,
                borderRadius: 1000,
              }}>
              <Text style={{...Fonts.white14RobotoRegular}}>Previous Profile</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <View
          style={{
            backgroundColor: Colors.grayLight,
            padding: Sizes.fixPadding,
            borderRadius: Sizes.fixPadding,
          }}>
          <View
            style={{
              flex: 0,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: Sizes.fixPadding,
              height: 40,
            }}>
            <Input
              value={maleFirstName}
              placeholder="First Name"
              placeholderTextColor={Colors.grayDark}
              onChangeText={text => updateState({maleFirstName: text})}
              containerStyle={{flex: 0.45, padding: 0}}
              inputContainerStyle={{height: 30, borderBottomColor: Colors.gray}}
              inputStyle={{...Fonts.black14RobotoRegular}}
            />
            <Input
              value={maleLastName}
              placeholder="Last Name"
              placeholderTextColor={Colors.grayDark}
              onChangeText={text => updateState({maleLastName: text})}
              containerStyle={{
                flex: 0.45,
                borderBottomColor: Colors.primaryDark,
              }}
              inputContainerStyle={{height: 30, borderBottomColor: Colors.gray}}
              inputStyle={{...Fonts.black14RobotoRegular}}
            />
          </View>
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
                maleGenderFocus && {borderColor: Colors.primaryLight},
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
              placeholder={!maleGenderFocus ? 'Gender' : '...'}
              value={gender}
              onFocus={() => updateState({maleGenderFocus: true})}
              onBlur={() => updateState({maleGenderFocus: false})}
              onChange={onChange}
              renderItem={renderItem}
            />
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                show_date()
              }
              style={{
                ...styles.dropdown,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text style={{...Fonts.gray14RobotoRegular}}>
                {' '}
                {maleBirthDate == null
                  ? 'Birth Date'
                  : moment(maleBirthDate).format('Do MMM YYYY')}
              </Text>
              <Ionicons
                name="chevron-down"
                color={Colors.black + '90'}
                size={16}
              />
            </TouchableOpacity>
          </View>
          {maleCalenderVisible && (
            <Calendar
              maxDate={get_current_data(new Date()).toString()}
              enableSwipeMonths
              markingType="custom"
              allowSelectionOutOfRange={false}
              onDayPress={day => {
                updateState({
                  maleBirthDate: day.dateString,
                  maleCalenderVisible: false,
                });
              }}
              markedDates={{
                [maleBirthDate]: {
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
          <View
            style={{
              flex: 0,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
              marginVertical: Sizes.fixPadding * 2,
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
                {maleBirthTime == null
                  ? 'Birth Time'
                  : moment(maleBirthTime).format('HH:mm')}{' '}
              </Text>
              <Ionicons
                name="chevron-down"
                color={Colors.black + '90'}
                size={16}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('locationSearch', {
                  flag: 2,
                })
              }
              activeOpacity={0.8}
              style={{
                ...styles.dropdown,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text numberOfLines={1} style={{...Fonts.gray14RobotoRegular}}>
                {maleLocation == null ? 'Birth Place' : maleLocation?.address}
              </Text>
              <Ionicons
                name="chevron-down"
                color={Colors.black + '90'}
                size={16}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  function bannerInfo() {
    return (
      <View
        style={[
          styles.center,
          {
            paddingVertical: Sizes.fixPadding * 1.5,
            borderBottomWidth: 1,
            borderBottomColor: Colors.grayLight,
          },
        ]}>
        <Image
          source={require('../../assets/images/match_making.png')}
          style={{
            width: SCREEN_WIDTH * 0.6,
            height: SCREEN_WIDTH * 0.6,
            resizeMode: 'contain',
          }}
        />
      </View>
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
          Kundli Matching
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

export default connect(mapStateToProps, mapDispatchToProps)(MatchMaking);

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
    fontSize: 14,
  },
});
