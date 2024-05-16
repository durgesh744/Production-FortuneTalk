import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
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
  api2_get_planet_details,
} from '../../config/constants';
import axios from 'axios';
import {StretchInX} from 'react-native-reanimated';

const PlanetaryDetails = (props) => {
  console.log(props.route.params)
  const [isLoading, setIsLoading] = useState(false);
  const [planetData, setPlanetData] = useState(null);

  useEffect(() => {
    get_planetary();
  }, []);

  const get_planetary = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + api2_get_planet_details,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        kundli_id:props.route.params.id
      },
    })
      .then(res => {
        console.log('=====>', res.data);
        setPlanetData(res.data.planets);
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  };

  return (
    <View style={{flex: 1, backgroundColor: Colors.bodyColor}}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      <Loader visible={isLoading} />
      {header()}
      <View style={{flex: 1}}>
        <FlatList ListHeaderComponent={<>{planetInfo()}</>} />
      </View>
    </View>
  );

  function planetInfo() {
    const renderItem = ({item, index}) => {
      return (
        <View
        key={index}
          style={{
            backgroundColor: Colors.primaryLight,
            padding: Sizes.fixPadding*0.5,
            width: SCREEN_WIDTH * 0.9,
            marginTop: Sizes.fixPadding,
            marginBottom: Sizes.fixPadding,
            borderRadius: Sizes.fixPadding*1.5,
            elevation: 10, 
            shadowColor: Colors.black
          }}>
          <View style={{justifyContent: 'space-between', flexDirection: 'row', margin: Sizes.fixPadding}}>
            <Text style={{...Fonts.white14RobotoMedium}}>{item.name}</Text>
            <Text style={{...Fonts.white14RobotoMedium}}>{item.fullDegree.toFixed(2)}-{item.normDegree.toFixed(2)}</Text>
            <Text style={{...Fonts.white14RobotoMedium}}>{item.planet_awastha}</Text>
          </View>
          <View style={{backgroundColor: Colors.white, marginBottom: Sizes.fixPadding*0.5, padding:Sizes.fixPadding}}>
            <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
              <Text style={{...Fonts.white14RobotoMedium, color: Colors.gray}}>
                Is Ratio
              </Text>
              <Text style={{...Fonts.white14RobotoMedium, color: Colors.gray}}>
                Speed
              </Text>
              <Text style={{...Fonts.white14RobotoMedium, color: Colors.gray}}>
                Sign Lord
              </Text>
            </View>
            <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
              <Text style={{...Fonts.black14RobotoRegular}}>{item.isRetro == 'false' ? 'No' : 'Yes-R'}</Text>
              <Text style={{...Fonts.black14RobotoRegular}}>{item.speed.toFixed(2)}</Text>
              <Text style={{...Fonts.black14RobotoRegular}}>{item.signLord}</Text>
            </View>
          </View>
          <View style={{backgroundColor: Colors.white, padding:Sizes.fixPadding, borderBottomLeftRadius:Sizes.fixPadding, borderBottomRightRadius:Sizes.fixPadding}}>
            <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
              <Text style={{...Fonts.white14RobotoMedium, color: Colors.gray}}>
              Nakshatra
              </Text>
              <Text style={{...Fonts.white14RobotoMedium, color: Colors.gray}}>
              Nakshatra Lord
              </Text>
              <Text style={{...Fonts.white14RobotoMedium, color: Colors.gray}}>
                House
              </Text>
            </View>
            <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
              <Text style={{...Fonts.black14RobotoRegular}}>{item.nakshatra}</Text>
              <Text style={{...Fonts.black14RobotoRegular}}>{item.nakshatraLord}</Text>
              <Text style={{...Fonts.black14RobotoRegular}}>{item.house}</Text>
            </View>
          </View>
        </View>
      );
    };
    return (
      <View
        style={{
          marginVertical: Sizes.fixPadding * 1.5,
          width: SCREEN_WIDTH * 0.9,
          marginHorizontal: Sizes.fixPadding * 1.5,
        }}>
        <Text
          style={{
            ...Fonts.gray14RobotoMedium,
            color: Colors.grayDark,
            marginBottom: 10,
          }}>
          The planetary details during your birth are all listed here i.e.
          planet degrees, speed, sign, nakshatra, houses etc
        </Text>
        <FlatList
          data={planetData}
          renderItem={renderItem}
          key={item => item.id.toString()}
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
          onPress={() => props.navigation.goBack()}
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
          Planetary Details
        </Text>
      </View>
    );
  }
};

export default PlanetaryDetails;

const styles = StyleSheet.create({
  row: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
