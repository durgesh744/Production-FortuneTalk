import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useState} from 'react';
import {Colors, Fonts, Sizes} from '../../assets/style';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MyStatusBar from '../../components/MyStatusBar';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../config/Screen';
import LinearGradient from 'react-native-linear-gradient';
import Loader from '../../components/Loader';
import Carousel from 'react-native-reanimated-carousel';
import {
  api_url,
  img_url,
  get_horoscope,
  free_insight_banner,
} from '../config/constants';
import axios from 'axios';
import {Dropdown} from 'react-native-element-dropdown';

const KundliReport = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <View style={{flex: 1, backgroundColor: Colors.bodyColor}}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      <Loader visible={isLoading} />
      {header()}
      <View style={{flex: 1}}>
        <FlatList ListHeaderComponent={<>{reportInfo()}</>} />
      </View>
    </View>
  );

  function reportInfo() {
    return (
      <View
        style={{width: SCREEN_WIDTH * 0.9, marginHorizontal: Sizes.fixPadding}}>
        <View style={{marginVertical: Sizes.fixPadding}}>
          <Text style={{...Fonts.black16RobotoMedium}}>Personal Life</Text>
          <Text style={{...Fonts.gray14RobotoMedium}}>Comming Soon</Text>
        </View>
        <View style={{marginVertical: Sizes.fixPadding}}>
          <Text style={{...Fonts.black16RobotoMedium}}>Luck</Text>
          <Text style={{...Fonts.gray14RobotoMedium}}>Comming Soon</Text>
        </View>
        <View style={{marginVertical: Sizes.fixPadding}}>
          <Text style={{...Fonts.black16RobotoMedium}}>Health</Text>
          <Text style={{...Fonts.gray14RobotoMedium}}>Comming Soon</Text>
        </View>
        <View style={{marginVertical: Sizes.fixPadding}}>
          <Text style={{...Fonts.black16RobotoMedium}}>Profession</Text>
          <Text style={{...Fonts.gray14RobotoMedium}}>Comming Soon</Text>
        </View>
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
          style={{
            position: 'absolute',
            zIndex: 99,
            padding: Sizes.fixPadding * 1.5,
          }}>
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
          Report
        </Text>
      </View>
    );
  }
};

export default KundliReport;

const styles = StyleSheet.create({
  row: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
