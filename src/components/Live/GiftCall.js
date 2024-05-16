import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {Colors, Fonts, Sizes} from '../../assets/style';
import {SCREEN_WIDTH} from '../../config/Screen';

const GiftCall = ({
  updateState,
  get_astrologer_gifts, 
  astroData
}) => {
  console.log(astroData)
  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => updateState({callModalVisible: true})}
        style={{width: SCREEN_WIDTH * 0.18, height: SCREEN_WIDTH * 0.18}}>
        <ImageBackground
          source={require('../../assets/images/icons/live_rect.png')}
          style={{width: '100%', height: '100%', alignItems: 'center'}}
          resizeMode="contain">
          <View
            style={{
              width: 3,
              height: 3,
              borderRadius: 3,
              backgroundColor: Colors.white,
              alignSelf: 'center',
              marginVertical: Sizes.fixPadding * 0.4,
            }}
          />
          <View
            style={{
              borderBottomWidth: 1,
              width: '40%',
              alignSelf: 'center',
              borderStyle: 'dashed',
              borderBottomColor: Colors.white,
              marginBottom: Sizes.fixPadding * 0.4,
            }}
          />
          <Image
            source={require('../../assets/images/icons/live_phone.png')}
            style={{
              width: '40%',
              height: '30%',
              alignSelf: 'center',
              resizeMode: 'contain',
            }}
          />
          <View
            style={{
              borderBottomWidth: 1,
              width: '65%',
              alignSelf: 'center',
              borderStyle: 'dashed',
              borderBottomColor: Colors.white,
              marginBottom: Sizes.fixPadding * 0.4,
            }}
          />
          <Text style={{...Fonts.white12RobotoRegular}}>
            ₹{parseFloat(astroData?.video_price) +parseFloat(astroData?.video_commission)}/<Text style={{fontSize: 9}}>min</Text>
          </Text>
        </ImageBackground>
      </TouchableOpacity>
      {/* <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => send_request_for_call()}>
        <LinearGradient
          colors={[Colors.primaryLight, Colors.primaryDark]}
          style={styles.itemContainer}>
          <Image
            source={require('../../assets/images/icons/live_call.png')}
            style={{width: 26, height: 26}}
          />
        </LinearGradient>
      </TouchableOpacity> */}
      <TouchableOpacity
        // activeOpacity={0.8}
        onPress={get_astrologer_gifts}>
        <LinearGradient
          colors={[Colors.gray, Colors.gray]}
          style={styles.itemContainer}>
          <Image
            source={require('../../assets/images/icons/live_gift.png')}
            style={{width: 26, height: 26}}
          />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

export default GiftCall;

const styles = StyleSheet.create({
  container: {
    // flexDirection: 'column',
    // height: '100%'
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
