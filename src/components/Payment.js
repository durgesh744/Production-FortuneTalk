import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  Modal,
} from 'react-native';
import React, {useState} from 'react';
import {Colors, Fonts, Sizes} from '../assets/style';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MyStatusBar from '../components/MyStatusBar';
import {Input} from '@rneui/themed';
import {SCREEN_WIDTH} from '../config/Screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RazorpayCheckout from 'react-native-razorpay';
import {connect} from 'react-redux';
import {
  api_addwallet,
  api_url,
  book_courses,
  buy_paid_pdf,
  buy_remedies,
  pooja_booking_customer,
  product_purchase,
  razorpay_key,
} from '../config/constants';
import * as UserActions from '../redux/actions/UserActions';
import {showToastWithGravityAndOffset} from '../methods/toastMessage';
import axios from 'axios';
import {CommonActions} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import database from '@react-native-firebase/database';
import {ApiRequest} from '../config/api_requests';
import LinearGradient from 'react-native-linear-gradient';

const paymentData = [
  {id: 1, image: require('../assets/images/paytm_logo.png')},
  {id: 2, image: require('../assets/images/phonepe.png')},
  {id: 3, image: require('../assets/images/googlepay.png')},
  {id: 4, image: require('../assets/images/bhimpay.png')},
];

