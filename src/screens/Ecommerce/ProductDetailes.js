import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import MyStatusBar from '../../components/MyStatusBar';
import {Colors, Fonts, Sizes} from '../../assets/style';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {SCREEN_WIDTH} from '../../config/Screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Stars from 'react-native-stars';
import LinearGradient from 'react-native-linear-gradient';
import {api_url, base_url, get_pro_review} from '../../config/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MyMethods} from '../../methods/my_methods';
import { showToastWithGravityAndOffset } from '../../methods/toastMessage';
import axios from 'axios';

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

const ProductDetailes = ({navigation, route}) => {
  const [ review, setreview] = useState(null);
  const [state, setState] = useState({
    productData: route?.params?.productData,
    isLoading: false,
  });

  useEffect(() => {
    check_is_suggested_persent();
    Review();
  }, []);

  const check_is_suggested_persent = async () => {
    try {
      const data = await AsyncStorage.getItem('eCommerceCart');
      const eCommerceCart = JSON.parse(data);
      if (route?.params?.suggestedBy) {
        await AsyncStorage.removeItem('eCommerceCart');
      } else {
        const newList = eCommerceCart.filter(
          sub_item =>
            typeof sub_item?.suggestedBy == 'undefined' ||
            route?.params?.suggestedBy == '',
        );
        if(newList.length != 0){
          await AsyncStorage.setItem('eCommerceCart', JSON.stringify(newList));
        }else{
          await AsyncStorage.removeItem('eCommerceCart');
        }
  
      }
    } catch (e) {
      console.log(e);
      return [];
    }
  };

  const Review = async () => {
    await axios({
      method: 'get',
      url: api_url + get_pro_review, // Add quotation marks around the variable
    })
      .then(res => {
        setreview(res.data.data);
      })
      .catch(err => {
        console.log(err);
      });
  };
 console.log(review   )  
  const updateState = data => {
    setState(prevState => {
      const newData = {...prevState, ...data};
      return newData;
    });
  };

  const {productData, isLoading} = state;

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
              {productInfo()}
              {benefitsInfo()}
              {reviewInfo()}
              {bookNowButtonInfo()}
            </>
          }
          contentContainerStyle={{paddingVertical: Sizes.fixPadding}}
        />
      </View>
    </View>
  );

  function bookNowButtonInfo() {

    const add_product_to_cart = async item => {
      const data = await AsyncStorage.getItem('eCommerceCart');
      const eCommerceCart = JSON.parse(data);
      if (eCommerceCart) {
        let x = true;
        const newList = eCommerceCart.map(sub_item => {
          if (sub_item.id === item.id) {
            x = false;
            const updatedItem = {
              ...sub_item,
              qty: sub_item.qty + 1,
            };
            return updatedItem;
          }
          return {...sub_item};
        });

        if (x) {
          let cart = {
            ...item,
            qty: 1,
            category_id: route?.params?.category_id,
          };
          newList.push(cart);
        }
        await AsyncStorage.setItem('eCommerceCart', JSON.stringify(newList));
        updateState({cartData: newList});
        navigation.navigate('cart');
      } else {
        let arr = [];
        let cart = {
          ...item,
          qty: 1,
          category_id: route?.params?.category_id,
          suggestedBy: route?.params?.suggestedBy ?? '',
        };
        arr.push(cart);
        await AsyncStorage.setItem('eCommerceCart', JSON.stringify(arr));
        navigation.navigate('cart');
      }
    };
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => add_product_to_cart(productData)}
        style={{
          marginHorizontal: Sizes.fixPadding * 4,
          marginVertical: Sizes.fixPadding,
          borderRadius: Sizes.fixPadding * 1.5,
          overflow: 'hidden',
        }}>
        <LinearGradient
          colors={[Colors.primaryLight, Colors.primaryDark]}
          style={{paddingVertical: Sizes.fixPadding}}>
          <Text style={{...Fonts.white16RobotoMedium, textAlign: 'center'}}>
            Book Now
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  function reviewInfo() {
    const renderItem = ({item, index}) => {
      return (
        <TouchableOpacity
          activeOpacity={1}
          style={{
            width: '100%',
            borderRadius: Sizes.fixPadding,
            overflow: 'hidden',
            borderColor: Colors.primaryLight,
            elevation: 5,
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.2,
            marginBottom: Sizes.fixPadding * 1.5,
            shadowColor: Colors.blackLight,
            backgroundColor: Colors.white,
            padding: Sizes.fixPadding * 0.8,
          }}>
          <View style={{...styles.row}}>
            <Image
              source={require('../../assets/images/logo_icon.png') }
              style={{
                width: 25,
                height: 25,
                borderRadius: 100,
              }}
            />
            <Text
              style={{
                ...Fonts.gray11RobotoRegular,
                marginLeft: Sizes.fixPadding * 0.5,
              }}>
              {item.customer_name}
            </Text>
            <View style={{marginLeft: Sizes.fixPadding * 1.5}}>
              <Stars
                default={4}
                count={item.rating}
                half={true}
                starSize={9}
                fullStar={
                  <Ionicons
                    name={'star'}
                    size={9}
                    color={Colors.primaryLight}
                  />
                }
                emptyStar={
                  <Ionicons
                    name={'star-outline'}
                    size={9}
                    color={Colors.primaryLight}
                  />
                }
                // halfStar={<Icon name={'star-half'} style={[styles.myStarStyle]} />}
              />
            </View>
          </View>
          <Text numberOfLines={5} style={{...Fonts.gray11RobotoRegular}}>
            {item.comment}
          </Text>
        </TouchableOpacity>
      );
    };
    return (
      <View
        style={{
          marginTop: Sizes.fixPadding * 1.5,
          marginHorizontal: Sizes.fixPadding * 2,
        }}>
        <Text
          style={{
            ...Fonts.black18RobotoRegular,
            marginBottom: Sizes.fixPadding,
          }}>
          Customer Reviews
        </Text>
        <FlatList
          data={review}
          renderItem={renderItem}
          keyExtractor={item => review.id}
        />
      </View>
    );
  }

  function benefitsInfo() {
    return (
      <View
        style={{
          paddingHorizontal: Sizes.fixPadding * 2,
          paddingVertical: Sizes.fixPadding * 1.5,
          borderBottomColor: Colors.grayLight,
          borderBottomWidth: 1,
        }}>
        <Text style={{...Fonts.black18RobotoRegular}}>Description</Text>
        <Text
          style={{
            ...Fonts.gray14RobotoMedium,
            fontSize: 13,
          }}>
          {productData?.description}
        </Text>
      </View>
    );
  }

  function productInfo() {
    return (
      <View
        style={{
          paddingHorizontal: Sizes.fixPadding * 2,
          paddingBottom: Sizes.fixPadding * 1.5,
          borderBottomColor: Colors.grayLight,
          borderBottomWidth: 1,
        }}>
        <Text style={{...Fonts.primaryLight18RobotoMedium}}>
          {route?.params?.title}
        </Text>
        <Text style={{...Fonts.gray14RobotoMedium, fontSize: 13}}>
          {productData?.short_desc}
        </Text>
        <Text style={{...Fonts.black16RobotoMedium}}>
          ₹ {productData?.dicount_price}{' '}
          <Text
            style={{
              ...Fonts.gray16RobotoMedium,
              textDecorationLine: 'line-through',
            }}>
            {' '}
            ₹ {productData?.price}{' '}
          </Text>{' '}
          <Text style={{...Fonts.white14RobotoMedium, color: Colors.red_a}}>
            {MyMethods.getPercentageData({
              principalAmount: productData?.price,
              discountAmount: productData?.dicount_price,
            })}
            % Off
          </Text>
        </Text>
      </View>
    );
  }

  function bannerInfo() {
    return (
      <View
        style={{
          margin: Sizes.fixPadding * 2,
          marginTop: Sizes.fixPadding,
          borderRadius: Sizes.fixPadding,
          overflow: 'hidden',
        }}>
        <Image
          source={{uri: base_url + 'admin/' + productData?.image}}
          style={{
            width: '100%',
            height: SCREEN_WIDTH * 0.6,
            resizeMode: 'cover',
          }}
        />
      </View>
    );
  }

  function header() {
    const on_cart_press = ()=>{
      if(MyMethods.check_is_cart_empty()){
        navigation.navigate('cart')
      }else{
        showToastWithGravityAndOffset('Your cart is empty.')
      }
    }
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
          Product details
        </Text>
        <TouchableOpacity
        activeOpacity={0.8}
        onPress={()=>on_cart_press()}
        >
          <Image
            source={require('../../assets/images/icons/cart.png')}
            style={{width: 22, height: 22}}
          />
        </TouchableOpacity>
      </View>
    );
  }
};

export default ProductDetailes;

const styles = StyleSheet.create({
  row: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 3,
    backgroundColor: Colors.gray,
    bottom: -Sizes.fixPadding * 0.7,
  },
});
