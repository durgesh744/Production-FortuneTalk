import {View, Text, FlatList, StyleSheet} from 'react-native';
import React from 'react';
import {TouchableOpacity} from 'react-native';
import {SCREEN_WIDTH} from '../config/Screen';
import {Colors, Fonts, Sizes} from '../assets/style';
import LinearGradient from 'react-native-linear-gradient';

const AstroCategory = ({
  filterData,
  updateState,
  activeFilter,
  astrologer_by_category,
}) => {
  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          updateState({activeFilter: item.remedies_id});
          astrologer_by_category(item.remedies_id, 0);
        }}
        style={styles.cotainer}>
        <Text style={{...Fonts.white14RobotoMedium, textAlign: 'center'}}>
          {item.title}
        </Text>
        {item.remedies_id == activeFilter && <View style={styles.bottomBorder} />}
      </TouchableOpacity>
    );
  };
  return (
    <LinearGradient colors={[Colors.primaryLight, Colors.primaryDark]}>
      <FlatList
        data={filterData}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </LinearGradient>
  );
};

export default AstroCategory;

const styles = StyleSheet.create({
  cotainer: {
    width: SCREEN_WIDTH * 0.22,
    height: Sizes.fixPadding*5,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: Sizes.fixPadding * 0.7,
    borderTopLeftRadius: Sizes.fixPadding * 0.7,
  },
  bottomBorder: {
    position: 'absolute',
    width: '100%',
    height: 5,
    bottom: 0,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 1000,
    borderTopRightRadius: 1000,
  },
});
