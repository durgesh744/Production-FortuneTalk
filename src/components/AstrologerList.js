import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
  StyleSheet,
} from 'react-native';
import React from 'react';
import {Colors, Fonts, Sizes} from '../assets/style';
import Stars from 'react-native-stars';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {sum_price} from '../methods/calculatePrice';
import {SCREEN_WIDTH} from '../config/Screen';
import {MyMethods} from '../methods/my_methods';

const MyButton = ({item, on_chat, type, on_call}) => {
  const on_submit = () => {
    if (type == 'chat') {
      on_chat(item);
    } else {
      on_call(item);
    }
  };

  const buttonColor = () => {
    if (type == 'chat') {
      return item.current_status == 'Online'
        ? Colors.green_a
        : item.current_status == 'Busy'
        ? Colors.red_a
        : Colors.grayDark;
    } else {
      return item.current_status_call == 'Online'
        ? Colors.green_a
        : item.current_status_call == 'Busy'
        ? Colors.red_a
        : Colors.grayDark;
    }
  };

  return (
    <TouchableOpacity
      onPress={() => on_submit()}
      style={{
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: Sizes.fixPadding,
        marginTop: Sizes.fixPadding,
        backgroundColor: buttonColor(),
        paddingVertical: Sizes.fixPadding * 0.4,
      }}>
      <Text style={{...Fonts.white14RobotoMedium}}>
        {type == 'chat' ? 'Chat Now' : 'Call Now'}
        {/* {item.current_status == 'Busy' ? (
    <Text style={{...Fonts.white11InterMedium}}>
      {item.max_call_min_last_user} min
    </Text>
  ) : null} */}
      </Text>
    </TouchableOpacity>
  );
};

