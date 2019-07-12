import mixpanel from 'mixpanel-browser';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { TenantSelector } from '@cognite/gearbox';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  height: 100vh;
`;

const TenantSelectorContainer = styled.div`
  max-width: 600px;
  min-width: 400px;
  align-self: center;
`;

const Login = ({ onTenantSelected }) => (
  <Wrapper>
    <TenantSelectorContainer>
      <TenantSelector
        title="Cognite File Explorer"
        initialTenant="cognite"
        onTenantSelected={onTenantSelected}
        placeholder=""
      />
    </TenantSelectorContainer>
  </Wrapper>
);
Login.propTypes = {
  onTenantSelected: PropTypes.func.isRequired,
};

const mapStateToProps = (_, ownProps) => {
  const onTenantSelected = tenant => {
    mixpanel.track('Login.selectedTenant', {
      project: tenant,
    });
    ownProps.history.push(`/${tenant}`);
  };
  return { onTenantSelected };
};

export default connect(mapStateToProps)(Login);
