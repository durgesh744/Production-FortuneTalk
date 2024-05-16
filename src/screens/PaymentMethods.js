import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
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
import {api_addwallet, api_url, razorpay_key} from '../config/constants';
import * as UserActions from '../redux/actions/UserActions';
import {showToastWithGravityAndOffset} from '../methods/toastMessage';
import axios from 'axios';
import database from '@react-native-firebase/database';
import {calculate_discount_price, sum_price} from '../methods/calculatePrice';
import LinearGradient from 'react-native-linear-gradient';

const paymentData = [
  {id: 1, image: require('../assets/images/paytm_logo.png')},
  {id: 2, image: require('../assets/images/phonepe.png')},
  {id: 3, image: require('../assets/images/googlepay.png')},
  {id: 4, image: require('../assets/images/bhimpay.png')},
];

const PaymentMethods = ({navigation, route, userData, dispatch}) => {
  const [state, setState] = useState({
    amount: route.params.amount,
    type: route.params?.data?.type,
  });
  const razorpay_payment = async amount => {
    var options = {
      description: 'Add amount to your wallet',
      image:
        'https://fortunetest.fortunetalk.co.in/admin/common/img/logo_new.png',
      currency: 'INR',
      key: razorpay_key,
      amount: amount * 100,
      name: 'FortuneTalk',
      // order_id: 'order_DslnoIgkIDL8Zt', //Replace this with an order_id created using Orders API.
      prefill: {
        email: userData?.email,
        contact: userData?.phone,
        name: userData?.username,
      },
      theme: {color: Colors.primaryLight},
    };
    await RazorpayCheckout.open(options)
      .then(data => {
        payment_for(type);
      })
      .catch(error => {
        console.log(error);
        // payment_for(type);
        // handle failure
        // alert(`Error: ${error.code} | ${error.description}`);
        showToastWithGravityAndOffset(
          `Payment has been declined Error: ${error.code} | ${error.description}`,
        );
        // warnign_toast(
        //   `Payment has been declined Error: ${error.code} | ${error.description}`,
        // );
      });
  };

  const payment_for = type => {
    switch (type) {
      case 'wallet': {
        wallet_recharge();
        break;
      }
      case 'chat_recharge': {
        wallet_recharge_for_chat();
        break;
      }
      default: {
        console.log('none');
      }
    }
  };

  const wallet_recharge_for_chat = async () => {
    await axios({
      method: 'post',
      url: api_url + api_addwallet,
      data: {
        amount: amount,
        gift: '',
        tax: '',
        firstoffer: '',
        user_id: userData?.id,
      },
    })
      .then(res => {
        console.log(res.data, 'total')
        dispatch(UserActions.setWallet(res.data.updated_wallet.toFixed(2)));
        showToastWithGravityAndOffset('Amount has been added to your wallet');
        database().ref();
        const astroData = route?.params?.data?.astroData;
        let minutes = 0;

        if (astroData?.offer.length != 0) {
          minutes =
            calculate_discount_price({
              actualPrice: sum_price({
                firstPrice: astroData.chat_price_m,
                secondPrice: astroData.chat_commission,
              }),
              percentage: astroData?.offer[0]?.discount,
            }) * 60;
        } else {
          minutes =
            (
              parseFloat(res?.data.updated_wallet) /
              (parseFloat(astroData.chat_price_m) +
                parseFloat(astroData.chat_commission))
            ).toFixed(2) * 60;
        }

        if(astroData?.moa == 1){
          minutes += 300
        }

        const userNodeRef = database().ref(
          `CustomerCurrentRequest/${userData?.id}`,
        );

        userNodeRef.update({status: 'active', minutes: parseInt(minutes)});
        navigation.pop(2);
      })
      .catch(err => {
        console.log(err);
        showToastWithGravityAndOffset(
          'Your payment has not been completed. If any balance deducted, It will be refunded.',
        );
        // warnign_toast(
        //   'Your payment has not been completed. If any balance deducted, It will be refunded.',
        // );
      });
  };

  const wallet_recharge = async () => {
    await axios({
      method: 'post',
      url: api_url + api_addwallet,
      data: {
        amount: amount,
        gift: '',
        tax: '',
        firstoffer: '',
        user_id: userData?.id,
      },
    })
      .then(res => {
        dispatch(UserActions.setWallet(res.data.updated_wallet.toFixed(2)));
        // get_wallet_amount();
        // success_toast('Amount has been added to your wallet');
        showToastWithGravityAndOffset('Amount has been added to your wallet');
        navigation.pop(1);
      })
      .catch(err => {
        console.log(err);
        showToastWithGravityAndOffset(
          'Your payment has not been completed. If any balance deducted, It will be refunded.',
        );
        // warnign_toast(
        //   'Your payment has not been completed. If any balance deducted, It will be refunded.',
        // );
      });
  };

  const {amount, type} = state;

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
              {paymentAmountInfo()}
              {type == 'wallet' ? paymentDetailesInfo() : null}
              {borderInfo()}
              {/* {couponInputFieldInfo()} */}
              {/* {paymentMethodsInfo()}
              {upiInputFieldInfo()}
              {otherPaymentInfo()} */}
            </>
          }
        />
      </View>
      {confirmPaymentInfo()}
    </View>
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
            <Text style={{...Fonts.gray16RobotoMedium}}>
              {' '}
              {(parseInt(amount) * 18) / 100 + parseInt(amount)}
            </Text>
          </View>
          <Text style={{...Fonts.gray11RobotoRegular, fontSize: 9}}>
            View Detailes
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            razorpay_payment((parseInt(amount) * 18) / 100 + parseInt(amount))
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

  function borderInfo() {
    return (
      <View
        style={{
          marginVertical: Sizes.fixPadding * 3,
          height: 1,
          backgroundColor: Colors.gray,
        }}
      />
    );
  }

  function paymentDetailesInfo() {
    return (
      <View
        style={{
          margin: Sizes.fixPadding * 2,
          backgroundColor: '#FBFBFB',
          // marginVertical: Sizes.fixPadding,
          borderRadius: Sizes.fixPadding * 2,
          elevation: 5,
        }}>
        <View style={{padding: Sizes.fixPadding * 2}}>
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
        </View>

        <View
          style={{
            ...styles.row,
            justifyContent: 'space-between',
            borderWidth: 2,
            padding: Sizes.fixPadding,
            borderRadius: 1000,
            borderColor: Colors.primaryLight,
          }}>
          <Text style={{...Fonts.primaryLight15RobotoMedium}}>
            Payable Amount
          </Text>
          <Text style={{...Fonts.primaryLight15RobotoMedium}}>
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
          ₹ {(parseInt(amount) * 18) / 100 + parseInt(amount)}
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
          onPress={() => navigation.goBack()}
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
  userData: state.user.userData,
});

const mapDispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, mapDispatchToProps)(PaymentMethods);

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
