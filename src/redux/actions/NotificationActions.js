import * as actionTypes from '../actionTypes/actionTypes';

export const setNotifications = payload => ({
  type: actionTypes.SET_NOTIFICATIONS,
  payload,
});

export const setUnseenNotification = payload => ({
  type: actionTypes.SET_UNSEEN_NOTIFICATION,
  payload,
});
