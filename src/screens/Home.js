import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  ImageBackground,
  BackHandler,
  RefreshControl,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { Colors, Fonts, Sizes } from '../assets/style';
import MyStatusBar from '../components/MyStatusBar';
import { Divider, Input } from '@rneui/themed';
import Carousel from 'react-native-reanimated-carousel';
import { SCREEN_WIDTH } from '../config/Screen';
import { useSharedValue } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Stars from 'react-native-stars';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { showToastWithGravityAndOffset } from '../methods/toastMessage';
import database from '@react-native-firebase/database';
import axios from 'axios';
import {
  all_astro_for_first_time,
  all_trending_astro,
  api2_get_profile,
  api_astrolist1,
  api_url,
  base_url,
  blog,
  chat_call_discount_astro_list,
  chat_call_discount_astro_list_7,
  course_list,
  cust_testimonials,
  get_mall_cat,
  home_top_banner,
  img_url,
  img_url_2,
  img_url_3,
  learning_banner,
  live_astro_list,
  recent_astro,
  userID,
  user_get_banner,
} from '../config/constants';
import HomeSkeleton from '../components/skeleton/HomeSkeleton';
import { connect } from 'react-redux';
import ActiveChat from '../components/ActiveChat';
import RenderHtml from 'react-native-render-html';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MyMethods } from '../methods/my_methods';
import { calculate_discount_price, sum_price } from '../methods/calculatePrice';
import moment from 'moment';
import * as UserActions from '../redux/actions/UserActions';
import { ApiRequest } from '../config/api_requests';

const freeInsightData = [
  {
    id: 1,
    name: 'Daily\nHoroscope',
    image: require('../assets/images/daily_horoscope.png'),
  },
  {
    id: 2,
    name: 'Kundli\nMatching',
    image: require('../assets/images/matching.png'),
  },
  {
    id: 3,
    name: 'Free\nKundli',
    image: require('../assets/images/free_kundli.png'),
  },
  {
    id: 4,
    name: 'Panchang\nReport',
    image: require('../assets/images/panchang.png'),
  },
];

