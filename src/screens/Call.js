import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  ImageBackground,
  BackHandler,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Colors, Fonts, Sizes} from '../assets/style';
import MyStatusBar from '../components/MyStatusBar';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../config/Screen';
import Stars from 'react-native-stars';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  CommonActions,
  useFocusEffect,
  useIsFocused,
} from '@react-navigation/native';
import {showToastWithGravityAndOffset} from '../methods/toastMessage';
import {
  api_astrolist1,
  api_url,
  astrolist_filter,
  call_app_id,
  call_app_sign,
  call_astrologer,
  call_banner,
  check_call_astro_status,
  get_remedies,
  img_url,
  moa_filter_astro,
  skill_list,
} from '../config/constants';
import axios from 'axios';
import Loader from '../components/Loader';
import {connect} from 'react-redux';
import {RefreshControl} from 'react-native';
import AstroCategory from '../components/AstroCategory';
import AstrologerFilters from '../components/AstrologerFilters';
import {MyMethods} from '../methods/my_methods';
import Requesting from '../components/Requesting';
import WalletCheck from '../components/WalletCheck';
import {CallMethods} from '../methods/callMethods';
import AstrologerList from '../components/AstrologerList';
import NoDataFound from '../components/NoDataFound';
import { ApiRequest } from '../config/api_requests';


