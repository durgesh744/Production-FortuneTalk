import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import React, {useState} from 'react';
import {Colors, Fonts, Sizes} from '../assets/style';
import MyStatusBar from '../components/MyStatusBar';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {SCREEN_WIDTH} from '../config/Screen';
import WalletHistory from './History/WalletHistory';
import CallHistory from './History/CallHistory';
import ChatHistory from './History/ChatHistory';
import Shopmail from './History/Shopmail';
import Report from './History/Report';
import RemedyHistory from './History/RemedyHistory';
import LiveCallHistory from './History/LiveCallHistory';

const nav_data = [
  {id: 1, title: 'Wallet', label: 'Wallet Transaction'},
  {id: 2, title: 'Call', label: 'Call History'},
  {id: 3, title: 'Chat', label: 'Chat History'},
  {id: 4, title: 'Shopmail', label: 'Fortune store History'},
  {id: 5, title: 'Courses', label: 'Courses History'},
  {id: 6, title: 'Remedy', label: 'Remedy History'},
  {id: 7, title: 'Live', label: 'Live Streaming'},
];

const History = ({navigation}) => {
  const [state, setState] = useState({
    active: nav_data[0],
  });

  const updateState = data => setState({...state, ...data});

  const {active} = state;

  return (
    <View style={{flex: 1, backgroundColor: Colors.bodyColor}}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      <View style={{flex: 1}}>
        {header()}
        <View style={{flex: 0}}>{menuInfo()}</View>
        <View></View>
        {screensInfo()}
      </View>
    </View>
  );

  function screensInfo() {
    return (
      <View style={{flex: 1}}>
        {active.id == 1 ? (
          <WalletHistory navigation={navigation} />
        ) : active.id == 2 ? (
          <CallHistory navigation={navigation} />
        ) : active.id == 3 ? (
          <ChatHistory navigation={navigation} />
        ) : active.id == 4 ? (
          <Shopmail navigation={navigation} />
        ) : active.id == 5 ? (
          <Report navigation={navigation} />
        ) : active.id == 6 ? (
          <RemedyHistory navigation={navigation} />
        ) : (
          <LiveCallHistory navigation={navigation} />
        )}
      </View>
    );
  }

  function menuInfo() {
    const renderItem = ({item, index}) => {
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => updateState({active: item})}
          style={{
            width: SCREEN_WIDTH * 0.25,
            height: 30,
            ...styles.center,
            backgroundColor:
              item.id == active.id ? Colors.primaryLight : Colors.grayLight,
            marginRight: Sizes.fixPadding,
            borderRadius: 1000,
            elevation: 3,
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.2,
            shadowColor: Colors.black,
          }}>
          <Text
            style={
              item.id == active.id
                ? {...Fonts.white14RobotoMedium}
                : {...Fonts.gray14RobotoMedium}
            }>
            {item.title}
          </Text>
        </TouchableOpacity>
      );
    };
    return (
      <FlatList
        data={nav_data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal
        contentContainerStyle={{flex: 0, padding: Sizes.fixPadding}}
        style={{
          flex: 0,
          borderBottomWidth: 1,
          borderBottomColor: Colors.grayLight,
        }}
      />
    );
  }

  function header() {
    return (
      <View
        style={{
          padding: Sizes.fixPadding * 1.5,
          ...styles.row,
          justifyContent: 'space-between',
          borderBottomWidth: 1,
          borderBottomColor: Colors.grayLight,
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign
            name="leftcircleo"
            color={Colors.primaryLight}
            size={Sizes.fixPadding * 2.2}
          />
        </TouchableOpacity>
        <Text
          style={{
            ...Fonts.primaryLight15RobotoMedium,
            textAlign: 'center',
            flex: 1,
          }}>
          {active?.label}
        </Text>
      </View>
    );
  }
};

export default History;

const styles = StyleSheet.create({
  row: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
