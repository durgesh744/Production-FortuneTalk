import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList } from 'react-native'
import React, {useState} from 'react'
import {Colors, Fonts, Sizes} from '../../assets/style';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MyStatusBar from '../../components/MyStatusBar';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../config/Screen';
import LinearGradient from 'react-native-linear-gradient';
import Loader from '../../components/Loader';
import Carousel from 'react-native-reanimated-carousel';
import { api_url, img_url, get_horoscope, free_insight_banner } from '../config/constants';
import axios from 'axios';
import { Tab, color } from '@rneui/base';

const user = [
    {
        id:1
    },
    {
        id:2
    },
    {
        id:3
    }
]

const NewKundli = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [banner, setBanner] = useState(false);

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
              {bannerInfo()}
              {createKundli()}
              {recentUser()}
            </>
          }
        />
        </View>
    </View>
  )

  function recentUser() {
    const renderItem = ({item, index}) => {
    return (
        <View >
            <View style={{flexDirection: 'row', marginBottom: Sizes.fixPadding, justifyContent: 'space-between', padding: Sizes.fixPadding*1.5, elevation:10, backgroundColor: Colors.whiteDark, shadowColor:Colors.black,  borderRadius: Sizes.fixPadding}}>
                <View>
                    <Text style={{...Fonts.gray14RobotoMedium}}>Akshay Kumar</Text>
                    <Text style={{...Fonts.gray11RobotoRegular, color:Colors.grayMedium}}>18 November 1998-12:55</Text>
                </View>
                <TouchableOpacity style={{backgroundColor: Colors.primaryDark, borderRadius:Sizes.fixPadding*2, paddingHorizontal:Sizes.fixPadding*2, paddingVertical:Sizes.fixPadding}}>
                    <Text style={{...Fonts.white11InterMedium, textAlign: 'center'}}>Details</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
    }
    return (
        <View style={{width: SCREEN_WIDTH*0.9, margin: Sizes.fixPadding*2}}>
            <Text style={{...Fonts.gray14RobotoRegular, marginBottom:Sizes.fixPadding*1.5, fontWeight: 'bold'}}>Recently Name use for Kundli</Text>
            <FlatList  
              data={user}
              renderItem={renderItem}
              key={item => item.id}
            />
        </View>
    )
  }

  function createKundli() {
    return (
        <View style={{borderTopColor: Colors.grayLight, borderBottomColor:Colors.grayLight, borderTopWidth:1, borderBottomWidth:1, padding: Sizes.fixPadding*2}}>
           <LinearGradient style={{borderRadius:Sizes.fixPadding*2.5, padding: Sizes.fixPadding}} colors={[Colors.primaryDark, Colors.primaryLight]}>
            <TouchableOpacity>
                <Text style={{...Fonts.white16RobotoMedium, textAlign: 'center'}}>+ Create a New Kundli</Text>
            </TouchableOpacity>
            </LinearGradient>
        </View>
    )
  }

  function bannerInfo() {
    const renderItem = ({item, index}) => {
      return (
        <TouchableOpacity
          activeOpacity={1}
          style={{
            width: SCREEN_WIDTH * 0.95,
            height: 60,
            marginRight: Sizes.fixPadding,
            borderRadius: Sizes.fixPadding,
            overflow: 'hidden',
            borderWidth: 2,
            borderColor: Colors.grayLight,
          }}>
          {/* <Image source={{uri: img_url + item.image}} style={{width: '100%', height: '100%'}} /> */}
          <Image source={{uri: 'https://images.app.goo.gl/B92Ps9C6Q9JXZ3vp6'}} style={{width: '100%', height: '100%', resizeMode: 'cover'}} />
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
          data={banner}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          horizontal
          contentContainerStyle={{paddingLeft: Sizes.fixPadding}}
          pagingEnabled
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
          Free Kundli
        </Text>
      </View>
    );
  }
}

export default NewKundli

const styles = StyleSheet.create({
    row: {
        flex: 0,
        flexDirection: 'row',
        alignItems: 'center',
      },
})