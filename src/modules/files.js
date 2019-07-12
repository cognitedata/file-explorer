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
  notFound: PropTypes.bool,
});

// Constants
export const ADD_FILES = 'files/ADD_FILES';
export const NOT_FOUND = 'files/NOT_FOUND';
export const IS_LOADING = 'files/IS_LOADING';

// Reducer
const initialState = { byId: {}, isLoading: false, notFound: false };

export default function files(state = initialState, action) {
  switch (action.type) {
    case ADD_FILES: {
      return { ...state, byId: { ...state.byId, ...action.payload.items } };
    }
    case IS_LOADING: {
      return { ...state, isLoading: action.payload.value };
    }
    case NOT_FOUND: {
      return { ...state, notFound: action.payload.value };
    }

    default:
      return state;
  }
}

// Action creators
const addFiles = createAction(ADD_FILES);
const notFound = createAction(NOT_FOUND);
const isLoading = createAction(IS_LOADING);

export const actions = {
  addFiles,
  isLoading,
  notFound,
};

// Selectors
export const selectFiles = state =>
  state.files || { byId: {}, isLoading: false, notFound: false };

export function fetchFile(fileId, client) {
  return async dispatch => {
    dispatch({ type: IS_LOADING, payload: { value: true } });
    dispatch({ type: NOT_FOUND, payload: { value: false } });
    try {
      const result = await client.files.retrieve([{ id: fileId }]);
      const items = arrayToObjectById(result);

      dispatch({ type: ADD_FILES, payload: { items } });
      dispatch({ type: IS_LOADING, payload: { value: false } });
    } catch (error) {
      dispatch({ type: NOT_FOUND, payload: { value: true } });
    }
  };
}
