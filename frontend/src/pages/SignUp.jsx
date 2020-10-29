import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { updateSignUpInfo } from '../modules/user';
import { CommonInput, CommonButton, FlexDiv } from '../styles';

const SignUpWrapper = styled.div`
  width: 500px;
  margin: 0 auto;
  margin-top: 50px;
`;

const CheckButton = styled.button`
  padding: 12px 11px;
  border-radius: 4px;
  color: #fff;
  font-size: 16px;
  outline: none;
  border: none;
  background-color: #ccc;
  width: 30%;
  margin: 4px;
  opacity: 0.8;
  :hover {
    opacity: 1;
  }
`;
export default function SignUp() {
  const dispatch = useDispatch();
  const [signUpInfo, setSignUpInfo] = useState({
    email: '',
    username: '',
    password: ''
  });

  const [isUsernameValid, setIsUsernameValid] = useState(false);

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setSignUpInfo((prev) => ({ ...prev, [name]: value }));
  };

  const onClickSubmitButton = () => {
    if (!isUsernameValid) return;
    if (!signUpInfo.password.length || !signUpInfo.email.length) return;
    dispatch(updateSignUpInfo(signUpInfo));
  };

  const onCheckUsername = () => {
    setIsUsernameValid(true); // temporary
  };

  return (
    <SignUpWrapper>
      <h3>회원가입</h3>
      <CommonInput
        name="email"
        value={signUpInfo.email}
        placeholder="이메일"
        onChange={onInputChange}
      />
      <FlexDiv>
        <CommonInput
          name="username"
          value={signUpInfo.username}
          placeholder="닉네임"
          onChange={onInputChange}
        />
        <CheckButton onClick={onCheckUsername} color="#999">
          중복확인
        </CheckButton>
      </FlexDiv>
      <CommonInput
        name="password"
        value={signUpInfo.password}
        placeholder="비밀번호"
        onChange={onInputChange}
      />
      <CommonButton margin="40px 0" onClick={onClickSubmitButton}>
        다음 단계로
      </CommonButton>
    </SignUpWrapper>
  );
}
