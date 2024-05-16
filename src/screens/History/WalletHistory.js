import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors, Fonts, Sizes} from '../../assets/style';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import {api_paymenthistory, api_url} from '../../config/constants';
import Loader from '../../components/Loader';
import {connect} from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import NoDataFound from '../../components/NoDataFound';
import user from '../../redux/reducer/user';

const WalletHistory = ({navigation, userData, wallet, route}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [walletHistoryData, setWalletHistoryData] = useState(null);

  useEffect(() => {
    get_history();
  }, []);
  const get_history = async () => {
    setIsLoading(true);
    console.log({
      user_id: userData.id,
    })
    await axios({
      
      method: 'post',
      url: api_url + api_paymenthistory,
      data: {
        user_id: userData.id,
      },
    })
      .then(res => {
        setIsLoading(false);
        if (res.data.status == 1) {
          setWalletHistoryData(res.data.records);
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  return (
    <View style={{flex: 1, backgroundColor: Colors.bodyColor}}>
      <Loader visible={isLoading} />
      {typeof route?.params?.flag != 'undefined' && header()}
      <FlatList
        ListHeaderComponent={
          <>
            {walletInfo()}
            {transactionInfo()}
          </>
        }
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
            {/* {item.title} */}Added
          </Text>
          <View style={{...styles.row, alignItems: 'flex-end'}}>
            <View style={{flex: 0.7}}>
              <Text style={{...Fonts.gray14RobotoMedium}}>
                {item.transdate}
              </Text>
              <Text style={{...Fonts.gray16RobotoMedium}}>{item.trans_id}</Text>
            </View>
            <View style={{flex: 0.4}}>
              <Text
                style={[
                  Fonts.black16RobotoMedium,
                  {
                    color:
                      (item.bal_type == '4' ||  item.bal_type == '5')  ? Colors.greenLight : Colors.red,
                  },
                ]}>
                {(item.bal_type == '4' ||  item.bal_type == '5') ? '+' : '-'} ₹{item.cramount}
              </Text>
            </View>
          </View>
        </View>
      );
    };
    return (
      <View style={{paddingVertical: Sizes.fixPadding}}>
        <FlatList
          data={walletHistoryData}
          renderItem={renderItem}
          keyExtractor={item => item.trans_id}
          ListEmptyComponent={<NoDataFound />}
        />
      </View>
    );
  }

  function walletInfo() {
    return (
      <View
        style={{
          ...styles.row,
          padding: Sizes.fixPadding * 2,
          borderBottomWidth: 1,
          borderBottomColor: Colors.grayLight,
        }}>
        <View style={{flex: 0.5}}>
          <Text style={{...Fonts.gray14RobotoMedium}}>Available Balance</Text>
          <Text
            style={{
              ...Fonts.primaryLight18RobotoMedium,
              fontSize: 26,
              marginTop: Sizes.fixPadding * 0.5,
            }}>
            ₹{wallet}
          </Text>
        </View>
        <View style={{flex: 0.5, ...styles.center}}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('wallet', {type: 'wallet'})}>
            <LinearGradient
              colors={[Colors.primaryLight, Colors.primaryDark]}
              style={{
                paddingVertical: Sizes.fixPadding * 0.5,
                paddingHorizontal: Sizes.fixPadding * 1.5,
                borderRadius: 1000,
              }}>
              <Text style={{...Fonts.white16RobotoMedium}}>Recharge Now</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
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
        <TouchableOpacity onPress={() => navigation.goBack()}>
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
          Wallet Transaction
        </Text>
      </View>
    );
  }
};

const mapStateToProps = state => ({
  userData: state.user.userData,
  wallet: state.user.wallet,
});

export default connect(mapStateToProps, null)(WalletHistory);

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
