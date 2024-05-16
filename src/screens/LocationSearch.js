import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import {Colors, Fonts, Sizes} from '../assets/style';
import MyStatusBar from '../components/MyStatusBar';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {Input} from '@rneui/themed';
import {google_map_key} from '../config/constants';

import * as UserActions from '../redux/actions/UserActions';
import {connect} from 'react-redux';

const LocationSearch = ({navigation, dispatch, route}) => {
  return (
    <View style={{flex: 1, backgroundColor: Colors.bodyColor}}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      <View style={{flex: 1}}>
        <FlatList
          ListHeaderComponent={
            <>
              {header()}
              {titleAndDescriptionInfo()}
              {searchInfo()}
            </>
          }
        />
      </View>
    </View>
  );

  function searchInfo() {
    const on_done = (address, lat, long) => {
      if (route?.params?.flag == 2) {
        dispatch(
          UserActions.setMaleLocation({address: address, lat: lat, long: long}),
        );
      } else if (route?.params?.flag == 3) {
        dispatch(
          UserActions.setFemaleLocation({
            address: address,
            lat: lat,
            long: long,
          }),
        );
      } else {
        dispatch(
          UserActions.setLocation({address: address, lat: lat, long: long}),
        );
      }
      navigation.goBack();
    };
    const renderRow = (item, index) => {
      return (
        <View style={{flex: 0, flexDirection: 'row', alignItems: 'center'}}>
          <Ionicons name="location-outline" color={Colors.black} size={25} />
          <View style={{marginLeft: Sizes.fixPadding}}>
            <Text style={{...Fonts.black16RobotoRegular}}>
              {item.terms[0].value}
            </Text>
            <Text style={{...Fonts.gray14RobotoRegular}}>
              {item.description}
            </Text>
          </View>
        </View>
      );
    };
    return (
      <GooglePlacesAutocomplete
        placeholder="Search"
        enablePoweredByContainer={false}
        isRowScrollable={false}
        fetchDetails={true}
        onPress={(data, details) => {
          on_done(
            data.description,
            details.geometry?.location?.lat,
            details.geometry?.location?.lng,
          );
        }}
        keepResultsAfterBlur={true}
        currentLocation={true}
        textInputProps={{
          InputComp: Input,
          placeholder: 'Search locations',
          placeholderTextColor: Colors.gray,
          leftIcon: <AntDesign name="search1" color={Colors.black} size={22} />,
          containerStyle: styles.containerStyle,
          inputContainerStyle: styles.inputContainerStyle,
          inputStyle: styles.inputStyle,
          errorStyle: {color: 'red'},
        }}
        styles={{separator: {width: 0}}}
        renderRow={renderRow}
        query={{
          key: google_map_key,
          language: 'en',
        }}
      />
    );
  }

  function titleAndDescriptionInfo() {
    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 2,
          marginBottom: Sizes.fixPadding,
        }}>
        <Text style={{...Fonts.black22RobotoMedium}}>Search location</Text>
        <Text
          style={{
            ...Fonts.black14RobotoRegular,
            marginTop: Sizes.fixPadding * 0.5,
          }}>
          Enter your location to find them
        </Text>
      </View>
    );
  }

  function header() {
    return (
      <View style={{margin: Sizes.fixPadding}}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            padding: Sizes.fixPadding * 0.5,
            alignSelf: 'flex-start',
          }}>
          <AntDesign
            name="leftcircleo"
            color={Colors.primaryLight}
            size={Sizes.fixPadding * 2.2}
          />
        </TouchableOpacity>
      </View>
    );
  }
};

const mapDispatchToProps = dispatch => ({dispatch});

export default connect(null, mapDispatchToProps)(LocationSearch);

const styles = StyleSheet.create({
  containerStyle: {
    marginTop: Sizes.fixPadding * 1.2,
  },
  inputContainerStyle: {
    borderWidth: 1.5,
    borderBottomWidth: 1.5,
    marginHorizontal: Sizes.fixPadding,
    borderRadius: Sizes.fixPadding,
    borderColor: Colors.primaryDark,
    paddingHorizontal: Sizes.fixPadding,
  },
  inputStyle: {
    ...Fonts.black16RobotoRegular,
    letterSpacing: 1.2,
  },
});
