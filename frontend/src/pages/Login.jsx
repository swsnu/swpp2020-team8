import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { CommonInput, CommonButton } from '../styles';

import { requestLogin, removeError } from '../modules/user';

const LoginWrapper = styled.div`
  width: 500px;
  margin: 0 auto;
  margin-top: 120px;
`;

const WarningMessage = styled.div`
  font-size: 20px;
  color: #ff395b;
  text-align: center;
  margin-bottom: 10px;
`;

export default function Login() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [loginInfo, setLoginInfo] = useState({ email: '', password: '' });
  const user = useSelector((state) => state.userReducer.user);
  const loginError = useSelector((state) => state.userReducer.loginError);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo((prev) => ({ ...prev, [name]: value }));
  };

  // TODO: handle with isLoggedIn users
  useEffect(() => {
    if (user && user?.id) history.push('/friends');
  }, [user, history]);

  const onClickSubmitButton = () => {
    dispatch(removeError());
    dispatch(requestLogin(loginInfo));
  };

  const onClickSignupButton = () => {
    history.push('/signup');
  };

  return (
    <LoginWrapper>
      <h1>로그인</h1>
      <CommonInput
        id="email-input"
        name="username"
        value={loginInfo.username}
        placeholder="이메일"
        onChange={handleChange}
      />
      <CommonInput
        id="password-input"
        name="password"
        value={loginInfo.password}
        placeholder="비밀번호"
        type="password"
        onChange={handleChange}
      />
      {loginError && loginError.length && (
        <WarningMessage id="login-error-message">
          이메일 혹은 비밀번호를 다시 확인해주세요
        </WarningMessage>
      )}
      <CommonButton
        id="submit-button"
        disabled={loginInfo.username === '' || loginInfo.password === ''}
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
