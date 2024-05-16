import {
    View,
    Text,
    FlatList,
    Image,
    ImageBackground,
    TouchableOpacity,
    StyleSheet,
  } from 'react-native';
  import React, { useState } from 'react';
  import {Colors, Fonts, Sizes} from '../../assets/style';
  import {SCREEN_WIDTH} from '../../config/Screen';
  import LinearGradient from 'react-native-linear-gradient';
  import MyHeader from '../../components/MyHeader';
import Video from '../../components/Courses/Video';
import { base_url } from '../../config/constants';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
  
const DemoClassDetails = ({navigation, route, userData}) => {
    const [state, setState] = useState({
      demoData: route?.params?.data
    })

    console.log(route?.params?.data?.is_live)

    const updateState = data =>{
      setState(prevState=>{
        const newData = {...prevState, ...data}
        return newData
      })
    }

    const {demoData} = state

    return (
        <View style={{flex: 1, backgroundColor: Colors.bodyColor}}>
          {header()}
          <FlatList
            ListHeaderComponent={
              <>
                {liveVedioInfo()}
                {durationInfo()}
                {courseTitleInfo()}
                {courseDescriptionInfo()}
                {classInfo()}
                {learningInfo()}
              </>
            }
          />
        </View>
      );

      function learningInfo() {
        return (
          <View style={{marginHorizontal: Sizes.fixPadding*2}}>
            <Text style={{...Fonts.black16RobotoRegular, marginBottom: Sizes.fixPadding}}>Course Content</Text>
            <Text
                style={{
                  ...Fonts.gray12RobotoMedium,
                  flex: 1,
                }}>
                  {demoData?.course_content}
              </Text>
          </View>
        );
      }

      function classInfo() {
        const on_live = async()=>{
          const check_is_register = await AsyncStorage.getItem('isRegister');
          const isRegister = JSON.parse(check_is_register);
          if(isRegister?.value){
            navigation.navigate('liveNow', {
              liveID: demoData?.unique_id,
              userID: userData?.id,
              userName: userData?.username,
            })
          }else{
            if(isRegister?.type == 'profile'){
              navigation.navigate('profile')
            }else{
              navigation.navigate('login')
            }navigation.navigate('profile')
          }
        }
        return (
          <TouchableOpacity
            activeOpacity={0.8}
            disabled={demoData?.is_live == 0}
            onPress={on_live}
            style={{marginVertical: Sizes.fixPadding}}
            >
            <LinearGradient
              colors={demoData?.is_live == 0 ? [Colors.grayLight, Colors.grayDark] : [Colors.primaryLight, Colors.primaryDark]}
              style={{paddingVertical: Sizes.fixPadding * 1.5}}>
              <Text style={{...Fonts.white16RobotoMedium, textAlign: 'center'}}>
              Join the Live Demo Class Now
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        );
      }
    
      function courseDescriptionInfo() {
        return (
          <View
            style={{
              marginHorizontal: Sizes.fixPadding * 2,
              marginTop: Sizes.fixPadding * 0.5,
            }}>
            <Text style={{...Fonts.gray12RobotoRegular}}>
            {demoData?.description}
            </Text>
          </View>
        );
      }
    
      function courseTitleInfo() {
        return (
          <View
            style={{
              marginHorizontal: Sizes.fixPadding * 2,
              marginTop: Sizes.fixPadding * 0.5,
            }}>
            <Text style={{...Fonts.black16RobotoRegular}}>
            {demoData?.course_name}
            </Text>
          </View>
        );
      }
    
      function durationInfo() {
        return (
          <View
            style={{
              marginHorizontal: Sizes.fixPadding * 2,
              marginTop: Sizes.fixPadding,
            }}>
            <Text style={{...Fonts.gray14RobotoRegular}}>19.00 min Video</Text>
          </View>
        );
      }
    
      function liveVedioInfo() {
        return (
          <Video uri={base_url + demoData?.video[0]?.video} />
        );
      }
    
      function header() {
        return <MyHeader title={'Demo Class Details'} navigation={navigation} />;
      }
}

const mapStateToProps = state => ({
  userData: state.user.userData,
  wallet: state.user.wallet,
});

export default connect(mapStateToProps, null)(DemoClassDetails)

const styles = StyleSheet.create({
    dots: {
      width: 5,
      height: 5,
      borderRadius: 5,
      backgroundColor: Colors.gray,
      marginRight: Sizes.fixPadding,
      marginTop: Sizes.fixPadding * 0.5,
    },
  });