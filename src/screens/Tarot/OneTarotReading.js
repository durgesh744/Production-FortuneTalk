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

const OneTarotReading = ({navigation}) => {
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
              {askQuestionInfo()}
              {nextInfo()}
            </>
          }
        />
      </LinearGradient>
    </View>
  );

  function nextInfo(){
    return(
        <TouchableOpacity
        onPress={()=>navigation.navigate('oneTarotDetailes')}
        style={{
          width: '40%',
          alignSelf: 'center',
          marginVertical: Sizes.fixPadding * 4,
          paddingVertical: Sizes.fixPadding*1.5,
          backgroundColor: Colors.white,
          borderRadius: 1000,
        }}>
        <Text style={{...Fonts.black14RobotoRegular, textAlign: 'center'}}>Next</Text>
      </TouchableOpacity>
    )
  }

  function askQuestionInfo() {
    return (
      <TouchableOpacity
        style={{
          width: '50%',
          alignSelf: 'center',
          marginVertical: Sizes.fixPadding * 2,
          paddingVertical: Sizes.fixPadding*1.5,
          borderWidth: 1,
          borderColor: Colors.white,
          borderRadius: 1000,
        }}>
        <Text style={{...Fonts.white14RobotoMedium, textAlign: 'center'}}>Ask your question</Text>
      </TouchableOpacity>
    );
  }

  function descriptionInfo() {
    return (
      <View style={{marginHorizontal: Sizes.fixPadding * 2}}>
        <Text style={{...Fonts.white16RobotoMedium, textAlign: 'center'}}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. consectetur
          adipiscing elitipsum dolor sit amet
        </Text>
      </View>
    );
  }

  function bannerInfo() {
    return (
      <Image
        source={require('../../assets/images/tarot/one_tarot_banner.png')}
        style={{
          width: SCREEN_WIDTH,
          height: SCREEN_WIDTH * 0.5,
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

export default OneTarotReading;

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
