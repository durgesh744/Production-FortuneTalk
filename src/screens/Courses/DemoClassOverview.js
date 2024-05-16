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
import {SCREEN_WIDTH} from '../../config/Screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import MyHeader from '../../components/MyHeader';
import moment from 'moment';
import Video from '../../components/Courses/Video';
import { base_url } from '../../config/constants';

const DemoClassOverview = ({navigation, route}) => {
  const [state, setState] = useState({
    demoData: route?.params?.data,
  });

  const updateState = data => {
    setState(prevState => {
      const newData = {...prevState, ...data};
      return newData;
    });
  };

  const {demoData} = state;
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
            {demoClassDatesInfo()}
            {learningInfo()}
          </>
        }
      />
      {demoClassDetailsInfo()}
    </View>
  );

  function demoClassDetailsInfo() {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => navigation.navigate('demoClassDetails', {data: demoData})}
        style={{
          margin: Sizes.fixPadding * 2,
          paddingVertical: Sizes.fixPadding,
          backgroundColor: Colors.primaryLight,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: Sizes.fixPadding * 1.5,
        }}>
        <Text style={{...Fonts.white14RobotoMedium}}>Demo Class Details</Text>
      </TouchableOpacity>
    );
  }

  function learningInfo() {
    const renderItem = ({item, index}) => {
      return (
        <View
          style={{
            flex: 0,
            flexDirection: 'row',
            marginBottom: Sizes.fixPadding * 0.5,
          }}>
          <View style={styles.dots} />
          <Text
            style={{
              ...Fonts.gray12RobotoMedium,
              flex: 1,
            }}>
              {item?.value}
          </Text>
        </View>
      );
    };
    return (
      <View style={{marginHorizontal: Sizes.fixPadding}}>
        <Text
          style={{
            ...Fonts.black16RobotoRegular,
            marginBottom: Sizes.fixPadding,
          }}>
          What will you learn from this Course ?
        </Text>
        <FlatList data={demoData?.student_course} renderItem={renderItem} />
      </View>
    );
  }

  function demoClassDatesInfo() {
    return (
      <View
        style={{
          marginVertical: Sizes.fixPadding,
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: Colors.grayLight,
          paddingVertical: Sizes.fixPadding,
          alignItems: 'center',
        }}>
        <Text style={{...Fonts.gray14RobotoRegular}}>
          Demo Class will be Conducted on
        </Text>
        <Text style={{...Fonts.gray14RobotoMedium, color: Colors.red_a}}>
          {`${moment(demoData?.demo_start_date).format(
            'Do MMMM YYYY',
          )} (${moment(demoData?.demo_start_time).format('hh:mm A')})`}{' '}
        </Text>
      </View>
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
    return <MyHeader title={'Demo Class'} navigation={navigation} />;
  }
};

export default DemoClassOverview;

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
