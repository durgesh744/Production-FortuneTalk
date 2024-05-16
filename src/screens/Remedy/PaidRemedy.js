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
import axios from 'axios';
import { api_url, img_url_2, remedy_list } from '../../config/constants';
import Loader from '../../components/Loader';


const PaidRemedy = ({navigation, route}) => {
  const [state, setState] = useState({
    isLoading: false,
    remedyData: null
  });

  useEffect(()=>{
    get_remedy()
  }, [])

  const get_remedy = async()=>{
    updateState({isLoading: true})
    await axios({
      method: 'post',
      url: api_url + remedy_list,
      headers: {
        'Content-Type':'multipart/form-data'
      },
      data:{
        remedy_id: route?.params?.remedy_id
      }
    }).then(res=>{
      console.log(res.data)
      updateState({isLoading: false})
      if(res.data.status){
        updateState({remedyData: res.data.data[0]})
      }
      // console.log(res.data)
    }).catch(err=>{
      updateState({isLoading: false})
      console.log(err)
    })
  }

  const updateState = data => {
    setState(prevState => {
      const newData = {...prevState, ...data};
      return newData;
    });
  };

  const {isLoading, remedyData} = state;

  return (
    <View style={{flex: 1, backgroundColor: Colors.bodyColor}}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      <Loader visible={isLoading} />
      <View style={{flex: 1}}>
        {header()}
        <FlatList
          ListHeaderComponent={
            <>
              {remedyData && bannerInfo()}
              {remedyData && remediesInfo()}
              {descriptionInfo()}
              {astrologerInfo()}
              {continueButtonInfo()}
            </>
          }
          contentContainerStyle={{paddingVertical: Sizes.fixPadding}}
        />
      </View>
    </View>
  );

  function continueButtonInfo() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={()=>navigation.navigate('remedyBookingDetails', {
          remedyData: remedyData
        })}
        style={{
          marginHorizontal: Sizes.fixPadding * 4,
          marginVertical: Sizes.fixPadding,
          borderRadius: 1000,
          overflow: 'hidden',
        }}>
        <LinearGradient
          colors={[Colors.primaryLight, Colors.primaryDark]}
          style={{paddingVertical: Sizes.fixPadding}}>
          <Text style={{...Fonts.white18RobotMedium, textAlign: 'center'}}>
            Book Now
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  function astrologerInfo() {
    return (
      <View
        style={{
          padding: Sizes.fixPadding * 1.5,
          borderBottomWidth: 1,
          borderBottomColor: Colors.grayLight,
        }}>
        <Text style={{...Fonts.black18RobotoRegular}}>Astrologer Name</Text>
        <View
          style={[
            styles.row,
            {
              backgroundColor: Colors.white,
              elevation: 5,
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.2,
              alignSelf: 'flex-start',
              padding: Sizes.fixPadding,
              borderRadius: Sizes.fixPadding,
              shadowColor: Colors.blackLight,
              marginTop: Sizes.fixPadding
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
          <Text style={{...Fonts.black16RobotoMedium, marginLeft: Sizes.fixPadding}}>{remedyData?.owner_name}</Text>
        </View>
      </View>
    );
  }

  function descriptionInfo() {
    return (
      <View
        style={{
          padding: Sizes.fixPadding * 1.5,
          borderBottomWidth: 1,
          borderBottomColor: Colors.grayLight,
        }}>
        <Text style={{...Fonts.black18RobotoRegular}}>Description</Text>
        <Text
          style={{
            ...Fonts.gray14RobotoMedium,
            marginVertical: Sizes.fixPadding * 0.7,
          }}>
            {remedyData?.des}
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
        <Text style={{...Fonts.primaryLight18RobotoMedium}}>{remedyData?.product_name}</Text>
        <Text
          style={{
            ...Fonts.gray14RobotoMedium,
            fontSize: 13,
            marginVertical: Sizes.fixPadding * 0.7,
          }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </Text>
        <Text style={{...Fonts.black16RobotoMedium}}>
          ₹ {remedyData?.price}{' '}
          {/* <Text
            style={{
              ...Fonts.gray16RobotoMedium,
              textDecorationLine: 'line-through',
            }}>
            {' '}
            7500{' '}
          </Text>{' '}
          <Text style={{...Fonts.white14RobotoMedium, color: Colors.red}}>
            20% Off
          </Text> */}
        </Text>
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
            source={{uri: api_url + 'uploads/images/img/' + remedyData?.images[index].image}}
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
            // progressValue.value = absoluteProgress;
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
        <TouchableOpacity
          onPress={() => navigation.goBack()}
>
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
          Book Remedies
        </Text>
      </View>
    );
  }
};

export default PaidRemedy;
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
