import {call, takeEvery} from 'redux-saga/effects';
import {ApiRequest} from '../../config/api_requests';
import {api_url, update_intake_status} from '../../config/constants';
import * as actionTypes from '../actionTypes/chatActionTypes';
import database from '@react-native-firebase/database';
import { showToastWithGravityAndOffset } from '../../methods/toastMessage';

const updateDataInFirebase = astro_id => {
  const dataRef = database().ref(`CurrentRequest/${astro_id}`);
  return dataRef.update({
    status: 'timeOver',
  });
};

function* upadateChatStatus(actions) {
  try {
    const {payload} = actions;
    console.log(payload)
    const response = yield ApiRequest.postRequest({
      url: api_url + update_intake_status,
      data: payload,
    });

    yield call(updateDataInFirebase, payload?.request_id);
    showToastWithGravityAndOffset('Chat Not Connected')
  } catch (e) {
    console.log(e);
  }
}

export default function* chatSaga() {
  yield takeEvery(actionTypes.UPDATAE_CURRENT_CHAT_STATUS, upadateChatStatus);
}
