import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors, Fonts, Sizes} from '../../assets/style';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MyStatusBar from '../../components/MyStatusBar';
import {SCREEN_WIDTH} from '../../config/Screen';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import {api2_my_kundali, api_url} from '../../config/constants';
import {connect} from 'react-redux';
import moment from 'moment';
import Loader from '../../components/Loader';
import NoDataFound from '../../components/NoDataFound';

const KundliList = ({navigation, customerData}) => {
  const [state, setState] = useState({
    kundliListData: null,
    isLoading: false,
  });

  useEffect(() => {
    get_kundli();
  }, []);

  const get_kundli = async () => {
    updateState({isLoading: true});
    await axios({
      method: 'post',
      url: api_url + api2_my_kundali,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        user_id: customerData.id,
      },
    })
      .then(res => {
        updateState({isLoading: false});
        updateState({kundliListData: res.data.kudali});
      })
      .catch(err => {
        updateState({isLoading: false});
        console.log(err);
      });
  };
  const updateState = data => {
    setState(prevState => {
      const newData = {...prevState, ...data};
      return newData;
    });
  };

  const {kundliListData, isLoading} = state;

  return (
    <View style={{flex: 1, backgroundColor: Colors.bodyColor}}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      <Loader visible={isLoading} />
      {header()}
      <View style={{flex: 1}}>
        <FlatList
          ListHeaderComponent={<>{kundliListData && showKundliInfo()}</>}
        />
      </View>
    </View>
  );

  function showKundliInfo() {
    const renderItem = ({item, index}) => {
      console.log(item)
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            // navigation.navigate('kundliDetailes', {kundliData: item})
            navigation.navigate('kundliCategory', {Cname: item?.customer_name, kundli_id: item.kundali_id, place: item.place})
          }
          style={{
            backgroundColor: Colors.whiteDark,
            padding: Sizes.fixPadding,
            marginBottom: Sizes.fixPadding * 2,
            borderRadius: Sizes.fixPadding,
          }}>
          <View style={[styles.row, {alignItems: 'flex-start'}]}>
            <Image
              source={
                item.gender == 'male'
                  ? require('../../assets/images/icons/male_kundli.png')
                  : require('../../assets/images/icons/female_kundli.png')
              }
              style={{
                width: SCREEN_WIDTH * 0.14,
                height: SCREEN_WIDTH * 0.14,
                borderRadius: 1000,
                resizeMode: 'contain',
                borderWidth: 1,
                borderColor: Colors.primaryLight,
              }}
            />
            <View style={{marginLeft: Sizes.fixPadding}}>
              <Text style={{...Fonts.primaryDark16RobotoMedium}}>
                {item?.customer_name}
              </Text>
              <Text
                style={{
                  ...Fonts.black14RobotoRegular,
                  textTransform: 'capitalize',
                }}>
                Gender: {item.gender}
              </Text>
              <Text style={{...Fonts.black14RobotoRegular}}>
                Dob: {moment(item.dob).format('Do MMM YYYY')}{' '}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    };
    return (
      <View style={{margin: Sizes.fixPadding * 2}}>
        <FlatList
          data={kundliListData}
          renderItem={renderItem}
          keyExtractor={item => item.kundali_id}
          ListEmptyComponent={<NoDataFound />}
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
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{position: 'absolute', padding: Sizes.fixPadding * 1.5}}>
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
          My Kundli
        </Text>
      </View>
    );
  }
};

const mapStateToProps = state => ({
  customerData: state.user.userData,
});

export default connect(mapStateToProps, null)(KundliList);

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
