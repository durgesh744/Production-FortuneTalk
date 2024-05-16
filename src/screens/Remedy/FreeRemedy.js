import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors, Fonts, Sizes} from '../../assets/style';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MyStatusBar from '../../components/MyStatusBar';
import Carousel from 'react-native-reanimated-carousel';
import {SCREEN_WIDTH} from '../../config/Screen';
import {initialUpdaterRun, useSharedValue} from 'react-native-reanimated';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import { api_url, remedy_list } from '../../config/constants';
import Loader from '../../components/Loader';

const astrologerData = [
  {
    id: 1,
    name: 'Soniya Ji',
    image: require('../../assets/images/users/user1.jpg'),
  },
  {
    id: 2,
    name: 'Guru Ji',
    image: require('../../assets/images/users/user2.jpg'),
  },
  {
    id: 3,
    name: 'Revati Ji',
    image: require('../../assets/images/users/user3.jpg'),
  },
  {
    id: 4,
    name: 'Guru Ji',
    image: require('../../assets/images/users/user4.jpg'),
  },
];

const FreeRemedy = ({navigation, route}) => {
  const progressValue = useSharedValue(0);
  const [state, setState] = useState({
    paginationIndex: 0,
    isLoading: false,
    remedyData: null
  });

  useEffect(()=>{
    get_remedy()
  }, [])


  // useEffect(() => {}, [paginationIndex]);

  const get_remedy = async()=>{
    updateState({isLoading: true})
    await axios({
      method: 'post',
      url: api_url + remedy_list,
      headers: {
        'Content-Type':'multipart/form-data'
      },
      data:{
        remedy_id: route?.params?.remedy_id
      }
    }).then(res=>{
      updateState({isLoading: false})
      if(res.data.status){
        updateState({remedyData: res.data.data[0]})
      }
      // console.log(res.data)
    }).catch(err=>{
      updateState({isLoading: false})
      console.log(err)
    })
  }

  const updateState = data => {
    setState(prevState => {
      const newData = {...prevState, ...data};
      return newData;
    });
  };

  const {paginationIndex, isLoading, remedyData} = state;

  return (
    <View style={{flex: 1, backgroundColor: Colors.bodyColor}}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      <Loader visible={isLoading} />
      <View style={{flex: 1}}>
        {header()}
        <FlatList
          ListHeaderComponent={
            <>
              {remedyData && bannerInfo()}
              {/* {renderPagination()} */}
              {remedyData && remediesInfo()}
              {/* {problemInfo()}
              {aboutInfo()}
              {howUseInfo()} */}
              {/* {continueButtonInfo()} */}
            </>
          }
          contentContainerStyle={{paddingVertical: Sizes.fixPadding}}
        />
      </View>
    </View>
  );


  function remediesInfo() {
    return (
      <View
        style={{
          padding: Sizes.fixPadding * 1.5,
          borderBottomWidth: 1,
          borderBottomColor: Colors.grayLight,
        }}>
        <Text style={{...Fonts.primaryLight18RobotoMedium}}>{remedyData?.product_name}</Text>
        <Text
          style={{
            ...Fonts.gray14RobotoMedium,
            fontSize: 13,
            marginVertical: Sizes.fixPadding * 0.7,
          }}>
          {remedyData?.des}
        </Text>
      </View>
    );
  }

  function renderPagination() {
    return (
      <View style={styles.paginationContainer}>
        {astrologerData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              {
                backgroundColor:
                  paginationIndex === index
                    ? Colors.blackLight
                    : Colors.grayDark + '70',
              },
            ]}
          />
        ))}
      </View>
    );
  }

  function bannerInfo() {
    const baseOptions = {
      vertical: false,
      width: SCREEN_WIDTH,
      height: SCREEN_WIDTH * 0.4,
    };

    const renderItem = ({index}) => {
      return (
        <View
          style={{
            width: SCREEN_WIDTH * 0.8,
            height: SCREEN_WIDTH * 0.4,
            backgroundColor: Colors.whiteColor,
            borderRadius: Sizes.fixPadding * 2,
            alignSelf: 'center',
          }}>
          <Image
            source={{uri: api_url + 'uploads/images/img/' + remedyData?.images[index].image}}
            resizeMode="cover"
            style={{
              width: '100%',
              height: '100%',
              borderRadius: Sizes.fixPadding,
            }}
          />
        </View>
      );
    };

    return (
      <SafeAreaView edges={['bottom']} style={{flex: 1}}>
        <Carousel
          {...baseOptions}
          loop
          testID={'xxx'}
          style={{
            width: '100%',
            borderBottomColor: Colors.grayLight,
            paddingHorizontal: Sizes.fixPadding,
          }}
          autoPlay={true}
          autoPlayInterval={4000}
          onProgressChange={(_, absoluteProgress) => {
            progressValue.value = absoluteProgress;
          }}
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: 1,
            parallaxScrollingOffset: 60,
          }}
          data={remedyData?.images}
          pagingEnabled={true}
          onSnapToItem={index => {
            updateState({paginationIndex: index});
          }}
          renderItem={renderItem}
        />
      </SafeAreaView>
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
        <TouchableOpacity
          onPress={() => navigation.pop()}>
          <AntDesign
            name="leftcircleo"
            color={Colors.primaryLight}
            size={Sizes.fixPadding * 2.2}
          />
        </TouchableOpacity>
        <Text
          style={{
            ...Fonts.primaryLight15RobotoMedium,
            fontSize: 16,
            textAlign: 'center',
            flex: 1,
          }}>
          Free Remedy
        </Text>
      </View>
    );
  }
};

export default FreeRemedy; 

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
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayLight,
    paddingVertical: Sizes.fixPadding,
  },
  paginationDot: {
    width: 12,
    height: 2,
    borderRadius: 5,
    margin: 5,
  },
});
