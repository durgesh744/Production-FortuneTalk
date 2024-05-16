import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  ImageBackground,
  BackHandler,
  RefreshControl,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Colors, Fonts, Sizes} from '../assets/style';
import MyStatusBar from '../components/MyStatusBar';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import {SCREEN_WIDTH} from '../config/Screen';
import Stars from 'react-native-stars';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Input} from '@rneui/themed';
import MyHeader from '../components/MyHeader';
import {ApiRequest} from '../config/api_requests';
import {api_url, search_astrologer} from '../config/constants';

let timeout;

const SearchAstrologers = ({navigation, route}) => {
  const [state, setState] = useState({
    astrologerData: [],
    baseData: route?.params?.astrologerData,
    searchText: '',
  });

  const search_astrologers = text => {
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource and update FilteredDataSource
      const newData = baseData.filter(function (item) {
        // Applying filter for the inserted text in search bar
        const itemData = item.owner_name
          ? item.owner_name.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      updateState({astrologerData: newData, searchText: text});
    } else {
      updateState({astrologerData: [], searchText: text});
    }
  };

  const onSearchAstro = async search => {
    try {
      clearTimeout(timeout)
      updateState({searchText: search})
      timeout = setTimeout(async () => {
        const response = await ApiRequest.postRequest({
          url: api_url + search_astrologer,
          header: 'json',
          data: {
            title: search,
          },
        });
        if(response?.status){
          updateState({astrologerData: response?.result})
        }
      }, 2000);
    } catch (e) {
      console.log(e);
    }
  };

  const updateState = data => {
    setState(prevState => {
      const newData = {...prevState, ...data};
      return newData;
    });
  };

  const {astrologerData, baseData, searchText} = state;

  return (
    <View style={{flex: 1, backgroundColor: Colors.bodyColor}}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      <View style={{flex: 1}}>
        {header()}
        {searchInfo()}
        <FlatList
          ListHeaderComponent={<>{onlineAstrologerInfo()}</>}
          contentContainerStyle={{paddingBottom: Sizes.fixPadding * 8}}
        />
      </View>
    </View>
  );

  function onlineAstrologerInfo() {
    const chat_price = (chat_price_m, chat_commission) =>
      parseFloat(chat_price_m) + parseFloat(chat_commission);

    const renderItem = ({item, index}) => {
      return (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('astrologerDetailes', {
              data: item?.id,
            })
          }
          activeOpacity={0.8}
          style={{
            width: SCREEN_WIDTH * 0.435,
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
            backgroundColor: Colors.grayLight,
            alignItems: 'center',
          }}>
          <ImageBackground
            source={require('../assets/images/background_1.png')}
            style={{width: '100%', height: 50}}>
            <Image
              source={{uri: item.image}}
              style={{
                width: SCREEN_WIDTH * 0.15,
                height: SCREEN_WIDTH * 0.15,
                borderRadius: 1000,
                alignSelf: 'center',
                borderWidth: 2,
                borderColor: Colors.white,
                marginVertical: Sizes.fixPadding * 0.5,
                position: 'absolute',
                bottom: -15,
                zIndex: 2,
              }}
            />
            <Image
              source={require('../assets/images/icons/verify.png')}
              style={{
                width: 30,
                height: 30,
                zIndex: 99,
                position: 'absolute',
                alignSelf: 'center',
                bottom: -17,
                zIndex: 2,
              }}
            />
          </ImageBackground>

          <View
            style={{
              width: '100%',
              // paddingHorizontal: Sizes.fixPadding * 0.3,
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: Sizes.fixPadding * 2,
              zIndex: -1,
            }}>
            <Stars
              default={4}
              count={5}
              half={true}
              starSize={14}
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
              // halfStar={<Icon name={'star-half'} style={[styles.myStarStyle]} />}
            />
            <Text numberOfLines={1} style={{...Fonts.black14InterMedium}}>
              {item.owner_name}
            </Text>
            <Text style={{...Fonts.gray9RobotoRegular}}>
              {item.experties && `(${item.experties})`}
            </Text>
            <Text style={{...Fonts.gray9RobotoRegular}}>{item.language}</Text>
            {/* <View style={{...styles.row, marginTop: Sizes.fixPadding * 0.2}}>
              <Ionicons name="call-outline" color={Colors.black} size={16} />
              <Text
                style={{
                  ...Fonts.black11InterMedium,
                  marginLeft: Sizes.fixPadding * 0.5,
                }}>
                ₹{chat_price(item?.chat_price_m, item?.chat_commission)}/min
              </Text>
            </View> */}
          </View>
        </TouchableOpacity>
      );
    };
    return (
      <View
        style={{
          marginTop: Sizes.fixPadding,
        }}>
        <FlatList
          data={astrologerData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={{paddingRight: Sizes.fixPadding * 1.5}}
        />
      </View>
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
          ...styles.row,
        }}>
        <Input
          value={searchText}
          autoFocus
          placeholder={`Astrologer search... `}
          placeholderTextColor={Colors.gray}
          onChangeText={text => onSearchAstro(text)}
          inputStyle={{...Fonts.black14InterMedium}}
          containerStyle={{
            height: 36,
            flex: 1,
            flexGrow: 1.3,
          }}
          inputContainerStyle={{
            borderBottomWidth: 0,
            margin: 0,
            padding: 0,
            paddingVertical: 0,
            paddingTop: 0,
            backgroundColor: Colors.grayLight + '90',
            borderRadius: 1000,
            paddingHorizontal: Sizes.fixPadding,
            height: 36,
          }}
        />
        {/* <TouchableOpacity style={{flex: 0.2, marginLeft: Sizes.fixPadding}}>
              <Image
                source={require('../assets/images/icons/filter.png')}
                style={{width: 20, height: 20}}
              />
            </TouchableOpacity> */}
      </View>
    );
  }

  function header() {
    return <MyHeader title={'Astrologer Search'} navigation={navigation} />;
  }
};

export default SearchAstrologers;

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
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    height: 30,
    borderRadius: 30,
    backgroundColor: Colors.grayLight,
  },
});
