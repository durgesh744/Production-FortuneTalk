import React, { useRef } from 'react';
import { View, ScrollView, Dimensions, StyleSheet } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  clockRunning,
  block,
  cond,
  set,
  not,
  startClock,
  stopClock,
  Value,
  event,
  spring,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const items = [
  { id: 1, color: 'red' },
  { id: 2, color: 'green' },
  { id: 3, color: 'blue' },
];

const Pagination = () => {
  const translateX = new Value(0);
  const offsetX = new Value(0);
  const velocityX = new Value(0);
  const gestureState = new Value(-1);

  const onGestureEvent = event(
    [
      {
        nativeEvent: {
          translationX: offsetX,
          velocityX,
          state: gestureState,
        },
      },
    ],
    { useNativeDriver: true }
  );

  const translate = block([
    cond(
      not(clockRunning(translateX)),
      startClock(translateX),
      cond(
        eq(gestureState, State.ACTIVE),
        [
          set(
            translateX,
            spring({
              to: offsetX,
              velocity: velocityX,
              stiffness: 1000,
              damping: 100,
              mass: 3,
              overshootClamping: false,
              restSpeedThreshold: 0.01,
              restDisplacementThreshold: 0.01,
              toValue: new Value(0),
              easing: Easing.inOut(Easing.ease),
            })
          ),
        ],
        [
          set(translateX, offsetX),
          cond(clockRunning(translateX), stopClock(translateX)),
        ]
      )
    ),
    translateX,
  ]);

  return (
    <View style={styles.container}>
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onGestureEvent}
      >
        <Animated.View style={{ flexDirection: 'row' }}>
          {items.map((item) => (
            <Animated.View
              key={item.id}
              style={[
                styles.item,
                {
                  width,
                  transform: [{ translateX: translate }],
                },
              ]}
            >
              <View
                style={[styles.itemContent, { backgroundColor: item.color }]}
              />
            </Animated.View>
          ))}
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContent: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});

export default Pagination;
