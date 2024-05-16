import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {ApiRequest} from '../config/api_requests';
import { all_online_astro_list, api_url} from '../config/constants';
import {connect} from 'react-redux';
import {SCREEN_WIDTH} from '../config/Screen';
import {Colors, Fonts, Sizes} from '../assets/style';
import Stars from 'react-native-stars';
import {calculate_discount_price, sum_price} from '../methods/calculatePrice';
import MyHeader from '../components/MyHeader';
import Loader from '../components/Loader';
import NoDataFound from '../components/NoDataFound';
import Ionicons from 'react-native-vector-icons/Ionicons'

const OnlineAstrologers = ({navigation, userData}) => {
  const [state, setState] = useState({
    isLoading: false,
    astrologerData: null,
  });

  useEffect(() => {
    get_online_astrologer();
  }, []);

  const get_online_astrologer = async () => {
    try {
      updateState({isLoading: true});
      console.log(api_url + all_online_astro_list)
      const response = await ApiRequest.postRequest({
        url: api_url + all_online_astro_list,
        data: {customer_id: userData?.id},
      });

      if(response?.status){
        updateState({astrologerData: response?.data})
      }else{
        updateState({astrologerData: []})
      }

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

  const {isLoading, astrologerData} = state;

  const renderItem = ({item, index}) => {
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
          style={{width: '100%', height: 50}}>
          <Image
            source={{uri: item?.image}}
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
          <Text numberOfLines={1} style={{...Fonts.black14InterMedium}}>
            {item?.owner_name}
          </Text>
          <Text numberOfLines={1} style={{...Fonts.black12RobotoRegular}}>
            ({item?.mainexperties})
          </Text>
          <Text numberOfLines={1} style={{...Fonts.black11InterMedium}}>
            {item?.language}
          </Text>
          <Text
            style={{
              ...Fonts.black11InterMedium,
              marginTop: Sizes.fixPadding * 0.2,
            }}>
            ₹{chat_price(item)}/min
            {item?.Offer_list.length != 0 && (
              <Text style={{fontSize: 9, textDecorationLine: 'line-through'}}>
                {' '}
                ₹
                {sum_price({
                  firstPrice: parseFloat(item?.chat_price_m),
                  secondPrice: parseFloat(item?.chat_commission),
                })}
              </Text>
            )}
            {item?.moa == '1' && (
              <Text style={{fontSize: 9, color: Colors.primaryLight}}>
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
              <Text style={{...Fonts.primaryDark11InterMedium}}>Consult Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.bodyColor,
      }}>
      <MyHeader title={'Online Astrologers'} navigation={navigation} />
      <Loader visible={isLoading} />
      {astrologerData && (
        <FlatList
          data={astrologerData}
          renderItem={renderItem}
          numColumns={2}
          contentContainerStyle={{padding: Sizes.fixPadding * 1.5}}
          ListEmptyComponent={<NoDataFound />}
        />
      )}
    </View>
  );
};

const mapStateToProps = state => ({
  userData: state.user.userData,
  wallet: state.user.wallet,
});

export default connect(mapStateToProps, null)(OnlineAstrologers);

const styles = StyleSheet.create({
  row: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
