import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {BottomSheet} from '@rneui/themed';
import {camera_options} from '../../config/data';
import * as ImagePicker from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Colors, Fonts, Sizes} from '../../assets/style';
import RNFetchBlob from 'rn-fetch-blob';
import {api_url, upload_voice_image_pdf} from '../../config/constants';
import {showToastWithGravityAndOffset} from '../../methods/toastMessage'; 
import {MyMethods} from '../../methods/my_methods';
import {GiftedChat} from 'react-native-gifted-chat';
import database from '@react-native-firebase/database';
import DocumentPicker, {
  DirectoryPickerResponse,
  DocumentPickerResponse,
  isCancel,
  isInProgress,
  types,
} from 'react-native-document-picker';

const PickImage = ({
  updateState,
  customerData,
  customerFirebaseID,
  astroFirebaseID,
  setChatData,
  setUploadProgress,
  setToolTipVisible,
  addMessage,
  astroId
}) => {
  const get_profile_pick = useCallback((type, options) => {
    if (type == 'capture') {
      ImagePicker.launchCamera(options, res => {
        if (res.didCancel) {
          console.log('user cancel');
        } else if (res.errorCode) { 
          console.log(res.errorCode);
        } else if (res.errorMessage) {
          console.log(res.errorMessage);
        } else {
          const sendMessage = {
            _id: MyMethods.generateUniqueId(),
            text: '',
            user: {
              _id: `customer${customerData?.id}`,
              name: customerData?.username,
              // avatar: base_url + userData?.image,
            },
            image: res.assets[0].uri,
            type: 'image',
            // Mark the message as sent, using one tick
            sent: false,
            // Mark the message as received, using two tick
            received: false,
            // Mark the message as pending with a clock loader
            pending: false,
            senderId: `customer${customerData?.id}`,
            receiverId: `astro${astroId}`,
          };

          setChatData(previousMessages =>
            GiftedChat.append(previousMessages, sendMessage),
          );

          uploadImageWithProgress(res.assets[0].uri, res.assets[0].fileName);
        }
      });
    } else {
      ImagePicker.launchImageLibrary(
        {...options, includeBase64: false},
        res => {
          updateState({bottomSheetVisible: false});
          if (res.didCancel) {
            console.log('user cancel');
          } else if (res.errorCode) {
            console.log(res.errorCode);
          } else if (res.errorMessage) {
            console.log(res.errorMessage);
          } else {
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
              image: res.assets[0].uri,
              type: 'image',
              // Mark the message as sent, using one tick
              sent: false,
              // Mark the message as received, using two tick
              received: false,
              // Mark the message as pending with a clock loader
              pending: true,
              senderId: `customer${customerData?.id}`,
              receiverId: `astro${astroId}`,
            };

            setChatData(previousMessages =>
              GiftedChat.append(previousMessages, sendMessage),
            );

            uploadImageWithProgress(res.assets[0].uri, res.assets[0].fileName);
          }
        },
      );
    }
  }, []);

  const uploadImageWithProgress = async (imageUri, fileName) => {
    try {
      await RNFetchBlob.fetch(
        'POST',
        api_url + upload_voice_image_pdf,
        {
          'Content-Type': 'multipart/form-data',
        },
        [
          {
            name: 'image_file',
            filename: `${fileName}.jpg`,
            type: 'jpg/png',
            data: RNFetchBlob.wrap(imageUri),
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
              _id:  `customer${customerData?.id}`,
              name: customerData?.username,
              // avatar: base_url + userData?.image,
            },
            image: data?.data,
            type: 'image',
            // Mark the message as sent, using one tick
            sent: true,
            // Mark the message as received, using two tick
            received: false,
            // Mark the message as pending with a clock loader
            pending: false,
            senderId: `customer${customerData?.id}`,
            receiverId: `astro${astroId}`,
          };

          console.log(sendMessage);
          console.log('hii');
          addMessage(sendMessage);
        })
        .catch(error => {
          console.error('Error uploading audio:', error);
        });
    } catch (e) {
      showToastWithGravityAndOffset('Image sending failed.');
      console.log(e);
    }
  };

  const doucment_pick = async () => {
    try {
      setToolTipVisible(false);
      const pickerResult = await DocumentPicker.pickSingle({
        presentationStyle: 'fullScreen',
        copyTo: 'cachesDirectory',
        type: [types.pdf],
      });

      const sendMessage = {
        _id: MyMethods.generateUniqueId(),
        text: '',
        createdAt: new Date().getTime(),
        addedAt: database.ServerValue.TIMESTAMP,
        user: {
          _id:  `customer${customerData?.id}`,
          name: customerData.username,
          // avatar: base_url + userData?.image,
        },
        file: {
          name: pickerResult?.name,
          uri: pickerResult?.fileCopyUri,
          size: pickerResult?.size,
        },
        type: 'file',
        // Mark the message as sent, using one tick
        sent: false,
        // Mark the message as received, using two tick
        received: false,
        // Mark the message as pending with a clock loader
        pending: true,
        senderId: `customer${customerData?.id}`,
        receiverId: `astro${astroId}`,
      };

      setChatData(previousMessages =>
        GiftedChat.append(previousMessages, sendMessage),
      );

      uploadPdfWithProgress(
        pickerResult?.fileCopyUri,
        pickerResult?.name,
        pickerResult?.size,
      );
    } catch (e) {
      handleError(e);
    }
  };

  const uploadPdfWithProgress = async (pdfUri, fileName, size) => {
    try {
      await RNFetchBlob.fetch(
        'POST',
        api_url + upload_voice_image_pdf,
        {
          'Content-Type': 'multipart/form-data',
        },
        [
          {
            name: 'pdf_file',
            filename: `${fileName}.pdf`,
            type: 'file/pdf',
            data: RNFetchBlob.wrap(pdfUri),
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
            file: {
              name: fileName,
              uri: data.data,
              size: size,
            },
            type: 'file',
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
    <View style={[styles.row]}>
      <TouchableOpacity
        onPress={() => {
          get_profile_pick(camera_options[0].type, camera_options[0].options);
        }}>
        <Ionicons name="camera" color={Colors.white} size={28} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          get_profile_pick(camera_options[1].type, camera_options[1].options);
        }}
        style={{marginHorizontal: Sizes.fixPadding}}>
        <Ionicons name="image" color={Colors.white} size={28} />
      </TouchableOpacity>
      <TouchableOpacity onPress={doucment_pick}>
        <Ionicons name="document-attach-sharp" color={Colors.white} size={28} />
      </TouchableOpacity>
    </View>
  );
};

export default PickImage;

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
