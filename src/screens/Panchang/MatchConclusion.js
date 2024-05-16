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
  import { api_url, get_Astkootable } from '../../config/constants';
  import axios from 'axios';



const MatchConclusion = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState('');





  useEffect(() => {
    get_MatchConclusion();  
  }, []);


  const get_MatchConclusion = async () => {
    await axios({
      method: 'post',
      url: api_url + get_Astkootable,
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
  console.log('YE WALA DATA SHoW KARNA HI', data?.match_ashtakoot_points?.total.received_points	);


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
              {data?.match_ashtakoot_points?.conclusion.report	}
            </Text>
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
                 {data?.match_ashtakoot_points?.yoni.received_points}/
                {data?.match_ashtakoot_points?.yoni.total_points}
              </Text>
            </View>
            <Text
              style={{
                ...Fonts.gray14RobotoRegular,
                marginTop: Sizes.fixPadding * 0.5,
              }}>
            {data?.match_ashtakoot_points?.yoni.description}
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
              {data?.match_ashtakoot_points?.	tara.received_points}/
                {data?.match_ashtakoot_points?.	tara.total_points}
              </Text>
            </View>
            <Text
              style={{
                ...Fonts.gray14RobotoRegular,
                marginTop: Sizes.fixPadding * 0.5,
              }}>
                {data?.match_ashtakoot_points?.	tara.description}
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
                {data?.match_ashtakoot_points?.nadi.received_points}/
                {data?.match_ashtakoot_points?.nadi.total_points}
              </Text>
            </View>
            <Text
              style={{
                ...Fonts.gray14RobotoRegular,
                marginTop: Sizes.fixPadding * 0.5,
              }}>
                {data?.match_ashtakoot_points?.nadi.description}
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
                {data?.match_ashtakoot_points?.gan.received_points}/
                {data?.match_ashtakoot_points?.gan.total_points}
              </Text>
            </View>
            <Text
              style={{
                ...Fonts.gray14RobotoRegular,
                marginTop: Sizes.fixPadding * 0.5,
              }}>
              {data?.match_ashtakoot_points?.gan.description}
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
                {data?.match_ashtakoot_points?.maitri.received_points}/
                {data?.match_ashtakoot_points?.maitri.total_points}
              </Text>
            </View>
            <Text
              style={{
                ...Fonts.gray14RobotoRegular,
                marginTop: Sizes.fixPadding * 0.5,
              }}>
                {data?.match_ashtakoot_points?.maitri.description}
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
                {data?.match_ashtakoot_points?.maitri.received_points}/
                {data?.match_ashtakoot_points?.maitri.total_points}
              </Text>
            </View>
            <Text
              style={{
                ...Fonts.gray14RobotoRegular,
                marginTop: Sizes.fixPadding * 0.5,
              }}>
              {data?.match_ashtakoot_points?.maitri.description}
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
               {data?.match_ashtakoot_points?.bhakut.received_points}/
                {data?.match_ashtakoot_points?.bhakut.total_points}
              </Text>
            </View>
            <Text
              style={{
                ...Fonts.gray14RobotoRegular,
                marginTop: Sizes.fixPadding * 0.5,
              }}>
              {data?.match_ashtakoot_points?.bhakut.description}
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
                {data?.match_ashtakoot_points?.varna.received_points}/
                {data?.match_ashtakoot_points?.varna.total_points}
                
              </Text>
            </View>
            <Text
              style={{
                ...Fonts.gray14RobotoRegular,
                marginTop: Sizes.fixPadding * 0.5,
              }}>
              
              {data?.match_ashtakoot_points?.varna.description}
            </Text>
          </View>
        );
    }

    function scoreInfo() {
        const get_formated_score = ()=>{
        //   const point = parseFloat(matchingData?.total?.received_points)
        //   const data = point/36
        //   return data
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
              {/* {matchingData?.total?.received_points}/ */}
              <Text style={{fontSize: 18}}>
                {data?.match_ashtakoot_points?.total.received_points}/{data?.match_ashtakoot_points?.total.total_points}
              </Text>
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
              onPress={() => props.navigation.goBack()}
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
              Match Conclusion
            </Text>
          </View>
        );
      }
}

export default MatchConclusion

const styles = StyleSheet.create({
    row: {
        flex: 0,
        flexDirection: 'row',
        alignItems: 'center',
    },
})