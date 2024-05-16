import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { api_addreview, api_url } from '../../config/constants';
import Stars from 'react-native-stars';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, Fonts, Sizes } from '../../assets/style';
import { BottomSheet } from '@rneui/themed';
import { SCREEN_WIDTH } from '../../config/Screen';
import Icon from 'react-native-vector-icons/Entypo';
import { withNavigation } from '@react-navigation/compat';


const Review = ({
  reviewModalVisible,
  astroData,
  go_home,
  updateState,
  userData,
  trans_id,
  experties
}) => {
  const [ratingStar, setRatingStar] = useState(1);
  const [reviewMessage, setReviewMessage] = useState('');
  const add_review = async () => { 
    updateState({ isLoading: true });
    await axios({
      method: 'post',
      url: api_url + api_addreview,
      data: {
        user_id: userData.id,
        vendor_id: astroData.id,
        listing_id: 1,
        child_cat_id: 1,
        star: ratingStar,
        review: reviewMessage,
        transid: trans_id,
        comments: reviewMessage,
      },
    })
      .then(res => {
        updateState({ isLoading: false });
        updateState({ reviewModalVisible: false });
        go_home();
      })
      .catch(err => {
        updateState({ isLoading: false });
        console.log(err);
      });
  };
  return (
    <BottomSheet isVisible={reviewModalVisible}>

      <View
        style={{
          backgroundColor: Colors.white,
          marginHorizontal: Sizes.fixPadding * 1.5,
          elevation: 8,
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.2,
          shadowColor: Colors.blackLight,
          borderTopLeftRadius: Sizes.fixPadding * 3,
        }}>
        <View>
          <TouchableOpacity onPress={() => go_home()}>
            <Icon name="circle-with-cross" size={24} color="grey"
              style={{ position: 'absolute', right: Sizes.fixPadding * 1.5, marginTop: 10 }}
            />
          </TouchableOpacity>
        </View>

        <Text
          style={{
            ...Fonts.gray18RobotoRegular,
            color: Colors.blackLight,
            textAlign: 'center',
            marginVertical: Sizes.fixPadding * 1.5,
            marginTop: Sizes.fixPadding * 2,
          }}>
          How was your{'\n'}experience on this chat?
        </Text>
        <View style={{ alignItems: 'center' }}>
          {astroData?.image && (
            <View
              style={{
                width: SCREEN_WIDTH * 0.2,
                height: SCREEN_WIDTH * 0.2,
                borderRadius: 1000,
                marginBottom: Sizes.fixPadding * 0.5,
                // elevation: 8,
              }}>
              <Image
                source={{
                  uri: astroData?.image,
                }}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 1000,
                }}
              />
            </View>
          )}
          <Text style={{ ...Fonts.primaryLight18RobotoMedium }}>
            {astroData?.owner_name}
          </Text>
          <Text numberOfLines={2} style={{ ...Fonts.gray14RobotoMedium, textAlign: 'center' }}>
            {typeof experties == 'object' && experties.map(item => item.name).join(', ')}
          </Text>
          <View style={{ marginVertical: Sizes.fixPadding * 1.5 }}>
            <Stars
              default={ratingStar}
              count={5}
              half={true}
              starSize={32}
              update={val => setRatingStar(val)}
              fullStar={
                <Ionicons name={'star'} size={32} color={Colors.primaryLight} />
              }
              emptyStar={
                <Ionicons
                  name={'star-outline'}
                  size={32}
                  color={Colors.primaryLight}
                />
              }
              halfStar={
                <Ionicons
                  name={'star-half'}
                  size={32}
                  color={Colors.primaryLight}
                />
              }
            />
          </View>
          <Text style={{ ...Fonts.gray16RobotoMedium }}>Give Ratings</Text>
          <TextInput
            value={reviewMessage}
            placeholder="Tap to start typing"
            placeholderTextColor={Colors.gray}
            onChangeText={setReviewMessage}
            multiline
            style={{
              width: '90%',
              padding: Sizes.fixPadding,
              backgroundColor: Colors.grayLight,
              marginVertical: Sizes.fixPadding * 1.5,
              ...Fonts.black14InterMedium,
              height: 150,
              textAlignVertical: 'top',
              borderRadius: Sizes.fixPadding,
            }}
          />
          <TouchableOpacity
            activeOpacity={0.8}
            style={{ width: '80%' }}
            onPress={add_review}>
            <LinearGradient
              colors={[Colors.primaryLight, Colors.primaryDark]}
              style={{
                width: '100%',
                paddingVertical: Sizes.fixPadding,
                borderRadius: 1000,
                marginVertical: Sizes.fixPadding * 2,
              }}>
              <Text style={{ ...Fonts.white16RobotoMedium, textAlign: 'center' }}>
                Submit
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheet>
  );
};

export default Review;
