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
  free_insight_banner,
  match_manglik_report,
} from '../../config/constants';
import axios from 'axios';
import Entypo from 'react-native-vector-icons/Entypo';

const ManglikMatch = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState('');


  console.log('ye hi edata jo back se aa rha hi male manglik',props.route.params.data3)
  console.log('ye hi edata female mGLIK', props.route.params.data4);



  useEffect(() => {
    get_manglik();
  }, []);


  const get_manglik = async () => {
    await axios({
      method: 'post',
      url: api_url + match_manglik_report,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        m_kundli_id :props.route.params.data3,
        f_kundli_id : props.route.params.data4,
      },
    })
      .then(res => {
        console.log('magli=  YE MAGLIK KA DATA HI=>>>', res.data);
        setData(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  };
  console.log('YE WALA DATA SHoW KARNA HI', data?.match_manglik_report?.conclusion.match );

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
              {manglikReport()}
              {manglikAnalysis()}
            </>
          }
        />
      </View>
    </View>
  );

  function manglikAnalysis() {
    return (
        <View
          style={{
            width: SCREEN_WIDTH * 0.9,
            marginHorizontal: Sizes.fixPadding * 2,
            marginVertical: Sizes.fixPadding,
          }}>
          <Text
            style={{
              ...Fonts.primaryLight14RobotoMedium,
              fontSize: 16,
              marginBottom: Sizes.fixPadding * 0.5,
            }}>
            Manglik Analysis
          </Text>
          <Text style={{...Fonts.gray14RobotoMedium, color: Colors.grayMedium}}>
            {data?.match_manglik_report?.conclusion.match == true ? 'This is a Match' : 'Not a Match'}

          </Text>
          <Text style={{...Fonts.gray14RobotoMedium, color: Colors.grayMedium}}>
            {data?.match_manglik_report?.conclusion.report}
          </Text>
        </View>
    );
  }

  function manglikReport() {
    return (
      <View style={{width: SCREEN_WIDTH * 0.9, marginHorizontal: Sizes.fixPadding*2, marginVertical: Sizes.fixPadding}}>
        <Text
          style={{
            ...Fonts.primaryLight14RobotoMedium,
            fontSize: 16,
            marginBottom: Sizes.fixPadding * 0.5,
          }}>
          Manglik Analysis
        </Text>
        <View style={{flexDirection: 'row', paddingVertical: Sizes.fixPadding, alignItems: 'center', justifyContent: 'center'}}>
            <View style={{backgroundColor: Colors.grayLight, padding: Sizes.fixPadding, borderRadius: Sizes.fixPadding, width: SCREEN_WIDTH*0.3, height: SCREEN_WIDTH*0.3, elevation: 10, alignItems: 'center', justifyContent: 'center'}}>
                <View style={{width: SCREEN_WIDTH*0.15, height: SCREEN_WIDTH*0.15, borderRadius: SCREEN_WIDTH*0.15, borderColor: Colors.primaryDark, borderWidth: 2, marginBottom: Sizes.fixPadding*0.25}}>
                    <Image source={{uri: '../../assets/images/male-gender.png'}} style={{width: '100%', height: '100%', resizeMode: 'contain'}}/>
                </View>
                <Text style={{...Fonts.black14InterMedium, textAlign: 'center', fontWeight: 'bold'}}>Male</Text>
                <Text style={{...Fonts.gray12RobotoMedium, textAlign: 'center'}}>{data?.match_manglik_report?.male.is_present == true ? 'Manglik' : 'Non Manglik'}</Text>
            </View>
            <View style={{backgroundColor: Colors.grayLight, padding: Sizes.fixPadding, borderRadius: Sizes.fixPadding, width: SCREEN_WIDTH*0.3, height: SCREEN_WIDTH*0.3, elevation: 10, alignItems: 'center', justifyContent: 'center', marginLeft: Sizes.fixPadding*2}}>
                <View style={{width: SCREEN_WIDTH*0.15, height: SCREEN_WIDTH*0.15, borderRadius: SCREEN_WIDTH*0.15, borderColor: Colors.primaryDark, borderWidth: 2, marginBottom: Sizes.fixPadding*0.25}}>
                   <Image source={{uri: '../../assets/images/female_1.png'}} style={{width: '100%', height: '100%', resizeMode: 'contain'}}/>
                </View>
                <Text style={{...Fonts.black14InterMedium, textAlign: 'center', fontWeight: 'bold'}}>Female</Text>
                <Text style={{...Fonts.gray12RobotoMedium, textAlign: 'center'}}>{data?.match_manglik_report?.female.is_present == true ? 'Manglik' : 'Non Manglik'}</Text>
            </View>
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
          Manglik Match
        </Text>
      </View>
    );
  }
};

export default ManglikMatch;

const styles = StyleSheet.create({
  row: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
