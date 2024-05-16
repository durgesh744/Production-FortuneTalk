import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {FlatList} from 'react-native';
import RenderHtml from 'react-native-render-html';
import { api_url, privacy_policy_astrologer, terms } from '../config/constants';
import MyStatusBar from '../components/MyStatusBar';
import MyHeader from '../components/MyHeader';
import Loader from '../components/Loader';
import { SCREEN_WIDTH } from '../config/Screen';
import {ApiRequest} from '../config/api_requests'
import { Colors, Sizes } from '../assets/style';

const Privacy = ({navigation}) => {
  const [state, setState] = useState({
    isLoading: false,
    policyData: null,
  });

  useEffect(() => {
    get_policy();
  }, []);

  const get_policy = async () => {
    try {
      updateState({isLoading: true});
      const response = await ApiRequest.getRequest({
        url: api_url + terms,
      });
      if (response?.status == 1) {
        updateState({policyData: response?.records[0]?.privacy_policy});
      }
      updateState({isLoading: false});
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

  const {isLoading, policyData} = state;

  return (
    <View style={{flex: 1, backgroundColor: Colors.bodyColor}}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      <MyHeader title="Privacy Policy" navigation={navigation} />
      <Loader visible={isLoading} />
      <View style={{flex: 1}}>
        <FlatList ListHeaderComponent={<>{policyData && policyInfo()}</>} />
      </View>
    </View>
  );

  function policyInfo() {
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          margin: Sizes.fixPadding,
        }}>
        <RenderHtml
          contentWidth={SCREEN_WIDTH}
          source={{html: policyData}}
          enableExperimentalMarginCollapsing={true}
          baseStyle={{
            color: Colors.blackLight,
            textAlign: 'justify',
            fontSize: '14px',
            lineHeight: 20,
          }}
        />
      </View>
    );
  }
};

export default Privacy;
