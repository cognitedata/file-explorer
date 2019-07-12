import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { CogniteClient } from '@cognite/sdk';
import Moment from 'react-moment';
import { List, Button } from 'antd';
import { selectFiles, Files, fetchFile } from '../modules/files';
import Loader from '../components/Loader';

class FileViewer extends React.Component {
  state = {};

  componentDidMount() {
    if (this.props.files.byId[this.props.fileId] == null) {
      this.props.fetchFile(this.props.fileId, this.props.client);
    }
  }

  componentDidUpdate() {}

  getDownloadUrl = async () => {
    const links = await this.props.client.files.getDownloadUrls([
      { id: this.props.fileId },
    ]);

    if (links.length === 0) {
      return null;
    }

    return links[0].downloadUrl;
  };

  renderDownloadLink() {
    return (
      <Button
        onClick={async () => {
          const url = await this.getDownloadUrl();
          if (url) {
            window.open(url);
          }
        }}
      >
        Download
      </Button>
    );
  }

  render = () => {
    const { files } = this.props;
    if (files.notFound) {
      return <h2 style={{ textAlign: 'center' }}>File not found.</h2>;
    }

    const file = files.byId[this.props.fileId];
    if (file == null) {
      return <Loader />;
    }

    const data = [
      <List.Item>
        Created: <Moment>{file.createdTime}</Moment>
      </List.Item>,
      <List.Item>
        Uploaded: <Moment>{file.uploadedTime}</Moment>
      </List.Item>,
      <List.Item>Source: {file.source}</List.Item>,
      <List.Item>Uploaded: {file.uploaded ? 'Yes' : 'No'}</List.Item>,
    ];

    return (
      <List
        header={<b>{file.name}</b>}
        footer={this.renderDownloadLink()}
        bordered
        dataSource={data}
        renderItem={item => item}
      />
    );
  };
}

FileViewer.propTypes = {
  fetchFile: PropTypes.func.isRequired,
  client: PropTypes.instanceOf(CogniteClient).isRequired,
  fileId: PropTypes.number.isRequired,
  files: Files.isRequired,
};

const mapStateToProps = state => {
  return {
    files: selectFiles(state),
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchFile }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FileViewer);
