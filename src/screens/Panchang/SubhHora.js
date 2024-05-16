import {StyleSheet, Text, View, FlatList, TextInput} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Colors, Sizes, Fonts} from '../../assets/style';
import MyStatusBar from '../../components/MyStatusBar';
import axios from 'axios';
import {api_url, api2_get_subh_hora} from '../../config/constants';
import DateFilter from './DateFilter';
import { connect } from 'react-redux';
import moment from 'moment';
import Geolocation from 'react-native-geolocation-service';

const SubhHora = ({panchangData,panchangDataNew,currentLocation}) => {
  const [data, setData] = useState('');
  const [refresh,setRefresh] = useState(false);

  useEffect(() => {
    get_subh_hora();
  }, []);

  console.log("This subh hora detail==++==",currentLocation)

  if(refresh){

    const get_subh_hora1 = async () => {
      await axios({
        method: 'post',
        url: api_url + api2_get_subh_hora,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: {
          date :  moment(new Date()).format('DD/MM/YYYY'),
          latitude: currentLocation.lat,
          longitude:currentLocation.long,
        },
      })
        .then(res => {
          console.log('SubhHora==============>', res.data);
          setData(res.data.hora.day);
        })
        .catch(err => {
          console.log(err);
        });
    };
    get_subh_hora1();
  }

  const get_subh_hora = async () => {
    await axios({
      method: 'post',
      url: api_url + api2_get_subh_hora,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        date :  new Date(),
        latitude: 28.4563,
        longitude: 78.5241,
      },
    })
      .then(res => {
        console.log('SubhHora==============>', res.data);
        setData(res.data.hora.day);
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <View style={{flex: 1, backgroundColor: Colors.bodyColor}}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      <View
        style={{
          flex: 1,
          paddingHorizontal: Sizes.fixPadding * 2,
          paddingVertical: Sizes.fixPadding * 2,
        }}>
        <FlatList
          ListHeaderComponent={
            <>
              {searchBar()}
              {status()}
              {subhHoraData()}
            </>
          }
        />
      </View>
    </View>
  );

  function searchBar() {
    return (
      <DateFilter refresh={refresh} setRefresh={setRefresh}/>
    );
  }


  function status() {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: Sizes.fixPadding * 2,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '30%',
          }}>
          <View
            style={{
              width: Sizes.fixPadding * 2,
              height: Sizes.fixPadding * 2,
              borderRadius: Sizes.fixPadding * 2,
              backgroundColor: Colors.greenDark,
            }}
          />
          <Text style={{...Fonts.gray14RobotoMedium}}>Position</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '30%',
          }}>
          <View
            style={{
              width: Sizes.fixPadding * 2,
              height: Sizes.fixPadding * 2,
              borderRadius: Sizes.fixPadding * 2,
              backgroundColor: Colors.blueFacebook,
            }}
          />
          <Text style={{...Fonts.gray14RobotoMedium}}>Neutral</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '30%',
          }}>
          <View
            style={{
              width: Sizes.fixPadding * 2,
              height: Sizes.fixPadding * 2,
              borderRadius: Sizes.fixPadding * 2,
              backgroundColor: Colors.primaryDark,
            }}
          />
          <Text style={{...Fonts.gray14RobotoMedium}}>Negative</Text>
        </View>
      </View>
    );
  }

  function subhHoraData() {
    const renderItem = ({item, index}) => {
      return (
        <View style={styles.panchangItems}>
          <Text style={styles.panchangMainText}>{item.hora}</Text>
          <Text style={styles.panchangSubText}>{item.time}</Text>
        </View>
      );
    };
    return (
      <View
        style={{
          marginVertical: Sizes.fixPadding * 2,
          backgroundColor: Colors.whiteDark,
          borderRadius: Sizes.fixPadding,
        }}>
        <FlatList data={data} renderItem={renderItem} key={item => item} />
      </View>
    );
  }
};


const mapStateToProps = state =>({
  panchangData: state.kundli.panchangData,
  panchangDataNew: state.kundli.panchangDataNew,
  currentLocation: state.kundli.currentLatLong,
})

export default connect(mapStateToProps, null)(SubhHora);

const styles = StyleSheet.create({
  panchangItems: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayLight,
    marginHorizontal: Sizes.fixPadding,
  },
  panchangMainText: {
    padding: Sizes.fixPadding,
    ...Fonts.gray16RobotoMedium,
    color: Colors.blackLight,
    width: '50%',
    borderRightWidth: 1,
    borderRightColor: Colors.grayLight,
  },
  panchangSubText: {
    padding: Sizes.fixPadding,
    ...Fonts.gray14RobotoMedium,
    color: Colors.blackLight,
    width: '50%',
    textAlign: 'right',
  },
});
