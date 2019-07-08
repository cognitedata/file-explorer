import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class File extends React.Component {
  state = {};

  componentDidMount() {
    console.log('Doing the file ', this.props.fileId);
  }

  render = () => {
    return <>I am the cool thing</>;
  };
}

File.propTypes = {
  fileId: PropTypes.number.isRequired,
};

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(File);
