import {View, Text, Modal, StyleSheet} from 'react-native';
import React from 'react';
import {Skeleton} from '@rneui/themed';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../config/Screen';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../../assets/style';
// import {Sizes} from '../../assets/style';

const Sizes = {
  fixPadding: SCREEN_HEIGHT * 0.015,
};

const HomeSkeleton = ({visible}) => {
  return (
    <Modal
    visible={visible}
    >
      <View
        style={{
          flex: 1,
        }}>
        <View style={[{padding: Sizes.fixPadding * 1.5}]}>
          <Skeleton  LinearGradientComponent={LinearGradient}
            animation='wave' style={{width: '100%', height: Sizes.fixPadding * 4}} />
        </View>
        <View style={[{paddingHorizontal: Sizes.fixPadding * 1.5}]}>
          <Skeleton
           LinearGradientComponent={LinearGradient}
           animation='wave'
            style={{
              width: '100%',
              height: Sizes.fixPadding * 4,
              borderRadius: 1000,
            }}
          />
        </View>
        <View style={[{padding: Sizes.fixPadding * 1.5}]}>
          <Skeleton
            LinearGradientComponent={LinearGradient}
            animation='wave'
            style={{
              width: '100%',
              height: Sizes.fixPadding * 12,
              borderRadius: Sizes.fixPadding,
            }}
          />
        </View>
        <View
          style={[
            styles.row,
            {
              paddingHorizontal: Sizes.fixPadding * 1.5,
              justifyContent: 'space-between',
            },
          ]}>
          <Skeleton
            LinearGradientComponent={LinearGradient}
            animation='wave'
            circle
            style={{
              width: Sizes.fixPadding * 6,
              height: Sizes.fixPadding * 6,
              borderRadius: 1000,
            }}
          />
          <Skeleton
            LinearGradientComponent={LinearGradient}
            animation='wave'
            circle
            style={{
              width: Sizes.fixPadding * 6,
              height: Sizes.fixPadding * 6,
              borderRadius: 1000,
            }}
          />

          <Skeleton
            LinearGradientComponent={LinearGradient}
            animation='wave'
            circle
            style={{
              width: Sizes.fixPadding * 6,
              height: Sizes.fixPadding * 6,
              borderRadius: 1000,
            }}
          />

          <Skeleton
            LinearGradientComponent={LinearGradient}
            animation='wave'
            circle
            style={{
              width: Sizes.fixPadding * 6,
              height: Sizes.fixPadding * 6,
              borderRadius: 1000,
            }}
          />
        </View>
        <View style={[{padding: Sizes.fixPadding * 1.5}]}>
          <Skeleton
           LinearGradientComponent={LinearGradient}
           animation='wave'
            style={{
              width: '70%',
              height: Sizes.fixPadding*2,
              borderRadius: Sizes.fixPadding * 2,
            }}
          />
        </View>
        <View
          style={[
            styles.row,
            {
              paddingHorizontal: Sizes.fixPadding * 1.5,
              justifyContent: 'space-between',
            },
          ]}>
          <Skeleton
           LinearGradientComponent={LinearGradient}
           animation='wave'
            style={{
              width: SCREEN_WIDTH * 0.35,
              height: SCREEN_WIDTH * 0.35,
              borderRadius: Sizes.fixPadding,
            }}
          />
          <Skeleton
           LinearGradientComponent={LinearGradient}
           animation='wave'
            style={{
              width: SCREEN_WIDTH * 0.35,
              height: SCREEN_WIDTH * 0.35,
              borderRadius: Sizes.fixPadding,
            }}
          />
        </View>
        <View style={[{padding: Sizes.fixPadding * 1.5}]}>
          <Skeleton
           LinearGradientComponent={LinearGradient}
           animation='wave'
            style={{
              width: '70%',
              height: Sizes.fixPadding*2,
              borderRadius: Sizes.fixPadding * 2,
            }}
          />
        </View>
        <View
          style={[
            styles.row,
            {
              paddingHorizontal: Sizes.fixPadding * 1.5,
              justifyContent: 'space-between',
            },
          ]}>
          <Skeleton
           LinearGradientComponent={LinearGradient}
           animation='wave'
            style={{
              width: SCREEN_WIDTH * 0.35,
              height: SCREEN_WIDTH * 0.35,
              borderRadius: Sizes.fixPadding,
            }}
          />
          <Skeleton
           LinearGradientComponent={LinearGradient}
           animation='wave'
            style={{
              width: SCREEN_WIDTH * 0.35,
              height: SCREEN_WIDTH * 0.35,
              borderRadius: Sizes.fixPadding,
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

export default HomeSkeleton;

const styles = StyleSheet.create({
  row: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
