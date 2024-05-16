import {View, Text, FlatList, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors, Fonts, Sizes} from '../assets/style';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {TouchableOpacity} from 'react-native';
import MyStatusBar from '../components/MyStatusBar';
import Loader from '../components/Loader';
import axios from 'axios';
import {api_url, blog} from '../config/constants';
import {Image} from 'react-native';
import {SCREEN_WIDTH} from '../config/Screen';
import NoDataFound from '../components/NoDataFound';

const AstrologyBlogs = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [blogData, setBlogData] = useState(null);

  useEffect(() => {
    get_blogs();
  }, []);

  const get_blogs = async () => {
    setIsLoading(false);
    await axios({
      method: 'get',
      url: api_url + blog,
    })
      .then(res => {
        setIsLoading(false);
        setBlogData(res.data.data);
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  return (
    <View style={{flex: 1, backgroundColor: Colors.bodyColor}}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      <Loader visible={isLoading} />
      {header()}
      <View style={{flex: 1}}>
        <FlatList ListHeaderComponent={<>{blogData && blogListInfo()}</>} />
      </View>
    </View>
  );

  function blogListInfo() {
    const renderItem = ({item, index}) => {
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate('astrologyBlogDetails', {blogData: item})
          }
          style={{
            padding: Sizes.fixPadding,
            marginHorizontal: Sizes.fixPadding,
            backgroundColor: Colors.whiteDark,
            marginBottom: Sizes.fixPadding * 2,
            borderRadius: Sizes.fixPadding,
            elevation: 5,
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.2,
            shadowColor: Colors.blackLight,
          }}>
          <Image
            source={{uri: item.blog_icon}}
            style={{
              width: '100%',
              height: SCREEN_WIDTH * 0.4,
              borderTopRightRadius: Sizes.fixPadding,
              borderTopLeftRadius: Sizes.fixPadding,
            }}
          />
          <Text
            numberOfLines={2}
            style={{
              ...Fonts.white18RobotBold,
              fontSize: 14,
              color: Colors.black,
              marginTop: Sizes.fixPadding,
            }}>
            {item.title.replace(/<[^>]*>/g, '')}
          </Text>
        </TouchableOpacity>
      );
    };
    return (
      <View style={{paddingVertical: Sizes.fixPadding}}>
        <FlatList
          data={blogData}
          renderItem={renderItem}
          keyExtractor={item => item.blog_id}
          ListEmptyComponent={<NoDataFound /> }
        />
      </View>
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
          style={{
            ...Fonts.primaryLight15RobotoMedium,
            textAlign: 'center',
            flex: 1,
          }}>
          Astrology Blogs
        </Text>
      </View>
    );
  }
};

export default AstrologyBlogs;

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
