import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors, Sizes, Fonts } from '../../assets/style';
import { Dropdown } from 'react-native-element-dropdown';
import { MyMethods } from '../../methods/my_methods';
import { connect } from 'react-redux';
import * as KundliActions from '../../redux/actions/KundliActions'
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

const DateFilter = ({currentLatLong, dispatch,refresh,setRefresh}) => {
    const [isFocus, setIsFocus] = useState(false)
    const [value, setValue] = useState(null)
    const [filterData, setFilterData] = useState([])

 
    console.log('asdfasdf',refresh);
    useEffect(() => {
        getNext5Days()
    }, [])

    const getNext5Days = () => {
        const dates = [];
        let currentDate = new Date();

        for (let i = 0; i < 5; i++) {
            // Use the setDate() method to set the date to the next day
            currentDate.setDate(currentDate.getDate() + 1);
            dates.push({ value: currentDate.toISOString().split('T')[0], label: currentDate.toISOString().split('T')[0] }); // Convert to ISO string and extract the date part
        }
        dates.push({label: 'Custome', value: 'custome'})
        // console.log(dates)
        setFilterData(dates)
    }

    const onSelect = (date)=>{
        const payload = {
            date: new Date(date).getDate().toString(),
            month: new Date(date).getMonth(),
            year: new Date(date).getFullYear(),
            hour: new Date(date).getHours(),
            minute: new Date(date).getMinutes(),
            newDate: new Date(date),
            latitude: currentLatLong?.lat,
            longitude: currentLatLong?.long
          }

          console.log('=================111',payload)

          setRefresh(true);

          dispatch(KundliActions.setPanchangNew(payload))
    }

    const select_start_date = () => {
        if (Platform.OS == 'android') {
          DateTimePickerAndroid.open({
            value: new Date(),
            onChange: (event, date) => {
              if (event.type == 'set') {
                onSelect(date)
              }
            },
            // minimumDate: endDate != null ? endDate : null
            mode: 'date',
            display: 'calendar',
            is24Hour: true,
          });
        } else {
        }
      };

    return (
        <View style={styles.container}>
            <Dropdown
                style={[styles.dropdown]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                itemTextStyle={{ ...Fonts.primaryLight14RobotoRegular, textAlign: 'center' }}
                containerStyle={{
                    marginTop: Sizes.fixPadding,
                    borderRadius: Sizes.fixPadding,
                }}
                itemContainerStyle={{ borderRadius: Sizes.fixPadding, justifyContent: 'center', alignItems: 'center' }}
                iconStyle={styles.iconStyle}
                data={filterData}
                maxHeight={400}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? 'Today' : '...'}
                value={value}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                    setValue(item.value);
                      if(item.value == 'custome'){
                        select_start_date()
                    }else{
                        onSelect(item.value)
                    }
                   
                }}
            />
        </View>
    );
}

const mapStateToProps = state =>({
    currentLatLong: state.kundli.currentLatLong
})

const mapDispatchToProps = dispatch =>({dispatch})

export default connect(mapStateToProps, mapDispatchToProps)(DateFilter)

const styles = StyleSheet.create({
    txt: { paddingVertical: Sizes.fixPadding - 4, paddingHorizontal: 6 },
    container: {
        //backgroundColor: 'red',
        borderColor: Colors.primaryLight,
        paddingVertical: 18,
        // borderWidth: 2.5,
        borderRadius: 20,
        justifyContent: 'center',
        width: '90%',
        paddingVertical: 3,
        marginLeft: 22,
        flex: 0.4,
    },
    dropdown: {
        height: 50,
        borderColor: Colors.primaryLight,
        borderWidth: 2,
        borderRadius: Sizes.fixPadding,
        width: '90%',
        alignSelf: 'center',
        paddingHorizontal: 8,
    },
    icon: {
        marginRight: 5,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'red',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    placeholderStyle: {
        fontSize: 16,
        color: Colors.primaryLight,
    },
    selectedTextStyle: {
        fontSize: 16,
        color: Colors.primaryLight,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    balance: {
        // borderWidth: 1,
        borderRadius: 10,
        backgroundColor: Colors.gray,
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    viwTxt: {
        ...Fonts.white11InterMedium,
        fontSize: 8,
        fontWeight: '700',
        lineHeight: 12,
    },
    buttonContainer: {
        paddingVertical: Sizes.fixPadding * 0.5,
        width: '80%',
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray,
        marginTop: Sizes.fixPadding,
    },
    //   inputSearchStyle: {
    //     height: 40,
    //     fontSize: 16,
    //   },
});