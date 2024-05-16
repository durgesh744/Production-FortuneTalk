import {call, put, takeEvery, takeLeading} from 'redux-saga/effects';
import {ApiRequest} from '../../config/api_requests';
import {advanced_panchang, api_url,} from '../../config/constants';
import * as actionTypes from '../actionTypes/kundliActionTypes';

function* getPanchangData(actions) {
  try {
    const {payload} = actions;
    const response = yield ApiRequest.postRequest({
      url: api_url + advanced_panchang,
      data: payload,
    });
    if(response.status){
      yield put({type: actionTypes.SET_PANCHANG_DATA, payload: response?.advanced_panchang})
    }
  } catch (e) {
    console.log(e);
  }
}

export default function* kundliSaga() {
  yield takeLeading(actionTypes.GET_PANCHANG_DATA, getPanchangData);
}
