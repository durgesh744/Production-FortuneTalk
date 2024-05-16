import {View, Text, FlatList} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {Sizes, Colors, Fonts} from '../../assets/style';
import {connect} from 'react-redux';
import {SCREEN_HEIGHT} from '../../config/Screen';

const Chats = ({commentsData, commentsLength}) => {
  const [chatData, setChatData] = useState([])
  const memoData = useMemo(()=>chatData, [chatData])
  useEffect(() => {
    setChatData(commentsData.reverse())
  }, [commentsLength]);

  const renderItem = ({item, index}) => {
    return (
      <View
        style={{
          flex: 0,
          flexDirection: 'row',
          marginBottom: Sizes.fixPadding * 1.5,
          transform: [{scaleY: -1}],
        }}>
        <View
          style={{
            flex: 0,
            width: 32,
            height: 32,
            backgroundColor: Colors.white,
            borderRadius: 1000,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>{item?.fromUser?.userName[0]}</Text>
        </View>
        <View style={{flex: 1}}>
          <View
            style={{
              alignSelf: 'flex-start',
              backgroundColor: Colors.white,
              marginLeft: Sizes.fixPadding,
              borderRadius: Sizes.fixPadding * 0.6,
              paddingHorizontal: Sizes.fixPadding,
              paddingVertical: Sizes.fixPadding * 0.6,
            }}>
            <Text style={{...Fonts.black12RobotoRegular}}>{item?.message}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View
      style={{
        margin: Sizes.fixPadding * 1.5,
        height: SCREEN_HEIGHT * 0.5,
        transform: [{scaleY: -1}],
      }}>
      <FlatList data={memoData} renderItem={renderItem} />
    </View>
  );
};

const mapStateToProps = state => ({
  commentsData: state.liveClass.commentsData,
  commentsLength: state.liveClass.commentsLength,
});

export default connect(mapStateToProps, null)(Chats);
