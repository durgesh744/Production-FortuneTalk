import {
  View,
  Text,
  FlatList,
  ImageBackground,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {Colors, Fonts, Sizes} from '../../assets/style';
import * as Progress from 'react-native-progress';
import {SCREEN_WIDTH} from '../../config/Screen';
import Voice from './Voice';
import {tarotValue} from '../../config/TarotValue';
import Doucments from './Doucments';

const ChatDetailes = ({
  memoizedArray,
  firebaseId, 
  astroData,
  uploadProgress,
  updateState,
}) => {
  const getDateOrTime = timestamp => {
    const now = Date.now();
    const diff = now - timestamp;
    const oneDay = 24 * 60 * 60 * 1000;

    if (diff < oneDay) {
      // Within the last 24 hours, return time in AM/PM format
      const date = new Date(timestamp);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12; // Convert 0 to 12 for noon/midnight
      return `${formattedHours}:${
        minutes < 10 ? '0' + minutes : minutes
      } ${ampm}`;
    } else if (diff < 2 * oneDay) {
      // Between 24 and 48 hours ago, return "Yesterday" and time in AM/PM format
      const yesterday = new Date(timestamp);
      const hours = yesterday.getHours();
      const minutes = yesterday.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12; // Convert 0 to 12 for noon/midnight
      return `Yesterday ${formattedHours}:${
        minutes < 10 ? '0' + minutes : minutes
      } ${ampm}`;
    } else {
      // Before yesterday, return date and time in AM/PM format
      const date = new Date(timestamp);
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12; // Convert 0 to 12 for noon/midnight
      return `${day}/${month}/${year} ${formattedHours}:${
        minutes < 10 ? '0' + minutes : minutes
      } ${ampm}`;
    }
  };

  const showCustomerChats = (type, item) => {
    switch (type) {
      case 'text': {
        return (
          <Text style={{...Fonts.black14InterMedium}}>{item.message}</Text>
        );
      }
      case 'image': {
        return (
          <TouchableOpacity
            activeOpacity={0.8}
            disabled={typeof item?.uploading != 'undefined'}
            onPress={() =>
              updateState({imageViewData: item.image, imageVisible: true})
            }
            style={{width: '100%'}}>
            <ImageBackground
              source={{uri: item.image}}
              style={{
                width: '100%',
                height: SCREEN_WIDTH * 0.5,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {typeof item?.uploading != 'undefined' && (
                <Progress.Circle
                  size={50}
                  indeterminate={true}
                  progress={uploadProgress}
                />
              )}
            </ImageBackground>
          </TouchableOpacity>
        );
      }
      case 'voice': {
        return <Voice item={item} uploadProgress={uploadProgress} />;
      }

      case 'tarot': {
        return (
          <View>
            {JSON.parse(item.tarot).map(tarotItem => (
              <Image
                source={tarotItem.value}
                style={{
                  width: '100%',
                  resizeMode: 'contain',
                  height: SCREEN_WIDTH * 0.8,
                  marginBottom: Sizes.fixPadding,
                }}
              />
            ))}
          </View>
        );
      }

      case 'pdf': {
        return <Doucments item={item} uploadProgress={uploadProgress} />;
      }

      default: {
        return null;
      }
    }
  };

  const showProviderChats = (type, item) => {
    switch (type) {
      case 'text': {
        return (
          <Text style={{...Fonts.black14InterMedium}}>{item.message}</Text>
        );
      }
      case 'image': {
        return (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              updateState({imageViewData: item.image, imageVisible: true})
            }
            style={{width: '100%'}}>
            <ImageBackground
              source={{uri: item.image}}
              style={{
                width: '100%',
                height: SCREEN_WIDTH * 0.5,
                justifyContent: 'center',
                alignItems: 'center',
              }}></ImageBackground>
          </TouchableOpacity>
        );
      }
      case 'voice': {
        return <Voice item={item} uploadProgress={uploadProgress} />;
      }

      case 'tarot': {
        return (
          <View>
            {JSON.parse(item.tarot).map(tarotItem => (
              <Image
                source={tarotValue[parseInt(tarotItem.id) - 1]}
                style={{
                  width: '100%',
                  resizeMode: 'contain',
                  height: SCREEN_WIDTH * 0.8,
                  marginBottom: Sizes.fixPadding,
                }}
              />
            ))}
          </View>
        );
      }

      default: {
        return null;
      }
    }
  };

  const renderItem = ({item, index}) => {
    return (
      <View style={{transform: [{scaleY: -1}]}}>
        {item?.is_first ? (
          <View
            style={{
              width: '70%',
              alignSelf: 'flex-end',
              marginTop: Sizes.fixPadding * 2,
            }}>
            <LinearGradient
              colors={[Colors.primaryLight, Colors.primaryDark]}
              style={{
                padding: Sizes.fixPadding,
                borderRadius: Sizes.fixPadding,
              }}>
              <Text style={{...Fonts.white14RobotoMedium}}>{item.message}</Text>
            </LinearGradient>
            <Text style={{...Fonts.gray14RobotoMedium, textAlign: 'right'}}>
              {getDateOrTime(item.timestamp)}
            </Text>
          </View>
        ) : item.from == firebaseId ? (
          <View
            style={{
              alignSelf: 'flex-end',
              marginTop: Sizes.fixPadding * 2,
              ...styles.row,
              alignItems: 'flex-start',
            }}>
            <View style={{width: '80%', marginRight: Sizes.fixPadding}}>
              <View
                style={{
                  padding: Sizes.fixPadding,
                  borderRadius: Sizes.fixPadding,
                  backgroundColor: '#FFECDB',
                  borderTopLeftRadius: 0,
                }}>
                {showCustomerChats(item?.type, item)}
              </View>

              <Text style={{...Fonts.gray14RobotoMedium, textAlign: 'right'}}>
                {getDateOrTime(item.timestamp)}
              </Text>
            </View>

            <View
              style={{
                backgroundColor: Colors.primaryLight,
                width: 25,
                height: 25,
                ...styles.center,
                borderRadius: 1000,
              }}>
              <Text style={{...Fonts.white12RobotoMedium}}>ME</Text>
            </View>
          </View>
        ) : (
          <View
            style={{
              alignSelf: 'flex-start',
              marginTop: Sizes.fixPadding * 2,
              ...styles.row,
              alignItems: 'flex-start',
            }}>
            {astroData?.image && (
              <ImageBackground
                source={{uri: astroData?.image}}
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 25,
                }}></ImageBackground>
            )}
            <View style={{width: '75%', marginLeft: Sizes.fixPadding}}>
              <View
                style={{
                  width: '75%',
                  padding: Sizes.fixPadding,
                  borderRadius: Sizes.fixPadding,
                  backgroundColor: Colors.white,
                  borderTopLeftRadius: 0,
                }}>
                {showProviderChats(item?.type, item)}
              </View>
              <Text style={{...Fonts.gray14RobotoMedium, textAlign: 'left'}}>
                {getDateOrTime(item.timestamp)}
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={{flex: 1, transform: [{scaleY: -1}]}}>
      <FlatList
        data={memoizedArray}
        renderItem={renderItem}
        keyExtractor={item => `${item.timestamp}`}
        contentContainerStyle={{paddingHorizontal: Sizes.fixPadding * 2}}
      />
    </View>
  );
};

export default ChatDetailes;

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
    shadowColor: Colors.blackLight
  },
});
