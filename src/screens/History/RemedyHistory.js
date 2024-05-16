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
  remedies_customer_oder_history,
} from '../../config/constants';
import {connect} from 'react-redux';
import moment from 'moment';
import NoDataFound from '../../components/NoDataFound';

const RemedyHistory = ({navigation, userData}) => {
  const [state, setState] = useState({
    isLoading: false,
    historyData: null,
  });

  useEffect(() => {
    get_remedy_history();
  }, []);

  const get_remedy_history = async () => {
    updateState({isLoading: true});
    await axios({
      method: 'post',
      url: api_url + remedies_customer_oder_history,
      headers: {'Content-Type': 'multipart/form-data'},
      data: {customer_id: userData?.id},
    })
      .then(res => {
        updateState({isLoading: false});
        if(res.data.status){
          updateState({historyData: res.data.data})
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

  const {isLoading, historyData} = state;

  return (
    <View style={{flex: 1, backgroundColor: Colors.bodyColor}}>
      <Loader visible={isLoading} />
      <FlatList ListHeaderComponent={<>{historyData && historyInfo()}</>} />
    </View>
  );

  function historyInfo() {
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
              {item?.product_name}
            </Text>
            <Text
              style={{
                ...Fonts.gray14RobotoRegular,
                marginVertical: Sizes.fixPadding,
              }}>
              {moment(item.rby_created_at).format('DD MMM YYYY, hh:mm A')}
            </Text>
            <Text style={{...Fonts.gray14RobotoRegular}}>
              Order No. {item?.rby_order_no}
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
                navigation.navigate('remedyHistoryDetails', {
                  remedy_id: item?.id,
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
            {/* <TouchableOpacity>
              <LinearGradient
                colors={[Colors.primaryLight, Colors.primaryDark]}
                style={{
                  paddingVertical: Sizes.fixPadding * 0.5,
                  paddingHorizontal: Sizes.fixPadding,
                  borderRadius: 1000,
                }}>
                <Text style={{...Fonts.white14RobotoMedium}}>Order Again</Text>
              </LinearGradient>
            </TouchableOpacity> */}
          </View>
        </View>
      );
    };
    return (
      <FlatList
        data={historyData}
        renderItem={renderItem}
        contentContainerStyle={{paddingVertical: Sizes.fixPadding * 2}}
        ListEmptyComponent={<NoDataFound />}
      />
    );
  }
};

const mapStateToProps = state => ({
  userData: state.user.userData,
  wallet: state.user.wallet,
});

export default connect(mapStateToProps, null)(RemedyHistory);
