import {View, Text, StyleSheet, FlatList, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors, Fonts, Sizes} from '../../assets/style';
import MyStatusBar from '../../components/MyStatusBar';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {TouchableOpacity} from 'react-native';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import {SCREEN_WIDTH} from '../../config/Screen';
import axios from 'axios';
import {
  api_url,
  base_url,
  img_url,
  remedies_customer_suggest,
} from '../../config/constants';
import {connect} from 'react-redux';
import Loader from '../../components/Loader';
import NoDataFound from '../../components/NoDataFound';

const MyRemedy = ({navigation, route, userData}) => {
  const [state, setState] = useState({
    astroData: null,
    isLoading: false,
  });

  useEffect(() => {
    get_free_remedies();
  }, []);

  const get_free_remedies = async () => {
    updateState({isLoading: true});
    await axios({
      method: 'post',
      url: api_url + remedies_customer_suggest,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        customer_id: userData?.id,
        type: route.params?.status,
      },
    })
      .then(res => {
        updateState({isLoading: false});
        if (res.data.status) {
          updateState({astroData: res.data.data});
        }else{
          updateState({astroData: []});
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

  const {astroData, isLoading} = state;

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
          ListHeaderComponent={<>{astroData && astrologerInfo()}</>}
          contentContainerStyle={{paddingVertical: Sizes.fixPadding * 2}}
        />
      </View>
    </View>
  );

  function astrologerInfo() {
    const on_navigate = remedies_id => {
      if (route.params?.status == '1') {
        navigation.navigate('freeRemedy', {
          remedy_id: remedies_id,
        });
      } else {
        navigation.navigate('paidRemedy', {
          remedy_id: remedies_id,
        });
      }
    };

    const renderItem = ({item, index}) => {
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          disabled={route.params?.status == '2' && item?.status_paid == '1'}
          onPress={() => on_navigate(item?.id)}
          style={{
            marginBottom: Sizes.fixPadding * 2,
            paddingVertical: Sizes.fixPadding * 1.5,
            backgroundColor: Colors.whiteDark,
            paddingHorizontal: Sizes.fixPadding,
            borderRadius: Sizes.fixPadding,
            elevation: 5,
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.2,
            shadowColor: Colors.gray,
          }}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={[styles.row, {alignItems: 'flex-start'}]}>
              <View
                style={{
                  width: SCREEN_WIDTH * 0.15,
                  height: SCREEN_WIDTH * 0.15,
                  borderWidth: 2,
                  borderColor: Colors.white,
                  backgroundColor: Colors.white,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: Sizes.fixPadding,
                  elevation: 5,
                  shadowOffset: {
                    width: 0,
                    height: 1,
                  },
                  shadowOpacity: 0.2,
                  shadowColor: Colors.blackLight,
                }}>
                <Image
                  source={{
                    uri:
                      base_url +
                      'api/uploads/images/img/' +
                      item.images[0]?.image,
                  }}
                  style={{
                    width: '85%',
                    height: '85%',
                  }}
                />
              </View>
              <View
                style={{
                  marginLeft: Sizes.fixPadding,
                  marginTop: Sizes.fixPadding * 0.5,
                }}>
                <Text
                  style={{
                    ...Fonts.gray16RobotoMedium,
                    color: Colors.blackLight,
                  }}>
                  {item?.product_name}
                </Text>
              </View>
            </View>
            <Text style={{...Fonts.gray14RobotoMedium}}>
              {moment(item.created_at).format('DD MMM YYYY')}
            </Text>
          </View>
          <View
            style={[
              styles.row,
              {
                justifyContent: 'space-between',
                marginTop: Sizes.fixPadding * 0.5,
              },
            ]}>
            <Text
              style={{
                ...Fonts.primaryLight15RobotoMedium,
              }}>
              Suggested - {item?.owner_name}
            </Text>
            {route.params?.status == '2' && (
              <Text
                style={{
                  ...Fonts.primaryLight15RobotoRegular,
                  color:
                    item?.status_paid == '0'
                      ? Colors.primaryLight
                      : Colors.green_a,
                }}>
                {item?.status_paid == '0' ? 'Not Booked' : 'Booked'}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      );
    };

    return (
      <View style={{marginHorizontal: Sizes.fixPadding * 1.5}}>
        <FlatList
          data={astroData}
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
          {route?.params?.status == '1' ? 'Free Remedy' : 'Paid Remedy'}
        </Text>
      </View>
    );
  }
};

const mapStateToProps = state => ({
  userData: state.user.userData,
});

export default connect(mapStateToProps, null)(MyRemedy);

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
