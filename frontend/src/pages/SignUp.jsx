import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import Cookies from 'js.cookie';
import { requestSignUp } from '../modules/user';
import { CommonInput, CommonButton } from '../styles';

const SignUpWrapper = styled.div`
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

const LoginButton = styled.button`
  float: right;
  border: none;
  background: #fff;
  color: #777;
  font-size: 16px;
  margin-top: -16px;
`;

export default function SignUp({ setRefreshToken }) {
  const dispatch = useDispatch();
  const history = useHistory();

  const { currentUser, signUpError } = useSelector(
    (state) => state.userReducer
  );

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isUsernameValid, setIsUsernameValid] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const loginSuccess =
    useSelector((state) => state.loadingReducer['user/LOGIN']) === 'SUCCESS';

  useEffect(() => {
    if (currentUser && currentUser?.id) {
      history.push('/select-questions');
    }
  }, [currentUser, history]);

  useEffect(() => {
    if (!isSubmitted) return;
    if (signUpError && signUpError.username) setIsUsernameValid(false);
    if (signUpError && signUpError.email) setIsEmailValid(false);
  }, [isSubmitted, signUpError]);

  useEffect(() => {
    console.log('success!', loginSuccess, Cookies.get('jwt_token_refresh'));
    setRefreshToken(Cookies.get('jwt_token_refresh'));
  }, [loginSuccess]);

  const [signUpInfo, setSignUpInfo] = useState({
    email: '',
    username: '',
    password: ''
  });

  const isFilled =
    signUpInfo.username.length &&
    signUpInfo.password.length &&
    signUpInfo.email.length;

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setSignUpInfo((prev) => ({ ...prev, [name]: value }));
  };

  const onClickSubmitButton = () => {
    setIsSubmitted(true);
    setIsUsernameValid(true);
    setIsEmailValid(true);
    dispatch(requestSignUp(signUpInfo));
    setRefreshToken(Cookies.get('jwt_token_refresh'));
  };

  return (
    <SignUpWrapper>
      <h1 id="signup-title">회원가입</h1>
      <CommonInput
        name="username"
        id="username-input"
        value={signUpInfo.username}
        placeholder="닉네임"
        onChange={onInputChange}
        invalid={isSubmitted && !isUsernameValid}
      />
      {isSubmitted && !isUsernameValid && (
        <WarningMessage>닉네임이 유효하지 않습니다 :(</WarningMessage>
      )}
      <CommonInput
        id="email-input"
        name="email"
        value={signUpInfo.email}
        placeholder="이메일"
        onChange={onInputChange}
        invalid={isSubmitted && !isEmailValid}
      />
      {isSubmitted && !isEmailValid && (
        <WarningMessage>이메일이 유효하지 않습니다 :(</WarningMessage>
      )}
      <CommonInput
        name="password"
        type="password"
        id="password-input"
        value={signUpInfo.password}
        placeholder="비밀번호"
        onChange={onInputChange}
      />
      <CommonButton
        disabled={!isFilled}
        margin="40px 0"
        onClick={onClickSubmitButton}
      >
        다음 단계로
      </CommonButton>
      <LoginButton
        type="button"
        id="login-button"
        margin="5px 0"
        onClick={() => history.push('/login')}
      >
        로그인
      </LoginButton>
    </SignUpWrapper>
  );
}
