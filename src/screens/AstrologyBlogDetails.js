import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import {Colors, Fonts, Sizes} from '../assets/style';
import MyStatusBar from '../components/MyStatusBar';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {SCREEN_WIDTH} from '../config/Screen';
import RenderHTML from 'react-native-render-html';

const AstrologyBlogDetails = ({navigation, route}) => {
  console.log(route?.params)
  const [blogData] = useState(route.params.blogData);
  return (
    <View style={{flex: 1, backgroundColor: Colors.bodyColor}}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      {header()}
      <ScrollView>
        {blogImageInfo()}
        {titleInof()}
        {blogDescriptionInfo()}
      </ScrollView>
    </View>
  );

  function blogDescriptionInfo() {
    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding,
          marginBottom: Sizes.fixPadding * 2,
        }}>
        <RenderHTML
          contentWidth={SCREEN_WIDTH}
          source={{html: blogData?.description.replace(/&lt;/g, '<').replace(/&gt;/g, '>')}}
          enableExperimentalMarginCollapsing={false}
          baseStyle={{
            color: Colors.blackLight,
            textAlign: 'justify',
            fontSize: '14px',
            lineHeight: 20
          }}
        />
      </View>
    );
  }

  function titleInof() {
    return (
      <Text style={{...Fonts.primaryLight18RobotoMedium, margin: Sizes.fixPadding}}>
        {blogData?.title}
      </Text>
    );
  }

  function blogImageInfo() {
    return (
      <Image
        source={{uri: blogData?.blog_icon}}
        style={{width: '100%', height: SCREEN_WIDTH * 0.5}}
      />
    );
  }

  function header() {
    return (
      <View
        style={{
          padding: Sizes.fixPadding * 1.5,
          ...styles.row,
          justifyContent: 'space-between',
          borderBottomWidth: 1,
          borderBottomColor: Colors.grayLight,
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign
            name="leftcircleo"
            color={Colors.primaryLight}
            size={Sizes.fixPadding * 2.2}
          />
        </TouchableOpacity>
        <Text
          numberOfLines={1}
          style={{
            ...Fonts.primaryLight15RobotoMedium,
            textAlign: 'center',
            marginHorizontal: Sizes.fixPadding,
            flex: 1,
          }}>
        
          {blogData?.title}
        </Text>
      </View>
    );
  }
};

export default AstrologyBlogDetails;

const styles = StyleSheet.create({
  row: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
