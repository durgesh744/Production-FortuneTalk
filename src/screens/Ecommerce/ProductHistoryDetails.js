import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import MyStatusBar from '../../components/MyStatusBar';
import {Colors, Fonts, Sizes} from '../../assets/style';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {SCREEN_WIDTH} from '../../config/Screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Stars from 'react-native-stars';
import LinearGradient from 'react-native-linear-gradient';
import {base_url} from '../../config/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MyMethods } from '../../methods/my_methods';
const ProductHistoryDetails = ({navigation, route}) => {
  const [state, setState] = useState({
    productData: route?.params?.productData,
    isLoading: false,
  });

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
              {bookNowButtonInfo()}
            </>
          }
          contentContainerStyle={{paddingVertical: Sizes.fixPadding}}
        />
      </View>
    </View>
  );

  function bookNowButtonInfo() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate('productTracking', {
            productData: {
              id: productData?.id,
              image: productData?.items[0]?.image
            },
          })
        }
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
            Track Order
          </Text>
        </LinearGradient>
      </TouchableOpacity>
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
          {productData?.items[0]?.description}
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
          {route?.params?.productData?.items[0]?.mc_name}
        </Text>
        <Text style={{...Fonts.gray14RobotoMedium, fontSize: 13}}>
              {productData?.items[0]?.title}
            </Text>
        <Text style={{...Fonts.black16RobotoMedium}}>
          ₹ {productData?.items[0]?.price}{' '}
          <Text
                style={{
                  ...Fonts.gray16RobotoMedium,
                  textDecorationLine: 'line-through',
                }}>
                {' '}
                7500{' '}
              </Text>{' '}
              <Text style={{...Fonts.white14RobotoMedium, color: Colors.red}}>
              {MyMethods.getPercentageData({
              principalAmount: productData?.items[0]?.price,
              discountAmount: productData?.items[0]?.dicount_price,
            })}% Off
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
          source={{
            uri: base_url + 'admin/' + productData?.items[0]?.image,
          }}
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

export default ProductHistoryDetails;

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
