import {View, Text, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {Modal} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import {Colors, Fonts, Sizes} from '../assets/style';
import {base_url} from '../config/constants';
import { StyleSheet } from 'react-native';
import { SCREEN_WIDTH } from '../config/Screen';

const Requesting = ({
  requestingVisible,
  setRequestingVisible,
  customerData,
  astroData,
}) => {
  return (
    <Modal
      visible={requestingVisible}
      onDismiss={() => setRequestingVisible(false)}
      contentContainerStyle={{
        flex: 0,
        elevation: 8,
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.2,
        shadowColor: Colors.blackLight
      }}>
      <LinearGradient
        colors={[Colors.primaryLight, Colors.primaryDark]}
        style={{
          paddingTop: Sizes.fixPadding * 2,
          marginHorizontal: Sizes.fixPadding * 2.5,
          borderRadius: Sizes.fixPadding * 1.5,
        }}>
        <Text
          style={{
            ...Fonts.white18RobotMedium,
            fontFamily: 'Roboto-Bold',
            fontSize: 20,
            textAlign: 'center',
          }}>
          Connecting...
        </Text>
        <View
          style={{
            borderBottomWidth: 1,
            marginTop: Sizes.fixPadding,
            marginHorizontal: Sizes.fixPadding * 1.5,
            borderStyle: 'dashed',
            borderColor: Colors.white,
          }}
        />
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: Sizes.fixPadding * 2,
            // height: SCREEN_HEIGHT * 0.45,
          }}>
          <View style={styles.center}>
            <View
              style={{
                width: SCREEN_WIDTH * 0.2,
                height: SCREEN_WIDTH * 0.2,
                borderRadius: 1000,
                elevation: 8,
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.2,
                shadowColor: Colors.blackLight
              }}>
              <Image
                source={{
                  uri: base_url + 'admin/' + customerData?.user_profile_image,
                }}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 1000,
                }}
              />
            </View>
            <Text
              style={{
                ...Fonts.white16RobotoMedium,
                marginTop: Sizes.fixPadding,
              }}>
              {customerData?.username}
            </Text>
          </View>
          <Image
            source={require('../assets/gifs/connecting.gif')}
            style={{
              width: 40,
              height: 60,
              transform: [{rotate: '90deg'}],
            }}
          />
          <View style={styles.center}>
            <View
              style={{
                width: SCREEN_WIDTH * 0.2,
                height: SCREEN_WIDTH * 0.2,
                borderRadius: 1000,
                elevation: 8,
                shadowColor: Colors.blackLight
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
            <Text
              style={{
                ...Fonts.white16RobotoMedium,
                marginTop: Sizes.fixPadding,
              }}>
              {astroData?.owner_name}
            </Text>
          </View>
        </View>
        <View
          style={{
            backgroundColor: Colors.grayLight,
            padding: Sizes.fixPadding,
            borderRadius: Sizes.fixPadding * 1.5,
            elevation: 8,
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.2,
            shadowColor: Colors.blackLight,
          }}>
          <Text
            style={{
              ...Fonts.white14RobotoMedium,
              color: Colors.blackLight,
              textAlign: 'center',
              paddingBottom: Sizes.fixPadding * 4,
            }}>
            While you wait for {astroData?.owner_name}, you may also Chat Chat (wait 4 min)
            explore other astrologers and join their waitlist.
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={()=>setRequestingVisible(false)}
            style={{
              position: 'absolute',
              bottom: -Sizes.fixPadding * 2,
              alignSelf: 'center',
              backgroundColor: Colors.primaryLight,
              paddingHorizontal: Sizes.fixPadding * 3,
              paddingVertical: Sizes.fixPadding,
              borderRadius: Sizes.fixPadding,
              borderWidth: 3,
              borderColor: Colors.white,
            }}>
            <Text style={{...Fonts.white18RobotMedium}}>OK</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </Modal>
  );
};

export default Requesting;

const styles = StyleSheet.create({
    row: {
        flex: 0,
        flexDirection: 'row',
        alignItems: 'center'
    },
    center:{
        justifyContent: 'center',
        alignItems: 'center'
    }
})
