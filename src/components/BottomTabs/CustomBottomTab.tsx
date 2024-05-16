import {View, Text, StyleSheet} from 'react-native';
import React, {FC, useEffect, useState} from 'react';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Path, Svg} from 'react-native-svg';
import usePath from '../../hooks/usePath';
import {getPathXCenter} from '../../assets/utils/Path';
import {SCREEN_WIDTH} from '../../config/Screen';
import AnimatedCircle from './AnimatedCircle';
import TabItem from './TabItem';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {interpolatePath} from 'react-native-redash';
import {Colors} from '../../assets/style';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const CustomBottomTab: FC<BottomTabBarProps> = ({
  state,
  navigation,
  descriptors,
}) => {
  const {containerPath, curvedPaths, tHight} = usePath();
  const circleXCoordinates = useSharedValue(0);
  const progress = useSharedValue(3);
  const [selectedIndex, setSelectedIndex] = useState(2);
  const handleMoveCircle = (currentPath: string) => {
    circleXCoordinates.value = getPathXCenter(currentPath);
  };

  const selectIcon = (routeName: string) => {
    switch (routeName) {
      case 'home3':
        return 'home';
      case 'live':
        return 'home';
      case 'learn':
        return 'home';
      case 'chat':
        return 'home';
      case 'call':
        return 'home';
      default:
        return 'home';
    }
  };

  useEffect(() => {
    setSelectedIndex(state.index);
  }, [state.index]);

  const animatedProps = useAnimatedProps(() => {
    const currentPath = interpolatePath(
      progress.value,
      Array.from({length: curvedPaths.length}, (_, index) => index + 1),
      curvedPaths,
    );
    runOnJS(handleMoveCircle)(currentPath);
    return {
      d: `${containerPath} ${currentPath}`,
    };
  });

  const is_register = async () => {
    const check_is_register = await AsyncStorage.getItem('isRegister');
    const isRegister = JSON.parse(check_is_register);
    if (!isRegister) {
      navigation.navigate('profile');
    }
  };

  const handleTabPress = async(index: number, tab: string) => {
    switch (tab) {
      case 'chat': {
        const check_is_register = await AsyncStorage.getItem('isRegister');
        const isRegister = JSON.parse(check_is_register);
        if (!isRegister?.value) {
          if(isRegister?.type == 'profile'){
            navigation.navigate('profile')
          }else{
            navigation.navigate('login')
          }
        } else {
          navigation.navigate(tab);
          progress.value = withTiming(3);
          setSelectedIndex(index - 1);
        }
        break;
      }
      case 'call': {
        const check_is_register = await AsyncStorage.getItem('isRegister');
        const isRegister = JSON.parse(check_is_register);
        if (!isRegister?.value) {
          if(isRegister?.type == 'profile'){
            navigation.navigate('profile')
          }else{
            navigation.navigate('login')
          }
        } else {
          navigation.navigate(tab);
          progress.value = withTiming(3);
          setSelectedIndex(index - 1);
        }
        break;
      }
      default: {
        navigation.navigate(tab);
        progress.value = withTiming(3);
        setSelectedIndex(index - 1);
      }
    }
  };
  return (
    <View style={styles.tabBarContainer}>
      <Svg width={SCREEN_WIDTH} height={tHight} style={styles.shadowMd}>
        <AnimatedPath fill={Colors.grayLight} animatedProps={animatedProps} />
      </Svg>
      <AnimatedCircle circleX={circleXCoordinates} index={selectedIndex} />
      <View style={[styles.tabItemsContainer, {height: tHight}]}>
        {state.routes.map((route, index) => {
          const {options} = descriptors[route.key];
          const label = options.tabBarLabel ? options.tabBarLabel : route.name;
          return (
            <TabItem
              key={index.toString()}
              label={label as string}
              icon={selectIcon(route.name)}
              activeIndex={state.index + 1}
              index={index}
              onTabPress={() => handleTabPress(index + 1, route.name)}
            />
          );
        })}
      </View>
    </View>
  );
};

export default CustomBottomTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 2,
  },
  shadowMd: {
    elevation: 1,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowColor: Colors.blackLight,
  },
  tabItemsContainer: {
    position: 'absolute',
    flexDirection: 'row',
    width: '100%',
  },
});
