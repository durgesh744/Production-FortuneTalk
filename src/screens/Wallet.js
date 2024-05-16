import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  FlatList,
  StyleSheet,
  Image,
  Animated,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors, Fonts, Sizes} from '../assets/style';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MyStatusBar from '../components/MyStatusBar';
import LinearGradient from 'react-native-linear-gradient';
import {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {SCREEN_WIDTH} from '../config/Screen';
import Carousel from 'react-native-reanimated-carousel';
import {SafeAreaView} from 'react-native-safe-area-context';
import WalletPagination from '../components/WalletPagination';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api_url, get_plan, api_addwallet, razorpay_key } from '../config/constants';
import axios from 'axios';
import RazorpayCheckout from 'react-native-razorpay';


const walletBannerData = [
  {id: 1, image: require('../assets/images/wallet_screen.png')},
  {id: 2, image: require('../assets/images/wallet_screen_1.png')},
  {id: 3, image: require('../assets/images/wallet_screen_2.png')},
];

const priceData = [
  {id: 1, price: '50'},
  {id: 2, price: '100'},
  {id: 3, price: '200'},
  {id: 4, price: '500'},
  {id: 5, price: '1000'},
  {id: 6, price: '2000'},
  {id: 7, price: '5000'},
  {id: 8, price: '10000'},
  {id: 9, price: '25000'},
];

