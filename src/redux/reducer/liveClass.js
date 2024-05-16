import * as Actions from '../actionTypes/actionTypes';

const initialState = {
  commentsData: [],
  commentsLength: 0,
};

const liveClass = (state = initialState, actions) => {
  const {payload, type} = actions;

  switch (type) {
    case Actions.SET_LIVE_CLASS_COMMENTS: {
      return {
        ...state,
        commentsData: payload,
        commentsLength: payload.length,
      };
    }
    default: {
      return state;
    }
  }
};

export default liveClass;
