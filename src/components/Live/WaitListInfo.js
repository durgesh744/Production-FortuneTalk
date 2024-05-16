import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors, Fonts, Sizes} from '../../assets/style';
import Ionicons from 'react-native-vector-icons/Ionicons';

const WaitListInfo = ({updateState, waitListData}) => {
  const [waitlistLength, setWaitListLength] = useState(0);
  useEffect(() => {
    if (waitListData) {
      setWaitListLength(waitListData.length);
    }
  }, [waitListData.length]);
  return (
    <View style={styles.waitListContainer}>
      <TouchableOpacity
        style={{
          width: 22,
          height: 22,
          marginBottom: Sizes.fixPadding * 0.5,
        }}>
        <Image
          source={require('../../assets/images/icons/hourglass_live.png')}
          style={{
            width: '100%',
            height: '100%',
            resizeMode: 'contain',
          }} 
        />
      </TouchableOpacity>
      {waitlistLength >= 2 && (
        <View style={[styles.userContainer]}>
          <Text style={{...Fonts.white14RobotoMedium}}>
            {waitListData[1]?.userName[0]}
          </Text>
        </View>
      )}
      {waitlistLength >= 1 && (
        <View style={[styles.userContainer, {bottom: Sizes.fixPadding}]}>
          <Text style={{...Fonts.white14RobotoMedium}}>
            {waitListData[0]?.userName[0]}
          </Text>
        </View>
      )}

      <TouchableOpacity onPress={() => updateState({waitListVisible: true})}>
        <Ionicons name="add" color={Colors.white} size={22} />
      </TouchableOpacity>
    </View>
  );
};

export default WaitListInfo;

const styles = StyleSheet.create({
  userContainer: {
    width: 26,
    height: 26,
    borderRadius: 100,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  waitListContainer: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.black + '10',
    margin: Sizes.fixPadding,
    padding: Sizes.fixPadding * 0.8,
    borderRadius: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
