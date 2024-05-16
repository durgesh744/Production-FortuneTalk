import {View, Text} from 'react-native';
import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import CurrentCourses from '../screens/Courses/CurrentCourses';
import CompletedCourses from '../screens/Courses/CompletedCourses';
import MyHeader from '../components/MyHeader';
import {Colors, Fonts} from '../assets/style';
import CurrentCoursesDetails from '../screens/Courses/CurrentCoursesDetails';
import CompletedCoursesDetails from '../screens/Courses/CompletedCoursesDetails';
import MyStatusBar from '../components/MyStatusBar';

const Tab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();

const CurrentCoursesNav = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="currentCourses" component={CurrentCourses} />
      <Stack.Screen
        name="currentCoursesDetails"
        component={CurrentCoursesDetails}
      />
    </Stack.Navigator>
  );
};

const CompletedCoursesNav = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="completedCourses" component={CompletedCourses} />
      <Stack.Screen
        name="completedCoursesDetails"
        component={CompletedCoursesDetails}
      />
    </Stack.Navigator>
  );
};

const MyCourses = ({navigation}) => {
  return (
    <View style={{flex: 1}}>
      <MyStatusBar backgroundColor={Colors.primaryLight} barStyle={'light-content'} />
      {header()}
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {backgroundColor: Colors.primaryLight},
          tabBarLabelStyle: {...Fonts.white18RobotBold, fontSize: 12},
          tabBarIndicatorStyle: {
            backgroundColor: Colors.white,
            height: 5,
            borderTopLeftRadius: 1000,
            borderTopRightRadius: 1000,
          },
        }}>
        <Tab.Screen
          name="currentCoursesNav"
          component={CurrentCoursesNav}
          options={{tabBarLabel: 'Current Courses'}}
        />
        <Tab.Screen
          name="completedCoursesNav"
          component={CompletedCoursesNav}
          options={{tabBarLabel: 'Completed Courses'}}
        />
      </Tab.Navigator>
    </View>
  );
  function header() {
    return <MyHeader title={'My Courses'} navigation={navigation} />;
  }
};

export default MyCourses;
