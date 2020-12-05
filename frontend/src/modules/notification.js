import axios from '../apis';

const initialState = {
  receivedNotifications: [],
  next: null
};

export const GET_NOTIFICATIONS_REQUEST =
  'notification/GET_NOTIFICATION_REQUEST';
export const GET_NOTIFICATIONS_SUCCESS =
  'notification/GET_NOTIFICATION_SUCCESS';
export const GET_NOTIFICATIONS_FAILURE =
  'notification/GET_NOTIFICATION_FAILURE';

export const APPEND_NOTIFICATIONS_REQUEST =
  'notification/APPEND_NOTIFICATION_REQUEST';
export const APPEND_NOTIFICATIONS_SUCCESS =
  'notification/APPEND_NOTIFICATION_SUCCESS';
export const APPEND_NOTIFICATIONS_FAILURE =
  'notification/APPEND_NOTIFICATION_FAILURE';

export const READ_NOTIFICATION_REQUEST =
  'notification/READ_NOTIFICATION_REQUEST';
export const READ_NOTIFICATION_SUCCESS =
  'notification/READ_NOTIFICATION_SUCCESS';
export const READ_NOTIFICATION_FAILURE =
  'notification/READ_NOTIFICATION_FAILURE';

export const READ_ALL_NOTIFICATIONS_REQUEST =
  'notification/READ_ALL_NOTIFICATIONS_REQUEST';
export const READ_ALL_NOTIFICATIONS_SUCCESS =
  'notification/READ_ALL_NOTIFICATIONS_SUCCESS';
export const READ_ALL_NOTIFICATIONS_FAILURE =
  'notification/READ_ALL_NOTIFICATIONS_FAILURE';

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
    return;
  }
  dispatch({
    type: 'notification/GET_NOTIFICATION_SUCCESS',
    res: res?.data.results,
    next: res?.data.next
  });
};

export const appendNotifications = () => async (dispatch, getState) => {
  const { next } = getState().notiReducer;
  if (!next) return;
  const nextUrl = next.replace('localhost:8000', 'localhost:3000');
  let result;
  dispatch({ type: APPEND_NOTIFICATIONS_REQUEST });
  try {
    result = await axios.get(nextUrl);
  } catch (err) {
    dispatch({ type: APPEND_NOTIFICATIONS_FAILURE, error: err });
    return;
  }
  const { data } = result;
  dispatch({
    type: APPEND_NOTIFICATIONS_SUCCESS,
    results: data?.results,
    next: data?.next
  });
};

export const readNotification = (id) => async (dispatch) => {
  let res;
  dispatch({ type: 'notification/READ_NOTIFICATION_REQUEST' });
  try {
    res = await axios.patch(`/notifications/${id}/`, { is_read: true });
  } catch (err) {
    dispatch({ type: 'notification/READ_NOTIFICATION_FAILURE', error: err });
    return;
  }
  dispatch({
    type: 'notification/READ_NOTIFICATION_SUCCESS',
    res: res.data
  });
};

export const readAllNotification = () => async (dispatch) => {
  let res;
  dispatch({ type: 'notification/READ_ALL_NOTIFICATIONS_REQUEST' });
  try {
    res = await axios.put(`/notifications/`);
  } catch (err) {
    dispatch({
      type: 'notification/READ_ALL_NOTIFICATIONS_FAILURE',
      error: err
    });
    return;
  }
  dispatch({
    type: 'notification/READ_ALL_NOTIFICATIONS_SUCCESS',
    res: res.data
  });
};

export default function notiReducer(state = initialState, action) {
  switch (action.type) {
    case GET_NOTIFICATIONS_SUCCESS:
      return {
        ...state,
        receivedNotifications: action.res,
        next: action.next
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
    case APPEND_NOTIFICATIONS_SUCCESS:
      return {
        ...state,
        receivedNotifications: state.receivedNotifications
          ? [...state.receivedNotifications, ...action.results]
          : [...action.results],
        next: action.next
      };
    case READ_ALL_NOTIFICATIONS_SUCCESS:
      return {
        ...state,
        receivedNotifications: action.res,
        next: action.next
      };
    default:
      return state;
  }
}
