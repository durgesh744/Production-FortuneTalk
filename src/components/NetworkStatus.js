import {View, Text} from 'react-native';
import React from 'react';
import {Colors, Fonts} from '../assets/style';

const NetworkStatus = ({status}) => {
  console.log(status);
  if (status) {
    return null;
  }
  return (
    <View style={{flex: 0, backgroundColor: Colors.gray}}>
      <Text style={{...Fonts.white14RobotoRegular, textAlign: 'center'}}>
        Offline
      </Text>
    </View>
  );
};

export default NetworkStatus;
