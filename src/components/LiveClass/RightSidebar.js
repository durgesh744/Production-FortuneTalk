import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Colors, Sizes} from '../../assets/style';

const RightSidebar = ({updateState}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => updateState({commentsVisible: true})}
        style={styles.button}>
        <Ionicons
          name="chatbubble-ellipses-outline"
          color={Colors.white}
          size={25}
        />
      </TouchableOpacity>
    </View>
  );
};

export default RightSidebar;

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-end',
    marginRight: Sizes.fixPadding,
  },
  button: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 1000,
  },
});
