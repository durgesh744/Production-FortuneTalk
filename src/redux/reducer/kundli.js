import * as actionTypes from '../actionTypes/kundliActionTypes';

const initialState = {
  panchangData: null,
  currentLatLong: null,
  panchangDataNew: null,
};

const kundli = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case actionTypes.SET_PANCHANG_DATA:
      return {
        ...state,
        panchangData: payload,
      }
    case actionTypes.SET_CURRENT_LAT_LONG:
      return {
        ...state,
        currentLatLong: payload,
      }
    case actionTypes.SET_PANCHANG_NEW:
      return {
       ...state,
        panchangDataNew: payload,
      }
    
    default:
      return state;
  }
};

export default kundli;
