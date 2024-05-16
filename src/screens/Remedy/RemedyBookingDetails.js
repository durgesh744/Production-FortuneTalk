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
import {api_url, img_url_2} from '../../config/constants';
import {Modal} from 'react-native-paper';

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

const RemedyBookingDetails = ({navigation, route, userData}) => {
  const progressValue = useSharedValue(0);
  const [state, setState] = useState({
    paginationIndex: 0,
    showPayment: false,
    successVisible: false,
    remedyData: route.params?.remedyData,
  });
  useEffect(() => {}, [paginationIndex]);

  function gst_amount() {
    return (
      parseFloat(remedyData?.price) -
      (parseFloat(remedyData?.price) * 3.0) / 100
    );
  }

  function total_amount() {
    return (
      parseFloat(remedyData?.price) +
      (parseFloat(remedyData?.price) * 3.0) / 100
    );
  }

  const updateState = data => {
    setState(prevState => {
      const newData = {...prevState, ...data};
      return newData;
    });
  };

  const {paginationIndex, showPayment, successVisible, remedyData} = state;

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
              {/* {renderPagination()} */}
              {remediesInfo()}
              {addressInfo()}
              {billDetailsInfo()}
            </>
          }
          contentContainerStyle={{paddingVertical: Sizes.fixPadding}}
        />
        {continueButtonInfo()}
        {successModalInfo()}
      </View>
      <Payment
        showPayment={showPayment}
        updateState={updateState}
        type={'remedy'}
        userData={userData}
        amount={total_amount()}
        apiData={{
          remedy_id: remedyData?.id,
          address: 'Noida sector 63, UP',
          lat: '26.23432432',
          long: '28.3423523',
          customer_id: userData?.id,
        }}
      />
    </View>
  );

  function successModalInfo() {
    const on_go_to_history = ()=>{
      updateState({successVisible: false})
      navigation.pop(2)
    }
    return (
      <Modal
        visible={successVisible}
        onDismiss={() => updateState({successVisible: false})}>
        <View
          style={{
            backgroundColor: Colors.white,
            marginHorizontal: Sizes.fixPadding * 2,
            borderRadius: Sizes.fixPadding,
            padding: Sizes.fixPadding * 1.5,
          }}>
          <Text
            style={{
              ...Fonts.primaryLight18RobotoMedium,
              color: Colors.green_a,
              textAlign: 'center',
            }}>
            Booking Successfull!!
          </Text>

          <View
            style={{
              backgroundColor: Colors.grayLight,
              paddingVertical: Sizes.fixPadding,
              paddingHorizontal: Sizes.fixPadding * 1.2,
              borderRadius: Sizes.fixPadding,
              marginTop: Sizes.fixPadding,
            }}>
            <Image
              source={{
                uri:
                  api_url +
                  'uploads/images/img/' +
                  remedyData?.images[0]?.image,
              }}
              style={{
                width: '100%',
                height: 130,
                borderRadius: Sizes.fixPadding,
              }}
            />
            <Text
              style={{
                ...Fonts.black16RobotoMedium,
                textAlign: 'center',
                marginVertical: Sizes.fixPadding,
              }}>
              {remedyData?.product_name}
            </Text>
            <View
              style={{
                alignSelf: 'center',
                backgroundColor: Colors.white,
                elevation: 5,
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.2,
                shadowColor: Colors.blackLight,
                paddingHorizontal: Sizes.fixPadding,
                paddingVertical: Sizes.fixPadding * 0.8,
                borderRadius: Sizes.fixPadding,
              }}>
              <Text style={{...Fonts.gray16RobotoMedium}}>
                Paid Amount - ₹ {total_amount()}
              </Text>
            </View>
            <View
              style={{
                borderBottomWidth: 1,
                width: '100%',
                marginVertical: Sizes.fixPadding * 1.5,
                borderBottomColor: Colors.gray,
              }}
            />
            <View
              style={[
                styles.row,
                {
                  alignSelf: 'center',
                  
                },
              ]}>
              <View
                style={{
                  width: 45,
                  height: 45,
                  borderRadius: 1000,
                  elevation: 5,
                  shadowOffset: {
                    width: 0,
                    height: 1,
                  },
                  shadowOpacity: 0.2,
                  borderWidth: 1.5,
                  borderColor: Colors.white,
                  overflow: 'hidden',
                }}>
                <Image
                  source={{uri: img_url_2 + remedyData?.img_url}}
                  style={{width: '100%', height: '100%'}}
                />
              </View>
              <Text
                style={{
                  ...Fonts.black16RobotoMedium,
                  marginLeft: Sizes.fixPadding,
                }}>
                {remedyData?.owner_name}
              </Text>
            </View>
          </View>
          <TouchableOpacity
              activeOpacity={0.8}
              onPress={()=>on_go_to_history()}
              // disabled={suggestedData?.status == 1}
              // onPress={()=>on_paid_remedy()}
              style={{width: '80%', alignSelf: 'center', marginTop: Sizes.fixPadding*1.5}}>
              <LinearGradient
                colors={[Colors.primaryLight, Colors.primaryDark]}
                style={{
                  width: '100%',
                  paddingVertical: Sizes.fixPadding,
                  borderRadius: 1000,
                }}>
                <Text
                  style={{...Fonts.white14RobotoMedium, textAlign: 'center'}}>
                  Go To Order History
                </Text>
              </LinearGradient>
            </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  function continueButtonInfo() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => updateState({showPayment: true})}
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
            ₹ {remedyData?.price}
          </Text>
        </View>
        <View
          style={[
            styles.row,
            {justifyContent: 'space-between', marginBottom: Sizes.fixPadding},
          ]}>
          <Text style={{...Fonts.black16RobotoRegular}}>Delivery Charge</Text>
          <Text style={{...Fonts.black16RobotoRegular}}>Free</Text>
        </View>
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
          <Text style={{...Fonts.black16RobotoRegular}}>GST @ 3.0%</Text>
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

  function remediesInfo() {
    return (
      <View
        style={{
          padding: Sizes.fixPadding * 1.5,
          borderBottomWidth: 1,
          borderBottomColor: Colors.grayLight,
        }}>
        <Text style={{...Fonts.primaryLight18RobotoMedium}}>
          {remedyData?.product_name}
        </Text>
        <Text
          style={{
            ...Fonts.gray14RobotoMedium,
            fontSize: 13,
            marginVertical: Sizes.fixPadding * 0.7,
          }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
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
            source={{
              uri:
                api_url +
                'uploads/images/img/' +
                remedyData?.images[index].image,
            }}
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
          data={remedyData?.images}
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

export default connect(mapStateToProps, null)(RemedyBookingDetails);

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
