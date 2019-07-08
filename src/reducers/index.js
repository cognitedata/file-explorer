import { combineReducers } from 'redux';
import files from '../modules/files';

const rootReducer = combineReducers({
  files,
});

export default rootReducer;
