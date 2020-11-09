import { createSelector } from 'reselect';

export const getUser = (state) => state.user.user;
export const getUserName = createSelector([getUser], (user) => {
  return user?.username;
});

export const getUserError = (state) => state.user.error;

export const getIsLoggedIn = createSelector(
  [getUser, getUserError],
  (user, error) => {
    return user && user.id && user.username && !error;
  }
);
