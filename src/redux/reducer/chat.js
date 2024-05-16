import * as chatActionTypes from '../actionTypes/chatActionTypes';

const initialState = {
  inVoiceId: null,
  startTime: null,
  customerFirebaseID: null,
  astroFirebaseID: null,
  invoiceData: null,
  timeout: null,
  initiatedData: null
};

const chat = (state = initialState, action) => {
  const {type, payload} = action;
  switch (type) {
    case chatActionTypes.SET_CUSTOMER_FIREBASE_ID: {
      return {
        ...state,
        customerFirebaseID: payload,
      };
    }
    case chatActionTypes.SET_ASTRO_FRITEBASE_ID: {
      return {
        ...state,
        astroFirebaseID: payload,
      };
    }
    case chatActionTypes.SET_INVOICE_DATA:{
      return {
        ...state,
        invoiceData: payload
      }
    }
    case chatActionTypes.SET_CHAT_INITIATED:{
      return {
        ...state,
        initiatedData: payload,
      }
    }
    default: {
      return state;
    }
  }
};

export default chat;
