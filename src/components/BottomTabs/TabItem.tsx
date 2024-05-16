import React, {FC, useEffect} from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {SCREEN_WIDTH} from '../../config/Screen';
import Feather from 'react-native-vector-icons/Feather';
import usePath from '../../hooks/usePath';
import {getPathXCenterByIndex} from '../../assets/utils/Path';
import {Colors, Fonts, Sizes} from '../../assets/style';

export type TabProps = {
  label: string;
  icon: string;
  index: number;
  activeIndex: number;
  onTabPress: () => void;
};

const ICON_SIZE = 20;
const LABEL_WIDTH = SCREEN_WIDTH / 5;
const AnimatedIcon = Animated.createAnimatedComponent(Image);

const IMAGE_ICON = [
  require(`../../assets/images/icons/live.png`),
  require(`../../assets/images/icons/chat.png`),
  require(`../../assets/images/icons/home.png`),
  require(`../../assets/images/icons/call.png`),
  require(`../../assets/images/icons/learn.png`),
];

const TabItem: FC<TabProps> = ({
  label,
  icon,
  index,
  activeIndex,
  onTabPress,
}) => {
  const {curvedPaths} = usePath();
  const animatedActiveIndex = useSharedValue(activeIndex);
  const iconPosition = getPathXCenterByIndex(curvedPaths, index);
  const labelPosition = getPathXCenterByIndex(curvedPaths, index);

  const tabStyle = useAnimatedStyle(() => {
    // const translateY = animatedActiveIndex.value - 1 === index ? -10 : 8;
    const translateY = index === 2 ? -10 : 8;
    const iconPositionX = iconPosition - index * ICON_SIZE;
    return {
      width: ICON_SIZE,
      height: ICON_SIZE,
      transform: [
        {translateY: withTiming(translateY)},
        {
          translateX:
            index + 1 === 3
              ? iconPositionX - ICON_SIZE / 1
              : iconPositionX - ICON_SIZE / 2,
        },
      ],
    };
  });

  const labelContainerStyle = useAnimatedStyle(() => {
    // const translateY = animatedActiveIndex.value - 1 != index ? 36 : 80;
    const translateY = index != 2 ? 35 : 80;
    return {
      transform: [
        {translateY: withTiming(translateY)},
        {translateX: labelPosition - LABEL_WIDTH / 2.1},
      ],
    };
  });

  const iconColor = useSharedValue(
    index + 1 == 3 ? 'white' : 'rgba(128,128,128, 0.8)',
  );

  const iconSize = useSharedValue(
    index + 1 == 3 ? {width: 25, height: 25} : {width: 20, height: 20},
  );

  useEffect(() => {
    animatedActiveIndex.value = activeIndex;
    if (index + 1 == 3) {
      iconColor.value = withTiming(Colors.primaryLight);
    } else {
      iconColor.value = withTiming(Colors.primaryLight);
    }
    if (index + 1 === 3) {
      iconSize.value = withTiming({width: 25, height: 25});
    }
  }, [activeIndex]);

  const animatedIconProps = useAnimatedProps(() => ({
    style: {tintColor: iconColor.value, ...iconSize.value},
  }));

  return (
    <>
      <Animated.View style={[tabStyle]}>
        {index == 1 || index == 3 ? (
          <View
            style={{
              position: 'absolute',
              top: -Sizes.fixPadding * 7,
              zIndex: 999,
              alignSelf: 'center',
            }}>
            {/* <Animated.Image
              source={
                index == 1
                  ? require('../../assets/gifs/chat_tab.gif')
                  : require('../../assets/gifs/call_tab.gif')
              }
             // useNativeDriver={true}
              
              style={{width: 85, height: 85}}
            /> */}
          </View>
        ) : null}

        <TouchableOpacity
          testID={`tab${label}`}
          hitSlop={{top: 30, bottom: 30, left: 30, right: 30}}
          onPress={onTabPress}>
          {/* <AnimatedIcon
            source={IMAGE_ICON[index]}
            animatedProps={animatedIconProps}
          /> */}
          <Image
            source={IMAGE_ICON[index]}
            // animatedProps={animatedIconProps}
            style={
              index + 1 == 3
                ? [
                    styles.homeImage,
                    {tintColor: activeIndex != 3 ? Colors.primaryLight : Colors.white},
                  ]
                : index == 1 || index == 3
                ? styles.animatedImage
                : index + 1 == activeIndex
                ? styles.activeImage
                : styles.inActiveImage
            }
            resizeMode="contain"
          />
        </TouchableOpacity>
      </Animated.View>
      <Animated.View style={[labelContainerStyle, styles.labelContainer]}>
        <Text
          style={{
            ...styles.label,
            // color: activeIndex == index + 1 ? Colors.primaryLight : Colors.gray,
            color:
              (activeIndex == 1 && index + 1 == 1) ||
              (activeIndex == 5 && index + 1 == 5)
                ? Colors.primaryLight
                : Colors.gray,
          }}>
          {label}
        </Text>
      </Animated.View>
    </>
  );
};

export default TabItem;

const styles = StyleSheet.create({
  labelContainer: {
    position: 'absolute',
    alignItems: 'center',
    width: LABEL_WIDTH,
  },
  label: {
    ...Fonts.gray14RobotoRegular,
    fontSize: 13,
    textTransform: 'capitalize',
  },
  homeImage: {
    width: 30,
    height: 30,
    tintColor: Colors.white,
    marginLeft: Sizes.fixPadding * 0.5,
  },
  animatedImage: {
    width: 20,
    height: 20,
    tintColor: Colors.primaryLight,
  },
  activeImage: {
    width: 25,
    height: 25,
    tintColor: Colors.primaryLight,
  },
  inActiveImage: {
    width: 20,
    height: 20,
    tintColor: Colors.gray,
  },
});
