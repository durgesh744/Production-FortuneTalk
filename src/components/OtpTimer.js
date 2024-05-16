import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Fonts, Sizes} from '../assets/style';

let interval;

const OtpTimer = ({duration, onResend}) => {
  const [leftTime, setLeftTime] = useState(duration);

  useEffect(() => {
    interval = setInterval(() => {
      setLeftTime(prev => {
        if (prev - 1 <= 0) {
          clearInterval(interval);
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const formatTime = seconds => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return (
      String(minutes).padStart(2, '0') +
      ':' +
      String(remainingSeconds).padStart(2, '0')
    );
  };

  return (
    <View
      style={{
        flex: 0,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: Sizes.fixPadding * 3,
      }}>
      {leftTime != 0 && (
        <>
          <Text style={{...Fonts.gray14RobotoRegular}}>Resend code in </Text>
          <Text style={{...Fonts.greenDark14InterMedium}}>
            {formatTime(leftTime)} Sec{' '}
          </Text>
        </>
      )}

      {leftTime == 0 && (
        <Text onPress={onResend} style={{...Fonts.primaryLight14RobotoMedium}}>
          Resend
        </Text>
      )}
    </View>
  );
};

export default OtpTimer;