const Call = ({navigation, userData, wallet}) => {
  const [requestingVisible, setRequestingVisible] = useState(false);
  const [chatModalVisible, setChatModalVisible] = useState(false);
  const [state, setState] = useState({
    refreshing: false,
    astroData: null,
    backClickCount: 0,
    astrologerData: null,
    isLoading: false,
    activeFilter: 3,
    filterData: null,
    searchableData: null,
    filterVisible: false,
    selectedSkillFilters: [],
    selectedLangaugeFilters: [],
    selectedCountryFilters: [],
    selectedOfferFilters: [],
    selectedSortFilters: '',
    selectedGenderFilters: '',
    currentIndex: 0,
    isExtraLoading: false,
    bannerData: null
  });

  const backAction = () => {
    backClickCount == 1 ? BackHandler.exitApp() : _spring();
    return true;
  };

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', backAction);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', backAction);
    }, [backAction]),
  );

  function _spring() {
    updateState({backClickCount: 1});
    showToastWithGravityAndOffset('Press Back Once Again to Exit');
    setTimeout(() => {
      updateState({backClickCount: 0});
    }, 1000);
  }

  useEffect(() => {
    get_filters();
    get_astrologer();
  }, []);

  const get_filters = async () => {
    try{
      updateState({isLoading: true});
      const bannerData = await ApiRequest.getRequest({url: api_url + call_banner })
      const remedyData = await ApiRequest.getRequest({url: api_url + get_remedies})

      if(remedyData?.status){
        updateState({
          filterData: remedyData.data,
          activeFilter: remedyData.data[0]?.remedies_id,
        });
      }

      if(bannerData?.status){
        updateState({bannerData: bannerData?.data})
      }

      updateState({isLoading: false})
    }catch(e){
      console.log(e)
      updateState({isLoading: false})
    }
  

  };

  const get_astrologer = async (activeFilter = '', index = currentIndex) => {
    updateState({isLoading: true});
    await axios({
      method: 'post',
      url: api_url + moa_filter_astro,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        customer_id: userData?.id,
        short_filter: selectedSortFilters,
        skill_id: JSON.stringify(selectedSkillFilters),
        language: JSON.stringify(selectedLangaugeFilters),
        gender:
          selectedGenderFilters.length != 0
            ? JSON.stringify([selectedGenderFilters])
            : JSON.stringify([]),
        country: JSON.stringify(selectedCountryFilters),
        offer_id: JSON.stringify(selectedOfferFilters),
        remedies: activeFilter,
        index: index,
        type: 'call'
      },
    })
      .then(res => {
        updateState({isLoading: false});
        let arr = res.data.data;
        // let filter_arr = arr.filter(item => item.astro_status == 'Online');
        updateState({astrologerData: arr, searchableData: arr});
        // setMasterDataSource(filter_arr);
      })
      .catch(err => {
        updateState({isLoading: false});
        console.log(err);
      });
  };

  const get_astrologer_on_end_reach = async (
    activeFilter = '',
    index = currentIndex,
  ) => {
    updateState({isExtraLoading: true});
    await axios({
      method: 'post',
      url: api_url + moa_filter_astro,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        customer_id: userData?.id,
        short_filter: selectedSortFilters,
        skill_id: JSON.stringify(selectedSkillFilters),
        language: JSON.stringify(selectedLangaugeFilters),
        gender:
          selectedGenderFilters.length != 0
            ? JSON.stringify([selectedGenderFilters])
            : JSON.stringify([]),
        country: JSON.stringify(selectedCountryFilters),
        offer_id: JSON.stringify(selectedOfferFilters),
        remedies: activeFilter,
        index: index,
        type: 'call'
      },
    })
      .then(res => {
        updateState({isExtraLoading: false});
        let arr = res.data.data;
        // let filter_arr = arr.filter(item => item.astro_status == 'Online');
        updateState({
          astrologerData: [...astrologerData, ...arr],
          currentIndex: index + 1,
        });
        // setMasterDataSource(filter_arr);
      })
      .catch(err => {
        updateState({isExtraLoading: false});
        console.log(err);
      });
  };

  const on_refresh = async () => {
    updateState({refreshing: true});
    await axios({
      method: 'post',
      url: api_url + moa_filter_astro,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        customer_id: userData?.id,
        short_filter: selectedSortFilters,
        skill_id: JSON.stringify(selectedSkillFilters),
        language: JSON.stringify(selectedLangaugeFilters),
        gender:
          selectedGenderFilters.length != 0
            ? JSON.stringify([selectedGenderFilters])
            : JSON.stringify([]),
        country: JSON.stringify(selectedCountryFilters),
        offer_id: JSON.stringify(selectedOfferFilters),
        remedies: activeFilter,
        index: '0',
      },
    })
      .then(res => {
        updateState({refreshing: false});
        let arr = res.data.data;
        // let filter_arr = arr.filter(item => item.astro_status == 'Online');
        updateState({astrologerData: arr, searchableData: arr});
        // setMasterDataSource(filter_arr);
      })
      .catch(err => {
        updateState({refreshing: false});
        console.log(err);
      });
  };

  const call_to_astrologer = async astroData => {
    try {
      updateState({isLoading: true});
      let offer_id =
        astroData?.Offer_list.length != 0 ? astroData?.Offer_list[0]?.id : '0';

      await axios({
        method: 'post',
        url: api_url + call_astrologer,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: { 
          user_id: userData?.id,
          astrologer_user_id: astroData?.id,
          moblie_no: userData?.phone, 
          moa: astroData?.moa,
          tranding: astroData?.chat_trending,
          offer_id: offer_id,
        },
      })
        .then(res => {
          updateState({isLoading: false});
          updateState({astroData: astroData});
          const price = call_price(astroData);
          CallMethods.add_call_in_firebase({
            astroID: astroData?.id,
            customerData: userData,
            rat: price,
            duration: res.data?.result[0]?.max_duration,
            orderId: res.data?.result[0]?.invoice_id,
          });
          setRequestingVisible(true);
        })
        .catch(err => {
          updateState({isLoading: false});
          console.log(err);
        });
    } catch (e) {
      console.log(e);
    }
  };

  const check_status = async astroData => {
    updateState({isLoading: true});
    await axios({
      method: 'post',
      url: api_url + check_call_astro_status,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        astro_id: astroData?.id,
      },
    })
      .then(res => {
        updateState({isLoading: false});
        if (res.data.status == '200') {
          if (res.data.data.current_status_call == 'Online') {
            call_to_astrologer(astroData);
          } else {
            showToastWithGravityAndOffset(res.data?.data?.current_status_call);
          }
        }
      })
      .catch(err => {
        console.log(err);
        updateState({isLoading: false});
      });
  };

  const go_home = () => {
    navigation.dispatch(CommonActions.navigate({name: 'home3'}));
  };

  const call_price = astroData => {
    if (astroData?.Offer_list.length != 0) {
      return MyMethods.calculate_discount_price({
        actualPrice: MyMethods.sum_price({
          firstPrice: parseFloat(astroData?.call_price_m),
          secondPrice: parseFloat(astroData?.call_commission),
        }),
        percentage: parseFloat(astroData?.Offer_list[0]?.discount),
      });
    }
    return MyMethods.sum_price({
      firstPrice: parseFloat(astroData?.call_price_m),
      secondPrice: parseFloat(astroData?.call_commission),
    });
  };

  const updateState = data => {
    setState(prevState => {
      const newData = {...prevState, ...data};
      return newData;
    });
  };

  const {
    refreshing,
    astroData,
    backClickCount,
    astrologerData,
    isLoading,
    activeFilter,
    filterData,
    searchableData,
    filterVisible,
    selectedCountryFilters,
    selectedLangaugeFilters,
    selectedOfferFilters,
    selectedSkillFilters,
    selectedSortFilters,
    selectedGenderFilters,
    currentIndex,
    isExtraLoading,
    bannerData
  } = state;

  const listData = useMemo(() => astrologerData, [astrologerData]);

  return (
    <View style={{flex: 1, backgroundColor: Colors.bodyColor}}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      <Loader visible={isLoading} />
      <View style={{flex: 1}}>
        {header()}
        {filterData && filtersInfo()}
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={on_refresh} />
          }
          ListHeaderComponent={
            <>
              {bannerData && bottomBannerInfo()}
              {astrologerData && onlineAstrologerInfo()}
              {isExtraLoading && extroLoadingInfo()}
            </>
          }
          contentContainerStyle={{paddingBottom: Sizes.fixPadding * 8}}
        />
      </View>
      {requestingModalInfo()}
      {astrologerFiltersInfo()}
      {chatModalDetailesInfo()}
    </View>
  );

  function chatModalDetailesInfo() {
    return (
      <WalletCheck
        navigation={navigation}
        customerData={userData}
        chatModalVisible={chatModalVisible}
        setChatModalVisible={setChatModalVisible}
        check_status={check_status}
        wallet={wallet}
        astroData={astroData}
      />
    );
  }

  function astrologerFiltersInfo() {
    return (
      <AstrologerFilters
        filterVisible={filterVisible}
        updateState={updateState}
        selectedCountryFilters={selectedCountryFilters}
        selectedLangaugeFilters={selectedLangaugeFilters}
        selectedOfferFilters={selectedOfferFilters}
        selectedSkillFilters={selectedSkillFilters}
        selectedSortFilters={selectedSortFilters}
        activeFilter={activeFilter}
        selectedGenderFilters={selectedGenderFilters}
        get_astrologer={get_astrologer}
      />
    );
  }

  function requestingModalInfo() {
    return (
      <Requesting
        customerData={userData}
        requestingVisible={requestingVisible}
        setRequestingVisible={setRequestingVisible}
        astroData={astroData}
      />
    );
  }

  function extroLoadingInfo() {
    return (
      <View
        style={{
          marginBottom: Sizes.fixPadding * 2,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator size={'small'} color={Colors.blueFacebook} />
      </View>
    );
  }

  function onlineAstrologerInfo() {
    const on_call = astroData => {
      updateState({astroData: astroData});
      if (parseFloat(wallet) >= call_price(astroData)) {
        check_status(astroData);
      } else if (astroData?.moa == '1') {
        check_status(astroData);
      } else {
        setChatModalVisible(true);
      }
    };

    return (
      <View
        style={{
          marginTop: Sizes.fixPadding,
        }}>
        <FlatList
          data={listData}
          renderItem={({item}) => (
            <AstrologerList
              item={item}
              on_call={on_call}
              type="call"
              navigation={navigation}
            />
          )}
          keyExtractor={item => item.id}
          numColumns={2}
          maxToRenderPerBatch={10}
          initialNumToRender={10}
          onEndReachedThreshold={0.1}
          ListEmptyComponent={<NoDataFound />}
          onEndReached={() => {
            get_astrologer_on_end_reach(activeFilter, currentIndex + 1);
          }}
          contentContainerStyle={{paddingRight: Sizes.fixPadding * 1.5}}
        />
      </View>
    );
  }

  function bottomBannerInfo() {
    const renderItem = ({item, index}) => {
      return (
        <TouchableOpacity
          activeOpacity={1}
          style={{
            width: SCREEN_WIDTH * 0.95,
            height: SCREEN_WIDTH*0.18,
            marginRight: Sizes.fixPadding,
            borderRadius: Sizes.fixPadding,
            overflow: 'hidden',
            borderWidth: 2,
            borderColor: Colors.grayLight,
          }}>
          <Image source={{uri: img_url + item.image}} style={{width: '100%', height: '100%'}} />
        </TouchableOpacity>
      );
    };
    return (
      <View
        style={{
          paddingVertical: Sizes.fixPadding,
          borderBottomWidth: 1,
          borderBottomColor: Colors.grayLight,
        }}>
        <FlatList
          data={bannerData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          horizontal
          contentContainerStyle={{paddingLeft: Sizes.fixPadding}}
          pagingEnabled
        />
      </View>
    );
  }

  function filtersInfo() {
    return (
      <AstroCategory
        updateState={updateState}
        filterData={filterData}
        activeFilter={activeFilter}
        astrologer_by_category={get_astrologer}
      />
    );
  }

  function header() {
    return (
      <View
        style={{
          margin: Sizes.fixPadding * 1.5,
          ...styles.row,
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity
          onPress={() => go_home()}
          style={{
            alignSelf: 'flex-start',
            flex: 0.2,
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
            flex: 0.6,
          }}>
          Call with Astrologer
        </Text>
        <View style={{...styles.row}}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate('searchAstrologers', {
                astrologerData: searchableData,
              })
            }>
            <AntDesign
              name="search1"
              color={Colors.primaryLight}
              size={Sizes.fixPadding * 2.2}
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => updateState({filterVisible: true})}
            style={{marginLeft: Sizes.fixPadding * 1.5}}>
            <AntDesign
              name="filter"
              color={Colors.primaryLight}
              size={Sizes.fixPadding * 2.2}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
};

const mapStateToProps = state => ({
  userData: state.user.userData,
  wallet: state.user.wallet,
});

export default connect(mapStateToProps, null)(Call);

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
  container: {
    width: SCREEN_WIDTH * 0.85,
    height: SCREEN_HEIGHT * 0.8,
    position: 'relative', // Position the caret within the container
    backgroundColor: Colors.grayLight, // Background color of the container
    alignSelf: 'flex-end',
    marginTop: Sizes.fixPadding * 6,
    borderRadius: Sizes.fixPadding * 2,
    borderTopRightRadius: 0,
    marginRight: Sizes.fixPadding * 2.3,
    elevation: 5,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2, 
  },
  caret: {
    position: 'absolute',
    top: -Sizes.fixPadding * 2, // Position the caret at the top
    right: 0, // Position the caret on the right
    width: 0,
    height: 0,
    borderLeftWidth: 20, // Adjust the size of the caret by changing the border width
    borderBottomWidth: 20, // Adjust the size of the caret by changing the border width
    // borderTopLeftRadius: 1,
    borderStyle: 'solid',
    borderLeftColor: 'transparent', // Transparent left border
    borderBottomColor: Colors.grayLight, // Change the color of the caret
    transform: [{rotate: '0deg'}], // Rotate the caret to point to the top-right
  },
  filterItems: {
    padding: Sizes.fixPadding * 1.5,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray + '80',
  },
  itemContainer: {
    width: SCREEN_WIDTH * 0.435,
    marginLeft: Sizes.fixPadding * 1.5,
    borderRadius: Sizes.fixPadding,
    overflow: 'hidden',
    elevation: 5,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    marginBottom: Sizes.fixPadding * 1.5,
    shadowColor: Colors.black,
    backgroundColor: Colors.grayLight,
    alignItems: 'center',
  },
  imageContainer: {
    width: SCREEN_WIDTH * 0.15,
    height: SCREEN_WIDTH * 0.15,
    borderRadius: 1000,
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
    marginVertical: Sizes.fixPadding * 0.5,
    position: 'absolute',
    bottom: -22,
    zIndex: 2,
  },
});
