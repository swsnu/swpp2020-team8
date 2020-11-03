import React from 'react';
import { useHistory } from 'react-router';

import { CommonButton } from '../styles';

const LogoutButton = () => {
  const history = useHistory();

  const onClickLogoutButton = () => {
    history.push('/login');
  };

  return (
    <CommonButton id="logout-button" onClick={onClickLogoutButton}>
      Logout
    </CommonButton>
  );
};

export default LogoutButton;
