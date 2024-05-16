import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {Modal} from 'react-native-paper';
import {Colors, Fonts, Sizes} from '../../assets/style';
import LinearGradient from 'react-native-linear-gradient';
import database from '@react-native-firebase/database';

const SuggestedRemedies = ({
  suggestedRemediesVisible,
  updateState,
  navigation,
  suggestedData,
  userData
}) => {
  const on_free_remedy = () => {
    database()
      .ref(`CustomerCurrentRequest/${userData?.id}`)
      .update({
        remedies: 'null',
      })
      .then(() => {
        updateState({suggestedRemediesVisible: false});
        navigation.navigate('freeRemedy', {
          remedy_id: suggestedData?.remedies_id,
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  const on_paid_remedy = () =>{
    database()
    .ref(`CustomerCurrentRequest/${userData?.id}`)
    .update({
      remedies: 'null',
    })
    .then(() => {
      updateState({suggestedRemediesVisible: false});
      navigation.navigate('paidRemedy', {
        remedy_id: suggestedData?.remedies_id,
      });
    })
    .catch(err => {
      console.log(err);
    });
  }

  const onDismiss = ()=>{
    try{
      database()
      .ref(`CustomerCurrentRequest/${userData?.id}`)
      .update({
        remedies: 'null',
      })
      .then(() => {
        updateState({suggestedRemediesVisible: false});
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
      visible={suggestedRemediesVisible}
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
          Remedy
        </Text>
        <Text
          style={{
            ...Fonts.gray16RobotoRegular,
            textAlign: 'center',
            marginVertical: Sizes.fixPadding,
          }}>
          Remedy Suggested by {suggestedData?.astro_name}
        </Text>
        <View
          style={{
            backgroundColor: Colors.grayLight,
            paddingVertical: Sizes.fixPadding * 2,
            paddingHorizontal: Sizes.fixPadding,
            borderRadius: Sizes.fixPadding,
          }}>
          <Text style={{...Fonts.gray18RobotoMedium, color: Colors.blackLight}}>
            {suggestedData?.product_name}
          </Text>
          <Text
            style={{
              ...Fonts.gray14RobotoRegular,
              marginVertical: Sizes.fixPadding,
            }}>
            {suggestedData?.product_description}
          </Text>
          {suggestedData?.status == '2' && (
            <Text style={{...Fonts.black18RobotoMedium}}>₹ {suggestedData?.product_price}</Text>
          )}
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
            disabled={suggestedData?.status == 2}
            onPress={() => on_free_remedy()}
            style={{width: '40%'}}>
            <LinearGradient
              colors={
                suggestedData?.status == 1
                  ? [Colors.primaryLight, Colors.primaryDark]
                  : [Colors.gray, Colors.gray]
              }
              style={{
                width: '100%',
                paddingVertical: Sizes.fixPadding,
                borderRadius: 1000,
              }}>
              <Text style={{...Fonts.white14RobotoMedium, textAlign: 'center'}}>
                Free Remedy
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            disabled={suggestedData?.status == 1}
            onPress={()=>on_paid_remedy()}
            style={{width: '40%'}}>
            <LinearGradient
              colors={
                suggestedData?.status == 2
                  ? [Colors.primaryLight, Colors.primaryDark]
                  : [Colors.gray, Colors.gray]
              }
              style={{
                width: '100%',
                paddingVertical: Sizes.fixPadding,
                borderRadius: 1000,
              }}>
              <Text style={{...Fonts.white14RobotoMedium, textAlign: 'center'}}>
                Paid Remedy
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default SuggestedRemedies;
