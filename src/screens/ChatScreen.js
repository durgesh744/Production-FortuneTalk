import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Image, 
  BackHandler,
  ImageBackground,
} from 'react-native';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Colors, Fonts, Sizes} from '../assets/style';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MyStatusBar from '../components/MyStatusBar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';
import database from '@react-native-firebase/database';
import {
  api2_get_profile,
  api_url,
  base_url,
  deductwallet_chat,
  remedy_list,
} from '../config/constants';
import moment from 'moment';
import {CommonActions, useFocusEffect} from '@react-navigation/native';
import axios from 'axios';
import Loader from '../components/Loader';
import ChatDetailes from '../components/Chat/ChatDetailes';
import InputMessages from '../components/Chat/InputMessages';
import PickImage from '../components/Chat/PickImage';
import Review from '../components/Chat/Review';
import Timer from '../components/Chat/Timer';
import ImageView from '../components/ImageView';
import SuggestedRemedies from '../components/Chat/SuggestedRemedies';
import SuggestedAstromall from '../components/Chat/SuggestedAstromall';
import WalletAlert from '../components/Chat/WalletAlert';
import * as UserActions from '../redux/actions/UserActions';
import * as ChatActions from '../redux/actions/ChatActions';
import {MyMethods} from '../methods/my_methods';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ChatMethods} from '../methods/chatMethods';
import ExitAlert from '../components/Chat/ExitAlert';
import Share from 'react-native-share';
import {Bubble, GiftedChat, Send, Time} from 'react-native-gifted-chat';
import Documets from '../components/Chat/Doucments';
import Voice from '../components/Chat/Voice';
import {tarotValue} from '../config/TarotValue';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../config/Screen';
import Invoice from '../components/Chat/Invoice';
import {ApiRequest} from '../config/api_requests';
import {showToastWithGravityAndOffset} from '../methods/toastMessage';

