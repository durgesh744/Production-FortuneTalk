import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors, Fonts, Sizes} from '../../assets/style';
import LinearGradient from 'react-native-linear-gradient';
import Loader from '../../components/Loader';
import axios from 'axios';
import {
  api_url,
  order_customer_pooja,
  product_purchase_history,
} from '../../config/constants';
import {connect} from 'react-redux';
import moment from 'moment';
import NoDataFound from '../../components/NoDataFound';

const Shopmail = ({navigation, userData}) => {
  const [state, setState] = useState({
    isLoading: false,
    shopmallData: null,
    isPooja: true,
    productData: null,
  });

  useEffect(() => {
    get_history();
  }, []);

  const get_history = async () => {
    try {
      updateState({isLoading: true});
      const poojaHistory = await axios({
        method: 'post',
        url: api_url + order_customer_pooja,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: {
          customer_id: userData?.id,
        },
      });

      const productHistory = await axios({
        method: 'post',
        url: api_url + product_purchase_history,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: {
          customer_id: userData?.id,
        },
      });

      updateState({
        shopmallData: poojaHistory.data.data,
        productData: productHistory.data.data,
        isLoading: false,
      });
    } catch (e) {
      updateState({isLoading: false});
      console.log(e);
    }
  };

  const updateState = data => {
    setState(prevState => {
      const newData = {...prevState, ...data};
      return newData;
    });
  };

  const {isLoading, shopmallData, isPooja, productData} = state;

  return (
    <View style={{flex: 1, backgroundColor: Colors.bodyColor}}>
      <Loader visible={isLoading} />
      {tabsInfo()}
      <FlatList
        ListHeaderComponent={
          <>
            {isPooja
              ? shopmallData && poojaHistoryInfo()
              : productData && productHistoryInfo()}
          </>
        }
      />
    </View>
  );

  function productHistoryInfo() {
    const renderItem = ({item, index}) => {
      return (
        <View
          style={{
            flex: 0,
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: Colors.white,
            borderRadius: Sizes.fixPadding,
            elevation: 5,
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.2,
            shadowColor: Colors.blackLight,
            padding: Sizes.fixPadding,
            marginHorizontal: Sizes.fixPadding * 1.5,
            marginBottom: Sizes.fixPadding,
          }}>
          <View style={{}}>
            <Text
              style={{...Fonts.gray16RobotoRegular, color: Colors.blackLight}}>
              Gemstone
            </Text>
            <Text
              style={{
                ...Fonts.gray14RobotoRegular,
                marginVertical: Sizes.fixPadding,
              }}>
              {moment(item.created_at).format('DD MMM YYYY, hh:mm A')}
            </Text>
            <Text style={{...Fonts.gray14RobotoRegular}}>
              Order No. {item?.transation_no}
            </Text>
          </View>
          <View
            style={{
              flex: 0,
              justifyContent: 'space-between',
              alignItems: 'flex-end',
            }}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('productHistoryDetails', {
                  productData: item,
                })
              }
              style={{
                backgroundColor: Colors.grayLight,
                paddingVertical: Sizes.fixPadding * 0.3,
                paddingHorizontal: Sizes.fixPadding,
                borderRadius: 1000,
              }}>
              <Text>Details</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate('productDetailes', {
                  productData: item?.items[0],
                  title: item?.items[0]?.mc_name,
                  category_id: item?.items[0]?.category_id
                })
              }>
              <LinearGradient
                colors={[Colors.primaryLight, Colors.primaryDark]}
                style={{
                  paddingVertical: Sizes.fixPadding * 0.5,
                  paddingHorizontal: Sizes.fixPadding,
                  borderRadius: 1000,
                }}>
                <Text style={{...Fonts.white14RobotoMedium}}>Order Again</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      );
    };
    return (
      <FlatList
        data={productData}
        renderItem={renderItem}
        contentContainerStyle={{paddingVertical: Sizes.fixPadding * 2}}
      />
    );
  }

  function poojaHistoryInfo() {
    const renderItem = ({item, index}) => {
      return (
        <View
          style={{
            flex: 0,
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: Colors.white,
            borderRadius: Sizes.fixPadding,
            elevation: 5,
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.2,
            shadowColor: Colors.blackLight,
            padding: Sizes.fixPadding,
            marginHorizontal: Sizes.fixPadding * 1.5,
            marginBottom: Sizes.fixPadding,
          }}>
          <View style={{}}>
            <Text
              style={{...Fonts.gray16RobotoRegular, color: Colors.blackLight}}>
              {item?.pooja_detail[0]?.category_pooja}
            </Text>
            <Text
              style={{
                ...Fonts.gray14RobotoRegular,
                marginVertical: Sizes.fixPadding,
              }}>
              {moment(item.booking_time).format('DD MMM YYYY, hh:mm A')}
            </Text>
            <Text style={{...Fonts.gray14RobotoRegular}}>
              Order No. {item.unique_id}
            </Text>
          </View>
          <View
            style={{
              flex: 0,
              justifyContent: 'space-between',
              alignItems: 'flex-end',
            }}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('poojaHistoryDetailes', {
                  poojaData: item,
                })
              }
              style={{
                backgroundColor: Colors.grayLight,
                paddingVertical: Sizes.fixPadding * 0.3,
                paddingHorizontal: Sizes.fixPadding,
                borderRadius: 1000,
              }}>
              <Text>Details</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('eCommerce')}>
              <LinearGradient
                colors={[Colors.primaryLight, Colors.primaryDark]}
                style={{
                  paddingVertical: Sizes.fixPadding * 0.5,
                  paddingHorizontal: Sizes.fixPadding,
                  borderRadius: 1000,
                }}>
                <Text style={{...Fonts.white14RobotoMedium}}>Order Again</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      );
    };
    return (
      <FlatList
        data={shopmallData.reverse()}
        renderItem={renderItem}
        contentContainerStyle={{paddingVertical: Sizes.fixPadding * 2}}
        ListEmptyComponent={<NoDataFound />}
      />
    );
  }

  function tabsInfo() {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          marginVertical: Sizes.fixPadding,
        }}>
        <TouchableOpacity
          onPress={() => updateState({isPooja: true})}
          style={{width: '40%'}}>
          <LinearGradient
            colors={
              isPooja
                ? [Colors.primaryLight, Colors.primaryDark]
                : [Colors.gray, Colors.gray]
            }
            style={{
              width: '100%',
              borderRadius: 100,
              paddingVertical: Sizes.fixPadding * 0.5,
            }}>
            <Text style={{...Fonts.white14RobotoMedium, textAlign: 'center'}}>
              Pooja
            </Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => updateState({isPooja: false})}
          style={{width: '40%'}}>
          <LinearGradient
            colors={
              !isPooja
                ? [Colors.primaryLight, Colors.primaryDark]
                : [Colors.gray, Colors.gray]
            }
            style={{
              width: '100%',
              borderRadius: 100,
              paddingVertical: Sizes.fixPadding * 0.5,
            }}>
            <Text style={{...Fonts.white14RobotoMedium, textAlign: 'center'}}>
              Products
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }
};

const mapStateToProps = state => ({
  userData: state.user.userData,
  wallet: state.user.wallet,
});

export default connect(mapStateToProps, null)(Shopmail);
