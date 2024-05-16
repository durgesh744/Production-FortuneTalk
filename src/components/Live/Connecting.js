import {View, Text, Modal} from 'react-native';
import React from 'react';
import {Colors, Fonts} from '../../assets/style';
import MyStatusBar from '../MyStatusBar';

const Connecting = ({connected, navigation}) => {
  return (
    <Modal visible={connected} onRequestClose={() => navigation.goBack()}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Colors.black,
        }}>
        <MyStatusBar
          backgroundColor={Colors.black}
          barStyle={'light-content'}
        />
        <Text style={{...Fonts.white14RobotoMedium}}>Connecting...</Text>
      </View>
    </Modal>
  );
};

export default Connecting;
