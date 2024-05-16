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
import MyStatusBar from '../../components/MyStatusBar';
import MyHeader from '../../components/MyHeader';
import {
  api_url,
  base_url,
  live_class_by_astrologer_course_id,
} from '../../config/constants';
import Loader from '../../components/Loader';
import {ApiRequest} from '../../config/api_requests';
import NoDataFound from '../../components/NoDataFound';
const LiveClasses = ({navigation, route}) => {
  const [state, setState] = useState({
    isLoading: false,
    liveClassData: null,
    teacherData: route?.params?.data,
  });

  useEffect(() => {
    get_live_classes();
  }, []);

  const get_live_classes = async () => {
    try {
      updateState({isLoading: true});
      const response = await ApiRequest.postRequest({
        url: api_url + live_class_by_astrologer_course_id,
        data: {
          astro_id: teacherData?.id,
          course_id: route.params.course_id,
        },
      });
      if (response.status == '200') {
        updateState({liveClassData: response.data});
      }else{
        updateState({liveClassData: []});
      }
      updateState({isLoading: false});
    } catch (e) {
      updateState({isLoading: false});
      console.log(e);
    }
  };

  const updateState = data => {
    setState(prevState => {
      const newData = {...prevState, ...data};
      return newData;
    });
  };

  const {isLoading, liveClassData, teacherData} = state;

  return (
    <View style={{flex: 1, backgroundColor: Colors.bodyColor}}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      <Loader visible={isLoading} />
      {header()}
      <FlatList
        ListHeaderComponent={<>{liveClassData && tarotTeachersInfo()}</>}
      />
    </View>
  );

  function tarotTeachersInfo() {
    const renderItem = ({item, index}) => {
      return (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => navigation.navigate('scheduleCourse', {data: item})}
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
              height: SCREEN_WIDTH * 0.4,
              borderTopLeftRadius: Sizes.fixPadding,
              borderTopRightRadius: Sizes.fixPadding,
              overflow: 'hidden',
            }}>
            <Image
              source={{uri: base_url + item?.image[0]?.images}}
              style={{
                width: '100%',
                height: '100%',
              }}
            />
          </View>
          <View style={{}}>
            <Text numberOfLines={2} style={{...Fonts.black14InterMedium}}>
              {item?.course_name}
            </Text>
            <Text
              numberOfLines={4}
              style={{
                ...Fonts.gray12RobotoRegular,
                marginBottom: Sizes.fixPadding,
              }}>
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
          data={liveClassData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          ListEmptyComponent={<NoDataFound />}
        />
      </View>
    );
  }

  function header() {
    return <MyHeader title={'Live Class'} navigation={navigation} />;
  }
};

export default LiveClasses;
