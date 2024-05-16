import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import MyStatusBar from '../components/MyStatusBar';
import {Colors, Fonts, Sizes} from '../assets/style';
import {SCREEN_WIDTH} from '../config/Screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {ApiRequest} from '../config/api_requests';
import {
  api_follow,
  api_url,
  customer_follow_astro_list,
  img_url_2,
} from '../config/constants';
import {connect} from 'react-redux';
import Loader from '../components/Loader';
import Stars from 'react-native-stars';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {showToastWithGravityAndOffset} from '../methods/toastMessage';
import NoDataFound from '../components/NoDataFound';

const Following = ({navigation, userData}) => {
  const [state, setState] = useState({
    isLoading: false,
    followingListData: null,
  });

  useEffect(() => {
    get_following_list();
  }, []);

  const get_following_list = async () => {
    try {
      updateState({isLoading: true});
      const response = await ApiRequest.postRequest({
        url: api_url + customer_follow_astro_list,
        data: {
          customer_id: userData?.id,
        },
      });

      if (response?.success) {
        updateState({followingListData: response?.data});
      }

      updateState({isLoading: false});
      
    } catch (e) {
      console.log(e);
      updateState({isLoading: false});
    }
  };

  const unfollow_astrologer = async astro_id => {
    try {
      updateState({isLoading: true});

      const response = await ApiRequest.postRequest({
        url: api_url + api_follow,
        data: {
          user_id: userData?.id,
          astro_id: astro_id,
          status: 0,
        },
      });

      get_following_list();
      showToastWithGravityAndOffset('Unfollow success.');
      updateState({isLoading: false});
    } catch (e) {
      console.log(e);
      updateState({isLoading: false});
    }
  };

  const updateState = data => {
    setState(prevState => {
      const newData = {...prevState, ...data};
      return newData;
    });
  };

  const {isLoading, followingListData} = state;

  return (
    <View style={{flex: 1, backgroundColor: Colors.bodyColor}}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      <Loader visible={isLoading} />
      {header()}
      <FlatList
        ListHeaderComponent={
          <View
            style={{
              width: SCREEN_WIDTH,
              paddingHorizontal: Sizes.fixPadding * 1.5,
              paddingVertical: Sizes.fixPadding * 2,
            }}>
            {followingListData && followingInfo()}
          </View>
        }
      />
    </View>
  );

  function followingInfo() {
    const renderItem = ({item}) => {
      return (
        <TouchableOpacity
         onPress={() =>
                  navigation.navigate('astrologerDetailes', {
                    data: item?.id,
                  })
                }
        >
        <View style={styles.cart}>
          <View
            style={{
              width: '20%',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}>
            <Image
              source={{uri: img_url_2 + item?.img_url}}
              style={{
                width: SCREEN_WIDTH * 0.15,
                height: SCREEN_WIDTH * 0.15,
                borderRadius: SCREEN_WIDTH * 0.15,
                resizeMode: 'cover',
              }}
            />
          </View>
          <View style={{width: '47.5%', marginLeft: Sizes.fixPadding}}>
            <Text
              style={{...Fonts.black12RobotoRegular, fontWeight: 'bold'}}
              numberOfLines={1}>
              {item?.owner_name}
            </Text>
            <View style={{flexDirection: 'row'}}>
              <Stars
                default={parseInt(item?.avg_rating)}
                count={5}
                half={true}
                starSize={14}
                fullStar={
                  <Ionicons
                    name={'star'}
                    size={14}
                    color={Colors.primaryLight}
                  />
                }
                emptyStar={
                  <Ionicons
                    name={'star-outline'}
                    size={14}
                    color={Colors.primaryLight}
                  />
                }
                // halfStar={<Icon name={'star-half'} style={[styles.myStarStyle]} />}
              />
              <Text
                style={{
                  ...Fonts.gray11RobotoRegular,
                  marginLeft: Sizes.fixPadding,
                }}>
                ({item?.followers})
              </Text>
            </View>
            <Text style={{...Fonts.gray11RobotoRegular}} numberOfLines={1}>
              ({item?.mainexperties})
            </Text>
          </View>
          <View
            style={{
              width: '32%',
              alignItems: 'center',
              justifyContent: 'center',
              // backgroundColor: 'red'
            }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => unfollow_astrologer(item?.id)}
              style={styles.unfollowbtn}>
              <Text style={{...Fonts.white12RobotoMedium}}>Unfollow</Text>
            </TouchableOpacity>
          </View>
        </View>
        </TouchableOpacity>
      );
    };
    return <FlatList data={followingListData} renderItem={renderItem} ListEmptyComponent={<NoDataFound />} />;
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
          Following
        </Text>
      </View>
    );
  }
};

const mapStateToProps = state => ({
  userData: state.user.userData,
});

export default connect(mapStateToProps, null)(Following);

const styles = StyleSheet.create({
  row: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cart: {
    padding: Sizes.fixPadding * 1.5,
    marginBottom: Sizes.fixPadding,
    flexDirection: 'row',
    backgroundColor: Colors.whiteDark,
    borderRadius: Sizes.fixPadding,
    alignContent: 'center',
    justifyContent: 'center',
  },
  unfollowbtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.gray,
    paddingVertical: Sizes.fixPadding,
    paddingHorizontal: Sizes.fixPadding * 2,
    borderRadius: Sizes.fixPadding * 2.5,
  },
});
