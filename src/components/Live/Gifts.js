import {View, Text, Image, StyleSheet, FlatList} from 'react-native';
import React, {useState} from 'react';
import {Modal} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Colors, Fonts, Sizes} from '../../assets/style';
import {TouchableOpacity} from 'react-native';
import {SCREEN_WIDTH} from '../../config/Screen';


const Gifts = ({giftVisible, updateState, wallet, giftData, send_gifts}) => {
  const [selectedGifts, setSelectedGifts] = useState(null);
  const chat_wallet_check = () => {
    if (selectedGifts != null) {
      if (parseFloat(wallet) <= parseFloat(selectedGifts?.amt)) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };
  return (
    <Modal
      visible={giftVisible}
      onDismiss={() => updateState({giftVisible: false})}
      contentContainerStyle={{
        flex: 0,
        paddingVertical: Sizes.fixPadding * 2,
        backgroundColor: Colors.white,
        marginHorizontal: Sizes.fixPadding * 1.5,
        borderRadius: Sizes.fixPadding * 2,
        elevation: 8,
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.2,
        shadowColor: Colors.blackLight
      }}>
      <View>
        {showWalletInfo()}
        {showTitleInfo()}
        {showGifts()}
        {showButtons()}
      </View>
    </Modal>
  );

  function showButtons() {
    return (
      <View
        style={[
          styles.row,
          {
            marginHorizontal: Sizes.fixPadding,
            justifyContent: 'space-around',
          },
        ]}>
        <TouchableOpacity
          activeOpacity={0.8}
          disabled={chat_wallet_check()}
          style={{width: '40%'}}>
          <LinearGradient
            colors={
              chat_wallet_check()
                ? [Colors.primaryLight, Colors.primaryDark]
                : [Colors.gray, Colors.gray]
            }
            style={[
              {
                width: '100%',
                paddingVertical: Sizes.fixPadding * 0.8,
                borderRadius: 1000,
              },
            ]}>
            <Text
              style={{
                ...Fonts.white14RobotoMedium,
                textAlign: 'center',
              }}>
              Recharge
            </Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          disabled={chat_wallet_check() || selectedGifts == null}
          onPress={()=>send_gifts(selectedGifts)}
          style={{width: '40%'}}>
          <LinearGradient
            colors={
              !chat_wallet_check() && selectedGifts != null
                ? [Colors.primaryLight, Colors.primaryDark]
                : [Colors.gray, Colors.gray]
            }
            style={[
              {
                width: '100%',
                paddingVertical: Sizes.fixPadding * 0.8,
                borderRadius: 1000,
              },
            ]}>
            <Text
              style={{
                ...Fonts.white14RobotoMedium,
                textAlign: 'center',
              }}>
              Send
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  function showGifts() {
    const renderItem = ({item, index}) => {
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setSelectedGifts(item)}
          style={[
            styles.itemContainer,
            {
              backgroundColor:
                selectedGifts?.gifts_id == item?.gifts_id
                  ? Colors.primaryLight
                  : Colors.white,
            },
          ]}>
          <Image
            source={{uri: item?.icon}}
            style={{width: '30%', height: '30%'}}
          />
          <Text
            style={{
              ...Fonts.black11InterMedium,
              color:
                selectedGifts?.gifts_id == item?.gifts_id
                  ? Colors.white
                  : Colors.blackLight,
              fontSize: 9,
              marginTop: Sizes.fixPadding * 0.2,
            }}>
            {item?.title}
          </Text>
          <Text
            style={{
              ...Fonts.black11InterMedium,
              color:
                selectedGifts?.gifts_id == item?.gifts_id
                  ? Colors.white
                  : Colors.blackLight,
              fontSize: 9,
            }}>
            ₹{item?.amt}
          </Text>
        </TouchableOpacity>
      );
    };
    return (
      <View style={{marginBottom: Sizes.fixPadding}}>
        <FlatList
          data={giftData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          numColumns={3}
          columnWrapperStyle={{justifyContent: 'space-around'}}
        />
      </View>
    );
  }

  function showTitleInfo() {
    return (
      <View
        style={{
          borderBottomWidth: 1,
          borderTopWidth: 1,
          paddingVertical: Sizes.fixPadding * 0.5,
          marginVertical: Sizes.fixPadding,
          borderColor: Colors.grayLight,
        }}>
        <Text
          style={{
            ...Fonts.primaryLight18RobotoMedium,
            fontSize: 20,
            textAlign: 'center',
          }}>
          Send a Gift
        </Text>
      </View>
    );
  }

  function showWalletInfo() {
    return (
      <View>
        <LinearGradient
          colors={[Colors.primaryLight, Colors.primaryDark]}
          style={[
            styles.row,
            {
              paddingHorizontal: Sizes.fixPadding,
              paddingVertical: Sizes.fixPadding * 0.5,
              borderRadius: 1000,
              width: '40%',
              alignSelf: 'center',
            },
          ]}>
          <Ionicons name="wallet-outline" color={Colors.white} size={26} />
          <Text
            style={{
              ...Fonts.white14RobotoMedium,
              marginLeft: Sizes.fixPadding,
            }}>
            ₹ {wallet}
          </Text>
        </LinearGradient>
        {chat_wallet_check() && (
          <Text
            style={{
              ...Fonts.black12RobotoRegular,
              textAlign: 'center',
              color: Colors.red,
            }}>
            Low Balance!!
          </Text>
        )}
      </View>
    );
  }
};

export default Gifts;

const styles = StyleSheet.create({
  row: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    width: SCREEN_WIDTH * 0.2,
    height: SCREEN_WIDTH * 0.2,
    borderWidth: 1,
    borderColor: Colors.grayLight,
    borderRadius: Sizes.fixPadding,
    elevation: 5,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowColor: Colors.blackLight,
    backgroundColor: Colors.white,
    marginBottom: Sizes.fixPadding,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
