import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import {Colors, Fonts, Sizes} from '../../assets/style';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MyStatusBar from '../../components/MyStatusBar';
import {SCREEN_WIDTH} from '../../config/Screen';
import LinearGradient from 'react-native-linear-gradient';

const TarotReading = ({navigation}) => {
  return (
    <View style={{flex: 1, backgroundColor: Colors.bodyColor}}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      {header()}
      <View style={{flex: 1}}>
        <FlatList
          ListHeaderComponent={
            <>
              {bannerInfo()}
              {oneCardReadingInfo()}
              {threeCardReadingInfo()}
              {loveTarotReadingInfo()}
              {wellnessTarotReadingInfo()}
              {monthlyTarotReadingInfo()}
              {yogaTarotReadingInfo()}
              {yearlyTarotReadingInfo()}
            </>
          }
        />
      </View>
    </View>
  );

  function yearlyTarotReadingInfo(){
    return (
        <TouchableOpacity style={styles.itemContainer}>
          <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/images/tarot/tarot-card_one.png')}
            style={styles.image}
          />
          </View>
          <Text style={styles.itemText}>Yearly Tarot Reading</Text>
          <View style={styles.iconContainer}>
            <AntDesign name="right" color={Colors.blackLight} size={20} />
          </View>
        </TouchableOpacity>
      );
  }

  function yogaTarotReadingInfo(){
    return (
        <TouchableOpacity style={styles.itemContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={require('../../assets/images/tarot/yoga_tarot.png')}
              style={styles.image}
            />
          </View>
          <Text style={styles.itemText}>State of Mind Tarot Reading</Text>
          <View style={styles.iconContainer}>
            <AntDesign name="right" color={Colors.blackLight} size={20} />
          </View>
        </TouchableOpacity>
      );
  }

  function monthlyTarotReadingInfo(){
    return (
        <TouchableOpacity style={styles.itemContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={require('../../assets/images/tarot/monthly_tarot.png')}
              style={styles.image}
            />
          </View>
          <Text style={styles.itemText}>Monthly Tarot Reading</Text>
          <View style={styles.iconContainer}>
            <AntDesign name="right" color={Colors.blackLight} size={20} />
          </View>
        </TouchableOpacity>
      );
  }

  function wellnessTarotReadingInfo(){
    return (
        <TouchableOpacity style={styles.itemContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={require('../../assets/images/tarot/heart_tarot.png')}
              style={styles.image}
            />
          </View>
          <Text style={styles.itemText}>Wellness Tarot Reading</Text>
          <View style={styles.iconContainer}>
            <AntDesign name="right" color={Colors.blackLight} size={20} />
          </View>
        </TouchableOpacity>
      );
  }

  function loveTarotReadingInfo() {
    return (
      <TouchableOpacity style={styles.itemContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/images/tarot/love_tarot.png')}
            style={styles.image}
          />
        </View>
        <Text style={styles.itemText}>Love Tarot Reading</Text>
        <View style={styles.iconContainer}>
          <AntDesign name="right" color={Colors.blackLight} size={20} />
        </View>
      </TouchableOpacity>
    );
  }

  function threeCardReadingInfo() {
    return (
      <TouchableOpacity style={styles.itemContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/images/tarot/three_tarot.png')}
            style={styles.image}
          />
        </View>
        <Text style={styles.itemText}>Three Card Reading</Text>
        <View style={styles.iconContainer}>
          <AntDesign name="right" color={Colors.blackLight} size={20} />
        </View>
      </TouchableOpacity>
    );
  }

  function oneCardReadingInfo() {
    return (
      <TouchableOpacity onPress={()=>navigation.navigate('oneTarotReading')} style={styles.itemContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/images/tarot/tarot-card_one.png')}
            style={styles.image}
          />
        </View>
        <Text style={styles.itemText}>One Card Reading</Text>
        <View style={styles.iconContainer}>
          <AntDesign name="right" color={Colors.blackLight} size={20} />
        </View>
      </TouchableOpacity>
    );
  }

  function bannerInfo() {
    return (
      <Image
        source={require('../../assets/images/tarot/tarot_reading_banner.png')}
        style={{
          width: SCREEN_WIDTH,
          height: SCREEN_WIDTH * 0.57,
          resizeMode: 'contain',
        }}
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
          Tarot Reading
        </Text>
      </View>
    );
  }
};

export default TarotReading;

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
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Sizes.fixPadding * 2,
    paddingVertical: Sizes.fixPadding,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayLight,
  },
  imageContainer: {
    width: SCREEN_WIDTH * 0.14,
    height: SCREEN_WIDTH * 0.14,
    borderWidth: 2,
    padding: Sizes.fixPadding,
    borderColor: Colors.primaryLight,
    borderRadius: 1000,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  itemText: {
    ...Fonts.black14RobotoRegular,
    color: Colors.blackLight,
    marginLeft: Sizes.fixPadding * 2,
  },
  iconContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
});
