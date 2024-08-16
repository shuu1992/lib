// third-party
import { combineReducers } from 'redux';

// project import
import global from './global';
import auth from './auth';
import menu from './menu';
// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({
  global,
  auth,
  menu,
});

export default reducers;