const Wallet = ({navigation, wallet, route, userData, dispatch}) => {
  const progressValue = useSharedValue(0);
  const [paginationIndex, setPaginationIndex] = useState(0);
  const [plan, setplan] = useState(null);
  const [amount, setAmount] = useState('');
  const [state, setState] = useState({
    amount: route.params.amount,
    type: route.params?.data?.type,
  });

 
  useEffect(() => { get_plans(); }, [paginationIndex]);

  const get_plans = async () => {
    axios ({
      method: 'get',
      url: api_url + get_plan,
    })
    .then(res => {
      if(res.data) {
        setplan(res.data);
      }
    })
    .catch(err => {
      console.log(err);
    })
  }

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
          payment_for(type);
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
                parseFloat(amount) /
                (parseFloat(astroData.chat_price_m) +
                  parseFloat(astroData.chat_commission))
              ).toFixed(2) * 60;
          }
  
          const astrologerData = {
            minutes: minutes + 60,
            wallet: amount,
          };
          const nodeRef = database().ref(`/CurrentRequest/${astroData.id}`);
  
          const userNodeRef = database().ref(
            `CustomerCurrentRequest/${userData?.id}`,
          );
  
          nodeRef.update(astrologerData);
          userNodeRef.update({status: 'active'});
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
              {walletInfo()}
              <View style={styles.boxContainer}>
                {titleInfo()}
                {inputFieldInfo()}
                {pricesInfo()}
                {proceedButtonInfo()}
              </View>
            </>
          }
        />
      </View>
    </View>
  );

  function proceedButtonInfo() {
    const on_payment = async()=>{
      const check_is_register = await AsyncStorage.getItem('isRegister');
      const isRegister = JSON.parse(check_is_register);
      setAmount('')
      if(isRegister?.value){
        navigation.navigate('paymentMethods', {
          amount: amount,
          data: route?.params,
        })
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
        activeOpacity={0.8}
        disabled={amount.length == 0}
        onPress={on_payment}
        style={{
          backgroundColor: Colors.primaryLight,
          paddingVertical: Sizes.fixPadding,
          borderRadius: Sizes.fixPadding * 2,
        }}>
        <Text style={{...Fonts.white16RobotoMedium, textAlign: 'center'}}>
          Proceed for Payment
        </Text>
      </TouchableOpacity>
    );
  }

  function pricesInfo() {
    const renderItem = ({item, index}) => {
      return (
        <TouchableOpacity
          onPress={() => setAmount(item.recharge_plan_amount)}
          activeOpacity={0.8}
          style={[styles.priceBox, {backgroundColor: amount == item.recharge_plan_amount ? Colors.primaryLight : Colors.white}]}>
          <Text style={{...Fonts.gray14RobotoMedium, color: amount == item.recharge_plan_amount ? Colors.white : Colors.gray}}>₹ {parseFloat(item.recharge_plan_amount).toFixed(0)}</Text>
        </TouchableOpacity>
      );
    };
    return (
      <View style={{marginVertical: Sizes.fixPadding * 2}}>
        <FlatList
          data={plan}
          renderItem={renderItem}
          keyExtractor={item => item.recharge_plan_id}
          numColumns={3}
        />
      </View>
    );
  }

  function inputFieldInfo() {
    return (
      <TextInput
        value={amount}
        placeholder="Enter amount"
        placeholderTextColor={Colors.gray}
        keyboardType="number-pad"
        onChangeText={setAmount}
        style={{
          ...Fonts.primaryLight15RobotoMedium,
          borderWidth: 1,
          padding: Sizes.fixPadding * 0.8,
          width: '80%',
          alignSelf: 'center',
          marginVertical: Sizes.fixPadding * 2,
          borderRadius: 1000,
          borderColor: Colors.primaryLight,
        }}
      />
    );
  }

  function titleInfo() {
    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding,
          marginTop: Sizes.fixPadding * 3,
        }}>
        <Text
          style={{...Fonts.primaryLight18RobotoMedium, textAlign: 'center'}}>
          Add Money to your wallet
        </Text>
      </View>
    );
  }

  function walletInfo() {
    const baseOptions = {
      vertical: false,
      width: SCREEN_WIDTH * 0.4,
      height: 158,
    };

    const renderItem = ({index}) => {
      return (
        <View
          style={{
            width: SCREEN_WIDTH * 0.4,
            height: 150,
          }}>
          <Image
            source={walletBannerData[index].image}
            style={{
              width: '100%',
              height: '100%',
              resizeMode: 'contain',
            }}
          />
        </View>
      );
    };

    return (
      <SafeAreaView edges={['bottom']} style={{flex: 1}}>
        <LinearGradient
          colors={[Colors.primaryLight, Colors.primaryDark]}
          style={styles.walletContainer}>
          <View style={{flex: 0.5}}>
            <Text style={{...Fonts.white18RobotMedium, fontSize: 22}}>
              Wallet Balance
            </Text>
            <Text
              style={{
                ...Fonts.white18RobotMedium,
                fontSize: 26,
                marginTop: Sizes.fixPadding,
              }}>
              ₹{wallet}
            </Text>
          </View>
          <View style={{flex: 0.4}}>
            <Carousel
              {...baseOptions}
              loop
              testID={'xxx'}
              style={{
                width: '100%',
              }}
              autoPlay={true}
              autoPlayInterval={4000}
              onProgressChange={(_, absoluteProgress) => {
                progressValue.value = Math.ceil(absoluteProgress);
                setPaginationIndex(Math.ceil(absoluteProgress));
              }}
              mode="parallax"
              modeConfig={{
                parallaxScrollingScale: 1,
                parallaxScrollingOffset: 0,
              }}
              data={walletBannerData}
              pagingEnabled={true}
              renderItem={renderItem}
            />
            <View style={{...styles.row, justifyContent: 'center'}}>
              {walletBannerData.map((_, index) => {
                // console.log(index)
                return (
                  <WalletPagination
                    animValue={progressValue}
                    index={index}
                    key={index}
                    length={walletBannerData.length}
                    isRotate={false}
                  />
                );
              })}
            </View>
          </View>
        </LinearGradient>
      </SafeAreaView>
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
          backgroundColor: Colors.primaryLight,
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            alignSelf: 'flex-start',
          }}>
          <AntDesign
            name="leftcircleo"
            color={Colors.white}
            size={Sizes.fixPadding * 2.2}
          />
        </TouchableOpacity>
        <Text
          style={{
            ...Fonts.white16RobotoMedium,
            textAlign: 'center',
            flex: 0.92,
          }}>
          Wallet
        </Text>
      </View>
    );
  }
};

const mapStateToProps = state => ({
  userData: state.user.userData,
  wallet: state.user.wallet,
});

export default connect(mapStateToProps, null)(Wallet);

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

  walletContainer: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Sizes.fixPadding * 5,
    justifyContent: 'space-around',
  },

  boxContainer: {
    width: SCREEN_WIDTH * 0.85,
    backgroundColor: '#FBFBFB',
    top: -Sizes.fixPadding * 3,
    alignSelf: 'center',
    elevation: 8,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowColor: Colors.blackLight,
    borderRadius: Sizes.fixPadding * 2,
    overflow: 'hidden',
  },
  priceBox: {
    width: SCREEN_WIDTH * 0.24,
    height: SCREEN_WIDTH * 0.15,
    marginLeft: SCREEN_WIDTH * 0.033,
    backgroundColor: '#FBFBFB',
    elevation: 5,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowColor: Colors.gray,
    marginBottom: SCREEN_WIDTH * 0.033,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Sizes.fixPadding,
  },
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
