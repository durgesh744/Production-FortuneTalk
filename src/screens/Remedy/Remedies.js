import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import React from 'react';
import {Colors, Fonts, Sizes} from '../../assets/style';
import MyStatusBar from '../../components/MyStatusBar';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../config/Screen';
import LinearGradient from 'react-native-linear-gradient';

const Remedies = ({navigation}) => {
  return (
    <View style={{flex: 1, backgroundColor: Colors.bodyColor}}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      {header()}
      <View style={{flex: 1}}>
        <FlatList
          ListHeaderComponent={
            <>
              {bannerInfo()}
              {freeRemedyInfo()}
              {paidRemedyInfo()}
            </>
          }
        />
      </View>
    </View>
  );

  function paidRemedyInfo() {
    return (
      <View style={{padding: Sizes.fixPadding * 1.5}}>
        <Text style={{...Fonts.black16RobotoMedium, color: Colors.blackLight}}>
          Paid Remedy
        </Text>
        <View style={[styles.center, {marginVertical: Sizes.fixPadding}]}>
          <TouchableOpacity
           activeOpacity={0.8}
           onPress={()=>navigation.navigate('myRemedy', {
             status: '2'
           })}
          >
            <LinearGradient
              colors={[Colors.primaryLight, Colors.primaryDark]}
              style={{
                width: SCREEN_WIDTH * 0.8,
                height: SCREEN_WIDTH * 0.2,
                ...styles.center,
                borderRadius: 1000,
                elevation: 8,
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.2,
                shadowColor: Colors.blackLight,
                marginBottom: Sizes.fixPadding * 2,
              }}>
              <Text style={{...Fonts.white18RobotMedium, textAlign: 'center'}}>
                Astrologers Suggested{'\n'}Remedy
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity>
            <LinearGradient
              colors={[Colors.whiteDark, Colors.grayLight]}
              style={{
                width: SCREEN_WIDTH * 0.8,
                height: SCREEN_WIDTH * 0.2,
                ...styles.center,
                borderRadius: 1000,
                elevation: 5,
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.2,
                shadowColor: Colors.blackLight+'80',
                marginBottom: Sizes.fixPadding * 2,
              }}>
              <Text style={{...Fonts.gray18RobotoMedium, textAlign: 'center'}}>
                Fortune Store{'\n'}Remedy
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function freeRemedyInfo() {
    return (
      <View
        style={{
          padding: Sizes.fixPadding * 1.5,
          borderBottomWidth: 1,
          borderBottomColor: Colors.grayLight,
        }}>
        <Text style={{...Fonts.black16RobotoMedium, color: Colors.blackLight}}>
          Free Remedy
        </Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={()=>navigation.navigate('myRemedy', {
            status: '1'
          })}
          >
            <LinearGradient
              colors={[Colors.primaryLight, Colors.primaryDark]}
              style={{
                width: SCREEN_WIDTH * 0.85,
                paddingVertical: Sizes.fixPadding*1.5,
                ...styles.center,
                borderRadius: 1000,
                marginTop: Sizes.fixPadding*1.5,
                marginBottom: Sizes.fixPadding*0.5,
                alignSelf: 'center',
                elevation: 5,
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.2,
                shadowColor: Colors.blackLight
              }}>
              <Text style={{...Fonts.white18RobotMedium}}>Free Remedy</Text>
            </LinearGradient>
          </TouchableOpacity>
      </View>
    );
  }

  function bannerInfo() {
    return (
      <View style={{borderBottomWidth: 1, borderBottomColor: Colors.grayLight}}>
        <Image
          source={require('../../assets/images/remedy_banner.png')}
          style={{width: '100%', height: SCREEN_HEIGHT * 0.28}}
        />
      </View>
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
          Remedies
        </Text>
      </View>
    );
  }
};

export default Remedies;

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
