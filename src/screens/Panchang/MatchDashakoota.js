import {
  StyleSheet,
  Text,
  View,
  ScrollView,
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
  get_Daskoot,
} from '../../config/constants';
import axios from 'axios';
import Entypo from 'react-native-vector-icons/Entypo';

const MatchDashakoota = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState('');


  console.log('ye hi edata jo back se aa rha hi male',props.route.params.data3)
  console.log('ye hi edata female', props.route.params.data4);



  useEffect(() => {
    get_Dashkoota();
  }, []);


  const get_Dashkoota = async () => {
    await axios({
      method: 'post',
      url: api_url + get_Daskoot,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        m_kundli_id : props.route.params.data3,
        f_kundli_id : props.route.params.data4,
      },
    })
      .then(res => {
        console.log('ye asktkoot ka data hi', res.data);
        setData(res.data);
      })
      .catch(err => {
        console.log(err);
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
        <FlatList
          ListHeaderComponent={
            <>
              {DashakootaInfo()}
              {DashakootaData()}
            </>
          }
        />
      </View>
    </View>
  );

  function DashakootaData() {
    return (
      <View
        style={{
          width: SCREEN_WIDTH * 0.9,
          alignSelf: 'center',
          marginVertical: Sizes.fixPadding,
        }}>
        <View
          style={{
            backgroundColor: Colors.whiteDark,
            width: SCREEN_WIDTH * 0.9,
            // justifyContent: 'space-between',
            borderRadius: Sizes.fixPadding,
          }}>
          <View
            style={{
              borderBottomColor: Colors.gray,
              borderBottomWidth: 1,
              flexDirection: 'row',
              paddingHorizontal: Sizes.fixPadding * 1.5,
              paddingVertical: Sizes.fixPadding,
              justifyContent: 'space-between',
            }}>
            <Text style={{...Fonts.primaryLight14RobotoMedium}}>Attribute</Text>
            <Text style={{...Fonts.primaryLight14RobotoMedium}}>Points</Text>
            <Text style={{...Fonts.primaryLight14RobotoMedium}}>Match</Text>
          </View>
          <View
            style={{
              borderBottomColor: Colors.gray,
              borderBottomWidth: 1,
              flexDirection: 'row',
              paddingHorizontal: Sizes.fixPadding * 1.5,
              paddingVertical: Sizes.fixPadding,
              // justifyContent: 'space-between',
            }}>
            <Text style={{...Fonts.gray14RobotoMedium, width: '35%'}}>
              Dina
            </Text>
            <Text
              style={{
                ...Fonts.gray14RobotoMedium,
                width: '40%',
                textAlign: 'center',
              }}>
              {data?.match_dashakoot_points?.dina.total_points}
            </Text>
            <Text
              style={{
                ...Fonts.gray14RobotoMedium,
                width: '35%',
                textAlign: 'center',
              }}>
              {data?.match_dashakoot_points?.dina.received_points}
            </Text>
          </View>
          <View
            style={{
              borderBottomColor: Colors.gray,
              borderBottomWidth: 1,
              flexDirection: 'row',
              paddingHorizontal: Sizes.fixPadding * 1.5,
              paddingVertical: Sizes.fixPadding,
              // justifyContent: 'space-between',
            }}>
            <Text style={{...Fonts.gray14RobotoMedium, width: '35%'}}>
              Gana
            </Text>
            <Text
              style={{
                ...Fonts.gray14RobotoMedium,
                width: '40%',
                textAlign: 'center',
              }}>
              {data?.match_dashakoot_points?.gana.total_points}
            </Text>
            <Text
              style={{
                ...Fonts.gray14RobotoMedium,
                width: '35%',
                textAlign: 'center',
              }}>
              {data?.match_dashakoot_points?.gana.received_points}
            </Text>
          </View>
          <View
            style={{
              borderBottomColor: Colors.gray,
              borderBottomWidth: 1,
              flexDirection: 'row',
              paddingHorizontal: Sizes.fixPadding * 1.5,
              paddingVertical: Sizes.fixPadding,
            }}>
            <Text style={{...Fonts.gray14RobotoMedium, width: '35%'}}>
              Yoni
            </Text>
            <Text
              style={{
                ...Fonts.gray14RobotoMedium,
                width: '40%',
                textAlign: 'center',
              }}>
              {data?.match_dashakoot_points?.yoni.total_points}
            </Text>
            <Text
              style={{
                ...Fonts.gray14RobotoMedium,
                width: '35%',
                textAlign: 'center',
              }}>
              {data?.match_dashakoot_points?.yoni.received_points}
            </Text>
          </View>
          <View
            style={{
              borderBottomColor: Colors.gray,
              borderBottomWidth: 1,
              flexDirection: 'row',
              paddingHorizontal: Sizes.fixPadding * 1.5,
              paddingVertical: Sizes.fixPadding,
              justifyContent: 'space-between',
            }}>
            <Text style={{...Fonts.gray14RobotoMedium, width: '35%'}}>
              Rashi
            </Text>
            <Text
              style={{
                ...Fonts.gray14RobotoMedium,
                width: '40%',
                textAlign: 'center',
              }}>
              {data?.match_dashakoot_points?.rashi.total_points}
            </Text>
            <Text
              style={{
                ...Fonts.gray14RobotoMedium,
                width: '35%',
                textAlign: 'center',
              }}>
              {data?.match_dashakoot_points?.rashi.received_points}
            </Text>
          </View>
          <View
            style={{
              borderBottomColor: Colors.gray,
              borderBottomWidth: 1,
              flexDirection: 'row',
              paddingHorizontal: Sizes.fixPadding * 1.5,
              paddingVertical: Sizes.fixPadding,
              justifyContent: 'space-between',
            }}>
            <Text style={{...Fonts.gray14RobotoMedium, width: '35%'}}>
              Rasyadhipati
            </Text>
            <Text
              style={{
                ...Fonts.gray14RobotoMedium,
                width: '40%',
                textAlign: 'center',
              }}>
              {data?.match_dashakoot_points?.rasyadhipati.total_points}
            </Text>
            <Text
              style={{
                ...Fonts.gray14RobotoMedium,
                width: '35%',
                textAlign: 'center',
              }}>
             {data?.match_dashakoot_points?.rasyadhipati.received_points}
            </Text>
          </View>
          <View
            style={{
              borderBottomColor: Colors.gray,
              borderBottomWidth: 1,
              flexDirection: 'row',
              paddingHorizontal: Sizes.fixPadding * 1.5,
              paddingVertical: Sizes.fixPadding,
              justifyContent: 'space-between',
            }}>
            <Text style={{...Fonts.gray14RobotoMedium, width: '35%'}}>
              Rajju
            </Text>
            <Text
              style={{
                ...Fonts.gray14RobotoMedium,
                width: '40%',
                textAlign: 'center',
              }}>
              {data?.match_dashakoot_points?.rajju.total_points}
            </Text>
            <Text
              style={{
                ...Fonts.gray14RobotoMedium,
                width: '35%',
                textAlign: 'center',
              }}>
              {data?.match_dashakoot_points?.rajju.received_points}
            </Text>
          </View>
          <View
            style={{
              borderBottomColor: Colors.gray,
              borderBottomWidth: 1,
              flexDirection: 'row',
              paddingHorizontal: Sizes.fixPadding * 1.5,
              paddingVertical: Sizes.fixPadding,
              justifyContent: 'space-between',
            }}>
            <Text style={{...Fonts.gray14RobotoMedium, width: '35%'}}>
              Vedha
            </Text>
            <Text
              style={{
                ...Fonts.gray14RobotoMedium,
                width: '40%',
                textAlign: 'center',
              }}>
              {data?.match_dashakoot_points?.vedha.total_points}
            </Text>
            <Text
              style={{
                ...Fonts.gray14RobotoMedium,
                width: '35%',
                textAlign: 'center',
              }}>
              {data?.match_dashakoot_points?.vedha.received_points}
            </Text>
          </View>
          <View
            style={{
              borderBottomColor: Colors.gray,
              borderBottomWidth: 1,
              flexDirection: 'row',
              paddingHorizontal: Sizes.fixPadding * 1.5,
              paddingVertical: Sizes.fixPadding,
              justifyContent: 'space-between',
            }}>
            <Text style={{...Fonts.gray14RobotoMedium, width: '35%'}}>
              Vashya
            </Text>
            <Text
              style={{
                ...Fonts.gray14RobotoMedium,
                width: '40%',
                textAlign: 'center',
              }}>
              {data?.match_dashakoot_points?.vashya.total_points}
            </Text>
            <Text
              style={{
                ...Fonts.gray14RobotoMedium,
                width: '35%',
                textAlign: 'center',
              }}>
              {data?.match_dashakoot_points?.vashya.received_points}
            </Text>
          </View>
          <View
            style={{
              borderBottomColor: Colors.gray,
              borderBottomWidth: 1,
              flexDirection: 'row',
              paddingHorizontal: Sizes.fixPadding * 1.5,
              paddingVertical: Sizes.fixPadding,
            }}>
            <Text style={{...Fonts.gray14RobotoMedium, width: '35%'}}>
              Mahendra
            </Text>
            <Text
              style={{
                ...Fonts.gray14RobotoMedium,
                width: '40%',
                textAlign: 'center',
              }}>
              {data?.match_dashakoot_points?.mahendra.total_points}
            </Text>
            <Text
              style={{
                ...Fonts.gray14RobotoMedium,
                width: '35%',
                textAlign: 'center',
              }}>
              {data?.match_dashakoot_points?.mahendra.received_points}
            </Text>
          </View>
          <View
            style={{
              borderBottomColor: Colors.gray,
              borderBottomWidth: 1,
              flexDirection: 'row',
              paddingHorizontal: Sizes.fixPadding * 1.5,
              paddingVertical: Sizes.fixPadding,
            }}>
            <Text style={{...Fonts.gray14RobotoMedium, width: '35%'}}>
              StreetDeergha
            </Text>
            <Text
              style={{
                ...Fonts.gray14RobotoMedium,
                width: '40%',
                textAlign: 'center',
              }}>
              {data?.match_dashakoot_points?.streeDeergha.total_points}
            </Text>
            <Text
              style={{
                ...Fonts.gray14RobotoMedium,
                width: '35%',
                textAlign: 'center',
              }}>
              {data?.match_dashakoot_points?.streeDeergha.received_points}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: Sizes.fixPadding * 1.5,
              paddingVertical: Sizes.fixPadding,
            }}>
            <Text style={{...Fonts.primaryLight14RobotoMedium, width: '50%'}}>
              Total
            </Text>
            <Text
              style={{
                ...Fonts.primaryLight14RobotoMedium,
                width: '40%',
                testAlign: 'center',
              }}>
              {data?.match_dashakoot_points?.total.total_points}
            </Text>
            <Text
              style={{
                ...Fonts.primaryLight14RobotoMedium,
                width: '35%',
                testAlign: 'center',
              }}>
              {data?.match_dashakoot_points?.total.received_points}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  function DashakootaInfo() {
    return (
      <View
        style={{borderBottomWidth: 1.5, borderBottomColor: Colors.grayLight}}>
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
            What is Dashakoota?
          </Text>
          <Text style={{...Fonts.gray14RobotoMedium, color: Colors.grayMedium}}>
            Dashakoota system is Nakshatra based compstibily analysis that compares the Moon Nakshatras of the couple on 10 different
            attribute. it has a total strenght of 36 points and it is generally stated that 18 or more points of agreement is 
            considered good. It is mainly followed in South India.
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
          Dashakoota
        </Text>
      </View>
    );
  }
};

export default MatchDashakoota;

const styles = StyleSheet.create({
  row: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
