import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import { Colors, Sizes, Fonts } from '../../assets/style';
import MyStatusBar from '../../components/MyStatusBar';
import { api_url, advanced_panchang } from '../../config/constants';
import DateFilter from './DateFilter';
import axios from 'axios';

const SubhMuhurat = ({ panchangDataNew }) => {
  const [data, setData] = useState('');
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    get_subhMuhurat();
  }, []);

  const get_subhMuhurat = async () => {
    await axios({
      method: 'post',
      url: api_url + advanced_panchang,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        date: panchangDataNew.newDate != null ? panchangDataNew.newDate : new Date(),
        latitude: panchangDataNew.latitude,
        longitude: panchangDataNew.longitude,
      },
    })
      .then(res => {
        console.log('SubhHora==============>', res.data.hora.day);
        setData(res.data.hora.day);
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyColor }}>
      <MyStatusBar backgroundColor={Colors.primaryLight} barStyle={'light-content'} />
      <View style={{ flex: 1, paddingHorizontal: Sizes.fixPadding * 2, paddingVertical: Sizes.fixPadding * 2 }}>
        <FlatList
          ListHeaderComponent={
            <>
              {searchBar()}
              {filterInfo()}
              {subhMuhuratData()}
            </>
          }
        />
      </View>
    </View>
  );

  function subhMuhuratData() {
    return (

      <Text style={{color:'red', justifyContent:'center', fontSize:24, }}>Coming Soon</Text>
      // <View style={{ marginVertical: Sizes.fixPadding * 2, backgroundColor: Colors.whiteDark, borderRadius: Sizes.fixPadding, borderWidth: 1, borderColor: Colors.grayMedium }}>
      //   <Text style={{ ...Fonts.gray16RobotoMedium, paddingHorizontal: Sizes.fixPadding, paddingVertical: Sizes.fixPadding * 0.5 }}>Abhijit Muhurat</Text>
      //   <View style={styles.tablefield}>
      //     <Text style={styles.text1}>Start Time</Text>
      //     <Text style={styles.text2}></Text>
      //   </View>
      //   <View style={styles.tablefield}>
      //     <Text style={styles.text1}>Karana Name</Text>
      //     <Text style={styles.text2}>Bava</Text>
      //   </View>
      //   <View style={styles.tablefield}>
      //     <Text style={styles.text1}>Diet</Text>
      //     <Text style={styles.text2}>Ajopada(Rudra)</Text>
      //   </View>
      //   <View style={styles.tablefield}>
      //     <Text style={styles.text1}>Diet</Text>
      //     <Text style={styles.text2}>Ajopada(Rudra)</Text>
      //   </View>
      // </View>
    );
  }

  function filterInfo() {
    return (
      <View style={{ paddingVertical: Sizes.fixPadding * 2 }}>
        <View style={[styles.row, { justifyContent: 'space-between' }]}>
          <TouchableOpacity style={[styles.row, { borderWidth: 2, padding: Sizes.fixPadding, borderRadius: 1000, borderColor: Colors.gray, paddingVertical: Sizes.fixPadding * 0.8 }]}>
            <Image source={require('../../assets/images/icons/magic-book.png')} style={{ width: 25, height: 25 }} />
            <Text style={{ ...Fonts.gray16RobotoMedium, marginLeft: Sizes.fixPadding }}>Today's Panchang</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.row, { borderWidth: 2, padding: Sizes.fixPadding, borderRadius: 1000, borderColor: Colors.gray, paddingVertical: Sizes.fixPadding * 0.8 }]}>
            <Image source={require('../../assets/images/icons/pin.png')} style={{ width: 25, height: 25 }} />
            <Text style={{ ...Fonts.gray16RobotoMedium, marginLeft: Sizes.fixPadding }}>Location</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  function searchBar() {
    return (
      <DateFilter refresh={refresh} setRefresh={setRefresh} />
    );
  }

};

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

export default SubhMuhurat;
