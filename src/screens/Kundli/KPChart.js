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
  api2_get_kp_chart,
  api2_get_house_report,
  api2_get_house_cusps,
  api2_get_house_ruling,
} from '../../config/constants';
import axios from 'axios';
import {Dropdown} from 'react-native-element-dropdown';
import ShowSvg from '../../components/ShowSvg';
import KPShowSvg from '../../components/KPShowSvg';

const planet = [
  {
    id: 1,
    data1: 'MO',
    data2: 'jupiter',
  },
  {
    id: 2,
    data1: 'MO',
    data2: 'jupiter',
  },
];

const cuspsdata = [
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

const data = [
  {
    id: 1,
    house_name: 'Sun',
    name: 'House Report for Sun',
  },
  {
    id: 2,
    house_name: 'Moon',
    name: 'House Report for Moon',
  },
  {
    id: 3,
    house_name: 'Mars',
    name: 'House Report for Mars',
  },
  {
    id: 4,
    house_name: 'Mercury',
    name: 'House Report for Mercury',
  },
  {
    id: 5,
    house_name: 'Jupiter',
    name: 'House Report for Jupiter',
  },
  {
    id: 6,
    house_name: 'Saturn',
    name: 'House Report for Saturn',
  },
  {
    id: 7,
    house_name: 'Venus',
    name: 'House Report for Venus',
  },
  {
    id: 8,
    house_name: 'Rahu',
    name: 'House Report for Rahu',
  },
  {
    id: 9,
    house_name: 'Ketu',
    name: 'House Report for Ketu',
  },
];

const KPChart = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [filterData, setFilterData] = useState([]);
  const [isFocus, setIsFocus] = useState(false);
  const [value, setValue] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [houseReport, setHouseReport] = useState(null);
  const [cusps, setCusps] = useState(null);
  const [rulingPlanet, setRulingPlanet] = useState(null);
  const [name, setName] = useState('Sun');

  useEffect(() => {
    get_kp_chart();
    get_house_report('Sun');
    get_house_cusps();
    get_house_ruling();
  }, []);

  const get_kp_chart = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + api2_get_kp_chart,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        kundli_id: props.route.params.id,
        // chartid: 'chalit',
      },
    })
      .then(res => {
        console.log('kp=====>', res.data.svg_code);
        setChartData(res.data.svg_code);
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  };

  console.log('asfasdf',props.route.params.id);

  const get_house_report = async (housename) => {
    console.log(housename);
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + api2_get_house_report,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        kundli_id: props.route.params.id,
        planet_name: housename,
      },
    })
      .then(res => {
        console.log('hr=====>', res.data);
        setHouseReport(res.data.svg_code);
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const get_house_cusps = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + api2_get_house_cusps,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        kundli_id: props.route.params.id,
      },
    })
      .then(res => {
        console.log('hc=====>', res.data);
        setCusps(res.data.svg_code);
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const get_house_ruling = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + api2_get_house_ruling,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        kundli_id: props.route.params.id,
      },
    })
      .then(res => {
        console.log('hr2=====>', res.data);
        setRulingPlanet(res.data.svg_code);
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false)
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
              {chartData && bhavChart()}
              {rulingPlanets()}
              {cusp()}
              {planetHouse()}
            </>
          }
        />
      </View>
    </View>
  );

  function planetHouse() {
    return (
      <View
        style={{
          width: SCREEN_WIDTH * 0.9,
          marginHorizontal: Sizes.fixPadding * 2,
        }}>
        <Text style={{...Fonts.black16RobotoMedium}}>Planet House Report</Text>
        <View style={styles.container}>
          <Dropdown
            style={[styles.dropdown]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            itemTextStyle={{
              width: '100%',
              // ...Fonts.primaryLight14RobotoRegular,
              ...Fonts.black12RobotoRegular,
            }}
            containerStyle={{
              padding: Sizes.fixPadding,
              marginTop: Sizes.fixPadding,
              borderRadius: Sizes.fixPadding,
            }}
            itemContainerStyle={{
              elevation: 10,
              backgroundColor: Colors.white,
              borderRadius: Sizes.fixPadding,
              justifyContent: 'center',
              alignItems: 'center',
              margin: Sizes.fixPadding,
            }}
            onChange={item=>{
              setValue(item.id)
              setName(item?.name);
              get_house_report(item?.house_name)
            }}
            iconStyle={styles.iconStyle}
            data={data}
            maxHeight={400}
            labelField="name"
            valueField="subtext"
            placeholder={isFocus ? 'Select Chart' : name}
            value={value}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
          />
        </View>
        <View style={{marginVertical: Sizes.fixPadding * 2}}>
          <Text style={{...Fonts.primaryLight15RobotoMedium}}>
            {houseReport?.planet} House Report
          </Text>
          <Text
            style={{...Fonts.gray14RobotoMedium, marginTop: Sizes.fixPadding}}>
            {houseReport?.house_report}
          </Text>
        </View>
      </View>
    );
  }

  function cusp() {
    const renderItem = ({item, index}) => {
      return (
        <View
          key={index}
          style={{
            flexDirection: 'row',
          }}>
          <View
            style={{
              width: '60%',
              flexDirection: 'row',
              borderTopColor: Colors.grayLight,
              borderTopWidth: 1,
            }}>
            <Text style={[styles.box2, {width: '25%'}]}>{item.house_id}</Text>
            <Text style={[styles.box2, {width: '30%'}]}>
              {/* {item.cusp_full_degree.toFixed(2)} */} 
              {`${Math.floor(((Math.floor(item.cusp_full_degree))))}° ${Math.floor((item.cusp_full_degree % 1) * 60)}' ${Math.floor(((item.cusp_full_degree % 1) * 60) % 1 * 60)}"`}
              </Text>
            <Text style={[styles.box2, {width: '40%'}]}>{item.sign}</Text>
          </View>
          <View
            style={{
              width: '40%',
              flexDirection: 'row',
              borderTopColor: Colors.grayLight,
              borderTopWidth: 1,
            }}>
            <Text style={styles.box2}>{item.sign_lord.slice(0, 2)}</Text>
            <Text style={styles.box2}>{item.nakshatra_lord.slice(0, 2)}</Text>
            <Text
              style={{
                ...Fonts.gray14RobotoMedium,
                width: '33%',
                textAlign: 'center',
                textAlignVertical: 'center',
                padding: Sizes.fixPadding,
              }}>
              {item.sub_lord.slice(0, 2)}
            </Text>
          </View>
        </View>
      );
    };
    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 2,
          marginVertical: Sizes.fixPadding,
        }}>
        <Text style={{...Fonts.black16RobotoMedium}}>Cuspe</Text>
        <View
          style={{
            borderRadius: Sizes.fixPadding * 2,
            borderWidth: 1,
            borderColor: Colors.gray,
            marginTop: Sizes.fixPadding,
          }}>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <View
              style={{
                width: '60%',
                flexDirection: 'row',
                // borderBottomColor: Colors.grayLight,
                // borderBottomWidth: 1,
              }}>
              <Text style={[styles.box1, {width: '25%'}]}>Cuspe</Text>
              <Text style={[styles.box1, {width: '30%'}]}>Degree</Text>
              <Text style={[styles.box1, {width: '40%'}]}>Sign</Text>
            </View>
            <View
              style={{
                width: '40%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                // borderBottomColor: Colors.grayLight,
                // borderBottomWidth: 1,
              }}>
              <Text style={styles.box1}>SL</Text>
              <Text style={styles.box1}>NL</Text>
              <Text
                style={{
                  ...Fonts.primaryLight14RobotoMedium,
                  width: '33%',
                  textAlign: 'center',
                  textAlignVertical: 'center',
                }}>
                SL
              </Text>
            </View>
          </View>
          <FlatList
            data={cusps}
            renderItem={renderItem}
            key={item => item.id}
          />
        </View>
      </View>
    );
  }

  function rulingPlanets() {
    const renderItem = ({item, index}) => {
      return (
        <View
          key={index}
          style={{
            // borderBottomColor: Colors.gray,
            // borderBottomWidth: 1,
            padding: Sizes.fixPadding,
            borderRightColor: Colors.grayMedium,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text style={[styles.text, {width: '23%'}]}>{item.planet_name}</Text>
          <Text style={[styles.text, {width: '33%'}]}>
            {item.sign.slice(0, 3)} {`${Math.floor(((Math.floor(item.norm_degree))))}° ${Math.floor((item.norm_degree % 1) * 60)}' ${Math.floor(((item.norm_degree % 1) * 60) % 1 * 60)}"`}
          </Text>
          <Text style={[styles.text, {width: '13%'}]}>{item.sign_lord.slice(0, 2)}</Text>
          <Text style={[styles.text, {width: '13%'}]}>{item.nakshatra_lord.slice(0, 2)}</Text>
          <Text style={[styles.text, {width: '13%'}]}>{item.sub_lord.slice(0, 2)}</Text>
          <Text style={[styles.text, {width: '12%'}]}>{item.sub_sub_lord.slice(0, 2)}</Text>
        </View>
      );
    };
    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 2,
          marginVertical: Sizes.fixPadding,
        }}>
        <Text style={{...Fonts.black16RobotoMedium}}>Ruling Planets</Text>
        <View
          style={{
            flexDirection: 'row',
            marginTop: Sizes.fixPadding,
            borderRadius: Sizes.fixPadding * 2,
            borderWidth: 1,
            borderColor: Colors.gray,
          }}>
          <View style={{flex: 1}}>
            <View
              style={{
                flexDirection: 'row',
                borderRightColor: Colors.grayMedium,
                justifyContent: 'space-between',
                borderBottomColor: Colors.gray,
                borderBottomWidth: 1,
              }}>
              <Text style={[styles.box, {width: '25%'}]}>Planet</Text>
              <Text style={[styles.box, {width: '25%'}]}>Degree</Text>
              <Text style={[styles.box, {width: '12%'}]}>SL</Text>
              <Text style={[styles.box, {width: '12%'}]}>NL</Text>
              <Text style={[styles.box, {width: '12%'}]}>SB</Text>
              <Text style={[styles.box, {width: '12%'}]}>SS</Text>
            </View>
            <FlatList
              data={rulingPlanet}
              renderItem={renderItem}
              key={item => item.id}
            />
          </View>
        </View>
      </View>
    );
  }

  function bhavChart() {
    return (
      <View
        style={{
          paddingHorizontal: Sizes.fixPadding * 0.5,
          marginVertical: Sizes.fixPadding,
        }}>
        <Text
          style={{
            ...Fonts.black16RobotoMedium,
            marginHorizontal: Sizes.fixPadding,
          }}>
          Bhav Chalit Chart
        </Text>
        <KPShowSvg data={chartData} />
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
          KP
        </Text>
      </View>
    );
  }
};

export default KPChart;

const styles = StyleSheet.create({
  row: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    ...Fonts.gray12RobotoMedium,
  },
  box: {
    ...Fonts.primaryLight14RobotoRegular,
    padding: Sizes.fixPadding,
  },
  box1: {
    ...Fonts.primaryLight14RobotoMedium,
    width: '33%',
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRightWidth: 1,
    borderRightColor: Colors.grayLight,
  },
  box2: {
    ...Fonts.gray14RobotoMedium,
    width: '33%',
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRightWidth: 1,
    borderRightColor: Colors.grayLight,
  },
  container: {
    borderRadius: Sizes.fixPadding * 2,
    justifyContent: 'center',
    marginTop: Sizes.fixPadding,
  },
  dropdown: {
    height: 50,
    backgroundColor: Colors.grayLight,
    elevation: 10,
    borderRadius: Sizes.fixPadding,
    width: '100%',
    paddingHorizontal: Sizes.fixPadding * 1.5,
  },
});
