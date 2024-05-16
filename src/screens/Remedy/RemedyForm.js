import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors, Fonts, Sizes} from '../../assets/style';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MyStatusBar from '../../components/MyStatusBar';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Input} from '@rneui/themed';

const RemedyForm = ({navigation}) => {
  return (
    <View style={{flex: 1, backgroundColor: Colors.bodyColor}}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
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
    </View>
  );

  function continueButtonInfo() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={{
          marginHorizontal: Sizes.fixPadding * 2,
          marginVertical: Sizes.fixPadding*1.5,
          borderRadius: 1000,
          overflow: 'hidden',
        }}>
        <LinearGradient
          colors={[Colors.primaryLight, Colors.primaryDark]}
          style={{paddingVertical: Sizes.fixPadding*1.2}}>
          <Text style={{...Fonts.white18RobotMedium, textAlign: 'center'}}>
            Proceed for Payment
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  function currentLocationInfo() {
    return (
      <View style={[styles.row, {alignSelf: 'center'}]}>
        <MaterialCommunityIcons
          name="crosshairs-gps"
          color={Colors.primaryLight}
          size={26}
        />
        <Text style={{...Fonts.primaryLight18RobotoMedium, marginLeft: Sizes.fixPadding}}>Current Location</Text>
      </View>
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
          placeholder="Pincode"
          placeholderTextColor={Colors.gray}
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
          placeholder="City"
          placeholderTextColor={Colors.gray}
          inputStyle={styles.inputStyle}
          containerStyle={[styles.containerStyle, {width: '47%'}]}
          inputContainerStyle={styles.inputContainerStyle}
        />
        <Input
          placeholder="State"
          placeholderTextColor={Colors.gray}
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
          placeholder="Landmark"
          placeholderTextColor={Colors.gray}
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
          placeholder="Address"
          placeholderTextColor={Colors.gray}
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
          placeholder="Phone No."
          placeholderTextColor={Colors.gray}
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
          placeholder="Email ID"
          placeholderTextColor={Colors.gray}
          inputStyle={styles.inputStyle}
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
          placeholder="Name"
          placeholderTextColor={Colors.gray}
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

export default RemedyForm;

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
  inputStyle: {},
  containerStyle: {
    backgroundColor: Colors.whiteDark,
    borderRadius: Sizes.fixPadding,
    paddingTop: Sizes.fixPadding * 1.5,
    height: 70,
  },
  inputContainerStyle: {
    marginBottom: 0,
    paddingBottom: 0,
    height: 40,
    borderBottomColor: Colors.gray + '80',
  },
});
