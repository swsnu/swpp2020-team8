import axios from '../apis';

const initialState = {
  receivedNotifications: []
};

export const GET_NOTIFICATIONS_REQUEST =
  'notification/GET_NOTIFICATION_REQUEST';
export const GET_NOTIFICATIONS_SUCCESS =
  'notification/GET_NOTIFICATION_SUCCESS';
export const GET_NOTIFICATIONS_FAILURE =
  'notification/GET_NOTIFICATION_FAILURE';

export const READ_NOTIFICATION_REQUEST =
  'notification/READ_NOTIFICATION_REQUEST';
export const READ_NOTIFICATION_SUCCESS =
  'notification/READ_NOTIFICATION_SUCCESS';
export const READ_NOTIFICATION_FAILURE =
  'notification/READ_NOTIFICATION_FAILURE';
export const READ_ALL_NOTIFICATIONS_REQUEST = '';
export const DELETE_NOTIFICATION_REQUEST = '';

export const getNotifications = () => async (dispatch) => {
  let res;
  dispatch({ type: 'notification/GET_NOTIFICATION_REQUEST' });
  try {
    res = await axios.get('/notifications/');
  } catch (err) {
    dispatch({
      type: 'notification/GET_NOTIFICATION_FAILURE',
      error: err
    });
  }

  if (res?.data) {
    dispatch({
      type: 'notification/GET_NOTIFICATION_SUCCESS',
      res: res.data.results
    });
  }
};

export const readNotification = (id) => async (dispatch) => {
  let res;
  dispatch({ type: 'notification/READ_NOTIFICATION_REQUEST' });
  try {
    res = await axios.patch(`/notifications/${id}/`, { is_read: true });
  } catch (err) {
    dispatch({ type: 'notification/READ_NOTIFICATION_FAILURE', error: err });
  }
  dispatch({
    type: 'notification/READ_NOTIFICATION_SUCCESS',
    res: res.data
  });
};

export default function notiReducer(state = initialState, action) {
  switch (action.type) {
    case GET_NOTIFICATIONS_SUCCESS:
      return {
        ...state,
        receivedNotifications: action.res
      };
    case READ_NOTIFICATION_SUCCESS:
      const updatedNotification = action.res;
      const updatedNotificationIndex = state.receivedNotifications.findIndex(
        (noti) => noti.id === updatedNotification.id
      );
      return {
        ...state,
        receivedNotifications: [
          ...state.receivedNotifications.slice(0, updatedNotificationIndex),
          updatedNotification,
          ...state.receivedNotifications.slice(updatedNotificationIndex + 1)
        ]
      };
    default:
      return state;
  }
}
