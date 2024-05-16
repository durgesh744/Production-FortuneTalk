import {View, Text, Dimensions, StyleSheet} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../screens/Home';
import Call from '../screens/Call';
import Chat from '../screens/Chat';
import Live from '../screens/Live';
import Learn from '../screens/Courses/Learn';
import {Colors} from '../assets/style';
import {TouchableOpacity} from 'react-native';
import CustomBottomTab from '../components/BottomTabs/CustomBottomTab';
import Courses from '../screens/Courses/Courses';

const {width, height} = Dimensions.get('screen');

const Tab = createBottomTabNavigator();

const BottomTabs = ({navigation}) => {
  return (
    <Tab.Navigator
      initialRouteName={'home3'}
      tabBar={props => <CustomBottomTab {...props} />}>
      <Tab.Group
        screenOptions={{headerShown: false, headerShadowVisible: false}}>
        <Tab.Screen name="live" component={Live} />
        <Tab.Screen name="chat" component={Chat} />
        <Tab.Screen name="home3" component={Home} options={{tabBarLabel: 'Home'}} />
        <Tab.Screen name="call" component={Call} />
        <Tab.Screen name="learn" component={Courses} />
      </Tab.Group>
    </Tab.Navigator>
  );
};

export default BottomTabs;

const styles = StyleSheet.create({
  container: {
    height: 50, // Adjust the height as needed
  },
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: Colors.white,
    borderRadius: width * 0.5,
    marginHorizontal: 4,
    marginBottom: 5,
    shadowColor: Colors.gray,
    shadowOffset: {width: 2, height: 1},
    shadowOpacity: 0.3,
    paddingHorizontal: 5,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleButton: {
    flex: 0,
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: (width * 0.15) / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    position: 'relative',
    bottom: 25,
    backfaceVisibility: 'hidden',
    shadowOffset: {
      width: 2,
      height: 1,
    },
    shadowColor: Colors.gray,
    shadowOpacity: 0.3,
  },
});
