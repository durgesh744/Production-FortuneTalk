import {Image, Text, TouchableOpacity, View} from 'react-native';
import React, {Component} from 'react';
import {SCREEN_WIDTH} from '../../config/Screen';
import {Colors, Fonts, Sizes} from '../../assets/style';
import Ionicons from 'react-native-vector-icons/Ionicons';

export class Header extends Component {
  render() {
    return (
      <View
        style={{
          flex: 0,
          flexDirection: 'row',
          alignItems: 'center',
          marginHorizontal: Sizes.fixPadding,
          marginTop: Sizes.fixPadding,
        }}>
        <View
          style={{
            width: SCREEN_WIDTH * 0.14,
            height: SCREEN_WIDTH * 0.14,
            borderRadius: 1000,
            overflow: 'hidden',
            borderWidth: 2,
            borderColor: Colors.white,
            zIndex: 1,
          }}>
          <Image
            source={require('../../assets/images/users/user1.jpg')}
            style={{width: '100%', height: '100%'}}
          />
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: Colors.gray2,
            paddingHorizontal: Sizes.fixPadding,
            paddingVertical: Sizes.fixPadding * 0.5,
            marginLeft: -Sizes.fixPadding * 1.5,
            borderRadius: Sizes.fixPadding,
            elevation: 5,
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.2,
            shadowColor: Colors.blackLight
          }}>
          <Text
            style={{
              ...Fonts.white16RobotoMedium,
              marginLeft: Sizes.fixPadding,
            }}>
            Tarot Guruji
          </Text>
          <View style={{flex: 0, flexDirection: 'row', alignItems: 'center'}}>
            <Ionicons name="eye" color={Colors.white} size={18} />
            <Text style={{...Fonts.white12RobotoMedium, marginHorizontal: Sizes.fixPadding*0.5}}>555</Text>
            <View
              style={{
                flex: 0,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: Sizes.fixPadding * 0.5,
                backgroundColor: '#FB4A59',
              }}>
              <View
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: 5,
                  backgroundColor: Colors.white,
                  marginRight: Sizes.fixPadding * 0.5,
                }}
              />
              <Text style={{...Fonts.white12RobotoMedium}}>Live</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={{
            marginLeft: Sizes.fixPadding,
            backgroundColor: '#FB4A59',
            paddingHorizontal: Sizes.fixPadding * 1.5,
            borderRadius: 1000,
            paddingVertical: Sizes.fixPadding * 0.2,
            elevation: 5,
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.2,
            shadowColor: Colors.blackLight
            
          }}>
          <Text style={{...Fonts.white14RobotoMedium, fontSize: 13}}>End</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default Header;