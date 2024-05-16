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
import { refresh } from '@react-native-community/netinfo';


const RahuKaal = ({panchangData,panchangDataNew}) => {

  const [data, setData] = useState('');
  const [refresh,setRefresh] = useState(false);

  useEffect(() => {
    get_Rahukal();
  }, []);


 


  if(refresh){
    const get_Rahukal1 = async () => {
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
          console.log('Rahu kal============+++====>', res.data);
          setData(res.data);
        })
        .catch(err => {
          console.log(err);
        });
    };
    get_Rahukal1
  }
 
  const get_Rahukal = async () => {
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
        console.log('Nakshatra============+++====>', res.data);
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
              {rahuKaalData()}
            </>
          }
        />
      </View>
    </View>
  );

  function rahuKaalData() {
    return (
      <View
        style={{
          marginVertical: Sizes.fixPadding * 2,
          backgroundColor: Colors.whiteDark,
          borderRadius: Sizes.fixPadding,
          borderWidth: 1,
          borderColor: Colors.grayMedium,
        }}>
        <Text style={{...Fonts.gray16RobotoMedium, paddingHorizontal:Sizes.fixPadding, paddingVertical: Sizes.fixPadding*0.5}}>Rahu Kaal</Text>
        <View style={styles.tablefield}>
          <Text style={styles.text1}>Start Time</Text>
          <Text style={styles.text2}>{data.advanced_panchang?.rahukaal.start}</Text>
        </View>
        <View style={styles.tablefield}>
          <Text style={styles.text1}>End Time</Text>
          <Text style={styles.text2}>{data.advanced_panchang?.rahukaal.end}</Text>
        </View>
        {/* <View style={styles.tablefield}>
          <Text style={styles.text1}>Diet</Text>
          <Text style={styles.text2}>Ajopada(Rudra)</Text>
        </View>
        <View style={styles.tablefield}>
          <Text style={styles.text1}>Diet</Text>
          <Text style={styles.text2}>Ajopada(Rudra)</Text>
        </View> */}
      </View>
    );
  }
  function searchBar() {
    return (
      <DateFilter refresh={refresh} setRefresh={setRefresh}/>
    );
  }

}

const mapStateToProps = state =>({
  panchangData: state.kundli.panchangData,
  panchangDataNew: state.kundli.panchangDataNew,
  currentLocation: state.kundli.currentLatLong,
});
export default connect(mapStateToProps, null)(RahuKaal)

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
})