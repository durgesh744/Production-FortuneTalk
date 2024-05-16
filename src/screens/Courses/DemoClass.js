import {
  View,
  Text,
  FlatList,
  Image,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import {Colors, Fonts, Sizes} from '../../assets/style';
import {SCREEN_WIDTH} from '../../config/Screen';
import MyStatusBar from '../../components/MyStatusBar';
import MyHeader from '../../components/MyHeader';
import axios from 'axios';
import { api_url, base_url, demo_class_by_astrologer_course_id } from '../../config/constants';
import Loader from '../../components/Loader';
import NoDataFound from '../../components/NoDataFound';

const DemoClass = ({navigation, route}) => {
  const [state, setState] = useState({
    isLoading: false,
    demoClassData: null,
    teacherData: route?.params?.data
  })
  useEffect(()=>{
    get_demo_classes()
  }, [])

  const get_demo_classes = async()=>{
    updateState({isLoading: true})
    await axios({
      method: 'post',
      url: api_url + demo_class_by_astrologer_course_id,
      headers: {
        'Content-Type':'multipart/form-data'
      },
      data:{
        astro_id: teacherData?.id,
        course_id: route.params.course_id
      }
    }).then(res=>{
      console.log(res.data)
      updateState({isLoading: false})
      if(res.data.status == '200'){
        updateState({demoClassData: res.data.data})
      }else{
        updateState({demoClassData: []})
      }
    }).catch(err=>{
      console.log(err)
      updateState({isLoading: false})
    })
  }

  const updateState = data => {
    setState(prevState=>{
      const newData = {...prevState, ...data}
      return newData
    })
  }

  const {isLoading, demoClassData, teacherData} = state

  return (
    <View style={{flex: 1, backgroundColor: Colors.bodyColor}}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      <Loader visible={isLoading} />
      {header()}
      <FlatList ListHeaderComponent={<>{demoClassData && tarotTeachersInfo()}</>} />
    </View>
  );

  function tarotTeachersInfo() {
    const renderItem = ({item, index}) => {
      return (
        <TouchableOpacity
          activeOpacity={1}
            onPress={() => navigation.navigate('demoClassOverview', {data: item})}
          style={{
            borderRadius: Sizes.fixPadding,
            overflow: 'hidden',
            backgroundColor: Colors.whiteDark,
            padding: Sizes.fixPadding,
            marginBottom: Sizes.fixPadding * 1.5,
          }}>
          <View
            style={{
              flex: 0,
              height: SCREEN_WIDTH*0.4,
              borderTopLeftRadius: Sizes.fixPadding,
              borderTopRightRadius: Sizes.fixPadding,
              overflow: 'hidden'
            }}>
            <Image
              source={{uri: base_url + item?.image[0]?.images}}
              style={{
                width: '100%',
                height: '100%',
              }}
            />
          </View>
          <View
            style={{
            }}>
            <Text numberOfLines={2} style={{...Fonts.black14InterMedium}}>
            {item?.course_name}
            </Text>
            <Text numberOfLines={4} style={{...Fonts.gray12RobotoRegular, marginBottom: Sizes.fixPadding}}>
              {item?.description}
            </Text>
          </View>
        </TouchableOpacity>
      );
    };
    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 1.5,
          marginTop: Sizes.fixPadding,
        }}>
        <FlatList
          data={demoClassData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          ListEmptyComponent={<NoDataFound />}
        />
      </View>
    );
  }

  function header() {
    return <MyHeader title={'Demo Class'} navigation={navigation} />;
  }
};

export default DemoClass;
