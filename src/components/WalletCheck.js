import {View, Text, Image, StyleSheet} from 'react-native';
import React from 'react';
import {Modal} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Colors, Fonts, Sizes} from '../assets/style';
import { TouchableOpacity } from 'react-native';
import { SCREEN_WIDTH } from '../config/Screen';

const WalletCheck = ({
  chatModalVisible,
  setChatModalVisible,
  wallet,
  customerData,
  navigation,
  check_status,
  astroData
}) => {
  const is_customer_login = () => {
    if (customerData) {
      if (customerData?.username == null) {
        navigation.navigate('register', {
          id: customerData?.id,
          phone_number: customerData?.phone,
        });
      } else {
        if (parseFloat(wallet) >= chat_price()) {
          check_status();
        }
      }
    } else {
      navigation.navigate('login');
    }
  };

  const chat_price = () =>
    parseFloat(astroData?.chat_price_m) +
    parseFloat(astroData?.chat_commission);

  const call_price = () =>
    parseFloat(astroData?.call_price_m) +
    parseFloat(astroData?.call_commission);

  const chat_wallet_check = () => {
    if (parseFloat(wallet) <= chat_price()) {
      return true;
    } else {
      return false;
    }
  };
  return (
    <Modal
      visible={chatModalVisible}
      onDismiss={() => setChatModalVisible(false)}
      contentContainerStyle={{
        flex: 0,
        paddingVertical: Sizes.fixPadding * 2,
        backgroundColor: Colors.white,
        marginHorizontal: Sizes.fixPadding * 1.5,
        borderRadius: Sizes.fixPadding * 2,
        elevation: 8,
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.2,
        shadowColor: Colors.blackLight
      }}>
      <View style={{}}>
        <View
          style={[
            styles.row,
            {
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              paddingHorizontal: Sizes.fixPadding,
              borderBottomWidth: 1,
              borderBottomColor: Colors.grayLight,
              paddingBottom: Sizes.fixPadding * 0.5,
            },
          ]}>
          <View>
            <LinearGradient
              colors={[Colors.primaryLight, Colors.primaryDark]}
              style={[
                styles.row,
                {
                  paddingHorizontal: Sizes.fixPadding,
                  paddingVertical: Sizes.fixPadding * 0.5,
                  borderRadius: 1000,
                },
              ]}>
              <Ionicons name="wallet-outline" color={Colors.white} size={26} />
              <Text
                style={{
                  ...Fonts.white14RobotoMedium,
                  marginLeft: Sizes.fixPadding,
                }}>
                ₹ {wallet}
              </Text>
            </LinearGradient>
            {chat_wallet_check() && (
              <Text
                style={{
                  ...Fonts.black12RobotoRegular,
                  textAlign: 'center',
                  color: Colors.red,
                }}>
                Low Balance!!
              </Text>
            )}
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setChatModalVisible(false), navigation.navigate('wallet');
            }}>
            <LinearGradient
              colors={[Colors.primaryLight, Colors.primaryDark]}
              style={[
                styles.row,
                {
                  paddingHorizontal: Sizes.fixPadding,
                  paddingVertical: Sizes.fixPadding * 0.9,
                  borderRadius: 1000,
                },
              ]}>
              <Text
                style={{
                  ...Fonts.white14RobotoMedium,
                  marginLeft: Sizes.fixPadding,
                }}>
                Recharge Now
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: SCREEN_WIDTH * 0.22,
            height: SCREEN_WIDTH * 0.22,
            borderWidth: 1,
            borderRadius: 10000,
            borderColor: Colors.primaryLight,
            overflow: 'hidden',
            alignSelf: 'center',
            position: 'relative',
            bottom: Sizes.fixPadding * 1.5,
            padding: 1,
            elevation: 8,
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.2,
            shadowColor: Colors.blackLight
          }}>
          <Image
            source={{uri: astroData?.image}}
            style={{
              height: '100%',
              width: '100%',
              borderWidth: 1,
              borderColor: Colors.white,
              borderRadius: 1000,
            }}
          />
        </View>
        <View style={{position: 'relative', bottom: Sizes.fixPadding * 0.5}}>
          <Text
            style={{
              ...Fonts.primaryLight18RobotoMedium,
              fontSize: 22,
              textAlign: 'center',
            }}>
            {astroData?.owner_name}
          </Text>
          {/* <Text style={{...Fonts.gray14RobotoMedium, textAlign: 'center'}}>
          Wait Time - 5 min
        </Text> */}
          <View
            style={[
              styles.row,
              {
                marginHorizontal: Sizes.fixPadding,
                elevation: 5,
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.2,
                shadowColor: Colors.gray,
                marginBottom: Sizes.fixPadding * 1.5,
                marginTop: Sizes.fixPadding,
                borderWidth: 1,
                borderColor: Colors.grayLight,
                backgroundColor: Colors.white,
                padding: Sizes.fixPadding,
                borderRadius: Sizes.fixPadding,
              },
            ]}>
            <Ionicons name="call" color={Colors.primaryLight} size={20} />
            <Text
              style={{
                ...Fonts.gray14RobotoMedium,
                marginLeft: Sizes.fixPadding,
              }}>
              Audio Call @ {call_price()}/min
            </Text>
          </View>
          <View
            style={[
              styles.row,
              {
                marginHorizontal: Sizes.fixPadding,
                elevation: 5,
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.2,
                shadowColor: Colors.gray,
                borderWidth: 1,
                borderColor: Colors.grayLight,
                backgroundColor: Colors.white,
                padding: Sizes.fixPadding,
                borderRadius: Sizes.fixPadding,
              },
            ]}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              color={Colors.primaryLight}
              size={20}
            />
            <Text
              style={{
                ...Fonts.gray14RobotoMedium,
                marginLeft: Sizes.fixPadding,
              }}>
              Chat @ {chat_price()}/min
            </Text>
            <View style={{flex: 1, alignItems: 'flex-end'}}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => is_customer_login()}
                // disabled={chat_wallet_check()}
              >
                <LinearGradient
                  colors={[Colors.primaryLight, Colors.primaryDark]}
                  style={[
                    {
                      width: 80,
                      paddingVertical: Sizes.fixPadding * 0.5,
                      borderRadius: 1000,
                    },
                  ]}>
                  <Text
                    style={{
                      ...Fonts.white14RobotoMedium,
                      textAlign: 'center',
                    }}>
                    Chat
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default WalletCheck;


const styles = StyleSheet.create({
  row: {
      flex: 0,
      flexDirection: 'row',
      alignItems: 'center'
  },
  center:{
      justifyContent: 'center',
      alignItems: 'center'
  }
})