const AstrologerList = React.memo(
  ({item, navigation, on_chat, type, on_call}) => {
    const chat_call_price = astroData => {
      if (type == 'chat') {
        if (astroData?.Offer_list.length != 0) {
          return MyMethods.calculate_discount_price({
            actualPrice: sum_price({
              firstPrice: parseFloat(astroData?.chat_price_m),
              secondPrice: parseFloat(astroData?.chat_commission),
            }),
            percentage: parseFloat(astroData?.Offer_list[0]?.discount),
          });
        }
        return MyMethods.sum_price({
          firstPrice: parseFloat(astroData?.chat_price_m),
          secondPrice: parseFloat(astroData?.chat_commission),
        });
      } else {
        if (astroData?.Offer_list.length != 0) {
          return MyMethods.calculate_discount_price({
            actualPrice: MyMethods.sum_price({
              firstPrice: parseFloat(astroData?.call_price_m),
              secondPrice: parseFloat(astroData?.call_commission),
            }),
            percentage: parseFloat(astroData?.Offer_list[0]?.discount),
          });
        }
        return MyMethods.sum_price({
          firstPrice: parseFloat(astroData?.call_price_m),
          secondPrice: parseFloat(astroData?.call_commission),
        });
      }
    };

    const chat_call_sum_price = astroData => {
      if (type == 'chat') {
        return MyMethods.sum_price({
          firstPrice: parseFloat(astroData?.chat_price_m),
          secondPrice: parseFloat(astroData?.chat_commission),
        });
      }
      return MyMethods.sum_price({
        firstPrice: parseFloat(astroData?.call_price_m),
        secondPrice: parseFloat(astroData?.call_commission),
      });
    };

    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('astrologerDetailes', {
            data: item?.id,
          })
        }
        activeOpacity={0.8}
        style={styles.itemContainer}>
        <ImageBackground
          source={require('../assets/images/background_1.png')}
          style={{width: '100%', height: 80}}>
          {item?.Offer_list.length != 0 && (
            <View
              style={{
                transform: [{rotate: '-45deg'}],
                backgroundColor: Colors.primaryLight,
                width: '60%',
                left: -20,
                top: 15,
              }}>
              <Text style={{...Fonts.white11InterMedium, textAlign: 'center'}}>
                Offer
              </Text>
            </View>
          )}

          <Image source={{uri: item.image}} style={styles.imageContainer} />
          {item?.verified == '1' && (
            <Image
              source={require('../assets/images/icons/verify.png')}
              style={{
                width: 30,
                height: 30,
                zIndex: 99,
                position: 'absolute',
                alignSelf: 'center',
                bottom: -22,
                zIndex: 2,
              }}
            />
          )}
        </ImageBackground>

        <View
          style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: Sizes.fixPadding * 2.5,
            zIndex: -1,
          }}>
          <Text style={{...Fonts.gray11RobotoRegular}}>
            ({item?.followers})
          </Text>
          <Stars
            default={parseInt(item?.avg_rating)}
            count={5}
            half={true}
            starSize={14}
            disabled={true}
            fullStar={
              <Ionicons name={'star'} size={14} color={Colors.primaryLight} />
            }
            emptyStar={
              <Ionicons
                name={'star-outline'}
                size={14}
                color={Colors.primaryLight}
              />
            }
          />
          <Text numberOfLines={1} style={{...Fonts.black14InterMedium}}>
            {item.owner_name}
          </Text>
          <Text
            numberOfLines={1}
            style={{...Fonts.black12RobotoRegular, fontSize: 9, textAlign: 'center'}}>
            ({item.mainexperties})
          </Text>
          <Text numberOfLines={1} style={{...Fonts.black12RobotoRegular, fontSize: 9, textAlign: 'center'}}>
            {item.language}
          </Text>
          <View style={{...styles.row, marginTop: Sizes.fixPadding * 0.2}}>
            <Ionicons
              name={type == 'chat' ? "chatbubble-ellipses-outline" : 'call-outline'}
              color={item?.moa == '1' ? Colors.primaryLight : Colors.black}
              size={16}
            />
            {item?.Offer_list.length != 0 ? (
              <Text
                style={{
                  ...Fonts.black11InterMedium,
                  marginLeft: Sizes.fixPadding * 0.5,
                }}>
                {item?.moa == '1' && (
                  <Text style={{fontSize: 13, color: Colors.primaryLight}}>
                    {'Free '}
                  </Text>
                )}
                ₹{chat_call_price(item)}
                /min{' '}
                {item?.moa != '1' && <Text style={{fontSize: 9, textDecorationLine: 'line-through'}}>
                  ₹{chat_call_sum_price(item)}
                  /min{' '}
                </Text>}
                
              </Text>
            ) : (
              <Text
                style={{
                  ...Fonts.black11InterMedium,
                  marginLeft: Sizes.fixPadding * 0.5,
                }}>
                {item?.moa == '1' && (
                  <Text style={{fontSize: 13, color: Colors.primaryLight}}>
                    {'Free '}
                  </Text>
                )}
                <Text 
                  style={{
                    textDecorationLine:
                      item?.moa == '1' ? 'line-through' : 'none',
                  }}>
                  ₹{chat_call_sum_price(item)}
                  /min{' '}
                </Text>
              </Text>
            )}
          </View>
          <MyButton
            item={item}
            on_chat={on_chat}
            type={type}
            on_call={on_call}
          />
        </View>
      </TouchableOpacity>
    );
  },
);

export default AstrologerList;

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
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    height: 30,
    borderRadius: 30,
    backgroundColor: Colors.grayLight,
  },
  itemContainer: {
    width: SCREEN_WIDTH * 0.435,
    marginLeft: Sizes.fixPadding * 1.5,
    borderRadius: Sizes.fixPadding,
    overflow: 'hidden',
    elevation: 5,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    marginBottom: Sizes.fixPadding * 1.5,
    shadowColor: Colors.black,
    backgroundColor: Colors.grayLight,
    alignItems: 'center',
  },
  imageContainer: {
    width: SCREEN_WIDTH * 0.15,
    height: SCREEN_WIDTH * 0.15,
    borderRadius: 1000,
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
    marginVertical: Sizes.fixPadding * 0.5,
    position: 'absolute',
    bottom: -22,
    zIndex: 2,
  },
});
