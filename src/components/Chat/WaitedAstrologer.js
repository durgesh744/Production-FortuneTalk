import {View, Text, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors, Fonts, Sizes} from '../../assets/style';
import {SCREEN_WIDTH} from '../../config/Screen';
import {Image} from 'react-native';
import {img_url_2} from '../../config/constants';
import {TouchableOpacity} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import database from '@react-native-firebase/database';

const WaitedAstrologer = ({
  waitedAstroData,
  updateState,
  pause_wait_time,
  cancel_waited_astro,
}) => {
  const [minutes, setMinutes] = useState(null);
  const [isStarted, setIsStarted] = useState(false);
  let interValId;

  useEffect(() => {
    database()
      .ref(`/CurrentRequest/${waitedAstroData?.id}/minutes`)
      .once('value', snapshot => {
        if (snapshot.val()) {
          setMinutes(snapshot.val());
          setIsStarted(true);
        }
      });
  }, []);
 
  // useEffect(() => {
  //   if (
  //     isStarted &&
  //     (waitedAstroData?.status_pause == 1 ||
  //       waitedAstroData?.status_pause == null)
  //   ) {
  //     interValId = setInterval(() => {
  //       setMinutes(prev => prev - 1);
  //       if (minutes < 1) {
  //         clearInterval(interValId);
  //         cancel_waited_astro(waitedAstroData?.id);
  //       }
  //     }, 1000);
  //   }

  //   return () => {
  //     clearInterval(interValId);
  //   };
  // }, [isStarted, waitedAstroData?.status_pause]);

  const formatTime = leftTime => {
    const seconds = parseFloat(leftTime).toFixed(0)
    let hours = Math.floor(seconds / 3600);
    let minutes = Math.floor((seconds % 3600) / 60);
    let remainingSeconds = seconds % 60;
  
    // Add leading zeros if needed
    hours = hours < 10 ? `0${hours}` : hours;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    remainingSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
  
    return `${hours}:${minutes}:${remainingSeconds}`;
  };

  const on_pause_play = () => {
    if (waitedAstroData?.status_pause == 1) {
      pause_wait_time(waitedAstroData?.id);
    } else {
      updateState({pauseVisible: true});
    }
  };
  return (
    <View
      style={[
        styles.row,
        {
          justifyContent: 'space-between',
          paddingVertical: Sizes.fixPadding,
          paddingHorizontal: Sizes.fixPadding * 1.5,
          borderBottomWidth: 3,
          borderTopWidth: 3,
          borderColor: Colors.orange,
          backgroundColor: Colors.orange_light,
        },
      ]}>
      <View style={styles.row}>
        <View
          style={{
            width: SCREEN_WIDTH * 0.18,
            height: SCREEN_WIDTH * 0.18,
            borderRadius: 1000,
            overflow: 'hidden',
            borderWidth: 3,
            borderColor: Colors.primaryDark,
          }}>
          <Image
            source={{uri: img_url_2 + waitedAstroData?.img_url}}
            style={{width: '100%', height: '100%'}}
          />
        </View>
        <View style={{marginLeft: Sizes.fixPadding}}>
          <Text style={{...Fonts.gray16RobotoMedium, color: Colors.blackLight}}>
            {waitedAstroData.owner_name}
          </Text>
          <Text style={{...Fonts.gray14RobotoMedium}}>
            ₹
            {parseFloat(waitedAstroData?.chat_price_m) +
              parseFloat(waitedAstroData?.chat_commission)}
            /min (Chat)
          </Text>
          <Text style={{...Fonts.primaryLight14RobotoRegular}}>
            Wait Time - {minutes && formatTime(minutes)}
          </Text>
        </View>
      </View>
      <View style={styles.row}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => on_pause_play()}
          style={[styles.center]}>
          <View style={styles.iconContainer}>
            <MaterialIcons
              name={waitedAstroData?.status_pause == 2 ? 'play-arrow' : 'pause'}
              color={Colors.blackLight}
              size={20}
            />
          </View>
          <Text style={{...Fonts.gray14RobotoMedium}}>
            {waitedAstroData?.status_pause == 2 ? 'Play' : 'Pause'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => updateState({cancelVisible: true})}
          style={[styles.center, {marginLeft: Sizes.fixPadding}]}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="close" color={Colors.blackLight} size={20} />
          </View>
          <Text style={{...Fonts.gray14RobotoMedium}}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WaitedAstrologer;

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
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    height: 30,
    borderRadius: 30,
    backgroundColor: Colors.grayLight,
  },
});
