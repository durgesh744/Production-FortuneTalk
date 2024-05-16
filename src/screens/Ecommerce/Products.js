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
  base_url,
  category_pooja_list,
  img_url_3,
  post_mall_sub_category,
} from '../../config/constants';
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

const Products = ({navigation, route}) => {
  const [state, setState] = useState({
    categoryData: route.params?.categoryData,
    screeType: route.params?.categoryData?.name,
    productData: null,
    baseData: null,
    searchText: '',
    isLoading: false,
  });

  useEffect(() => {
    get_products();
  }, []);

  const get_products = async () => {
    updateState({isLoading: true});
    await axios({
      method: 'post',
      url: api_url + post_mall_sub_category,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        category_id: categoryData?.id,
      },
    })
      .then(res => {
        updateState({isLoading: false});
        if (res.data.status) {
          updateState({productData: res.data.data, baseData: res.data.data});
        }
      })
      .catch(err => {
        updateState({isLoading: false});
        console.log(err);
      });
  };

  const search_product = text => {
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource and update FilteredDataSource
      const newData = baseData.filter(function (item) {
        // Applying filter for the inserted text in search bar
        const itemData = item.title
          ? item.title.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      updateState({productData: newData, searchText: text })
    } else {
      updateState({productData: baseData, searchText: text })
    }
  };

  const updateState = data => {
    setState(prevState => {
      const newData = {...prevState, ...data};
      return newData;
    });
  };

  const {categoryData, screeType, productData, isLoading, baseData, searchText} = state;

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
              {productData && productsInfo()}
            </>
          }
          contentContainerStyle={{paddingVertical: Sizes.fixPadding}}
        />
      </View>
    </View>
  );

  function productsInfo() {
    const renderItem = ({item, index}) => {
      return (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() =>
            navigation.navigate('productDetailes', {productData: item, title: screeType, category_id: categoryData?.id})
          }
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
            source={{uri: base_url + 'admin/' + item?.image}}
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
                  {item?.title}
                </Text>
                <Text
                  style={{
                    ...Fonts.white11InterMedium,
                    fontSize: 9,
                    flex: 0.4,
                    textAlign: 'right',
                  }}>
                  ₹ {item.price}/-
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
          data={productData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={{}}
          columnWrapperStyle={{justifyContent: 'space-evenly'}}
          ListEmptyComponent={<NoDataFound/>}
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
            source={{uri: base_url + 'admin/' + categoryData.banner}}
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
          onChangeText={text=>search_product(text)}
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

export default Products;

const styles = StyleSheet.create({
  row: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
