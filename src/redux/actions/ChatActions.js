import * as chatActionTypes from '../actionTypes/chatActionTypes';

export const setCustomerFirebaseId = payload => ({
  type: chatActionTypes.SET_CUSTOMER_FIREBASE_ID,
  payload,
});

export const setAstroFirebaseId = payload => ({
  type: chatActionTypes.SET_ASTRO_FRITEBASE_ID,
  payload,
});

export const setInvoiceData = payload =>({
  type: chatActionTypes.SET_INVOICE_DATA,
  payload
})


export const updateIntiatedChat = payload =>({
  type: chatActionTypes.UPDATAE_CURRENT_CHAT_STATUS,
  payload
})