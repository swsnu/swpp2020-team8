import React, { useState } from 'react';
// import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { useHistory } from 'react-router';
import { CommonInput, CommonButton } from '../styles';

const LoginWrapper = styled.div`
  width: 500px;
  margin: 0 auto;
  margin-top: 50px;
`;

export default function Login() {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onClickSignupButton = () => {
    history.push('/signup');
  };

  const onClickSubmitButton = () => {
    history.push('/friends');
  };

  return (
    <LoginWrapper>
      <h1>Login</h1>
      <CommonInput
        id="email-input"
        value={email}
        placeholder="email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <CommonInput
        id="password-input"
        value={password}
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <CommonButton
        id="submit-button"
        disabled={email === '' || password === ''}
        margin="20px 0"
        onClick={onClickSubmitButton}
      >
        Login
      </CommonButton>
      <CommonButton
        id="signup-button"
        margin="5px 0"
        onClick={onClickSignupButton}
      >
        Sign Up
      </CommonButton>
    </LoginWrapper>
  );
}
