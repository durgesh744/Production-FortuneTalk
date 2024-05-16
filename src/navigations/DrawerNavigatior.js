import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import React from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import BottomTabs from './BottomTabs';
import { SCREEN_WIDTH} from '../config/Screen';
import {Colors, Fonts, Sizes} from '../assets/style';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {Divider} from '@rneui/themed';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';
import {base_url} from '../config/constants';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = ({drawerProps, userData, wallet, isLogged}) => {
  const navigation = useNavigation();

  const openWhatsApp = phoneNumber => {
    const whatsappUrl = `whatsapp://send?phone=${phoneNumber}`;

    Linking.canOpenURL(whatsappUrl)
      .then(supported => {
        if (supported) {
          return Linking.openURL(whatsappUrl);
        } else {
          console.log('WhatsApp is not installed on the device');
        }
      })
      .catch(error =>
        console.error(
          'An error occurred while trying to open WhatsApp:',
          error,
        ),
      );
  };

  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView
        {...drawerProps}
        showsVerticalScrollIndicator={false}>
        {isLogged && editButtonInfo()}
        {profileImageInfo()}
        {isLogged && nameEmailInfo()}
        {deviderInfo()}
        {isLogged && offerWalletInfo()}
        {isLogged && buttonInfo()}
        {!isLogged && loginInfo()}
      </DrawerContentScrollView>
      {availableOnInfo()}
      {socialIconsInfo()}
    </View>
  );

  function loginInfo() {
    return (
      <View
        style={{margin: Sizes.fixPadding * 2, marginTop: Sizes.fixPadding * 3}}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('login')}
          style={{...styles.row, marginBottom: Sizes.fixPadding * 2}}>
          <Image
            source={require('../assets/images/icons/customer_check.png')}
            style={styles.itemImage}
          />
          <Text style={styles.itemTitle}>Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function editButtonInfo() {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('profile')}
        style={{
          position: 'absolute',
          top: Sizes.fixPadding,
          right: Sizes.fixPadding,
        }}>
        <Image
          source={require('../assets/images/icons/edit.png')}
          style={styles.itemImage}
        />
      </TouchableOpacity>
    );
  }

  function socialIconsInfo() {
    return (
      <View
        style={{
          ...styles.row,
          alignSelf: 'center',
          marginVertical: Sizes.fixPadding * 2,
        }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            Linking.openURL('https://www.facebook.com/fortunetalkofficial/')
          }
          style={styles.socialImage}>
          <Image
            source={require('../assets/images/icons/facebook.png')}
            style={{width: '100%', height: '100%'}}
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            Linking.openURL('https://www.instagram.com/fortune_talk/')
          }
          style={styles.socialImage}>
          <Image
            source={require('../assets/images/icons/instagram.png')}
            style={{width: '100%', height: '100%'}}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialImage}>
          <Image
            source={require('../assets/images/icons/twiter.png')}
            style={{width: '100%', height: '100%'}}
          />
        </TouchableOpacity >
        <TouchableOpacity onPress={() => openWhatsApp(+919911666793)}
        style={styles.socialImage}>
          <Image
            source={require('../assets/images/icons/whatsapp.png')}
            style={{width: '100%', height: '100%'}}
          />
        </TouchableOpacity>
      </View>
    );
  }

  function availableOnInfo() {
    return (
      <View style={{...styles.row, alignSelf: 'center'}}>
        <Divider
          color={Colors.primaryDark}
          width={2}
          orientation={'horizontal'}
          style={{width: 40}}
        />
        <Text
          style={{
            ...Fonts.primaryDark18RobotoMedium,
            marginHorizontal: Sizes.fixPadding,
          }}>
          Available On
        </Text>
        <Divider
          color={Colors.primaryDark}
          width={2}
          orientation={'horizontal'}
          style={{width: 40}}
        />
      </View>
    );
  }

  function buttonInfo() {
    const on_rateus = () => {
      try {
        Linking.openURL(
          'https://play.google.com/store/apps/details?id=com.ksbm.fortunetalk&hl=en&gl=US',
        );
      } catch (e) {
        console.log(e);
      }
    };
    return (
      <View
        style={{margin: Sizes.fixPadding * 2, marginTop: Sizes.fixPadding * 3}}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('home3')}
          style={{...styles.row, marginBottom: Sizes.fixPadding * 2}}>
          <Image
            source={require('../assets/images/icons/home_icon.png')}
            style={styles.itemImage}
          />
          <Text style={styles.itemTitle}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('learn')}
          style={{...styles.row, marginBottom: Sizes.fixPadding * 2}}>
          <Image
            source={require('../assets/images/icons/earnings.png')}
            style={styles.itemImage}
          />
          <Text style={styles.itemTitle}>Learning</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('eCommerce')}
          style={{...styles.row, marginBottom: Sizes.fixPadding * 2}}>
          <Image
            source={require('../assets/images/icons/cart.png')}
            style={styles.itemImage}
          />
          <Text style={styles.itemTitle}>E-Commerce</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('walletHistory', {flag: 1})}
          style={{...styles.row, marginBottom: Sizes.fixPadding * 2}}>
          <Image
            source={require('../assets/images/icons/wallet_1.png')}
            style={styles.itemImage}
          />
          <Text style={styles.itemTitle}>Wallet Transaction</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('history')}
          style={{...styles.row, marginBottom: Sizes.fixPadding * 2}}>
          <Image
            source={require('../assets/images/icons/history.png')}
            style={styles.itemImage}
          />
          <Text style={styles.itemTitle}>Order History</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('astrologyBlogs')}
          style={{...styles.row, marginBottom: Sizes.fixPadding * 2}}>
          <Image
            source={require('../assets/images/icons/computer.png')}
            style={styles.itemImage}
          />
          <Text style={styles.itemTitle}>Astrology Blog</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('freeInsights')}
          style={{...styles.row, marginBottom: Sizes.fixPadding * 2}}>
          <Image
            source={require('../assets/images/icons/planet.png')}
            style={styles.itemImage}
          />
          <Text style={styles.itemTitle}>Free Insights</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('following')}
          style={{...styles.row, marginBottom: Sizes.fixPadding * 2}}>
          <Image
            source={require('../assets/images/icons/customer_check.png')}
            style={styles.itemImage}
          />
          <Text style={styles.itemTitle}>Following</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => on_rateus()}
          style={{...styles.row, marginBottom: Sizes.fixPadding * 2}}>
          <Image
            source={require('../assets/images/icons/star.png')}
            style={styles.itemImage}
          />
          <Text style={styles.itemTitle}>Rate us</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => openWhatsApp(+919911666793)}
          style={{...styles.row, marginBottom: Sizes.fixPadding * 2}}>
          <Image
            source={require('../assets/images/icons/headphone.png')}
            style={styles.itemImage}
          />
          <Text style={styles.itemTitle}>Customer Support Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('astrologerApply')}
          style={{...styles.row, marginBottom: Sizes.fixPadding * 2}}>
          <Image
            source={require('../assets/images/icons/success.png')}
            style={styles.itemImage}
          />
          <Text style={styles.itemTitle}>Apply as an Astrologers</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('settings')}
          style={{...styles.row, marginBottom: Sizes.fixPadding * 2}}>
          <Image
            source={require('../assets/images/icons/setting.png')}
            style={styles.itemImage}
          />
          <Text style={styles.itemTitle}>Settings</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function offerWalletInfo() {
    return (
      <View style={{...styles.row, justifyContent: 'space-evenly'}}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('offerAstrologers')}
          style={{width: '40%', borderRadius: 100, overflow: 'hidden'}}>
          <LinearGradient
            colors={[Colors.primaryLight, Colors.primaryDark]}
            style={{
              ...styles.row,
              width: '100%',
              ...styles.center,
              paddingVertical: Sizes.fixPadding * 0.5,
            }}>
            <Image
              source={require('../assets/images/icons/offers.png')}
              style={{width: 18, height: 18}}
            />
            <Text
              style={{
                ...Fonts.white14RobotoMedium,
                marginLeft: Sizes.fixPadding * 0.8,
              }}>
              Offers
            </Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('wallet', {type: 'wallet'})}
          style={{width: '40%', borderRadius: 100, overflow: 'hidden'}}>
          <LinearGradient
            colors={[Colors.primaryLight, Colors.primaryDark]}
            style={{
              ...styles.row,
              width: '100%',
              ...styles.center,
              paddingVertical: Sizes.fixPadding * 0.5,
            }}>
            <Ionicons name="wallet-outline" color={Colors.white} size={18} />
            <Text
              style={{
                ...Fonts.white14RobotoMedium,
                marginLeft: Sizes.fixPadding * 0.8,
              }}>
              ₹ {wallet}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  function deviderInfo() {
    return (
      <Divider
        orientation="horizontal"
        style={{marginVertical: Sizes.fixPadding}}
      />
    );
  }

  function nameEmailInfo() {
    return (
      <View style={{...styles.center}}>
        <Text style={{...Fonts.black14InterMedium}}>{userData?.username}</Text>
        {userData?.email != 'null' && (
          <Text style={{...Fonts.gray12RobotoMedium}}>{userData?.email}</Text>
        )}
      </View>
    );
  }

  function profileImageInfo() {
    return (
      <LinearGradient
        colors={[Colors.primaryLight, Colors.primaryDark]}
        style={{
          alignSelf: 'center',
          height: SCREEN_WIDTH * 0.28,
          padding: Sizes.fixPadding,
          justifyContent: 'flex-end',
          borderBottomLeftRadius: 1000,
          borderBottomRightRadius: 1000,
          top: -10,
        }}>
        <Image
          source={
            userData?.user_profile_image != null
              ? {uri: base_url + 'admin/' + userData?.user_profile_image}
              : require('../assets/images/users/user1.jpg')
          }
          style={{
            width: SCREEN_WIDTH * 0.17,
            height: SCREEN_WIDTH * 0.17,
            borderRadius: 1000,
            borderWidth: 1,
            borderColor: Colors.white,
            padding: 0,
            margin: 0,
          }}
        />
      </LinearGradient>
    );
  }
};

