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
        name: 'Ashtakoota',
        img: require('../../../src/assets/images/mandala.png')
    },
    {
        id:4,
        name: 'Dashkoota',
        img: require('../../../src/assets/images/arabesque.png')
    },
    {
        id:5,
        name: 'Manglik Match',
        img: require('../../../src/assets/images/gender.png')
    },
    {
        id:6,
        name: 'Match Conclusion',
        img: require('../../../src/assets/images/search.png')
    }
]

const MatchCategory = props => {
  console.log(props.route.params);
    const [isLoading, setIsLoading] = useState(false);

    console.log('kundli id ye hi', props.route.params.data1)
    console.log('kundli id ye hi', props.route.params.data2)


    

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
            props.navigation.navigate('matchBirthDetail',{data3 : props.route.params.data1, data4 : props.route.params.data2});
            break;
          case 2:
            props.navigation.navigate('matchHoroscopeChart',{data3 : props.route.params.data1, data4 : props.route.params.data2});
            break;
          case 3:
            props.navigation.navigate('matchAshtakoota',{data3 : props.route.params.data1, data4 : props.route.params.data2});
            break;
          case 4:
            props.navigation.navigate('matchDashakoota',{data3 : props.route.params.data1, data4 : props.route.params.data2});
            break;
          case 5:
            props.navigation.navigate('manglikMatch',{data3 : props.route.params.data1, data4 : props.route.params.data2});
            break;
          case 6: 
            props.navigation.navigate('matchConclusion',{data3 : props.route.params.data1, data4 : props.route.params.data2});
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

export default MatchCategory

const styles = StyleSheet.create({
    row: {
        flex: 0,
        flexDirection: 'row',
        alignItems: 'center',
      },
})