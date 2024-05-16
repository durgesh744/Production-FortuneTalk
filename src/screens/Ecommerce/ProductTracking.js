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
import {BottomSheet, Input} from '@rneui/themed';
import StepIndicator from 'react-native-step-indicator';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../config/Screen';
import Loader from '../../components/Loader';
import Stars from 'react-native-stars';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {TextInput} from 'react-native';
import {api_url, product_review} from '../../config/constants';
import axios from 'axios';
import {connect} from 'react-redux';
import database from '@react-native-firebase/database';

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

const ProductTracking = ({navigation, route, userData}) => {
  console.log(route?.params?.productData?.id);
  const [state, setState] = useState({
    reviewModalVisible: false,
    productData: route?.params?.productData,
    isLoading: false,
    ratingStar: 1,
    reviewMessage: '',
    statusData: null,
  });

  useEffect(() => {
    try {
      database()
        .ref(`ProductOrders/${productData?.id}`)
        .on('value', snapshot => {
          if(snapshot.val()){
            updateState({productData: snapshot.val()})
          }
        });
    } catch (e) {
      console.log(e);
    }
  }, []);

  const get_track_data = ()=>{
    
  }

  const add_review = async () => {
    updateState({isLoading: true});
    await axios({
      method: 'post',
      url: api_url + product_review,
      data: {
        customer_id: userData.id,
        product_id: productData?.id,
        rating: ratingStar,
        review: reviewMessage,
      },
    })
      .then(res => {
        updateState({isLoading: false});
        updateState({reviewModalVisible: false});
        // go_home();
      })
      .catch(err => {
        updateState({isLoading: false});
        console.log(err);
      });
  };

  const updateState = data => {
    setState(prevState => {
      const newData = {...prevState, ...data};
      return newData;
    });
  };

  const {
    reviewModalVisible,
    isLoading,
    ratingStar,
    productData,
    reviewMessage,
    statusData
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
              {trackingInfo()}
              {messageInfo()}
              {ratingInfo()}
            </>
          }
          contentContainerStyle={{paddingVertical: Sizes.fixPadding}}
        />
      </View>
      {reviewInfo()}
    </View>
  );

  function reviewInfo() {
    return (
      <BottomSheet
        isVisible={reviewModalVisible}
        onBackdropPress={() => updateState({reviewModalVisible: false})}>
        <View
          style={{
            backgroundColor: Colors.white,
            marginHorizontal: Sizes.fixPadding * 1.5,
            elevation: 8,
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.2,
            borderTopLeftRadius: Sizes.fixPadding * 3,
          }}>
          <Text
            style={{
              ...Fonts.gray18RobotoRegular,
              color: Colors.blackLight,
              textAlign: 'center',
              marginVertical: Sizes.fixPadding * 1.5,
              marginTop: Sizes.fixPadding * 2,
            }}>
            How was your{'\n'}experience on this product?
          </Text>
          <View style={{alignItems: 'center'}}>
            <Text style={{...Fonts.primaryLight18RobotoMedium}}>
              {/* {productData?.owner_name} */}
            </Text>
            <Text style={{...Fonts.gray14RobotoMedium}}>
              {/* {productData?.mainexperties} */}
            </Text>
            <View style={{marginVertical: Sizes.fixPadding * 1.5}}>
              <Stars
                default={ratingStar}
                count={5}
                half={true}
                starSize={32}
                update={val => updateState({ratingStar: val})}
                fullStar={
                  <Ionicons
                    name={'star'}
                    size={32}
                    color={Colors.primaryLight}
                  />
                }
                emptyStar={
                  <Ionicons
                    name={'star-outline'}
                    size={32}
                    color={Colors.primaryLight}
                  />
                }
                halfStar={
                  <Ionicons
                    name={'star-half'}
                    size={32}
                    color={Colors.primaryLight}
                  />
                }
              />
            </View>
            <Text style={{...Fonts.gray16RobotoMedium}}>Give Ratings</Text>
            <TextInput
              value={reviewMessage}
              placeholder="Tap to start typing"
              placeholderTextColor={Colors.gray}
              onChangeText={text => updateState({reviewMessage: text})}
              multiline
              style={{
                width: '90%',
                padding: Sizes.fixPadding,
                backgroundColor: Colors.grayLight,
                marginVertical: Sizes.fixPadding * 1.5,
                ...Fonts.black14InterMedium,
                height: 150,
                textAlignVertical: 'top',
                borderRadius: Sizes.fixPadding,
              }}
            />
            <TouchableOpacity
              activeOpacity={0.8}
              style={{width: '80%'}}
              onPress={add_review}>
              <LinearGradient
                colors={[Colors.primaryLight, Colors.primaryDark]}
                style={{
                  width: '100%',
                  paddingVertical: Sizes.fixPadding,
                  borderRadius: 1000,
                  marginVertical: Sizes.fixPadding * 2,
                }}>
                <Text
                  style={{...Fonts.white16RobotoMedium, textAlign: 'center'}}>
                  Submit
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheet>
    );
  }

  function ratingInfo() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => updateState({reviewModalVisible: true})}
        style={{
          alignSelf: 'center',
          backgroundColor: Colors.whiteDark,
          paddingVertical: Sizes.fixPadding * 0.5,
          paddingHorizontal: Sizes.fixPadding,
          borderRadius: 1000,
          marginVertical: Sizes.fixPadding * 1.5,
        }}>
        <Text style={{...Fonts.primaryDark16RobotoMedium}}>
          Rate this product now
        </Text>
      </TouchableOpacity>
    );
  }

  function messageInfo() {
    return (
      <Text style={{...Fonts.primaryDark16RobotoMedium, textAlign: 'center'}}>
        Hope you like our Product !!
      </Text>
    );
  }

  function trackingInfo() {
    const renderLabel = ({position, stepStatus, label, currentPosition}) => {
      return (
        <View
          style={{
            flex: 0,
            width: '98%',
          }}>
          <Text style={{...Fonts.gray14RobotoMedium, color: Colors.blackLight}}>
            {label.title}
          </Text>
          {label.date && (
            <Text style={{...Fonts.gray12RobotoMedium}}>{label.date}</Text>
          )}
          {label.sub_title && (
            <Text
              style={{...Fonts.gray12RobotoMedium, color: Colors.blackLight}}>
              {label.sub_title}
            </Text>
          )}
          {label.sub_date && (
            <Text style={{...Fonts.black12RobotoRegular}}>
              {label.sub_date}
            </Text>
          )}
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
          height: 700,
          borderRadius: Sizes.fixPadding,
          shadowColor: Colors.blackLight,
        }}>
        <StepIndicator
          direction="vertical"
          customStyles={styles.customStyles}
          currentPosition={statusData?.status}
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

const mapStateToProps = state => ({
  userData: state.user.userData,
  wallet: state.user.wallet,
});

export default connect(mapStateToProps, null)(ProductTracking);

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
