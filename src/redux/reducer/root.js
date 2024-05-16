import {combineReducers} from 'redux';
import {CLEAN_STORE} from '../actionTypes/actionTypes';
import user from './user';
import notifications from './notifications';
import chat from './chat'
import liveClass from './liveClass';
import kundli from './kundli';

const rootReducer = combineReducers({
  user,
  notifications,
  chat,
  liveClass,
  kundli
});

const appReducer = (state, action) => {
  if (action.type == CLEAN_STORE) {
    state = undefined;
  }
  return rootReducer(state, action);
};

export default appReducer;
