import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {Modal} from 'react-native-paper';
import {Colors, Fonts, Sizes} from '../../assets/style';
import LinearGradient from 'react-native-linear-gradient';
import database from '@react-native-firebase/database';

const SuggestedAstromall = ({
  suggestedAstromallVisible,
  suggestedAstromallData,
  updateState,
  navigation,
  userData,
  astroData
}) => {
  const on_product = () => {
    database()
      .ref(`CustomerCurrentRequest/${userData?.id}`)
      .update({
        astromall: 'null',
      })
      .then(() => {
        updateState({suggestedAstromallVisible: false});
        navigation.navigate('productDetailes', {
          productData: suggestedAstromallData?.data,
          title: suggestedAstromallData?.title,
          category_id: suggestedAstromallData?.category_id,
          suggestedBy: astroData?.id,
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  const on_pooja = () => {
    database()
      .ref(`CustomerCurrentRequest/${userData?.id}`)
      .update({
        astromall: 'null',
      })
      .then(() => {
        updateState({suggestedAstromallVisible: false});
        navigation.navigate('poojaDetails', {
          poojaData: suggestedAstromallData?.data,
          poojaType: '1',
          suggestedBy: astroData?.id,
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  const onDismiss = ()=>{
    try{
      database()
      .ref(`CustomerCurrentRequest/${userData?.id}`)
      .update({
        astromall: 'null',
      })
      .then(() => {
        updateState({suggestedAstromallVisible: false});
      })
      .catch(err => {
        console.log(err);
      });
    }catch(e){
      console.log(e)
    }
  }

  return (
    <Modal
      visible={suggestedAstromallVisible}
      onDismiss={() => onDismiss()}>
      <View
        style={{
          backgroundColor: Colors.white,
          marginHorizontal: Sizes.fixPadding * 2,
          borderRadius: Sizes.fixPadding,
          padding: Sizes.fixPadding * 1.5,
        }}>
        <Text
          style={{...Fonts.primaryLight18RobotoMedium, textAlign: 'center'}}>
          Astromall
        </Text>
        <Text
          style={{
            ...Fonts.gray16RobotoRegular,
            textAlign: 'center',
            marginVertical: Sizes.fixPadding,
          }}>
          Astromall Suggested by {suggestedAstromallData?.astro_name}
        </Text>
        <View
          style={{
            backgroundColor: Colors.grayLight,
            paddingVertical: Sizes.fixPadding * 2,
            paddingHorizontal: Sizes.fixPadding,
            borderRadius: Sizes.fixPadding,
          }}>
          <Text style={{...Fonts.gray18RobotoMedium, color: Colors.blackLight}}>
            {suggestedAstromallData?.data?.title}
          </Text>
          <Text
            numberOfLines={3}
            style={{
              ...Fonts.gray14RobotoRegular,
              marginVertical: Sizes.fixPadding,
            }}>
            {suggestedAstromallData?.data?.description}
          </Text>
          <Text style={{...Fonts.black18RobotoMedium}}>
            ₹ {suggestedAstromallData?.data?.price}
          </Text>
        </View>
        <View
          style={{
            flex: 0,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            marginTop: Sizes.fixPadding,
          }}>
          <TouchableOpacity
            activeOpacity={0.8}
            disabled={suggestedAstromallData?.type == 'pooja'}
            onPress={() => on_product()}
            style={{width: '40%'}}>
            <LinearGradient
              colors={
                suggestedAstromallData?.type != 'pooja'
                  ? [Colors.primaryLight, Colors.primaryDark]
                  : [Colors.gray, Colors.gray]
              }
              style={{
                width: '100%',
                paddingVertical: Sizes.fixPadding,
                borderRadius: 1000,
              }}>
              <Text style={{...Fonts.white14RobotoMedium, textAlign: 'center'}}>
                Product
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            disabled={suggestedAstromallData?.type != 'pooja'}
            onPress={() => on_pooja()}
            style={{width: '40%'}}>
            <LinearGradient
              colors={
                suggestedAstromallData?.type == 'pooja'
                  ? [Colors.primaryLight, Colors.primaryDark]
                  : [Colors.gray, Colors.gray]
              }
              style={{
                width: '100%',
                paddingVertical: Sizes.fixPadding,
                borderRadius: 1000,
              }}>
              <Text style={{...Fonts.white14RobotoMedium, textAlign: 'center'}}>
                Pooja
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default SuggestedAstromall;
