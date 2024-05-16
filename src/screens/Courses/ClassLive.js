import {
  View,
  Text,
  FlatList,
  Image,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {Colors, Fonts, Sizes} from '../../assets/style';
import {SCREEN_WIDTH} from '../../config/Screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import MyStatusBar from '../../components/MyStatusBar';
import MyHeader from '../../components/MyHeader';

const ClassLive = ({navigation}) => {
  return (
    <View style={{flex: 1, backgroundColor: Colors.bodyColor}}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      {header()}
      <FlatList
        ListHeaderComponent={
          <>
            {liveVedioInfo()}
            {courseTitleInfo()}
            {courseDescriptionInfo()}
            {classInfo()}
          </>
        }
      />
    </View>
  );

  function classInfo() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        // onPress={() => navigation.navigate('demoClass')}
        >
        <LinearGradient
          colors={[Colors.primaryLight, Colors.primaryDark]}
          style={{paddingVertical: Sizes.fixPadding * 1.5}}>
          <Text style={{...Fonts.white16RobotoMedium, textAlign: 'center'}}>
            Connect to Class 2 Now
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  function courseDescriptionInfo() {
    return (
      <View
        style={{
          padding: Sizes.fixPadding * 2,
          paddingTop: Sizes.fixPadding,
          borderBottomWidth: 1,
          borderBottomColor: Colors.grayLight,
        }}>
        <Text style={{...Fonts.gray12RobotoRegular}}>
          In this module, you will be introduced to the history behind the suit
          of pentacles and its corresponding suit in alternate decks. You will
          study the misconceptions surrounding this history behind the suit of
          pentacles and its corresponding suit in alternate decks. You will
          study the misconceptions surrounding this history behind the suit of
          pentacles and its corresponding suit in alternate decks. You will
          study the misconceptions...
        </Text>
      </View>
    );
  }

  function courseTitleInfo() {
    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 2,
          marginTop: Sizes.fixPadding * 2,
        }}>
        <Text style={{...Fonts.primaryLight14RobotoMedium}}>Class 2</Text>
        <Text style={{...Fonts.gray14RobotoMedium}}>Minor and Major Arcana</Text>
      </View>
    );
  }

  function liveVedioInfo() {
    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 2,
          marginTop: Sizes.fixPadding,
          borderRadius: Sizes.fixPadding,
          overflow: 'hidden',
        }}>
        <ImageBackground
          source={require('../../assets/images/users/user1.jpg')}
          style={{
            width: '100%',
            height: SCREEN_WIDTH * 0.55,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={require('../../assets/images/icons/vedio_play.png')}
            style={{width: 40, height: 40}}
          />
        </ImageBackground>
      </View>
    );
  }

  function header() {
    return <MyHeader title={'Class Live'} navigation={navigation} />;
  }
};

export default ClassLive;
