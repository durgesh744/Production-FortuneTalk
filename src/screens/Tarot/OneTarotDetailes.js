import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import {Colors, Fonts, Sizes} from '../../assets/style';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MyStatusBar from '../../components/MyStatusBar';
import {SCREEN_WIDTH} from '../../config/Screen';
import LinearGradient from 'react-native-linear-gradient';

const OneTarotDetailes = ({navigation}) => {
  return (
    <View style={{flex: 1, backgroundColor: Colors.bodyColor}}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      {header()}
      <LinearGradient
        colors={[Colors.primaryLight, Colors.primaryDark]}
        style={{flex: 1}}>
        <FlatList
          ListHeaderComponent={
            <>
              {bannerInfo()}
              {descriptionInfo()}
            </>
          }
        />
      </LinearGradient>
    </View>
  );

  function descriptionInfo() {
    return (
      <View style={{marginHorizontal: Sizes.fixPadding * 2}}>
        <Text style={{...Fonts.white16RobotoMedium}}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. consectetur
          adipiscing elitipsum dolor sit amet Lorem ipsum dolor sit amet,
          consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur
          adipiscing elit.consectetur adipiscing elitipsum dolor sit amet
          consectetur adipiscing elitipsum dolor sit ametLorem ipsum dolor sit
          amet, consectetur adipiscing elit.consectetur adipiscing elitipsum
          dolor sit amet Lorem ipsum dolor sit amet, consectetur adipiscing
          elit. consectetur adipiscing elitipsum dolor sit amet
        </Text>
      </View>
    );
  }

  function bannerInfo() {
    return (
      <Image
        source={require('../../assets/images/tarot/tarot_sample.png')}
        style={{
          width: SCREEN_WIDTH,
          height: SCREEN_WIDTH * 0.7,
          resizeMode: 'contain',
          marginVertical: Sizes.fixPadding * 4,
        }}
      />
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
          style={{position: 'absolute', zIndex: 99, padding: Sizes.fixPadding * 1.5}}>
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
            flex: 1,
          }}>
          One Tarot Reading
        </Text>
      </View>
    );
  }
};

export default OneTarotDetailes;

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
});
