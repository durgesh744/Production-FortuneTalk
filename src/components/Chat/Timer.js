import {View, Text, StyleSheet, TouchableOpacity, AppState} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import database from '@react-native-firebase/database';
import {Colors, Fonts, Sizes} from '../../assets/style';
import CountDown from './CountDown';

const Timer = ({
  deduct_wallet,
  providerData,
  userData,
  end_chat,
  updateState,
}) => {
  const [minutes, setMinutes] = useState(null);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    database()
      .ref(`CustomerCurrentRequest/${userData?.id}`)
      .on('value', snapshot => {
        if (snapshot.val()?.status == 'active') {
          console.log(snapshot.val()?.startTime,'sfsdfsd')
          getDuration(snapshot.val()?.minutes, snapshot.val()?.startTime);
          // database()
          //   .ref(`CurrentRequest/${providerData?.id}`)
          //   .once('value', snapshot => {
          //     updateState({
          //       startTime: snapshot.val()?.date,
          //       inVoiceId: snapshot.val()?.invoice_id,
          //     });
          //   });
        }
      });
    return () => database().ref(`CustomerCurrentRequest/${userData?.id}`).off();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      subscription.remove();
      database().ref(`CustomerCurrentRequest/${userData?.id}`).off();
    };
  }, []);

  const getDuration = (totalDuration, time) => {
    const currentTime = new Date().getTime(); 
    const startTime = new Date(time).getTime();
    const diffTime = (currentTime - startTime) / 1000;
    const duration = totalDuration - parseInt(diffTime);
    if (duration < 0) {
      setMinutes(0);
    } else {
      setMinutes(duration);
    }
  };

  return (
    <View
      style={[
        styles.row,
        {
          justifyContent: 'space-evenly',
          marginVertical: Sizes.fixPadding * 2,
          backgroundColor: 'transparent',
          zIndex: 999
        },
      ]}>
      <View
        style={{
          backgroundColor: Colors.primaryLight,
          width: '30%',
          paddingVertical: Sizes.fixPadding * 0.5,
          borderRadius: 1000,
        }}>
        <Text style={{...Fonts.white16RobotoMedium, textAlign: 'center'}}>
          {minutes && (
            <CountDown
              duration={minutes}
              deductWallet={deduct_wallet}
              updateState={updateState}
            />
          )}
        </Text>
      </View>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => end_chat()}
        style={{
          backgroundColor: Colors.primaryLight,
          width: '30%',
          paddingVertical: Sizes.fixPadding * 0.5,
          borderRadius: 1000,
        }}>
        <Text style={{...Fonts.white16RobotoMedium, textAlign: 'center'}}>
          End Chat
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Timer;

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
  container: {
    flex: 1,
    backgroundColor: Colors.whiteDark,
    borderTopLeftRadius: Sizes.fixPadding * 4,
    elevation: 8,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowColor: Colors.blackLight,
  },
});
