import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
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

export default function SignUp() {
  const dispatch = useDispatch();
  const history = useHistory();

  const user = useSelector((state) => state.userReducer.user);
  // const signUpError = useSelector((state) => state.userReducer.signUpError);
  // useEffect(() => {
  // deal with invalid field here
  // }, [signUpError]);

  useEffect(() => {
    if (user && user.email) history.push('/select-questions');
  }, [user, history]);

  const [signUpInfo, setSignUpInfo] = useState({
    email: '',
    username: '',
    password: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);

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
    // TODO: deal with invalid field error
    dispatch(requestSignUp(signUpInfo));
    setIsUsernameValid(true);
    setIsEmailValid(true);
  };

  return (
    <SignUpWrapper>
      <h1 id="signup-title">회원가입</h1>
      <CommonInput
        id="email-input"
        name="email"
        value={signUpInfo.email}
        placeholder="이메일"
        onChange={onInputChange}
        invalid={isSubmitted && !isEmailValid}
      />
      {isSubmitted && !isEmailValid && (
        <WarningMessage>중복된 이메일이 존재합니다.</WarningMessage>
      )}
      <CommonInput
        name="username"
        id="username-input"
        value={signUpInfo.username}
        placeholder="닉네임"
        onChange={onInputChange}
        invalid={isSubmitted && !isUsernameValid}
      />
      {isSubmitted && !isUsernameValid && (
        <WarningMessage>중복된 닉네임이 존재합니다.</WarningMessage>
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
    </SignUpWrapper>
  );
}
