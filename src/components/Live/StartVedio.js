import {View, Text, StyleSheet, FlatList} from 'react-native';
import React from 'react';
import {Modal} from 'react-native-paper';
import {Colors, Fonts, Sizes} from '../../assets/style';
import LinearGradient from 'react-native-linear-gradient';
import {TouchableOpacity} from 'react-native';

const StartVedio = ({startVedioVisible, updateState, startStreaming}) => {
  return (
    <Modal
      visible={startVedioVisible}
      onDismiss={() => updateState({startVedioVisible: false})}
      contentContainerStyle={{
        flex: 0,
        paddingVertical: Sizes.fixPadding * 2,
        backgroundColor: Colors.white,
        marginHorizontal: Sizes.fixPadding * 1.5,
        borderRadius: Sizes.fixPadding * 2,
        paddingHorizontal: Sizes.fixPadding,
        elevation: 8,
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.2,
        shadowColor: Colors.blackLight
      }}>
      <Text
        style={{
          ...Fonts.primaryLight18RobotoMedium,
          textAlign: 'center',
        }}>
        Aceepted
      </Text>
      <Text
        style={{
          ...Fonts.gray12RobotoMedium,
          textAlign: 'center',
          marginBottom: Sizes.fixPadding,
        }}>
        Astrologer send you request for start vedio call.
      </Text>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => startStreaming()}
        style={{alignSelf: 'center'}}>
        <LinearGradient
          colors={[Colors.primaryLight, Colors.primaryDark]}
          style={[
            {
              width: 100,
              paddingVertical: Sizes.fixPadding * 0.5,
              borderRadius: 1000,
            },
          ]}>
          <Text
            style={{
              ...Fonts.white16RobotoMedium,
              textAlign: 'center',
            }}>
            Start
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </Modal>
  );
};

export default StartVedio;
