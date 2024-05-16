import {
  View,
  Text,
  FlatList,
  Image,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, {useState} from 'react';
import {Colors, Fonts, Sizes} from '../../assets/style';
import MyHeader from '../../components/MyHeader';
import LinearGradient from 'react-native-linear-gradient';
import { img_url } from '../../config/constants';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PaidPdfDetails = ({navigation, route, customerData}) => {
  const [courseData] = useState(route?.params?.data);
  console.log(courseData)

  return (
    <View style={{flex: 1, backgroundColor: Colors.bodyColor}}>
      {header()}
      <FlatList
        ListHeaderComponent={
          <>
            {titleInfo()}
            {contentInfo()}
          </> 
        }
      />
      {continueButtonInfo()}
    </View>
  );

  function continueButtonInfo() {
    const on_payment = async()=>{
      const check_is_register = await AsyncStorage.getItem('isRegister');
      const isRegister = JSON.parse(check_is_register);
      if(isRegister?.value){
        navigation.navigate('courseBookingDetails', {
          data: {
            astroName: courseData?.owner_name,
            astroImage: img_url + courseData?.img_url,
            title: courseData?.title,
            description: '',
            price: courseData?.amount,
            type: 'paid_pdf',
            pdf_name: courseData?.pdf_name,
            product_id: courseData?.id,
            image: null,
            apiData: {
              pdf_id: courseData?.id,
              customer_id: customerData?.id,
              teacher_id: courseData?.astro_id,
            }
          },
        })
      }else{
        if(isRegister?.type == 'profile'){
          navigation.navigate('profile')
        }else{
          navigation.navigate('login')
        }
      }
    }
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={on_payment}
        style={{
          marginHorizontal: Sizes.fixPadding * 2,
          marginVertical: Sizes.fixPadding,
          borderRadius: Sizes.fixPadding * 1.4,
          overflow: 'hidden',
        }}>
        <LinearGradient
          colors={[Colors.primaryLight, Colors.primaryDark]}
          style={{paddingVertical: Sizes.fixPadding}}>
          <Text style={{...Fonts.white16RobotoMedium, textAlign: 'center'}}>
            Pay Now
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  function contentInfo() {
    const renderItem = ({item, index}) => {
      return (
        <View
          style={{
            flex: 0,
            flexDirection: 'row',
            marginBottom: Sizes.fixPadding * 0.5,
          }}>
          <Text>{index + 1}.</Text>
          <Text
            style={{
              ...Fonts.gray12RobotoMedium,
              flex: 1,
              marginLeft: Sizes.fixPadding,
            }}>
            She has been awarded with KP Vidya Vachaspathi Degree from Prof. K.
            Hariharan from Chennai.
          </Text>
        </View>
      );
    };
    return (
      <View
        style={{
          paddingHorizontal: Sizes.fixPadding * 1.5,
          borderBottomWidth: 1,
          borderBottomColor: Colors.grayLight,
        }}>
        <Text
          style={{
            ...Fonts.black16RobotoRegular,
            marginBottom: Sizes.fixPadding,
          }}>
          PDF Content
        </Text>
        <FlatList data={[1, 2, 3, 4, 5, 6, 7, 8]} renderItem={renderItem} />
      </View>
    );
  }

  function titleInfo() {
    return (
      <View style={{margin: Sizes.fixPadding * 2}}>
        <Text style={{...Fonts.black16RobotoRegular}}>{courseData?.title}</Text>
      </View>
    );
  }

  function header() {
    return <MyHeader title={'Paid PDF'} navigation={navigation} />;
  }
};

const mapStateToProps = state => ({
  customerData: state.user.userData,
  wallet: state.user.wallet,
});

export default connect(mapStateToProps, null)(PaidPdfDetails);
