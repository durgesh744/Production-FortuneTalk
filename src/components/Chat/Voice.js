import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useState, useEffect} from 'react';
import * as Progress from 'react-native-progress';
import {Slider} from '@rneui/themed';
import {Colors, Sizes, Fonts} from '../../assets/style';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SCREEN_WIDTH } from '../../config/Screen';
var Sound = require('react-native-sound');

const Voice = ({item, uploadProgress}) => {
  console.log(item)
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [whoosh, setWhoosh] = useState(null);
  const [isPaused, setIsPaused] = useState(false);

  const play_sound = () => {
    if (whoosh) {
      whoosh.release();
    }
    const sound = new Sound(item.voice, Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log('Failed to load the sound', error);
      } else {
        setDuration(sound.getDuration());
        setWhoosh(sound);
        setIsPlaying(true);
        sound.play();
      }
    });
  };

  const play_pause = () => {
    if (isPlaying) {
      whoosh.stop(() => {
        setCurrentTime(0);
        setIsPlaying(false);
        setIsPaused(false);
      });
    } else {
      play_sound();
    }
  };

  const stop_audio = () => {
    // console.log('sdfksdf');
    if (isPlaying) {
      // console.log('sdfksdf');
      whoosh.stop(() => {
        setCurrentTime(0);
        setIsPlaying(false);
        setIsPaused(false);
      });
    }
  };

  const formatTime = seconds => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes < 10 ? '0' : ''}${minutes}:${
      remainingSeconds < 10 ? '0' : ''
    }${remainingSeconds}`;
  };

  useEffect(() => {
    // Update the slider position based on the audio progress
    if (isPlaying) {
      const intervalId = setInterval(() => {
        whoosh?.getCurrentTime(seconds => {
          setCurrentTime(seconds);
          if (duration.toFixed(1) == parseFloat(seconds).toFixed(1)) {
            setCurrentTime(0);
            setIsPlaying(false);
            clearInterval(intervalId);
          }
        });
      }, 1000);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [isPlaying, whoosh]);

  const handle_play_pause = () => {
    if (isPlaying) {
      setIsPaused(true);
    }
  };

  return (
    <View style={{width: SCREEN_WIDTH*0.45, padding: Sizes.fixPadding}}>
      <TouchableOpacity>
        {!item?.sent ? (
          <Progress.Pie
            size={0}
            indeterminate={true}
            progress={uploadProgress}
            borderWidth={3}
            borderColor={Colors.white}
          />
        ) : (
          <View style={[styles.row]}>
            <TouchableOpacity onPress={() => play_pause()}>
              <Ionicons
                name={isPlaying ? 'pause' : 'play'}
                color={Colors.black}
                size={30}
              />
            </TouchableOpacity>
            {/* <TouchableOpacity
              style={{marginLeft: Sizes.fixPadding}}
              onPress={() => stop_audio()}>
              <Ionicons name="stop" color={Colors.black} size={30} />
            </TouchableOpacity> */}
          </View>
        )}

        <Slider
          disabled
          step={1}
          thumbStyle={{width: 10, height: 10}}
          value={currentTime}
          minimumValue={0}
          maximumValue={duration}
        />
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={{color:'grey'}}>{formatTime(currentTime)}</Text>
          <Text style={{color:'grey'}}>{duration && formatTime(duration)}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Voice;

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
    backgroundColor: Colors.grayLight,
    borderTopLeftRadius: Sizes.fixPadding * 4,
    elevation: 8,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowColor: Colors.blackLight
  },
});
