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
import {useSharedValue} from 'react-native-reanimated';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

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

const ViewRemedy = ({navigation}) => {
  const progressValue = useSharedValue(0);
  const [state, setState] = useState({
    paginationIndex: 0,
  });
  useEffect(() => {}, [paginationIndex]);

  const updateState = data => {
    setState(prevState => {
      const newData = {...prevState, ...data};
      return newData;
    });
  };

  const {paginationIndex} = state;

  return (
    <View style={{flex: 1, backgroundColor: Colors.bodyColor}}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      <View style={{flex: 1}}>
        {header()}
        <FlatList
          ListHeaderComponent={
            <>
              {bannerInfo()}
              {renderPagination()}
              {remediesInfo()}
              {problemInfo()}
              {aboutInfo()}
              {howUseInfo()}
              {continueButtonInfo()}
            </>
          }
          contentContainerStyle={{paddingVertical: Sizes.fixPadding}}
        />
      </View>
    </View>
  );

  function continueButtonInfo() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={{
          marginHorizontal: Sizes.fixPadding * 6,
          marginVertical: Sizes.fixPadding,
          borderRadius: 1000,
          overflow: 'hidden',
        }}>
        <LinearGradient
          colors={[Colors.primaryLight, Colors.primaryDark]}
          style={{paddingVertical: Sizes.fixPadding*1.2}}>
          <Text style={{...Fonts.white18RobotMedium, textAlign: 'center'}}>
            Book Now
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  function howUseInfo(){
    return (
        <View
          style={{
            padding: Sizes.fixPadding * 1.5,
            // borderBottomWidth: 1,
            // borderBottomColor: Colors.grayLight,
          }}>
          <Text style={{...Fonts.black18RobotoMedium, color: Colors.blackLight}}>
          How to use this Product
          </Text>
          <Text
            style={{
              ...Fonts.gray14RobotoMedium,
              marginVertical: Sizes.fixPadding * 0.7,
            }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum
            dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit
            amet, consectetur adipiscing elit consectetur adipiscing elitipsum
            dolor sit ametLorem ipsum dolor sit amet, Lorem ipsum dolor sit amet,
            consectetur adipiscing elitconsectetur adipiscing elit
          </Text>
        </View>
      );
  }

  function aboutInfo() {
    return (
      <View
        style={{
          padding: Sizes.fixPadding * 1.5,
          borderBottomWidth: 1,
          borderBottomColor: Colors.grayLight,
        }}>
        <Text style={{...Fonts.black18RobotoMedium, color: Colors.blackLight}}>
        About the Product
        </Text>
        <Text
          style={{
            ...Fonts.gray14RobotoMedium,
            marginVertical: Sizes.fixPadding * 0.7,
          }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum
          dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit
          amet, consectetur adipiscing elit consectetur adipiscing elitipsum
          dolor sit ametLorem ipsum dolor sit amet, Lorem ipsum dolor sit amet,
          consectetur adipiscing elitconsectetur adipiscing elit
        </Text>
      </View>
    );
  }

  function problemInfo() {
    return (
      <View
        style={{
          padding: Sizes.fixPadding * 1.5,
          borderBottomWidth: 1,
          borderBottomColor: Colors.grayLight,
        }}>
        <Text style={{...Fonts.black18RobotoMedium, color: Colors.blackLight}}>
          Problems you are facing
        </Text>
        <Text
          style={{
            ...Fonts.gray14RobotoMedium,
            marginVertical: Sizes.fixPadding * 0.7,
          }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </Text>
      </View>
    );
  }

  function remediesInfo() {
    return (
      <View
        style={{
          padding: Sizes.fixPadding * 1.5,
          borderBottomWidth: 1,
          borderBottomColor: Colors.grayLight,
        }}>
        <Text style={{...Fonts.primaryLight18RobotoMedium}}>Gemstone</Text>
        <Text
          style={{
            ...Fonts.gray14RobotoMedium,
            fontSize: 13,
            marginVertical: Sizes.fixPadding * 0.7,
          }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </Text>
        <Text style={{...Fonts.black16RobotoMedium}}>
          ₹ 4750{' '}
          <Text
            style={{
              ...Fonts.gray16RobotoMedium,
              textDecorationLine: 'line-through',
            }}>
            {' '}
            7500{' '}
          </Text>{' '}
          <Text style={{...Fonts.white14RobotoMedium, color: Colors.red}}>
            20% Off
          </Text>
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
      height: SCREEN_WIDTH * 0.7,
    };

    const renderItem = ({index}) => {
      return (
        <View
          style={{
            width: SCREEN_WIDTH * 0.8,
            height: SCREEN_WIDTH * 0.8,
            backgroundColor: Colors.whiteColor,
            borderRadius: Sizes.fixPadding * 2,
            alignSelf: 'center',
          }}>
          <Image
            source={astrologerData[index].image}
            resizeMode="cover"
            style={{
              width: '100%',
              height: '100%',
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
            parallaxScrollingScale: 0.85,
            parallaxScrollingOffset: 112,
          }}
          data={astrologerData}
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
          onPress={() => navigation.goBack()}
          style={{position: 'absolute', zIndex: 99, padding: Sizes.fixPadding * 1.5}}>
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
          Remedies
        </Text>
      </View>
    );
  }
};

export default ViewRemedy;

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
