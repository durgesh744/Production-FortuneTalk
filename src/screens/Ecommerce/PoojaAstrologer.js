import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors, Fonts, Sizes} from '../../assets/style';
import MyStatusBar from '../../components/MyStatusBar';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {FlatList} from 'react-native';
import {SCREEN_WIDTH} from '../../config/Screen';
import LinearGradient from 'react-native-linear-gradient';
import {Input} from '@rneui/themed';
import {
  api_url,
  category_pooja_list,
  img_url_2,
  img_url_3,
  schedule_a_pooja_id,
} from '../../config/constants';
import Loader from '../../components/Loader';
import axios from 'axios';
import MyHeader from '../../components/MyHeader';
import moment from 'moment';
import NoDataFound from '../../components/NoDataFound';

const data = [
  {
    id: 1,
    name: 'Pooja Kit',
    image: require('../../assets/images/ecommerce_1.png'),
  },
  {
    id: 2,
    name: 'Book a Pooja',
    image: require('../../assets/images/ecommerce_1.png'),
  },
  {
    id: 3,
    name: 'Gemstone',
    image: require('../../assets/images/ecommerce_3.png'),
  },
  {
    id: 4,
    name: 'Pooja Kit',
    image: require('../../assets/images/ecommerce_1.png'),
  },
  {
    id: 5,
    name: 'Gemstone',
    image: require('../../assets/images/ecommerce_3.png'),
  },
  {
    id: 6,
    name: 'Book a Pooja',
    image: require('../../assets/images/ecommerce_2.png'),
  },
  {
    id: 7,
    name: 'Book a Pooja',
    image: require('../../assets/images/ecommerce_2.png'),
  },
];

const PoojaAstrologer = ({navigation, route}) => {
  console.log(route.params?.pooja_id)
  const [state, setState] = useState({
    isLoading: false,
    astrologerData: null,
  });

  useEffect(() => {
    get_astrologers();
  }, []);

  const get_astrologers = async () => {
    updateState({isLoading: true});
    await axios({
      method: 'post',
      url: api_url + schedule_a_pooja_id,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        pooja_id: route.params?.pooja_id,
      },
    })
      .then(res => {
        console.log(res.data)
        updateState({isLoading: false});
        if (res.data.data) {
          updateState({astrologerData: res.data.data});
        }
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

  const {isLoading, astrologerData} = state;
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
              {bannerInfo()}
              {topMessageInfo()}
              {astrologerData && astrologerListInfo()}
            </>
          }
          contentContainerStyle={{paddingVertical: Sizes.fixPadding}}
        />
      </View>
    </View>
  );

  function astrologerListInfo() {
    const getDayPart = time => {
      // Create a Date object with the provided date and time
      const dateTime = new Date(time);

      // Get the hour from the Date object
      const hour = dateTime.getHours();

      // Determine the time of day based on the hour
      let timeOfDay;

      if (hour >= 5 && hour < 12) {
        timeOfDay = 'morning';
      } else if (hour >= 12 && hour < 17) {
        timeOfDay = 'afternoon';
      } else if (hour >= 17 && hour < 20) {
        timeOfDay = 'evening';
      } else if (hour >= 20 && hour < 24) {
        timeOfDay = 'night';
      } else if (hour >= 0 && hour < 5) {
        timeOfDay = 'midnight';
      }
      return timeOfDay;
    };

    const renderItem = ({item, index}) => {
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('poojaDetails', {poojaData: item, suggestedBy: item?.astro_id, poojaType: 0})}
          style={{
            borderRadius: Sizes.fixPadding,
            overflow: 'hidden',
            marginBottom: Sizes.fixPadding * 2,
            elevation: 8,
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.2,
            shadowColor: Colors.blackLight,
          }}>
          <ImageBackground
            source={{uri: img_url_3 + item?.image}}
            style={{
              width: '100%',
              height: SCREEN_WIDTH * 0.4,
            }}>
            <LinearGradient
              colors={[Colors.black, Colors.black + '00']}
              locations={[0.1, 1]}
              style={{width: '100%', height: '35%', padding: Sizes.fixPadding}}>
              <Text style={{...Fonts.white14RobotoMedium}}>{item?.title}</Text>
            </LinearGradient>
          </ImageBackground>
          <LinearGradient
            colors={[Colors.primaryLight, Colors.primaryDark]}
            style={{
              flex: 0,
              flexDirection: 'row',
              alignItems: 'center',
              padding: Sizes.fixPadding,
            }}>
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 1000,
                borderWidth: 2,
                overflow: 'hidden',
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
                source={{uri: img_url_2 + item?.img_url}}
                style={{width: '100%', height: '100%'}}
              />
            </View>
            <View style={{marginLeft: Sizes.fixPadding}}>
              <Text style={{...Fonts.white14RobotoMedium}}>
                {item?.owner_name}
              </Text>
              <Text style={{...Fonts.white12RobotoMedium}}>
              {moment(item.date).format('DD MMMM YYYY')}
              </Text>
            </View>
            <View style={{flex: 1}}>
              <View style={{alignSelf: 'flex-end', alignItems: 'center'}}>
                <Text style={{...Fonts.white11InterMedium}}>
                  {moment(item.time).format('hh:mm A')} ({getDayPart(item.time)}
                  )
                </Text>
                <TouchableOpacity
                  disabled
                  style={{
                    backgroundColor: Colors.white,
                    paddingHorizontal: Sizes.fixPadding,
                    borderRadius: 1000,
                    marginTop: Sizes.fixPadding * 0.3,
                  }}>
                  <Text style={{...Fonts.primaryDark11InterMedium}}>
                    Book Now
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      );
    };
    
    return (
      <View style={{marginHorizontal: Sizes.fixPadding * 1.5}}>
        <FlatList
          data={astrologerData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          ListEmptyComponent={<NoDataFound />}
        />
      </View>
    );
  }

  function topMessageInfo() {
    return (
      <View style={{margin: Sizes.fixPadding * 2}}>
        <Text style={{...Fonts.gray14RobotoMedium, textAlign: 'center'}}>
          Astrologers list with their available date and time for pooja.
        </Text>
      </View>
    );
  }

  function bannerInfo() {
    return (
      <View
        style={{
          borderBottomWidth: 1,
          borderColor: Colors.grayLight,
          paddingBottom: Sizes.fixPadding,
        }}>
        <View
          style={{
            marginHorizontal: Sizes.fixPadding * 1.5,
            borderRadius: Sizes.fixPadding,
            overflow: 'hidden',
          }}>
          <Image
            source={require('../../assets/images/ecommerce_banner.png')}
            style={{width: '100%', height: 100, resizeMode: 'cover'}}
          />
        </View>
      </View>
    );
  }

  function header() {
    return <MyHeader title={'Astrologer List'} navigation={navigation} />;
  }
};

export default PoojaAstrologer;
