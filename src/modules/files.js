import { createAction } from 'redux-actions';
import PropTypes from 'prop-types';
import { arrayToObjectById } from '../utils/utils';

function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = [].slice.call(new Uint8Array(buffer));

  bytes.forEach(b => {
    binary += String.fromCharCode(b);
  });

  return window.btoa(binary);
}

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
  previewData: PropTypes.any,
});

// Constants
export const ADD_FILES = 'files/ADD_FILES';
export const NOT_FOUND = 'files/NOT_FOUND';
export const IS_LOADING = 'files/IS_LOADING';
export const SET_PREVIEW_DATA = 'files/SET_PREVIEW_DATA';

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
    case SET_PREVIEW_DATA: {
      return { ...state, previewData: action.payload.data };
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
const setPreviewData = createAction(SET_PREVIEW_DATA);

export const actions = {
  addFiles,
  isLoading,
  notFound,
  setPreviewData,
};

// Selectors
export const selectFiles = state =>
  state.files || { byId: {}, isLoading: false, notFound: false };

export function fetchPreview(fileId, client) {
  return async dispatch => {
    try {
      const downloadUrls = await client.files.getDownloadUrls([{ id: fileId }]);
      if (downloadUrls.length === 0) {
        return;
      }

      const { downloadUrl } = downloadUrls[0];
      const response = await fetch(downloadUrl);
      const arrayBuffer = await response.arrayBuffer();
      const data = arrayBufferToBase64(arrayBuffer);
      dispatch({ type: SET_PREVIEW_DATA, payload: { data } });
    } catch (error) {
      console.log('Error fetching preview', error);
    }
  };
}

export function fetchFile(fileId, client) {
  return async dispatch => {
    dispatch({ type: IS_LOADING, payload: { value: true } });
    dispatch({ type: NOT_FOUND, payload: { value: false } });
    dispatch({ type: SET_PREVIEW_DATA, payload: { data: undefined } });
    try {
      const result = await client.files.retrieve([{ id: fileId }]);
      if (result.length === 0) {
        dispatch({ type: NOT_FOUND, payload: { value: true } });
        return;
      }

      const file = result[0];
      if (file.uploaded && file.mimeType.startsWith('image/')) {
        dispatch(fetchPreview(fileId, client));
      }
      const items = arrayToObjectById(result);

      dispatch({ type: ADD_FILES, payload: { items } });
      dispatch({ type: IS_LOADING, payload: { value: false } });
    } catch (error) {
      console.log('Error: ', error);
      dispatch({ type: IS_LOADING, payload: { value: false } });
      dispatch({ type: NOT_FOUND, payload: { value: true } });
    }
  };
}
