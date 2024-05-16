import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  ImageBackground,
  BackHandler,
  RefreshControl,
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
import {CommonActions, useFocusEffect} from '@react-navigation/native';
import {showToastWithGravityAndOffset} from '../methods/toastMessage';
import axios from 'axios';
import {
  accept_chat,
  api_callintakesubmit,
  api_getastrochatstatus,
  api_url,
  base_url,
  call_waiting_user_delete,
  call_waiting_user_pause,
  call_wating_user,
  chat_banner,
  get_remedies,
  img_url,
  kundli_get_kundli,
  moa_filter_astro,
  user_astro_list,
} from '../config/constants';
import Loader from '../components/Loader';
import {connect} from 'react-redux';
import Requesting from '../components/Requesting';
import database from '@react-native-firebase/database';
import moment from 'moment';
import WalletCheck from '../components/WalletCheck';
import {Modal} from 'react-native-paper';
import WaitedAstrologer from '../components/Chat/WaitedAstrologer';
import AstroCategory from '../components/AstroCategory';
import AstrologerFilters from '../components/AstrologerFilters';
import {calculate_discount_price, sum_price} from '../methods/calculatePrice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AstrologerList from '../components/AstrologerList';
import NoDataFound from '../components/NoDataFound';
import {MyMethods} from '../methods/my_methods';
import {ApiRequest} from '../config/api_requests';
import * as ChatActions from '../redux/actions/ChatActions';

let timeout;

