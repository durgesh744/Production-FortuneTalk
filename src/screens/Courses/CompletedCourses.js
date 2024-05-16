import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors, Fonts, Sizes} from '../../assets/style';
import {SCREEN_WIDTH} from '../../config/Screen';
import {api_url, complete_courses_customer_id} from '../../config/constants';
import {connect} from 'react-redux';
import Loader from '../../components/Loader';
import {ApiRequest} from '../../config/api_requests';
import NoDataFound from '../../components/NoDataFound';

const data = [
  {id: 1, title: ''},
  {id: 2, title: ''},
  {id: 3, title: ''},
];

const CompletedCourses = ({navigation, customerData}) => {
  const [state, setState] = useState({
    isLoading: false,
    courseData: null,
  });

  useEffect(() => {
    get_courses();
  }, []);

  const updateState = data => {
    setState(prevState => {
      const newData = {...prevState, ...data};
      return newData;
    });
  };

  const {isLoading, courseData} = state;

  const get_courses = async () => {
    try {
      updateState({isLoading: true});
      const response = await ApiRequest.postRequest({
        url: api_url + complete_courses_customer_id,
        data: {customer_id: customerData?.id},
      });
      if (response?.status == '200') {
        updateState({courseData: response?.data});
      }else{
        updateState({courseData: []});
      }
      updateState({isLoading: false});
    } catch (e) {
      console.log(e);
      updateState({isLoading: false});
    }
  };

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={{marginBottom: Sizes.fixPadding}}>
        <View style={styles.button}>
          <Text style={{
              ...Fonts.black16RobotoMedium,
              fontSize: 14,
              color: Colors.blackLight,
            }}>{item?.course_name}</Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          // onPress={() => navigation.navigate('completedCoursesDetails')}
          style={styles.subButton}>
          <Text style={{...Fonts.white16RobotoMedium}}>Get Your Cirtificate</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: Colors.bodyColor}}>
      <Loader visible={isLoading} />
      {courseData && (
        <FlatList
          data={courseData}
          renderItem={renderItem}
          contentContainerStyle={{padding: Sizes.fixPadding * 2}}
          ListEmptyComponent={<NoDataFound />}
        />
      )}
    </View>
  );
};

const mapStateToProps = state => ({
  customerData: state.user.userData,
  wallet: state.user.wallet,
});

export default connect(mapStateToProps, null)(CompletedCourses);

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#F8F8F8',
    padding: Sizes.fixPadding * 1.5,
    borderRadius: Sizes.fixPadding,
    elevation: 8,
    shadowColor: Colors.blackLight,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    zIndex: 1,
  },
  subButton: {
    flex: 0,
    width: SCREEN_WIDTH * 0.6,
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'flex-end',
    backgroundColor: Colors.primaryLight,
    padding: Sizes.fixPadding,
    borderRadius: Sizes.fixPadding,
    paddingTop: Sizes.fixPadding * 2,
    bottom: Sizes.fixPadding,
    zIndex: -1,
    elevation: 8,
    shadowColor: Colors.blackLight,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
  },
});
