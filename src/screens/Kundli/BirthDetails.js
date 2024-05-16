import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
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
  api2_get_birth_details,
  api2_get_astro_detail,
} from '../../config/constants';
import axios from 'axios';

const birthInfo = [
  {
    id: 1,
  },
  {
    id: 2,
  },
  {
    id: 3,
  },
  {
    id: 4,
  },
  {
    id: 5,
  },
  {
    id: 6,
  },
];

const astroInfo = [
  {
    id: 1,
  },
  {
    id: 2,
  },
  {
    id: 3,
  },
  {
    id: 4,
  },
  {
    id: 5,
  },
  {
    id: 6,
  },
  {
    id: 7,
  },
  {
    id: 8,
  },
  {
    id: 9,
  },
  {
    id: 10,
  },
  {
    id: 11,
  },
  {
    id: 12,
  },
];

const detailInfo = [
  {
    id: 1,
    title: 'Birth Details',
  },
  {
    id: 2,
    title: 'Astro Details',
  },
];

const BirthDetails =  props => {
  console.log(props.route.params)
  const [isLoading, setIsLoading] = useState(false);
  const [birthData, setBirthData] = useState(null);
  const [astroDetail, setAstroDetail] = useState(null);
  const [state, setState] = useState({
    selectedItem: 1,
  });

  const updateState = data => {
    setState(prevState => {
      const newData = {...prevState, ...data};
      return newData;
    });
  };

  useEffect(() => {
    console.log('djfoaidf');
    get_birthDetail();
    get_astroDetail();
  }, []);

  const get_birthDetail = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + api2_get_birth_details,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        user_id: props.route.params.id,
      },
    })
      .then(res => {
        console.log('birthdetails=====>', res.data);
        setBirthData(res.data.birth_details);
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  };

  // console.log('birth--------->',birthData);

  const get_astroDetail = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + api2_get_astro_detail,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        user_id: props.route.params.id,
      },
    })
      .then(res => {
        console.log('astrodetails=====>', res.data);
        setAstroDetail(res.data.astro_details);
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  };

  // console.log('i am here');
  // get_birthDetail();
  // get_astroDetail();

  const {selectedItem} = state;

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
            <>{selectedItem == 1 ? birthDetails() : astroDetails()}</>
          }
        />
      </View>
    </View>
  );

  function astroDetails() {
    return (
      astroDetail && (
      <View style={{marginVertical: Sizes.fixPadding * 1.5}}>
        <View
          style={{
            backgroundColor: Colors.whiteDark,
            width: SCREEN_WIDTH * 0.9,
            justifyContent: 'space-between',
            marginHorizontal: Sizes.fixPadding * 2,
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
            <Text style={{...Fonts.gray14RobotoMedium}}>Ascendent</Text>
            <Text style={{...Fonts.gray14RobotoMedium}}>{astroDetail.ascendant}</Text>
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
            <Text style={{...Fonts.gray14RobotoMedium}}>Ascendent Lord</Text>
            <Text style={{...Fonts.gray14RobotoMedium}}>{astroDetail.ascendant_lord}</Text>
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
            <Text style={{...Fonts.gray14RobotoMedium}}>Varna</Text>
            <Text style={{...Fonts.gray14RobotoMedium}}>{astroDetail.Varna}</Text>
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
            <Text style={{...Fonts.gray14RobotoMedium}}>Vashya</Text>
            <Text style={{...Fonts.gray14RobotoMedium}}>{astroDetail.Vashya}</Text>
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
            <Text style={{...Fonts.gray14RobotoMedium}}>Yona</Text>
            <Text style={{...Fonts.gray14RobotoMedium}}>{astroDetail.Yoni}</Text>
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
            <Text style={{...Fonts.gray14RobotoMedium}}>Gan</Text>
            <Text style={{...Fonts.gray14RobotoMedium}}>{astroDetail.Gan}</Text>
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
            <Text style={{...Fonts.gray14RobotoMedium}}>Nadi</Text>
            <Text style={{...Fonts.gray14RobotoMedium}}>{astroDetail.Nadi}</Text>
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
            <Text style={{...Fonts.gray14RobotoMedium}}>Sign Lord</Text>
            <Text style={{...Fonts.gray14RobotoMedium}}>{astroDetail.SignLord}</Text>
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
            <Text style={{...Fonts.gray14RobotoMedium}}>Sign</Text>
            <Text style={{...Fonts.gray14RobotoMedium}}>{astroDetail.sign}</Text>
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
            <Text style={{...Fonts.gray14RobotoMedium}}>Nakshatra</Text>
            <Text style={{...Fonts.gray14RobotoMedium}}>{astroDetail.Naksahtra}</Text>
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
            <Text style={{...Fonts.gray14RobotoMedium}}>Nakshatra Lord</Text>
            <Text style={{...Fonts.gray14RobotoMedium}}>{astroDetail.NaksahtraLord}</Text>
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
            <Text style={{...Fonts.gray14RobotoMedium}}>Charan</Text>
            <Text style={{...Fonts.gray14RobotoMedium}}>{astroDetail.Charan}</Text>
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
            <Text style={{...Fonts.gray14RobotoMedium}}>Yog</Text>
            <Text style={{...Fonts.gray14RobotoMedium}}>{astroDetail.Yog}</Text>
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
            <Text style={{...Fonts.gray14RobotoMedium}}>Kaban</Text>
            <Text style={{...Fonts.gray14RobotoMedium}}>{astroDetail.Karan}</Text>
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
            <Text style={{...Fonts.gray14RobotoMedium}}>Tithi</Text>
            <Text style={{...Fonts.gray14RobotoMedium}}>{astroDetail.Tithi}</Text>
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
            <Text style={{...Fonts.gray14RobotoMedium}}>Yunja</Text>
            <Text style={{...Fonts.gray14RobotoMedium}}>{astroDetail.yunja}</Text>
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
            <Text style={{...Fonts.gray14RobotoMedium}}>Tatva</Text>
            <Text style={{...Fonts.gray14RobotoMedium}}>{astroDetail.tatva}</Text>
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
            <Text style={{...Fonts.gray14RobotoMedium}}>Name Alphabet</Text>
            <Text style={{...Fonts.gray14RobotoMedium}}>{astroDetail.name_alphabet}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: Sizes.fixPadding * 1.5,
              paddingVertical: Sizes.fixPadding,
              justifyContent: 'space-between',
            }}>
            <Text style={{...Fonts.gray14RobotoMedium}}>Paya</Text>
            <Text style={{...Fonts.gray14RobotoMedium}}>{astroDetail.paya}</Text>
          </View>
        </View>
      </View>
      )
    );
  }

  function birthDetails() {
    return (
      birthData && (
        <View style={{marginVertical: Sizes.fixPadding * 1.5}}>
          <Text
            style={{
              ...Fonts.black16RobotoMedium,
              textAlign: 'center',
              marginBottom: 10,
            }}>
            Name-{props.route.params?.Cname}
          </Text>
          <View
            style={{
              backgroundColor: Colors.whiteDark,
              width: SCREEN_WIDTH * 0.9,
              justifyContent: 'space-between',
              marginHorizontal: Sizes.fixPadding * 1.5,
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
              <Text style={{...Fonts.gray14RobotoMedium, width: '60%'}}>
                Birth Date
              </Text>
              <Text style={{...Fonts.gray14RobotoMedium, width: '40%'}}>
                {birthData.day}-{birthData.month}-{birthData.year}
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
              <Text style={{...Fonts.gray14RobotoMedium, width: '60%'}}>
                Birth Time
              </Text>
              <Text style={{...Fonts.gray14RobotoMedium, width: '40%'}}>
                {birthData.hour}-{birthData.minute}
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
              <Text style={{...Fonts.gray14RobotoMedium, width: '60%'}}>
                Birth Place
              </Text>
              <Text style={{...Fonts.gray14RobotoMedium, width: '40%'}}>
                {props.route.params.place}
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
              <Text style={{...Fonts.gray14RobotoMedium, width: '60%'}}>
                Latitude
              </Text>
              <Text style={{...Fonts.gray14RobotoMedium, width: '40%'}}>
                {birthData.latitude}
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
              <Text style={{...Fonts.gray14RobotoMedium, width: '60%'}}>
                Longitude
              </Text>
              <Text style={{...Fonts.gray14RobotoMedium, width: '40%'}}>
                {birthData.longitude}
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
              <Text style={{...Fonts.gray14RobotoMedium, width: '60%'}}>
                Timezone
              </Text>
              <Text style={{...Fonts.gray14RobotoMedium, width: '40%'}}>
                {birthData.timezone}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                paddingHorizontal: Sizes.fixPadding * 1.5,
                paddingVertical: Sizes.fixPadding,
                justifyContent: 'space-between',
              }}>
              <Text style={{...Fonts.gray14RobotoMedium, width: '60%'}}>
                Ayanamsha Degree
              </Text>
              <Text style={{...Fonts.gray14RobotoMedium, width: '40%'}}>
                {birthData && birthData.ayanamsha.toFixed(6)}
              </Text>
            </View>
          </View>
        </View>
      )
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
              width: SCREEN_WIDTH * 0.45,
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
          data={detailInfo}
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
          Birth Details
        </Text>
      </View>
    );
  }
};

export default BirthDetails;

const styles = StyleSheet.create({
  row: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
});