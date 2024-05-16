import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  BackHandler,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Colors, Fonts, Sizes} from '../assets/style';
import MyStatusBar from '../components/MyStatusBar';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {SCREEN_WIDTH} from '../config/Screen';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {CommonActions, useFocusEffect} from '@react-navigation/native';
import {showToastWithGravityAndOffset} from '../methods/toastMessage';
import {connect} from 'react-redux'; 
import axios from 'axios';
import {
  api_url,
  img_url_2,
  live_astro_list,
} from '../config/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NoDataFound from '../components/NoDataFound';

const Live = ({navigation, userData}) => {
  const [state, setState] = useState({
    backClickCount: 0,
    isLoading: false,
    astrologerData: null,
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

  useEffect(() => {
    get_live_astrologers();
  }, []);

  const get_live_astrologers = async () => {
    updateState({isLoading: true});
    await axios({
      method: 'post',
      url: api_url + live_astro_list,
    })
      .then(res => {
        updateState({isLoading: false});
        if (res.data.status == '200') {
          updateState({astrologerData: res.data.data});
        }else{
          updateState({astrologerData: []});
        }
      })
      .catch(err => {
        updateState({isLoading: false});
        console.log(err);
      });
  };

  const go_home = () => {
    navigation.dispatch(CommonActions.navigate({name: 'home3'}));
  };

  const updateState = data => setState({...state, ...data});

  const {backClickCount, isLoading, astrologerData} = state;

  return (
    <View style={{flex: 1, backgroundColor: Colors.bodyColor}}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      <View style={{flex: 1}}>
        {header()}
        <FlatList
          ListHeaderComponent={<>{astrologerData && liveAstrologerInfo()}</>}
          contentContainerStyle={{paddingBottom: Sizes.fixPadding * 10}}
        />
      </View>
    </View>
  );

  function liveAstrologerInfo() {
    const on_press = async(item)=>{
      const check_is_register = await AsyncStorage.getItem('isRegister');
        const isRegister = JSON.parse(check_is_register);
        if (!isRegister?.value) {
          if(isRegister?.type == 'profile'){
            navigation.navigate('profile')
          }else{
            navigation.navigate('login')
          }
        } else {
          navigation.navigate('goLive', {
            userID: userData?.id,
            userName: userData?.username,
            liveID: item.live_id,
            astroData: item,
          });
        }
    }
    const renderItem = ({item, index}) => {
      return (
        <TouchableOpacity
          key={index}
          disabled={item.status != 'live'}
          onPress={()=>on_press(item)}
          activeOpacity={0.8}
          style={{
            width: SCREEN_WIDTH * 0.435,
            height: SCREEN_WIDTH * 0.6,
            marginLeft: Sizes.fixPadding * 1.5,
            borderRadius: Sizes.fixPadding,
            overflow: 'hidden',
            elevation: 5,
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.2,
            marginBottom: Sizes.fixPadding * 1.5,
            shadowColor: Colors.black,
          }}>
          <Image
            source={{uri: img_url_2 + item.img_url}}
            style={{width: '100%', height: '100%'}}
          />
          <LinearGradient
            colors={[
              Colors.black + '00',
              item.id == 1 ? Colors.primaryLight : Colors.black,
            ]}
            locations={[0.75, 1]}
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              justifyContent: 'space-between',
              padding: Sizes.fixPadding * 0.4,
            }}>
            {item.status != 'live' && (
              <View
                style={{
                  backgroundColor: Colors.primaryLight,
                  alignSelf: 'center',
                  paddingHorizontal: Sizes.fixPadding,
                  paddingVertical: Sizes.fixPadding * 0.2,
                  borderRadius: 1000,
                }}>
                <Text style={{...Fonts.white12RobotoMedium}}>Scheduled</Text>
              </View>
            )}

            <View style={{...styles.row, justifyContent: 'space-between'}}>
              <Ionicons name="videocam" color={Colors.white} size={18} />
              <Ionicons name="call" color={Colors.white} size={18} />
              {item.status == 'live' && (
                <Image
                  source={require('../assets/gifs/live_indicator.gif')}
                  style={{width: 15, height: 15}}
                />
              )}
            </View>
            <Text style={{...Fonts.white14RobotoMedium, textAlign: 'center'}}>
              {item.owner_name}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      );
    };
    return (
      <FlatList
        data={astrologerData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={{paddingRight: Sizes.fixPadding * 1.5}}
        ListEmptyComponent={<NoDataFound />}
      />
    );
  }

  function header() {
    return (
      <View
        style={{
          margin: Sizes.fixPadding * 1.5,
          flex: 0,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => go_home()}
          style={{
            alignSelf: 'flex-start',
          }}>
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
            flex: 0.92,
          }}>
          Live Streaming
        </Text>
      </View>
    );
  }
};

const mapStateToProps = state => ({
  userData: state.user.userData,
  wallet: state.user.wallet,
});

export default connect(mapStateToProps, null)(Live);

const styles = StyleSheet.create({
  row: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
