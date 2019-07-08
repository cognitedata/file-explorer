import { createAction } from 'redux-actions';
import PropTypes from 'prop-types';
import { arrayToObjectById } from '../utils/utils';

export const File = PropTypes.shape({
  assetIds: PropTypes.arrayOf(PropTypes.number),
  createdTime: PropTypes.instanceOf(Date),
  lastUpdatedTime: PropTypes.instanceOf(Date),
  uploadedTime: PropTypes.instanceOf(Date),
  name: PropTypes.string,
  mimeType: PropTypes.string,
  id: PropTypes.number,
  source: PropTypes.string,
  uploaded: PropTypes.bool,
});

export const Files = PropTypes.exact({
  byId: PropTypes.objectOf(File),
  isLoading: PropTypes.bool,
});

// Constants
export const ADD_FILES = 'files/ADD_FILES';
export const IS_LOADING = 'files/IS_LOADING';
export const NOT_LOADING = 'files/NOT_LOADING';

// Reducer
const initialState = { byId: {}, isLoading: false };

export default function files(state = initialState, action) {
  switch (action.type) {
    case ADD_FILES: {
      state.byId = { ...state.byId, ...action.payload.items };
      return { ...state };
    }
    case IS_LOADING: {
      return { ...state, isLoading: action.payload.isLoading };
    }

    default:
      return state;
  }
}

// Action creators
const addFiles = createAction(ADD_FILES);

export const actions = {
  addFiles,
};

// Selectors
export const selectFiles = state =>
  state.files || { byId: {}, isLoading: false };

export function fetchFile(fileId, client) {
  return async dispatch => {
    dispatch({ type: IS_LOADING, payload: { isLoading: true } });
    const result = await client.files.retrieve([{ id: fileId }]);
    const items = arrayToObjectById(result);

    dispatch({ type: ADD_FILES, payload: { items } });
    dispatch({ type: IS_LOADING, payload: { isLoading: false } });
  };
}
