import {StyleSheet, Text, View, FlatList, TextInput} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Colors, Sizes, Fonts} from '../../assets/style';
import MyStatusBar from '../../components/MyStatusBar';
import axios from 'axios';
import {api_url, api2_get_chaughadiya} from '../../config/constants';
import DateFilter from './DateFilter';
import { connect } from 'react-redux';

const Choghadiya = ({route,panchangDataNew}) => {
  const [data, setData] = useState('');
  const [refresh,setRefresh] = useState(false);

  useEffect(() => {
    get_choghadiya();
  }, []);


  if(refresh){
    const get_choghadiya1 = async () => {
      await axios({
        method: 'post',
        url: api_url + api2_get_chaughadiya,
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
          setData(res.data.chaughadiya.day);
        })
        .catch(err => {
          console.log('err====>',err);
        });
    };
    get_choghadiya1();

  }

  const get_choghadiya = async () => {
    await axios({
      method: 'post',
      url: api_url + api2_get_chaughadiya,
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
        console.log('Chaughadiya===========>', res.data.chaughadiya.day);
        setData(res.data.chaughadiya.day);
      })
      .catch(err => {
        console.log('err====>',err);
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
              {choghadiyaData()}
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

  function choghadiyaData() {
    const renderItem = ({item, index}) => {
      return (
        <View style={styles.panchangItems}>
          <Text style={styles.panchangMainText}>{item.time}</Text>
          <Text style={styles.panchangSubText}>{item.muhurta}</Text>
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
        <FlatList
          data={data}
          renderItem={renderItem}
          key={item => item.muhurta}
        />
      </View>
    );
  }
};


const mapStateToProps = state =>({
  panchangData: state.kundli.panchangData,
  panchangDataNew: state.kundli.panchangDataNew,
  currentLocation: state.kundli.currentLatLong,
})

export default connect(mapStateToProps, null)(Choghadiya);

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
    width: '70%',
    borderRightWidth: 1,
    borderRightColor: Colors.grayLight,
  },
  panchangSubText: {
    padding: Sizes.fixPadding,
    ...Fonts.gray14RobotoMedium,
    color: Colors.blackLight,
    width: '25%',
    textAlign: 'right',
  },
});
