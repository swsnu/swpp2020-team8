import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import history from '../history';
import { CommonInput, CommonButton } from '../styles';

import { requestLogin } from '../modules/user';

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
  const [showLoginError, setShowLoginError] = useState(false);

  const user = useSelector((state) => state.user);
  const loginError = useSelector((state) => state.error);
  const isLoggedIn = user && !loginError;

  useEffect(() => {
    if (isLoggedIn || user?.id) history.goBack();
  }, [isLoggedIn, user]);

  useEffect(() => {
    if (loginError) {
      setShowLoginError(true);
    }
  }, [loginError]);

  const onClickSignupButton = () => {
    history.push('/signup');
  };

  const onClickSubmitButton = () => {
    dispatch(requestLogin(user));
    if (isLoggedIn) history.push('/friends');
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
        placeholder="패스워드"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      {showLoginError && (
        <WarningMessage>
          이메일 혹은 패스워드를 다시 확인해주세요
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
