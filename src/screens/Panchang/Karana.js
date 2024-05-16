import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import React from 'react';
import {Colors, Sizes, Fonts} from '../../assets/style';
import MyStatusBar from '../../components/MyStatusBar';
import {api_url, api2_get_chaughadiya, advanced_panchang} from '../../config/constants';
import DateFilter from './DateFilter';
import { connect } from 'react-redux';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Karana = ({panchangData,panchangDataNew}) => {

  const [data, setData] = useState('');
  const [refresh,setRefresh] = useState(false);

  useEffect(() => {
    get_karana();
  }, []);
 
  if(refresh){
    const get_karana1 = async () => {
      await axios({
        method: 'post',
        url: api_url + advanced_panchang ,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: {
          date : panchangDataNew.newDate != null ? panchangDataNew.newDate : new Date(),
          latitude: panchangDataNew.latitude,
          longitude:panchangDataNew.longitude, 
        },
      })
        .then(res => {
          setData(res.data);
        })
        .catch(err => {
          console.log(err);
        });
    };
    get_karana1();

  }


  const get_karana = async () => {
    await axios({
      method: 'post',
      url: api_url + advanced_panchang ,
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
        setData(res.data);
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
              {todayInfo()}
              {karanaData()}
              {/* {karanaTable()} */}
            </>
          }
        />
      </View>
    </View>
  );

  function karanaTable() {
    return (
      <View
        style={{
          marginVertical: Sizes.fixPadding * 2,
          backgroundColor: Colors.whiteDark,
          borderRadius: Sizes.fixPadding,
          borderWidth: 1,
          borderColor: Colors.grayMedium,
        }}>
        <View style={styles.tablefield}>
          <Text style={styles.text1}>Karana Number</Text>
          <Text style={styles.text2}>2</Text>
        </View>
        <View style={styles.tablefield}>
          <Text style={styles.text1}>Karana Name</Text>
          <Text style={styles.text2}>Bava</Text>
        </View>
        <View style={styles.tablefield}>
          <Text style={styles.text1}>Diet</Text>
          <Text style={styles.text2}>Ajopada(Rudra)</Text>
        </View>
        <View style={styles.tablefield}>
          <Text style={styles.text1}>Diet</Text>
          <Text style={styles.text2}>Ajopada(Rudra)</Text>
        </View>
      </View>
    );
  }

  function todayInfo() {
    return (
      <View
      style={{
        marginVertical: Sizes.fixPadding * 2,
        backgroundColor: Colors.whiteDark,
        borderRadius: Sizes.fixPadding,
        borderWidth: 1,
        borderColor: Colors.grayMedium
      }}>
      <View style={{borderBottomWidth: 1, padding: Sizes.fixPadding, borderBottomColor: Colors.grayMedium, flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: Colors.gray}}>
        <Text style={{...Fonts.gray16RobotoRegular}}>Karan Number</Text>
        <Text style={{...Fonts.gray16RobotoRegular}}>{data.advanced_panchang?.karan.details.karan_number}</Text>
      </View>
      <View style={{borderBottomWidth: 1, padding: Sizes.fixPadding, borderBottomColor: Colors.grayMedium, flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: Colors.gray}}>
        <Text style={{...Fonts.gray16RobotoRegular}}>Today's Karan</Text>
        <Text style={{...Fonts.gray16RobotoRegular}}>{data.advanced_panchang?.karan.details.karan_name}</Text>
      </View>
      <View style={{borderBottomWidth: 1, padding: Sizes.fixPadding, borderBottomColor: Colors.grayMedium, flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: Colors.gray}}>
        <Text style={{...Fonts.gray16RobotoRegular}}>Special: </Text>
        <Text style={{...Fonts.gray16RobotoRegular}}>{data.advanced_panchang?.karan.details.special}</Text>
      </View>
      <View style={{borderBottomWidth: 1, padding: Sizes.fixPadding, borderBottomColor: Colors.grayMedium, flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: Colors.gray}}>
        <Text style={{...Fonts.gray16RobotoRegular}}>Deity</Text>
        <Text style={{...Fonts.gray16RobotoRegular}}>{data.advanced_panchang?.karan.details.deity}</Text>
      </View>
      <View style={{padding: Sizes.fixPadding, flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: Colors.gray}}>
        <Text style={{...Fonts.gray16RobotoRegular}}>End Time</Text>
        <Text style={{...Fonts.gray16RobotoRegular}}>{`${data.advanced_panchang?.karan.end_time.hour}:${data.advanced_panchang?.karan.end_time.minute}:${data.advanced_panchang?.karan.end_time.second}`}</Text>
      </View>
    </View>
    )
  }

  function karanaData() {
    return (
      <View style={{marginVertical: Sizes.fixPadding}}>
        <Text style={{...Fonts.gray16RobotoRegular}}>
        This Karana is suited for all kinds of works, both durable or/and temporary one. The Karana is also suitable for leaving a place or a house and even for entering a new place or new house.
        </Text>
      </View>
    );
  }

  function searchBar() {
    return (
      <DateFilter refresh={refresh} setRefresh={setRefresh}/>
    );
  }

};

const mapStateToProps = state =>({
  panchangData: state.kundli.panchangData,
  panchangDataNew: state.kundli.panchangDataNew,
  currentLocation: state.kundli.currentLatLong,
})

export default connect(mapStateToProps, null)(Karana);

const styles = StyleSheet.create({
  tablefield: {
    borderBottomWidth: 1, padding: Sizes.fixPadding, borderBottomColor: Colors.grayMedium, flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: Colors.gray
  },
  text1: {
    ...Fonts.gray16RobotoRegular,
    width: '50%',
  }, 
  text2: {
    ...Fonts.gray16RobotoRegular, width: '50%',
    textAlign: 'right'
  },
  row: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
  }
});
