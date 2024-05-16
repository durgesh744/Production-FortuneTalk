import {StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, Image} from 'react-native';
import React, { useEffect,useState } from 'react';
import {Colors, Sizes, Fonts} from '../../assets/style';
import MyStatusBar from '../../components/MyStatusBar';
import {api_url, api2_get_chaughadiya, advanced_panchang} from '../../config/constants';
import DateFilter from './DateFilter';
import { connect } from 'react-redux';
import axios from 'axios';


 




const Tithi = ({panchangData,panchangDataNew }) => {
  const [data, setData] = useState('');
  const [refresh,setRefresh] = useState(false);

  useEffect(() => {
    get_Tithi();
  }, []);
  console.log('this isthe advance panchang',data.advanced_panchang?.tithi.end_time.hour);

  if (refresh) {
    const get_Tithi = async () => {
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
          console.log('Nakshatra============+++====>', res.data);
          setData(res.data);
        })
        .catch(err => {
          console.log(err);
        });
    };
    get_Tithi()

  }



  const get_Tithi = async () => {
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
              {tithiData()}
              {tithiTable()}
              {tithiInfo()}
            </>
          }
        />
      </View>
    </View>
  );


  

  function tithiInfo() {
    return (
      <View style={{marginVertical:Sizes.fixPadding}}>
        <Text style={{...Fonts.gray16RobotoRegular}}>Shukla Dwadashi upto 09:45, 26 Oct, Ashwin, Vikram Samvat -2080.</Text>
      </View>
    )
  }

  function tithiTable() {
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
          <Text style={{...Fonts.gray16RobotoRegular}}>Tithi Number</Text>
          <Text style={{...Fonts.gray16RobotoRegular}}>{data.advanced_panchang?.tithi.details.tithi_number}</Text>
        </View>
        <View style={{borderBottomWidth: 1, padding: Sizes.fixPadding, borderBottomColor: Colors.grayMedium, flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: Colors.gray}}>
          <Text style={{...Fonts.gray16RobotoRegular}}>Today's Tithi</Text>
          <Text style={{...Fonts.gray16RobotoRegular}}>{data.advanced_panchang?.tithi.details.tithi_name}</Text>
        </View>
        <View style={{borderBottomWidth: 1, padding: Sizes.fixPadding, borderBottomColor: Colors.grayMedium, flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: Colors.gray}}>
          <Text style={{...Fonts.gray16RobotoRegular}}>Special</Text>
          <Text style={{...Fonts.gray16RobotoRegular}}>{data.advanced_panchang?.tithi.details.special}</Text>
        </View>
        <View style={{borderBottomWidth: 1, padding: Sizes.fixPadding, borderBottomColor: Colors.grayMedium, flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: Colors.gray}}>
          <Text style={{...Fonts.gray16RobotoRegular}}>Deity</Text>
          <Text style={{...Fonts.gray16RobotoRegular}}>{data.advanced_panchang?.tithi.details.deity}</Text>
        </View>
        <View style={{padding: Sizes.fixPadding, flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: Colors.gray}}>
          <Text style={{...Fonts.gray16RobotoRegular}}>End Time</Text>
          <Text style={{...Fonts.gray16RobotoRegular}}>{`${data.advanced_panchang?.tithi.end_time.hour}:${data.advanced_panchang?.tithi.end_time.minute}:${data.advanced_panchang?.tithi.end_time.second}`}</Text>
        </View>
      </View>
    )
  }

  function tithiData() {
    return (
      <View style={{marginVertical:Sizes.fixPadding}}>
        <Text style={{...Fonts.black14RobotoRegular, fontWeight: 'bold', color: Colors.blackLight}}>Purnimantra</Text>
        <Text style={{...Fonts.gray16RobotoRegular}}>Shukla Dwadashi upto 09:45, 26 Oct, Ashwin, Vikram Samvat -2080.</Text>
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
})

export default connect(mapStateToProps, null)(Tithi)

const styles = StyleSheet.create({})