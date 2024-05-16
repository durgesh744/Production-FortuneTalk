import * as actionTypes from '../actionTypes/actionTypes';

export const setUserData = payload => ({
  type: actionTypes.SET_USER_DATA,
  payload,
});

export const setWallet = payload => ({
  type: actionTypes.SET_WALLET,
  payload,
});

export const setToken = payload => ({
  type: actionTypes.SET_TOKEN,
  payload,
});

export const setLocation = payload => ({
  type: actionTypes.SET_LOCATION,
  payload,
});

export const setMaleLocation = payload => ({
  type: actionTypes.SET_MALE_LOCATION,
  payload,
});

export const setFemaleLocation = payload => ({
  type: actionTypes.SET_FEMALE_LOCATION,
  payload,
});

export const setFirebaseId = payload => ({
  type: actionTypes.SET_FIREBASE_ID,
  payload,
});

export const setISLogged = payload =>({
  type: actionTypes.SET_IS_LOGGED,
  payload
})

export const setCleanStore = payload => ({
  type: actionTypes.CLEAN_STORE,
  payload,
});
