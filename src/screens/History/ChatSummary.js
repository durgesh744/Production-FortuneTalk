import {View, Text, Image, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors, Fonts, Sizes} from '../../assets/style';
import AsyncStorage from '@react-native-async-storage/async-storage';
import database from '@react-native-firebase/database';
import {Bubble, GiftedChat, Send} from 'react-native-gifted-chat';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';
import { SCREEN_WIDTH } from '../../config/Screen';
import Voice from '../../components/Chat/Voice';
import MyStatusBar from '../../components/MyStatusBar';
import MyHeader from '../../components/MyHeader';
import Loader from '../../components/Loader';
import Documets from '../../components/Chat/Doucments';
import { img_url_2 } from '../../config/constants';
import { tarotValue } from '../../config/TarotValue';

const ChatSummary = ({navigation, route, customerData}) => {

  console.log(route?.params)

  const [state, setState] = useState({
    isLoading: false,
    chatData: null,
    historyData: route?.params?.data,
  });

  useEffect(() => {
    get_chats(); 
  }, []);

  const get_chats = async () => {
    try {
      updateState({isLoading: true});

      const chat_id = `customer${customerData?.id}+astro${historyData?.astro_id}`;
      const messagesRef = database()
        .ref(`/Messages/${chat_id}`)
        .orderByChild('createdAt');

      messagesRef.once('value', dataSnapshot => {
        const messages = [];
        dataSnapshot.forEach(childSnapshot => {
          const message = childSnapshot.val();

          messages.push({...message});
        });

        updateState({chatData: messages.reverse()});
      });
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

  const {isLoading, chatData, historyData} = state;

  return (
    <View style={{flex: 1, backgroundColor: Colors.bodyColor}}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      <MyHeader title="Chat Summary" navigation={navigation} />
      <Loader visible={isLoading} />
      {chatData && (
        <GiftedChat
          messages={chatData}
          scrollToBottom
          user={{
            _id: `customer${customerData.id}`,
            name: customerData?.username,
          }}
          renderInputToolbar={()=>{
            return null
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
                    return <Voice item={currentMessage} uploadProgress={0} />;
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
                <Bubble
                  {...props}
                  renderCustomView={() => {
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
            } else if (
              currentMessage?.type == 'remedy' ||
              currentMessage?.type == 'product'
            ) {
              return (
                <Bubble
                  {...props}
                  renderMessageText={props => {
                    return (
                      <View
                        style={{
                          width: SCREEN_WIDTH * 0.75,
                          padding: Sizes.fixPadding,
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <View style={{flex: 1}}>
                          <Text
                            style={{
                              ...Fonts.white14RobotoMedium,
                            }}>
                            Recieved {currentMessage?.text}
                          </Text>
                        </View>

                        <Ionicons
                          name="arrow-forward-circle"
                          color={Colors.white}
                          size={22}
                        />
                      </View>
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
        />
      )}
    </View>
  );
};

const mapStateToProps = state => ({
  customerData: state.user.userData,
});

export default connect(mapStateToProps, null)(ChatSummary);
