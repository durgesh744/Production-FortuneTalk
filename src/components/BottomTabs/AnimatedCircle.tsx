import React, {FC} from 'react';
import {StyleSheet} from 'react-native';
import Animated, {SharedValue, useAnimatedStyle} from 'react-native-reanimated';
import {Colors} from '../../assets/style';
import {View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

type CircleProps = {
  circleX: Animated.SharedValue<number>;
  index: number;
};

const circleContainerSize = 90;

const gradient_a = [Colors.primaryLight, Colors.primaryDark]
const gradient_b = [Colors.white, Colors.white]

const AnimatedCircle: FC<CircleProps> = ({circleX, index}) => {
  const circleContainerStyle = useAnimatedStyle(() => {
    return {
      // transform: [{translateX: circleX.value - circleContainerSize / 2}],
    };
  }, []);
  return (
    <Animated.View style={[circleContainerStyle, styles.container]}>
      <LinearGradient
        colors={index == 2 ? gradient_a : gradient_b}
        locations={[0.3, 1]}
        style={{
          width: circleContainerSize,
          height: circleContainerSize,
          borderRadius: circleContainerSize,
        }}
      />
    </Animated.View>
  );
};

export default AnimatedCircle;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -circleContainerSize / 2.5,
    width: circleContainerSize,
    height: circleContainerSize,
    borderRadius: circleContainerSize,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowColor: Colors.blackLight,
    zIndex: -1,
    //added
    alignSelf: 'center',
  },
});
