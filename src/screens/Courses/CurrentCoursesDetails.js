import {
  View,
  Text,
  FlatList,
  Image,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {Colors, Fonts, Sizes} from '../../assets/style';
import {SCREEN_WIDTH} from '../../config/Screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import Video from '../../components/Courses/Video';
import {base_url} from '../../config/constants';
import moment from 'moment';
import { connect } from 'react-redux';
import { MyMethods } from '../../methods/my_methods';

const CurrentCoursesDetails = ({navigation, route, userData}) => {
  const [liveData] = useState(route?.params?.data);
  return (
    <View style={{flex: 1, backgroundColor: Colors.bodyColor}}>
      <FlatList
        ListHeaderComponent={
          <>
            {liveVedioInfo()}
            {courseTitleInfo()}
            {courseDescriptionInfo()}
            {classInfo()}
            {submitTestInfo()}
            {questionPaperDownloadInfo()}
          </>
        }
      />
    </View>
  );

  function questionPaperDownloadInfo() {
    return (
      <TouchableOpacity
        style={{
          margin: Sizes.fixPadding * 2,
          padding: Sizes.fixPadding,
          backgroundColor: Colors.white,
          elevation: 5,
          shadowColor: Colors.blackLight,
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.2,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          borderRadius: Sizes.fixPadding,
        }}>
        <Image
          source={require('../../assets/images/icons/download_question.png')}
          style={{width: 25, height: 25, resizeMode: 'contain'}}
        />
        <Text
          style={{...Fonts.gray14RobotoMedium, marginLeft: Sizes.fixPadding}}>
          Download a Question Paper here
        </Text>
      </TouchableOpacity>
    );
  }

  function submitTestInfo() {
    return (
      <View
        style={{
          paddingVertical: Sizes.fixPadding,
          paddingHorizontal: Sizes.fixPadding * 2,
          borderBottomWidth: 1,
          borderBottomColor: Colors.grayLight,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View style={{flex: 0.7, flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={require('../../assets/images/icons/document.png')}
              style={{width: 30, height: 30}}
            />
            <Text
              style={{
                ...Fonts.black18RobotoRegular,
                marginLeft: Sizes.fixPadding,
              }}>
              Submit your test given to here by 12 October
            </Text>
          </View>
          <Image
            source={require('../../assets/images/icons/upload_document.png')}
            style={{width: 30, height: 30}}
          />
        </View>
      </View>
    );
  }

  function classInfo() {
    const renderItem = ({item, index}) => {
      console.log(item)
      const isToday = MyMethods.check_current_day({date: item.start_date});
      return (
        <>
          <View
            style={{
              paddingVertical: Sizes.fixPadding,
              paddingHorizontal: Sizes.fixPadding * 2,
              borderBottomWidth: 1,
              borderBottomColor: Colors.grayLight,
            }}>
            <View
              style={{
                flex: 0,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View>
                <Text style={{...Fonts.primaryLight14RobotoMedium}}>
                  Class {index + 1}
                  {item.status != 1 && (
                    <Text style={{...Fonts.gray12RobotoMedium}}>
                      {'  '}({item.time_session_duration} min)
                    </Text>
                  )}
                </Text>
                <Text style={{...Fonts.gray16RobotoMedium, fontSize: 15}}>
                  {item.class_name}
                </Text>
              </View>
              {item.status == 1 ? (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text
                    style={{
                      ...Fonts.gray11RobotoRegular,
                      marginRight: Sizes.fixPadding * 0.2,
                    }}>
                    Completed
                  </Text>
                  <Ionicons
                    name="checkmark-circle"
                    color={Colors.blackLight}
                    size={20}
                  />
                </View>
              ) : (
                <TouchableOpacity
                  style={{justifyContent: 'center', alignItems: 'center'}}>
                  <Ionicons
                    name="play-circle"
                    color={Colors.primaryLight}
                    size={22}
                  />
                  <Text
                    style={{...Fonts.primaryLight14RobotoMedium, fontSize: 12}}>
                    Join
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <Text
              style={{
                ...Fonts.gray12RobotoMedium,
                marginTop: Sizes.fixPadding * 0.6,
              }}>
              {item.description}
            </Text>
            <View style={{alignSelf: 'flex-end'}}>
              {item.status == 1 ? (
                <Text style={{...Fonts.gray12RobotoRegular}}>
                  ({item.time} min Video){' '}
                  <Text style={{color: Colors.primaryLight, fontSize: 11}}>
                    Watch Again <MaterialIcons name="refresh" />
                  </Text>
                </Text>
              ) : (
                <Text style={{...Fonts.primaryDark11InterMedium}}>
                  Next Session at {moment(item?.start_date).format('DD MMMM')} ({moment(item?.start_time).format('hh A')})
                </Text>
              )}
            </View>
          </View>
          {item.status != 1 && isToday && (
            <TouchableOpacity
              activeOpacity={0.8}
              disabled={item?.is_live == 0}
              onPress={() => navigation.navigate('liveNow', {
                liveID: liveData?.unique_id,
                userID: userData?.id,
                userName: userData?.username,
              })}>
              <LinearGradient
                colors={item?.is_live == 0 ? [Colors.grayLight, Colors.gray]: [Colors.primaryLight, Colors.primaryDark]}
                style={{paddingVertical: Sizes.fixPadding * 1.5}}>
                <Text
                  style={{...Fonts.white18RobotMedium, textAlign: 'center'}}>
                  Connect to Class {index+1} Now
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </>
      );
    };
    return (
      <FlatList data={liveData?.course_live_tbl} renderItem={renderItem} />
    );
  }

  function courseDescriptionInfo() {
    return (
      <View
        style={{
          padding: Sizes.fixPadding * 2,
          paddingTop: Sizes.fixPadding,
          borderBottomWidth: 1,
          borderBottomColor: Colors.grayLight,
        }}>
        <Text style={{...Fonts.gray12RobotoRegular}}>
          {liveData?.description}
        </Text>
      </View>
    );
  }

  function courseTitleInfo() {
    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 2,
          marginTop: Sizes.fixPadding * 2,
        }}>
        <Text style={{...Fonts.primaryLight14RobotoRegular}}>
          {liveData?.course_name}
        </Text>
      </View>
    );
  }

  function liveVedioInfo() {
    return <Video uri={base_url + liveData?.video[0]?.video} />;
  }
};

const mapStateToProps = state => ({
  userData: state.user.userData,
  wallet: state.user.wallet,
});

export default connect(mapStateToProps, null)(CurrentCoursesDetails);
