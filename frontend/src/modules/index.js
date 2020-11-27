import { combineReducers } from 'redux';
import friendReducer from './friend';
import notiReducer from './notification';
import postReducer from './post';
import questionReducer from './question';
import userReducer from './user';
import loadingReducer from './loading';
import likeReducer from './like';

const rootReducer = combineReducers({
  friendReducer,
  notiReducer,
  postReducer,
  likeReducer,
  questionReducer,
  userReducer,
  loadingReducer
});

export default rootReducer;
