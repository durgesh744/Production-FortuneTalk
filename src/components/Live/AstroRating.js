import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React, {useState} from 'react';
import {Modal, Portal} from 'react-native-paper';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../config/Screen';
import {Colors, Fonts, Sizes} from '../../assets/style';
import Stars from 'react-native-stars';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ApiRequest} from '../../config/api_requests';
import {api_url, img_url_2, live_exit_review} from '../../config/constants';

const AstroRating = ({
  liveID,
  astroID,
  userID,
  onDone,
  updateState,
  reviewVisible,
  astroData
}) => {
  const [rating, setRating] = useState('3');
  const [comments, setComments] = useState('');

  const submit_review = async () => {
    try {
      updateState({isLoading: true});
      const response = await ApiRequest.postRequest({
        url: api_url + live_exit_review,
        data: {
          live_id: liveID,
          astrologer_id: astroID,
          customer_id: userID,
          comment: comments,
          rating: rating,
        },
      });

      console.log(response);
      onDone();
      updateState({reviewVisible: false, isLoading: false});
    } catch (e) {
      console.log(e);
      updateState({isLoading: false});
    }
  };

  const onClose = () => {
    onDone();
    updateState({reviewVisible: false});
  };

  return (
    <Modal visible={reviewVisible} onDismiss={() => onClose()}>
      <View style={styles.modal3}>
        <TouchableOpacity
        onPress={()=>onClose()}
        style={{position: 'absolute', right: 10, top: 10, zIndex: 99}}
        >
        <Ionicons
                name={'close'}
                size={32}
                color={Colors.primaryLight}
              />
        </TouchableOpacity>
        <View
          style={{
            width: '100%',
            borderBottomColor: Colors.grayLight,
            borderBottomWidth: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: Sizes.fixPadding,
            paddingTop: Sizes.fixPadding * 1.5,
            paddingBottom: Sizes.fixPadding,
          }}>
          <View
            style={{
              elevation: 5,
              shadowColor: Colors.black, 
              shadowOffset: {
                width: 5,
                height: 5,
              },
              shadowRadius: 5,
              shadowOpacity: 0.5,
            }}>
            <Image
                  source={{uri: img_url_2 + astroData?.img_url}}
              style={{
                width: SCREEN_WIDTH * 0.175,
                height: SCREEN_WIDTH * 0.175,
                borderRadius: SCREEN_WIDTH * 0.175,
                borderWidth: 2,
                borderColor: Colors.primaryDark,
              }}
            />
          </View>
          <Text
            style={{
              ...Fonts.primaryLight18RobotoRegular,
              fontWeight: 'bold',
            }}>
             {astroData?.owner_name}
          </Text>
        </View>
        <View
          style={{
            width: '90%',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: Sizes.fixPadding * 1.5,
          }}>
          <Stars
            default={3}
            count={5}
            half={true}
            starSize={32}
            update={val => setRating(val)}
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
          <View
            style={{
              width: '95%',
              marginVertical: Sizes.fixPadding * 1.5,
              padding: Sizes.fixPadding * 0.5,
              backgroundColor: Colors.white,
              borderRadius: Sizes.fixPadding,
              borderColor: Colors.grayLight,
              borderWidth: 1,
            }}>
            <TextInput
              placeholder="Write here..."
              numberOfLines={3}
              textAlignVertical="top"
              onChangeText={setComments}
            />
          </View>
          <LinearGradient
            colors={[Colors.primaryLight, Colors.primaryDark]}
            style={{width: '50%', borderRadius: Sizes.fixPadding * 2}}>
            <TouchableOpacity
              onPress={submit_review}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: Sizes.fixPadding * 0.5,
                paddingHorizontal: Sizes.fixPadding * 2,
              }}>
              <Text
                style={{
                  ...Fonts.black16RobotoMedium,
                  color: Colors.white,
                }}>
                Submit
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
};

export default AstroRating;

const styles = StyleSheet.create({
  modal3: {
    alignSelf: 'center',
    width: SCREEN_WIDTH * 0.75,
    borderRadius: Sizes.fixPadding * 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    elevation: 5,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowRadius: 5,
    shadowOpacity: 0.5,
  },
});