const ChatScreen = ({
  navigation,
  route,
  wallet,
  userData,
  dispatch,
  customerFirebaseID,
  astroFirebaseID,
}) => {
  const [astroData] = useState(route.params.astroData?.records[0]);
  const [experties] = useState(route.params.astroData?.mainexpertise);
  const [chatData, setChatData] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState('');

  const [state, setState] = useState({
    bottomSheetVisible: false,
    uploading: false,
    isLoading: false,
    reviewModalVisible: false,
    voiceUploading: false,
    imageVisible: false,
    imageViewData: null,
    suggestedRemediesVisible: false,
    suggestedData: null,
    suggestedAstromallData: null,
    suggestedAstromallVisible: false,
    balanceAlert: false,
    startTime: '',
    firebaseId: null,
    exitVisible: false,
    invoiceVisible: false,
  });

  useEffect(() => {
    try {
      get_chats();
      database()
        .ref(`CustomerCurrentRequest/${userData?.id}/remedies`)
        .on('value', snapshot => {
          if (snapshot.val() != 'null') {
            updateState({
              suggestedData: snapshot.val(),
              suggestedRemediesVisible: true,
            });
          }
        });

      database()
        .ref(`CustomerCurrentRequest/${userData?.id}`)
        .on('value', snapshot => {
          if (snapshot.val()?.status == 'End') {
          }
          if (snapshot.val()?.status == 'EndbyAstrologer') {
            dispatch(ChatActions.setInvoiceData(snapshot.val()?.invoiceData));
            updateState({invoiceVisible: true});
            customer_profile(1);
          }
          if (snapshot.val()?.astromall != 'null') {
            updateState({
              suggestedAstromallData: snapshot.val()?.astromall,
              suggestedAstromallVisible: true,
            });
          }
        });
    } catch (e) {
      console.log(e);
    }

    return () => {
      database().ref(`CurrentRequest/${astroData?.id}`).off();
      database().ref(`CustomerCurrentRequest/${userData?.id}/remedies`).off();
      database().ref(`CustomerCurrentRequest/${userData?.id}/astromall`).off();
    };
  }, []);

  const get_chats = async () => {
    try {
      updateState({isLoading: true});
      // const chat_id = customerFirebaseID + '+' + astroFirebaseID;
      const chat_id = `customer${userData?.id}+astro${astroData?.id}`;
      const messagesRef = database()
        .ref(`/Messages/${chat_id}`)
        .orderByChild('createdAt');

      messagesRef.on('value', dataSnapshot => {
        const messages = [];
        dataSnapshot.forEach(childSnapshot => {
          const message = childSnapshot.val();
          // if (!message.received && message.senderId === route?.params?.astroFirebaseID) {
          //   updateMessageStatus(childSnapshot.key);
          // }
          messages.push({...message});
        });

        setChatData(messages.reverse()); // Reverse the array to maintain the order
      });
      updateState({isLoading: false});
    } catch {
      console.log(e);
      updateState({isLoading: false});
    }
  };

  const add_message = async ({
    image = null,
    voice = null,
    pdf = null,
    type = 'text',
    message = '',
  }) => {
    const send_message = {
      from: customerFirebaseID,
      message: message,
      image: image,
      voice: voice,
      pdf: pdf,
      timestamp: new Date().getTime(),
      to: 'dsfnsdhfjhsdjfh',
      type: type,
    };
    setChatData(prev => {
      const newData = [...prev, send_message];
      return newData;
    });
    ChatMethods.send_message({
      message: send_message,
      customerFirebaseID: customerFirebaseID,
      astroFirebaseID: astroFirebaseID,
      customerID: userData?.id,
      astroID: astroData?.id,
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        // Alert.alert('Confirm', 'Are you sure you want to go back?', [
        //   {text: "Don't leave", style: 'cancel', onPress: () => {}},
        //   {
        //     text: 'Yes, leave',
        //     style: 'destructive',
        //     onPress: () => deduct_wallet(),
        //   },
        // ]);
        updateState({exitVisible: true});
        return true;
      };
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => subscription.remove();
    }, [navigation]),
  );

  const onSend = (messages = []) => {
    const msg = messages[0];
    let sendMessage = {
      ...msg,
      senderId: `customer${userData?.id}`,
      receiverId: `astro${astroData?.id}`,
      sent: false,
      received: false,
      delivered: false,
    };

    setChatData(previousMessages =>
      GiftedChat.append(previousMessages, sendMessage),
    );

    addMessage(sendMessage);

    updateState({selectedFile: null, isAttached: false});
  };

  const addMessage = message => {
    try {
      // const chat_id = customerFirebaseID + '+' + astroFirebaseID;
      const chat_id = `customer${userData?.id}+astro${astroData?.id}`;
      const node = database().ref(`/userId/${astroData?.id}`).push();
      const key = node.key;
      database()
        .ref(`/Messages/${chat_id}/${key}`)
        .set({
          ...message,
          createdAt: new Date().getTime(),
          addedAt: database.ServerValue.TIMESTAMP,
          // sent: true,
        });
    } catch (e) {
      console.log(e);
    }
  };

  const go_home = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'home'}],
      }),
    );
  };

  const end_chat_in_firebase = () => {
    const sendMessage = {
      _id: MyMethods.generateUniqueId(),
      text: 'User ended chat',
      createdAt: new Date().getTime(),
      addedAt: database.ServerValue.TIMESTAMP,
      user: {
        _id: customerFirebaseID,
        name: userData.username,
        // avatar: base_url + userData?.image,
      },
      // Mark the message as sent, using one tick
      sent: true,
      // Mark the message as received, using two tick
      received: false,
      // Mark the message as pending with a clock loader
      pending: false,
      senderId: customerFirebaseID,
      receiverId: astroFirebaseID,
    };

    addMessage(sendMessage);

    const nodeRef_a = database().ref(`/CustomerCurrentRequest/${userData.id}`);
    const nodeRef_b = database().ref(`/CurrentRequest/${astroData.id}`);
    nodeRef_a.update({
      startTime: '',
      astroData: '',
      trans_id: '',
      chat_id: '',
      status: 'End',
      minutes: ''
    });
    nodeRef_b.update({
      date: '',
      invoice_id: '',
      msg: '',
      name: '',
      pic: '',
      rid: '',
      sid: '',
      wallet: '',
      status: 'End',
    });
    updateState({invoiceVisible: true});
  };

  const deduct_wallet = async () => {
    updateState({exitVisible: false});
    updateState({isLoading: true});
    const startTime = (
      await database()
        .ref(`CustomerCurrentRequest/${userData?.id}/startTime`)
        .once('value')
    ).val();
    const inVoiceId = (
      await database()
        .ref(`CustomerCurrentRequest/${userData?.id}/trans_id`)
        .once('value')
    ).val();
    const duration = MyMethods.getSecondsBetweenTimestamps({
      timestamp1: startTime,
      timestamp2: new Date().getTime(),
    });

    await axios({
      method: 'post',
      url: api_url + deductwallet_chat,
      data: {
        user_id: userData.id,
        astro_id: astroData.id,
        start_time: moment(startTime).format('YYYY-MM-DD hh:mm:ss'),
        end_time: moment(new Date().getTime()).format('YYYY-MM-DD hh:mm:ss'),
        duration: duration,
        invoice_id: inVoiceId, 
        chat_id: route.params.chat_id,
      },
    })
      .then(res => {
        updateState({isLoading: false});
        dispatch(ChatActions.setInvoiceData(res.data?.data));
        customer_profile(2);
      })
      .catch(err => {
        updateState({isLoading: false});
        console.log(err);
      });
  };

  const customer_profile = async () => {
    updateState({isLoading: true});
    await axios({
      method: 'post',
      url: api_url + api2_get_profile,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        user_id: userData?.id,
      },
    })
      .then(async res => {
        updateState({isLoading: false});
        dispatch(UserActions.setWallet(res.data.user_details[0]?.wallet));
        end_chat_in_firebase();
 
      })
      .catch(err => {
        // updateState({isLoading: false});
        updateState({isLoading: false});
        console.log(err);
      });
  };

  const end_chat = () => {
    updateState({exitVisible: true});
    // Alert.alert('Alert!', 'Are you sure to end your chat?', [
    //   {
    //     text: 'No',
    //     style: 'cancel',
    //   },
    //   {
    //     text: 'Yes',
    //     style: 'destructive',
    //     onPress: () => deduct_wallet(),
    //   },
    // ]);
  };

  const on_share = () => {
    const options = {
      title: 'FortuneTalk',
      message: 'Download the app',
      url: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.figma.com%2Fcommunity%2Ffile%2F1288818003070370272%2Fbanner-app-in-playstore&psig=AOvVaw3OYjEoRy03GCoGyyg_K3m9&ust=1705754713378000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCPiFi9G96YMDFQAAAAAdAAAAABAD',
    };
    Share.open(options)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const get_remedy = async data => {
    try {
      if (data?.type == 'remedy') {
        navigation.navigate('freeRemedy', {remedy_id: data?.remedy});
      } else if (data?.type == 'paid_remedy') {
        navigation.navigate('paidRemedy', {remedy_id: data?.remedy});
      } else if (data?.type == 'product') {
        navigation.navigate('productDetailes', {
          productData: data?.remedy?.data,
          title: data?.remedy?.title,
          category_id: data?.remedy?.category_id,
          suggestedBy: astroData?.id,
        });
      } else if (data?.type == 'pooja') {
        const response = await ApiRequest.postRequest({
          url: api_url,
        });

        if (response) {
        } else {
          showToastWithGravityAndOffset('Already booked.');
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const customOnPress = (text, onSend) => {
    onSend({text: text.trim()}, true);
    if (text && onSend) {
    }
  };

  const updateState = data => {
    setState(prevState => {
      const newData = {...prevState, ...data};
      return newData;
    });
  };

  const {
    bottomSheetVisible,
    uploading,
    isLoading,
    reviewModalVisible,
    voiceUploading,
    imageViewData,
    imageVisible,
    suggestedRemediesVisible,
    suggestedData,
    suggestedAstromallData,
    suggestedAstromallVisible,
    balanceAlert,
    startTime,
    firebaseId,
    exitVisible,
    invoiceVisible,
  } = state;

  return (
    <View style={{flex: 1, backgroundColor: Colors.primaryLight}}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      <Loader visible={isLoading} />
      {header()}
      <View style={styles.container}>
        <ImageBackground
          source={require('../assets/images/chat_background.png')}
          style={{width: '100%', height: '100%'}}>
          <Timer
            userData={userData}
            providerData={astroData}
            end_chat={end_chat}
            deduct_wallet={deduct_wallet}
            balanceAlert={balanceAlert}
            updateState={updateState}
          />

          <View style={{flex: 1}}>
            <GiftedChat
              alwaysShowSend
              placeholder='Enter message...'
              messages={chatData}
              onSend={messages => onSend(messages)}
              user={{
                _id: `customer${userData?.id}`,
                avatar: base_url + 'admin/' + userData?.user_profile_image,
                name: userData?.username,
              }}
              minInputToolbarHeight={60}
              onInputTextChanged={setMessage}
              // maxComposerHeight={300}
              // onInputTextChanged={text => updateIsTyping(text)}
              // renderTime={props => {
              //   return (
              //     <Time
              //       {...props}
              //       timeTextStyle={{right: {...Fonts.black12PoppinsRegular}}}
              //     />
              //   );
              // }}
              renderInputToolbar={({onSend, sendButtonProps, ...props}) => {
                return (
                  <InputMessages
                    updateState={updateState}
                    add_message={add_message}
                    setChatData={setChatData}
                    customerFirebaseID={customerFirebaseID}
                    astroFirebaseID={astroFirebaseID}
                    setUploadProgress={setUploadProgress}
                    onSend={onSend}
                    customOnPress={customOnPress}
                    sendButtonProps={sendButtonProps}
                    sendProps={props}
                    addMessage={addMessage}
                    customerData={userData}
                    astroId={astroData?.id}
                  />
                );
              }}
              renderBubble={props => {
                const {currentMessage} = props;
                if (currentMessage?.type == 'file') {
                  return (
                    <Bubble
                      {...props}
                      renderCustomView={() => {
                        return <Documets item={currentMessage} />;
                      }}
                      wrapperStyle={{
                        right: {
                          backgroundColor: Colors.primaryLight,
                        },
                        left: {
                          backgroundColor: Colors.whiteDark,
                        },
                      }}
                      textStyle={{right: {...Fonts.black14RobotoRegular}}}
                      // tickStyle={{left: colors.white_color}}
                    />
                  );
                } else if (currentMessage?.type == 'voice') {
                  return (
                    <Bubble
                      {...props}
                      renderCustomView={() => {
                        return (
                          <Voice item={currentMessage} uploadProgress={0} />
                        );
                      }}
                      wrapperStyle={{
                        right: {
                          backgroundColor: Colors.primaryLight,
                        },
                        left: {
                          backgroundColor: Colors.whiteDark,
                        },
                      }}
                      textStyle={{right: {...Fonts.black14RobotoRegular}}}
                      // tickStyle={{left: colors.white_color}}
                    />
                  );
                } else if (currentMessage?.type == 'tarot') {
                  return (
                    <View>
                      {JSON.parse(currentMessage.tarot).map(tarotItem => (
                        <Image
                          source={tarotValue[parseInt(tarotItem.id - 1)]}
                          style={{
                            width: SCREEN_WIDTH * 0.45,
                            resizeMode: 'contain',
                            height: SCREEN_WIDTH * 0.7,
                            marginBottom: Sizes.fixPadding,
                          }}
                        />
                      ))}
                    </View>
                  );
                } else if (
                  currentMessage?.type == 'remedy' ||
                  currentMessage?.type == 'product' ||
                  currentMessage?.type == 'paid_remedy'
                ) {
                  return (
                    <Bubble
                      {...props}
                      renderMessageText={props => {
                        return (
                          <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => get_remedy(currentMessage)}
                            style={{
                              width: SCREEN_WIDTH * 0.75,
                              padding: Sizes.fixPadding,
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <View style={{flex: 1}}>
                              <Text
                                style={{
                                  ...Fonts.black14RobotoRegular,
                                }}>
                                Recieved {currentMessage?.text}
                              </Text>
                            </View>

                            <Ionicons
                              name="arrow-forward-circle"
                              color={Colors.grayDark}
                              size={22}
                            />
                          </TouchableOpacity>
                        );
                      }}
                      wrapperStyle={{
                        right: {
                          backgroundColor: Colors.primaryLight,
                        },
                        left: {
                          backgroundColor: Colors.grayLight,
                        },
                      }}
                      textStyle={{right: {...Fonts.black14RobotoRegular}}}
                      // tickStyle={{left: colors.white_color}}
                    />
                  );
                } else {
                  return (
                    <Bubble
                      {...props}
                      wrapperStyle={{
                        right: {
                          backgroundColor: Colors.primaryLight,
                        },
                        left: {
                          backgroundColor: Colors.grayLight,
                        },
                      }}
                      textStyle={{right: {...Fonts.white14RobotoMedium}}}
                      // tickStyle={{left: colors.white_color}}
                    />
                  );
                }
              }}
              // renderFooter={({isTyping}) => {
              //   return (
              //     <Text
              //       style={{
              //         ...Fonts.primaryDark12PoppinsMedium,
              //         margin: Sizes.fixPadding,
              //       }}>
              //       {isTyping ? 'Typing...' : ''}
              //     </Text>
              //   );
              // }}
              // renderChatFooter={() => (
              //   <ChatFooter fileData={selectedFile} updateState={updateState} />
              // )}
            />
          </View>
        </ImageBackground>
      </View>

      <ImageView
        updateState={updateState}
        image={imageViewData}
        imageVisible={imageVisible}
      />
      <Review
        updateState={updateState}
        isLoading={isLoading}
        astroData={astroData}
        reviewModalVisible={reviewModalVisible}
        trans_id={route?.params?.trans_id}
        go_home={go_home}
        userData={userData}
        experties={experties}
      />
      <SuggestedRemedies
        suggestedRemediesVisible={suggestedRemediesVisible}
        updateState={updateState}
        navigation={navigation}
        suggestedData={suggestedData}
        userData={userData}
      />
      <SuggestedAstromall
        suggestedAstromallData={suggestedAstromallData}
        suggestedAstromallVisible={suggestedAstromallVisible}
        navigation={navigation}
        userData={userData}
        updateState={updateState}
        astroData={astroData}
      />

      <WalletAlert
        balanceAlert={balanceAlert}
        updateState={updateState}
        navigation={navigation}
        astroData={astroData}
        customerData={userData}
      />
      <ExitAlert
        updateState={updateState}
        exitVisible={exitVisible}
        onDone={deduct_wallet}
      />
      <Invoice invoiceVisible={invoiceVisible} updateState={updateState} />
    </View>
  );

  function header() {
    return (
      <View
        style={{
          padding: Sizes.fixPadding * 1.5,
          ...styles.row,
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity
          onPress={() => end_chat()}
          style={{
            alignSelf: 'flex-start',
            flex: 0,
          }}>
          <AntDesign
            name="leftcircleo"
            color={Colors.white}
            size={Sizes.fixPadding * 2.2}
          />
        </TouchableOpacity>
        <Text
          style={{
            ...Fonts.white16RobotoMedium,
            textAlign: 'center',
            flex: 0.6,
          }}>
          {astroData?.owner_name}
        </Text>
        <TouchableOpacity
          disabled
          activeOpacity={0.8}
          onPress={() => on_share()}
          style={{flex: 0}}></TouchableOpacity>
      </View>
    );
  }
};

const mapStateToProps = state => ({
  userData: state.user.userData,
  wallet: state.user.wallet,
  firebaseId: state.user.firebaseId,
  customerFirebaseID: state.chat.customerFirebaseID,
  astroFirebaseID: state.chat.astroFirebaseID,
});

const mapDispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, mapDispatchToProps)(ChatScreen);

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
    flex: 1,
    backgroundColor: Colors.whiteDark,
    borderTopLeftRadius: Sizes.fixPadding * 4,
    elevation: 8,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowColor: Colors.blackLight,
  },
});