const Chat = ({navigation, customerData, wallet, dispatch}) => {
  const [requestingVisible, setRequestingVisible] = useState(false);
  const [chatModalVisible, setChatModalVisible] = useState(false);
  const [state, setState] = useState({
    backClickCount: 0,
    modalVisible: false,
    astrologerData: [],
    isLoading: false,
    refreshing: false,
    activeFilter: 3,
    astroData: null,
    kundliId: null,
    chatId: null,
    firebaseId: null, 
    pauseVisible: false,
    cancelVisible: false,
    waitedAstroData: null,
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
    bannerData: null,
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
    get_firebaseId();
    return () => {
      database().ref(`/CurrentRequest/${astroData?.id}/status`).off();
    };
  }, []);

  useEffect(() => {
    get_filters();
    get_astrologer();
  }, []);

  useEffect(() => {
    get_waited_astrologer();
  }, [waitedAstroData]);

  const get_filters = async () => {
    try {
      updateState({isLoading: true});
      const bannerData = await ApiRequest.getRequest({
        url: api_url + chat_banner,
      });
      const remedyData = await ApiRequest.getRequest({
        url: api_url + get_remedies,
      });

      if (remedyData?.status) {
        updateState({
          filterData: remedyData.data,
          activeFilter: remedyData.data[0]?.remedies_id,
        });
      }
      if (bannerData?.status) {
        updateState({bannerData: bannerData?.data});
      }

      console.log(bannerData);
      updateState({isLoading: false});
    } catch (e) {
      console.log(e);
      updateState({isLoading: false});
    }
  };

  const add_callback_listener = astroData => {
    database()
      .ref(`/CurrentRequest/${astroData?.id}`)
      .on('value', async snapshot => {
        if (snapshot?.val()?.status == 'Accept'  && snapshot?.val()?.sid == customerData?.id) {
          clearTimeout(timeout);
          await accept_chat_transid(astroData);
        }
      });
  };

  const get_firebaseId = async () => {
    const data = await AsyncStorage.getItem('FirebaseId');
    updateState({firebaseId: data});
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
        customer_id: customerData?.id,
        short_filter: selectedSortFilters,
        skill_id: JSON.stringify(selectedSkillFilters),
        language: JSON.stringify(selectedLangaugeFilters).toString(),
        gender:
          selectedGenderFilters.length != 0
            ? JSON.stringify([selectedGenderFilters])
            : JSON.stringify([]),
        country: JSON.stringify(selectedCountryFilters),
        offer_id: JSON.stringify(selectedOfferFilters),
        remedies: activeFilter,
        index: index,
        type: 'chat'
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
        customer_id: customerData?.id,
        short_filter: selectedSortFilters,
        skill_id: JSON.stringify(selectedSkillFilters),
        language: JSON.stringify(selectedLangaugeFilters).toString(),
        gender:
          selectedGenderFilters.length != 0
            ? JSON.stringify([selectedGenderFilters])
            : JSON.stringify([]),
        country: JSON.stringify(selectedCountryFilters),
        offer_id: JSON.stringify(selectedOfferFilters),
        remedies: activeFilter,
        index: index,
        type: 'chat'
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
    try {
      const astro_data = await axios({
        method: 'post',
        url: api_url + moa_filter_astro,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: {
          customer_id: customerData?.id,
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
          index: 0,
        },
      });
      const waited_astro = await axios({
        method: 'post',
        url: api_url + user_astro_list,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: {
          user_id: customerData?.id,
        },
      });
      let arr = astro_data.data.data;
      if (waited_astro.data.status) {
        updateState({waitedAstroData: waited_astro.data.data});
      } else {
        updateState({waitedAstroData: null});
      }
      updateState({astrologerData: arr});
      updateState({refreshing: false});
    } catch (e) {
      console.log(e);
      updateState({refreshing: false});
    }
  };

  const accept_chat_transid = async astroData => {
    updateState({isLoading: true});
    await axios({
      method: 'post',
      url: api_url + accept_chat,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        user_id: customerData.id,
        astro_id: astroData.id,
      },
    })
      .then(res => {
        const nodeRef_a = database().ref(
          `/CustomerCurrentRequest/${customerData.id}`,
        );
        nodeRef_a.update({
          astroData: astroData,
          trans_id: res.data.result.transid,
          chat_id: chatId,
          status: 'pending',
          remedies: 'null',
          astromall: 'null',
        });

        database().ref(`/CurrentRequest/${astroData?.id}/status`).off();
        updateState({isLoading: false});
        setRequestingVisible(false);
        navigation.dispatch(
          CommonActions.reset({
            index: 3,
            routes: [
              {
                name: 'acceptChat',
                params: {
                  astro_id: astroData.id,
                  trans_id: res.data.result.transid,
                  chat_id: chatId,
                  image: astroData?.image,
                  name: astroData?.owner_name,
                },
              },
            ],
          }),
        );
      })
      .catch(err => {
        console.log(err);
        updateState({isLoading: false});
      });
  };

  const send_request = async astroData => {
    updateState({isLoading: false});
    let offer_id =
      astroData.Offer_list.length != 0 ? astroData.Offer_list[0]?.id : '';
    await axios({
      method: 'get',
      url: `${base_url}user/chat_in.php?u_id=${customerData.id}&a_id=${ 
        astroData.id
      }&form_id=2&in_id=${moment(new Date()).format(
        'DD-MM-YYYY HH:MM:ss',
      )}&message=Chat in time&offer_id=${offer_id}&moa=${
        astroData?.moa
      }&tranding=${astroData?.chat_trending}`,
    })
      .then(res => {
        updateState({chatId: res.data.chat_id});
        updateState({isLoading: false});
        add_callback_listener(astroData);
        timeout = setTimeout(() => {
          setRequestingVisible(false);
          // dispatch(
          //   ChatActions.updateIntiatedChat({
          //     request_id: astroData?.id,
          //     requested_user: customerData?.id,
          //     request_status: 'REJECTED',
          //   }),
          // );
        }, 1000 * 60 * 2);
      })
      .catch(err => {
        updateState({isLoading: false});
        console.log(err);
      });
  };

  const add_message = astroData => {
    let customer_gender =
      customerData.gender == '1'
        ? 'Male'
        : customerData.gender == '2'
        ? 'Female'
        : customerData.gender;
    let message =
      'Name = ' +
      customerData.username +
      '\nGender = ' +
      customer_gender +
      '\nBirth Date = ' +
      `${moment(customerData?.date_of_birth).format('DD-MMMM-YYYY')}` +
      '\nBirth Time = ' +
      `${moment(customerData?.time_of_birth, 'hh:mm').format('hh:mm A')}` +
      '\nCurrent Address = ' +
      `${customerData?.current_address}` +
      '\nBirth Place = ' +
      `${customerData?.place_of_birth}` +
      '\nOccupation = ' +
      `${customerData?.occupation}` +
      '\nProblem = ' +
      `${customerData?.problem}`;
    database()
      .ref(`/AstroId/${astroData.id}`)
      .on('value', snapshot => {
        // const chat_id = firebaseId + '+' + snapshot.val();
        const chat_id = `customer${customerData?.id}astro${astroData.id}`;
        const sendMessage = {
          _id: MyMethods.generateUniqueId(),
          text: message,
          createdAt: new Date().getTime(),
          addedAt: database.ServerValue.TIMESTAMP,
          user: {
            _id: `customer${customerData?.id}`,
            name: customerData.username,
            avatar: base_url + 'admin/' + customerData?.user_profile_image,
          },
          // Mark the message as sent, using one tick
          sent: true,
          // Mark the message as received, using two tick
          received: true,
          // Mark the message as pending with a clock loader
          pending: false,
          senderId: firebaseId,
          receiverId: snapshot.val(),
        };
        const node = database().ref(`/UserId/${astroData?.id}`).push();
        const key = node.key;
        database().ref(`/Messages/${chat_id}/${key}`).set(sendMessage);
      });
  };

  const current_request_for_chat = (kundli_id, astroData) => {
    let minutes = 0;

    minutes = (parseFloat(wallet) / chat_price(astroData)).toFixed(2) * 60;

    if (astroData?.moa == '1') {
      minutes = minutes + 300;
    }
    
    const astrologerData = {
      date: '',
      msg: `Request send to ${astroData?.owner_name}`,
      name: astroData?.owner_name,
      pic: astroData?.image,
      rid: astroData.id,
      sid: customerData.id,
      status: 'Pending',
      wallet: wallet,
      timestamp: new Date().getTime(),
      minutes: minutes,
      invoice_id: '',
    };
    const nodeRef = database().ref(`/CurrentRequest/${astroData.id}`);
    const customerRef = database().ref(
      `/CustomerCurrentRequest/${customerData.id}`,
    );
    nodeRef.update(astrologerData);
    customerRef.update({minutes, kundli_id});
  };

  const on_chat_submit = async astroData => {
    setChatModalVisible(false);
    updateState({isLoading: true});
    const kundli = await axios({
      method: 'post',
      url: api_url + kundli_get_kundli,
      data: {
        user_id: customerData.id,
        customer_name: customerData?.username,
        date_of_birth: customerData?.date_of_birth,
        gender: customerData?.gender,
        time_of_birth: customerData?.time_of_birth,
        lat: 28.34343454,
        lon: 23.64343445,
        address: customerData?.current_address,
        timezone: +5.5,
      },
    });
    await axios({
      method: 'post',
      url: api_url + api_callintakesubmit,
      data: {
        user_id: customerData.id,
        firstname: customerData?.first_name,
        lastname: customerData?.last_name,
        countrycode: '+91',
        phone: customerData?.phone,
        email: '',
        gender: customerData?.gender,
        astro_id: astroData.id,
        chat_call: '1',
        dob: customerData?.date_of_birth,
        tob: customerData?.time_of_birth,
        city: 'New Delhi',
        state: '',
        country: 'New Delhi',
        marital: '',
        occupation: customerData?.occupation,
        topic: '',
        question: '',
        dob_current: 'yes',
        partner_name: '',
        partner_dob: '',
        partner_tob: '',
        partner_city: '',
        partner_state: '',
        partner_country: '',
        kundli_id: kundli.data.kundli_id,
      },
    })
      .then(res => {
        updateState({isLoading: false});
        setRequestingVisible(true);
        current_request_for_chat(kundli.data.kundli_id, astroData);
        add_message(astroData);
        send_request(astroData);
      })
      .catch(err => {
        console.log(err);
        updateState({isLoading: false});
      });
  };

  const check_status = async astroData => {
    updateState({isLoading: true});
    try {
      const status_result = await axios.post(api_url + api_getastrochatstatus, {
        astro_id: astroData.id,
      });
      if (status_result.data.online) {
        updateState({isLoading: false});
        on_chat_submit(astroData);
        // get_kundali(astroData);
      } else if (status_result.data.data.current_status == 'Busy') {
        await axios({
          method: 'post',
          url: api_url + call_wating_user,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          data: {
            astro_id: astroData?.id,
            user_id: customerData?.id,
            type: 2,
          },
        }).then(res => get_waited_astrologer());
        showToastWithGravityAndOffset(
          `Astrologer is ${status_result.data.data.current_status}.`,
        );
        updateState({isLoading: false});
      } else {
        showToastWithGravityAndOffset(
          `Astrologer is ${status_result.data.data.current_status}.`,
        );
        updateState({isLoading: false});
      }
    } catch (e) {
      console.log(e);
      updateState({isLoading: false});
    }
  };

  const get_waited_astrologer = async () => {
    updateState({isLoading: true});
    await axios({
      method: 'post',
      url: api_url + user_astro_list,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        user_id: customerData?.id,
      },
    })
      .then(res => {
        updateState({isLoading: false});
        if (res.data.status) {
          updateState({waitedAstroData: res.data.data});
        } else {
          updateState({waitedAstroData: null});
        }
      })
      .catch(err => {
        console.log(err);
        updateState({isLoading: false});
      });
  };

  const pause_wait_time = async () => {
    updateState({isLoading: true, pauseVisible: false});
    await axios({
      method: 'post',
      url: api_url + call_waiting_user_pause,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        user_id: customerData?.id,
        astro_id: waitedAstroData?.id,
        status: waitedAstroData?.status_pause == 1 ? 2 : 1,
      },
    })
      .then(res => {
        updateState({isLoading: false});
        get_waited_astrologer();
      })
      .catch(err => {
        console.log(err);
        updateState({isLoading: false});
      });
  };

  const cancel_waited_astro = async () => {
    updateState({isLoading: true});
    await axios({
      method: 'post',
      url: api_url + call_waiting_user_delete,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        user_id: customerData?.id,
        astro_id: waitedAstroData?.id,
      },
    })
      .then(res => {
        updateState({
          isLoading: false,
          cancelVisible: false,
          waitedAstroData: null,
        });
      })
      .catch(err => {
        console.log(err);
        updateState({isLoading: false});
      });
  };

  const go_home = () => {
    navigation.dispatch(CommonActions.navigate({name: 'home3'}));
  };

  const chat_price = astroData => {
    if (astroData?.Offer_list?.length != 0) {
      return calculate_discount_price({
        actualPrice: sum_price({
          firstPrice: parseFloat(astroData?.chat_price_m),
          secondPrice: parseFloat(astroData?.chat_commission),
        }),
        percentage: parseFloat(astroData?.Offer_list[0]?.discount),
      });
    }
    return sum_price({
      firstPrice: parseFloat(astroData?.chat_price_m),
      secondPrice: parseFloat(astroData?.chat_commission),
    });
  };

  const updateState = data => {
    setState(prevState => {
      const newData = {...prevState, ...data};
      return newData;
    });
  };

  const {
    backClickCount,
    isLoading,
    astrologerData,
    modalVisible,
    refreshing,
    activeFilter,
    astroData,
    kundliId,
    chatId,
    firebaseId,
    pauseVisible,
    cancelVisible,
    waitedAstroData,
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
    bannerData,
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
              {waitedAstroData && (
                <WaitedAstrologer
                  waitedAstroData={waitedAstroData}
                  updateState={updateState}
                  pause_wait_time={pause_wait_time}
                  cancel_waited_astro={cancel_waited_astro}
                />
              )}

              {astrologerData && onlineAstrologerInfo()}
              {isExtraLoading && extroLoadingInfo()}
            </>
          }
          contentContainerStyle={{paddingBottom: Sizes.fixPadding * 8}}
        />
      </View>
      {requestingModalInfo()}
      {chatModalDetailesInfo()}
      {pauseModalInfo()}
      {cancelModalInfo()}
      {astrologerFiltersInfo()}
    </View>
  );

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
        selectedGenderFilters={selectedGenderFilters}
        activeFilter={activeFilter}
        get_astrologer={get_astrologer}
      />
    );
  }

  function cancelModalInfo() {
    const on_chat = astroData => {
      updateState({astroData: astroData});
      if (parseFloat(wallet) >= chat_price(astroData)) {
        check_status(astroData);
      } else if (astroData?.moa == '1') {
        check_status(astroData);
      } else {
        setChatModalVisible(true);
      }
    };

    const renderItem = ({item, index}) => {
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate('astrologerDetailes', {
              data: item?.id,
            })
          }
          style={{
            width: SCREEN_WIDTH * 0.4,
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
            backgroundColor: Colors.white,
            alignItems: 'center',
          }}>
          <Image
            source={require('../assets/gifs/trending.gif')}
            style={{width: '100%', height: Sizes.fixPadding * 2}}
          />
          <View
            style={{
              paddingHorizontal: Sizes.fixPadding * 0.3,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={{uri: item.image}}
              style={{
                width: SCREEN_WIDTH * 0.14,
                height: SCREEN_WIDTH * 0.14,
                borderRadius: 1000,
                alignSelf: 'center',
                borderWidth: 1,
                borderColor: Colors.primaryLight,
                marginVertical: Sizes.fixPadding * 0.5,
              }}
            />
            <Stars
              default={4}
              count={5}
              half={true}
              starSize={14}
              fullStar={
                <Ionicons name={'star'} size={14} color={Colors.primaryLight} />
              }
              emptyStar={
                <Ionicons
                  name={'star-outline'}
                  size={14}
                  color={Colors.primaryLight}
                />
              }
              // halfStar={<Icon name={'star-half'} style={[styles.myStarStyle]} />}
            />
            <Text numberOfLines={1} style={{...Fonts.black14InterMedium}}>
              {item.owner_name}
            </Text>
            <Text style={{...Fonts.gray9RobotoRegular}}>
              ({item.experties})
            </Text>
            <Text style={{...Fonts.gray9RobotoRegular}}>{item.language}</Text>
            <Text
              style={{
                ...Fonts.black11InterMedium,
                marginTop: Sizes.fixPadding * 0.2,
              }}>
              ₹{chat_price(item)}/min
            </Text>
            <View
              style={{
                marginVertical: Sizes.fixPadding,
              }}>
              <TouchableOpacity
                style={{
                  width: SCREEN_WIDTH * 0.14,
                  alignSelf: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor:
                    item.current_status == 'Busy'
                      ? Colors.red_a
                      : item?.current_status == 'Online'
                      ? Colors.green_a
                      : Colors.primaryLight,
                  borderRadius: Sizes.fixPadding * 0.5,
                  paddingVertical: Sizes.fixPadding * 0.4,
                  backgroundColor:
                    item.current_status == 'Busy' ? Colors.red_a : Colors.white,
                }}>
                <Text
                  style={{
                    ...Fonts.black12RobotoRegular,
                    color:
                      item.current_status == 'Busy'
                        ? Colors.white
                        : item?.current_status == 'Online'
                        ? Colors.green_a
                        : Colors.primaryLight,
                  }}>
                  Chat
                </Text>
              </TouchableOpacity>
              <Text
                style={{
                  ...Fonts.black14RobotoRegular,
                  color:
                    item.current_status == 'Busy'
                      ? Colors.red_a
                      : item?.current_status == 'Online'
                      ? Colors.green_a
                      : Colors.primaryLight,
                }}>
                {item.current_status == 'Busy'
                  ? `Wait - ${item.max_call_min_last_user} min`
                  : item?.current_status == 'Online'
                  ? 'Available Now'
                  : ''}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    };

    return (
      <Modal
        visible={cancelVisible}
        onDismiss={() => updateState({cancelVisible: false})}
        contentContainerStyle={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View>
          <View
            style={{
              flex: 0,
              alignSelf: 'center',
              borderRadius: Sizes.fixPadding,
              elevation: 10,
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.2,
              paddingVertical: Sizes.fixPadding * 1.5,
              backgroundColor: Colors.grayLight,
              width: SCREEN_WIDTH * 0.9,
              zIndex: -1,
            }}>
            <Text
              style={{
                ...Fonts.black16RobotoMedium,
                color: Colors.blackLight,
                textAlign: 'center',
              }}>
              Leave waitlist ?
            </Text>
            <View
              style={{
                padding: Sizes.fixPadding,
                backgroundColor: Colors.white,
                margin: Sizes.fixPadding * 1.5,
                borderRadius: Sizes.fixPadding,
              }}>
              <Text
                style={{
                  ...Fonts.gray14RobotoRegular,
                }}>
                Instead of leaving the waitlist, you may also join the waitlist
                of these trending astrologers
              </Text>
            </View>
            <View style={{width: '110%', alignSelf: 'center'}}>
              <FlatList
                data={astrologerData}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                horizontal
                contentContainerStyle={{paddingRight: Sizes.fixPadding * 1.5}}
              />
            </View>
            <View
              style={[
                styles.row,
                {
                  justifyContent: 'space-between',
                  marginHorizontal: Sizes.fixPadding * 1.5,
                },
              ]}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => updateState({cancelVisible: false})}
                style={{
                  width: '47%',
                  borderRadius: 1000,
                  overflow: 'hidden',
                  paddingVertical: Sizes.fixPadding * 0.8,
                  backgroundColor: Colors.blackLight,
                }}>
                <Text
                  style={{...Fonts.white16RobotoMedium, textAlign: 'center'}}>
                  Go Back
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={cancel_waited_astro}
                style={{width: '47%', borderRadius: 1000, overflow: 'hidden'}}>
                <LinearGradient
                  colors={[Colors.primaryLight, Colors.primaryDark]}
                  style={{paddingVertical: Sizes.fixPadding * 0.8}}>
                  <Text
                    style={{...Fonts.white16RobotoMedium, textAlign: 'center'}}>
                    Leave
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  function pauseModalInfo() {
    return (
      <Modal
        visible={pauseVisible}
        onDismiss={() => updateState({pauseVisible: false})}
        contentContainerStyle={{
          flex: 0,
          padding: Sizes.fixPadding * 1.5,
          backgroundColor: Colors.grayLight,
          width: SCREEN_WIDTH * 0.75,
          alignSelf: 'center',
          borderRadius: Sizes.fixPadding,
          elevation: 10,
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.2,
        }}>
        <View>
          <Text
            style={{
              ...Fonts.black16RobotoMedium,
              color: Colors.blackLight,
              textAlign: 'center',
            }}>
            Pause Waitlist ?
          </Text>
          <View
            style={{
              padding: Sizes.fixPadding,
              backgroundColor: Colors.white,
              marginVertical: Sizes.fixPadding * 1.5,
              borderRadius: Sizes.fixPadding,
            }}>
            <View style={[styles.row, {marginBottom: Sizes.fixPadding}]}>
              <View
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: Colors.grayLight,
                  borderRadius: 20,
                  ...styles.center,
                }}>
                <Text
                  style={{
                    ...Fonts.black16RobotoMedium,
                    color: Colors.blackLight,
                  }}>
                  !
                </Text>
              </View>
              <Text
                style={{
                  ...Fonts.black16RobotoMedium,
                  color: Colors.blackLight,
                  marginLeft: Sizes.fixPadding,
                }}>
                Note
              </Text>
            </View>
            <View
              style={[
                styles.row,
                {alignItems: 'flex-start', marginBottom: Sizes.fixPadding},
              ]}>
              <Text
                style={{
                  ...Fonts.black14InterMedium,
                  color: Colors.blackLight,
                }}>
                1.
              </Text>
              <Text
                style={{
                  ...Fonts.gray14RobotoRegular,
                  marginLeft: Sizes.fixPadding,
                }}>
                You'll not get a call/chat request till you resume it
              </Text>
            </View>
            <View
              style={[
                styles.row,
                {alignItems: 'flex-start', marginBottom: Sizes.fixPadding},
              ]}>
              <Text
                style={{
                  ...Fonts.black14InterMedium,
                  color: Colors.blackLight,
                }}>
                2.
              </Text>
              <Text
                style={{
                  ...Fonts.gray14RobotoRegular,
                  marginLeft: Sizes.fixPadding,
                }}>
                Even when the chat/call is paused, your wait time will keep
                reducing. (i.e. you will get priority when you resume)
              </Text>
            </View>
          </View>
          <View style={[styles.row, {justifyContent: 'space-between'}]}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => updateState({pauseVisible: false})}
              style={{
                width: '47%',
                borderRadius: 1000,
                overflow: 'hidden',
                paddingVertical: Sizes.fixPadding * 0.8,
                backgroundColor: Colors.blackLight,
              }}>
              <Text style={{...Fonts.white16RobotoMedium, textAlign: 'center'}}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={pause_wait_time}
              style={{width: '47%', borderRadius: 1000, overflow: 'hidden'}}>
              <LinearGradient
                colors={[Colors.primaryLight, Colors.primaryDark]}
                style={{paddingVertical: Sizes.fixPadding * 0.8}}>
                <Text
                  style={{...Fonts.white16RobotoMedium, textAlign: 'center'}}>
                  Pause
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  function requestingModalInfo() {
    return (
      <Requesting
        customerData={customerData}
        requestingVisible={requestingVisible}
        setRequestingVisible={setRequestingVisible}
        astroData={astroData}
      />
    );
  }

  function chatModalDetailesInfo() {
    return (
      <WalletCheck
        navigation={navigation}
        customerData={customerData}
        chatModalVisible={chatModalVisible}
        setChatModalVisible={setChatModalVisible}
        check_status={check_status}
        wallet={wallet}
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
    const on_chat = astroData => {
      updateState({astroData: astroData});
      if (parseFloat(wallet) >= chat_price(astroData)) {
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
          renderItem={({item, index}) => (
            <AstrologerList
              item={item}
              on_chat={on_chat}
              type="chat"
              navigation={navigation}
            />
          )}
          ListEmptyComponent={<NoDataFound />}
          keyExtractor={item => item.id}
          numColumns={2}
          maxToRenderPerBatch={10}
          initialNumToRender={10}
          onEndReachedThreshold={0.1}
          contentContainerStyle={{paddingRight: Sizes.fixPadding * 1.5}}
          onEndReached={() => {
            get_astrologer_on_end_reach(activeFilter, currentIndex + 1);
          }}
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
            height: SCREEN_WIDTH * 0.18,
            marginRight: Sizes.fixPadding,
            borderRadius: Sizes.fixPadding,
            overflow: 'hidden',
            borderWidth: 2,
            borderColor: Colors.grayLight,
          }}>
          <Image
            source={{uri: img_url + item.image}}
            style={{width: '100%', height: '100%'}}
          />
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
          Chat with Astrologer
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
  customerData: state.user.userData,
  wallet: state.user.wallet,
});

const mapDispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, mapDispatchToProps)(Chat);

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
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    height: 30,
    borderRadius: 30,
    backgroundColor: Colors.grayLight,
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
