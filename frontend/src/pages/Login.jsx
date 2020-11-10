import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import history from '../history';
import { CommonInput, CommonButton } from '../styles';

import { requestLogin, removeError } from '../modules/user';
import { getIsLoggedIn } from '../selectors';

const LoginWrapper = styled.div`
  width: 500px;
  margin: 0 auto;
  margin-top: 130px;

  @media (max-width: 650px) {
    width: 90%;
  }
`;

const WarningMessage = styled.div`
  font-size: 14px;
  color: #ff395b;
  margin-bottom: 4px;
`;

export default function Login() {
  const dispatch = useDispatch();
  const [loginInfo, setLoginInfo] = useState({ email: '', password: '' });
  const isLoggedIn = useSelector((state) => getIsLoggedIn(state));
  const user = useSelector((state) => state.userReducer.user);
  const loginError = useSelector((state) => state.userReducer.loginError);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo((prev) => ({ ...prev, [name]: value }));
  };

  // TODO: handle with isLoggedIn users
  useEffect(() => {
    if (isLoggedIn || user?.id) history.push('/friends');
  }, [isLoggedIn, user]);

  const onClickSubmitButton = () => {
    const { email, password } = loginInfo;
    dispatch(removeError());
    dispatch(requestLogin({ email, password }));
  };

  const onClickSignupButton = () => {
    history.push('/signup');
  };

  return (
    <LoginWrapper>
      <h1>로그인</h1>
      <CommonInput
        id="email-input"
        name="email"
        value={loginInfo.email}
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
        disabled={loginInfo.email === '' || loginInfo.password === ''}
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
