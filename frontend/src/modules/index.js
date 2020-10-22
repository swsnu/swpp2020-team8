import { combineReducers } from 'redux';
import friendReducer from './friend';
import notiReducer from './notification';
import postReducer from './post';
import questionReducer from './question';
import userReducer from './user';

const rootReducer = combineReducers({
  friendReducer,
  notiReducer,
  postReducer,
  questionReducer,
  userReducer
});

export default rootReducer;
