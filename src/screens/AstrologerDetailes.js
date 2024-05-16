import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors, Fonts, Sizes} from '../assets/style';
import AntDesign from 'react-native-vector-icons/AntDesign'; 
import MyStatusBar from '../components/MyStatusBar';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../config/Screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import Stars from 'react-native-stars';
import Feather from 'react-native-vector-icons/Feather';
import {
  accept_chat,
  api2_create_kundali,
  api_astro_call_to_astrologer,
  api_astrodetails,
  api_callintakesubmit,
  api_checkfollowing,
  api_follow,
  api_getastrochatstatus,
  api_url,
  base_url,
  call_astrologer,
  call_wating_user,
  check_call_astro_status,
  kundli_get_kundli,
  review_api,
  user_review,
} from '../config/constants';
import {connect} from 'react-redux';
import {showToastWithGravityAndOffset} from '../methods/toastMessage';
import axios from 'axios';
import * as UserActions from '../redux/actions/UserActions';
import Loader from '../components/Loader';
import moment from 'moment';
import database from '@react-native-firebase/database';
import {CommonActions} from '@react-navigation/native';
import {Modal} from 'react-native-paper';
import {calculate_discount_price, sum_price} from '../methods/calculatePrice';
import ImageView from '../components/ImageView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ChatActions from '../redux/actions/ChatActions';

let timeout;

