import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Colors, Fonts, Sizes} from '../../assets/style';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MyStatusBar from '../../components/MyStatusBar';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../config/Screen';
import LinearGradient from 'react-native-linear-gradient';
import Loader from '../../components/Loader';
import Carousel from 'react-native-reanimated-carousel';
import {
  api_url,
  api2_get_manglik_dosha,
  api2_get_kalsarph_dosha,
  api2_get_sadhesati_status
} from '../../config/constants';
import axios from 'axios';

const KundliDosh = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [manglik, setManglik] = useState(null);
  const [kalSarpa, setKalSarpa] = useState(null);
  const [sadheSati, setSadheSati] = useState(null);

  useEffect(() => {
    manglik_dosha();
    kalSarpa_dosha();
    sadheSati_dosha();
  }, []);

  const manglik_dosha = async () => { 
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + api2_get_manglik_dosha,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        kundli_id: props.route.params.id,
      },
    }) .then(res => {
        console.log('M=====>', res.data);
        setManglik(res.data?.manglik);
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  }

  const kalSarpa_dosha = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + api2_get_kalsarph_dosha,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        kundli_id: props.route.params.id,
      },
    }) .then(res => {
        console.log('K=====>', res.data);
        setKalSarpa(res.data?.kalsarpa_details.report);
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  }

  const sadheSati_dosha = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + api2_get_sadhesati_status,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        kundli_id: props.route.params.id,
      },
    }) .then(res => {
        console.log('S=====>', res.data);
        setSadheSati(res.data?.sadhesati_current_status);
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  }

  return (
    <View style={{flex: 1, backgroundColor: Colors.bodyColor}}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      <Loader visible={isLoading} />
      {header()}
      <View style={{flex: 1}}>
        <FlatList
          ListHeaderComponent={
            <>
            {doshaInfo()}
            </>
          }
        />
      </View>
    </View>
  )

  function doshaInfo() {
    return (
      <View>
        <Image
          source={require('../../assets/images/kundli_dosha.png')}
          style={{
            width: SCREEN_WIDTH * 0.55,
            height: SCREEN_WIDTH * 0.55,
            alignSelf: 'center',
          }}
        />
        <View
          style={{
            marginHorizontal: Sizes.fixPadding * 1.5,
            marginVertical: Sizes.fixPadding,
          }}>
          <Text
            style={{
              ...Fonts.black18RobotoMedium,
              marginBottom: Sizes.fixPadding,
            }}>
            Manglik Dosha
          </Text>
          <Text style={{...Fonts.gray16RobotoRegular}}>
            {manglik?.manglik_report}
          </Text>
        </View>
        <View
          style={{
            marginHorizontal: Sizes.fixPadding * 1.5,
            marginVertical: Sizes.fixPadding,
          }}>
          <Text
            style={{
              ...Fonts.black18RobotoMedium,
              marginBottom: Sizes.fixPadding,
            }}>
            KalSarpa Dosha
          </Text>
          <Text style={{...Fonts.gray16RobotoRegular}}>
            {kalSarpa?.report?.report ?? 'Not Detected'} 

          </Text>
        </View>
        <View
          style={{
            marginHorizontal: Sizes.fixPadding * 1.5,
            marginVertical: Sizes.fixPadding,
          }}>
          <Text
            style={{
              ...Fonts.black18RobotoMedium,
              marginBottom: Sizes.fixPadding,
            }}>
            SadheSati Dosha
          </Text>
          <Text style={{...Fonts.gray16RobotoRegular}}>
            {sadheSati?.is_undergoing_sadhesati}
          </Text>
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
          Kundli Dosh
        </Text>
      </View>
    );
  }
}

export default KundliDosh;

const styles = StyleSheet.create({
  row: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
})