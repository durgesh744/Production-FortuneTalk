import {View, Text, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {Modal} from 'react-native-paper';
import {Colors, Sizes, Fonts} from '../../assets/style';
import LinearGradient from 'react-native-linear-gradient';
import {SCREEN_WIDTH} from '../../config/Screen';
import database from '@react-native-firebase/database';

const WalletAlert = ({
  updateState,
  balanceAlert,
  navigation,
  astroData,
  customerData,
}) => {
  const wallet_navigate = () => {
    database()
      .ref(`CustomerCurrentRequest/${customerData?.id}`)
      .update({
        status: 'hold',
      })
      .then(res => {
        updateState({balanceAlert: false})
        navigation.navigate('wallet', {
          type: 'chat_recharge',
          astroData: astroData,
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  const on_exit = ()=>{
    database()
    .ref(`CustomerCurrentRequest/${customerData?.id}`)
    .update({
      status: 'active',
    })
    .then(res => {
      updateState({balanceAlert: false})
    })
    .catch(err => {
      console.log(err);
    });
  }

  return (
    <Modal
      visible={balanceAlert}
      onDismiss={() => on_exit()}>
      <View
        style={{
          backgroundColor: Colors.whiteDark,
          marginHorizontal: Sizes.fixPadding * 2,
          borderRadius: Sizes.fixPadding,
          padding: Sizes.fixPadding * 1.5,
        }}>
        <Text
          style={{...Fonts.primaryLight18RobotoMedium, textAlign: 'center'}}>
          Low Balance Alert
        </Text>
        
        <Image
          source={require('../../assets/images/icons/low_balance_wallet.png')}
          style={{
            width: SCREEN_WIDTH * 0.35,
            height: SCREEN_WIDTH * 0.35,
            alignSelf: 'center',
            position: 'relative',
          }}
        />
        <View
          style={{
            backgroundColor: Colors.white,
            paddingHorizontal: Sizes.fixPadding,
            borderRadius: Sizes.fixPadding,
            marginTop: -SCREEN_WIDTH * 0.15,
            zIndex: -1,
            height: SCREEN_WIDTH * 0.3,
            justifyContent: 'flex-end',
            padding: Sizes.fixPadding,
            alignItems: 'center',
          }}>
          <Text style={{...Fonts.gray16RobotoMedium}}>
            Recharge Your Wallet Now
          </Text>
        </View>
        <View
          style={{
            flex: 0,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            marginTop: Sizes.fixPadding * 2,
          }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => on_exit()}
            style={{width: '40%'}}>
            <LinearGradient
              colors={[Colors.gray, Colors.gray]}
              style={{
                width: '100%',
                paddingVertical: Sizes.fixPadding,
                borderRadius: 1000,
              }}>
              <Text style={{...Fonts.white14RobotoMedium, textAlign: 'center'}}>
                Exit
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => wallet_navigate()}
            style={{width: '40%'}}>
            <LinearGradient
              colors={[Colors.primaryLight, Colors.primaryDark]}
              style={{
                width: '100%',
                paddingVertical: Sizes.fixPadding,
                borderRadius: 1000,
              }}>
              <Text style={{...Fonts.white14RobotoMedium, textAlign: 'center'}}>
                Recharge Now
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default WalletAlert;
