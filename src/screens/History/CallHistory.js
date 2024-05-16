import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors, Fonts, Sizes} from '../../assets/style';
import LinearGradient from 'react-native-linear-gradient';
import Loader from '../../components/Loader';
import {connect} from 'react-redux';
import axios from 'axios';
import {
  api_url,
  call_history_customer,
} from '../../config/constants';
import moment from 'moment';
import NoDataFound from '../../components/NoDataFound';

const CallHistory = ({navigation, userData}) => {
  const [callHistoryData, setCallHistoryData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    get_history();
    return () => null;
  }, []);

  const get_history = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + call_history_customer,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        customer_id: userData.id,
      },
    })
      .then(res => {
        if (res.data.status) {
          setCallHistoryData(res.data.data);
        }

        setIsLoading(false);
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  return (
    <View style={{flex: 1}}>
      <Loader visible={isLoading} />
      <FlatList
        ListHeaderComponent={<>{callHistoryData && transactionInfo()}</>}
      />
    </View>
  );

  function transactionInfo() {
    const renderItem = ({item, index}) => {
      return (
        <View
          style={{
            marginHorizontal: Sizes.fixPadding * 1.5,
            marginBottom: Sizes.fixPadding,
            padding: Sizes.fixPadding,
            backgroundColor: '#FAFAFA',
            borderRadius: Sizes.fixPadding,
            borderWidth: 1,
            borderColor: Colors.grayLight,
            elevation: 2,
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.2,
          }}>
          <Text
            style={{...Fonts.black16RobotoMedium, color: Colors.blackLight}}>
            Call with {item.owner_name} for {parseFloat(item.duration).toFixed(0)}{' '}
            minutes
          </Text>
          <View style={{...styles.row, alignItems: 'flex-end'}}>
            <View style={{flex: 0.8}}>
              <Text
                style={{
                  ...Fonts.gray14RobotoMedium,
                  marginVertical: Sizes.fixPadding * 0.5,
                }}>
                {moment(item?.order_time).format('DD MMM YYYY, hh:mm A')}
              </Text>
              <Text style={{...Fonts.gray16RobotoMedium}}>
                # CALL{item.order_id}
              </Text>
            </View>
            <View style={{flex: 0.4}}>
              <TouchableOpacity
                 activeOpacity={0.8}
                 onPress={() =>
                   navigation.navigate('astrologerDetailes', {
                     data: item?.astro_id,
                   })
                 }>
                <LinearGradient
                  colors={
                    item.current_status == 'Online'
                      ? [Colors.primaryLight, Colors.primaryDark]
                      : [Colors.whiteDark, Colors.whiteDark]
                  }
                  style={{
                    paddingVertical: Sizes.fixPadding * 0.5,
                    borderRadius: 1000,
                    elevation: 5,
                    shadowOffset: {
                      width: 0,
                      height: 1,
                    },
                    shadowOpacity: 0.2,
                  }}>
                  <Text
                    style={[
                      item.current_status == 'Online'
                        ? Fonts.white14RobotoMedium
                        : Fonts.black14InterMedium,
                      {textAlign: 'center'},
                    ]}>
                    Call again
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    };
    return (
      <View style={{paddingVertical: Sizes.fixPadding}}>
        <FlatList
          data={callHistoryData}
          renderItem={renderItem}
          ListEmptyComponent={<NoDataFound />}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  userData: state.user.userData,
  wallet: state.user.wallet,
});

export default connect(mapStateToProps, null)(CallHistory)

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