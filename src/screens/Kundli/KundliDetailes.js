import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors, Fonts, Sizes} from '../../assets/style';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MyStatusBar from '../../components/MyStatusBar';
import {SCREEN_WIDTH} from '../../config/Screen';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import {
  api2_get_chart,
  api2_get_kundli_lagna,
  api_url,
  kundli_get_panchang,
} from '../../config/constants';
import moment from 'moment';
import { SvgCssUri, SvgUri } from 'react-native-svg';
import Loader from '../../components/Loader';
import ShowSvg from '../../components/ShowSvg';

const categoryData = [
  {id: 1, title: 'Details'},
  {id: 2, title: 'Lagna'},
  {id: 3, title: 'Dosha'},
  {id: 4, title: 'Panchang'},
  {id: 5, title: 'Prediction'},
];

const todayData = [
  {id: 1, title: 'Choghadiya'},
  {id: 2, title: 'Subh Hora'},
  {id: 3, title: 'Nakshatra'},
];

const KundliDetailes = ({navigation, route}) => {
  const [img, setImg] = useState();
  const [state, setState] = useState({
    selectedItem: 1,
    kundliData: route.params.kundliData,
    panchangData: null,
    chartData: null,
    isLoading: false
  });

  useEffect(() => {
    get_kundli_details();
    get_lagna();
  }, []);

  const get_lagna = async () => {
  
      updateState({isLoading: true})
      await axios({
        method: 'post',
        headers: 'multipart/form-data',
        url: api_url+api2_get_kundli_lagna,
        data: {
          day:14,
          month:2,
          year:2024,
hour:10,
min:30,
lat:+28.6139,
lon:+77.2090,
tzone:+5.5,
planetColor:'#FF0000',
signColor:'#00FF00',
lineColor:'#0000FF',
chartType:'circular',
        }
      }).then(res => {
        console.log('KundliLagna=====>',res.data);
        setImg(res.data.svg);
      }).catch(err => {
     console.log(err);
      updateState({isLoading: false});
    })
  }


  const get_kundli_details = async () => {
    try{
      updateState({isLoading: true})
      const kundli_panchang = await axios({
        method: 'post',
        url: api_url + kundli_get_panchang,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: {
          kundli_id: kundliData?.kundali_id,
        },
      });
  
      const kundli_chart = await axios({
        method: 'post',
        url: api_url + api2_get_chart,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: {
          kundli_id: kundliData?.kundali_id,
          chartid: 'D1',
        },
      });
      updateState({
        panchangData: kundli_panchang.data,
        chartData: kundli_chart.data?.svg_code,
      });
      updateState({isLoading: false})
    }catch(e){
      console.log(e)
      updateState({isLoading: false})
    }

  };

  const updateState = data => {
    setState(prevState => {
      const newData = {...prevState, ...data};
      return newData;
    });
  };

  const {selectedItem, kundliData, panchangData, chartData, isLoading} = state;

  return (
    <View style={{flex: 1, backgroundColor: Colors.bodyColor}}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      <Loader visible={isLoading} />
      {header()}
      {categoryInfo()}
      <View style={{flex: 1}}>
        <FlatList
          ListHeaderComponent={
            <>
              {selectedItem == 1
                ? kundliDetailesInfo()
                : selectedItem == 2
                ? chartData && lagnaInfo()
                : selectedItem == 3
                ? doshaInfo()
                : selectedItem == 4
                ? panchangData && panchangInfo()
                : predictionInfo()}
            </>
          }
        />
      </View>
    </View>
  );

  function predictionInfo() {
    return (
      <View style={{margin: Sizes.fixPadding * 1.5}}>
        <View style={{marginBottom: Sizes.fixPadding * 1.5}}>
          <Text
            style={{
              ...Fonts.black18RobotoMedium,
              marginBottom: Sizes.fixPadding,
            }}>
            Personal Life
          </Text>
          <Text style={{...Fonts.gray16RobotoRegular}}>
            Your personal communications will have an emotional depth and will
            be fruitful. You shall be very popular in social circles. You may
            make plans of investing in a new home, property or a vehicle. You
            will discuss your future plans with loved ones.
          </Text>
        </View>
        <View style={{marginBottom: Sizes.fixPadding * 1.5}}>
          <Text
            style={{
              ...Fonts.black18RobotoMedium,
              marginBottom: Sizes.fixPadding,
            }}>
            Luck
          </Text>
          <Text style={{...Fonts.gray16RobotoRegular}}>
            You shall experience happiness and excitement all around. You will
            move ahead with renewed vigor and confidence and achieve even the
            seemingly impossible tasks.
          </Text>
        </View>
        <View style={{marginBottom: Sizes.fixPadding * 1.5}}>
          <Text
            style={{
              ...Fonts.black18RobotoMedium,
              marginBottom: Sizes.fixPadding,
            }}>
            Health
          </Text>
          <Text style={{...Fonts.gray16RobotoRegular}}>
            Travel will help you in overcoming your boredom for a short period.
            You'll remain enthusiastic during traveling.
          </Text>
        </View>
        <View style={{marginBottom: Sizes.fixPadding * 1.5}}>
          <Text
            style={{
              ...Fonts.black18RobotoMedium,
              marginBottom: Sizes.fixPadding,
            }}>
            Profession
          </Text>
          <Text style={{...Fonts.gray16RobotoRegular}}>
            A opportunity opens up to offer you better prospects in your career.
            Family and friends shall help you financially to set up your won
            venture. Businessmen
          </Text>
        </View>
      </View>
    );
  }

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
        <View style={[styles.panchangItems, {borderBottomWidth: 0}]}>
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
          <Text style={styles.panchangSubText}>{panchangData?.tithi}</Text>
        </View>
        <View style={styles.panchangItems}>
          <Text style={styles.panchangMainText}>Nakshatra</Text>
          <Text style={styles.panchangSubText}>{panchangData?.nakshatra}</Text>
        </View>
        <View style={styles.panchangItems}>
          <Text style={styles.panchangMainText}>Karan</Text>
          <Text style={styles.panchangSubText}>{panchangData?.karan}</Text>
        </View>
        <View style={styles.panchangItems}>
          <Text style={styles.panchangMainText}>Paksha</Text>
          <Text style={styles.panchangSubText}>{panchangData?.tithi}</Text>
        </View>
        <View style={styles.panchangItems}>
          <Text style={styles.panchangMainText}>Yog</Text>
          <Text style={styles.panchangSubText}>{panchangData?.yog}</Text>
        </View>
        <View style={[styles.panchangItems, {borderBottomWidth: 0}]}>
          <Text style={styles.panchangMainText}>Day</Text>
          <Text style={styles.panchangSubText}>{panchangData?.day}</Text>
        </View>
      </View>
    );
  }

  function sunriseMoonRiseInfo() {
    return (
      <View
        style={[
          styles.row,
          {margin: Sizes.fixPadding * 1.5, justifyContent: 'space-between'},
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
            style={{width: 25, height: 25}}
          />
          <Text
            style={{
              ...Fonts.gray12RobotoRegular,
              marginLeft: Sizes.fixPadding,
            }}>
            {`${moment(panchangData?.vedic_sunrise, 'hh:mm:ss').format(
              'hh:mm A',
            )}-${moment(panchangData?.vedic_sunset, 'hh:mm:ss').format(
              'hh:mm A',
            )}`}
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
            style={{width: 25, height: 25}}
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
        <View style={[styles.row, {justifyContent: 'space-between'}]}>
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
              style={{width: 25, height: 25}}
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
              style={{width: 25, height: 25}}
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

  function todaysInfo() {
    const renderItem = ({item, index}) => {
      return (
        <TouchableOpacity>
          <LinearGradient
            colors={[Colors.whiteDark, Colors.grayLight]}
            style={{
              width: SCREEN_WIDTH * 0.3,
              marginRight: Sizes.fixPadding * 2,
              paddingVertical: Sizes.fixPadding * 0.8,
              borderRadius: 1000,
            }}>
            <Text
              style={{
                ...Fonts.gray14RobotoMedium,
                color: Colors.blackLight,
                textAlign: 'center',
              }}>
              {item.title}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      );
    };
    return (
      <View
        style={{
          paddingVertical: Sizes.fixPadding * 1.5,
          borderBottomWidth: 1,
          borderBottomColor: Colors.grayLight,
        }}>
        <Text
          style={{
            ...Fonts.gray16RobotoMedium,
            color: Colors.blackLight,
            marginHorizontal: Sizes.fixPadding * 1.5,
            marginBottom: Sizes.fixPadding * 1.5,
          }}>
          Today's
        </Text>
        <FlatList
          data={todayData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          horizontal
          contentContainerStyle={{paddingLeft: Sizes.fixPadding * 1.5}}
        />
      </View>
    );
  }

  function panchangInfo() {
    return (
      <View>
        {todaysInfo()}
        {todayLocationInfo()}
        {sunriseMoonRiseInfo()}
        {panchangDetailes()}
        {hinduCalenderTitleInfo()}
        {hinduCalenderInfo()}
      </View>
    );
  }

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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum
            dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit
            amet, consectetur adipiscing elit consectetur adipiscing elitipsum
            dolor sit ametLorem ipsum dolor sit amet, Lorem ipsum dolor sit
            amet, consectetur adipiscing elitconsectetur adipiscing elit
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
            Kalsarpa dosha is not detected in your horoscope.
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
            No, currently you are not undergoing Sadhesati.{' '}
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
            Pitri Dosha
          </Text>
          <Text style={{...Fonts.gray16RobotoRegular}}>
            Pitra Dosha is a Karmic Debt of the ancestors and reflected in the
            horoscope in the form of planetary combinations. It can also happen
            due to the neglect of ancestors and not providing them their proper
            due in the form of shraddh or charity or spiritual upliftments.
            {'\n'}
            Congratulations!! Your horoscope is free from Pitra Dosha.
          </Text>
        </View>
      </View>
    );
  }

  function lagnaInfo() {

    return (
      <View>
        <ShowSvg data={chartData} />
        <SvgUri uri={img} width={350} height={350}  />
        <View
          style={{
            marginHorizontal: Sizes.fixPadding * 1.5,
            marginVertical: Sizes.fixPadding,
          }}>
          <Text style={{...Fonts.gray16RobotoRegular}}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum
            dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit
            amet, consectetur adipiscing elit consectetur adipiscing elitipsum
            dolor sit ametLorem ipsum dolor sit amet, Lorem ipsum dolor sit
            amet, consectetur adipiscing elitconsectetur adipiscing elit
          </Text>
        </View>
      </View>
    );
  }

  function kundliDetailesInfo() {
    return (
      <View
        style={{
          margin: Sizes.fixPadding * 1.5,
          backgroundColor: Colors.whiteDark,
          borderRadius: Sizes.fixPadding,
        }}>
        <View style={styles.panchangItems}>
          <Text style={styles.panchangMainText}>Birth Date</Text>
          <Text style={styles.panchangSubText}>18-11-1997</Text>
        </View>
        <View style={styles.panchangItems}>
          <Text style={styles.panchangMainText}>Birth Time</Text>
          <Text style={styles.panchangSubText}>12:35 PM</Text>
        </View>
        <View style={styles.panchangItems}>
          <Text style={styles.panchangMainText}>Birth Place</Text>
          <Text style={styles.panchangSubText}>Maharashtra, India</Text>
        </View>
        <View style={styles.panchangItems}>
          <Text style={styles.panchangMainText}>Gan</Text>
          <Text style={styles.panchangSubText}>Manushya</Text>
        </View>
        <View style={styles.panchangItems}>
          <Text style={styles.panchangMainText}>Sign Lord</Text>
          <Text style={styles.panchangSubText}>Mercury</Text>
        </View>
        <View style={styles.panchangItems}>
          <Text style={styles.panchangMainText}>Sign</Text>
          <Text style={styles.panchangSubText}>Yoni</Text>
        </View>
        <View style={styles.panchangItems}>
          <Text style={styles.panchangMainText}>Gemini</Text>
          <Text style={styles.panchangSubText}>Swaan</Text>
        </View>
        <View style={styles.panchangItems}>
          <Text style={styles.panchangMainText}>Nakshatra Lord</Text>
          <Text style={styles.panchangSubText}>Rahu</Text>
        </View>
        <View style={styles.panchangItems}>
          <Text style={styles.panchangMainText}>Nakshatra</Text>
          <Text style={styles.panchangSubText}>Vashya</Text>
        </View>
        <View style={styles.panchangItems}>
          <Text style={styles.panchangMainText}>Shoodra</Text>
          <Text style={styles.panchangSubText}>Maanav</Text>
        </View>
        <View style={styles.panchangItems}>
          <Text style={styles.panchangMainText}>Nadi</Text>
          <Text style={styles.panchangSubText}>Adi</Text>
        </View>
        <View style={styles.panchangItems}>
          <Text style={styles.panchangMainText}>Charan</Text>
          <Text style={styles.panchangSubText}>4</Text>
        </View>
        <View style={[styles.panchangItems, {borderBottomWidth: 0}]}>
          <Text style={styles.panchangMainText}>Tatva</Text>
          <Text style={styles.panchangSubText}>Air</Text>
        </View>
      </View>
    );
  }

  function categoryInfo() {
    const renderItem = ({item, index}) => {
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => updateState({selectedItem: item.id})}>
          <LinearGradient
            colors={
              selectedItem == item.id
                ? [Colors.primaryLight, Colors.primaryDark]
                : [Colors.grayLight, Colors.whiteDark]
            }
            style={{
              width: SCREEN_WIDTH * 0.28,
              paddingVertical: Sizes.fixPadding * 0.8,
              marginRight: Sizes.fixPadding * 2,
              borderRadius: 1000,
            }}>
            <Text
              style={
                selectedItem == item.id
                  ? {...Fonts.white14RobotoRegular, textAlign: 'center'}
                  : {...Fonts.black14RobotoRegular, textAlign: 'center'}
              }>
              {item.title}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      );
    };

    return (
      <View
        style={{
          paddingVertical: Sizes.fixPadding,
          borderBottomWidth: 1,
          borderBottomColor: Colors.grayLight,
        }}>
        <FlatList
          data={categoryData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{paddingLeft: Sizes.fixPadding * 2}}
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
          Kundli
        </Text>
      </View>
    );
  }
};

export default KundliDetailes;

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
    ...Fonts.gray14RobotoMedium,
    color: Colors.blackLight,
    flex: 0.5,
  },
  panchangSubText: {
    ...Fonts.gray14RobotoMedium,
    color: Colors.blackLight,
    flex: 0.5,
  },
});
