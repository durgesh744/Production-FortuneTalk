import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors, Fonts, Sizes} from '../assets/style';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MyStatusBar from '../components/MyStatusBar';
import {SCREEN_WIDTH} from '../config/Screen';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import {api_url, img_url_2, recent_astro} from '../config/constants';
import {connect} from 'react-redux';
import NoDataFound from '../components/NoDataFound';

const RecentAstrologers = ({navigation, userData}) => {
  const [state, setState] = useState({
    recentAstroData: null,
    isLoading: false,
  });

  useEffect(() => {
    get_recent_astrologers();
  }, []);

  const get_recent_astrologers = async () => {
    updateState({isLoading: true});
    await axios({
      method: 'post',
      url: api_url + recent_astro,
      data: {
        user: userData?.id,
      },
    })
      .then(res => {
        console.log(res.data);
        updateState({isLoading: false, recentAstroData: res.data.records});
      })
      .catch(err => {
        console.log(err);
        updateState({isLoading: false});
      });
  };

  const updateState = data => {
    setState(prevState => {
      const newData = {...prevState, ...data};
      return newData;
    });
  };

  const {recentAstroData, isLoading} = state;

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
            <>{recentAstroData?.length != 0 && recentAstrologerInfo()}</>
          }
          contentContainerStyle={{paddingVertical: Sizes.fixPadding*2}}
        />
      </View>
    </View>
  );

  function recentAstrologerInfo() {
    const renderItem = ({item, index}) => {
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          style={{
            overflow: 'hidden',
            elevation: 8,
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.2,
            marginBottom: Sizes.fixPadding * 2,
            shadowColor: Colors.black,
            backgroundColor: Colors.whiteDark,
            alignItems: 'center',
            ...styles.row,
            padding: Sizes.fixPadding,
            borderRadius: Sizes.fixPadding
          }}>
          <Image
            source={{uri: img_url_2 + item.img_url}}
            style={{
              width: SCREEN_WIDTH * 0.18,
              height: SCREEN_WIDTH * 0.18,
              borderRadius: 1000,
              alignSelf: 'center',
              borderWidth: 2,
              borderColor: Colors.primaryLight,
            }}
          />
          <View
            style={{
              paddingHorizontal: Sizes.fixPadding * 0.3,
              marginLeft: Sizes.fixPadding * 1.5,
            }}>
            <Text style={{...Fonts.black16RobotoMedium}}>{item.name}</Text>
            <Text style={{...Fonts.gray11RobotoRegular}}>
            26 July 2023 - 5 min
            </Text>
            <View
              style={{
                ...styles.row,
                marginTop: Sizes.fixPadding * 0.5,
              }}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('astrologerDetailes', {
                    data: item,
                  })
                }
                style={{
                  width: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: Colors.primaryLight,
                  borderRadius: 1000,
                }}>
                <Text style={{...Fonts.primaryLight14RobotoMedium}}>Chat</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('astrologerDetailes', {
                    data: item,
                  })
                }
                style={{
                  width: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: Colors.primaryLight,
                  borderRadius: 1000,
                  marginLeft: Sizes.fixPadding,
                }}>
                <Text style={{...Fonts.primaryLight14RobotoMedium}}>Call</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      );
    };
    return (
      <View
        style={{
            marginHorizontal: Sizes.fixPadding*2
        }}>
        <FlatList
          data={recentAstroData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          ListEmptyComponent={<NoDataFound />}
        />
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
          onPress={() => navigation.goBack()}
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
          Recent Astrologer
        </Text>
      </View>
    );
  }
};

const mapStateToProps = state => ({
  userData: state.user.userData,
  wallet: state.user.wallet,
});

export default connect(mapStateToProps, null)(RecentAstrologers);

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
