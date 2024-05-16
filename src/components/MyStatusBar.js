import {View, Text, StatusBar} from 'react-native';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const MyStatusBar = ({backgroundColor, barStyle, translucent}) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={{height: insets.top, backgroundColor: backgroundColor}}>
      <StatusBar
        animated={true}
        backgroundColor={backgroundColor}
        barStyle={barStyle} 
        translucent={translucent}
      />
    </View>
  );
};

export default MyStatusBar;
