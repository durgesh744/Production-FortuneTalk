import {View, Text, FlatList, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {ApiRequest} from '../../config/api_requests';
import {api_url, live__video_audio_history} from '../../config/constants';
import {connect} from 'react-redux';
import {Colors, Sizes, Fonts} from '../../assets/style';
import LinearGradient from 'react-native-linear-gradient';
import Loader from '../../components/Loader';
import moment from 'moment';
import NoDataFound from '../../components/NoDataFound';

const LiveCallHistory = ({navigation, userData}) => {
  const [state, setState] = useState({
    isLoading: false,
    historyData: null,
  });

  useEffect(() => {
    get_history();
  }, []);

  const get_history = async () => {
    try {
      updateState({isLoading: true});

      const response = await ApiRequest.postRequest({
        url: api_url + live__video_audio_history,
        data: {
          user_id: userData?.id,
        },
      });

      if (response?.success) {
        updateState({historyData: response?.history});
      }

      updateState({isLoading: false});
    } catch (e) {
      console.log(e);
      updateState({isLoading: false});
    }
  };

  const updateState = data => {
    setState(prevState => {
      const newData = {...prevState, ...data};
      return newData;
    });
  };

  const {isLoading, historyData} = state;

  return (
    <View style={{flex: 1}}>
      <Loader visible={isLoading} />
      <FlatList ListHeaderComponent={<>{historyData && historyInfo()}</>} />
    </View>
  );

  function historyInfo() {
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
            {item?.bal_type == 'live_video' ? 'Vedio' : 'Voice'} Call with{' '}
            {item.owner_name} for {(parseFloat(item.duration) / 60).toFixed(2)}{' '}
            minutes
          </Text>
          <View style={{...styles.row, alignItems: 'flex-end'}}>
            <View style={{flex: 0.8}}>
              <Text
                style={{
                  ...Fonts.gray14RobotoMedium,
                  marginVertical: Sizes.fixPadding * 0.5,
                }}>
                {moment(item?.transdate).format('DD MMM YYYY, hh:mm A')}
              </Text>
              <Text style={{...Fonts.gray16RobotoMedium}}>
                #{item.trans_id}
              </Text>
            </View>
          </View>
        </View>
      );
    };
    return (
      <View style={{paddingVertical: Sizes.fixPadding}}>
        <FlatList data={historyData} renderItem={renderItem} ListEmptyComponent={<NoDataFound />} />
      </View>
    );
  }
};

const mapStateToProps = state => ({
  userData: state.user.userData,
  wallet: state.user.wallet,
});

export default connect(mapStateToProps, null)(LiveCallHistory);

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
