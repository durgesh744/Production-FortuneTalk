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
import Carousel from 'react-native-reanimated-carousel';
import {SCREEN_WIDTH} from '../../config/Screen';
import {useSharedValue} from 'react-native-reanimated';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Payment from '../../components/Payment';
import {Modal} from 'react-native-paper';
import {api_url} from '../../config/constants';
import {MyMethods} from '../../methods/my_methods';

const CourseBookingDetails = ({navigation, route}) => {
  console.log(route.params?.data);
  const [state, setState] = useState({
    showPayment: false,
    successVisible: false,
    paymentData: route.params?.data,
  });

  function gst_amount() {
    return ((parseFloat(paymentData?.price) * 3.0) / 100).toFixed(2);
  }

  function total_amount() {
    return (
      parseFloat(paymentData?.price) +
      (parseFloat(paymentData?.price) * 3.0) / 100
    );
  }

  const updateState = data => {
    setState(prevState => {
      const newData = {...prevState, ...data};
      return newData;
    });
  };

  const {showPayment, successVisible, paymentData} = state;

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
              {paymentData?.image && bannerInfo()}
              {remediesInfo()}
              {addressInfo()}
              {billDetailsInfo()}
            </>
          }
          contentContainerStyle={{paddingVertical: Sizes.fixPadding}}
        />
        {continueButtonInfo()}
        {successModalInfo()}
      </View>
      <Payment
        showPayment={showPayment}
        updateState={updateState}
        type={paymentData?.type}
        amount={total_amount()}
        apiData={paymentData?.apiData}
      />
    </View>
  );

  function successModalInfo() {
    const on_go_to_history = () => {
      if (paymentData?.type == 'paid_pdf') {
        MyMethods.download_file({uri: api_url + paymentData?.pdf_name});
        navigation.pop(5);
      } else {
        updateState({successVisible: false});
        navigation.pop(5);
        navigation.navigate('myCourses')
      }
    };
    return (
      <Modal visible={successVisible} dismissable={false}>
        <View
          style={{
            backgroundColor: Colors.white,
            marginHorizontal: Sizes.fixPadding * 2,
            borderRadius: Sizes.fixPadding,
            padding: Sizes.fixPadding * 1.5,
          }}>
          <Text
            style={{
              ...Fonts.primaryLight18RobotoMedium,
              color: Colors.green_a,
              textAlign: 'center',
            }}>
            Booking Successfull !!!
          </Text>

          <View
            style={{
              backgroundColor: Colors.whiteDark,
              paddingVertical: Sizes.fixPadding,
              paddingHorizontal: Sizes.fixPadding * 1.2,
              borderRadius: Sizes.fixPadding,
              marginTop: Sizes.fixPadding,
            }}>
            {paymentData?.image && (
              <Image
                source={{uri: paymentData?.image}}
                style={{
                  width: '100%',
                  height: 130,
                  borderRadius: Sizes.fixPadding,
                }}
              />
            )}

            <Text
              style={{
                ...Fonts.primaryLight15RobotoMedium,
                textAlign: 'center',
                marginVertical: Sizes.fixPadding,
              }}>
              {paymentData?.title}
            </Text>
            <View
              style={{
                alignSelf: 'center',
                backgroundColor: Colors.white,
                elevation: 5,
                shadowColor: Colors.blackLight,
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.2,
                paddingHorizontal: Sizes.fixPadding,
                paddingVertical: Sizes.fixPadding * 0.8,
                borderRadius: Sizes.fixPadding,
              }}>
              <Text style={{...Fonts.gray16RobotoMedium}}>
                Paid Amount - ₹ {total_amount()}
              </Text>
            </View>
            <View
              style={{
                borderBottomWidth: 1,
                width: '100%',
                marginVertical: Sizes.fixPadding * 1.5,
                borderBottomColor: Colors.grayLight,
              }}
            />
            <View
              style={[
                styles.row,
                {
                  alignSelf: 'center',
                },
              ]}>
              <View
                style={{
                  width: 45,
                  height: 45,
                  borderRadius: 1000,
                  elevation: 5,
                  shadowOffset: {
                    width: 0,
                    height: 1,
                  },
                  shadowOpacity: 0.2,
                  borderWidth: 1.5,
                  borderColor: Colors.white,
                  overflow: 'hidden',
                }}>
                <Image
                  source={{uri: paymentData?.astroImage}}
                  style={{width: '100%', height: '100%'}}
                />
              </View>
              <Text
                style={{
                  ...Fonts.black16RobotoMedium,
                  marginLeft: Sizes.fixPadding,
                }}>
                {paymentData?.astroName}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => on_go_to_history()}
            style={{
              width: '70%',
              alignSelf: 'center',
              marginTop: Sizes.fixPadding * 1.5,
            }}>
            <LinearGradient
              colors={[Colors.primaryLight, Colors.primaryDark]}
              style={{
                width: '100%',
                paddingVertical: Sizes.fixPadding * 1.5,
                borderRadius: 1000,
              }}>
              <Text style={{...Fonts.white14RobotoMedium, textAlign: 'center'}}>
                {paymentData?.type == 'paid_pdf'
                  ? 'Download PDF'
                  : 'Go To My Course'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  function continueButtonInfo() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => updateState({showPayment: true})}
        style={{
          marginHorizontal: Sizes.fixPadding * 2,
          marginVertical: Sizes.fixPadding,
          borderRadius: Sizes.fixPadding * 1.4,
          overflow: 'hidden',
        }}>
        <LinearGradient
          colors={[Colors.primaryLight, Colors.primaryDark]}
          style={{paddingVertical: Sizes.fixPadding}}>
          <Text style={{...Fonts.white18RobotMedium, textAlign: 'center'}}>
            Continue for Payment
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  function billDetailsInfo() {
    return (
      <View
        style={{
          margin: Sizes.fixPadding * 1.5,
        }}>
        <View
          style={[
            styles.row,
            {justifyContent: 'space-between', marginBottom: Sizes.fixPadding},
          ]}>
          <Text style={{...Fonts.black16RobotoRegular}}>Subtotal</Text>
          <Text style={{...Fonts.black16RobotoMedium}}>
            ₹ {parseFloat(paymentData?.price).toFixed(2)}
          </Text>
        </View>
        <View
          style={[
            styles.row,
            {justifyContent: 'space-between', marginBottom: Sizes.fixPadding},
          ]}>
          <Text style={{...Fonts.black16RobotoRegular}}>Delivery Charge</Text>
          <Text style={{...Fonts.black16RobotoRegular}}>Free</Text>
        </View>
        <View
          style={[
            styles.row,
            {
              justifyContent: 'space-between',
              paddingBottom: Sizes.fixPadding,
              marginBottom: Sizes.fixPadding,
              borderBottomWidth: 1,
              borderColor: Colors.grayLight,
            },
          ]}>
          <Text style={{...Fonts.black16RobotoRegular}}>GST @ 3.0%</Text>
          <Text style={{...Fonts.black16RobotoRegular}}>₹ {gst_amount()}</Text>
        </View>
        <View
          style={[
            styles.row,
            {
              justifyContent: 'space-between',
              marginBottom: Sizes.fixPadding,
            },
          ]}>
          <Text style={{...Fonts.black16RobotoRegular}}>Total</Text>
          <Text style={{...Fonts.black16RobotoRegular}}>
            ₹ {total_amount()}
          </Text>
        </View>
      </View>
    );
  }

  function addressInfo() {
    return (
      <View
        style={{
          margin: Sizes.fixPadding * 1.5,
          borderBottomWidth: 1,
          borderBottomColor: Colors.grayLight,
        }}>
        <View style={[styles.row, {justifyContent: 'space-between'}]}>
          <Text style={{...Fonts.black16RobotoMedium}}>Address</Text>
          <TouchableOpacity>
            <Ionicons
              name="pencil-sharp"
              color={Colors.primaryDark}
              size={20}
            />
          </TouchableOpacity>
        </View>

        <Text
          style={{
            ...Fonts.gray14RobotoRegular,
            marginVertical: Sizes.fixPadding * 0.7,
          }}>
          GC76+79C, Blossom County, Sector 90, Noida, Uttar Pradesh 201305
        </Text>
      </View>
    );
  }

  function remediesInfo() {
    return (
      <View
        style={{
          padding: Sizes.fixPadding * 1.5,
          borderBottomWidth: 1,
          borderBottomColor: Colors.grayLight,
        }}>
        <Text style={{...Fonts.primaryLight18RobotoMedium}}>
          {paymentData?.title}
        </Text>
        <Text
          style={{
            ...Fonts.gray14RobotoMedium,
            fontSize: 13,
            marginVertical: Sizes.fixPadding * 0.7,
          }}>
          {paymentData?.description}
        </Text>
      </View>
    );
  }

  function bannerInfo() {
    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 1.5,
          height: SCREEN_WIDTH * 0.55,
          borderRadius: Sizes.fixPadding,
          overflow: 'hidden',
          marginVertical: Sizes.fixPadding * 1,
        }}>
        <Image
          source={{uri: paymentData?.image}}
          style={{width: '100%', height: '100%'}}
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
          Booking Details
        </Text>
      </View>
    );
  }
};

export default CourseBookingDetails;

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
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayLight,
    paddingVertical: Sizes.fixPadding,
  },
  paginationDot: {
    width: 12,
    height: 2,
    borderRadius: 5,
    margin: 5,
  },
});
