import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
var Sound = require('react-native-sound');
var whoosh = new Sound('low_balance.m4a', Sound.MAIN_BUNDLE, error => {
  if (error) {
    console.log('failed to load the sound', error);
    return;
  }
});

whoosh.setNumberOfLoops(0);

const CountDown = ({duration, deductWallet, updateState}) => {
  const [timer, setTimer] = useState(duration);
  useEffect(()=>{
    setTimer(duration)
  }, [duration])

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prevState => {
        if (prevState - 1 <= 0) {
          clearInterval(interval); 
          deductWallet();
        }
        if (prevState - 1 == 120) {
          updateState({balanceAlert: true});
          sound_play()
        }
        return prevState - 1;
      });
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [duration]);

  const sound_play = () => {
    whoosh.play(success => {
      if (success) {
        console.log('successfully finished playing');
      } else {
        console.log('playback failed due to audio decoding errors');
      }
    });
  }

  const formatTime = leftTime => {
    const seconds = parseFloat(leftTime).toFixed(0);
    let hours = Math.floor(seconds / 3600);
    let minutes = Math.floor((seconds % 3600) / 60);
    let remainingSeconds = seconds % 60;

    // Add leading zeros if needed
    hours = hours < 10 ? `0${hours}` : hours;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    remainingSeconds =
      remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

    return `${hours}:${minutes}:${remainingSeconds}`;
  };

  return <Text>{formatTime(timer)}</Text>;
};

export default CountDown;
