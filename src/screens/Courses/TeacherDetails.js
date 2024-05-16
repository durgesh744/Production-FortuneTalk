import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, {useState} from 'react';
import {Colors, Fonts, Sizes} from '../../assets/style';
import {SCREEN_WIDTH} from '../../config/Screen';
import LinearGradient from 'react-native-linear-gradient';
import MyStatusBar from '../../components/MyStatusBar';
import MyHeader from '../../components/MyHeader';
import {img_url_2} from '../../config/constants';
import HtmlRender from '../../components/HtmlRender';

const TeacherDetails = ({navigation, route}) => {
  const [state, setState] = useState({
    teacherData: route?.params?.data,
  });

  const updateState = data => {
    setState(prevState => {
      const newData = {...prevState, ...data};
      return newData;
    });
  };

  const {teacherData} = state;

  return (
    <View style={{flex: 1, backgroundColor: Colors.bodyColor}}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      {header()}
      <FlatList
        ListHeaderComponent={
          <>
            {profileInfo()}
            {descriptionInfo()}
            {educationQualificationInfo()}
            {astrologicalQualificationInfo()}
            {liveClassesInfo()}
            {pdfInfo()}
          </>
        }
      />
    </View>
  );

  function pdfInfo() {
    return (
      <View
        style={{
          padding: Sizes.fixPadding * 1.5,
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: Colors.grayLight,
        }}>
        <Text style={{...Fonts.black16RobotoMedium}}>PDF</Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            marginTop: Sizes.fixPadding,
          }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate('freePdf', {
                data: teacherData,
                course_id: route?.params?.course_id,
              })
            }
            style={{
              width: '45%',
              elevation: 5,
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.2,
            }}>
            <LinearGradient
              colors={[Colors.whiteDark, Colors.grayLight]}
              style={{
                borderRadius: Sizes.fixPadding,
                height: Sizes.fixPadding * 8,
                justifyContent: 'center',
              }}>
              <Text style={{...Fonts.gray16RobotoMedium, textAlign: 'center'}}>
                Free
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate('paidPdf', {
                data: teacherData,
                course_id: route?.params?.course_id,
              })
            }
            style={{
              width: '45%',
              elevation: 5,
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.2,
            }}>
            <LinearGradient
              colors={[Colors.whiteDark, Colors.grayLight]}
              style={{
                borderRadius: Sizes.fixPadding,
                height: Sizes.fixPadding * 8,
                justifyContent: 'center',
              }}>
              <Text style={{...Fonts.gray16RobotoMedium, textAlign: 'center'}}>
                Paid
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function liveClassesInfo() {
    return (
      <View
        style={{
          padding: Sizes.fixPadding * 1.5,
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: Colors.grayLight,
        }}>
        <Text style={{...Fonts.black16RobotoMedium}}>Live Classes</Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            marginVertical: Sizes.fixPadding,
          }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate('demoClass', {
                data: teacherData,
                course_id: route.params.course_id,
              })
            }
            style={{
              width: '45%',
              elevation: 5,
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.2,
            }}>
            <LinearGradient
              colors={[Colors.whiteDark, Colors.grayLight]}
              style={{
                borderRadius: Sizes.fixPadding,
                height: Sizes.fixPadding * 8,
                justifyContent: 'center',
              }}>
              <Text style={{...Fonts.gray16RobotoMedium, textAlign: 'center'}}>
                Demo Classes
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate('liveClasses', {
                data: teacherData,
                course_id: route?.params?.course_id,
              })
            }
            style={{
              width: '45%',
              elevation: 5,
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.2,
            }}>
            <LinearGradient
              colors={[Colors.whiteDark, Colors.grayLight]}
              style={{
                borderRadius: Sizes.fixPadding,
                height: Sizes.fixPadding * 8,
                justifyContent: 'center',
              }}>
              <Text style={{...Fonts.gray16RobotoMedium, textAlign: 'center'}}>
                Schedule{'\n'}Live Classes
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function astrologicalQualificationInfo() {
    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 1.5,
          marginBottom: Sizes.fixPadding * 1.5,
        }}>
        <Text style={{...Fonts.black16RobotoRegular}}>
          Astrological Qualification
        </Text>
        <HtmlRender data={teacherData?.astro_qua} />
      </View>
    );
  }

  function educationQualificationInfo() {
    return (
      <View style={{margin: Sizes.fixPadding * 1.5}}>
        <Text style={{...Fonts.black16RobotoRegular}}>
          Educational Qualification
        </Text>
        <HtmlRender data={teacherData?.edu_qua} />
      </View>
    );
  }

  function descriptionInfo() {
    return (
      <View style={{marginHorizontal: Sizes.fixPadding * 1.5}}>
        <Text style={{...Fonts.gray12RobotoRegular}}>
          {teacherData?.short_bio}
        </Text>
      </View>
    );
  }

  function profileInfo() {
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: Sizes.fixPadding * 1.5,
        }}>
        <Image
          source={{uri: img_url_2 + teacherData?.img_url}}
          style={{
            width: SCREEN_WIDTH * 0.2,
            height: SCREEN_WIDTH * 0.2,
            borderRadius: 10000,
          }}
        />
        <Text
          style={{
            ...Fonts.black16RobotoRegular,
            color: Colors.blackLight,
            marginTop: Sizes.fixPadding * 0.5,
          }}>
          {teacherData?.owner_name}
        </Text>
        <Text style={{...Fonts.gray12RobotoRegular}}>
          Experience - {teacherData?.experience} years
        </Text>
      </View>
    );
  }

  function header() {
    return <MyHeader title={'Teacher Details'} navigation={navigation} />;
  }
};

export default TeacherDetails;

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
