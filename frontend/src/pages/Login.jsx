import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import history from '../history';
import { CommonInput, CommonButton } from '../styles';

import { login, removeError } from '../modules/user';

const LoginWrapper = styled.div`
  width: 500px;
  margin: 0 auto;
  margin-top: 50px;
`;

const WarningMessage = styled.div`
  font-size: 20px;
  color: #ff395b;
  text-align: center;
  margin-bottom: 10px;
`;

export default function Login() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showLoginError, setShowLoginError] = useState(true);

  const loginError = useSelector((state) => state.user.loginError);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  useEffect(() => {
    if (isLoggedIn) {
      history.push('/friends');
    }
    dispatch(removeError());
  }, [isLoggedIn]);

  const onClickSubmitButton = (loginInfo) => {
    dispatch(removeError());
    dispatch(login(loginInfo));
    setShowLoginError(true);
  };

  const onClickSignupButton = () => {
    history.push('/signup');
  };

  return (
    <LoginWrapper>
      <h1>로그인</h1>
      <CommonInput
        id="email-input"
        value={email}
        placeholder="이메일"
        onChange={(e) => setEmail(e.target.value)}
      />
      <CommonInput
        id="password-input"
        value={password}
        placeholder="비밀번호"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      {showLoginError && loginError && (
        <WarningMessage id="login-error-message">
          이메일 혹은 비밀번호를 다시 확인해주세요
        </WarningMessage>
      )}
      <CommonButton
        id="submit-button"
        disabled={email === '' || password === ''}
        margin="20px 0"
        onClick={onClickSubmitButton}
      >
        로그인
      </CommonButton>
      <CommonButton
        id="signup-button"
        margin="5px 0"
        onClick={onClickSignupButton}
      >
        회원가입
      </CommonButton>
    </LoginWrapper>
  );
}
