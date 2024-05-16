import {View, Text} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Fonts } from '../../assets/style';

let interVal;

const Timer = ({duration, isTimerStart}) => {
  const [timeCount, setTimeCount] = useState(duration);
  useEffect(() => {
    setTimeCount(duration);
  }, [duration]);
  useEffect(() => {
    if (isTimerStart) {
      interVal = setInterval(() => {
        if (timeCount > 0) {
          setTimeCount(prevState => prevState - 1);
        } else {
          clearInterval(interVal);
        }
      }, 1000);
    } else {
      clearInterval(interVal);
    }

    return () => {
      clearInterval(interVal);
    };
  }, [isTimerStart]);

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
    <Text style={{...Fonts.white14RobotoMedium}}>{formatTime(timeCount)}</Text>
  );
};

export default Timer;
