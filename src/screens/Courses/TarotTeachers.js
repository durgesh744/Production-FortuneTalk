import {
  View,
  Text,
  FlatList,
  Image,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors, Fonts, Sizes} from '../../assets/style';
import {SCREEN_WIDTH} from '../../config/Screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import MyStatusBar from '../../components/MyStatusBar';
import MyHeader from '../../components/MyHeader';
import Stars from 'react-native-stars';
import axios from 'axios';
import {api_url, pdf_course_id} from '../../config/constants';
import Loader from '../../components/Loader';
import { img_url_2 } from '../../config/constants';
import NoDataFound from '../../components/NoDataFound';

const TarotTeachers = ({navigation, route}) => {
  const [state, setState] = useState({ 
    teachersData: null,
    isLoading: false,
  });
  useEffect(() => {
    get_teachers();
  }, []);

  const get_teachers = async () => {
    updateState({isLoading: true});
    await axios({
      method: 'post',
      url: api_url + pdf_course_id,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        course_id: route?.params?.data?.id
      },
    })
      .then(res => {
        updateState({isLoading: false});
        if(res.data.status == '200'){
          updateState({teachersData: res.data.data})
        }else{
          updateState({teachersData: []})
        }
      })
      .catch(err => {
        updateState({isLoading: false});
        console.log(err);
      });
  };


  const updateState = data => {
    setState(prevState => {
      const newData = {...prevState, ...data};
      return newData;
    });
  };
  const {teachersData, isLoading} = state;

  return (
    <View style={{flex: 1, backgroundColor: Colors.bodyColor}}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      <Loader visible={isLoading} />
      {header()}
      <FlatList
        ListHeaderComponent={<>{teachersData && tarotTeachersInfo()}</>}
      />
    </View>
  );

  function tarotTeachersInfo() {
    const renderItem = ({item, index}) => {
      console.log(item)
      return (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => navigation.navigate('teacherDetails', {data: item, course_id:route?.params?.data?.id})}
          style={{
            borderRadius: Sizes.fixPadding,
            overflow: 'hidden',
            marginBottom: Sizes.fixPadding * 1.5,
          }}>
          <LinearGradient
            colors={[Colors.primaryLight, Colors.primaryDark]}
            style={{
              flex: 0,
              flexDirection: 'row',
              alignItems: 'center',
              borderTopLeftRadius: Sizes.fixPadding,
              borderTopRightRadius: Sizes.fixPadding,
              padding: Sizes.fixPadding,
            }}>
            <View
              style={{
                width: SCREEN_WIDTH * 0.2,
                height: SCREEN_WIDTH * 0.2,
                borderRadius: Sizes.fixPadding,
                borderWidth: 3,
                borderColor: Colors.white,
                overflow: 'hidden',
              }}>
              <Image
                source={{uri: img_url_2 + item.img_url}}
                style={{
                  width: '100%',
                  height: '100%',
                }}
              />
            </View>
            <View style={{marginLeft: Sizes.fixPadding}}>
              <Text style={{...Fonts.white18RobotMedium}}>{item?.owner_name}</Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginVertical: Sizes.fixPadding * 0.2,
                }}>
                <Stars
                  default={parseInt(item?.avg_rating)}
                  count={5}
                  half={true}
                  starSize={14}
                  fullStar={
                    <Ionicons name={'star'} size={14} color={Colors.white} />
                  }
                  emptyStar={
                    <Ionicons
                      name={'star-outline'}
                      size={14}
                      color={Colors.white}
                    />
                  }
                  // halfStar={<Icon name={'star-half'} style={[styles.myStarStyle]} />}
                />
                <Text
                  style={{
                    ...Fonts.white12RobotoMedium,
                    marginLeft: Sizes.fixPadding * 0.5,
                  }}>
                  (288 Students)
                </Text>
              </View>
              <Text style={{...Fonts.white14RobotoMedium}}>
                Experience - {item?.experience} years
              </Text>
            </View>
          </LinearGradient>
          <View
            style={{
              backgroundColor: Colors.whiteDark,
              padding: Sizes.fixPadding,
            }}>
            <Text numberOfLines={2} style={{...Fonts.black16RobotoRegular}}>
              {item?.course_name}
            </Text>
            <Text numberOfLines={4} style={{...Fonts.gray12RobotoRegular}}>
             {item?.course_content}
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
          data={teachersData}
          renderItem={renderItem}
          ListEmptyComponent={<NoDataFound />}
        />
      </View>
    );
  }

  function header() {
    return (
      <MyHeader title={"Teachers List"} navigation={navigation} />
    );
  }
};

export default TarotTeachers;
