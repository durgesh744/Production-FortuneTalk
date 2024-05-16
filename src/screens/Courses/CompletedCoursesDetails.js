
import {
  View,
  Text,
  FlatList,
  Image,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {Colors, Fonts, Sizes} from '../../assets/style';
import {SCREEN_WIDTH} from '../../config/Screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

const classData = [
  {
    id: 1,
    class_name: 'Class 1',
    title: 'History and The Minor Arcana',
    description:
      'In this module, you will be introduced to the history of tarot, from its origins in ancient Egypt to its most recent adaptations in the 1400s en Europa. Then you will learn about',
    status: 1,
    time: '35',
    next_sessiom: new Date(),
    conected: false,
  },
  {
    id: 2,
    class_name: 'Class 2',
    title: 'History and The Minor Arcana',
    description:
      'In this module, you will be introduced to the history of tarot, from its origins in ancient Egypt to its most recent adaptations in the 1400s en Europa. Then you will learn about',
    status: 1,
    time: '30 - 45',
    next_sessiom: new Date(),
    conected: true,
  },
  {
    id: 3,
    class_name: 'Class 3',
    title: 'History and The Minor Arcana',
    description:
      'In this module, you will be introduced to the history of tarot, from its origins in ancient Egypt to its most recent adaptations in the 1400s en Europa. Then you will learn about',
    status: 1,
    time: '30 - 45',
    next_sessiom: new Date(),
    conected: false,
  },
];

const CompletedCoursesDetails = () => {
  return (
    <View style={{flex: 1, backgroundColor: Colors.bodyColor}}>
      <FlatList
        ListHeaderComponent={
          <>
            {liveVedioInfo()}
            {courseTitleInfo()}
            {courseDescriptionInfo()}
            {classInfo()}
          </>
        }
      />
        {downloadCertificateInfo()}
    </View>
  );

  function downloadCertificateInfo() {
    return (
      <TouchableOpacity style={{
        margin: Sizes.fixPadding*2,
        paddingVertical: Sizes.fixPadding,
        backgroundColor: Colors.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: Sizes.fixPadding*1.5
      }}>
        <Text style={{...Fonts.white14RobotoMedium}}>Download Certificate</Text>
      </TouchableOpacity>
    );
  }

  function classInfo() {
    const renderItem = ({item, index}) => {
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
            flex: 0,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View>
            <Text style={{...Fonts.primaryLight14RobotoMedium}}>
              {item.class_name}
              {item.status != 1 && (
                <Text style={{...Fonts.gray12RobotoMedium}}>
                  {'  '}({item.time} min)
                </Text>
              )}
            </Text>
            <Text style={{...Fonts.gray16RobotoMedium, fontSize: 15}}>
              {item.title}
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
              Next Session at 10 October (10 am)
            </Text>
          )}
        </View>
      </View>
      );
    };
    return (
      <FlatList
        data={classData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
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
          Comes with sal jade CERTIFICATE OF COMPLETION FROM THE ACCREDITED
          COLLEGE: THE PSYCHIC HEALING ACADEMY Also features free monthly bonus
          Tarot seminars educational announcements tarot readings
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
          Master your Psychic Ability and Learn to Give Accurate{' '}
        </Text>
      </View>
    );
  }

  function liveVedioInfo() {
    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 2,
          marginTop: Sizes.fixPadding,
          borderRadius: Sizes.fixPadding,
          overflow: 'hidden',
        }}>
        <ImageBackground
          source={require('../../assets/images/users/user1.jpg')}
          style={{
            width: '100%',
            height: SCREEN_WIDTH * 0.55,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={require('../../assets/images/icons/vedio_play.png')}
            style={{width: 40, height: 40}}
          />
        </ImageBackground>
      </View>
    );
  }
}

export default CompletedCoursesDetails