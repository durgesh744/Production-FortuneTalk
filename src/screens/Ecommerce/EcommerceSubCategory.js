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
import { api_url, category_pooja_list, img_url_3 } from '../../config/constants';
import Loader from '../../components/Loader';
import axios from 'axios';
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

const EcommerceSubCategory = ({navigation, route}) => {
  const [state, setState] = useState({
    categoryData: route.params?.categoryData,
    screeType: route.params?.categoryData?.name.toLowerCase(),
    poojaData: null,
    isLoading: false
  });

  useEffect(()=>{
    if(screeType == 'book a pooja'){
      get_pooja()
    }
  },[])

  const get_pooja = async () => {
    updateState({isLoading: true});
    await axios({
      method: 'get',
      url: api_url + category_pooja_list,
    })
      .then(res => {
        updateState({isLoading: false});
        if (res.data.status) {
          updateState({poojaData: res.data.data});
        }
      })
      .catch(err => {
        updateState({isLoading: false});
        console.log(err);
      });
  };

  const search_product = (search)=>{
    
  }

  const updateState = data => {
    setState(prevState => {
      const newData = {...prevState, ...data};
      return newData;
    });
  };

  const {categoryData, screeType, poojaData, isLoading} = state;

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
              {searchInfo()}
              {bannerInfo()}
              {categoryData?.name.toLowerCase() == 'spell'
                ? spellInfo()
                : categoryData?.name.toLowerCase() == 'book a pooja'
                ? poojaData && bookAPoojaInfo()
                : categoryData?.name.toLowerCase() == 'gemstone'
                ? gemstoneInfo()
                : eCommerceDataInfo()}
            </>
          }
          contentContainerStyle={{paddingVertical: Sizes.fixPadding}}
        />
      </View>
    </View>
  );

  function eCommerceDataInfo() {
    const renderItem = ({item, index}) => {
      return (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => navigation.navigate('productDetailes')}
          style={{
            width: SCREEN_WIDTH * 0.45,
            borderRadius: Sizes.fixPadding,
            overflow: 'hidden',
            marginBottom: Sizes.fixPadding * 1.5,
            padding: Sizes.fixPadding * 0.5,
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: Sizes.fixPadding * 2,
          }}>
          <View
            style={{
              width: '90%',
              height: SCREEN_WIDTH * 0.4,
              borderTopLeftRadius: Sizes.fixPadding,
              borderTopRightRadius: Sizes.fixPadding,
              elevation: 5,
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.2,
            }}>
            <Image
              source={item.image}
              style={{
                width: '100%',
                height: '100%',
              }}
            />
          </View>

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
            <Text style={{...Fonts.black14InterMedium, textAlign: 'center'}}>
              {item.name}
            </Text>
          </View>
        </TouchableOpacity>
      );
    };
    return (
      <View>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={{}}
          columnWrapperStyle={{justifyContent: 'space-evenly'}}
        />
      </View>
    );
  }

  function gemstoneInfo() {
    const renderItem = ({item, index}) => {
      return (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => navigation.navigate('productDetailes')}
          style={{
            width: SCREEN_WIDTH * 0.37,
            height: SCREEN_WIDTH * 0.4,
            borderRadius: Sizes.fixPadding,
            overflow: 'hidden',
            marginBottom: Sizes.fixPadding * 1.5,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 3,
            borderColor: Colors.primaryLight,
          }}>
          <ImageBackground
            source={item.image}
            resizeMode="cover"
            style={{
              width: '100%',
              height: '100%',
            }}>
            <LinearGradient
              colors={[Colors.black + '00', Colors.black, Colors.black]}
              locations={[0.5, 1, 1]}
              style={{
                width: '100%',
                height: '100%',
                justifyContent: 'flex-end',
              }}>
              <View
                style={[
                  styles.row,
                  {
                    justifyContent: 'space-between',
                    padding: Sizes.fixPadding * 0.4,
                  },
                ]}>
                <Text
                  style={{...Fonts.white11InterMedium, fontSize: 9, flex: 0.6}}>
                  Love Honey Spell
                </Text>
                <Text
                  style={{
                    ...Fonts.white11InterMedium,
                    fontSize: 9,
                    flex: 0.4,
                    textAlign: 'right',
                  }}>
                  ₹ 501/-
                </Text>
              </View>
            </LinearGradient>
          </ImageBackground>
        </TouchableOpacity>
      );
    };
    return (
      <View>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={{}}
          columnWrapperStyle={{justifyContent: 'space-evenly'}}
        />
      </View>
    );
  }

  function bookAPoojaInfo() {
    const renderItem = ({item, index}) => {
      return (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => navigation.navigate('poojaAstrologer', {pooja_id: item.id})}
          style={{
            height: SCREEN_WIDTH * 0.5,
            borderRadius: Sizes.fixPadding,
            overflow: 'hidden',
            marginBottom: Sizes.fixPadding * 1.5,
          }}>
          <ImageBackground
            source={{uri: img_url_3 + item.image}}
            style={{
              width: '100%',
              height: '100%',
            }}
            resizeMode="cover">
            <LinearGradient
              colors={[Colors.black + '00', Colors.black]}
              style={{
                width: '100%',
                height: '100%',
                justifyContent: 'flex-end',
                padding: Sizes.fixPadding
              }}
              locations={[0.7, 1]}
              >
                <Text style={{...Fonts.white18RobotMedium}}>Attractive nsdfksdfsfs</Text>
                <Text style={{...Fonts.white14RobotoMedium}}>width Attractive nsdfksdfsfs</Text>
              </LinearGradient>
          </ImageBackground>
        </TouchableOpacity>
      );
    };
    return (
      <View style={{marginHorizontal: Sizes.fixPadding}}>
        <FlatList
          data={poojaData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </View>
    );
  }

  function spellInfo() {
    const renderItem = ({item, index}) => {
      return (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => navigation.navigate('productDetailes')}
          style={{
            width: SCREEN_WIDTH * 0.37,
            height: SCREEN_WIDTH * 0.4,
            borderRadius: Sizes.fixPadding,
            overflow: 'hidden',
            marginBottom: Sizes.fixPadding * 1.5,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 3,
            borderColor: Colors.primaryLight,
          }}>
          <ImageBackground
            source={item.image}
            resizeMode="cover"
            style={{
              width: '100%',
              height: '100%',
            }}>
            <LinearGradient
              colors={[Colors.black + '00', Colors.black, Colors.black]}
              locations={[0.5, 1, 1]}
              style={{
                width: '100%',
                height: '100%',
                justifyContent: 'flex-end',
              }}>
              <View
                style={[
                  styles.row,
                  {
                    justifyContent: 'space-between',
                    padding: Sizes.fixPadding * 0.4,
                  },
                ]}>
                <Text
                  style={{...Fonts.white11InterMedium, fontSize: 9, flex: 0.6}}>
                  Love Honey Spell
                </Text>
                <Text
                  style={{
                    ...Fonts.white11InterMedium,
                    fontSize: 9,
                    flex: 0.4,
                    textAlign: 'right',
                  }}>
                  ₹ 501/-
                </Text>
              </View>
            </LinearGradient>
          </ImageBackground>
        </TouchableOpacity>
      );
    };
    return (
      <View>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={{}}
          columnWrapperStyle={{justifyContent: 'space-evenly'}}
          ListEmptyComponent={<NoDataFound />}
        />
      </View>
    );
  }

  function bannerInfo() {
    return (
      <View
        style={{
          borderBottomWidth: 1,
          marginBottom: Sizes.fixPadding,
          borderColor: Colors.grayLight,
          borderTopWidth: 1,
          paddingTop: Sizes.fixPadding,
        }}>
        <View
          style={{
            marginHorizontal: Sizes.fixPadding * 1.5,
            marginBottom: Sizes.fixPadding,
            borderRadius: Sizes.fixPadding * 2,
            overflow: 'hidden',
          }}>
          <Image
            source={require('../../assets/images/ecommerce_banner.png')}
            style={{width: '100%', height: 110, resizeMode: 'cover'}}
          />
        </View>
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
          placeholder={`Search for ${categoryData?.name}`}
          placeholderTextColor={Colors.gray}
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
          rightIcon={
            <Image
              source={require('../../assets/images/icons/search.png')}
              style={{width: 20, height: 20}}
            />
          }
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
          style={{
            alignSelf: 'flex-start',
            // flex: 0.2,
          }}>
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
            // flex: 0.6,
          }}>
          {screeType}
        </Text>
        <TouchableOpacity>
          <Image
            source={require('../../assets/images/icons/cart.png')}
            style={{width: 22, height: 22}}
          />
        </TouchableOpacity>
      </View>
    );
  }
};

export default EcommerceSubCategory;

const styles = StyleSheet.create({
  row: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
