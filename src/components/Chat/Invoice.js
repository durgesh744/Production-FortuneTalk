import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {Modal, Portal} from 'react-native-paper';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../config/Screen';
import LinearGradient from 'react-native-linear-gradient';
import {Colors, Fonts, Sizes} from '../../assets/style';
import {connect} from 'react-redux';
import * as ChatActions from '../../redux/actions/ChatActions';

const Invoice = ({invoiceVisible, updateState, dispatch, invoiceData}) => {
  const formatTime = leftTime => {
    const seconds = parseFloat(leftTime).toFixed(0);
    let hours = Math.floor(seconds / 3600);
    let minutes = Math.floor((seconds % 3600) / 60);
    let remainingSeconds = seconds % 60;

    // Add leading zeros if needed
    hours = hours < 10 ? `0${hours}` : hours;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    remainingSeconds =
      remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

    return `${hours}:${minutes}:${remainingSeconds}`;
  };
  return (
    <Portal>
      <Modal visible={invoiceVisible} onDismiss={() => {}}>
        <View
          style={{
            backgroundColor: 'transparent',
            height: SCREEN_HEIGHT,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <LinearGradient
              colors={[Colors.primaryLight, Colors.primaryDark]}
              style={{
                width: SCREEN_WIDTH * 0.8,
                borderRadius: Sizes.fixPadding * 2,
              }}>
              <View
                style={{
                  borderBottomColor: Colors.white,
                  borderBottomWidth: 1,
                  paddingHorizontal: Sizes.fixPadding * 2,
                  paddingTop: Sizes.fixPadding * 2.5,
                  paddingBottom: Sizes.fixPadding,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    ...Fonts.black18RobotoMedium,
                    color: Colors.white,
                    textAlign: 'center',
                  }}>
                  Thanks for Choosing {'\n'} Fortune Talk
                </Text>
              </View>
              <View style={{padding: Sizes.fixPadding * 2}}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: Sizes.fixPadding,
                  }}>
                  <Text
                    style={{
                      ...Fonts.black14RobotoRegular,
                      color: Colors.white,
                    }}>
                    Finished ID:
                  </Text>
                  <Text
                    style={{
                      ...Fonts.black14RobotoRegular,
                      color: Colors.white,
                    }}>
                    {invoiceData?.chat_id}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: Sizes.fixPadding,
                  }}>
                  <Text
                    style={{
                      ...Fonts.black14RobotoRegular,
                      color: Colors.white,
                    }}>
                    Time:
                  </Text>
                  <Text
                    style={{
                      ...Fonts.black14RobotoRegular,
                      color: Colors.white,
                    }}>
                    {formatTime(invoiceData?.time ?? 0)}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: Sizes.fixPadding,
                  }}>
                  <Text
                    style={{
                      ...Fonts.black14RobotoRegular,
                      color: Colors.white,
                    }}>
                    Charge:
                  </Text>
                  <Text
                    style={{
                      ...Fonts.black14RobotoRegular,
                      color: Colors.white,
                    }}>
                    {parseFloat(invoiceData?.charge ?? 0).toFixed(2)}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: Sizes.fixPadding,
                  }}>
                  <Text
                    style={{
                      ...Fonts.black14RobotoRegular,
                      color: Colors.white,
                    }}>
                    Promotion:
                  </Text>
                  <Text
                    style={{
                      ...Fonts.black14RobotoRegular,
                      color: Colors.white,
                    }}>
                    {parseFloat(invoiceData?.pormotion_charge ?? 0).toFixed(2)}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: Sizes.fixPadding,
                  }}>
                  <Text
                    style={{
                      ...Fonts.black14RobotoRegular,
                      color: Colors.white,
                    }}>
                    Total Charge:
                  </Text>
                  <Text
                    style={{
                      ...Fonts.black14RobotoRegular,
                      color: Colors.white,
                    }}>
                    {parseFloat(invoiceData?.total_charge ?? 0).toFixed(2)}
                  </Text>
                </View>
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: Sizes.fixPadding * 1.5,
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      dispatch(ChatActions.setInvoiceData(null));
                      updateState({
                        invoiceVisible: false,
                        reviewModalVisible: true,
                      });
                    }}
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: Sizes.fixPadding * 2.5,
                      paddingVertical: Sizes.fixPadding,
                      paddingHorizontal: Sizes.fixPadding * 5,
                      backgroundColor: Colors.white,
                      elevation: 10,
                      shadowColor: Colors.black,
                      shadowOffset: {
                        width: 5,
                        height: 5,
                      },
                      shadowRadius: 5,
                      shadowOpacity: 0.8,
                    }}>
                    <Text
                      style={{
                        ...Fonts.black16RobotoRegular,
                        color: Colors.primaryDark,
                      }}>
                      OK
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </LinearGradient>
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

const mapStateToProps = state => ({
  invoiceData: state.chat.invoiceData,
});

const mapDispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, mapDispatchToProps)(Invoice);
