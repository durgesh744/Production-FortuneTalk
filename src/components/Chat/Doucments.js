import {
  View,
  Text,
  Linking,
  TouchableNativeFeedback,
  TouchableOpacity,
} from 'react-native'; 
import React from 'react';
import {SCREEN_WIDTH} from '../../config/Screen';
import {Sizes, Fonts, Colors} from '../../assets/style';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {showToastWithGravityAndOffset} from '../../methods/toastMessage';
import * as Progress from 'react-native-progress';

const Documets = ({item, uploadProgress}) => {
  const on_download = url => {
    Linking.openURL(url)
      .then(supported => {
        if (!supported) {
          showToastWithGravityAndOffset('Not downloaded');
        }
      })
      .catch(err => {
        showToastWithGravityAndOffset('Something going wrong');
      });
  };

  function formatData(dataInBytes) {
    if (dataInBytes >= 1024 * 1024) {
      // Convert to MB
      const dataInMB = (dataInBytes / (1024 * 1024)).toFixed(2);
      return `${dataInMB} MB`;
    } else if (dataInBytes >= 1024) {
      // Convert to KB
      const dataInKB = (dataInBytes / 1024).toFixed(2);
      return `${dataInKB} KB`;
    } else {
      // Display in bytes
      return `${dataInBytes} bytes`;
    }
  }

  return (
    <View style={{width: SCREEN_WIDTH * 0.5, height: SCREEN_WIDTH * 0.4}}>
      {!item?.sent ? (
        <View
          style={{
            flex: 1,
            borderRadius: Sizes.fixPadding,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: Colors.primaryLight,
          }}>
          <Progress.Pie
            size={30}
            indeterminate={true}
            progress={uploadProgress}
            borderWidth={3}
            borderColor={Colors.white}
          />
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => on_download(item?.file?.uri)}
          style={{
            flex: 1,
            borderRadius: Sizes.fixPadding,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: Colors.primaryLight,
          }}>
          <FontAwesome5 name="file-download" color={Colors.white} size={35} />
          <Text
            style={{
              ...Fonts.white14RobotoRegular,
              marginTop: Sizes.fixPadding,
            }}>
            {formatData(item?.file?.size)}
          </Text>
        </TouchableOpacity>
      )}

      <Text
        style={{
          ...Fonts.black12RobotoRegular,
          padding: Sizes.fixPadding * 0.5,
          textAlign: 'center',
        }}>
        {item?.file?.name}
      </Text>
    </View>
  );
};

export default Documets;