const AstrologerDetailes = ({
  navigation,
  route,
  customerData,
  wallet,
  dispatch,
}) => {
  // console.log(customerData)
  const [astroID] = useState(route?.params?.data);
  const [isLoading, setIsLoading] = useState(false);
  const [kundliId, setKundliId] = useState(null);
  const [reviewData, setReviewData] = useState(null);
  const [isFollow, setIsfollow] = useState(null);
  const [astroDetails, setAstroDetailes] = useState(null);
  const [follower, setFollower] = useState(null);
  const [firebaseId, setFirebaseId] = useState(null);
  const [chatId, setChatId] = useState(null);
  const [chatModalVisible, setChatModalVisible] = useState(false);
  const [requestingVisible, setRequestingVisible] = useState(false);
  const [gallaryData, setGallaryData] = useState(null);
  const [experites, setExperties] = useState(null);

  const [state, setState] = useState({
    imageVisible: false,
    imageURI: null,
    isShowMore: false,
  });

  useEffect(() => {
    database()
      .ref(`/CurrentRequest/${astroID}`)
      .on('value', async snapshot => {
        if (
          snapshot.val()?.status == 'Accept' &&
          snapshot.val()?.sid == customerData?.id
        ) {
          clearTimeout(timeout);
          await accept_chat_transid();
        }
      });
    return () => {
      database().ref(`/CurrentRequest/${astroID}`).off();
    };
  }, [chatId]);

  useEffect(() => {
    get_all_astro_detailes();
  }, []);

  const get_all_astro_detailes = async () => {
    try {
      setIsLoading(true);
      const data = await AsyncStorage.getItem('FirebaseId');
      setFirebaseId(data);
      const astro_detailes = await axios({
        method: 'post',
        url: api_url + api_astrodetails,
        data: {
          id: astroID,
          customer_id: customerData?.id,
        },
      });

      const is_follow_data = await axios({
        method: 'post',
        url: api_url + api_checkfollowing,
        data: {
          user_id: customerData.id,
          astro_id: astroID,
        },
      });

      const user_review_data = await axios({
        method: 'get',
        url: api_url + review_api + `?id=${astroID}&type=astrologer`,
      });

      let arr = astro_detailes.data.gallery;
      let groupedArray = [];
      for (let i = 0; i < arr.length; i += 2) {
        if (i + 1 < arr.length) {
          groupedArray.push([arr[i], arr[i + 1]]);
        } else {
          groupedArray.push([arr[i]]);
        }
      }

      let astro_experties = [
        // ...astro_detailes.data?.expertise,
        ...astro_detailes?.data?.mainexpertise,
      ]
        .map(item => item.name)
        .join(', ');

      if (is_follow_data.data.records != null) {
        setIsfollow(is_follow_data.data.records.status);
      } else {
        setIsfollow(0);
      }

      if (astro_detailes?.data?.gallery?.length != 0) {
        setGallaryData(astro_detailes.data.gallery);
      }
      setAstroDetailes(astro_detailes.data);
      setReviewData(user_review_data.data.data);
      setFollower(is_follow_data.data.counts);
      setExperties(astro_experties);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      console.log(e);
    }
  };

  const check_is_follow = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + api_checkfollowing,
      data: {
        user_id: customerData.id,
        astro_id: astroID,
      },
    })
      .then(res => {
        setIsLoading(false);
        if (res.data.records != null) {
          setIsfollow(res.data.records.status);
        } else {
          setIsfollow(0);
        }
        setFollower(res.data.counts);
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const follow_astrologer = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + api_follow,
      data: {
        user_id: customerData.id,
        astro_id: astroID,
        status: isFollow == '1' ? 0 : 1,
      },
    })
      .then(res => {
        setIsLoading(false);
        check_is_follow();
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const check_status = async type => { 
    setIsLoading(true);
    try {
      const status_result = await axios.post(api_url + api_getastrochatstatus, {
        astro_id: astroID,
      });
      if (status_result.data.online) {
        setIsLoading(false);
        on_chat_submit();
      } else if (status_result.data.data.current_status == 'Busy') {
        await axios({
          method: 'post',
          url: api_url + call_wating_user,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          data: {
            astro_id: astroID,
            user_id: customerData?.id,
            type: 2,
            status: 1,
          },
        }).then(res => console.log(res.data));
        showToastWithGravityAndOffset(
          `Astrologer is ${status_result.data.data.current_status}.`,
        );
        setIsLoading(false);
      } else {
        showToastWithGravityAndOffset(
          `Astrologer is ${status_result.data.data.current_status}.`,
        );
        setIsLoading(false);
      }
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  };

  const on_call_submit = async () => {
    setChatModalVisible(false);
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
    setIsLoading(true);
    const details = await axios({
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
        astro_id: astroID,
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
    });

    const invoice_id = await axios({
      method: 'post',
      url: api_url + api_astro_call_to_astrologer,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        astrologer_id: astroID,
        kundli_id: kundli.data.kundli_id,
        user_id: customerData.id,
      },
    });
    // props.dispatch(UserActions.setCallInvoiceId(invoice_id.data));
    return new Promise((resolve, reject) => {
      // Perform your pre-send invitation logic here
      // For example, you can prompt the user for confirmation
      const confirmation = true;
      // If the user confirms, resolve the Promise with true
      if (confirmation) {
        setIsLoading(false);
        resolve(true);
      } else {
        // If the user cancels, resolve the Promise with false
        setIsLoading(false);
        resolve(false);
      }
    });
  };

  const check_astro_call_status = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + check_call_astro_status,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        astro_id: astroID,
      },
    })
      .then(res => {
        setIsLoading(false);
        if (res.data.status == '200') {
          if (res.data.data.current_status_call == 'Online') {
            call_to_astrologer();
          } else {
            showToastWithGravityAndOffset(`Astrologer ${res.data?.data?.current_status_call}`);
          }
        }
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const call_to_astrologer = async () => {
    setIsLoading(true);
    let offer_id =
      astroDetails?.records[0]?.offer.length != 0
        ? astroDetails?.records[0]?.offer[0]?.id
        : '0';
    await axios({
      method: 'post',
      url: api_url + call_astrologer,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        user_id: customerData?.id,
        astrologer_user_id: astroID,
        moblie_no: customerData?.phone,
        moa: astroDetails?.records[0]?.moa,
        tranding: astroDetails?.records[0]?.chat_trending,
        offer_id: offer_id,
      },
    })
      .then(res => {
        console.log(res.data);
        setIsLoading(false);
        setRequestingVisible(true);
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const on_chat_submit = async kundli_id => {
    setChatModalVisible(false);
    setIsLoading(true);
    const kundli = await axios({
      method: 'post',
      url: api_url + api2_create_kundali,
      headers: {
        'content-type': 'multipart/form-data',
      },
      data: {
        user_id: customerData.id,
        customer_name: customerData?.username,
        dob: customerData?.date_of_birth,
        gender: customerData?.gender,
        tob: customerData?.time_of_birth,
        latitude: customerData?.lat,
        longitude: customerData?.lon,
        place: customerData?.place_of_birth,
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
        astro_id: astroID,
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
        kundli_id: kundli.data.kundli_id, //kundli_id,
      },
    })
      .then(res => {
        setIsLoading(false);
        setRequestingVisible(true);
        current_request_for_chat(wallet, kundli.data.kundli_id);
        database()
          .ref(`UserId/${astroID}`)
          .on('value', snapshot => {
            const userMessage = database()
              .ref(`/Messages/${firebaseId}/${snapshot.val()}`)
              .push();
            const messageId = userMessage.key;
            const notificationRef = database().ref(
              `/Notifications/${snapshot.val()}`,
            );
            const notificationId = notificationRef.key;
            database().ref(`/Notifications/${notificationId}`).set({
              from: firebaseId,
              type: 'message',
            });
          });
        add_message();
        send_request();
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const accept_chat_transid = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + accept_chat,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        user_id: customerData.id,
        astro_id: astroID,
      },
    })
      .then(res => {
        setIsLoading(false);
        setRequestingVisible(false);
        const minutes = (parseFloat(wallet) / chat_price()).toFixed(0) * 60;
        const nodeRef_a = database().ref(
          `/CustomerCurrentRequest/${customerData.id}`,
        );
        nodeRef_a
          .update({
            astroData: astroDetails?.records[0],
            chat_id: chatId,
            status: 'pending',
            remedies: 'null',
          })
          .then(() => {
            navigation.dispatch(
              CommonActions.reset({
                index: 3,
                routes: [
                  {
                    name: 'acceptChat',
                    params: {
                      astro_id: astroID,
                      trans_id: res.data.result.transid,
                      chat_id: chatId,
                    },
                  },
                ],
              }),
            );
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const send_request = async () => {
    setIsLoading(true);
    let offer_id =
      astroDetails?.records[0]?.offer.length != 0
        ? astroDetails?.records[0]?.offer[0]?.id
        : '';
    await axios({
      method: 'get',
      url: `${base_url}user/chat_in.php?u_id=${
        customerData.id
      }&a_id=${astroID}&form_id=2&in_id=${moment(new Date()).format(
        'DD-MM-YYYY HH:MM:ss',
      )}&message=Chat in time&offer_id=${offer_id}&moa=${
        astroDetails?.records[0]?.moa
      }&tranding=${astroDetails?.records[0]?.chat_trending}`,
    })
      .then(res => {
        setChatId(res.data.chat_id);
        setIsLoading(false);
        timeout = setTimeout(() => {
          setRequestingVisible(false);
          // dispatch(
          //   ChatActions.updateIntiatedChat({
          //     request_id: astroID,
          //     requested_user: customerData?.id,
          //     request_status: 'REJECTED',
          //   }),
          // );
        }, 1000 * 60 * 2);
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  function generateUniqueId() {
    const timestamp = Date.now().toString(16); // Convert current timestamp to hexadecimal
    const randomString = Math.random().toString(16).substr(2, 8); // Generate a random hexadecimal string

    // Combine timestamp and random string, and ensure it is 16 characters long
    const uniqueId = (timestamp + randomString).substr(0, 16);

    return uniqueId;
  }

  const add_message = () => {
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
      '\nAddress = ' +
      `${customerData?.current_address}` +
      '\nBirth Place = ' +
      `${customerData?.place_of_birth}` +
      '\nOccupation = ' +
      `${customerData?.occupation}` +
      '\nProblem = ' +
      `${customerData?.problem}`;

    database()
      .ref(`/UserId/${astroID}`)
      .on('value', snapshot => {
        // const chat_id = firebaseId + '+' + snapshot.val();
        const chat_id = `customer${customerData?.id}+astro${astroID}`;
        const sendMessage = {
          _id: generateUniqueId(),
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
          receiverId: `astro${astroID}`,
        };
        const node = database().ref(`/UserId/${astroID}`).push();
        const key = node.key;
        database().ref(`/Messages/${chat_id}/${key}`).set(sendMessage);
      });
  };

  const current_request_for_chat = (wallet, kundli_id) => {
    let minutes = 0;
    minutes = (parseFloat(wallet) / chat_price()).toFixed(2) * 60;

    if (astroDetails?.records[0]?.moa == '1') {
      minutes = minutes + 300;
    }
    const astrologerData = {
      date: '',
      msg: `Request send to ${astroDetails?.records[0]?.owner_name}`,
      name: astroDetails?.records[0]?.owner_name,
      pic: astroDetails?.records[0]?.image,
      rid: astroID,
      sid: customerData.id,
      status: 'Pending',
      timestamp: new Date().getTime(),
      wallet: wallet,
      minutes: minutes,
      invoice_id: '',
    };

    const nodeRef = database().ref(`/CurrentRequest/${astroID}`);
    const nodeRef_a = database().ref(
      `/CustomerCurrentRequest/${customerData.id}`,
    );
    nodeRef.update(astrologerData);
    nodeRef_a.update({minutes, kundli_id});
  };

  const get_invoice_id = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + api_astro_call_to_astrologer,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        astrologer_id: astroID,
        kundli_id: kundliId,
        user_id: customerData.id,
      },
    })
      .then(res => {
        setIsLoading(false);
        dispatch(UserActions.setCallInvoiceId(res.data));
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const chat_price = () => {
    if (astroDetails?.records[0]?.offer.length != 0) {
      return calculate_discount_price({
        actualPrice: sum_price({
          firstPrice: parseFloat(astroDetails?.records[0]?.chat_price_m),
          secondPrice: parseFloat(astroDetails?.records[0]?.chat_commission),
        }),
        percentage: parseFloat(astroDetails?.records[0]?.offer[0]?.discount),
      });
    }
    return sum_price({
      firstPrice: parseFloat(astroDetails?.records[0]?.chat_price_m),
      secondPrice: parseFloat(astroDetails?.records[0]?.chat_commission),
    });
  };

  const call_price = () => {
    if (astroDetails?.records[0]?.offer.length != 0) {
      return calculate_discount_price({
        actualPrice: sum_price({
          firstPrice: parseFloat(astroDetails?.records[0]?.call_price_m),
          secondPrice: parseFloat(astroDetails?.records[0]?.call_commission),
        }),
        percentage: parseFloat(astroDetails?.records[0]?.offer[0]?.discount),
      });
    }
    return sum_price({
      firstPrice: parseFloat(astroDetails?.records[0]?.call_price_m),
      secondPrice: parseFloat(astroDetails?.records[0]?.call_commission),
    });
  };

  const updateState = data => {
    setState(prevState => {
      const newData = {...prevState, ...data};
      return newData;
    });
  };

  const {imageVisible, imageURI, isShowMore} = state;

  return (
    <View style={{flex: 1, backgroundColor: Colors.bodyColor}}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      <Loader visible={isLoading} />
      <View style={{flex: 1}}>
        {header()}
        {astroDetails && (
          <FlatList
            ListHeaderComponent={
              <>
                {profileInfo()}
                {astroDetails?.records[0]?.long_bio && abuoutMeInfo()}
                {gallaryData && gallaryInfo()}
                {customerReviewInfo()}
              </>
            }
          />
        )}
      </View>
      {bottomButtons()}
      {chatModalDetailesInfo()}
      {requestingModalInfo()}
      {imageViewInfo()}
    </View>
  );

  function imageViewInfo() {
    return (
      <ImageView
        imageVisible={imageVisible}
        updateState={updateState}
        image={imageURI}
      />
    );
  }

  function requestingModalInfo() {
    return (
      <Modal
        visible={requestingVisible}
        onDismiss={() => setRequestingVisible(false)}
        contentContainerStyle={{
          flex: 0,
          elevation: 8,
          shadowColor: Colors.blackLight,
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.2,
        }}>
        <LinearGradient
          colors={[Colors.primaryLight, Colors.primaryDark]}
          style={{
            paddingTop: Sizes.fixPadding * 2,
            marginHorizontal: Sizes.fixPadding * 2.5,
            borderRadius: Sizes.fixPadding * 1.5,
          }}>
          <Text
            style={{
              ...Fonts.white18RobotMedium,
              fontFamily: 'Roboto-Bold',
              fontSize: 20,
              textAlign: 'center',
            }}>
            Connecting...
          </Text>
          <View
            style={{
              borderBottomWidth: 1,
              marginTop: Sizes.fixPadding,
              marginHorizontal: Sizes.fixPadding * 1.5,
              borderStyle: 'dashed',
              borderColor: Colors.white,
            }}
          />
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingVertical: Sizes.fixPadding * 2,
              // height: SCREEN_HEIGHT * 0.45,
            }}>
            <View style={styles.center}>
              <View
                style={{
                  width: SCREEN_WIDTH * 0.2,
                  height: SCREEN_WIDTH * 0.2,
                  borderRadius: 1000,
                  elevation: 8,
                  shadowOffset: {
                    width: 0,
                    height: 1,
                  },
                  shadowOpacity: 0.2,
                }}>
                <Image
                  source={{
                    uri: base_url + 'admin/' + customerData?.user_profile_image,
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 1000,
                  }}
                />
              </View>
              <Text
                style={{
                  ...Fonts.white16RobotoMedium,
                  marginTop: Sizes.fixPadding,
                }}>
                {customerData?.username}
              </Text>
            </View>
            <Image
              source={require('../assets/gifs/connecting.gif')}
              style={{
                width: 40,
                height: 60,
                transform: [{rotate: '90deg'}],
              }}
            />
            <View style={styles.center}>
              <View
                style={{
                  width: SCREEN_WIDTH * 0.2,
                  height: SCREEN_WIDTH * 0.2,
                  borderRadius: 1000,
                  elevation: 8,
                  shadowOffset: {
                    width: 0,
                    height: 1,
                  },
                  shadowOpacity: 0.2,
                }}>
                <Image
                  source={{
                    uri: astroDetails?.records[0]?.image,
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 1000,
                  }}
                />
              </View>
              <Text
                style={{
                  ...Fonts.white16RobotoMedium,
                  marginTop: Sizes.fixPadding,
                }}>
                {astroDetails?.records[0]?.owner_name}
              </Text>
            </View>
          </View>
          <View
            style={{
              backgroundColor: Colors.grayLight,
              padding: Sizes.fixPadding,
              borderRadius: Sizes.fixPadding * 1.5,
              elevation: 8,
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.2,
            }}>
            <Text
              style={{
                ...Fonts.white14RobotoMedium,
                color: Colors.blackLight,
                textAlign: 'center',
                paddingBottom: Sizes.fixPadding * 4,
              }}>
              While you wait for Astro Guruji, you may also Chat Chat (wait 4
              min) explore other astrologers and join their waitlist.
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setRequestingVisible(false)}
              style={{
                position: 'absolute',
                bottom: -Sizes.fixPadding * 2,
                alignSelf: 'center',
                backgroundColor: Colors.primaryLight,
                paddingHorizontal: Sizes.fixPadding * 3,
                paddingVertical: Sizes.fixPadding,
                borderRadius: Sizes.fixPadding,
                borderWidth: 3,
                borderColor: Colors.white,
              }}>
              <Text style={{...Fonts.white18RobotMedium}}>OK</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Modal>
    );
  }

  function chatModalDetailesInfo() {
    const is_customer_login = () => {
      if (customerData) {
        if (customerData?.username == null) {
          navigation.navigate('register', {
            id: customerData?.id,
            phone_number: customerData?.phone,
          });
        } else {
          if (parseFloat(wallet) >= chat_price()) {
            check_status();
          }
        }
      } else {
        navigation.navigate('login');
      }
    };

    const chat_wallet_check = () => {
      if (parseFloat(wallet) <= chat_price()) {
        return true;
      } else {
        return false;
      }
    };

    const call_wallet_check = () => {
      if (parseFloat(wallet) <= call_price()) {
        return true;
      } else {
        return false;
      }
    };

    return (
      <Modal
        visible={chatModalVisible}
        onDismiss={() => setChatModalVisible(false)}
        contentContainerStyle={{
          flex: 0,
          paddingVertical: Sizes.fixPadding * 2,
          backgroundColor: Colors.white,
          marginHorizontal: Sizes.fixPadding * 1.5,
          borderRadius: Sizes.fixPadding * 2,
          elevation: 8,
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.2,
        }}>
        <View style={{}}>
          <View
            style={[
              styles.row,
              {
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                paddingHorizontal: Sizes.fixPadding,
                borderBottomWidth: 1,
                borderBottomColor: Colors.grayLight,
                paddingBottom: Sizes.fixPadding * 0.5,
              },
            ]}>
            <View>
              <LinearGradient
                colors={[Colors.primaryLight, Colors.primaryDark]}
                style={[
                  styles.row,
                  {
                    paddingHorizontal: Sizes.fixPadding,
                    paddingVertical: Sizes.fixPadding * 0.5,
                    borderRadius: 1000,
                  },
                ]}>
                <Ionicons
                  name="wallet-outline"
                  color={Colors.white}
                  size={26}
                />
                <Text
                  style={{
                    ...Fonts.white14RobotoMedium,
                    marginLeft: Sizes.fixPadding,
                  }}>
                  ₹ {wallet}
                </Text>
              </LinearGradient>
              {chat_wallet_check() && (
                <Text
                  style={{
                    ...Fonts.black12RobotoRegular,
                    textAlign: 'center',
                    color: Colors.red,
                  }}>
                  Low Balance!!
                </Text>
              )}
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setChatModalVisible(false), navigation.navigate('wallet');
              }}>
              <LinearGradient
                colors={[Colors.primaryLight, Colors.primaryDark]}
                style={[
                  styles.row,
                  {
                    paddingHorizontal: Sizes.fixPadding,
                    paddingVertical: Sizes.fixPadding * 0.9,
                    borderRadius: 1000,
                  },
                ]}>
                <Text
                  style={{
                    ...Fonts.white14RobotoMedium,
                    marginLeft: Sizes.fixPadding,
                  }}>
                  Recharge Now
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <View
            style={{
              width: SCREEN_WIDTH * 0.22,
              height: SCREEN_WIDTH * 0.22,
              borderWidth: 1,
              borderRadius: 10000,
              borderColor: Colors.primaryLight,
              overflow: 'hidden',
              alignSelf: 'center',
              position: 'relative',
              bottom: Sizes.fixPadding * 1.5,
              padding: 1,
              elevation: 8,
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.2,
            }}>
            <Image
              source={{uri: astroDetails?.records[0]?.image}}
              style={{
                height: '100%',
                width: '100%',
                borderWidth: 1,
                borderColor: Colors.white,
                borderRadius: 1000,
              }}
            />
          </View>
          <View style={{position: 'relative', bottom: Sizes.fixPadding * 0.5}}>
            <Text
              style={{
                ...Fonts.primaryLight18RobotoMedium,
                fontSize: 22,
                textAlign: 'center',
              }}>
              {astroDetails?.records[0]?.owner_name}
            </Text>
            {/* <Text style={{...Fonts.gray14RobotoMedium, textAlign: 'center'}}>
              Wait Time - 5 min
            </Text> */}
            <View
              style={[
                styles.row,
                {
                  marginHorizontal: Sizes.fixPadding,
                  elevation: 5,
                  shadowOffset: {
                    width: 0,
                    height: 1,
                  },
                  shadowOpacity: 0.2,
                  shadowColor: Colors.gray,
                  marginBottom: Sizes.fixPadding * 1.5,
                  marginTop: Sizes.fixPadding,
                  borderWidth: 1,
                  borderColor: Colors.grayLight,
                  backgroundColor: Colors.white,
                  padding: Sizes.fixPadding,
                  borderRadius: Sizes.fixPadding,
                },
              ]}>
              <Ionicons name="call" color={Colors.primaryLight} size={20} />
              <Text
                style={{
                  ...Fonts.gray14RobotoMedium,
                  marginLeft: Sizes.fixPadding,
                }}>
                Audio Call @ {call_price()}/min
              </Text>
              <View style={{flex: 1, alignItems: 'flex-end'}}>
                <TouchableOpacity>
                  <LinearGradient
                    colors={[Colors.primaryLight, Colors.primaryDark]}
                    style={[
                      {
                        width: 80,
                        paddingVertical: Sizes.fixPadding * 0.5,
                        borderRadius: 1000,
                      },
                    ]}>
                    <Text
                      style={{
                        ...Fonts.white14RobotoMedium,
                        textAlign: 'center',
                      }}>
                      Call
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={[
                styles.row,
                {
                  marginHorizontal: Sizes.fixPadding,
                  elevation: 5,
                  shadowOffset: {
                    width: 0,
                    height: 1,
                  },
                  shadowOpacity: 0.2,
                  shadowColor: Colors.gray,
                  borderWidth: 1,
                  borderColor: Colors.grayLight,
                  backgroundColor: Colors.white,
                  padding: Sizes.fixPadding,
                  borderRadius: Sizes.fixPadding,
                },
              ]}>
              <Ionicons
                name="chatbubble-ellipses-outline"
                color={Colors.primaryLight}
                size={20}
              />
              <Text
                style={{
                  ...Fonts.gray14RobotoMedium,
                  marginLeft: Sizes.fixPadding,
                }}>
                Chat @ {chat_price()}/min
              </Text>
              <View style={{flex: 1, alignItems: 'flex-end'}}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => is_customer_login()}
                  // disabled={chat_wallet_check()}
                >
                  <LinearGradient
                    colors={[Colors.primaryLight, Colors.primaryDark]}
                    style={[
                      {
                        width: 80,
                        paddingVertical: Sizes.fixPadding * 0.5,
                        borderRadius: 1000,
                      },
                    ]}>
                    <Text
                      style={{
                        ...Fonts.white14RobotoMedium,
                        textAlign: 'center',
                      }}>
                      Chat
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  function bottomButtons() {
    const on_chat = async () => {
      const check_is_register = await AsyncStorage.getItem('isRegister');
      const isRegister = JSON.parse(check_is_register);
      if (isRegister?.value) {
        if (parseFloat(wallet) >= chat_price()) {
          check_status();
        } else if (astroDetails?.records[0]?.moa == '1') {
          check_status();
        } else {
          setChatModalVisible(true);
        }
      } else {
        if (isRegister?.type == 'profile') {
          navigation.navigate('profile');
        } else {
          navigation.navigate('login');
        }
      }
    };

    const on_call = async () => {
      const check_is_register = await AsyncStorage.getItem('isRegister');
      const isRegister = JSON.parse(check_is_register);
      if (isRegister?.value) {
        if (parseFloat(wallet) >= call_price()) {
          // check_call_status()
          check_astro_call_status();
        } else {
          setChatModalVisible(true);
        }
      } else {
        if (isRegister?.type == 'profile') {
          navigation.navigate('profile');
        } else {
          navigation.navigate('login');
        }
      }
    };
    return (
      <View
        style={[
          styles.row,
          {justifyContent: 'space-evenly', marginVertical: Sizes.fixPadding},
        ]}>
        <TouchableOpacity
          onPress={on_chat}
          activeOpacity={0.8}
          style={{width: '45%', overflow: 'hidden'}}>
          <LinearGradient
            colors={[Colors.primaryLight, Colors.primaryDark]}
            style={[
              styles.row,
              styles.center,
              {
                width: '100%',
                paddingVertical: Sizes.fixPadding * 0.5,
                borderRadius: Sizes.fixPadding * 1.5,
              },
            ]}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              color={Colors.white}
              size={22}
            />
            <Text
              style={{
                ...Fonts.white14RobotoMedium,
                marginLeft: Sizes.fixPadding,
              }}>
              Chat @ ₹ {chat_price()}/min
            </Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={on_call}
          style={[
            styles.row,
            styles.center,
            {
              borderWidth: 2,
              width: '45%',
              borderRadius: Sizes.fixPadding * 1.5,
              paddingVertical: Sizes.fixPadding * 0.4,
              borderColor: Colors.primaryDark,
            },
          ]}>
          <Feather name="phone-call" color={Colors.primaryLight} size={20} />
          <Text
            style={{
              ...Fonts.primaryLight14RobotoMedium,
              marginLeft: Sizes.fixPadding,
            }}>
            Call @ ₹ {call_price()}/min
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  function gallaryInfo() {
    const renderItem = ({item, index}) => {
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            updateState({
              imageVisible: true,
              imageURI: item,
            })
          }>
          <Image
            source={{uri: item}}
            style={{
              width: SCREEN_WIDTH * 0.2,
              height: SCREEN_WIDTH * 0.2,
              margin: 5,
              borderRadius: Sizes.fixPadding,
              resizeMode: 'contain',
            }}
          />
        </TouchableOpacity>
      );
    };
    return (
      <View
        style={{
          borderBottomWidth: 1,
          borderBottomColor: Colors.grayLight,
        }}>
        <Text
          style={{
            ...Fonts.black16RobotoMedium,
            paddingHorizontal: Sizes.fixPadding * 1.5,
            paddingTop: Sizes.fixPadding * 1.5,
          }}>
          Gallery
        </Text>
        <FlatList
          data={gallaryData}
          renderItem={renderItem}
          // keyExtractor={item => item.id}
          numColumns={4}
          contentContainerStyle={{
            paddingHorizontal: Sizes.fixPadding * 1.5,
            paddingBottom: Sizes.fixPadding * 1.5,
          }}
          columnWrapperStyle={{}}
        />
      </View>
    );
  }

  function customerReviewInfo() {
    const renderItem = ({item, index}) => {
      return (
        <View
          style={{
            backgroundColor: Colors.grayLight,
            padding: Sizes.fixPadding,
            borderRadius: Sizes.fixPadding,
            marginBottom: Sizes.fixPadding * 1.5,
            elevation: 5,
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.2,
            shadowColor: Colors.gray,
          }}>
          <View style={[styles.row]}>
            <Image
              source={{uri: item.user_profile_image}}
              style={{width: 25, height: 25, borderRadius: 100}}
            />
            <Text
              style={{
                ...Fonts.gray12RobotoMedium,
                marginHorizontal: Sizes.fixPadding,
              }}>
              {item?.customer_name}
            </Text>
            <Stars
              default={parseInt(item.star)}
              count={5}
              half={true}
              starSize={12}
              fullStar={
                <Ionicons name={'star'} size={12} color={Colors.primaryLight} />
              }
              emptyStar={
                <Ionicons
                  name={'star-outline'}
                  size={12}
                  color={Colors.primaryLight}
                />
              }
              // halfStar={<Icon name={'star-half'} style={[styles.myStarStyle]} />}
            />
          </View>
          <Text
            style={{
              ...Fonts.black11InterMedium,
              marginTop: Sizes.fixPadding,
              color: Colors.blackLight,
            }}>
            {item.rating_comment}
          </Text>
          {item.is_reply && (
            <View style={{marginTop: Sizes.fixPadding}}>
              <Text style={{...Fonts.primaryLight14RobotoRegular}}>
                Astro Kuldeep
              </Text>
              <Text
                style={{
                  ...Fonts.gray11RobotoRegular,
                  marginTop: Sizes.fixPadding * 0.2,
                  color: Colors.blackLight,
                }}>
                {item.text}
              </Text>
            </View>
          )}
        </View>
      );
    };
    return (
      <View
        style={{
          padding: Sizes.fixPadding * 1.5,
          borderBottomWidth: 1,
          borderBottomColor: Colors.grayLight,
        }}>
        <View
          style={[
            styles.row,
            {
              justifyContent: 'space-between',
              marginBottom: Sizes.fixPadding * 2,
            },
          ]}>
          <Text style={{...Fonts.black16RobotoMedium}}>Customer Reviews</Text>
          <TouchableOpacity>
            <Text style={{...Fonts.primaryLight15RobotoRegular}}>View all</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={reviewData}
          renderItem={renderItem}
          keyExtractor={item => item.rating_id}
        />
      </View>
    );
  }

  function abuoutMeInfo() {
    return (
      <View
        style={{
          padding: Sizes.fixPadding * 1.5,
          borderBottomWidth: 1,
          borderBottomColor: Colors.grayLight,
        }}>
        <Text style={{...Fonts.black16RobotoMedium}}>About me</Text>
        <Text
          style={{
            ...Fonts.gray11RobotoRegular,
            // marginTop: Sizes.fixPadding * 0.5,
          }}>
          {!isShowMore && astroDetails?.records[0]?.long_bio
            ? astroDetails?.records[0]?.long_bio.slice(0, 50) + '...'
            : astroDetails?.records[0]?.long_bio}
          {!isShowMore && (
            <Text
              onPress={() => updateState({isShowMore: !isShowMore})}
              style={{
                color: Colors.blueFacebook,
              }}>
              Show more
            </Text>
          )}
          {isShowMore && (
            <Text
              onPress={() => updateState({isShowMore: !isShowMore})}
              style={{
                color: Colors.blueFacebook,
              }}>
              Show less
            </Text>
          )}
        </Text>
      </View>
    );
  }

  function profileInfo() {
    return (
      <View
        style={{
          ...styles.center,
          padding: Sizes.fixPadding * 1.5,
          borderBottomWidth: 1,
          borderBottomColor: Colors.grayLight,
        }}>
        {/* <TouchableOpacity style={{position: 'absolute', right: 10, top: 10}}>
          <Ionicons name="share-social-outline" color={Colors.gray} size={25} />
        </TouchableOpacity> */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            updateState({
              imageVisible: true,
              imageURI: astroDetails?.records[0]?.image,
            })
          }>
          <Image
            source={{uri: astroDetails?.records[0]?.image}}
            style={{
              width: SCREEN_WIDTH * 0.3,
              height: SCREEN_WIDTH * 0.3,
              borderWidth: 3,
              borderRadius: 10000,
              borderColor: Colors.primaryDark,
            }}
          />
        </TouchableOpacity>

        <Text
          style={{
            ...Fonts.black22RobotoMedium,
            marginTop: Sizes.fixPadding * 0.5,
          }}>
          {astroDetails?.records[0]?.owner_name}
        </Text>
        <Text style={{...Fonts.gray16RobotoMedium, textAlign: 'center'}}>
          {experites && experites}
        </Text>
        <Text style={{...Fonts.gray14RobotoMedium}}>
          {astroDetails?.records[0]?.language}
        </Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => follow_astrologer()}>
          <LinearGradient
            colors={[Colors.primaryLight, Colors.primaryDark]}
            style={{
              paddingHorizontal: Sizes.fixPadding * 2,
              paddingVertical: Sizes.fixPadding * 0.5,
              borderRadius: 1000,
              marginVertical: Sizes.fixPadding,
            }}>
            <Text style={{...Fonts.white14RobotoMedium}}>
              {isFollow == 1 ? 'Following' : 'Follow'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
        <View
          style={{
            ...styles.row,
            width: '100%',
            justifyContent: 'space-evenly',
          }}>
          <View style={[styles.boxContainer, styles.center]}>
            <Text style={{...Fonts.gray11RobotoRegular}}>
              ({astroDetails?.records[0]?.avg_rating})
            </Text>
            <Stars
              default={parseInt(astroDetails?.records[0]?.avg_rating)}
              count={5}
              disabled={true}
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
          </View>
          <View style={[styles.boxContainer, styles.center]}>
            <Text style={{...Fonts.gray14RobotoRegular}}>
              Ex. +{astroDetails?.records[0]?.experience} years
            </Text>
          </View>
          <View style={[styles.boxContainer, styles.center]}>
            <Text style={{...Fonts.gray14RobotoMedium}}>{follower}</Text>
            <Text style={{...Fonts.gray12RobotoMedium}}>Followers</Text>
          </View>
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
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            alignSelf: 'flex-start',
            flex: 0.1,
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
          Profile
        </Text>
        <TouchableOpacity style={{flex: 0}}>
          <MaterialIcons
            name="more-vert"
            color={Colors.primaryLight}
            size={Sizes.fixPadding * 2.2}
          />
        </TouchableOpacity>
      </View>
    );
  }
};

const mapStateToProps = state => ({
  customerData: state.user.userData,
  wallet: state.user.wallet,
});

const mapDispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, mapDispatchToProps)(AstrologerDetailes);

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
  boxContainer: {
    width: '28%',
    height: 50,
    backgroundColor: Colors.grayLight,
    borderWidth: 2,
    borderColor: Colors.grayDark + '50',
    borderRadius: Sizes.fixPadding,
  },
});
