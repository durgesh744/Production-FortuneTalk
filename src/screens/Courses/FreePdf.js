import {
  View,
  Text,
  FlatList,
  Image,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors, Fonts, Sizes} from '../../assets/style';
import MyHeader from '../../components/MyHeader';
import Loader from '../../components/Loader';
import { ApiRequest } from '../../config/api_requests';
import { api_url, free_pdf_class_by_astrologer_course_id, } from '../../config/constants';
import { MyMethods } from '../../methods/my_methods';
import NoDataFound from '../../components/NoDataFound';

const FreePdf = ({navigation, route}) => {
  const [state, setState] = useState({
    isLoading: false,
    pdfData: null,
    courseData: route?.params?.data
  });

  useEffect(()=>{
    get_pdf_list()
  }, [])

  const get_pdf_list = async()=>{
    try{
      updateState({isLoading: true})
      const response = await ApiRequest.postRequest({
        url: api_url + free_pdf_class_by_astrologer_course_id,
        data:{
          astro_id:courseData?.id,
          course_id:  route.params.course_id
        }
      })
      if(response?.status == '200'){
        updateState({pdfData: response?.data})
      }else{
        updateState({pdfData: []}) 
      }
      updateState({isLoading: false})

    }catch(e){
      updateState({isLoading: false})
      console.log(e)
      
    }
  }

  const updateState = data =>{
    setState(prevState=>{
      const newData = {...prevState, ...data}
      return newData
    })
  }

  const {isLoading, pdfData, courseData} = state

  return (
    <View style={{flex: 1, backgroundColor: Colors.bodyColor}}>
      <Loader visible={isLoading} />
      {header()}
      <FlatList ListHeaderComponent={<>{pdfData && freePdfInfo()}</>} />
    </View>
  );

  function freePdfInfo() {
    const renderItem = ({item, index}) => {
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={()=>MyMethods.download_file({uri: api_url + item?.pdf_name})}
          style={{
            backgroundColor: Colors.whiteDark,
            marginBottom: Sizes.fixPadding * 1.5,
            borderRadius: Sizes.fixPadding * 1.5,
            padding: Sizes.fixPadding * 1.5,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={{...Fonts.black14RobotoRegular, flex: 1}}>
            {item?.title}
          </Text>
          <Image
            source={require('../../assets/images/courses/icon_download.png')}
            style={{width: 25, height: 25, resizeMode: 'contain'}}
          />
        </TouchableOpacity>
      );
    };
    return (
      <View style={{margin: Sizes.fixPadding * 2}}>
        <FlatList data={pdfData} renderItem={renderItem}           ListEmptyComponent={<NoDataFound />} />
      </View>
    );
  }

  function header() {
    return <MyHeader title={'Free PDF'} navigation={navigation} />;
  }
};

export default FreePdf;
