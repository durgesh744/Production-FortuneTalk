import {View, Text} from 'react-native';
import React from 'react';
import {Colors, Fonts, Sizes} from '../../assets/style';

const Timer = ({}) => {
  return (
    <View
      style={{
        marginHorizontal: Sizes.fixPadding,
        backgroundColor: Colors.primaryLight,
        alignSelf: 'flex-start',
        marginTop: Sizes.fixPadding*0.5,
        paddingHorizontal: Sizes.fixPadding*0.5,
        paddingVertical: Sizes.fixPadding*0.1,
        borderRadius: 1000,
        elevation: 8,
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.2,
        shadowColor: Colors.blackLight
      }}>
      <Text style={{...Fonts.white12RobotoMedium, fontSize: 11}}>05:56 min</Text>
    </View>
  );
};

export default Timer;
