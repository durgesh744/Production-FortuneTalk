import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList } from 'react-native'
import React, {useState} from 'react'
import {Colors, Fonts, Sizes} from '../../../src/assets/style';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MyStatusBar from '../../components/MyStatusBar';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../config/Screen';
import LinearGradient from 'react-native-linear-gradient';
import Loader from '../../components/Loader';
import Carousel from 'react-native-reanimated-carousel';
import { api_url, img_url, get_horoscope, free_insight_banner } from '../config/constants';
import axios from 'axios';


const cate = [
    {
        id:1,
        name: 'Birth Details',
        img: require('../../../src/assets/images/birthday.png')
    },
    {
        id:2,
        name: 'Horoscope Chart',
        img: require('../../../src/assets/images/constellation.png')
    },
    {
        id:3,
        name: 'Planetary Details',
        img: require('../../../src/assets/images/planet.png')
    },
    {
        id:4,
        name: 'Favorable for You',
        img: require('../../../src/assets/images/numerology.png')
    },
    {
        id:5,
        name: 'KP',
        img: require('../../../src/assets/images/sun1.png')
    },
    {
        id:6,
        name: 'Kundli Dosh',
        img: require('../../../src/assets/images/parchment.png')
    },
    {
        id:7,
        name: 'Vimshottari Dasha',
        img: require('../../../src/assets/images/moon-and-stars.png')
    },{
        id:8,
        name: 'Remedies',
        img: require('../../../src/assets/images/medicine.png')
    },
    // {
    //     id:9,
    //     name: 'Report',
    //     img: require('../../../src/assets/images/quality-of-life.png')
    // },
]

const KundliCategory = props => {
  console.log(props.route.params);
    const [isLoading, setIsLoading] = useState(false);

    return (
        <View style={{flex: 1, backgroundColor: Colors.bodyColor}}>
          <MyStatusBar
            backgroundColor={Colors.primaryLight}
            barStyle={'light-content'}
          />
          <Loader visible={isLoading} />
          {header()}
          <View style={{flex:1}}>
            <FlatList
              ListHeaderComponent={
                <>
                  {categoryInfo()}
                </>
              }
            />
            </View>
        </View>
    )

    function categoryInfo() {
      const on_press = id => {
        switch (id) {
          case 1:
            props.navigation.navigate('birthDetails', {Cname: props.route.params.Cname, id: props.route.params.kundli_id, place: props.route.params.place});
            break;
          case 2:
            props.navigation.navigate('horoscopeChart', {id: props.route.params.kundli_id});
            break;
          case 3:
            props.navigation.navigate('planetaryDetails', {id: props.route.params.kundli_id});
            break;
          case 4:
            props.navigation.navigate('favourable', {id: props.route.params.kundli_id});
            break;
          case 5:
            props.navigation.navigate('kpChart', {id: props.route.params.kundli_id});
            break;
          case 6:
            props.navigation.navigate('kundliDosh', {id: props.route.params.kundli_id});
            break;
          case 7:
            props.navigation.navigate('vimshottariDasha', {id: props.route.params.kundli_id});
            break;
          case 8:
            props.navigation.navigate('kundliRemedies', {id: props.route.params.kundli_id});
            break;
          case 9:
            props.navigation.navigate('kundlireport', {id: props.route.params.kundli_id})
          default:
            console.log(null);
        }
      };
        const renderItem = ({item, index}) => {
        return (
            <View key={index} style={{flexDirection: 'row', marginBottom: Sizes.fixPadding, alignItems: 'center', justifyContent: 'center'}}>
                <View style={{width:SCREEN_WIDTH*0.2, zIndex: 1, height:SCREEN_WIDTH*0.2, borderRadius:SCREEN_WIDTH*0.2, backgroundColor: Colors.primaryDark, alignItems: 'center', justifyContent: 'center'}}>
                    <Image source={item.img} style={{width:SCREEN_WIDTH*0.10, height:SCREEN_WIDTH*0.10, borderRadius:SCREEN_WIDTH*0.10, resizeMode: 'cover'}} />
                </View>
                <TouchableOpacity onPress={() => on_press(item.id)} style={{borderWidth:2.5, left: -25, padding: Sizes.fixPadding*0.5, borderRadius:Sizes.fixPadding, borderColor:Colors.primaryDark, width: '70%', alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{...Fonts.primaryDark16RobotoMedium, textAlign: 'center', textAlignVertical: 'center'}}>{item.name}</Text>
                </TouchableOpacity>
            </View>
        )
    }
    return (
        <View style={{marginVertical: Sizes.fixPadding*1.5}}>
            <FlatList  
              data={cate}
              renderItem={renderItem}
              key={item => item.id}
            />
        </View>
    )
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
              Kundli
            </Text>
          </View>
        );
      }
}

export default KundliCategory

const styles = StyleSheet.create({
    row: {
        flex: 0,
        flexDirection: 'row',
        alignItems: 'center',
      },
})