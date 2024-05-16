import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors, Fonts, Sizes} from '../../assets/style';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MyStatusBar from '../../components/MyStatusBar';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../config/Screen';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import {api_url, course_list, img_url_3} from '../../config/constants';
import Loader from '../../components/Loader';
import {CommonActions} from '@react-navigation/native';
import NoDataFound from '../../components/NoDataFound';

const Courses = ({navigation}) => {
  const [state, setState] = useState({
    isLoading: false,
    selectedItem: null,
    coursesData: null,
  });

  useEffect(() => {
    get_courses_data();
  }, []);

  const get_courses_data = async () => {
    updateState({isLoading: false});
    await axios({
      method: 'get',
      url: api_url + course_list,
    })
      .then(res => {
        updateState({isLoading: false});
        if (res.data.status == '200') {
          updateState({coursesData: res.data.data});
        } else {
          updateState({coursesData: []});
        }
      })
      .catch(err => {
        updateState({isLoading: false});
        console.log(err);
      });
  };

  const go_home = () => {
    navigation.dispatch(CommonActions.navigate({name: 'home3'}));
  };

  const updateState = data => {
    setState(prevState => {
      const newState = {...prevState, ...data};
      return newState;
    });
  };

  const {isLoading, selectedItem, coursesData} = state;
  return (
    <View style={{flex: 1, backgroundColor: Colors.bodyColor}}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      <Loader visible={isLoading} />
      {header()}
      {myCoursesInfo()}
      <View style={{flex: 1}}>
        <FlatList
          ListHeaderComponent={<>{coursesData && courseInfo()}</>}
          contentContainerStyle={{paddingVertical: Sizes.fixPadding * 2}}
        />
      </View>
    </View>
  );

  function myCoursesInfo() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate('myCourses')}>
        <LinearGradient
          colors={[Colors.primaryLight, Colors.primaryDark]}
          style={[
            styles.row,
            {justifyContent: 'center', paddingVertical: Sizes.fixPadding},
          ]}>
          <Image
            source={require('../../assets/images/courses/e-learning.png')}
            style={{width: 20, height: 20}}
          />
          <Text
            style={{...Fonts.white18RobotMedium, marginLeft: Sizes.fixPadding}}>
            My Courses
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  function courseInfo() {
    const renderItem = ({item, index}) => {
      return (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => navigation.navigate('tarotTeachers', {data: item})}
          style={{
            width: SCREEN_WIDTH * 0.45,
            borderRadius: Sizes.fixPadding,
            overflow: 'hidden',
            marginBottom: Sizes.fixPadding * 1.5,
            // shadowColor: Colors.black,
            padding: Sizes.fixPadding * 0.5,
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: Sizes.fixPadding * 2,
          }}>
          <Image
            source={{uri: img_url_3 + item.image}}
            style={{
              width: '100%',
              height: SCREEN_WIDTH * 0.5,
              borderTopLeftRadius: Sizes.fixPadding,
              borderTopRightRadius: Sizes.fixPadding,
            }}
          />
          <LinearGradient
            colors={
              selectedItem?.id == item?.id
                ? [Colors.primaryLight, Colors.primaryDark]
                : [Colors.whiteDark, Colors.grayLight]
            }
            style={{
              width: '100%',
              backgroundColor: Colors.whiteDark,
              elevation: 5,
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.2,
              position: 'absolute',
              bottom: Sizes.fixPadding,
              paddingVertical: Sizes.fixPadding * 0.5,
              borderRadius: Sizes.fixPadding * 0.7,
              shadowColor: Colors.blackLight,
            }}>
            <Text
              style={[
                {
                  ...Fonts.gray14RobotoMedium,
                  color: Colors.blackLight,
                  textAlign: 'center',
                },
              ]}>
              {item.name}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      );
    };
    return (
      <FlatList
        data={coursesData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={{justifyContent: 'space-evenly'}}
        ListEmptyComponent={<NoDataFound />}
      />
    );
  }

  function header() {
    return (
      <View
        style={{
          margin: Sizes.fixPadding * 1.5,
          ...styles.row,
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity
          onPress={() => go_home()}
          style={{
            alignSelf: 'flex-start',
            flex: 0.2,
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
            // textAlign: 'center',
            flex: 0.6,
          }}>
          Courses
        </Text>
      </View>
    );
  }
};

export default Courses;

const styles = StyleSheet.create({
  row: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
