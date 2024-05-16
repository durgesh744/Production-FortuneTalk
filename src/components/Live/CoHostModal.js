import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {Modal} from 'react-native-paper';
import {Colors, Fonts, Sizes} from '../../assets/style';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {TouchableOpacity} from 'react-native';
import {SCREEN_WIDTH} from '../../config/Screen';
import {Image} from 'react-native';
import { img_url_2 } from '../../config/constants';

const CoHostModal = ({
  astroData,
  callModalVisible,
  updateState,
  wallet,
  navigation,
  send_request_for_vedio_call,
  send_request_for_audio_call,
  waitListData
}) => {
  const total_time = () => {
    let total_balance = waitListData.reduce(
      (accumulator, currentValue) =>
        parseFloat(accumulator) + parseFloat(currentValue.time),
      0,
    );
    const minutes = parseFloat(total_balance/60).toFixed(0);
    return String(minutes).padStart(2, '0');
  };

  const audio_price = () =>
    parseFloat(astroData?.audio_price) + parseFloat(astroData?.audio_commission)

  const vedio_price = () =>
    parseFloat(astroData?.video_price) + parseFloat(astroData?.video_commission)

  const audio_wallet_check = () => {
    if (parseFloat(wallet) <= audio_price()) {
      return true;
    } else {
      return false;
    }
  };

  const vedio_wallet_check = () => {
    if (parseFloat(wallet) <= vedio_price()) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <Modal
      visible={callModalVisible}
      onDismiss={() => updateState({callModalVisible: false})}
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
            {audio_wallet_check() && vedio_wallet_check && (
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
              updateState({callModalVisible: false}),
                navigation.navigate('wallet', {type: 'wallet'});
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
            bottom: Sizes.fixPadding,
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
            source={{uri: img_url_2 + astroData?.img_url}}
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
          <Text style={{...Fonts.gray14RobotoMedium, textAlign: 'center'}}>
            Wait Time - {total_time()} min
          </Text>
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
              Audio Call @ {audio_price()}/min
            </Text>
            <View style={{flex: 1, alignItems: 'flex-end'}}>
              <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => send_request_for_audio_call()}
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
                    Join
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
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
            <Ionicons name="videocam" color={Colors.primaryLight} size={20} />
            <Text
              style={{
                ...Fonts.gray14RobotoMedium,
                marginLeft: Sizes.fixPadding,
              }}>
              Video Call @ {vedio_price()}/min
            </Text>
            <View style={{flex: 1, alignItems: 'flex-end'}}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => send_request_for_vedio_call()}
                disabled={audio_wallet_check()}
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
                    Join
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

export default CoHostModal;

const styles = StyleSheet.create({
  container: {
    // flexDirection: 'column',
    // height: '100%'
    alignItems: 'center',
  },
  row: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemContainer: {
    borderRadius: 1000,
    marginVertical: Sizes.fixPadding,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemCount: {
    position: 'absolute',
    alignSelf: 'flex-end',
    top: -2,
    backgroundColor: '#FB4A59',
    borderRadius: 1000,
    width: 15,
    height: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowColor: Colors.blackLight,
    zIndex: 99,
  },
});
