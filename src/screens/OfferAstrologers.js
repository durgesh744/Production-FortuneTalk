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
import MyStatusBar from '../components/MyStatusBar';
import {SCREEN_WIDTH} from '../config/Screen';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import {api_url, chat_call_discount_astro_list} from '../config/constants';
import Loader from '../components/Loader';
import NoDataFound from '../components/NoDataFound';

const OfferAstrologers = ({navigation}) => {
  const [state, setState] = useState({
    isLoading: false,
    offerAstroData: null,
  });

  useEffect(() => {
    get_offer_astrologers();
  }, []);

  const get_offer_astrologers = async () => {
    updateState({isLoading: true});
    await axios({
      method: 'get',
      url: api_url + chat_call_discount_astro_list,
    })
      .then(res => {
        updateState({isLoading: false});
        if (res.data.status == '1') {
          updateState({offerAstroData: res.data.records});
        }
      })
      .catch(err => {
        updateState({isLoading: false});
        console.log(err);
      });
  };

  const updateState = data => {
    setState(prevState => {
      const newData = {...prevState, ...data};
      return newData;
    });
  };

  const {isLoading, offerAstroData} = state;

  return (
    <View style={{flex: 1, backgroundColor: Colors.bodyColor}}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      <Loader visible={isLoading} />
      {header()}
      <View style={{flex: 1}}>
        <FlatList
          ListHeaderComponent={<>{offerAstroData && otherAstrologerInfo()}</>}
        />
      </View>
    </View>
  );

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

      return parseFloat(actual_price - (actual_price * parseFloat(item?.discount)) / 100).toFixed(1);
    };
    const renderItem = ({item, index}) => {
      return (
        <View
          style={{
            borderRadius: Sizes.fixPadding,
            overflow: 'hidden',
            elevation: 5,
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.2,
            marginBottom: Sizes.fixPadding * 2,
            shadowColor: Colors.black,
            backgroundColor: Colors.whiteDark,
          }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('astrologerDetailes', {data: item?.astro_id})}
            style={{}}>
            <View
              style={{
                width: '100%',
                height: 60,
                position: 'absolute',
                backgroundColor: Colors.primaryLight,
                justifyContent: 'center',
                alignItems:'center'
              }}>
                <Text style={{...Fonts.white18RobotMedium, fontSize: 22}}>{item?.offer_name}</Text>
              </View>
            <View
              style={{
                ...styles.row,
                justifyContent: 'space-between',
                paddingHorizontal: Sizes.fixPadding * 0.5,
                marginTop: Sizes.fixPadding * 5,
                alignItems: 'flex-end',
                marginBottom: Sizes.fixPadding,
              }}>
              <View
                style={{
                  flex: 0.4,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={{uri: item?.image}}
                  style={{
                    width: SCREEN_WIDTH * 0.16,
                    height: SCREEN_WIDTH * 0.16,
                    borderRadius: 1000,
                    borderWidth: 1,
                    borderColor: Colors.white,
                  }}
                />
                <Text style={{...Fonts.black11InterMedium}}>{item?.owner_name}</Text>
                <Text
                  numberOfLines={3}
                  style={{
                    ...Fonts.black11InterMedium,
                    fontSize: 9,
                    textAlign: 'center',
                  }}>
                  ({item?.mainexperties})
                </Text>
              </View>
              <View style={{marginBottom: Sizes.fixPadding * 0.5}}>
                  <Text style={{...Fonts.primaryLight18RobotoMedium, fontSize: 24, textAlign: 'center'}}>
                    ₹{discounted_price(item)}
                    <Text
                      style={{
                        ...Fonts.gray12RobotoMedium,
                        textDecorationLine: 'line-through',
                      }}>
                      {'\n'}
                      ₹{total_price(item)}{' '}
                    </Text>
                  </Text>
                </View>
              <View
                style={{
                  flex: 0.4,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={require('../assets/images/gift.png')}
                  style={{
                    width: SCREEN_WIDTH * 0.1,
                    height: SCREEN_WIDTH * 0.1,
                    borderRadius: 1000,
                    borderWidth: 1,
                    borderColor: Colors.white,
                    marginBottom: Sizes.fixPadding * 0.5,
                  }}
                />
                <LinearGradient
                  colors={[Colors.primaryLight, Colors.primaryDark]}
                  style={{borderRadius: Sizes.fixPadding}}>
                  <TouchableOpacity
                    style={{
                      paddingHorizontal: Sizes.fixPadding * 0.5,
                      paddingVertical: Sizes.fixPadding * 0.2,
                    }}>
                    <Text style={{...Fonts.white11InterMedium, fontSize: 9}}>
                      Get Offer now
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>
                <Text style={{...Fonts.gray11RobotoRegular, fontSize: 9}}>
                  Get 5 min free Sessions
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      );
    };
    return (
      <View style={{marginHorizontal: Sizes.fixPadding * 2}}>
        <FlatList
          data={offerAstroData}
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
          Offer Astrologer
        </Text>
      </View>
    );
  }
};

export default OfferAstrologers;

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
