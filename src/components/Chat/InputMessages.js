import {
  View,
  Text,
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  PermissionsAndroid,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Colors, Fonts, Sizes} from '../../assets/style';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  OutputFormatAndroidType,
} from 'react-native-audio-recorder-player';
import {Divider, Input} from '@rneui/themed';
import RNFetchBlob from 'rn-fetch-blob';
import {api_url, upload_voice_image_pdf} from '../../config/constants';
import Tooltip from 'react-native-walkthrough-tooltip';
import {GiftedChat, InputToolbar, Send} from 'react-native-gifted-chat';
import database from '@react-native-firebase/database';
import {MyMethods} from '../../methods/my_methods';
import PickImage from './PickImage';

const audioRecorderPlayer = new AudioRecorderPlayer();
audioRecorderPlayer.setSubscriptionDuration(0.1);
const InputMessages = ({
  updateState,
  bottomSheetVisible,
  setChatData,
  add_message,
  customerFirebaseID,
  astroFirebaseID,
  setUploadProgress,
  onSend,
  customOnPress,
  sendButtonProps,
  sendProps,
  addMessage,
  customerData,
  astroId,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordeTime, setRecordTime] = useState(null);
  const [toolTipVisible, setToolTipVisible] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    return () => {
      audioRecorderPlayer.removeRecordBackListener();
    };
  }, []);

  const reuestPermissionForRecord = async () => {
    if (Platform.OS === 'android') {
      try {
        const result = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        );
        if (result) {
          startRecording();
        } else {
          const grants = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          ]);
          if (
            grants['android.permission.RECORD_AUDIO'] ===
            PermissionsAndroid.RESULTS.GRANTED
          ) {
            console.log('Permissions granted');
            startRecording();
          } else {
            console.log('All required permissions not granted');
          }
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    }
  };

  const startRecording = async () => {
    try {
      setIsRecording(true);
      const path = Platform.select({
        ios: undefined,
        android: undefined,
      });
      const audioSet = {
        AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
        AudioSourceAndroid: AudioSourceAndroidType.MIC,
        AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
        AVNumberOfChannelsKeyIOS: 2,
        AVFormatIDKeyIOS: AVEncodingOption.aac,
        OutputFormatAndroid: OutputFormatAndroidType.DEFAULT,
      };
      await audioRecorderPlayer.startRecorder(path, audioSet);
      audioRecorderPlayer.addRecordBackListener(e => {
        setRecordTime(
          audioRecorderPlayer.mmss(Math.floor(e.currentPosition / 1000)),
        );
      });
    } catch (e) {
      setIsRecording(false);
      console.log(e);
    }
  };

  const onStopRecording = async () => {
    try {
      if (!isRecording) return;
      const result = await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      setIsRecording(false);
      setRecordTime(null);
      if (recordeTime <= 1 || recordeTime == null) {
        return;
      }
      const sendMessage = {
        _id: MyMethods.generateUniqueId(),
        text: '',
        createdAt: new Date().getTime(),
        addedAt: database.ServerValue.TIMESTAMP,
        user: {
          _id: `customer${customerData?.id}`,
          name: customerData.username,
          // avatar: base_url + userData?.image,
        },
        voice: result,
        type: 'voice',
        // Mark the message as sent, using one tick
        sent: false,
        // Mark the message as received, using two tick
        received: true,
        // Mark the message as pending with a clock loader
        pending: true,
        senderId: `customer${customerData?.id}`,
        receiverId: `astro${astroId}`,
      };

      setChatData(previousMessages =>
        GiftedChat.append(previousMessages, sendMessage),
      );
      uploadVoiceWithProgress(result, Math.random(0, 100000).toString());
    } catch (e) {
      console.log(e, 'this is  error');
      setIsRecording(false);
    }
  };

  const uploadVoiceWithProgress = async (voiceUri, fileName) => {
    try {
      await RNFetchBlob.fetch(
        'POST',
        api_url + upload_voice_image_pdf,
        {
          'Content-Type': 'multipart/form-data',
        },
        [
          {
            name: 'voice_file',
            filename: `${fileName}.mp3`,
            type: 'audio/mp3',
            data: RNFetchBlob.wrap(voiceUri),
          },
        ],
      )
        .uploadProgress((written, total) => {
          setUploadProgress(written / total);
        })
        .then(response => {
          const data = JSON.parse(response.data);
          console.log('Audio uploaded successfully:', data);
          setUploadProgress(0);

          const sendMessage = {
            _id: MyMethods.generateUniqueId(),
            text: '',
            createdAt: new Date().getTime(),
            addedAt: database.ServerValue.TIMESTAMP,
            user: {
              _id: `customer${customerData?.id}`,
              name: customerData.username,
              // avatar: base_url + userData?.image,
            },
            voice: data.data,
            type: 'voice',
            // Mark the message as sent, using one tick
            sent: true,
            // Mark the message as received, using two tick
            received: false,
            // Mark the message as pending with a clock loader
            pending: false,
            senderId: `customer${customerData?.id}`,
            receiverId: `astro${astroId}`,
          };

          addMessage(sendMessage);
        })
        .catch(error => {
          console.error('Error uploading audio:', error);
        });

      // const downloadURL = await ref.getDownloadURL();
      // return downloadURL;
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <InputToolbar
      placeHolder={'Enter message...'}
      // renderAccessory={()=><TextInput placeholder='sfsfs' />}
      renderComposer={() => (
        <>
          {recordeTime != null ? (
            <View
              style={{
                width: '60%',
                height: '100%',
                left: Sizes.fixPadding * 4,
                zIndex: 99,
              }}>
              <Text style={{...Fonts.black16RobotoRegular}}>{recordeTime}</Text>
            </View>
          ) : (
            <TextInput
              value={message}
              placeholder="Enter message..."
              placeholderTextColor={Colors.gray}
              enablesReturnKeyAutomatically={false}
              multiline
              style={{
                flex: 1,
                ...Fonts.black14RobotoRegular,
                paddingVertical: 10,
              }}
              onChangeText={setMessage}
            />
          )}
        </>
      )}
      renderActions={() => (
        <View style={{flexDirection: 'row', paddingBottom: 10}}>
          <Tooltip
            isVisible={toolTipVisible}
            content={
              <PickImage
                updateState={updateState}
                setChatData={setChatData}
                setToolTipVisible={setToolTipVisible}
                setUploadProgress={setUploadProgress}
                astroFirebaseID={astroFirebaseID}
                customerData={customerData}
                customerFirebaseID={customerFirebaseID}
                addMessage={addMessage}
                astroId={astroId}
              />
            }
            placement="top"
            backgroundColor={Colors.black + '20'}
            onClose={() => setToolTipVisible(false)}
            tooltipStyle={{width: 120}}
            contentStyle={{backgroundColor: Colors.blackLight}}>
            <TouchableOpacity
              onPress={() => setToolTipVisible(true)}
              style={{transform: [{rotate: '45deg'}]}}>
              <Ionicons name="attach" color={Colors.blackLight} size={28} />
            </TouchableOpacity>
          </Tooltip>

          <TouchableOpacity
            onLongPress={reuestPermissionForRecord}
            onPressOut={onStopRecording}
            style={{transform: [{rotate: '0deg'}]}}>
            <Ionicons name="mic-sharp" color={Colors.blackLight} size={28} />
          </TouchableOpacity>

          <Divider
            orientation="vertical"
            color={Colors.gray}
            style={{
              height: 1,
              marginHorizontal: Sizes.fixPadding * 0.5,
            }}
          />
        </View>
      )}
      renderSend={() => (
        <Send
          containerStyle={{justifyContent: 'center', marginBottom: 5}}
          {...sendProps}
          sendButtonProps={{
            ...sendButtonProps,
            onPress: () => {
              setMessage(''), customOnPress(message, onSend);
            },
          }}
          disabled={message.length == 0 || message.trim() === ''}
          onPress={() => {
            // add_message({type: 'text', message: message});
            onSend();
            setMessage('');
          }}>
          <View
            style={{
              paddingHorizontal: Sizes.fixPadding * 2,
              paddingVertical: Sizes.fixPadding * 0.7,
              borderRadius: 1000,
              backgroundColor: Colors.primaryLight,
            }}>
            <Text style={{...Fonts.white14RobotoMedium}}>Send</Text>
          </View>
        </Send>
      )}
      primaryStyle={{alignItems: 'flex-end', backgroundColor: Colors.white}}
    />
  );
};

export default InputMessages;

const styles = StyleSheet.create({
  row: {
    flex: 0,
    flexDirection: 'row',
    // alignItems: 'center',
    // maxHeight: 300
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: Colors.whiteDark,
    borderTopLeftRadius: Sizes.fixPadding * 4,
    elevation: 8,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowColor: Colors.blackLight,
  },
});
