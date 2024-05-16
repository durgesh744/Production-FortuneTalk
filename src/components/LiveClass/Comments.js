import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {memo, useMemo, useState} from 'react';
import {Colors, Sizes, Fonts} from '../../assets/style';
import {SCREEN_HEIGHT} from '../../config/Screen';
import {Modal} from 'react-native-paper';
import {FlatList} from 'react-native';
import {Input} from '@rneui/themed';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';
import Chats from './Chats';

const Comments = ({sendMessage, updateState, commentsVisible}) => {
  const [message, setMessage] = useState('');
  return (
    <Modal
      visible={commentsVisible}
      onDismiss={() => updateState({commentsVisible: false})}
      style={{justifyContent: 'flex-end'}}>
      <View style={styles.container}>
        <View style={styles.commentsContainer}>
          <Chats />
          {inputFieldsInfo()}
        </View>
      </View>
    </Modal>
  );

  function inputFieldsInfo() {
    return (
      <View style={{width: '100%'}}>
        <Input
          value={message}
          onChangeText={setMessage}
          placeholder="Enter here..."
          placeholderTextColor={Colors.blackLight}
          inputStyle={{...Fonts.black14RobotoRegular}}
          containerStyle={{height: 40}}
          inputContainerStyle={{borderBottomWidth: 0}}
          style={{
            backgroundColor: Colors.white,
            height: 40,
            borderRadius: Sizes.fixPadding,
          }}
          rightIcon={() => {
            return (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setMessage('');
                  sendMessage(message);
                }}
                style={{
                  width: 40,
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: Colors.primaryLight,
                  borderRadius: 1000,
                  marginLeft: Sizes.fixPadding,
                }}>
                <Ionicons
                  name={'chevron-forward-circle'}
                  size={30}
                  color={Colors.white}
                />
              </TouchableOpacity>
            );
          }}
        />
      </View>
    );
  }
};

const mapStateToProps = state => ({
  commentsData: state.liveClass.commentsData,
});

export default connect(mapStateToProps, null)(Comments);

const styles = StyleSheet.create({
  container: {width: '100%'},
  commentsContainer: {
    backgroundColor: 'rgba(0,0,0, 0.8)',
    height: SCREEN_HEIGHT * 0.6,
    borderTopLeftRadius: Sizes.fixPadding * 3,
    borderTopRightRadius: Sizes.fixPadding * 3,
  },
});
