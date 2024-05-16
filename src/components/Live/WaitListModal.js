import {View, Text, StyleSheet, FlatList} from 'react-native';
import React from 'react';
import {Modal} from 'react-native-paper';
import {Colors, Fonts, Sizes} from '../../assets/style';
import LinearGradient from 'react-native-linear-gradient';
import {TouchableOpacity} from 'react-native';
import { SCREEN_HEIGHT } from '../../config/Screen';

const WaitListModal = ({waitListData, waitListVisible, updateState}) => {
  const formatTime = seconds => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return (
      String(minutes).padStart(2, '0') +
      ' min ' +
      String(remainingSeconds).padStart(2, '0') +
      ' s'
    );
  };

  const total_time = () => {
    let total_balance = waitListData.reduce(
      (accumulator, currentValue) =>
        parseFloat(accumulator) + parseFloat(currentValue.time),
      0,
    );
    
    const minutes = parseFloat((total_balance / 60)).toFixed(0);
    return String(minutes).padStart(2, '0');
  };

  return (
    <Modal
      visible={waitListVisible}
      onDismiss={() => updateState({waitListVisible: false})}
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
        shadowColor: Colors.blackLight
      }}>
      <View
        style={[
          {
            paddingHorizontal: Sizes.fixPadding,
            paddingBottom: Sizes.fixPadding * 0.5,
          },
        ]}>
        <Text
          style={{...Fonts.primaryLight18RobotoMedium, textAlign: 'center'}}>
          Waitlist
        </Text>
        <Text style={{...Fonts.gray11RobotoRegular, textAlign: 'center'}}>
          Customers who missed the call & were marked offline, will get priority
          as per the list, if they come online.
        </Text>
      </View>

      {waitListInfo()}
      <Text style={{...Fonts.gray14RobotoMedium, textAlign: 'center'}}>
        Wait Time - {total_time()} min
      </Text>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          updateState({callModalVisible: true, waitListVisible: false});
        }}>
        <LinearGradient
          colors={[Colors.primaryLight, Colors.primaryDark]}
          style={[
            {
              width: '60%',
              paddingHorizontal: Sizes.fixPadding,
              paddingVertical: Sizes.fixPadding * 0.9,
              borderRadius: 1000,
              marginTop: Sizes.fixPadding,
              alignSelf: 'center',
            },
          ]}>
          <Text
            style={{
              ...Fonts.white14RobotoMedium,
              textAlign: 'center',
            }}>
            Join Waitlist
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </Modal>
  );

  function waitListInfo() {
    const renderItem = ({item, index}) => {
      return (
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
              borderWidth: 1,
              borderColor: Colors.grayLight,
              backgroundColor: Colors.white,
              padding: Sizes.fixPadding,
              borderRadius: Sizes.fixPadding,
            },
          ]}>
          <LinearGradient
            colors={[Colors.primaryLight, Colors.primaryDark]}
            style={[
              {
                width: 30,
                height: 30,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 1000,
              },
            ]}>
            <Text
              style={{
                ...Fonts.white14RobotoMedium,
                textAlign: 'center',
              }}>
              {item.userName[0]}
            </Text>
          </LinearGradient>
          <Text
            style={{
              ...Fonts.gray14RobotoMedium,
              marginLeft: Sizes.fixPadding,
            }}>
            {item.userName}
          </Text>
          <View style={{flex: 1, alignItems: 'flex-end'}}>
            <Text
              style={{
                ...Fonts.black11InterMedium,
                color: Colors.primaryLight,
              }}>
              <Text style={{color: Colors.greenLight}}>on call</Text> -{' '}
              {formatTime(
                parseFloat((parseFloat(item.time))).toFixed(0),
              )}
            </Text>
          </View>
        </View>
      );
    };
    return (
      <View
      style={{maxHeight: SCREEN_HEIGHT*0.4}}
      >
        <FlatList data={waitListData} renderItem={renderItem} />
      </View>
    );
  }
};

export default WaitListModal;

const styles = StyleSheet.create({
  container: {
    // flexDirection: 'column',
    // height: '100%'
    alignItems: 'center',
  },
  row: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemContainer: {
    borderRadius: 1000,
    marginVertical: Sizes.fixPadding,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemCount: {
    position: 'absolute',
    alignSelf: 'flex-end',
    top: -2,
    backgroundColor: '#FB4A59',
    borderRadius: 1000,
    width: 15,
    height: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowColor: Colors.blackLight,
    zIndex: 99,
  },
});
