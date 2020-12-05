import axios from '../apis';
import store from '../store';
import { mockNotifications } from '../constants';
import notiReducer, * as actionCreators from './notification';

describe('notificationActions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not modify when append notis fail', async (done) => {
    jest.mock('axios');

    const spy = jest.spyOn(axios, 'get').mockImplementation(() => {
      return new Promise((resolve) => {
        const res = {
          data: {
            results: mockNotifications,
            next: 'next url'
          }
        };
        resolve(res);
      });
    });

    await store.dispatch(actionCreators.getNotifications());
    store.dispatch(actionCreators.appendNotifications()).then(() => {
      const newState = store.getState();
      expect(spy).toHaveBeenCalled();
      expect(newState.notiReducer.receivedNotifications).toMatchObject([
        ...mockNotifications,
        ...mockNotifications
      ]);
      done();
    });
  });

  it(`'getNotifications' should get notification correctly`, (done) => {
    jest.mock('axios');

    const spy = jest.spyOn(axios, 'get').mockImplementation(() => {
      return new Promise((resolve) => {
        const res = {
          data: {
            results: mockNotifications
          }
        };
        resolve(res);
      });
    });

    store.dispatch(actionCreators.getNotifications()).then(() => {
      const newState = store.getState();
      expect(spy).toHaveBeenCalled();
      expect(newState.notiReducer.receivedNotifications).toMatchObject(
        mockNotifications
      );
      done();
    });
  });

  it(`'readNotification' should get notification correctly`, (done) => {
    jest.clearAllMocks();
    jest.mock('axios');
    const spy = jest.spyOn(axios, 'patch').mockImplementation(() => {
      return new Promise((resolve) => {
        const res = {
          data: 'updatedNotification'
        };
        resolve(res);
      });
    });

    store.dispatch(actionCreators.readNotification()).then(() => {
      const newState = store.getState();
      expect(spy).toHaveBeenCalled();
      expect(newState.notiReducer.receivedNotifications).toEqual([
        'updatedNotification'
      ]);
      done();
    });
  });

  it(`'readAllNotification' should get notification correctly`, (done) => {
    jest.mock('axios');

    const spy = jest.spyOn(axios, 'put').mockImplementation(() => {
      return new Promise((resolve) => {
        const res = {
          data: mockNotifications
        };
        resolve(res);
      });
    });

    store.dispatch(actionCreators.readAllNotification()).then(() => {
      const newState = store.getState();
      expect(spy).toHaveBeenCalled();
      expect(newState.notiReducer.receivedNotifications).toMatchObject(
        mockNotifications
      );
      done();
    });
  });

  it(`should dispatch notification/GET_NOTIFICATIONS_FAILURE when api returns error`, async () => {
    jest.mock('axios');
    const spy = jest.spyOn(axios, 'get').mockImplementation(() => {
      return Promise.reject(new Error('error'));
    });

    store.dispatch(actionCreators.getNotifications()).then(() => {
      const newState = store.getState();
      expect(spy).toHaveBeenCalled();
      expect(newState.notiReducer.receivedNotifications).toMatchObject(
        mockNotifications
      );
    });
  });

  it(`should dispatch notification/READ_NOTIFICATION_FAILURE when api returns error`, async () => {
    jest.mock('axios');
    const spy = jest.spyOn(axios, 'patch').mockImplementation(() => {
      return Promise.reject(new Error('error'));
    });

    store.dispatch(actionCreators.readNotification()).then(() => {
      const newState = store.getState();
      expect(spy).toHaveBeenCalled();
      expect(newState.notiReducer.receivedNotifications).toMatchObject(
        mockNotifications
      );
    });
  });

  it(`should dispatch notification/READ_ALL_NOTIFICATION_FAILURE when api returns error`, async () => {
    jest.mock('axios');
    const spy = jest.spyOn(axios, 'put').mockImplementation(() => {
      return Promise.reject(new Error('error'));
    });

    store.dispatch(actionCreators.readAllNotification()).then(() => {
      const newState = store.getState();
      expect(spy).toHaveBeenCalled();
      expect(newState.notiReducer.receivedNotifications).toMatchObject(
        mockNotifications
      );
    });
  });

  it('should add noti to notis when append success', () => {
    const newState = notiReducer(
      {
        receivedNotifications: mockNotifications,
        next: 'testurl'
      },
      {
        type: actionCreators.APPEND_NOTIFICATIONS_SUCCESS,
        results: mockNotifications,
        next: null
      }
    );
    expect(newState).toEqual({
      receivedNotifications: [...mockNotifications, ...mockNotifications],
      next: null
    });
  });

  it('should not add noti to notis when append fails', () => {
    const newState = notiReducer(
      {
        receivedNotifications: mockNotifications,
        next: 'testurl'
      },
      {
        type: actionCreators.APPEND_NOTIFICATIONS_FAILURE,
        results: mockNotifications,
        next: null
      }
    );
    expect(newState).toEqual({
      receivedNotifications: mockNotifications,
      next: 'testurl'
    });
  });
});
