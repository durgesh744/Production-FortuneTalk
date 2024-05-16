import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
  BackHandler,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors, Fonts, Sizes} from '../../assets/style';
import MyStatusBar from '../../components/MyStatusBar';
import MyHeader from '../../components/MyHeader';
import moment from 'moment';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../config/Screen';
import {CommonActions} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';

const ProductSuccessBooking = ({navigation, route}) => {
  const [orderData] = useState(route?.params?.data)
  console.log(orderData)
  useEffect(() => {
    const backAction = () => {
      go_home();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const go_home = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'home',
          },
        ],
      }),
    );
  };

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
              {successFullImageInfo()}
              {paymentDetailsInfo()}
              {trackOrderButtonInfo()}
            </>
          }
        />
      </View>
    </View>
  );

  function trackOrderButtonInfo() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate('productTracking')}
        style={{
          alignSelf: 'center',
          backgroundColor: Colors.whiteDark,
          paddingVertical: Sizes.fixPadding * 0.5,
          paddingHorizontal: Sizes.fixPadding,
          borderRadius: 1000,
        }}>
        <Text style={{...Fonts.primaryDark16RobotoMedium}}>
          Track Your order
        </Text>
      </TouchableOpacity>
    );
  }

  function paymentDetailsInfo() {
    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 2,
          marginTop: Sizes.fixPadding,
          backgroundColor: Colors.white,
          borderRadius: Sizes.fixPadding,
          elevation: 8,
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.2,
          shadowColor: Colors.blackLight,
          padding: Sizes.fixPadding,
          marginBottom: Sizes.fixPadding * 2,
        }}>
        <Text
          style={{
            ...Fonts.black18RobotoRegular,
            color: Colors.blackLight,
            textAlign: 'center',
            marginTop: Sizes.fixPadding,
          }}>
          Payment Detailes
        </Text>
        <Text
          style={{
            ...Fonts.primaryLight15RobotoMedium,
            textAlign: 'center',
            marginVertical: Sizes.fixPadding * 2,
          }}>
          Transaction Number: {orderData?.transation_no}
        </Text>
        <View style={styles.rowContainer}>
          <Text style={{...Fonts.gray14RobotoRegular}}>Total Paid</Text>
          <Text style={{...Fonts.gray14RobotoRegular}}>₹ {orderData?.price}</Text>
        </View>
        <View style={styles.rowContainer}>
          <Text style={{...Fonts.gray14RobotoRegular}}>Paid by</Text>
          <Text style={{...Fonts.gray14RobotoRegular}}>Razorpay</Text>
        </View>
        <View style={styles.rowContainer}>
          <Text style={{...Fonts.gray14RobotoRegular}}>Date</Text>
          <Text style={{...Fonts.gray14RobotoRegular}}>
            {moment(new Date()).format('DD MMM YYYY, hh:mm A')}
          </Text>
        </View>
      </View>
    );
  }

  function successFullImageInfo() {
    return (
      <View style={{height: SCREEN_HEIGHT * 0.3}}>
        <ImageBackground
          source={require('../../assets/gifs/celebration.gif')}
          style={{
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={require('../../assets/gifs/booking_successful.gif')}
            style={{width: '30%', height: '40%', resizeMode: 'contain'}}
          />
        </ImageBackground>
      </View>
    );
  }

  function header() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => go_home()}>
          <AntDesign
            name="leftcircleo"
            color={Colors.primaryLight}
            size={24}
            style={{alignSelf: 'center'}}
          />
        </TouchableOpacity>
        <View style={styles.textContainer}>
          <Text
            style={{...Fonts.primaryLight15RobotoMedium, textAlign: 'center'}}>
            Booking Successfull
          </Text>
        </View>
      </View>
    );
  }
};

export default ProductSuccessBooking;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: Sizes.fixPadding * 2,
    paddingVertical: Sizes.fixPadding * 1.3,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayLight,
  },
  textContainer: {
    width: SCREEN_WIDTH,
    alignContent: 'center',
    justifyContent: 'center',
    position: 'absolute',
    padding: Sizes.fixPadding * 1.3,
    zIndex: -1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayLight,
    marginBottom: Sizes.fixPadding * 2,
  },
});
