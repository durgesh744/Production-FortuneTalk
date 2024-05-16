import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Colors, Fonts, Sizes } from '../../assets/style';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MyStatusBar from '../../components/MyStatusBar';
import { SCREEN_WIDTH } from '../../config/Screen';
import LinearGradient from 'react-native-linear-gradient';
import { request, check, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import {
  api_url,
  api2_get_chaughadiya,
  api2_get_subh_hora,
  api2_get_nakshatra,
  api2_get_match_making,
  userID,
  apikey,
} from '../../config/constants';
import Choghadiya from '../Panchang/Choghadiya';
import SubhHora from '../Panchang/SubhHora';
import SubhMuhurat from '../Panchang/SubhMuhurat';
import Nakshatra from '../Panchang/Nakshatra';
import Tithi from '../Panchang/Tithi';
import Yoga from '../Panchang/Yoga';
import Karana from '../Panchang/Karana';
import RahuKaal from '../Panchang/RahuKaal';
import { screensEnabled } from 'react-native-screens';
import { connect } from 'react-redux';
import * as KundliActions from '../../redux/actions/KundliActions'
import { config } from 'npm';
var Buffer = require('buffer/').Buffer;
const basURL = 'https://json.astrologyapi.com/v1/';

const todayData = [
  { id: 1, title: 'Choghadiya' },
  { id: 2, title: 'Subh Hora' },
  { id: 3, title: 'Subh Muhurat' },
  { id: 4, title: 'Nakshatra' },
  { id: 5, title: 'Tithi' },
  { id: 6, title: 'Yoga' },
  { id: 7, title: 'Karana' },
  { id: 8, title: 'Rahu Kaal' },
];


const api = axios.create({
  baseURL: basURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// api.interceptors.request.use((config)) => {
//   const auth = 'Basic' +  Buffer.from(userID + ':' + 'apikey).toString('base64');
//   config.header.Authorizatio = auth;
//   return config
// }

const Tab = createMaterialTopTabNavigator();

const Panchang = ({ navigation, panchangData, dispatch,route }) => {
  const [activeTab, setActiveTab] = useState('Choghadiya');
  const [state, setState] = useState({
    isLoading: false,
    // panchangData: null,
    location: null,
  });

  
  useEffect(()=>{}, [panchangData])

  const handleTabPress = tabName => {
    setActiveTab(tabName);
  };

  useEffect(() => {
    locationPermission();
  }, []);

  const locationPermission = async () => {
    const status = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    if (status === RESULTS.GRANTED) {
      get_current_location();
    } else {
      const result = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      if (result === RESULTS.GRANTED) {
        get_current_location();
      } else {
      }
    }
  };

 
  const get_current_location = () => {
    Geolocation.getCurrentPosition(
      position => {
        const payload = {
          date: new Date().getDate().toString(),
          month: new Date().getMonth(),
          year: new Date().getFullYear(),
          hour: new Date().getHours(),
          minute: new Date().getMinutes(),
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }
        dispatch(KundliActions.setCurrentLatLong({ lat: position.coords.latitude, long: position.coords.longitude }))
        dispatch(KundliActions.getPanchangData(payload))
      },
      error => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

  const get_panchang_data = async (latitude, longitude) => {
    updateState({ isLoading: true });
    await axios({
      method: 'post',
      url: api_url,
      data: {},
    })
      .then(res => {
        // console.log(res.data);
        updateState({ isLoading: false });
      })
      .catch(err => {
        console.log(err);
        updateState({ isLoading: false });
      });
  };

  const updateState = data => {
    setState(prevState => {
      const newData = { ...prevState, ...data };
      return newData;
    });
  };

  const { isLoading } = state;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyColor }}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      {header()}
      <View style={{ flex: 1 }}>
        {panchangInfo()}
        {todaysInfo()}
        {/* <FlatList
          ListHeaderComponent={
            <>
              {panchangInfo()}
              
              {todayLocationInfo()}
              {sunriseMoonRiseInfo()}
              {panchangDetailes()}
              {hinduCalenderTitleInfo()}
              {hinduCalenderInfo()}
            </>
          }
        /> */}
      </View>
    </View>
  );

  function hinduCalenderInfo() {
    return (
      <View
        style={{
          margin: Sizes.fixPadding * 1.5,
          backgroundColor: Colors.whiteDark,
          borderRadius: Sizes.fixPadding,
        }}>
        <View style={styles.panchangItems}>
          <Text style={styles.panchangMainText}>Shaka Samvat</Text>
          <Text style={styles.panchangSubText}>1945</Text>
        </View>
        <View style={[styles.panchangItems, { borderBottomWidth: 0 }]}>
          <Text style={styles.panchangMainText}>Shaka Samvat</Text>
          <Text style={styles.panchangSubText}>1945</Text>
        </View>
      </View>
    );
  }

  function hinduCalenderTitleInfo() {
    return (
      <View
        style={[
          {
            margin: Sizes.fixPadding * 1.5,
            borderWidth: 2,
            justifyContent: 'center',
            paddingVertical: Sizes.fixPadding * 0.8,
            borderRadius: 1000,
            borderColor: Colors.gray,
          },
        ]}>
        <Text
          style={{
            ...Fonts.gray18RobotoMedium,
            marginLeft: Sizes.fixPadding * 2,
          }}>
          Hindu Month & Year
        </Text>
      </View>
    );
  }

  function panchangDetailes() {
    return (
      <View
        style={{
          margin: Sizes.fixPadding * 1.5,
          backgroundColor: Colors.whiteDark,
          borderRadius: Sizes.fixPadding,
        }}>
        <View style={styles.panchangItems}>
          <Text style={styles.panchangMainText}>Tithi</Text>
          <Text style={styles.panchangSubText}>Till 02:01 AM, 22 Aug</Text>
        </View>
        <View style={styles.panchangItems}>
          <Text style={styles.panchangMainText}>Nakshatra</Text>
          <Text style={styles.panchangSubText}>
            Chitra Till 06:32 AM, 22 Aug
          </Text>
        </View>
        <View style={styles.panchangItems}>
          <Text style={styles.panchangMainText}>Karan</Text>
          <Text style={styles.panchangSubText}>
            Baalav Till 01:57 AM, 22 Aug
          </Text>
        </View>
        <View style={styles.panchangItems}>
          <Text style={styles.panchangMainText}>Paksha</Text>
          <Text style={styles.panchangSubText}>Shukla-Paksha</Text>
        </View>
        <View style={styles.panchangItems}>
          <Text style={styles.panchangMainText}>Yog</Text>
          <Text style={styles.panchangSubText}>Shubh Till 10:20 PM</Text>
        </View>
        <View style={[styles.panchangItems, { borderBottomWidth: 0 }]}>
          <Text style={styles.panchangMainText}>Day</Text>
          <Text style={styles.panchangSubText}>Monday</Text>
        </View>
      </View>
    );
  }

  function sunriseMoonRiseInfo() {
    return (
      <View
        style={[
          styles.row,
          { margin: Sizes.fixPadding * 1.5, justifyContent: 'space-between' },
        ]}>
        <View
          style={[
            styles.row,
            {
              width: '48%',
              borderWidth: 2,
              justifyContent: 'center',
              paddingVertical: Sizes.fixPadding * 0.8,
              borderRadius: 1000,
              borderColor: Colors.gray,
            },
          ]}>
          <Image
            source={require('../../assets/images/icons/sunrise.png')}
            style={{ width: 25, height: 25 }}
          />
          <Text
            style={{
              ...Fonts.gray12RobotoRegular,
              marginLeft: Sizes.fixPadding,
            }}>
            05:52 AM-06:54 PM
          </Text>
        </View>
        <View
          style={[
            styles.row,
            {
              width: '48%',
              borderWidth: 2,
              justifyContent: 'center',
              paddingVertical: Sizes.fixPadding * 0.8,
              borderRadius: 1000,
              borderColor: Colors.gray,
            },
          ]}>
          <Image
            source={require('../../assets/images/icons/moon.png')}
            style={{ width: 25, height: 25 }}
          />
          <Text
            style={{
              ...Fonts.gray12RobotoRegular,
              marginLeft: Sizes.fixPadding,
            }}>
            05:52 AM-06:54 PM
          </Text>
        </View>
      </View>
    );
  }

  function todayLocationInfo() {
    return (
      <View
        style={{
          padding: Sizes.fixPadding * 1.5,
          borderBottomWidth: 1,
          borderBottomColor: Colors.grayLight,
        }}>
        <View style={[styles.row, { justifyContent: 'space-between' }]}>
          <TouchableOpacity
            style={[
              styles.row,
              {
                borderWidth: 2,
                padding: Sizes.fixPadding,
                borderRadius: 1000,
                borderColor: Colors.gray,
                paddingVertical: Sizes.fixPadding * 0.8,
              },
            ]}>
            <Image
              source={require('../../assets/images/icons/magic-book.png')}
              style={{ width: 25, height: 25 }}
            />
            <Text
              style={{
                ...Fonts.gray16RobotoMedium,
                marginLeft: Sizes.fixPadding,
              }}>
              Today's Panchang
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.row,
              {
                borderWidth: 2,
                padding: Sizes.fixPadding,
                borderRadius: 1000,
                borderColor: Colors.gray,
                paddingVertical: Sizes.fixPadding * 0.8,
              },
            ]}>
            <Image
              source={require('../../assets/images/icons/pin.png')}
              style={{ width: 25, height: 25 }}
            />
            <Text
              style={{
                ...Fonts.gray16RobotoMedium,
                marginLeft: Sizes.fixPadding,
              }}>
              Location
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // function todaysInfo() {
  //   const renderItem = ({item, index}) => {
  //     return (
  //       <TouchableOpacity>
  //         <LinearGradient
  //           colors={[Colors.whiteDark, Colors.grayLight]}
  //           style={{
  //             width: SCREEN_WIDTH * 0.3,
  //             marginRight: Sizes.fixPadding * 2,
  //             paddingVertical: Sizes.fixPadding * 0.8,
  //             borderRadius: 1000,
  //           }}>
  //           <Text
  //             style={{
  //               ...Fonts.gray14RobotoMedium,
  //               color: Colors.blackLight,
  //               textAlign: 'center',
  //             }}>
  //             {item.title}
  //           </Text>
  //         </LinearGradient>
  //       </TouchableOpacity>
  //     );
  //   };
  //   return (
  //     <View
  //       style={{
  //         paddingVertical: Sizes.fixPadding * 1.5,
  //         borderBottomWidth: 1,
  //         borderBottomColor: Colors.grayLight,
  //       }}>
  //       <Text
  //         style={{
  //           ...Fonts.gray16RobotoMedium,
  //           color: Colors.blackLight,
  //           marginHorizontal: Sizes.fixPadding * 1.5,
  //           marginBottom: Sizes.fixPadding * 1.5,
  //         }}>
  //         Today's
  //       </Text>
  //       <FlatList
  //         data={todayData}
  //         renderItem={renderItem}
  //         keyExtractor={item => item.id}
  //         horizontal
  //         contentContainerStyle={{paddingLeft: Sizes.fixPadding * 1.5}}
  //       />
  //     </View>
  //   );
  // }

  function todaysInfo() {
    return (
      <View style={{ flex: 1 }}>
        <Tab.Navigator screenOptions={{
          tabBarIndicatorStyle: { backgroundColor: Colors.primaryLight },
        }}
          tabBarOptions={{
            scrollEnabled: true,
          }}>
        <Tab.Screen name="choghadiya" component={Choghadiya}  />
          <Tab.Screen name="subhHora" component={SubhHora} />
      <Tab.Screen name="subhMuhurat" component={SubhMuhurat} />
          <Tab.Screen name="nakshatra" component={Nakshatra} />
          <Tab.Screen name="tithi" component={Tithi} />
          <Tab.Screen name="yoga" component={Yoga} />
          <Tab.Screen name="karana" component={Karana} />
          <Tab.Screen name="rahuKaal" component={RahuKaal} />
        </Tab.Navigator>
      </View>
    );
  }

  function panchangInfo() {
    return (
      <View
        style={{
          padding: Sizes.fixPadding * 1.5,
          borderBottomWidth: 1,
          borderBottomColor: Colors.grayLight,
        }}>
        <Text style={{ ...Fonts.gray16RobotoMedium, color: Colors.blackLight }}>
          Panchang
        </Text>
        <Text
          style={{
            ...Fonts.gray14RobotoRegular,
            marginTop: Sizes.fixPadding * 0.8,
          }}>
          A Panchang is an elaborate Hindu calendar and almanac that resorts to
          the traditional units of the Indian Vedic scriptures to provide
          information relevant to astrologers for them to forecast celestial
          occurrences, mark auspicious and inauspicious time frames for
          important occasions such as marriage, education, career, travel, etc.
        </Text>
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
          Panchang
        </Text>
      </View>
    );
  }
};

const mapStateToProps = state => ({
  panchangData: state.kundli.panchangData
  
})

const mapDispatchToProps = dispatch => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(Panchang);

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
  panchangItems: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Sizes.fixPadding,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayLight,
  },
  panchangMainText: {
    ...Fonts.gray16RobotoMedium,
    color: Colors.blackLight,
  },
  panchangSubText: {
    ...Fonts.gray14RobotoMedium,
    color: Colors.blackLight,
  },
});

// import { StyleSheet, Text, View } from 'react-native';
// import React from 'react';
// import Choghadiya from '../Panchang/Choghadiya';
// import SubhHora from '../Panchang/SubhHora';
// import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

// const Tab = createMaterialTopTabNavigator();

// const Panchang = () => {
//   return (
// <Tab.Navigator>
//   <Tab.Screen name="choghadiya" component={Choghadiya} />
//   <Tab.Screen name="subhHora" component={SubhHora} />
// </Tab.Navigator>
//   )
// }

// export default Panchang

// const styles = StyleSheet.create({})
