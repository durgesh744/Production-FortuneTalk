import {
  View,
  Text,
  BackHandler,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {CommonActions, useFocusEffect} from '@react-navigation/native';
import {showToastWithGravityAndOffset} from '../../methods/toastMessage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Colors, Fonts, Sizes} from '../../assets/style';
import MyStatusBar from '../../components/MyStatusBar';
import {Input} from '@rneui/themed';
import {SCREEN_WIDTH} from '../../config/Screen';

const astrologerData = [
  {
    id: 1,
    name: 'Vedic astrologer',
    image: require('../../assets/images/users/user1.jpg'),
  },
  {id: 2, name: 'Guru Ji', image: require('../../assets/images/users/user2.jpg')},
  {
    id: 3,
    name: 'Face Reader',
    image: require('../../assets/images/users/user3.jpg'),
  },
  {
    id: 4,
    name: 'Face Reader',
    image: require('../../assets/images/users/user4.jpg'),
  },
];

const Learn = ({navigation}) => {
  const [state, setState] = useState({
    backClickCount: 0,
  });

  const backAction = () => {
    backClickCount == 1 ? BackHandler.exitApp() : _spring();
    return true;
  };

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', backAction);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', backAction);
    }, [backAction]),
  );

  function _spring() {
    updateState({backClickCount: 1});
    showToastWithGravityAndOffset('Press Back Once Again to Exit');
    setTimeout(() => {
      updateState({backClickCount: 0});
    }, 1000);
  }

  const go_home = () => {
    navigation.dispatch(CommonActions.navigate({name: 'home3'}));
  };

  const updateState = data => setState({...state, ...data});

  const {backClickCount} = state;
  return (
    <View style={{flex: 1, backgroundColor: Colors.bodyColor}}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      {header()}
      <View style={{flex: 1}}>
        <FlatList
          ListHeaderComponent={
            <>
              {searchInfo()}
              {howToLearnInfo()}
              {courseInfo()}
              {astrologerListInfo()}
              {vedioInfo()}
            </>
          }
          contentContainerStyle={{paddingBottom: Sizes.fixPadding * 8}}
        />
      </View>
    </View>
  );

  function vedioInfo() {
    const renderItem = ({item, index}) => {
      return (
        <TouchableOpacity
          activeOpacity={1}
          style={{
            width: SCREEN_WIDTH * 0.4,
            marginLeft: Sizes.fixPadding * 1.5,
            borderRadius: Sizes.fixPadding,
            overflow: 'hidden',
            marginBottom: Sizes.fixPadding * 1.5,
            // shadowColor: Colors.black,
            padding: Sizes.fixPadding * 0.5,
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: Sizes.fixPadding * 2,
          }}>
          <Image
            source={item.image}
            style={{
              width: '100%',
              height: SCREEN_WIDTH * 0.4,
              borderRadius: Sizes.fixPadding,
            }}
          />
        </TouchableOpacity>
      );
    };
    return (
      <View>
        <View
          style={{
            ...styles.row,
            justifyContent: 'space-between',
            paddingHorizontal: Sizes.fixPadding * 1.5,
            paddingVertical: Sizes.fixPadding,
          }}>
          <Text style={{...Fonts.black18RobotoRegular}}>Videos</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('eCommerce')}>
            <Text style={{...Fonts.primaryLight14RobotoRegular}}>View all</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={astrologerData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          horizontal
          contentContainerStyle={{paddingRight: Sizes.fixPadding * 1.5}}
        />
      </View>
    );
  }

  function astrologerListInfo() {
    const renderItem = ({item, index}) => {
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('astrologerDetailes')}
          style={{
            width: SCREEN_WIDTH * 0.42,
            marginLeft: Sizes.fixPadding * 1.5,
            borderRadius: Sizes.fixPadding,
            marginBottom: Sizes.fixPadding * 1.5,
            borderWidth: 1.5,
            borderColor: Colors.grayLight,
            backgroundColor: Colors.whiteDark,
            alignItems: 'center',
            marginTop: Sizes.fixPadding * 0.4,
          }}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={item.image}
              style={{
                width: SCREEN_WIDTH * 0.18,
                height: SCREEN_WIDTH * 0.18,
                borderRadius: 1000,
                alignSelf: 'center',
                borderWidth: 2,
                borderColor: Colors.white,
                marginVertical: Sizes.fixPadding * 0.5,
              }}
            />
            <Text style={{...Fonts.black16RobotoMedium}}>{item.name}</Text>
            <Text style={{...Fonts.gray14RobotoRegular}}>
              Experience - 10 years
            </Text>
            <View
              style={{
                paddingVertical: Sizes.fixPadding * 0.5,
                borderTopWidth: 1,
                borderTopColor: Colors.grayLight,
                marginTop: Sizes.fixPadding * 0.5,
              }}>
              <Text style={{...Fonts.gray11RobotoRegular, textAlign: 'center'}}>
                Master your Psychic Ability and Learn to Give Accurate
                Professional Level
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    };
    return (
      <View
        style={{
          borderBottomWidth: 1,
          borderBottomColor: Colors.grayLight,
        }}>
        <View
          style={{
            ...styles.row,
            justifyContent: 'space-between',
            paddingHorizontal: Sizes.fixPadding * 1.5,
            paddingVertical: Sizes.fixPadding,
          }}>
          <Text style={{...Fonts.black18RobotoRegular}}>Astrologers list</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            // onPress={() => navigation.navigate('eCommerce')}
          >
            <Text style={{...Fonts.primaryLight14RobotoRegular}}>View all</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={astrologerData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          horizontal
          contentContainerStyle={{paddingRight: Sizes.fixPadding * 1.5}}
        />
      </View>
    );
  }

  function courseInfo() {
    const renderItem = ({item, index}) => {
      return (
        <TouchableOpacity
          activeOpacity={1}
          style={{
            width: SCREEN_WIDTH * 0.4,
            marginLeft: Sizes.fixPadding * 1.5,
            borderRadius: Sizes.fixPadding,
            overflow: 'hidden',
            marginBottom: Sizes.fixPadding * 1.5,
            // shadowColor: Colors.black,
            padding: Sizes.fixPadding * 0.5,
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: Sizes.fixPadding * 2,
          }}>
          <Image
            source={item.image}
            style={{
              width: '100%',
              height: SCREEN_WIDTH * 0.35,
              borderTopLeftRadius: Sizes.fixPadding,
              borderTopRightRadius: Sizes.fixPadding,
            }}
          />
          <View
            style={{
              width: '100%',
              backgroundColor: Colors.whiteDark,
              elevation: 2,
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.2,
              position: 'absolute',
              bottom: Sizes.fixPadding,
              paddingVertical: Sizes.fixPadding * 0.4,
              borderRadius: Sizes.fixPadding * 0.7,
              shadowColor: Colors.blackLight,
            }}>
            <Text style={{...Fonts.gray14RobotoMedium, textAlign: 'center'}}>
              {item.name}
            </Text>
          </View>
        </TouchableOpacity>
      );
    };
    return (
      <View style={{borderBottomWidth: 1, borderBottomColor: Colors.grayLight}}>
        <View
          style={{
            ...styles.row,
            justifyContent: 'space-between',
            paddingHorizontal: Sizes.fixPadding * 1.5,
            paddingVertical: Sizes.fixPadding,
          }}>
          <Text style={{...Fonts.black18RobotoRegular}}>Course Offer</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('courses')}>
            <Text style={{...Fonts.primaryLight14RobotoRegular}}>View all</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={astrologerData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          horizontal
          contentContainerStyle={{paddingRight: Sizes.fixPadding * 1.5}}
        />
      </View>
    );
  }

  function howToLearnInfo() {
    return (
      <View
        style={{
          paddingHorizontal: Sizes.fixPadding * 1.5,
          marginTop: Sizes.fixPadding * 2,
          borderBottomWidth: 1,
          paddingBottom: Sizes.fixPadding * 2,
          borderBottomColor: Colors.grayLight,
        }}>
        <Text
          style={{
            ...Fonts.black18RobotoRegular,
            marginBottom: Sizes.fixPadding * 1.6,
          }}>
          How to learn and earn
        </Text>
        <Text style={{...Fonts.gray12RobotoRegular}}>
          COMES WITH A SAL JADE CERTIFICATE OF COMPLETION FROM THE ACCREDITED
          COLLEGE: THE PSYCHIC HEALING ACADEMY Also features free monthly bonus
          Tarot seminars educational announcements tarot readings to improve
          your skills with 10,000 other students in the course!{'\n\n'}COMES
          WITH A SAL JADE CERTIFICATE OF COMPLETION FROM THE ACCREDITED COLLEGE:
          THE PSYCHIC HEALING ACADEMY Also features free monthly bonus Tarot
          seminars educational announcements tarot readings to improve your
          skills with 10,000 other students in the course!{'\n\n'}COMES WITH A
          SAL JADE CERTIFICATE OF COMPLETION FROM THE ACCREDITED COLLEGE: THE
          PSYCHIC HEALING ACADEMY Also features free monthly bonus Tarot
          seminars educational announcements tarot readings to improve your
          skills with 10,000 other students in the course!{'\n\n'}COMES WITH A
          SAL JADE CERTIFICATE OF COMPLETION FROM THE ACCREDITED COLLEGE: THE
          PSYCHIC HEALING ACADEMY Also features free monthly bonus Tarot
          seminars educational announcements tarot readings to improve your
          skills with 10,000 other students in the course!
        </Text>
      </View>
    );
  }

  function searchInfo() {
    return (
      <View
        style={{
          paddingVertical: Sizes.fixPadding,
          borderBottomWidth: 1,
          borderColor: Colors.gray + '30',
          ...styles.row,
        }}>
        <Input
          placeholder="Search for an astrologer..."
          placeholderTextColor={Colors.gray}
          inputStyle={{...Fonts.black14InterMedium}}
          containerStyle={{
            height: 36,
            flex: 1,
            flexGrow: 1,
          }}
          inputContainerStyle={{
            borderBottomWidth: 0,
            margin: 0,
            padding: 0,
            paddingVertical: 0,
            paddingTop: 0,
            backgroundColor: Colors.grayLight + '50',
            borderRadius: 1000,
            paddingHorizontal: Sizes.fixPadding,
            height: 36,
          }}
          leftIcon={
            <Image
              source={require('../../assets/images/icons/search.png')}
              style={{width: 20, height: 20}}
            />
          }
        />
        <TouchableOpacity style={{flex: 0.1, marginLeft: Sizes.fixPadding}}>
          <Image
            source={require('../../assets/images/icons/filter.png')}
            style={{width: 20, height: 20}}
          />
        </TouchableOpacity>
      </View>
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
        <TouchableOpacity
          onPress={() => go_home()}
          style={{position: 'absolute', zIndex: 99, padding: Sizes.fixPadding * 1.5}}>
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
          Learn & Earn
        </Text>
      </View>
    );
  }
};

export default Learn;

const styles = StyleSheet.create({
  row: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
