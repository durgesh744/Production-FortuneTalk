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
    get_fav,
  } from '../../config/constants'
  import axios from 'axios';
  import {Dropdown} from 'react-native-element-dropdown';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { useRoute } from '@react-navigation/native';

const Favourable = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [data , setData] = useState(false);

    useEffect(() => { 
      get_favrouable();
      },[]);

      console.log('This is kundliid',props?.route?.params?.id);

    const get_favrouable = async () => {
      setIsLoading(true);
      await axios({
        method: 'post',
        url: api_url + get_fav,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: {
          kundli_id:props?.route?.params?.id
        },
      })
        .then(res => {
          console.log('=====>', res.data);
          setData(res.data);
          setIsLoading(false);
        })
        .catch(err => {
          console.log(err);
          setIsLoading(false);
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
          <View style={{width: SCREEN_WIDTH*0.9, marginHorizontal: Sizes.fixPadding*2}}>
            <FlatList ListHeaderComponent={
            <>
            {favourableInfo()}
            {favourableData()}
            </>
        } />
          </View>
        </View>
    );

    function favourableData() {
        const renderItem = ({renderItem}) => {
        return (
                <View style={{borderRadius: Sizes.fixPadding, flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Sizes.fixPadding, paddingHorizontal: Sizes.fixPadding*2, marginBottom: Sizes.fixPadding,  backgroundColor: Colors.orange_light}}>
                    <Text style={{...Fonts.gray14RobotoMedium}}>Favourable Day -</Text>
                    <Text style={{...Fonts.gray14RobotoMedium}}>Sunday, Monday</Text>
                </View>
        )
        }
        return (
            <View style={{marginVertical: Sizes.fixPadding}}>
                <View>
                {/* <FlatList 
                //   data={}
                  renderItem={renderItem}
                  key={item => item.id}
                /> */}
                </View>
                <View style={{marginVertical: Sizes.fixPadding}}>
                  <TouchableOpacity style={{flexDirection: 'row', marginBottom: Sizes.fixPadding, backgroundColor: Colors.primaryLight, borderRadius: Sizes.fixPadding*2.5, alignItems: 'center', justifyContent: 'center', padding: Sizes.fixPadding*0.5}}>
                    <View style={{ marginRight: Sizes.fixPadding, height: 30}}>
                        <Image source={require('../../../src/assets/images/indian.png')} style={{width: 40, height: 30, resizeMode: 'cover'}} />
                    </View>
                    <Text style={{...Fonts.white16RobotoMedium}}>Favourable Mantra</Text>
                  </TouchableOpacity>
                    <Text style={{...Fonts.gray14RobotoMedium, textAlign: 'center'}}>{data?.numero_table?.fav_mantra}</Text>
                </View>
            </View>
        )
    }


    function favourableInfo() {
        // const renderItem = ({renderItem}) => {
        return (
          <View>
          <View>
            <View style={{marginVertical: Sizes.fixPadding, paddingRight: Sizes.fixPadding, flexDirection:'row', justifyContent:'space-between'}}>
                <View style={{ alignItems: 'center', justifyContent: 'center', padding: Sizes.fixPadding,  borderColor: Colors.primaryDark, borderWidth: 2, borderRadius: Sizes.fixPadding, width:'45%'}}>
                    <Text style={{...Fonts.primaryLight14RobotoMedium}}>Name No.-{data?.numero_table?.name_number}</Text>
                </View>
                <View style={{ alignItems: 'center', justifyContent: 'center', padding: Sizes.fixPadding,  borderColor: Colors.primaryDark, borderWidth: 2, borderRadius: Sizes.fixPadding,width:'45%'}}>
                    <Text style={{...Fonts.primaryLight14RobotoMedium}}>Time-NA</Text>
                </View>
            </View>
            <View style={{marginVertical: Sizes.fixPadding, paddingRight: Sizes.fixPadding, flexDirection:'row', justifyContent:'space-between'}}>
                <View style={{ alignItems: 'center', justifyContent: 'center', padding: Sizes.fixPadding,  borderColor: Colors.primaryDark, borderWidth: 2, borderRadius: Sizes.fixPadding,width:'45%'}}>
                    <Text style={{...Fonts.primaryLight14RobotoMedium}}>Friendly NO.-{data?.numero_table?.friendly_num}</Text>
                </View>
                <View style={{ alignItems: 'center', justifyContent: 'center', padding: Sizes.fixPadding,  borderColor: Colors.primaryDark, borderWidth: 2, borderRadius: Sizes.fixPadding,width:'45%'}}>
                    <Text style={{...Fonts.primaryLight14RobotoMedium}}>Destiny NO.-{data?.numero_table?.destiny_number}</Text>
                </View>
            </View>
          </View>
                <View style={{borderRadius: Sizes.fixPadding, flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Sizes.fixPadding, paddingHorizontal: Sizes.fixPadding*2, marginBottom: Sizes.fixPadding,  backgroundColor: Colors.orange_light}}>
                    <Text style={{...Fonts.gray14RobotoMedium}}>Favourable Day        -</Text>
                    <Text style={{...Fonts.gray14RobotoMedium}}>{data?.numero_table?.fav_day}</Text>
                </View>
                <View style={{borderRadius: Sizes.fixPadding, flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Sizes.fixPadding, paddingHorizontal: Sizes.fixPadding*2, marginBottom: Sizes.fixPadding,  backgroundColor: Colors.orange_light}}>
                    <Text style={{...Fonts.gray14RobotoMedium}}>Favourable Colour   -</Text>
                    <Text style={{...Fonts.gray14RobotoMedium}}>{data?.numero_table?.fav_color}</Text>
                </View>
                <View style={{borderRadius: Sizes.fixPadding, flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Sizes.fixPadding, paddingHorizontal: Sizes.fixPadding*2, marginBottom: Sizes.fixPadding,  backgroundColor: Colors.orange_light}}>
                    <Text style={{...Fonts.gray14RobotoMedium}}>Favourable Metal    -</Text>
                    <Text style={{...Fonts.gray14RobotoMedium}}>{data?.numero_table?.fav_stone}</Text>
                </View>
                <View style={{borderRadius: Sizes.fixPadding, flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Sizes.fixPadding, paddingHorizontal: Sizes.fixPadding*2, marginBottom: Sizes.fixPadding,  backgroundColor: Colors.orange_light}}>
                    <Text style={{...Fonts.gray14RobotoMedium}}>Favourable God       -</Text>
                    <Text style={{...Fonts.gray14RobotoMedium}}>{data?.numero_table?.fav_god}</Text>
                </View>
          </View>
          
        )
        // }
        // return (
        //     <View>
        //         <FlatList 
        //         //   data={}
        //           renderItem={renderItem}
        //           key={item => item.id}
        //           numColumns={2}
        //         />
        //     </View>
        // )
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
              Favourable
            </Text>
          </View>
        );
      }
}

export default Favourable

const styles = StyleSheet.create({
    row: {
        flex: 0,
        flexDirection: 'row',
        alignItems: 'center',
      },
})