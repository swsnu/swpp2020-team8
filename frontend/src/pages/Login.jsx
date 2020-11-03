import React, { useState } from 'react';
// import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { useHistory } from 'react-router';
import { CommonInput, CommonButton } from '../styles';

const LoginWrapper = styled.div`
  margin: 16px 0;
  width: 100vw;
  text-align: center;
`;

export default function Login() {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onClickSignupButton = () => {
    history.push('/signup');
  };

  const onClickSubmitButton = () => {
    if (email !== 'adoor' || password !== 'adoor') {
      alert('Please check your email or password');
    } else {
      history.push('/friends');
    }
  };

  return (
    <LoginWrapper>
      <h1>Login</h1>
      <CommonInput
        name="email-input"
        value={email}
        placeholder="email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <CommonInput
        name="password-input"
        value={password}
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <CommonButton
        name="submit-button"
        disabled={email === '' || password === ''}
        margin="40px 0"
        onClick={onClickSubmitButton}
      >
        Login
      </CommonButton>
      <CommonButton
        name="signup-button"
        margin="40px 0"
        onClick={onClickSignupButton}
      >
        Sign Up
      </CommonButton>
    </LoginWrapper>
  );
}
