import {View, Text, FlatList, Image} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {Colors, Fonts, Sizes} from '../../assets/style';
import LinearGradient from 'react-native-linear-gradient';

const chatData = [
  {id: 1, name: 'Mayank', message: 'Ayan Ansari Joined the LIVE'},
  {id: 2, name: 'Shyam', message: 'Ayan Ansari Joined the LIVE'},
  {id: 3, name: 'Ram', message: 'Ayan Ansari Joined the LIVE'},
  {id: 4, name: 'Vishal', message: 'Ayan Ansari Joined the LIVE'},
  {id: 5, name: 'Aditya', message: 'Ayan Ansari Joined the LIVE'},
  {id: 6, name: 'Renu', message: 'Ayan Ansari Joined the LIVE'},
  {id: 7, name: 'Ruby', message: 'Ayan Ansari Joined the LIVE'},
  {id: 8, name: 'Chetan', message: 'Ayan Ansari Joined the LIVE'},
  {id: 9, name: 'Anubhav', message: 'Ayan Ansari Joined the LIVE'},
];

const RecievedGifts = ({giftsData}) => {
  // console.log(giftsData)
  const renderItem = ({item, index}) => {
    return (
      <View
        style={{
          flex: 0,
          flexDirection: 'row',
          alignItems: 'flex-start',
          marginBottom: Sizes.fixPadding,
          borderRadius: Sizes.fixPadding,
          backgroundColor: 'rgba(177, 175, 175, 0.06)',
          transform: [{scaleY: -1}]
        }}>
        <View
          style={{
            width: 40,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Image source={{uri: item.message?.icon}} style={{width: '80%', height: '80%'}} />
        </View>
        <View
          style={{
            backgroundColor: Colors.gray2 + '50',
            marginLeft: Sizes.fixPadding,
            padding: Sizes.fixPadding,
            borderRadius: Sizes.fixPadding,
          }}>
          <Text style={{...Fonts.white14RobotoMedium}}>Recieved {item.message.title} Gift from {item.fromUser?.userName}</Text>
        </View>
      </View>
    );
  };
  return (
    <View style={{height: '100%', flex: 1, transform: [{scaleY: -1}]}}>
      <FlatList
        data={giftsData.reverse()}
        renderItem={renderItem}
        keyExtractor={item => item?.messageID}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

export default RecievedGifts