const DrawerNavigatior = ({navigation, userData, wallet, isLogged}) => {
  return (
    <Drawer.Navigator
      drawerContent={props => (
        <CustomDrawerContent
          drawerProps={props}
          userData={userData}
          wallet={wallet}
          isLogged={isLogged}
        />
      )}
      screenOptions={{
        headerShown: false,
        drawerPosition: 'left',
        drawerStyle: {
          width: SCREEN_WIDTH * 0.85,
          backgroundColor: Colors.grayLight,
          elevation: 10,
          shadowColor: Colors.blackLight,
          borderTopRightRadius: Sizes.fixPadding * 2,
          borderBottomRightRadius: Sizes.fixPadding * 2,
        },
      }}>
      <Drawer.Screen name="home2" component={BottomTabs} />
    </Drawer.Navigator>
  );
};

const mapStateToProps = state => ({
  userData: state.user.userData,
  wallet: state.user.wallet,
  isLogged: state.user.isLogged, 
});

export default connect(mapStateToProps, null)(DrawerNavigatior);

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemImage: {
    width: 20,
    height: 20,
  },
  itemTitle: {
    ...Fonts.grayA14RobotoMedium,
    marginLeft: Sizes.fixPadding,
  },
  socialImage: {
    width: 30,
    height: 30,
    borderRadius: 100,
    overflow: 'hidden',
    marginHorizontal: Sizes.fixPadding * 0.8,
  },
});
