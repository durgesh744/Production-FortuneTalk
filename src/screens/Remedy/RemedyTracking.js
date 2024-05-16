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
import StepIndicator from 'react-native-step-indicator';
import {SCREEN_HEIGHT} from '../../config/Screen';

const labels = [
  {
    id: 1,
    title: "Order Confirmed Tue, 22nd Aug '23Your Order has been placed.",
    date: "Tue, 22nd Aug '23-5:28pm",
    sub_title: 'Item waiting to be picked up by courier partner.',
    sub_date: "Wed, 23rd Aug '23-4:00pm",
  },
  {
    id: 2,
    title: 'Shipped Expected By Thu 24th Aug',
    date: 'Item yet to be shipped. Expected by Thu, 24th Aug',
    sub_title: 'Item yet to reach hub nearest to you.',
    sub_date: null,
  },
  {
    id: 3,
    title: 'Out For Delivery',
    date: 'Item yet to be delivered.',
    sub_title: null,
    sub_date: null,
  },
  {
    id: 4,
    title: 'Delivery Expected By Fri 25th Aug',
    date: 'Item yet to be delivered.',
    sub_title: 'Expected by Fri, 25th Aug',
    sub_date: null,
  },
  {
    id: 5,
    title: 'Share the OTP to the delivery boy',
    date: null,
    sub_title: null,
    sub_date: null,
  },
];

const RemedyTracking = ({navigation}) => {
  return (
    <View style={{flex: 1, backgroundColor: Colors.bodyColor}}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      <View style={{flex: 1}}>
        {header()}
        <FlatList
          ListHeaderComponent={<>{trackingInfo()}</>}
          contentContainerStyle={{paddingVertical: Sizes.fixPadding}}
        />
      </View>
    </View>
  );

  function trackingInfo() {
    const renderLabel = ({position, stepStatus, label, currentPosition}) => {
      return (
        <View
          style={{
            marginHorizontal: Sizes.fixPadding,
            marginBottom: Sizes.fixPadding,
            alignSelf: 'flex-end',
            alignItem: 'flex-start',
          }}>
          <View style={{marginBottom: Sizes.fixPadding}}>
            <Text
              style={{...Fonts.black16RobotoMedium, color: Colors.blackLight}}>
              {label.title}
            </Text>
            {label.date && (
              <Text style={{...Fonts.gray14RobotoMedium}}>{label.date}</Text>
            )}
            {label.sub_title && (
              <Text
                style={{...Fonts.black14InterMedium, color: Colors.blackLight}}>
                {label.sub_title}
              </Text>
            )}
            {label.sub_date && (
              <Text style={{...Fonts.gray14RobotoMedium}}>
                {label.sub_date}
              </Text>
            )}
          </View>
        </View>
      );
    };
    return (
      <View
        style={{
          margin: Sizes.fixPadding * 2,
          backgroundColor: Colors.white,
          elevation: 8,
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.2,
          paddingHorizontal: Sizes.fixPadding * 2,
          height: 600
        }}>
        <StepIndicator
          direction="vertical"
          customStyles={styles.customStyles}
          currentPosition={2}
          labels={labels}
          renderLabel={renderLabel}
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
          Track order
        </Text>
      </View>
    );
  }
};

export default RemedyTracking;

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
  customStyles: {
    stepIndicatorSize: 25,
    currentStepIndicatorSize: 30,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: '#fe7013',
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: '#fe7013',
    stepStrokeUnFinishedColor: '#aaaaaa',
    separatorFinishedColor: '#fe7013',
    separatorUnFinishedColor: '#aaaaaa',
    stepIndicatorFinishedColor: '#fe7013',
    stepIndicatorUnFinishedColor: '#ffffff',
    stepIndicatorCurrentColor: '#ffffff',
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: '#fe7013',
    stepIndicatorLabelFinishedColor: '#ffffff',
    stepIndicatorLabelUnFinishedColor: '#aaaaaa',
    labelColor: '#999999',
    labelSize: 13,
    currentStepLabelColor: '#fe7013',
    labelAlign: 'flex-start',
  },
});
