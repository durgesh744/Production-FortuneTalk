import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
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



const MatchBirthDetail = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [birthData1, setBirthData1] = useState('');
  const [birthData2, setBirthData2] = useState('');
  const [astroDetail1, setAstroDetail1] = useState(null);
  const [astroDetail12, setAstroDetail2] = useState(null);
  const [state, setState] = useState({
    selectedItem: 1,
  });


  console.log('ye hi edata jo back se aa rha hi',props.route.params.data3)
  console.log('ye hi edata', props.route.params.data4);


  useEffect(() => {
    console.log('djfoaidf');
    get_birthDetail1();
    get_birthDetail2();
    get_astroDetail1();
    get_astroDetail2();
    }, []);


  const get_birthDetail1 = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + api2_get_birth_details,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        user_id: props.route.params.data3,
      },
    })
      .then(res => {
        console.log('birthdetails12=====>', res.data);
        setBirthData1(res.data.birth_details);
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  };


  const get_birthDetail2 = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + api2_get_birth_details,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        user_id: props.route.params.data4,
      },
    })
      .then(res => {
        console.log('birthdetails13=====>', res.data);
        setBirthData2(res.data.birth_details);
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  };


  const get_astroDetail1= async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + api2_get_astro_detail,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        user_id: props.route.params.data3,
      },
    })
      .then(res => {
        console.log('astrodetails=====>', res.data);
        setAstroDetail1(res.data.astro_details);
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const get_astroDetail2 = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + api2_get_astro_detail,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        user_id: props.route.params.data4,
      },
    })
      .then(res => {
        console.log('astrodetails=====>', res.data);
        setAstroDetail2(res.data.astro_details);
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  };


  console.log('ye astro detail is male ', astroDetail1);
  console.log('ye astro detail is female ', astroDetail12);



  const updateState = data => {
    setState(prevState => {
      const newData = {...prevState, ...data};
      return newData;
    });
  };

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
      //   astroDetail && (
      <View style={{marginVertical: Sizes.fixPadding * 1.5, alignSelf: 'center'}}>
        <LinearGradient
          colors={[Colors.primaryDark, Colors.primaryLight]}
          style={{
            width: SCREEN_WIDTH * 0.9,
            justifyContent: 'space-between',
            paddingHorizontal: Sizes.fixPadding, 
            paddingVertical: Sizes.fixPadding*1.5,
            flexDirection: 'row',
            borderTopRightRadius: Sizes.fixPadding, 
            borderTopLeftRadius: Sizes.fixPadding,
          }}>
          <Text style={{...Fonts.white14RobotoMedium}}>Female</Text>
          <Text style={{...Fonts.white14RobotoMedium}}>Details</Text>
          <Text style={{...Fonts.white14RobotoMedium}}>Male</Text>
        </LinearGradient>
        <View
          style={{
            backgroundColor: Colors.whiteDark,
            width: SCREEN_WIDTH * 0.9,
            justifyContent: 'space-between',
            borderBottomLeftRadius: Sizes.fixPadding,
            borderBottomRightRadius: Sizes.fixPadding
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
            <Text style={{...Fonts.gray14RobotoMedium}}>
              {astroDetail1.Charan}
            </Text>
            <Text style={{...Fonts.gray14RobotoMedium}}>Charan</Text>
            <Text style={{...Fonts.gray14RobotoMedium}}>
              {astroDetail12.Charan}
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
            <Text style={{...Fonts.gray14RobotoMedium}}>
              {astroDetail1.Gan}
            </Text>
            <Text style={{...Fonts.gray14RobotoMedium}}>Gan</Text>

            <Text style={{...Fonts.gray14RobotoMedium}}>
              {astroDetail12.Gan}
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
            <Text style={{...Fonts.gray14RobotoMedium}}>
              {astroDetail1.Karan}
            </Text>
            <Text style={{...Fonts.gray14RobotoMedium}}>Karan</Text>

            <Text style={{...Fonts.gray14RobotoMedium}}>
              {astroDetail12.Karan}
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
            <Text style={{...Fonts.gray14RobotoMedium}}>
              {astroDetail1.Nadi}
            </Text>
            <Text style={{...Fonts.gray14RobotoMedium}}>Nadi</Text>

            <Text style={{...Fonts.gray14RobotoMedium}}>
              {astroDetail12.Nadi}
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
            <Text style={{...Fonts.gray14RobotoMedium}}>
              {astroDetail1.Naksahtra}
            </Text>
            <Text style={{...Fonts.gray14RobotoMedium}}>Naksahtra</Text>

            <Text style={{...Fonts.gray14RobotoMedium}}>
              {astroDetail12.Naksahtra}
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
            <Text style={{...Fonts.gray14RobotoMedium}}>
              {astroDetail1.NaksahtraLord}
            </Text>
            <Text style={{...Fonts.gray14RobotoMedium}}>NaksahtraLord</Text>

            <Text style={{...Fonts.gray14RobotoMedium}}>
              {astroDetail12.NaksahtraLord}
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
            <Text style={{...Fonts.gray14RobotoMedium}}>
              {astroDetail1.SignLord}
            </Text>
            <Text style={{...Fonts.gray14RobotoMedium}}>SignLord</Text>

            <Text style={{...Fonts.gray14RobotoMedium}}>
              {astroDetail12.SignLord}
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
            <Text style={{...Fonts.gray14RobotoMedium}}>
              {astroDetail1.Tithi}
            </Text>
            <Text style={{...Fonts.gray14RobotoMedium}}>Tithi</Text>

            <Text style={{...Fonts.gray14RobotoMedium}}>
              {astroDetail12.Tithi}
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
            <Text style={{...Fonts.gray14RobotoMedium}}>
              {astroDetail1.Varna}
            </Text>
            <Text style={{...Fonts.gray14RobotoMedium}}>Varna</Text>

            <Text style={{...Fonts.gray14RobotoMedium}}>
              {astroDetail12.Varna}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: Sizes.fixPadding * 1.5,
              paddingVertical: Sizes.fixPadding,
              justifyContent: 'space-between',
            }}>
            <Text style={{...Fonts.gray14RobotoMedium}}>
              {astroDetail1.Vashya}
            </Text>
            <Text style={{...Fonts.gray14RobotoMedium}}>Vashya</Text>

            <Text style={{...Fonts.gray14RobotoMedium}}>
              {astroDetail12.Vashya}
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
            <Text style={{...Fonts.gray14RobotoMedium}}>
              {astroDetail1.Yog}
            </Text>
            <Text style={{...Fonts.gray14RobotoMedium}}>Yog</Text>

            <Text style={{...Fonts.gray14RobotoMedium}}>
              {astroDetail12.Yog}
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
            <Text style={{...Fonts.gray14RobotoMedium}}>
              {astroDetail1.Yoni}
            </Text>
            <Text style={{...Fonts.gray14RobotoMedium}}>Yoni</Text>

            <Text style={{...Fonts.gray14RobotoMedium}}>
              {astroDetail12.Yoni}
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
            <Text style={{...Fonts.gray14RobotoMedium}}>
              {astroDetail1.ascendant}
            </Text>
            <Text style={{...Fonts.gray14RobotoMedium}}>Ascendant</Text>

            <Text style={{...Fonts.gray14RobotoMedium}}>
              {astroDetail12.ascendant}
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
            <Text style={{...Fonts.gray14RobotoMedium}}>
              {astroDetail1.ascendant_lord}
            </Text>
            <Text style={{...Fonts.gray14RobotoMedium}}>Ascendant Lord</Text>

            <Text style={{...Fonts.gray14RobotoMedium}}>
              {astroDetail12.ascendant_lord}
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
            <Text style={{...Fonts.gray14RobotoMedium}}>
              {astroDetail1.name_alphabet}
            </Text>
            <Text style={{...Fonts.gray14RobotoMedium}}>Name Alphabet</Text>

            <Text style={{...Fonts.gray14RobotoMedium}}>
              {astroDetail12.name_alphabet}
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
            <Text style={{...Fonts.gray14RobotoMedium}}>
              {astroDetail1.paya}
            </Text>
            <Text style={{...Fonts.gray14RobotoMedium}}>Paya</Text>

            <Text style={{...Fonts.gray14RobotoMedium}}>
              {astroDetail12.paya}
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
            <Text style={{...Fonts.gray14RobotoMedium}}>
              {astroDetail1.sign}
            </Text>
            <Text style={{...Fonts.gray14RobotoMedium}}>Sign</Text>

            <Text style={{...Fonts.gray14RobotoMedium}}>
              {astroDetail12.sign}
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
            <Text style={{...Fonts.gray14RobotoMedium}}>
              {astroDetail1.tatva}
            </Text>
            <Text style={{...Fonts.gray14RobotoMedium}}>Tatva</Text>

            <Text style={{...Fonts.gray14RobotoMedium}}>
              {astroDetail12.tatva}
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
            <Text style={{...Fonts.gray14RobotoMedium}}>
              {astroDetail1.yunja}
            </Text>
            <Text style={{...Fonts.gray14RobotoMedium}}>Yunja</Text>
            <Text style={{...Fonts.gray14RobotoMedium}}>
              {astroDetail12.yunja}
            </Text>
          </View>
         
        </View>
      </View>
      //   )
    );
  }

  function birthDetails() {
    return (
      //   birthData && (
      <View
        style={{marginVertical: Sizes.fixPadding * 1.5, alignSelf: 'center'}}>
        <LinearGradient
          colors={[Colors.primaryDark, Colors.primaryLight]}
          style={{
            width: SCREEN_WIDTH * 0.9,
            justifyContent: 'space-between',
            paddingHorizontal: Sizes.fixPadding, 
            paddingVertical: Sizes.fixPadding*1.5,
            flexDirection: 'row',
            borderTopRightRadius: Sizes.fixPadding, 
            borderTopLeftRadius: Sizes.fixPadding,
          }}>
          <Text style={{...Fonts.white14RobotoMedium}}>Details</Text>
          <Text style={{...Fonts.white14RobotoMedium}}>Female</Text>
          <Text style={{...Fonts.white14RobotoMedium}}>Male</Text>
        </LinearGradient>
        <View
          style={{
            backgroundColor: Colors.whiteDark,
            width: SCREEN_WIDTH * 0.9,
            justifyContent: 'space-between',
            borderBottomLeftRadius: Sizes.fixPadding, 
            borderBottomRightRadius: Sizes.fixPadding
          }}>
          <View
            style={{
              borderBottomColor: Colors.gray,
              borderBottomWidth: 1,
              flexDirection: 'row',
              paddingHorizontal: Sizes.fixPadding,
              paddingVertical: Sizes.fixPadding,
              justifyContent: 'space-between',
            }}>
            <Text style={{...Fonts.gray14RobotoMedium}}>
              Birth Date
            </Text>
            <Text style={{...Fonts.gray14RobotoMedium}}>
            {birthData2?.day}/{birthData2?.month}/{birthData2?.year}
            </Text>
            <Text style={{...Fonts.gray14RobotoMedium}}>
            {birthData1?.day}/{birthData1?.month}/{birthData1?.year}
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
            <Text style={{...Fonts.gray14RobotoMedium, }}>
              Birth Time
            </Text>
            <Text style={{...Fonts.gray14RobotoMedium}}>
            {birthData2?.hour}:{birthData2?.minute}:{birthData2?.seconds}
            </Text>
            <Text style={{...Fonts.gray14RobotoMedium}}>
            {birthData1?.hour}:{birthData1?.minute}:{birthData1?.seconds}
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
            <Text style={{...Fonts.gray14RobotoMedium, }}>
              Birth Place
            </Text>
            <Text style={{...Fonts.gray14RobotoMedium}}>
            Delhi
            </Text>
            <Text style={{...Fonts.gray14RobotoMedium}}>
            Delhi
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
            <Text style={{...Fonts.gray14RobotoMedium, }}>
              Latitude
            </Text>
            <Text style={{...Fonts.gray14RobotoMedium, }}>
            {birthData2?.latitude}
            </Text>
            <Text style={{...Fonts.gray14RobotoMedium, }}>
            {birthData1?.latitude}
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
            <Text style={{...Fonts.gray14RobotoMedium, }}>
              Longitude
            </Text>
            <Text style={{...Fonts.gray14RobotoMedium, }}>
            {birthData2?.longitude}
            </Text>
            <Text style={{...Fonts.gray14RobotoMedium, }}>
            {birthData1?.longitude}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: Sizes.fixPadding * 1.5,
              paddingVertical: Sizes.fixPadding,
              justifyContent: 'space-between',
            }}>
            <Text style={{...Fonts.gray14RobotoMedium,}}>
              Timezone
            </Text>
            <Text style={{...Fonts.gray14RobotoMedium, }}>
             {birthData2?.timezone}
            </Text>
            <Text style={{...Fonts.gray14RobotoMedium, }}>
             {birthData1?.timezone}
            </Text>
          </View>
        </View>
      </View>
      //   )
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

export default MatchBirthDetail;

const styles = StyleSheet.create({
  row: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
