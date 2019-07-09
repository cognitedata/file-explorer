import React from 'react';
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import { Route } from 'react-router-dom';
import { CogniteClient } from '@cognite/sdk';
import FileUploader from '../components/FileUploader';
import FileViewer from './FileViewer';
import Loader from '../components/Loader';

// 13FV1234 is useful asset
const { Content, Sider } = Layout;

class Main extends React.Component {
  state = {
    client: undefined,
  };

  componentDidMount() {
    this.authenticate();
  }

  authenticate = async () => {
    const client = new CogniteClient({ appId: 'Cognite File Explorer' });
    client.loginWithOAuth({
      project: this.props.match.params.tenant,
      onAuthenticate: 'REDIRECT',
    });

    await client.authenticate();
    this.setState({ client });
  };

  onUploadSuccess = fileId => {
    const { match, history } = this.props;
    history.push({
      pathname: `${match.url}/files/${fileId}`,
    });
  };

  render() {
    if (this.state.client == null) {
      return <Loader />;
    }
    return (
      <div className="main-layout" style={{ width: '100%', height: '100vh' }}>
        <Layout>
          <Layout>
            <Sider
              style={{
                overflow: 'auto',
                height: '100vh',
              }}
              width={250}
            >
              {this.state.client && (
                <FileUploader
                  client={this.state.client}
                  onUploadSuccess={this.onUploadSuccess}
                />
              )}
            </Sider>
            <Content>
              <Route
                path={`${this.props.match.url}/files/:fileId`}
                render={props => {
                  return (
                    <FileViewer
                      client={this.state.client}
                      fileId={Number(props.match.params.fileId)}
                    />
                  );
                }}
              />
            </Content>
          </Layout>
        </Layout>
      </div>
    );
  }
}

Main.propTypes = {
  match: PropTypes.shape({
    url: PropTypes.string.isRequired,
    params: PropTypes.shape({
      tenant: PropTypes.string,
    }).isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
    search: PropTypes.string,
  }).isRequired,
};

export default Main;
