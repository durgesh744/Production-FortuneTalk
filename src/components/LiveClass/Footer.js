import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import React, {useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors, Sizes } from '../../assets/style';

const Footer = ({muted, micHandle, startScreenShare, stopScreenShare, callEnd}) => {
  const [isScreenSharing, setIsScreenSharing] = useState(true);
  const [frontBackCamera, setFrontBackCamera] = useState(false)

  const screen_sharing_handle = () => {
    // startScreenShare();
    // if (isScreenSharing) {
    //   setIsScreenSharing(false)
    //   stopScreenShare();
    // } else {
    //   setIsScreenSharing(true)
    //   startScreenShare();
    // }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.buttonContainer}>
        <Ionicons name="videocam" color={Colors.white} size={20} />
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          micHandle();
        }}
        style={styles.buttonContainer}>
        <Ionicons
          name={muted ? 'mic-off' : 'mic'}
          color={Colors.white}
          size={20}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => screen_sharing_handle()}
        style={styles.mainContainer}>
        <Image
          source={require('../../assets/images/icons/screen_share.png')}
          style={{width: '70%', height: '70%'}}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonContainer}>
        <Ionicons name="volume-medium-sharp" color={Colors.white} size={20} />
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={0.8} onPress={()=>callEnd()} style={styles.buttonContainer}>
        <Image
          source={require('../../assets/images/icons/phone_end.png')}
          style={{width: '100%', height: '100%', borderRadius: 1000}}
        />
      </TouchableOpacity>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  container: {
    margin: Sizes.fixPadding * 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    width: 38,
    height: 38,
    borderRadius: 100,
    backgroundColor: Colors.grayDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContainer: {
    width: 60,
    height: 60,
    borderRadius: 100,
    backgroundColor: Colors.grayDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
