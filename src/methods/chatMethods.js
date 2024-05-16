import database from '@react-native-firebase/database';
import moment from 'moment';

class _ChatMethods {
  send_message = ({
    message = {
      from: '',
      message: '',
      image: '',
      voice: '',
      pdf: '',
      timestamp: '',
      to: '',
      type: '',
    },
    customerFirebaseID = null,
    astroFirebaseID = null,
    astroID,
    customerID,
  }) => {
    try {
      const node = database().ref(`/UserId/${astroID}`).push();
      const key = node.key;
      database()
        .ref(`/Messages/${customerFirebaseID}/${astroFirebaseID}/${key}`)
        .set(message);
      database()
        .ref(`/Messages/${astroFirebaseID}/${customerFirebaseID}/${key}`)
        .set(message);
      database().ref(`/Chat/${customerFirebaseID}/${astroFirebaseID}`).update(message);
      database().ref(`/Chat/${astroFirebaseID}/${customerFirebaseID}`).update(message);
    } catch (e) {
      console.log(e);
    }
  };

  end_chat_in_firebase = ({
    customerFirebaseID = null,
    astroFirebaseID = null,
    customerID = null,
    astroID = null,
  }) => {
    try {
      const send_msg = {
        message: 'User ended the chat.',
        timestamp: moment(new Date()).format('DD-MM-YYYY HH:MM:ss '),
        to: snapshot.val(),
        type: 'text',
      };
      const node = database().ref(`/UserId/${astroID}`).push();
      const key = node.key;
      database()
        .ref(`/Messages/${customerFirebaseID}/${astroFirebaseID}/${key}`)
        .set({
          from: customerFirebaseID,
          image: 'image = null',
          message: 'User ended the chat.',
          timestamp: new Date().getTime(),
          to: astroFirebaseID,
          type: 'text',
        });
      database()
        .ref(`/Messages/${astroFirebaseID}/${customerFirebaseID}/${key}`)
        .set({
          from: customerFirebaseID,
          image: 'image = null',
          message: 'User ended the chat.',
          timestamp: new Date().getTime(),
          to: astroFirebaseID,
          type: 'text',
        });
      database()
        .ref(`/Chat/${customerFirebaseID}/${astroFirebaseID}`)
        .update(send_msg);
      database()
        .ref(`/Chat/${astroFirebaseID}/${customerFirebaseID}`)
        .update(send_msg);

      const nodeRef_a = database().ref(
        `/CustomerCurrentRequest/${userData.id}`,
      );
      nodeRef_a.update({
        astroData: '',
        trans_id: '',
        chat_id: '',
        status: 'End',
      });
    } catch (e) {
      console.log(e);
    }
  };
}

export const ChatMethods = new _ChatMethods();
