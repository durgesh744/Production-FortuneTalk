import {
  View,
  Text,
  FlatList,
  Image,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, {useState} from 'react';
import {Colors, Fonts, Sizes} from '../../assets/style';
import {SCREEN_WIDTH} from '../../config/Screen';
import MyStatusBar from '../../components/MyStatusBar';
import MyHeader from '../../components/MyHeader';
import LinearGradient from 'react-native-linear-gradient';
import {base_url, img_url, img_url_3} from '../../config/constants';
import moment from 'moment';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RenderHTML from 'react-native-render-html';

const ScheduleCourse = ({navigation, route, customerData}) => {
  const [state, setState] = useState({
    liveData: route?.params?.data,
  });

  const updateState = data => {
    setState(prevState => {
      const newData = {...prevState, ...data};
      return newData;
    });
  };

  const {liveData} = state;
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
            {bannerInfo()}
            {coursePriceInfo()}
            {bookNowInfo()}
            {startDateInfo()}
            {includesInfo()}
            {contentInfo()}
            {endingLearnInfo()}
          </>
        }
      />
    </View>
  );

  function endingLearnInfo() {
    const renderItem = ({item, index}) => {
      return (
        <View
          style={{
            flex: 0,
            flexDirection: 'row',
            marginBottom: Sizes.fixPadding * 0.5,
          }}>
          <View style={styles.dots} />
          <Text
            style={{
              ...Fonts.gray12RobotoMedium,
              flex: 1,
            }}>
            She has been awarded with KP Vidya Vachaspathi Degree from Prof. K.
            Hariharan from Chennai (S/o K.S. Krishnamurthy - Founder of KP
            System in Astrology).
          </Text>
        </View>
      );
    };
    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding,
          paddingVertical: Sizes.fixPadding * 2,
        }}>
        <Text
          style={{
            ...Fonts.black16RobotoRegular,
            marginBottom: Sizes.fixPadding,
          }}>
          What will you learn from this Course ?
        </Text>
        <FlatList data={[1, 2, 3, 4, 5, 6, 7, 8]} renderItem={renderItem} />
      </View>
    );
  }

  function contentInfo() {
    const renderItem = ({item, index}) => {
      return (
        <View
          style={{
            flex: 0,
            flexDirection: 'row',
            marginBottom: Sizes.fixPadding * 0.5,
          }}>
          <Text>{index + 1}.</Text>
          <Text
            style={{
              ...Fonts.gray12RobotoMedium,
              flex: 1,
              marginLeft: Sizes.fixPadding,
            }}>
            She has been awarded with KP Vidya Vachaspathi Degree from Prof. K.
            Hariharan from Chennai.
          </Text>
          <Text style={{...Fonts.gray12RobotoMedium}}>21 min</Text>
        </View>
      );
    };
    return (
      <View
        style={{
          paddingHorizontal: Sizes.fixPadding * 1.5,
          paddingVertical: Sizes.fixPadding * 2,
          borderBottomWidth: 1,
          borderBottomColor: Colors.grayLight,
        }}>
        <Text
          style={{
            ...Fonts.black16RobotoRegular,
          }}>
          Course Content
        </Text>
        <RenderHTML
          contentWidth={SCREEN_WIDTH*0.9}
          source={{html:liveData?.course_content.replace(/&lt;/g, '<').replace(/&gt;/g, '>')}}
          enableExperimentalMarginCollapsing={false}
          baseStyle={{
            color: Colors.blackLight,
            // textAlign: 'justify',
            fontSize: '14px',
            // lineHeight: 20,
            padding: 0,

          }}
        />
      </View>
    );
  }

  function includesInfo() {
    return (
      <View
        style={{
          paddingHorizontal: Sizes.fixPadding * 1.5,
          paddingVertical: Sizes.fixPadding * 2,
          borderBottomWidth: 1,
          borderBottomColor: Colors.grayLight,
        }}>
        <Text
          style={{
            ...Fonts.black16RobotoRegular,
            marginBottom: Sizes.fixPadding,
          }}>
          This course includes
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: Sizes.fixPadding,
          }}>
          <Image
            source={require('../../assets/images/courses/icon_youtube.png')}
            style={{width: 15, height: 15, resizeMode: 'contain'}}
          />
          <Text
            style={{
              marginLeft: Sizes.fixPadding,
              ...Fonts.gray12RobotoRegular,
            }}>
            9.5 hours on-demand video
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: Sizes.fixPadding,
          }}>
          <Image
            source={require('../../assets/images/courses/icon_book.png')}
            style={{width: 15, height: 15, resizeMode: 'contain'}}
          />
          <Text
            style={{
              marginLeft: Sizes.fixPadding,
              ...Fonts.gray12RobotoRegular,
            }}>
            Assignments
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: Sizes.fixPadding,
          }}>
          <Image
            source={require('../../assets/images/courses/cloud-download.png')}
            style={{width: 15, height: 15, resizeMode: 'contain'}}
          />
          <Text
            style={{
              marginLeft: Sizes.fixPadding,
              ...Fonts.gray12RobotoRegular,
            }}>
            5 downloadable resources
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: Sizes.fixPadding,
          }}>
          <Image
            source={require('../../assets/images/courses/laptop-mobile.png')}
            style={{width: 15, height: 15, resizeMode: 'contain'}}
          />
          <Text
            style={{
              marginLeft: Sizes.fixPadding,
              ...Fonts.gray12RobotoRegular,
            }}>
            Access on mobile and TV
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: Sizes.fixPadding,
          }}>
          <Image
            source={require('../../assets/images/courses/key.png')}
            style={{width: 15, height: 15, resizeMode: 'contain'}}
          />
          <Text
            style={{
              marginLeft: Sizes.fixPadding,
              ...Fonts.gray12RobotoRegular,
            }}>
            Full lifetime access
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: Sizes.fixPadding,
          }}>
          <Image
            source={require('../../assets/images/courses/award_course.png')}
            style={{width: 15, height: 15, resizeMode: 'contain'}}
          />
          <Text
            style={{
              marginLeft: Sizes.fixPadding,
              ...Fonts.gray12RobotoRegular,
            }}>
            Certificate of completion
          </Text>
        </View>
      </View>
    );
  }

  function startDateInfo() {
    return (
      <View
        style={{
          padding: Sizes.fixPadding * 2,
          borderBottomWidth: 1,
          borderBottomColor: Colors.grayLight,
        }}>
        <Text
          style={{
            ...Fonts.black16RobotoRegular,
            textAlign: 'center',
            color: Colors.red,
          }}>
          Batch will Start by{' '}
          {moment(liveData?.batchStartDate).format('Do MMMM YYYY')}
        </Text>
      </View>
    );
  }

  function bookNowInfo() {
    const on_payment = async () => {
      const check_is_register = await AsyncStorage.getItem('isRegister');
      const isRegister = JSON.parse(check_is_register);
      if (isRegister?.value) {
        navigation.navigate('courseBookingDetails', {
          data: {
            astroName: liveData?.owner_name,
            astroImage: img_url + liveData?.img_url,
            title: liveData?.course_name,
            description: liveData?.description,
            price: liveData?.coursePrice,
            type: 'live_course',
            image: base_url + liveData?.image[0]?.images,
            apiData: {
              course_id: liveData?.id,
              customer_id: customerData?.id,
              teacher_id: liveData?.astro_id,
            },
          },
        });
      } else {
        if(isRegister?.type == 'profile'){
          navigation.navigate('profile')
        }else{
          navigation.navigate('login')
        }
      }
    };
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={on_payment}
        style={{
          borderBottomWidth: 1,
          paddingVertical: Sizes.fixPadding * 2,
          borderBottomColor: Colors.grayLight,
        }}>
        <LinearGradient
          colors={[Colors.primaryLight, Colors.primaryDark]}
          style={{
            marginHorizontal: Sizes.fixPadding * 2,
            paddingVertical: Sizes.fixPadding,
            borderRadius: Sizes.fixPadding,
          }}>
          <Text style={{...Fonts.white16RobotoMedium, textAlign: 'center'}}>
            Book Now
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  function coursePriceInfo() {
    return (
      <View style={{marginHorizontal: Sizes.fixPadding * 1.5}}>
        <Text style={{...Fonts.black16RobotoMedium}}>
          ₹{liveData?.coursePrice}{' '}
          {/* <Text
            style={{
              color: Colors.primaryLight,
              fontSize: 14,
              textDecorationLine: 'line-through',
            }}>
            ₹18,299
          </Text> */}
          <Text style={{...Fonts.black14RobotoRegular}}> (1 month course)</Text>
        </Text>
      </View>
    );
  }

  function bannerInfo() {
    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 1.5,
          height: SCREEN_WIDTH * 0.55,
          borderRadius: Sizes.fixPadding,
          overflow: 'hidden',
          marginVertical: Sizes.fixPadding * 1.5,
        }}>
        <Image
          source={{uri: base_url + liveData?.image[0]?.images}}
          style={{width: '100%', height: '100%'}}
        />
      </View>
    );
  }

  function header() {
    return <MyHeader title={'Scedule Course'} navigation={navigation} />;
  }
};

const mapStateToProps = state => ({
  customerData: state.user.userData,
  wallet: state.user.wallet,
});

export default connect(mapStateToProps, null)(ScheduleCourse);

const styles = StyleSheet.create({
  dots: {
    width: 5,
    height: 5,
    borderRadius: 5,
    backgroundColor: Colors.gray,
    marginRight: Sizes.fixPadding,
    marginTop: Sizes.fixPadding * 0.5,
  },
});