const Payment = ({
  showPayment,
  type,
  updateState,
  route,
  userData,
  amount,
  apiData,
  navigation,
  customerData,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const razorpay_payment = async amount => {
    var options = {
      description: 'Add amount to your wallet',
      image: 'https://fortunetest.fortunetalk.co.in/admin/common/img/logo_new.png',
      currency: 'INR',
      key: razorpay_key,
      amount: amount * 100,
      name: 'FortuneTalk',
      // order_id: 'order_DslnoIgkIDL8Zt', //Replace this with an order_id created using Orders API.
      prefill: { 
        email: customerData?.email,
        contact: customerData?.phone,
        name: customerData?.username,
      },
      theme: {color: Colors.primaryLight},
    };
    await RazorpayCheckout.open(options)
      .then(data => {
        payment_for(type);
      })
      .catch(error => {
        console.log(error);
        // handle failure
        // alert(`Error: ${error.code} | ${error.description}`);
        showToastWithGravityAndOffset(
          `Payment has been declined.`,
        );
        // warnign_toast(
        //   `Payment has been declined Error: ${error.code} | ${error.description}`,
        // );
      });
  };

  const payment_for = type => {
    switch (type) {
      case 'remedy': {
        remedy_buy();
        break;
      }
      case 'book_pooja': {
        astro_pooja_book();
        break;
      }
      case 'product_buy': {
        order_products();
        break;
      }
      case 'live_course': {
        order_course();
        break;
      }
      case 'paid_pdf': {
        buy_course_pdf();
        break;
      }
      default: {
        console.log('none');
      }
    }
  }; 

  const remedy_buy = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + buy_remedies,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {...apiData, price: amount},
    })
      .then(res => {
        setIsLoading(false);
        updateState({showPayment: false, successVisible: true});
      })
      .catch(err => {
        setIsLoading(false);
        updateState({showPayment: false});
        console.log(err);
      });
  };

  const astro_pooja_book = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + pooja_booking_customer,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {...apiData, price: amount},
    })
      .then(res => {
        setIsLoading(false);
        updateState({showPayment: false, successVisible: true});
      })
      .catch(err => {
        setIsLoading(false);
        updateState({showPayment: false});
        console.log(err);
      });
  };

  const order_products = async () => {
    try {
      setIsLoading(true);
      console.log(JSON.stringify({...apiData, price: amount}))
      const response = await ApiRequest.postRequest({
        url: api_url + product_purchase,
        data: JSON.stringify({...apiData, price: amount}),
      });
      setIsLoading(false);
      updateState({showPayment: false, successVisible: true});
      database().ref(`ProductOrders/${response?.insert_id}`).set({
        status: 1,
      });
      // navigate_to(response?.data);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
      updateState({showPayment: false});
    }
  };

  const order_course = async () => {
    try {
      setIsLoading(true);
      const response = await ApiRequest.postRequest({
        url: api_url + book_courses,
        data: {...apiData, price: amount},
      });
      console.log(response)
      if(response.status == '200'){
        showToastWithGravityAndOffset('Your order succesfully purchased.')
        updateState({showPayment: false, successVisible: true});
      }
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
      updateState({showPayment: false, successVisible: true});
    }
  };

  const buy_course_pdf = async ()=>{
    try{
      setIsLoading(true);
      const response = await ApiRequest.postRequest({
        url: api_url + buy_paid_pdf,
        data: {...apiData, price: amount},
      });
      if(response.status == '200'){
        showToastWithGravityAndOffset('Your order succesfully purchased.')
        updateState({showPayment: false, successVisible: true});
      }
    }catch(e){
      console.log(e)
      setIsLoading(false);
      updateState({showPayment: false, successVisible: true});
    }
  }

  const navigate_to = async data => {
    await AsyncStorage.removeItem('eCommerceCart');
    navigation.navigate('productSuccessBooking', {data: data});
  };

  return (
    <Modal
      visible={showPayment}
      onRequestClose={() => updateState({showPayment: false})}>
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
                {paymentAmountInfo()}
                {type == 'wallet' ? paymentDetailesInfo() : null}
                {/* {couponInputFieldInfo()}
                {paymentMethodsInfo()}
                {upiInputFieldInfo()}
                {otherPaymentInfo()} */}
              </>
            }
          />
        </View>
        {confirmPaymentInfo()}
      </View>
    </Modal>
  );

  function confirmPaymentInfo() {
    return (
      <View
        style={{
          ...styles.row,
          justifyContent: 'space-evenly',
          paddingVertical: Sizes.fixPadding * 0.8,
        }}>
        <View style={{flex: 0.2, ...styles.center}}>
          <View style={{...styles.row}}>
            <Text style={{...Fonts.black16RobotoMedium}}>₹</Text>
            <Text style={{...Fonts.gray16RobotoMedium}}> {amount}</Text>
          </View>
          <Text style={{...Fonts.gray11RobotoRegular, fontSize: 9}}>
            View Detailes
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            razorpay_payment( parseFloat(amount))
          }
          style={{
            flex: 0.6,
            backgroundColor: Colors.primaryLight,
            paddingVertical: Sizes.fixPadding * 0.7,
            borderRadius: Sizes.fixPadding * 1.5,
          }}>
          <Text style={{...Fonts.white16RobotoMedium, textAlign: 'center'}}>
            Confirm your pay 
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  function otherPaymentInfo() {
    return (
      <View>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.otherPaymentContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={require('../assets/images/icons/net_banking.png')}
              style={{width: '50%', height: 20}}
              resizeMode="contain"
            />
          </View>
          <Text
            style={{
              ...Fonts.black14RobotoRegular,
              marginLeft: Sizes.fixPadding,
            }}>
            Net Banking
          </Text>
          <View style={{flex: 1, alignItems: 'flex-end'}}>
            <AntDesign name="right" color={Colors.gray} size={20} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.otherPaymentContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={require('../assets/images/icons/card.png')}
              style={{width: '50%', height: 20}}
              resizeMode="contain"
            />
          </View>
          <Text
            style={{
              ...Fonts.black14RobotoRegular,
              marginLeft: Sizes.fixPadding,
            }}>
            Debit/Credit Cards
          </Text>
          <View style={{flex: 1, alignItems: 'flex-end'}}>
            <AntDesign name="right" color={Colors.gray} size={20} />
          </View>
        </TouchableOpacity>
        {type != 'wallet' && (
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.otherPaymentContainer}>
            <View style={styles.imageContainer}>
              <Ionicons
                name="wallet-outline"
                color={Colors.blackLight}
                size={30}
              />
            </View>
            <Text
              style={{
                ...Fonts.black14RobotoRegular,
                marginLeft: Sizes.fixPadding,
              }}>
              wallet
            </Text>
            <View style={{flex: 1, alignItems: 'flex-end'}}>
              <AntDesign name="right" color={Colors.gray} size={20} />
            </View>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  function upiInputFieldInfo() {
    return (
      <View
        style={{
          paddingHorizontal: Sizes.fixPadding * 1.5,
          borderBottomWidth: 1,
          borderBottomColor: Colors.grayLight,
        }}>
        <View style={{...styles.row}}>
          <View>
            <Input
              placeholder="Enter your UPI ID"
              placeholderTextColor={Colors.gray}
              inputStyle={{...Fonts.black14RobotoRegular, padding: 0}}
              inputContainerStyle={{borderBottomWidth: 0, height: 35}}
              containerStyle={{
                borderWidth: 1,
                height: 38,
                width: SCREEN_WIDTH * 0.8,
                borderRadius: 1000,
                paddingRight: -10,
                borderColor: Colors.gray,
                marginVertical: Sizes.fixPadding * 0.5,
              }}
            />
          </View>

          <TouchableOpacity
            style={{width: SCREEN_WIDTH * 0.15, ...styles.center}}>
            <Ionicons
              name="checkmark-circle-outline"
              color={Colors.primaryLight}
              size={25}
            />
          </TouchableOpacity>
        </View>
        <Text
          style={{...Fonts.gray11RobotoRegular, marginLeft: Sizes.fixPadding}}>
          Your UPI ID will be encrypted and is 100% safe with us
        </Text>
        <TouchableOpacity
          style={{
            width: '70%',
            alignSelf: 'center',
            backgroundColor: Colors.primaryLight,
            paddingVertical: Sizes.fixPadding * 0.6,
            borderRadius: Sizes.fixPadding * 1.5,
            marginVertical: Sizes.fixPadding * 1.5,
          }}>
          <Text style={{...Fonts.white16RobotoMedium, textAlign: 'center'}}>
            Verify your UPI ID
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  function paymentMethodsInfo() {
    return (
      <View
        style={{
          padding: Sizes.fixPadding * 1.5,
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: Colors.grayLight,
          marginBottom: Sizes.fixPadding,
        }}>
        <Text style={{...Fonts.black16RobotoRegular}}>UPI Payment</Text>
        <View
          style={{
            ...styles.row,
            justifyContent: 'space-between',
            marginTop: Sizes.fixPadding,
          }}>
          {paymentData.map((item, index) => (
            <TouchableOpacity key={item.id} style={styles.imageContainer}>
              <Image
                source={item.image}
                style={{width: '70%', height: 20}}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }

  function couponInputFieldInfo() {
    return (
      <Input
        placeholder="Enter Coupon Code"
        placeholderTextColor={Colors.gray}
        inputStyle={{...Fonts.black14RobotoRegular, padding: 0}}
        inputContainerStyle={{borderBottomWidth: 0, height: 35}}
        rightIcon={
          <TouchableOpacity
            style={{
              backgroundColor: Colors.primaryLight,
              paddingVertical: Sizes.fixPadding * 0.5,
              paddingHorizontal: Sizes.fixPadding * 1.5,
              borderRadius: 1000,
            }}>
            <Text style={{...Fonts.white14RobotoMedium}}>Apply</Text>
          </TouchableOpacity>
        }
        containerStyle={{
          borderWidth: 1,
          height: 40,
          alignSelf: 'center',
          width: SCREEN_WIDTH - Sizes.fixPadding * 4,
          borderRadius: 1000,
          paddingRight: -10,
          borderColor: Colors.gray,
          marginVertical: Sizes.fixPadding * 0.5,
        }}
      />
    );
  }

  function paymentDetailesInfo() {
    return (
      <View
        style={{
          padding: Sizes.fixPadding * 2,
          marginHorizontal: Sizes.fixPadding * 2,
          backgroundColor: '#FBFBFB',
          marginVertical: Sizes.fixPadding,
          borderRadius: Sizes.fixPadding,
        }}>
        <View
          style={{
            ...styles.row,
            justifyContent: 'space-between',
            marginBottom: Sizes.fixPadding * 2,
          }}>
          <Text style={{...Fonts.gray14RobotoMedium}}>Recharge Amount</Text>
          <Text style={{...Fonts.gray14RobotoMedium}}>₹{amount}</Text>
        </View>
        <View
          style={{
            ...styles.row,
            justifyContent: 'space-between',
            marginBottom: Sizes.fixPadding * 2,
          }}>
          <Text style={{...Fonts.gray14RobotoMedium}}>GST(18%)</Text>
          <Text style={{...Fonts.gray14RobotoMedium}}>
            ₹{(parseInt(amount) * 18) / 100}
          </Text>
        </View>
        <View
          style={{
            ...styles.row,
            justifyContent: 'space-between',
            marginBottom: Sizes.fixPadding,
          }}>
          <Text style={{...Fonts.black14InterMedium, color: Colors.blackLight}}>
            Payable Amount
          </Text>
          <Text style={{...Fonts.black14InterMedium, color: Colors.blackLight}}>
            ₹{(parseInt(amount) * 18) / 100 + parseInt(amount)}
          </Text>
        </View>
      </View>
    );
  }

  function paymentAmountInfo() {
    return (
      <LinearGradient
        colors={[Colors.primaryLight, Colors.primaryDark]}
        style={{
          width: SCREEN_WIDTH,
          paddingTop: Sizes.fixPadding * 3,
          paddingBottom: Sizes.fixPadding,
          backgroundColor: Colors.primaryDark,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={{...Fonts.black18RobotoMedium, color: Colors.white}}>
          Total to Pay
        </Text>
        <Text
          style={{
            ...Fonts.black18RobotoMedium,
            color: Colors.white,
            fontSize: 56,
          }}>
          ₹ {amount}
        </Text>
      </LinearGradient>
    );
  }


  function header() {
    return (
      <View
        style={{
          padding: Sizes.fixPadding * 1.5,
          flex: 0,
          flexDirection: 'row',
          alignItems: 'center',
          borderBottomWidth: 1,
          borderBottomColor: Colors.grayLight,
        }}>
        <TouchableOpacity
          onPress={() => updateState({showPayment: false})}
          style={{
            alignSelf: 'flex-start',
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
            flex: 0.92,
          }}>
          Payment Information
        </Text>
      </View>
    );
  }
};

const mapStateToProps = state => ({
  customerData: state.user.userData,
  wallet: state.user.wallet,
});

export default connect(mapStateToProps, null)(Payment);

const styles = StyleSheet.create({
  row: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    width: SCREEN_WIDTH * 0.2,
    height: SCREEN_WIDTH * 0.15,
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Sizes.fixPadding,
    elevation: 5,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowColor: Colors.gray,
    borderWidth: 1,
    borderColor: Colors.white,
  },
  otherPaymentContainer: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Sizes.fixPadding * 2,
    paddingVertical: Sizes.fixPadding,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayLight,
  },
});
