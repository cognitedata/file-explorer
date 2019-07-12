import mixpanel from 'mixpanel-browser';
import React from 'react';
import PropTypes from 'prop-types';
import { message, Upload, Icon } from 'antd';
import { CogniteClient } from '@cognite/sdk';

const { Dragger } = Upload;

const onFileUploadChange = info => {
  const { status } = info.file;
  if (status !== 'uploading') {
    // console.log(info.file, info.fileList);
  }
  if (status === 'done') {
    message.success(`${info.file.name} file uploaded successfully.`);
  } else if (status === 'error') {
    message.error(`${info.file.name} file upload failed.`);
  }
};

const uploadFile = async (request, client, onUploadSuccess) => {
  const { file } = request;
  const reader = new FileReader();
  // Specify the handler for the `load` event
  reader.onload = async e => {
    // Do something with the file
    // E.g. Send it to the cloud
    try {
      const uploadTrackingName = 'File.upload';
      mixpanel.time_event(uploadTrackingName);
      const response = await client.files.upload(
        {
          name: file.name,
          mimeType: file.type,
          source: 'Cognite File Explorer',
        },
        e.target.result,
        true,
        true
      );

      const fileId = response.id;
      mixpanel.track(uploadTrackingName, {
        project: client.project,
        fileId,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      });
      onUploadSuccess(fileId);
      request.onSuccess();
    } catch (error) {
      mixpanel.track('File.failedUpload', {
        project: client.project,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        errorName: error.name,
        errorMessage: error.message,
      });
      request.onError();
    }
  };

  reader.readAsArrayBuffer(file);
};

const FileUploader = props => {
  return (
    <Dragger
      onChange={onFileUploadChange}
      customRequest={request =>
        uploadFile(request, props.client, props.onUploadSuccess)
      }
      multiple={false}
    >
      <p className="ant-upload-drag-icon">
        <Icon type="inbox" />
      </p>
      <p className="ant-upload-text">
        Click or drag file to this area to upload
      </p>
    </Dragger>
  );
};
FileUploader.propTypes = {
  client: PropTypes.instanceOf(CogniteClient).isRequired,
  onUploadSuccess: PropTypes.func.isRequired,
};

export default FileUploader;
