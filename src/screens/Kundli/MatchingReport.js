import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Colors, Fonts, Sizes} from '../../assets/style';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MyStatusBar from '../../components/MyStatusBar';
// import SimpleGradientProgressbarView from 'react-native-simple-gradient-progressbar-view';
import {SCREEN_WIDTH} from '../../config/Screen';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import { api_url, match_manglik_report } from '../../config/constants';
import { Item } from 'react-native-paper/lib/typescript/components/Drawer/Drawer';


const MatchingReport = ({navigation, route}) => {
  const [matchingData] = useState(route.params?.data);
  const [maleKundliData] = useState(route.params?.maleKundliData)
  const [femaleKundliData] = useState(route.params?.femaleKundliData)
  const [data, setData] = useState('');

  console.log('YE KUNDLI ID HI male BAHI==---',maleKundliData?.kundali_id);
  console.log('YE KUNDLI ID female ki HI BAHI==---',femaleKundliData?.kundali_id)
  


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
        m_kundli_id : maleKundliData?.kundali_id,
        f_kundli_id : femaleKundliData?.kundali_id,
      },
    })
      .then(res => {
        console.log('magli====>>>', res.data);
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
      {header()}
      <View style={{flex: 1}}>
        <FlatList
          ListHeaderComponent={
            <>
              {scoreInfo()}
              {CompatibilityInfo()}
              {loveInfo()}
              {mentalInfo()}
              {dominanceInfo()}
              {temperamentInfo()}
              {healthInfo()}
              {destinyInfo()}
              {physicalInfo()}
              {/* {manglikReportInfo()} */}
              {conclusionInfo()}
            </>
          }
        />
      </View>
    </View>
  );

  

          

  function conclusionInfo() {
    return (
      <View style={{margin: Sizes.fixPadding * 1.5}}>
        <Text style={{...Fonts.primaryLight18RobotoMedium, fontSize: 22}}>
          Conclusion
        </Text>
        <Text style={{...Fonts.gray16RobotoMedium}}>
          {matchingData?.conclusion?.report}
        </Text>
      </View>
    );
  }

  function manglikReportInfo() {
    return (
      <View
        style={{
          marginTop: Sizes.fixPadding,
          borderBottomWidth: 1,
          borderBottomColor: Colors.grayLight,
        }}>
        <Text
          style={{...Fonts.primaryLight18RobotoMedium, textAlign: 'center'}}>
          Manglik Report
        </Text>
        <View
          style={[
            styles.row,
            {
              justifyContent: 'space-evenly',
              alignItems: 'flex-start',
              marginVertical: Sizes.fixPadding * 2,
            },
          ]}>
          <TouchableOpacity
          onPress={() => navigation.navigate('matchCategory',{data1:maleKundliData?.kundali_id, data2:femaleKundliData?.kundali_id}) }
            style={{
              width: SCREEN_WIDTH * 0.35,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: Colors.grayLight,
              padding: Sizes.fixPadding,
              borderRadius: Sizes.fixPadding,
              elevation: 8,
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.2,
              shadowColor: Colors.blackLight,
            }}>
            <Image
              source={require('../../assets/images/icons/male_kundli.png')}
              style={{
                width: SCREEN_WIDTH * 0.18,
                height: SCREEN_WIDTH * 0.18,
                borderRadius: 1000,
                resizeMode: 'contain',
                borderWidth: 1,
                borderColor: Colors.primaryLight,
              }}
            />
            <Text style={{...Fonts.black18RobotoMedium, textAlign: 'center'}}>{maleKundliData?.customer_name}</Text>
            <Text style={{...Fonts.gray16RobotoRegular}}>{data?.match_manglik_report?.male.is_present == true ? 'Manglik' : 'Non Manglik'}</Text>
            <LinearGradient
              colors={[Colors.primaryLight, Colors.primaryDark]}
              style={{
                paddingHorizontal: Sizes.fixPadding,
                paddingVertical: Sizes.fixPadding * 0.3,
                marginVertical: Sizes.fixPadding * 0.4,
                borderRadius: 1000,
              }}>
              <Text style={{...Fonts.white14RobotoRegular}}>View Kundli</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
           onPress={() => navigation.navigate('matchCategory',{data1:maleKundliData?.kundali_id, data2:femaleKundliData?.kundali_id}) }

            style={{
              width: SCREEN_WIDTH * 0.35,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: Colors.grayLight,
              padding: Sizes.fixPadding,
              borderRadius: Sizes.fixPadding,
              elevation: 8,
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.2,
              shadowColor: Colors.blackLight,
            }}>
            <Image
              source={require('../../assets/images/icons/female_kundli.png')}
              style={{
                width: SCREEN_WIDTH * 0.18,
                height: SCREEN_WIDTH * 0.18,
                borderRadius: 1000,
                resizeMode: 'contain',
                borderWidth: 1,
                borderColor: Colors.primaryLight,
              }}
            />
            <Text style={{...Fonts.black18RobotoMedium, textAlign: 'center'}}>{femaleKundliData?.customer_name}</Text>
            <Text style={{...Fonts.gray16RobotoRegular}}>{data?.match_manglik_report?.female.is_present == true ? 'Manglik' : 'Non Manglik'}</Text>
            <LinearGradient
              colors={[Colors.primaryLight, Colors.primaryDark]}
              style={{
                paddingHorizontal: Sizes.fixPadding,
                paddingVertical: Sizes.fixPadding * 0.3,
                marginVertical: Sizes.fixPadding * 0.4,
                borderRadius: 1000,
              }}>
              <Text style={{...Fonts.white14RobotoRegular}}>View Kundli</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function physicalInfo() {
    return (
      <View
        style={{
          padding: Sizes.fixPadding * 1.5,
          borderBottomWidth: 1,
          borderBottomColor: Colors.grayLight,
        }}>
        <View style={[styles.row, {justifyContent: 'space-between'}]}>
          <Text style={{...Fonts.black16RobotoMedium}}>
            Physical compatibility (Yoni)
          </Text>
          <Text
            style={{
              ...Fonts.primaryDark16RobotoMedium,
              color: Colors.primaryLight,
            }}>
                {matchingData?.yoni?.received_points}/
            {matchingData?.yoni?.total_points}
          </Text>
        </View>
        <Text
          style={{
            ...Fonts.gray14RobotoRegular,
            marginTop: Sizes.fixPadding * 0.5,
          }}>
        {matchingData?.yoni?.description}
        </Text>
      </View>
    );
  }

  function destinyInfo() {
    return (
      <View
        style={{
          padding: Sizes.fixPadding * 1.5,
          borderBottomWidth: 1,
          borderBottomColor: Colors.grayLight,
        }}>
        <View style={[styles.row, {justifyContent: 'space-between'}]}>
          <Text style={{...Fonts.black16RobotoMedium}}>Destiny (Tara)</Text>
          <Text
            style={{
              ...Fonts.primaryDark16RobotoMedium,
              color: Colors.primaryLight,
            }}>
            {matchingData?.tara?.received_points}/
            {matchingData?.tara?.total_points}
          </Text>
        </View>
        <Text
          style={{
            ...Fonts.gray14RobotoRegular,
            marginTop: Sizes.fixPadding * 0.5,
          }}>
          {matchingData?.tara?.description}
        </Text>
      </View>
    );
  }

  function healthInfo() {
    return (
      <View
        style={{
          padding: Sizes.fixPadding * 1.5,
          borderBottomWidth: 1,
          borderBottomColor: Colors.grayLight,
        }}>
        <View style={[styles.row, {justifyContent: 'space-between'}]}>
          <Text style={{...Fonts.black16RobotoMedium}}>Health (Nadi)</Text>
          <Text
            style={{
              ...Fonts.primaryDark16RobotoMedium,
              color: Colors.primaryLight,
            }}>
            {matchingData?.nadi?.received_points}/
            {matchingData?.nadi?.total_points}
          </Text>
        </View>
        <Text
          style={{
            ...Fonts.gray14RobotoRegular,
            marginTop: Sizes.fixPadding * 0.5,
          }}>
          {matchingData?.nadi?.description}
        </Text>
      </View>
    );
  }

  function temperamentInfo() {
    return (
      <View
        style={{
          padding: Sizes.fixPadding * 1.5,
          borderBottomWidth: 1,
          borderBottomColor: Colors.grayLight,
        }}>
        <View style={[styles.row, {justifyContent: 'space-between'}]}>
          <Text style={{...Fonts.black16RobotoMedium}}>Temperament (Gana)</Text>
          <Text
            style={{
              ...Fonts.primaryDark16RobotoMedium,
              color: Colors.primaryLight,
            }}>
            {matchingData?.gan?.received_points}/
            {matchingData?.gan?.total_points}
          </Text>
        </View>
        <Text
          style={{
            ...Fonts.gray14RobotoRegular,
            marginTop: Sizes.fixPadding * 0.5,
          }}>
          {matchingData?.gan?.description}
        </Text>
      </View>
    );
  }

  function dominanceInfo() {
    return (
      <View
        style={{
          padding: Sizes.fixPadding * 1.5,
          borderBottomWidth: 1,
          borderBottomColor: Colors.grayLight,
        }}>
        <View style={[styles.row, {justifyContent: 'space-between'}]}>
          <Text style={{...Fonts.black16RobotoMedium}}>Dominance (Vashya)</Text>
          <Text
            style={{
              ...Fonts.primaryDark16RobotoMedium,
              color: Colors.primaryLight,
            }}>
            {matchingData?.vashya?.received_points}/
            {matchingData?.vashya?.total_points}
          </Text>
        </View>
        <Text
          style={{
            ...Fonts.gray14RobotoRegular,
            marginTop: Sizes.fixPadding * 0.5,
          }}>
          {matchingData?.vashya?.description}
        </Text>
      </View>
    );
  }

  function mentalInfo() {
    return (
      <View
        style={{
          padding: Sizes.fixPadding * 1.5,
          borderBottomWidth: 1,
          borderBottomColor: Colors.grayLight,
        }}>
        <View style={[styles.row, {justifyContent: 'space-between'}]}>
          <Text style={{...Fonts.black16RobotoMedium}}>
            Mental Compatibility (Maitri)
          </Text>
          <Text
            style={{
              ...Fonts.primaryDark16RobotoMedium,
              color: Colors.primaryLight,
            }}>
            {matchingData?.maitri?.received_points}/
            {matchingData?.maitri?.total_points}
          </Text>
        </View>
        <Text
          style={{
            ...Fonts.gray14RobotoRegular,
            marginTop: Sizes.fixPadding * 0.5,
          }}>
          {matchingData?.maitri?.description}
        </Text>
      </View>
    );
  }

  function loveInfo() {
    return (
      <View
        style={{
          padding: Sizes.fixPadding * 1.5,
          borderBottomWidth: 1,
          borderBottomColor: Colors.grayLight,
        }}>
        <View style={[styles.row, {justifyContent: 'space-between'}]}>
          <Text style={{...Fonts.black16RobotoMedium}}>Love (Bhakut)</Text>
          <Text
            style={{
              ...Fonts.primaryDark16RobotoMedium,
              color: Colors.primaryLight,
            }}>
            {matchingData?.bhakut?.received_points}/{' '}
            {matchingData?.bhakut?.total_points}
          </Text>
        </View>
        <Text
          style={{
            ...Fonts.gray14RobotoRegular,
            marginTop: Sizes.fixPadding * 0.5,
          }}>
          {matchingData?.bhakut?.description}
        </Text>
      </View>
    );
  }

  function CompatibilityInfo() {
    return (
      <View
        style={{
          padding: Sizes.fixPadding * 1.5,
          borderBottomWidth: 1,
          borderBottomColor: Colors.grayLight,
        }}>
        <View style={[styles.row, {justifyContent: 'space-between'}]}>
          <Text style={{...Fonts.black16RobotoMedium}}>
            Compatibility (Varna)
          </Text>
          <Text
            style={{
              ...Fonts.primaryDark16RobotoMedium,
              color: Colors.primaryLight,
            }}>
            {matchingData?.varna?.received_points}/
            {matchingData?.varna?.total_points}
          </Text>
        </View>
        <Text
          style={{
            ...Fonts.gray14RobotoRegular,
            marginTop: Sizes.fixPadding * 0.5,
          }}>
          {matchingData?.varna?.description}
        </Text>
      </View>
    );
  }

  function scoreInfo() {
    const get_formated_score = ()=>{
      const point = parseFloat(matchingData?.total?.received_points)
      const data = point/36
      return data
    }
    return (
      <View
        style={{
          margin: Sizes.fixPadding,
          backgroundColor: Colors.whiteDark,
          paddingVertical: Sizes.fixPadding * 2,
          borderRadius: Sizes.fixPadding,
        }}>
        <Text
          style={{
            ...Fonts.gray18RobotoMedium,
            color: Colors.blackLight,
            textAlign: 'center',
          }}>
          Compatibility Score
        </Text>
        <Text
          style={{
            ...Fonts.black22RobotoMedium,
            color: Colors.greenLight,
            textAlign: 'center',
            marginVertical: Sizes.fixPadding * 2,
            fontSize: 34,
          }}>
          {matchingData?.total?.received_points}/<Text style={{fontSize: 18}}>36</Text>
        </Text>
        <View
          style={{
            width: '90%',
            backgroundColor: Colors.white,
            alignSelf: 'center',
            borderRadius: 1000,
            marginBottom: Sizes.fixPadding,
          }}>
          {/* <SimpleGradientProgressbarView
            style={styles.box}
            fromColor="#FF7501"
            toColor="#64E102"
            progress={get_formated_score()}
            maskedCorners={[1, 1, 1, 1]}
            cornerRadius={1000}
          /> */}
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
            alignSelf: 'flex-start',
            // flex: 0.2,
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
            // flex: 0.6,
          }}>
          Kundli Matching
        </Text>
        <TouchableOpacity>
          <AntDesign name="sharealt" color={Colors.primaryLight} size={22} />
        </TouchableOpacity>
      </View>
    );
  }
};

export default MatchingReport;
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
  box: {
    width: '98%',
    height: 35,
    margin: 3,
    borderRadius: 1000,
    // alignSelf: 'center'
  },
});