const Home = ({ navigation, userData, dispatch }) => {
  const progressValue = useSharedValue(0);
  const [state, setState] = useState({
    isRegister: false,
    backClickCount: 0,
    bannerData: null,
    isLoading: false,
    testimonialsData: null,
    astroData: null,
    blogData: null,
    ecommerceData: null,
    recentAstroData: null,
    activeChatVisible: false,
    liveAstroData: null,
    isRefreshing: false,
    offerAstroData: null,
    onlineAstroData: null,
    trendingAstroData: null,
    activeChatData: null,
    courseData: null,
    learningBannerData: null,
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
    updateState({ backClickCount: 1 });
    showToastWithGravityAndOffset('Press Back Once Again to Exit');
    setTimeout(() => {
      updateState({ backClickCount: 0 });
    }, 1000);
  }

  useEffect(() => {
    get_home_data();
  }, []);

  useEffect(() => {
    try {
      database()
        .ref(`/CustomerCurrentRequest/${userData?.id}`)
        .on('value', snapshot => {
          if (snapshot?.val()?.status == 'active') {
            get_active_chat('');
          }
        });
    } catch (e) {
      console.log(e);
    }

    return () => {
      database().ref(`/CustomerCurrentRequest/${userData?.id}`).off();
    };
  }, []);

  const get_active_chat = async startTime => {
    const data = await AsyncStorage.getItem('chatData');
    const parsedData = JSON.parse(data);
    if (parsedData) {
      updateState({
        activeChatVisible: true,
        activeChatData: parsedData,
      });
    }
  };

  const testimonials_modify = data => {
    let arr = data;
    let groupedArray = [];
    for (let i = 0; i < arr.length; i += 2) {
      if (i + 1 < arr.length) {
        groupedArray.push([arr[i], arr[i + 1]]);
      } else {
        groupedArray.push([arr[i]]);
      }
    }
    return groupedArray;
  };

  const get_home_data = async () => {
    updateState({ isLoading: true });
    try {
      const check_is_register = await AsyncStorage.getItem('isRegister');
      const isRegister = JSON.parse(check_is_register);
      const banners = await axios.get(api_url + home_top_banner);
      const testimonials = await axios.post(api_url + cust_testimonials);
      const latest_blogs = await axios.get(api_url + blog);
      const e_commerce = await axios.get(api_url + get_mall_cat);
      const testimonials_data = testimonials_modify(testimonials?.data.records);
      const courses_data = await axios.get(api_url + course_list);
      const learn_banner_res = await ApiRequest.getRequest({
        url: api_url + learning_banner,
      });

      let recent_astrologer = null;
      if (isRegister?.value) {
        recent_astrologer = await axios.post(api_url + recent_astro, {
          user: userData?.id,
        });
      }

      const live_astrologers = await axios.post(api_url + live_astro_list);
      // const get_astrologer = await axios({
      //   method: 'post',
      //   url: api_url + api_astrolist1,
      // });

      const offers_astrologers = await axios.get(
        api_url + chat_call_discount_astro_list_7,
      );

      let online_astro = null;
      if (isRegister?.value) {
        online_astro = await axios({
          method: 'post',
          url: api_url + all_astro_for_first_time,
          headers: { 'Content-Type': 'multipart/form-data' },
          data: { customer_id: userData?.id },
        });
      }

      const trending_astro = await axios({
        method: 'get',
        url: api_url + all_trending_astro,
      });

      let trending_astro_data = null;
      if (trending_astro.data.status) {
        if (trending_astro.data.data.length != 0) {
          trending_astro_data = trending_astro.data.data;
        }
      }

      let online_astro_data = null;
      if (online_astro?.data?.status) {
        if (online_astro.data.data.length != 0) {
          online_astro_data = online_astro?.data.data;
        }
      }

      let live_astro = null;
      if (live_astrologers.data.data) {
        if (live_astrologers.data.data.length != 0) {
          live_astro = live_astrologers.data.data.filter(
            item => item.status == 'live',
          );
        }
      }

      let active_astorloger_offers = null;
      if (offers_astrologers.data?.records) {
        if (offers_astrologers.data?.records.length != 0) {
          active_astorloger_offers = testimonials_modify(
            offers_astrologers.data?.records,
          );
        }
      }

      let courses_list = null;
      if (courses_data.data?.status == '200') {
        if (courses_data.data?.data.length != 0) {
          courses_list = courses_data.data?.data;
        }
      }

      updateState({
        bannerData: banners.data.data,
        learningBannerData: learn_banner_res?.data,
        testimonialsData: testimonials_data,
        blogData: latest_blogs.data.data,
        ecommerceData: e_commerce.data.data,
        recentAstroData: recent_astrologer?.data?.records,
        liveAstroData: live_astro,
        // astroData: get_astrologer.data.records,
        offerAstroData: active_astorloger_offers,
        onlineAstroData: online_astro_data,
        trendingAstroData: trending_astro_data,
        isRegister: isRegister,
        courseData: courses_list,
        isLoading: false,
      });
    } catch (e) {
      updateState({ isLoading: false });
      console.log(e);
    }
  };

  const get_home_data_on_refresh = async () => {
    updateState({ isRefreshing: true });
    try {
      // const banners = await axios.get(base_url + user_get_banner);
      // const testimonials = await axios.post(api_url + cust_testimonials);
      // const latest_blogs = await axios.get(api_url + blog);
      // const e_commerce = await axios.get(api_url + get_mall_cat);
      // const testimonials_data = testimonials_modify(testimonials.data.records);

      let recent_astrologer = null;
      if (isRegister) {
        recent_astrologer = await axios.post(api_url + recent_astro, {
          user: userData?.id,
        });
      }
      const live_astrologers = await axios.post(api_url + live_astro_list);

      const offers_astrologers = await axios.get(
        api_url + chat_call_discount_astro_list_7,
      );

      const user_data = await axios({
        method: 'post',
        url: api_url + api2_get_profile,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: { user_id: userData?.id },
      });

      dispatch(UserActions.setUserData(user_data.data.user_details[0]));
      dispatch(UserActions.setWallet(user_data.data.user_details[0]?.wallet));

      let online_astro = null;
      if (isRegister) {
        online_astro = await axios({
          method: 'post',
          url: api_url + all_astro_for_first_time,
          headers: { 'Content-Type': 'multipart/form-data' },
          data: { customer_id: userData?.id },
        });
      }

      const trending_astro = await axios({
        method: 'get',
        url: api_url + all_trending_astro,
      });

      let trending_astro_data = null;
      if (trending_astro.data.status) {
        if (trending_astro.data.data.length != 0) {
          trending_astro_data = trending_astro.data.data;
        }
      }

      let live_astro = null;
      if (live_astrologers.data.data) {
        if (live_astrologers.data.data.length != 0) {
          live_astro = live_astrologers.data.data.filter(
            item => item.status == 'live',
          );
        }
      }

      let online_astro_data = null;
      if (online_astro.data?.status) {
        if (online_astro.data.data.length != 0) {
          online_astro_data = online_astro.data.data;
        }
      }

      let active_astorloger_offers = null;
      if (offers_astrologers.data?.records) {
        if (offers_astrologers.data?.records.length != 0) {
          active_astorloger_offers = testimonials_modify(
            offers_astrologers.data?.records,
          );
        }
      }

      updateState({
        // bannerData: banners.data.data,
        // testimonialsData: testimonials_data,
        // blogData: latest_blogs.data.data,
        // ecommerceData: e_commerce.data.data,
        recentAstroData: recent_astrologer?.data?.records,
        liveAstroData: live_astro,
        offerAstroData: active_astorloger_offers,
        onlineAstroData: online_astro_data,
        trendingAstroData: trending_astro_data,
      });
      updateState({ isRefreshing: false });
    } catch (e) {
      updateState({ isRefreshing: false });
      console.log(e);
    }
  };

  const chat_price = astroData => {
    if (astroData?.Offer_list.length != 0) {
      return calculate_discount_price({
        actualPrice: sum_price({
          firstPrice: parseFloat(astroData?.chat_price_m),
          secondPrice: parseFloat(astroData?.chat_commission),
        }),
        percentage: parseFloat(astroData?.Offer_list[0]?.discount),
      });
    }
    return sum_price({
      firstPrice: parseFloat(astroData?.chat_price_m),
      secondPrice: parseFloat(astroData?.chat_commission),
    });
  };

  const updateState = data => {
    setState(prevState => {
      const newState = { ...prevState, ...data };
      return newState;
    });
  };

  const {
    isRegister,
    activeChatVisible,
    backClickCount,
    bannerData,
    isLoading,
    testimonialsData,
    blogData,
    ecommerceData,
    recentAstroData,
    liveAstroData,
    isRefreshing,
    astroData,
    offerAstroData,
    onlineAstroData,
    trendingAstroData,
    activeChatData,
    courseData,
    learningBannerData,
  } = state;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyColor }}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      <HomeSkeleton visible={isLoading} />
      {header()}
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={get_home_data_on_refresh}
          />
        }
        ListHeaderComponent={
          <>
            {searchInfo()}
            {bannerData && bannerInfo()}
            {liveAstroData != null
              ? liveAstroData.length != 0 && liveAstrologerInfo()
              : null}
            {freeInsightInfo()}
            {isRegister?.value &&
              userData?.remedy_status == 0 &&
              remediesInfo()}
            {offerAstroData && otherAstrologerInfo()}
            {trendingAstroData && trendingAstrologerInfo()}
            {onlineAstroData && onlineAstrologerInfo()}
            {recentAstroData &&
              recentAstroData?.length != 0 &&
              recentAstrologerInfo()}
            {learningBannerData && bottomBannerInfo()}
            {courseData && learningSectionInfo()}
            {eCommerceInfo()}
            {latestBlogInfo()}
            {testimonialsData && testimonialsInfo()}
          </>
        }
        contentContainerStyle={{ paddingBottom: Sizes.fixPadding * 10 }}
      />
      <ActiveChat
        activeChatVisible={activeChatVisible}
        navigation={navigation}
        userData={userData}
        chatData={activeChatData?.astroData}
        updateState={updateState}
        startTime={activeChatData?.startTime}
        inVoiceId={activeChatData?.inVoiceId}
      />
    </View>
  );

  function testimonialsInfo() {
    const renderItem = ({ item, index }) => {
      return (
        <View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('tesetimonialsDetails', { data: item[0] })
            }
            activeOpacity={0.8}
            style={{
              width: SCREEN_WIDTH * 0.65,
              marginLeft: Sizes.fixPadding * 1.5,
              borderRadius: Sizes.fixPadding,
              overflow: 'hidden',
              borderColor: Colors.primaryLight,
              elevation: 5,
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.2,
              marginBottom: Sizes.fixPadding * 1.5,
              shadowColor: Colors.black,
              backgroundColor: Colors.white,
              padding: Sizes.fixPadding * 0.8,
            }}>
            <Text numberOfLines={5} style={{ ...Fonts.gray11RobotoRegular }}>
              "
              {item[0]?.description
                .replace(/<[^>]*>/g, '')
                .replace(/&#(?:x([\da-f]+)|(\d+));/gi, '')}
              "
            </Text>
            <View style={{ ...styles.row }}>
              <Image
                source={{ uri: base_url + 'admin/' + item[0]?.cust_pic }}
                style={{
                  width: 25,
                  height: 25,
                  borderRadius: 100,
                }}
              />
              <Text
                style={{
                  ...Fonts.gray11RobotoRegular,
                  marginLeft: Sizes.fixPadding * 0.5,
                }}>
                {item[0].name}
              </Text>
              <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                <Stars
                  default={4}
                  count={5}
                  half={true}
                  starSize={9}
                  fullStar={
                    <Ionicons
                      name={'star'}
                      size={9}
                      color={Colors.primaryLight}
                    />
                  }
                  emptyStar={
                    <Ionicons
                      name={'star-outline'}
                      size={9}
                      color={Colors.primaryLight}
                    />
                  }
                // halfStar={<Icon name={'star-half'} style={[styles.myStarStyle]} />}
                />
              </View>
            </View>
          </TouchableOpacity>
          {item.length == 2 && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate('tesetimonialsDetails', { data: item[1] })
              }
              style={{
                width: SCREEN_WIDTH * 0.65,
                marginLeft: Sizes.fixPadding * 1.5,
                borderRadius: Sizes.fixPadding,
                overflow: 'hidden',
                borderColor: Colors.primaryLight,
                elevation: 5,
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.2,
                marginBottom: Sizes.fixPadding * 1.5,
                shadowColor: Colors.black,
                backgroundColor: Colors.white,
                padding: Sizes.fixPadding * 0.8,
              }}>
              <Text numberOfLines={5} style={{ ...Fonts.gray11RobotoRegular }}>
                "
                {item[1]?.description
                  .replace(/<[^>]*>/g, '')
                  .replace(/&#(?:x([\da-f]+)|(\d+));/gi, '')}
                "
              </Text>
              <View style={{ ...styles.row }}>
                <Image
                  source={{ uri: base_url + 'admin/' + item[1]?.cust_pic }}
                  style={{
                    width: 25,
                    height: 25,
                    borderRadius: 100,
                  }}
                />
                <Text
                  style={{
                    ...Fonts.gray11RobotoRegular,
                    marginLeft: Sizes.fixPadding * 0.5,
                  }}>
                  {item[1].name}
                </Text>
                <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                  <Stars
                    default={4}
                    count={5}
                    half={true}
                    starSize={9}
                    fullStar={
                      <Ionicons
                        name={'star'}
                        size={9}
                        color={Colors.primaryLight}
                      />
                    }
                    emptyStar={
                      <Ionicons
                        name={'star-outline'}
                        size={9}
                        color={Colors.primaryLight}
                      />
                    }
                  />
                </View>
              </View>
            </TouchableOpacity>
          )}
        </View>
      );
    };
    return (
      <View style={{ borderBottomWidth: 1, borderBottomColor: Colors.grayLight }}>
        <View
          style={{
            ...styles.row,
            justifyContent: 'space-between',
            paddingHorizontal: Sizes.fixPadding * 1.5,
            paddingVertical: Sizes.fixPadding,
          }}>
          <Text style={{ ...Fonts.black16RobotoMedium }}>
            Client Testimonials
          </Text>
        </View>
        <FlatList
          data={testimonialsData}
          renderItem={renderItem}
          horizontal
          contentContainerStyle={{ paddingRight: Sizes.fixPadding * 1.5 }}
        />
      </View>
    );
  }

  function latestBlogInfo() {
    const renderItem = ({ item, index }) => {
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate('astrologyBlogDetails', { blogData: item })
          }
          style={{
            width: SCREEN_WIDTH * 0.55,
            marginLeft: Sizes.fixPadding * 1.5,
            borderRadius: Sizes.fixPadding,
            overflow: 'hidden',
            borderColor: Colors.primaryLight,
            elevation: 5,
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.2,
            marginBottom: Sizes.fixPadding * 1.5,
            shadowColor: Colors.black,
            backgroundColor: Colors.whiteDark,
            padding: Sizes.fixPadding * 0.5,
          }}>
          <Image
            source={{ uri: item.blog_icon }}
            style={{
              width: '100%',
              height: SCREEN_WIDTH * 0.3,
              borderTopLeftRadius: Sizes.fixPadding,
              borderTopRightRadius: Sizes.fixPadding,
            }}
          />
          <Text
            numberOfLines={2}
            style={{
              ...Fonts.white18RobotBold,
              color: Colors.black,
              fontSize: 9,
            }}>
            {item.title.replace(/<[^>]*>/g, '')}
          </Text>
        </TouchableOpacity>
      );
    };
    return (
      <View style={{ borderBottomWidth: 1, borderBottomColor: Colors.grayLight }}>
        <View
          style={{
            ...styles.row,
            justifyContent: 'space-between',
            paddingHorizontal: Sizes.fixPadding * 1.5,
            paddingVertical: Sizes.fixPadding,
          }}>
          <Text style={{ ...Fonts.black16RobotoMedium }}>Latest Blogs</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('astrologyBlogs')}>
            <Text style={{ ...Fonts.primaryLight15RobotoRegular }}>View all</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={blogData}
          renderItem={renderItem}
          horizontal
          contentContainerStyle={{ paddingRight: Sizes.fixPadding * 1.5 }}
        />
      </View>
    );
  }

  function eCommerceInfo() {
    const navigate_to = (type, item) => {
      switch (type) {
        case 'book a pooja': {
          navigation.navigate('bookPooja', {
            categoryData: item,
            type: 'book_a_pooja',
          });
          break;
        }
        case 'spell': {
          navigation.navigate('bookPooja', { categoryData: item, type: 'spell' });
          break;
        }
        default: {
          navigation.navigate('products', {
            categoryData: item,
            type: 'products',
          });
        }
      }
    };

    const renderItem = ({ item, index }) => {
      return (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => navigate_to(item?.name.toLowerCase(), item)}
          style={{
            width: SCREEN_WIDTH * 0.4,
            marginLeft: Sizes.fixPadding * 1.5,
            borderRadius: Sizes.fixPadding,
            overflow: 'hidden',
            marginBottom: Sizes.fixPadding * 1.5,
            padding: Sizes.fixPadding * 0.5,
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: Sizes.fixPadding * 2,
          }}>
          <Image
            source={{ uri: base_url + 'admin/' + item.image }}
            style={{
              width: '90%',
              height: SCREEN_WIDTH * 0.4,
              borderTopLeftRadius: Sizes.fixPadding,
              borderTopRightRadius: Sizes.fixPadding,
            }}
          />
          <View
            style={{
              width: '100%',
              backgroundColor: Colors.whiteDark,
              elevation: 5,
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.2,
              position: 'absolute',
              bottom: Sizes.fixPadding,
              paddingVertical: Sizes.fixPadding * 0.3,
              borderRadius: Sizes.fixPadding * 0.7,
              shadowColor: Colors.blackLight,
            }}>
            <Text style={{ ...Fonts.black14InterMedium, textAlign: 'center' }}>
              {item.name}
            </Text>
          </View>
        </TouchableOpacity>
      );
    };
    return (
      <View style={{ borderBottomWidth: 1, borderBottomColor: Colors.grayLight }}>
        <View
          style={{
            ...styles.row,
            justifyContent: 'space-between',
            paddingHorizontal: Sizes.fixPadding * 1.5,
            paddingVertical: Sizes.fixPadding,
          }}>
          <Text style={{ ...Fonts.black16RobotoMedium }}>Fortune Store</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('eCommerce')}>
            <Text style={{ ...Fonts.primaryLight15RobotoRegular }}>View all</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={ecommerceData}
          renderItem={renderItem}
          horizontal
          contentContainerStyle={{ paddingRight: Sizes.fixPadding * 1.5 }}
        />
      </View>
    );
  }

  function learningSectionInfo() {
    const renderItem = ({ item, index }) => {
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('tarotTeachers', { data: item })}
          style={{
            width: SCREEN_WIDTH * 0.55,
            marginLeft: Sizes.fixPadding * 1.5,
            borderRadius: Sizes.fixPadding,
            overflow: 'hidden',
            borderWidth: item.id == 1 ? 3 : 0,
            borderColor: Colors.primaryLight,
            elevation: 5,
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.2,
            marginBottom: Sizes.fixPadding * 1.5,
            shadowColor: Colors.black,
            backgroundColor: Colors.white,
          }}>
          <Image
            source={{ uri: img_url_3 + item.image }}
            style={{
              width: '100%',
              height: SCREEN_WIDTH * 0.3,
              borderTopLeftRadius: Sizes.fixPadding,
              borderTopRightRadius: Sizes.fixPadding,
            }}
          />
          <Text
            style={{
              ...Fonts.black14RobotoRegular,
              textAlign: 'center',
              paddingVertical: Sizes.fixPadding * 0.5,
            }}>
            {item.name}
          </Text>
        </TouchableOpacity>
      );
    };
    return (
      <View style={{ borderBottomWidth: 1, borderBottomColor: Colors.grayLight }}>
        <View
          style={{
            ...styles.row,
            justifyContent: 'space-between',
            paddingHorizontal: Sizes.fixPadding * 1.5,
            paddingVertical: Sizes.fixPadding,
          }}>
          <Text style={{ ...Fonts.black16RobotoMedium }}>Learning Section</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('learn')}>
            <Text style={{ ...Fonts.primaryLight15RobotoRegular }}>View all</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={courseData}
          renderItem={renderItem}
          horizontal
          contentContainerStyle={{ paddingRight: Sizes.fixPadding * 1.5 }}
        />
      </View>
    );
  }

  function bottomBannerInfo() {
    const renderItem = ({ item, index }) => {
      return (
        <TouchableOpacity
          activeOpacity={1}
          style={{
            width: SCREEN_WIDTH * 0.95,
            height: 100,
            marginRight: Sizes.fixPadding,
            borderRadius: 5,
            overflow: 'hidden',
            borderWidth: 2,
            borderColor: Colors.grayLight,
          }}>
          <Image
            source={{ uri: img_url + learningBannerData[index].image }}
            style={{ width: '100%', height: '100%' }}
          />
        </TouchableOpacity>
      );
    };
    return (
      <View
        style={{
          paddingVertical: Sizes.fixPadding,
          borderBottomWidth: 1,
          borderBottomColor: Colors.grayLight,
        }}>
        <FlatList
          data={learningBannerData}
          renderItem={renderItem}
          horizontal
          contentContainerStyle={{ paddingLeft: Sizes.fixPadding }}
        />
      </View>
    );
  }

  function recentAstrologerInfo() {
    const renderItem = ({ item, index }) => {
      // console.log(item)
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          disabled
          style={{
            width: SCREEN_WIDTH * 0.6,
            marginLeft: Sizes.fixPadding * 1.5,
            overflow: 'hidden',
            elevation: 8,
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.2,
            marginBottom: Sizes.fixPadding * 1.5,
            shadowColor: Colors.black,
            backgroundColor: Colors.whiteDark,
            alignItems: 'center',
            ...styles.row,
            padding: Sizes.fixPadding,
          }}>
          <Image
            source={{ uri: img_url_2 + item.img_url }}
            style={{
              width: SCREEN_WIDTH * 0.16,
              height: SCREEN_WIDTH * 0.16,
              borderRadius: 1000,
              alignSelf: 'center',
              borderWidth: 2.5,
              borderColor: Colors.primaryLight,
              marginVertical: Sizes.fixPadding * 0.5,
            }}
          />
          <View
            style={{
              paddingHorizontal: Sizes.fixPadding * 0.3,
              marginLeft: Sizes.fixPadding * 1.5,
            }}>
            <Text style={{ ...Fonts.black14InterMedium }}>{item.name}</Text>
            <Text style={{ ...Fonts.gray9RobotoRegular }}>
              {moment(item?.transdate).format('DD-MM-YYYY, HH:mm A')}
            </Text>
            <View
              style={{
                ...styles.row,
                marginTop: Sizes.fixPadding * 0.5,
              }}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('astrologerDetailes', {
                    data: item?.id,
                  })
                }
                style={{
                  width: '80%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: Colors.primaryLight,
                  borderRadius: Sizes.fixPadding * 0.5,
                }}>
                <Text style={{ ...Fonts.primaryDark11InterMedium }}>
                  Consult Now
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 5,
              right: 5,
              transform: [{ rotateY: '180deg' }],
            }}>
            <MaterialIcons
              name="refresh"
              color={Colors.primaryLight}
              size={20}
            />
          </TouchableOpacity>
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
          <Text style={{ ...Fonts.black16RobotoMedium }}>Recent Astrologers</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('recentAstrologers')}>
            <Text style={{ ...Fonts.primaryLight15RobotoRegular }}>View all</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={recentAstroData}
          renderItem={renderItem}
          horizontal
          contentContainerStyle={{ paddingRight: Sizes.fixPadding * 1.5 }}
        />
      </View>
    );
  }

  function onlineAstrologerInfo() {
    const renderItem = ({ item, index }) => {
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate('astrologerDetailes', {
              data: item?.id,
            })
          }
          style={{
            width: SCREEN_WIDTH * 0.4,
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
            backgroundColor: Colors.white,
            alignItems: 'center',
          }}>
          <ImageBackground
            source={require('../assets/images/background_1.png')}
            style={{ width: '100%', height: 50 }}>
            <Image
              source={{ uri: item?.image }}
              style={{
                width: SCREEN_WIDTH * 0.14,
                height: SCREEN_WIDTH * 0.14,
                borderRadius: 1000,
                alignSelf: 'center',
                borderWidth: 1,
                borderColor: Colors.white,
                marginVertical: Sizes.fixPadding * 0.5,
                position: 'absolute',
                bottom: -15,
                zIndex: 2,
              }}
            />
            <Image
              source={require('../assets/gifs/live_indicator.gif')}
              style={{
                width: 15,
                height: 15,
                alignSelf: 'flex-end',
                margin: Sizes.fixPadding * 0.5,
              }}
            />
          </ImageBackground>
          <View
            style={{
              paddingHorizontal: Sizes.fixPadding * 0.3,
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: Sizes.fixPadding * 2,
              backgroundColor: Colors.grayLight,
              zIndex: -1,
            }}>
            <Stars
              default={parseInt(item?.avg_rating)}
              count={5}
              half={true}
              starSize={14}
              disabled={true}
              fullStar={
                <Ionicons name={'star'} size={14} color={Colors.primaryLight} />
              }
              emptyStar={
                <Ionicons
                  name={'star-outline'}
                  size={14}
                  color={Colors.primaryLight}
                />
              }
            />
            <Text numberOfLines={1} style={{ ...Fonts.black14InterMedium }}>
              {item.owner_name}
            </Text>
            <Text numberOfLines={1} style={{ ...Fonts.black12RobotoRegular }}>
              ({item.mainexperties})
            </Text>
            <Text numberOfLines={1} style={{ ...Fonts.black11InterMedium }}>
              {item.language}
            </Text>
            <Text
              style={{
                ...Fonts.black11InterMedium,
                marginTop: Sizes.fixPadding * 0.2,
              }}>
              <Text
                style={{
                  ...Fonts.black11InterMedium,
                  marginTop: Sizes.fixPadding * 0.2,
                  textDecorationLine:
                    item?.moa == '1' ? 'line-through' : 'none',
                }}>
                ₹{chat_price(item)}/min
              </Text>
              {item?.Offer_list.length != 0 && (
                <Text style={{ fontSize: 9 }}>
                  {' '}
                  ₹
                  {sum_price({
                    firstPrice: parseFloat(item?.chat_price_m),
                    secondPrice: parseFloat(item?.chat_commission),
                  })}
                </Text>
              )}
              {item?.moa == '1' && (
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: 'bold',
                    color: Colors.primaryLight,
                  }}>
                  {'Free 5 min'}
                </Text>
              )}
            </Text>
            <View
              style={{
                ...styles.row,
                marginVertical: Sizes.fixPadding,
                justifyContent: 'space-evenly',
                width: '100%',
              }}>
              <TouchableOpacity
                style={{
                  flex: 0.8,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: Colors.primaryLight,
                  borderRadius: Sizes.fixPadding * 0.5,
                }}>
                <Text style={{ ...Fonts.primaryDark11InterMedium }}>
                  Consult Now
                </Text>
              </TouchableOpacity>
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
          <Text style={{ ...Fonts.black16RobotoMedium }}>Online Astrologers</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('onlineAstrologers')}>
            <Text style={{ ...Fonts.primaryLight15RobotoRegular }}>View all</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={onlineAstroData}
          renderItem={renderItem}
          horizontal
          contentContainerStyle={{ paddingRight: Sizes.fixPadding * 1.5 }}
        />
      </View>
    );
  }

  function trendingAstrologerInfo() {
    const renderItem = ({ item, index }) => {
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate('astrologerDetailes', {
              data: item?.id,
            })
          }
          style={{
            width: SCREEN_WIDTH * 0.4,
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
            backgroundColor: Colors.white,
            alignItems: 'center',
          }}>
          <Image
            source={require('../assets/gifs/trending.gif')}
            style={{ width: '100%', height: Sizes.fixPadding * 2 }}
          />
          <View
            style={{
              paddingHorizontal: Sizes.fixPadding * 0.3,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={{ uri: item.image }}
              style={{
                width: SCREEN_WIDTH * 0.14,
                height: SCREEN_WIDTH * 0.14,
                borderRadius: 1000,
                alignSelf: 'center',
                borderWidth: 1,
                borderColor: Colors.primaryLight,
                marginVertical: Sizes.fixPadding * 0.5,
              }}
            />
            <Stars
              default={parseInt(item?.avg_rating)}
              count={5}
              half={true}
              starSize={14}
              disabled={true}
              fullStar={
                <Ionicons name={'star'} size={14} color={Colors.primaryLight} />
              }
              emptyStar={
                <Ionicons
                  name={'star-outline'}
                  size={14}
                  color={Colors.primaryLight}
                />
              }
            />
            <Text numberOfLines={1} style={{ ...Fonts.black14InterMedium }}>
              {item.owner_name}
            </Text>
            <Text numberOfLines={1} style={{ ...Fonts.black12RobotoRegular }}>
              ({item.mainexperties})
            </Text>
            <Text numberOfLines={1} style={{ ...Fonts.black12RobotoRegular }}>
              {item.language}
            </Text>
            <Text
              style={{
                ...Fonts.black11InterMedium,
                marginTop: Sizes.fixPadding * 0.2,
              }}>
              ₹{chat_price(item)}/min
              {item?.Offer_list.length != 0 && (
                <Text style={{ fontSize: 9, textDecorationLine: 'line-through' }}>
                  {' '}
                  ₹
                  {sum_price({
                    firstPrice: parseFloat(item?.chat_price_m),
                    secondPrice: parseFloat(item?.chat_commission),
                  })}
                </Text>
              )}
              {item?.moa == '1' && (
                <Text style={{ fontSize: 9, color: Colors.primaryLight }}>
                  {'Free 5 min'}
                </Text>
              )}
            </Text>
            <View
              style={{
                ...styles.row,
                marginVertical: Sizes.fixPadding,
                justifyContent: 'space-evenly',
                width: '100%',
              }}>
              <TouchableOpacity
                style={{
                  flex: 0.8,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: Colors.primaryLight,
                  borderRadius: Sizes.fixPadding * 0.5,
                }}>
                <Text style={{ ...Fonts.primaryDark11InterMedium }}>
                  Consult Now
                </Text>
              </TouchableOpacity>
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
          marginTop: Sizes.fixPadding * 1.5,
        }}>
        <FlatList
          data={trendingAstroData}
          renderItem={renderItem}
          horizontal
          contentContainerStyle={{ paddingRight: Sizes.fixPadding * 1.5 }}
        />
      </View>
    );
  }

  function otherAstrologerInfo() {
    const total_price = item => {
      return parseFloat(
        parseFloat(item?.chat_commission) + parseFloat(item?.chat_price_m),
      ).toFixed(1);
    };

    const discounted_price = item => {
      let actual_price = parseFloat(
        parseFloat(item?.chat_commission) + parseFloat(item?.chat_price_m),
      ).toFixed(1);

      return parseFloat(
        actual_price - (actual_price * parseFloat(item?.discount)) / 100,
      ).toFixed(1);
    };

    const renderItem = ({ item, index }) => {
      return (
        <View
          style={{
            width: SCREEN_WIDTH * 0.44,
            marginLeft: Sizes.fixPadding * 1.5,
            borderRadius: Sizes.fixPadding,
            overflow: 'hidden',
            borderWidth: 3,
            borderColor: Colors.grayLight,
            elevation: 5,
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.2,
            marginBottom: Sizes.fixPadding * 1.5,
            shadowColor: Colors.black,
            backgroundColor: Colors.white,
          }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate('astrologerDetailes', {
                data: item[0]?.astro_id,
              })
            }
            style={{}}>
            <View
              style={{
                backgroundColor: Colors.primaryLight,
                position: 'absolute',
                height: 40,
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{ ...Fonts.white16RobotoMedium }}>
                {item[0]?.offer_name}
              </Text>
            </View>
            <View
              style={{
                ...styles.row,
                justifyContent: 'space-between',
                paddingHorizontal: Sizes.fixPadding * 0.5,
                marginTop: Sizes.fixPadding * 2.5,
                alignItems: 'flex-end',
              }}>
              <View
                style={{
                  flex: 0.4,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={{ uri: item[0]?.image }}
                  style={{
                    width: SCREEN_WIDTH * 0.12,
                    height: SCREEN_WIDTH * 0.12,
                    borderRadius: 1000,
                    borderWidth: 1,
                    borderColor: Colors.white,
                  }}
                />
                <Text style={{ ...Fonts.black11InterMedium }}>
                  {item[0]?.owner_name}
                </Text>
                <Text
                  numberOfLines={2}
                  style={{ ...Fonts.gray9RobotoRegular, textAlign: 'center' }}>
                  ({item[0]?.mainexperties})
                </Text>
              </View>
              <View
                style={{
                  flex: 0.6,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View style={{ marginBottom: Sizes.fixPadding * 0.5 }}>
                  <Text style={{ ...Fonts.primaryLight18RobotoMedium }}>
                    ₹{discounted_price(item[0])}
                    <Text
                      style={{
                        ...Fonts.gray12RobotoMedium,
                        textDecorationLine: 'line-through',
                      }}>
                      {' '}
                      ₹{total_price(item[0])}{' '}
                    </Text>
                  </Text>
                </View>

                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-evenly',
                  }}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('astrologerDetailes', {
                        data: item[0]?.astro_id,
                      })
                    }>
                    <LinearGradient
                      colors={[Colors.primaryLight, Colors.primaryDark]}
                      style={{ borderRadius: Sizes.fixPadding * 0.3 }}>
                      <TouchableOpacity
                        style={{
                          paddingHorizontal: Sizes.fixPadding * 0.5,
                          paddingVertical: Sizes.fixPadding * 0.2,
                        }}>
                        <Text
                          style={{ ...Fonts.white11InterMedium, fontSize: 9 }}>
                          Consult Now
                        </Text>
                      </TouchableOpacity>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableOpacity>
          {item.length == 2 && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate('astrologerDetailes', {
                  data: item[1]?.astro_id,
                })
              }
              style={{ marginVertical: Sizes.fixPadding }}>
              <View
                style={{
                  backgroundColor: Colors.primaryLight,
                  position: 'absolute',
                  height: 40,
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{ ...Fonts.white16RobotoMedium }}>
                  {item[1]?.offer_name}
                </Text>
              </View>
              <View
                style={{
                  ...styles.row,
                  justifyContent: 'space-between',
                  paddingHorizontal: Sizes.fixPadding * 0.5,
                  marginTop: Sizes.fixPadding * 2.5,
                  alignItems: 'flex-end',
                }}>
                <View
                  style={{
                    flex: 0.4,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={{ uri: item[1]?.image }}
                    style={{
                      width: SCREEN_WIDTH * 0.12,
                      height: SCREEN_WIDTH * 0.12,
                      borderRadius: 1000,
                      borderWidth: 1,
                      borderColor: Colors.white,
                    }}
                  />
                  <Text style={{ ...Fonts.black11InterMedium }}>
                    {item[1]?.owner_name}
                  </Text>
                  <Text
                    numberOfLines={2}
                    style={{ ...Fonts.gray9RobotoRegular, textAlign: 'center' }}>
                    ({item[1]?.mainexperties})
                  </Text>
                </View>
                <View
                  style={{
                    flex: 0.6,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <View style={{ marginBottom: Sizes.fixPadding * 0.5 }}>
                    <Text style={{ ...Fonts.primaryLight18RobotoMedium }}>
                      ₹{discounted_price(item[1])}
                      <Text
                        style={{
                          ...Fonts.gray12RobotoMedium,
                          textDecorationLine: 'line-through',
                        }}>
                        {' '}
                        ₹{total_price(item[1])}{' '}
                      </Text>
                    </Text>
                  </View>
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-evenly',
                    }}>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('astrologerDetailes', {
                          data: item[1]?.astro_id,
                        })
                      }>
                      <LinearGradient
                        colors={[Colors.primaryLight, Colors.primaryDark]}
                        style={{ borderRadius: Sizes.fixPadding * 0.3 }}>
                        <TouchableOpacity
                          style={{
                            paddingHorizontal: Sizes.fixPadding * 0.5,
                            paddingVertical: Sizes.fixPadding * 0.2,
                          }}>
                          <Text
                            style={{ ...Fonts.white11InterMedium, fontSize: 9 }}>
                            Consult Now
                          </Text>
                        </TouchableOpacity>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        </View>
      );
    };

    return (
      <View style={{ borderBottomWidth: 1, borderBottomColor: Colors.grayLight }}>
        <View
          style={{
            ...styles.row,
            justifyContent: 'space-between',
            paddingHorizontal: Sizes.fixPadding * 1.5,
            paddingVertical: Sizes.fixPadding,
          }}>
          <Text style={{ ...Fonts.black16RobotoMedium }}>Offer Astrologers</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('offerAstrologers')}>
            <Text style={{ ...Fonts.primaryLight15RobotoRegular }}>View all</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={offerAstroData}
          renderItem={renderItem}
          horizontal
          contentContainerStyle={{ paddingRight: Sizes.fixPadding * 1.5 }}
        />
      </View>
    );
  }

  function remediesInfo() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate('remedies')}
        style={{
          width: SCREEN_WIDTH,
          height: SCREEN_WIDTH * 0.3,
          borderBottomWidth: 1,
          borderBottomColor: Colors.grayLight,
        }}>
        <Image
          source={require('../assets/images/remedies_home.png')}
          style={{ width: '100%', height: '100%' }}
          resizeMode="contain"
        />
      </TouchableOpacity>
    );
  }

  function freeInsightInfo() {
    const on_press = id => {
      switch (id) {
        case 1:
          navigation.navigate('freeInsights');
          break;
        case 2:
          navigation.navigate('matchMaking');
          break;
        case 3:
          navigation.navigate('freeKundli');
          break;
        case 4:
          navigation.navigate('panchang');
          break;
        default:
          console.log(null);
      }
    };

    const renderItem = ({ item, index }) => {
      return (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => on_press(item.id)}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: Sizes.fixPadding,
            marginHorizontal: SCREEN_WIDTH * 0.025,
          }}>
          <LinearGradient
            colors={[Colors.primaryLight, Colors.primaryDark]}
            locations={[0.75, 1]}
            style={{
              width: SCREEN_WIDTH * 0.2,
              height: SCREEN_WIDTH * 0.2,
              borderRadius: 1000,
              overflow: 'hidden',
              elevation: 5,
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.2,
              marginBottom: Sizes.fixPadding * 0.5,
              shadowColor: Colors.black,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image source={item.image} style={{ width: '85%', height: '85%' }} />
          </LinearGradient>
          <Text style={{ ...Fonts.gray14RobotoRegular, textAlign: 'center' }}>
            {item.name}
          </Text>
        </TouchableOpacity>
      );
    };
    return (
      <View style={{ borderBottomWidth: 1, borderBottomColor: Colors.grayLight }}>
        <View
          style={{
            ...styles.row,
            justifyContent: 'space-between',
            paddingHorizontal: Sizes.fixPadding * 1.5,
            paddingVertical: Sizes.fixPadding,
          }}>
          <Text style={{ ...Fonts.black16RobotoMedium }}>Free Insights</Text>
        </View>
        <FlatList
          data={freeInsightData}
          renderItem={renderItem}
          scrollEnabled={false}
          horizontal
        />
      </View>
    );
  }

  function liveAstrologerInfo() {
    const on_live = item => {
      if (isRegister?.value) {
        navigation.navigate('goLive', {
          userID: userData?.id,
          userName: userData?.username,
          liveID: item.live_id,
          astroData: item,
        });
      } else {
        if (isRegister?.type == 'profile') {
          navigation.navigate('profile');
        } else {
          navigation.navigate('login');
        }
      }
    };
    const renderItem = ({ item, index }) => {
      return (
        <View>
          {item.status == 'live' ? (
            <Image
              source={require('../assets/gifs/live_gif.gif')}
              style={{
                width: '80%',
                height: 20,
                resizeMode: 'contain',
                alignSelf: 'center',
                bottom: -10,
                zIndex: 99,
                marginLeft: Sizes.fixPadding * 1.5,
              }}
            />
          ) : (
            <View
              style={{
                backgroundColor: Colors.primaryLight,
                paddingVertical: Sizes.fixPadding * 0.2,
                width: '80%',
                height: 20,
                alignSelf: 'center',
                bottom: -10,
                zIndex: 99,
                marginLeft: Sizes.fixPadding * 1.5,
                borderRadius: 1000,
              }}>
              <Text style={{ ...Fonts.white12RobotoMedium, textAlign: 'center' }}>
                Scheduled
              </Text>
            </View>
          )}

          <TouchableOpacity
            activeOpacity={0.8}
            disabled={item.status != 'live'}
            onPress={() => {
              on_live(item);
            }}
            style={{
              width: SCREEN_WIDTH * 0.28,
              height: SCREEN_WIDTH * 0.31,
              marginLeft: Sizes.fixPadding * 1.5,
              borderRadius: Sizes.fixPadding,
              overflow: 'hidden',
              borderWidth: item.id == 1 ? 3 : 0,
              borderColor: Colors.primaryLight,
              elevation: 5,
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.2,
              marginBottom: Sizes.fixPadding * 1.5,
              shadowColor: Colors.black,
            }}>
            <ImageBackground
              source={{ uri: img_url_2 + item.img_url }}
              style={{
                width: '100%',
                height: '100%',
                zIndex: -1,
              }}></ImageBackground>
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
                justifyContent: 'flex-end',
                padding: Sizes.fixPadding * 0.4,
              }}>
              <View style={{ ...styles.row, justifyContent: 'space-between' }}>
                <Text style={{ ...Fonts.white11InterMedium }}>
                  {item.owner_name}
                </Text>
                <Ionicons name="videocam" color={Colors.white} size={18} />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      );
    };

    return (
      <View style={{ borderBottomWidth: 1, borderBottomColor: Colors.grayLight }}>
        <View
          style={{
            ...styles.row,
            justifyContent: 'space-between',
            paddingHorizontal: Sizes.fixPadding * 1.5,
            paddingTop: Sizes.fixPadding,
          }}>
          <Text style={{ ...Fonts.black16RobotoMedium }}>Live Astrologers</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('live')}>
            <Text style={{ ...Fonts.primaryLight15RobotoRegular }}>View all</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={liveAstroData}
          renderItem={renderItem}
          horizontal
          contentContainerStyle={{ paddingRight: Sizes.fixPadding * 1.5 }}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  }

  function bannerInfo() {
    const baseOptions = {
      vertical: false,
      width: SCREEN_WIDTH,
      height: SCREEN_WIDTH * 0.4,
    };

    const renderItem = ({ index }) => {
      return (
        <View
          style={{
            width: SCREEN_WIDTH * 0.95,
            height: SCREEN_WIDTH * 0.35,
            backgroundColor: Colors.whiteColor,
            borderRadius: 5,
            padding: Sizes.fixPadding * 0.5,
          }}>
          <Image
            source={{ uri: img_url + bannerData[index].image }}
            resizeMode="cover"
            style={{
              width: '100%',
              height: '100%',
              marginHorizontal: Sizes.fixPadding,
              borderRadius: Sizes.fixPadding,
            }}
          />
        </View>
      );
    };

    return (
      <SafeAreaView edges={['bottom']} style={{ flex: 1 }}>
        <Carousel
          {...baseOptions}
          loop
          testID={'xxx'}
          style={{
            width: '100%',
            borderBottomWidth: 1,
            borderBottomColor: Colors.grayLight,
            marginTop: Sizes.fixPadding * 0.5,
            paddingHorizontal: Sizes.fixPadding,
          }}
          autoPlay={true}
          autoPlayInterval={4000}
          onProgressChange={(_, absoluteProgress) =>
            (progressValue.value = absoluteProgress)
          }
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: 1,
            parallaxScrollingOffset: 0,
          }}
          data={bannerData}
          pagingEnabled={true}
          onSnapToItem={index => {
          }}
          renderItem={renderItem}
        />
      </SafeAreaView>
    );
  }

  function searchInfo() {
    return (
      <View
        style={{
          paddingVertical: Sizes.fixPadding,
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: Colors.gray + '30',
          paddingHorizontal: Sizes.fixPadding * 1.5,
        }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate('searchAstrologers', {
              astrologerData: astroData,
            })
          }
          style={{
            ...styles.row,
            borderBottomWidth: 0,
            margin: 0,
            padding: 0,
            paddingVertical: 0,
            paddingTop: 0,
            backgroundColor: Colors.grayLight + '50',
            borderRadius: 1000,
            paddingHorizontal: Sizes.fixPadding,
            height: 36,
          }}>
          <Image
            source={require('../assets/images/icons/search.png')}
            style={{ width: 20, height: 20 }}
          />
          <Text
            style={{
              ...Fonts.gray14RobotoRegular,
              marginLeft: Sizes.fixPadding,
            }}>
            Search for an astrologer...
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  function header() {
    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 1.5,
          flex: 0,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.openDrawer()}
          style={{ paddingVertical: Sizes.fixPadding }}>
          <Image
            source={require('../assets/images/icons/bar_icon.png')}
            style={{ width: 25, height: 25 }}
          />
        </TouchableOpacity>
        <Divider
          orientation="vertical"
          width={1}
          color={Colors.gray + '30'}
          style={{ marginHorizontal: Sizes.fixPadding }}
        />
        <Image
          source={require('../assets/images/logo_icon.png')}
          style={{ width: 25, height: 25 }}
        />
        <Text
          style={{
            ...Fonts.primaryLight18RighteousRegular,
            marginLeft: Sizes.fixPadding,
          }}>
          FortuneTalk
        </Text>
        <View style={{ ...styles.row, flexGrow: 1, justifyContent: 'flex-end' }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('wallet', { type: 'wallet' })}
            style={{ paddingVertical: Sizes.fixPadding * 0.5 }}>
            <Image
              source={require('../assets/gifs/wallet_gif.gif')}
              style={{ width: 25, height: 25 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              paddingVertical: Sizes.fixPadding * 0.5,
              marginLeft: Sizes.fixPadding,
            }}>
            <Image
              source={require('../assets/images/icons/translate.png')}
              style={{ width: 25, height: 25 }}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
};

const mapStateToProps = state => ({
  userData: state.user.userData,
  wallet: state.user.wallet,
});

const mapDispatchToProps = dispatch => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(Home);

const styles = StyleSheet.create({
  row: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
