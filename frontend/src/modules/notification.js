// import axios from '../apis';
import { mockNotifications } from '../constants';

const initialState = {
  receivedNotifications: {}
};

export const GET_NOTIFICATIONS_REQUEST =
  'notification/GET_NOTIFICATION_REQUEST';
export const GET_NOTIFICATIONS_SUCCESS =
  'notification/GET_NOTIFICATION_SUCCESS';
export const GET_NOTIFICATIONS_FAILURE =
  'notification/GET_NOTIFICATION_FAILURE';

export const READ_NOTIFICATION_REQUEST = '';
export const READ_ALL_NOTIFICATIONS_REQUEST = '';
export const DELETE_NOTIFICATION_REQUEST = '';

export const getNotifications = () => async (dispatch) => {
  // let res;
  dispatch({ type: 'notification/GET_NOTIFICATION_REQUEST' });
  try {
    // res = await axios.get('notifications');
  } catch (err) {
    dispatch({
      type: 'notification/GET_NOTIFICATION_FAILURE',
      error: err
    });
  }
  dispatch({
    type: 'notification/GET_NOTIFICATION_SUCCESS',
    res: [...mockNotifications]
  });
};

export default function notiReducer(state = initialState, action) {
  switch (action.type) {
    case GET_NOTIFICATIONS_SUCCESS: {
      return {
        ...state,
        receivedNotifications: action.res
      };
    }
    default:
      return state;
  }
}
