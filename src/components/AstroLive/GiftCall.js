import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {Colors, Fonts, Sizes} from '../../assets/style';

const GiftCall = ({updateState, totalRequests}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
      activeOpacity={0.8}
      disabled={totalRequests == 0}
      onPress={()=>updateState({callRequestVisible: true})}
      >
        <LinearGradient
          colors={[Colors.primaryLight, Colors.primaryDark]}
          style={styles.itemContainer}>
          <View
            style={styles.itemCount}>
            <Text style={{...Fonts.white11InterMedium, fontSize: 9}}>{totalRequests}</Text>
          </View>
          <Image
            source={require('../../assets/images/icons/live_call.png')}
            style={{width: 26, height: 26}}
          />
        </LinearGradient>
      </TouchableOpacity>
      <TouchableOpacity>
        <LinearGradient
          colors={[Colors.gray, Colors.gray]}
          style={styles.itemContainer}>
          <View
            style={styles.itemCount}>
            <Text style={{...Fonts.white11InterMedium, fontSize: 9}}>3</Text>
          </View>
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
  container:{
    // flexDirection: 'column',
    // height: '100%'
  },
  itemContainer:{
    padding: Sizes.fixPadding * 0.7, borderRadius: 1000,
    marginVertical: Sizes.fixPadding
  },
  itemCount:{
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
    zIndex: 99
  }
})
