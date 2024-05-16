import * as actionTypes from '../actionTypes/actionTypes';

const initialState = {
  userData: null,
  tokenData: null,
  wallet: 0,
  selectedLocation: null,
  maleLocation: null,
  femaleLocation: null,
  firebaseId: null,
  isLogged: false
};

const user = (state = initialState, action) => {
  const {type, payload} = action;

  switch (type) {
    case actionTypes.SET_USER_DATA:
      return {
        ...state,
        userData: payload,
      };

    case actionTypes.SET_TOKEN:
      return {
        ...state,
        tokenData: payload,
      };

    case actionTypes.SET_WALLET:
      return {
        ...state,
        wallet: payload,
      };

    case actionTypes.SET_LOCATION:
      return {
        ...state,
        selectedLocation: payload,
      };

    case actionTypes.SET_MALE_LOCATION:
      return {
        ...state,
        maleLocation: payload,
      };
    case actionTypes.SET_FEMALE_LOCATION:
      return {
        ...state,
        femaleLocation: payload,
      };
    case actionTypes.SET_FIREBASE_ID:
      return {
        ...state,
        firebaseId: payload,
      };

      case actionTypes.SET_IS_LOGGED:
        return {
          ...state,
          isLogged: payload,
        };

    default:
      return state;
  }
};

export default user;
