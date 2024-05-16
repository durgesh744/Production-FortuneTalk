import {Image, StatusBar, Text, TouchableOpacity, View} from 'react-native';
import React, {Component, useEffect, useState} from 'react';
import {SCREEN_WIDTH} from '../../config/Screen';
import {Colors, Fonts, Sizes} from '../../assets/style';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {img_url_2} from '../../config/constants';
import Timer from './Timer';
import Share from 'react-native-share';

const Header = ({
  astroData,
  isTimerStart,
  time,
  totalUser,
  coHostedData,
  userName,
  isCoHosting,
  isFollow,
  followAstrologer
}) => {
  const on_share = () => {
    const options = {
      title: 'FortuneTalk',
      message: 'Download the app',
      url: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.figma.com%2Fcommunity%2Ffile%2F1288818003070370272%2Fbanner-app-in-playstore&psig=AOvVaw3OYjEoRy03GCoGyyg_K3m9&ust=1705754713378000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCPiFi9G96YMDFQAAAAAdAAAAABAD',
    };
    Share.open(options)
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.log(err);
      });
  };
  return (
    <View
      style={{
        flex: 0,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: Sizes.fixPadding,
        marginTop: StatusBar.currentHeight + Sizes.fixPadding,
      }}>
      <View
        style={{
          width: SCREEN_WIDTH * 0.14,
          height: SCREEN_WIDTH * 0.14,
          borderRadius: 1000,
          borderWidth: 2,
          borderColor: Colors.white,
          zIndex: 1,
        }}>
        <Image
          source={{uri: img_url_2 + astroData?.img_url}}
          style={{width: '100%', height: '100%', borderRadius: 1000}}
        />
        <Image
          source={require('../../assets/gifs/live_gif.gif')}
          style={{
            width: '100%',
            height: 13,
            resizeMode: 'contain',
            position: 'absolute',
            bottom: -Sizes.fixPadding * 0.5,
          }}
        />
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: Colors.gray,
          paddingHorizontal: Sizes.fixPadding,
          paddingVertical: Sizes.fixPadding * 0.1,
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
        <View style={{marginLeft: Sizes.fixPadding}}>
          <Text
            style={{
              ...Fonts.white12RobotoMedium,
            }}>
            {astroData?.owner_name}
            {coHostedData && `/${coHostedData?.userName}`}
            {isCoHosting && `/${userName}`}
          </Text>
          <View style={{flex: 0, flexDirection: 'row', alignItems: 'center'}}>
            <Ionicons name="eye" color={Colors.white} size={18} />
            <Text
              style={{
                ...Fonts.white12RobotoMedium,
                marginHorizontal: Sizes.fixPadding * 0.5,
              }}>
              {totalUser}
            </Text>
            {isTimerStart && (
              <Text
                style={{
                  ...Fonts.white12RobotoMedium,
                  fontSize: 11,
                  marginLeft: Sizes.fixPadding,
                }}>
                <Timer duration={time} isTimerStart={isTimerStart} /> mins
              </Text>
            )}
          </View>
        </View>

        <TouchableOpacity
          onPress={followAstrologer}
          style={{
            flex: 0,
            backgroundColor: Colors.white,
            alignItems: 'center',
            borderRadius: 1000,
          }}>
          <Text
            style={{
              ...Fonts.primaryLight14RobotoRegular,
              marginHorizontal: Sizes.fixPadding * 0.5,
            }}>
            {isFollow == 1 ? 'Following' : 'Follow'}
          </Text>
        </TouchableOpacity>
      </View>
      {/* <TouchableOpacity
        style={{
          marginLeft: Sizes.fixPadding,
          width: SCREEN_WIDTH * 0.1,
          height: SCREEN_WIDTH * 0.1,
          backgroundColor: Colors.black + '50',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 1000,
        }}>
        <Image
          source={require('../../assets/images/icons/report_live.png')}
          style={{width: '80%', height: '80%'}}
        />
      </TouchableOpacity> */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={()=>on_share()}
        style={{
          marginLeft: Sizes.fixPadding,
          width: SCREEN_WIDTH * 0.1,
          height: SCREEN_WIDTH * 0.1,
          backgroundColor: Colors.black + '50',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 1000,
        }}>
        <Image
          source={require('../../assets/images/icons/share_live.png')}
          style={{width: '60%', height: '60%', resizeMode: 'contain'}}
        />
      </TouchableOpacity>
    </View>
  );
};

export default Header;
