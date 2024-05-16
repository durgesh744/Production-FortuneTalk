import * as actionTypes from '../actionTypes/actionTypes';

const initialState = {
  notificationData: null,
  unseenNotification: 0,
};

const notifications = (state = initialState, action) => {
  const {type, payload} = action;
  switch (type) {
    case actionTypes.SET_NOTIFICATIONS:
      return {
        ...state,
        notificationData: payload,
      };
    case actionTypes.SET_UNSEEN_NOTIFICATION:
      return {
        ...state,
        unseenNotification: payload,
      };
    default:
      return state;
  }
};

export default notifications;
