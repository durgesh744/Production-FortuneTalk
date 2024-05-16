import {all} from 'redux-saga/effects';
import chatSaga from './chatSaga';
import kundliSaga from './kundliSaga';

export default function* rootSaga() {
  yield all([chatSaga(), kundliSaga()]);
}
