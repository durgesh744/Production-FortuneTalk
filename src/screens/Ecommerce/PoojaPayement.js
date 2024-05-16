import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors, Fonts, Sizes} from '../../assets/style';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MyStatusBar from '../../components/MyStatusBar';
import Carousel from 'react-native-reanimated-carousel';
import {SCREEN_WIDTH} from '../../config/Screen';
import {useSharedValue} from 'react-native-reanimated';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Payment from '../../components/Payment';
import {connect} from 'react-redux';
import {api_url, img_url_2, img_url_3} from '../../config/constants';
import {Modal} from 'react-native-paper';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';

const astrologerData = [
  {
    id: 1,
    name: 'Soniya Ji',
    image: require('../../assets/images/users/user1.jpg'),
  },
  {
    id: 2,
    name: 'Guru Ji',
    image: require('../../assets/images/users/user2.jpg'),
  },
  {
    id: 3,
    name: 'Revati Ji',
    image: require('../../assets/images/users/user3.jpg'),
  },
  {
    id: 4,
    name: 'Guru Ji',
    image: require('../../assets/images/users/user4.jpg'),
  },
];

const PoojaPayement = ({navigation, route, userData}) => {
  const progressValue = useSharedValue(0);
  const [state, setState] = useState({
    paginationIndex: 0,
    showPayment: false,
    successVisible: false,
    poojaData: route.params?.poojaData,
    suggestedBy: route?.params?.suggestedBy,
    poojaType: route?.params?.poojaType
  });
  useEffect(() => {}, [paginationIndex]);

  function gst_amount() {
    return (
    ( parseFloat(poojaData?.price) * 18.0) / 100).toFixed(2)

  }

  function total_amount() {
    return (
     parseFloat(parseFloat(poojaData?.price) + (parseFloat(poojaData?.price) * 18.0) / 100).toFixed(2)
    );
  }

  const updateState = data => {
    setState(prevState => {
      const newData = {...prevState, ...data};
      return newData;
    });
  };

  const {paginationIndex, showPayment, successVisible, poojaData, suggestedBy, poojaType} = state;

  return (
    <View style={{flex: 1, backgroundColor: Colors.bodyColor}}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      <View style={{flex: 1}}>
        {header()}
        <FlatList
          ListHeaderComponent={
            <>
              {bannerInfo()}
              {!successVisible && remediesInfo()}
              {successVisible && remedydonInfo()}
              {/* {!successVisible && addressInfo()} */}
              {successVisible && paidAmountInfo()}
              {billDetailsInfo()}
              {successVisible && astrologerInfo()}
            </>
          }
          contentContainerStyle={{paddingVertical: Sizes.fixPadding}}
        />
        {!successVisible && continueButtonInfo()}
        {/* {successModalInfo()} */}
      </View>
      <Payment
        showPayment={showPayment}
        updateState={updateState}
        type={'book_pooja'}
        userData={userData}
        amount={total_amount()}
        apiData={{
          schedule_id: poojaData?.id,
          pooja_id: poojaData?.pooja_id,
          customer_id: userData?.id,
          astrologer_id: poojaData?.astro_id,
          suggested_by: suggestedBy,
          type: poojaType
        }}
      />
    </View>
  );

  function continueButtonInfo() {
    const on_payment = async()=>{
      const check_is_register = await AsyncStorage.getItem('isRegister');
      const isRegister = JSON.parse(check_is_register);
      if(isRegister?.value){
        updateState({showPayment: true})
      }else{
        if(isRegister?.type == 'profile'){
          navigation.navigate('profile')
        }else{
          navigation.navigate('login')
        }
      }
    }
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={on_payment}
        style={{
          marginHorizontal: Sizes.fixPadding * 2,
          marginVertical: Sizes.fixPadding,
          borderRadius: Sizes.fixPadding * 1.4,
          overflow: 'hidden',
        }}>
        <LinearGradient
          colors={[Colors.primaryLight, Colors.primaryDark]}
          style={{paddingVertical: Sizes.fixPadding}}>
          <Text style={{...Fonts.white18RobotMedium, textAlign: 'center'}}>
            Continue for Payment
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  function astrologerInfo() {
    return (
      <View
        style={{
          paddingHorizontal: Sizes.fixPadding * 2,
          borderTopWidth: 1,
          borderTopColor: Colors.grayLight,
          paddingTop: Sizes.fixPadding,
        }}>
        <Text
          style={{
            ...Fonts.primaryLight15RobotoMedium,
            marginBottom: Sizes.fixPadding,
          }}>
          Pooja will Perform
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 1000,
                overflow: 'hidden',
                borderWidth: 2,
                borderColor: Colors.white,
                elevation: 5,
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.2,
                shadowColor: Colors.blackLight,
              }}>
              <Image
                source={{uri: img_url_2 + poojaData?.img_url}}
                style={{width: '100%', height: '100%'}}
              />
            </View>
            <Text
              style={{
                ...Fonts.black16RobotoMedium,
                marginLeft: Sizes.fixPadding,
              }}>
              {poojaData?.owner_name}
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate('astrologerDetailes', {
                data: {
                  id: poojaData?.astro_id
                },
              })
            }
            style={{
              backgroundColor: Colors.grayLight,
              borderRadius: 1000,
              paddingVertical: Sizes.fixPadding * 0.5,
              paddingHorizontal: Sizes.fixPadding,
            }}>
            <Text style={{...Fonts.gray14RobotoRegular}}>View Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function paidAmountInfo() {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginHorizontal: Sizes.fixPadding * 1.5,
          backgroundColor: Colors.grayLight,
          padding: Sizes.fixPadding,
          borderRadius: Sizes.fixPadding,
          elevation: 5,
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.2,
          shadowColor: Colors.blackLight,
          marginTop: Sizes.fixPadding,
        }}>
        <Text>Paid Amount - ₹ {poojaData?.price}</Text>
        <Ionicons name="chevron-down" color={Colors.blackLight} size={24} />
      </View>
    );
  }

  function billDetailsInfo() {
    return (
      <View
        style={{
          margin: Sizes.fixPadding * 1.5,
        }}>
        <View
          style={[
            styles.row,
            {justifyContent: 'space-between', marginBottom: Sizes.fixPadding},
          ]}>
          <Text style={{...Fonts.black16RobotoRegular}}>Subtotal</Text>
          <Text style={{...Fonts.black16RobotoMedium}}>
            ₹ {poojaData?.price}
          </Text>
        </View>
        {/* <View
          style={[
            styles.row,
            {justifyContent: 'space-between', marginBottom: Sizes.fixPadding},
          ]}>
          <Text style={{...Fonts.black16RobotoRegular}}>Delivery Charge</Text>
          <Text style={{...Fonts.black16RobotoRegular}}>Free</Text>
        </View> */}
        <View
          style={[
            styles.row,
            {
              justifyContent: 'space-between',
              paddingBottom: Sizes.fixPadding,
              marginBottom: Sizes.fixPadding,
              borderBottomWidth: 1,
              borderColor: Colors.grayLight,
            },
          ]}>
          <Text style={{...Fonts.black16RobotoRegular}}>GST @ 18.0%</Text>
          <Text style={{...Fonts.black16RobotoRegular}}>₹ {gst_amount()}</Text>
        </View>
        <View
          style={[
            styles.row,
            {
              justifyContent: 'space-between',
              marginBottom: Sizes.fixPadding,
            },
          ]}>
          <Text style={{...Fonts.black16RobotoRegular}}>Total</Text>
          <Text style={{...Fonts.black16RobotoRegular}}>
            ₹ {total_amount()}
          </Text>
        </View>
      </View>
    );
  }

  function addressInfo() {
    return (
      <View
        style={{
          margin: Sizes.fixPadding * 1.5,
          borderBottomWidth: 1,
          borderBottomColor: Colors.grayLight,
        }}>
        <View style={[styles.row, {justifyContent: 'space-between'}]}>
          <Text style={{...Fonts.black16RobotoMedium}}>Address</Text>
          <TouchableOpacity>
            <Ionicons
              name="pencil-sharp"
              color={Colors.primaryDark}
              size={20}
            />
          </TouchableOpacity>
        </View>

        <Text
          style={{
            ...Fonts.gray14RobotoRegular,
            marginVertical: Sizes.fixPadding * 0.7,
          }}>
          GC76+79C, Blossom County, Sector 90, Noida, Uttar Pradesh 201305
        </Text>
      </View>
    );
  }

  function remedydonInfo() {
    return (
      <View
        style={{
          padding: Sizes.fixPadding * 1.5,
          borderBottomWidth: 1,
          borderBottomColor: Colors.grayLight,
        }}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            padding: Sizes.fixPadding * 2,
            borderWidth: 3,
            borderStyle: 'dashed',
            borderRadius: Sizes.fixPadding,
            borderColor: Colors.primaryLight,
          }}>
          <Text style={{...Fonts.primaryLight18RobotoMedium}}>
            {poojaData?.title}
          </Text>
          <Text style={{...Fonts.primaryLight15RobotoMedium}}>
            {moment(poojaData?.date).format('Do MMMM YYYY')}
          </Text>
          <Text style={{...Fonts.primaryLight14RobotoMedium}}>
            at {moment(poojaData?.time).format('hh:mm A')}
          </Text>
        </View>
      </View>
    );
  }

  function remediesInfo() {
    return (
      <View
        style={{
          padding: Sizes.fixPadding * 1.5,
          borderBottomWidth: 1,
          borderBottomColor: Colors.grayLight,
        }}>
        <Text style={{...Fonts.primaryLight18RobotoMedium}}>
          {poojaData?.title}
        </Text>
        <Text
          style={{
            ...Fonts.gray14RobotoMedium,
            fontSize: 13,
            marginVertical: Sizes.fixPadding * 0.7,
          }}>
          {poojaData?.description}
        </Text>
      </View>
    );
  }

  function renderPagination() {
    return (
      <View style={styles.paginationContainer}>
        {astrologerData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              {
                backgroundColor:
                  paginationIndex === index
                    ? Colors.blackLight
                    : Colors.grayDark + '70',
              },
            ]}
          />
        ))}
      </View>
    );
  }

  function bannerInfo() {
    const baseOptions = {
      vertical: false,
      width: SCREEN_WIDTH,
      height: SCREEN_WIDTH * 0.4,
    };

    const renderItem = ({index}) => {
      return (
        <View
          style={{
            width: SCREEN_WIDTH * 0.8,
            height: SCREEN_WIDTH * 0.4,
            backgroundColor: Colors.whiteColor,
            borderRadius: Sizes.fixPadding * 2,
            alignSelf: 'center',
          }}>
          <Image
            source={{uri: img_url_3 + poojaData?.collection[index]}}
            resizeMode="cover"
            style={{
              width: '100%',
              height: '100%',
              borderRadius: Sizes.fixPadding,
            }}
          />
        </View>
      );
    };

    return (
      <SafeAreaView edges={['bottom']} style={{flex: 1}}>
        <Carousel
          {...baseOptions}
          loop
          testID={'xxx'}
          style={{
            width: '100%',
            borderBottomColor: Colors.grayLight,
            paddingHorizontal: Sizes.fixPadding,
          }}
          autoPlay={true}
          autoPlayInterval={4000}
          onProgressChange={(_, absoluteProgress) => {
            progressValue.value = absoluteProgress;
          }}
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: 1,
            parallaxScrollingOffset: 60,
          }}
          data={poojaData?.collection}
          pagingEnabled={true}
          onSnapToItem={index => {
            updateState({paginationIndex: index});
          }}
          renderItem={renderItem}
        />
      </SafeAreaView>
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
          Booking Details
        </Text>
      </View>
    );
  }
};

const mapStateToProps = state => ({
  userData: state.user.userData,
});

export default connect(mapStateToProps, null)(PoojaPayement);

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
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayLight,
    paddingVertical: Sizes.fixPadding,
  },
  paginationDot: {
    width: 12,
    height: 2,
    borderRadius: 5,
    margin: 5,
  },
});
