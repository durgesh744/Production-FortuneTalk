import {View, Text, FlatList, StyleSheet, Alert} from 'react-native';
import React from 'react';
import {Colors, Fonts, Sizes} from '../assets/style';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {TouchableOpacity} from 'react-native';
import MyStatusBar from '../components/MyStatusBar';
import {Switch} from 'react-native-switch';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import {api2_logout, api_url} from '../config/constants';
import {connect} from 'react-redux';
import * as UserActions from '../redux/actions/UserActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CommonActions} from '@react-navigation/native';
import {LoginManager} from 'react-native-fbsdk-next';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import NewGift from '../components/Live/NewGift';

const Settings = ({navigation, userData, dispatch}) => {
  const logout = async () => {
    if (userData == null) {
      go_login();
    } else {
      await axios({
        method: 'post',
        url: api_url + api2_logout,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: {
          user_id: userData?.id,
        },
      })
        .then(async res => {
          if (res.data.status) {
            await AsyncStorage.clear();
            LoginManager.logOut();
            google_logout();
            dispatch(UserActions.setCleanStore());
            go_login();
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  const google_logout = async () => {
    await GoogleSignin.signOut().catch(err => console.log(err));
  };

  const go_login = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'login'}],
      }),
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: Colors.bodyColor}}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      <View style={{flex: 1}}>
        <FlatList
          ListHeaderComponent={
            <>
              {header()}
              {/* {darkModeInfo()} */}
              {/* {NotificationInfo()} */}
              {/* {privacyInfo()} */}
              {/* {privacyManageInfo()} */}
              {TermsInfo()}
              {privacyPolicyInfo()}
              {deleteAccountInfo()}
              {logountInfo()}
            </>
          }
        />
      </View>
    </View>
  );

  function logountInfo() {
    const on_logout = () => {
      Alert.alert('Alert!', 'Are your sure want to log out?', [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: logout,
        },
      ]);
    };

    return (
      <TouchableOpacity
        onPress={() => on_logout()}
        style={{alignSelf: 'center', marginVertical: Sizes.fixPadding}}>
        <LinearGradient
          colors={[Colors.primaryLight, Colors.primaryDark]}
          style={[
            styles.row,
            {padding: Sizes.fixPadding, borderRadius: Sizes.fixPadding},
          ]}>
          <MaterialIcons name="logout" color={Colors.white} size={25} />
          <Text
            style={{
              ...Fonts.white16RobotoMedium,
              marginLeft: Sizes.fixPadding * 0.5,
            }}>
            Log Out
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  function deleteAccountInfo() {
    const on_logout = () => {
      Alert.alert('Alert!', 'Are your sure want to delete your account?', [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: logout,
        },
      ]);
    };
    return (
      <TouchableOpacity
        onPress={() => on_logout()}
        style={[
          styles.darkContainer,
          {marginVertical: 0, marginBottom: Sizes.fixPadding},
        ]}>
        <Text style={{...Fonts.blackLight16RobotoMedium, color: Colors.red}}>
          Delete Account
        </Text>
      </TouchableOpacity>
    );
  }

  function privacyPolicyInfo() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate('privacy')}
        style={[
          styles.darkContainer,
          {marginVertical: 0, marginBottom: Sizes.fixPadding},
        ]}>
        <Text style={{...Fonts.blackLight16RobotoMedium}}>Privacy Policy</Text>
      </TouchableOpacity>
    );
  }

  function TermsInfo() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate('terms')}
        style={[
          styles.darkContainer,
          {marginVertical: Sizes.fixPadding*1, marginBottom: Sizes.fixPadding},
        ]}>
        <Text style={{...Fonts.blackLight16RobotoMedium}}>
          Terms and Conditions
        </Text>
      </TouchableOpacity>
    );
  }

  function privacyManageInfo() {
    return (
      <TouchableOpacity
        style={[
          styles.darkContainer,
          {marginVertical: 0, marginBottom: Sizes.fixPadding},
        ]}>
        <Text style={{...Fonts.blackLight16RobotoMedium}}>
          Manage your Privacy
        </Text>
      </TouchableOpacity>
    );
  }

  function privacyInfo() {
    return (
      <View
        style={[
          styles.darkContainer,
          {marginVertical: 0, marginBottom: Sizes.fixPadding},
        ]}>
        <Text
          style={{
            ...Fonts.blackLight16RobotoMedium,
            marginBottom: Sizes.fixPadding * 0.5,
          }}>
          Privacy
        </Text>
        <View
          style={[
            styles.row,
            {justifyContent: 'space-between', marginBottom: Sizes.fixPadding},
          ]}>
          <Text style={{...Fonts.blackLight14RobotoRegular}}>
            Show my name in reviews section of astrologer's profile
          </Text>
          <View style={styles.switchContainer}>
            <Switch
              value={true}
              renderActiveText={false}
              renderInActiveText={false}
              circleBorderWidth={4}
              circleSize={20}
              circleBorderActiveColor={Colors.primaryLight}
              backgroundActive={Colors.primaryLight}
              backgroundInactive={Colors.white}
              circleBorderInactiveColor={Colors.grayLight}
            />
          </View>
        </View>
      </View>
    );
  }

  function NotificationInfo() {
    return (
      <View
        style={[
          styles.darkContainer,
          {
            marginVertical: 0,
            marginBottom: Sizes.fixPadding,
            marginTop: Sizes.fixPadding,
          },
        ]}>
        <Text
          style={{
            ...Fonts.blackLight16RobotoMedium,
            marginBottom: Sizes.fixPadding * 0.6,
          }}>
          Notifications
        </Text>
        <View
          style={[
            styles.row,
            {justifyContent: 'space-between', marginBottom: Sizes.fixPadding},
          ]}>
          <Text style={{...Fonts.blackLight14RobotoRegular}}>Status</Text>
          <View style={styles.switchContainer}>
            <Switch
              value={true}
              renderActiveText={false}
              renderInActiveText={false}
              circleBorderWidth={4}
              circleSize={20}
              circleBorderActiveColor={Colors.primaryLight}
              backgroundActive={Colors.primaryLight}
              backgroundInactive={Colors.white}
              circleBorderInactiveColor={Colors.grayLight}
            />
          </View>
        </View>
        {/* <View
          style={[
            styles.row,
            {justifyContent: 'space-between', marginBottom: Sizes.fixPadding},
          ]}>
          <Text style={{...Fonts.blackLight14RobotoRegular}}>Live Events</Text>
          <View style={styles.switchContainer}>
            <Switch
              value={false}
              renderActiveText={false}
              renderInActiveText={false}
              circleBorderWidth={4}
              circleSize={20}
              circleBorderActiveColor={Colors.primaryLight}
              backgroundActive={Colors.primaryLight}
              backgroundInactive={Colors.white}
              circleBorderInactiveColor={Colors.grayLight}
            />
          </View>
        </View>
        <View
          style={[
            styles.row,
            {justifyContent: 'space-between', marginBottom: Sizes.fixPadding},
          ]}>
          <Text style={{...Fonts.blackLight14RobotoRegular}}>Astromail</Text>
          <View style={styles.switchContainer}>
            <Switch
              value={false}
              renderActiveText={false}
              renderInActiveText={false}
              circleBorderWidth={4}
              circleSize={20}
              circleBorderActiveColor={Colors.primaryLight}
              backgroundActive={Colors.primaryLight}
              backgroundInactive={Colors.white}
              circleBorderInactiveColor={Colors.grayLight}
            />
          </View>
        </View> */}
      </View>
    );
  }

  function darkModeInfo() {
    return (
      <View
        style={[
          styles.row,
          styles.darkContainer,
          {marginBottom: Sizes.fixPadding},
        ]}>
        <Text style={{...Fonts.blackLight16RobotoMedium}}>Dark Mode</Text>
        <View style={styles.switchContainer}>
          <Switch
            value={false}
            renderActiveText={false}
            renderInActiveText={false}
            circleBorderWidth={4}
            circleSize={20}
            circleBorderActiveColor={Colors.primaryLight}
            backgroundActive={Colors.primaryLight}
            backgroundInactive={Colors.white}
            circleBorderInactiveColor={Colors.grayLight}
          />
        </View>
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
          Settings
        </Text>
      </View>
    );
  }
};

const mapStateToProps = state => ({
  userData: state.user.userData,
});

const mapDispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);

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
  darkContainer: {
    justifyContent: 'space-between',
    padding: Sizes.fixPadding * 1.5,
    backgroundColor: Colors.whiteDark,
    marginVertical: Sizes.fixPadding * 2,
    marginHorizontal: Sizes.fixPadding * 1.5,
    borderRadius: Sizes.fixPadding * 1.5,
    borderWidth: 1,
    borderColor: Colors.grayLight,
    elevation: 3,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowColor: Colors.grayLight,
  },
  switchContainer: {
    backgroundColor: Colors.white,
    borderRadius: 30,
    elevation: 2,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowColor: Colors.gray,
  },
});
