// global style
// TODO: reset css, declare common styles here

import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
  }
<<<<<<< HEAD
<<<<<<< HEAD
=======

>>>>>>> bb60287dfe99c82d63cd9ecec09ce0045f34cab8
=======
>>>>>>> f69d858eec14eb571e0271ae6a9cb5dc2d794eef
  h1 {
    font-size: 24px;
    color: rgb(50, 50, 50);
  }
  button {
    outline: none;
    cursor: pointer;
  }
`;

export const CommonInput = styled.input`
  padding: 11px;
  border-radius: 4px;
  color: rgb(50, 50, 50);
  font-size: 16px;
  outline: none;
  width: ${(props) => (props.width ? props.width : '100%')};
  box-sizing: border-box;
  border: 1px solid #ddd;
  margin: 4px 0;
  border-color: ${(props) => props.invalid && '#ff395b'};
  ::placeholder,
  ::-webkit-input-placeholder {
    color: #aaa;
  }
  :focus {
    border-color: #008489;
  }
`;

export const FlexDiv = styled.div`
  display: flex;
`;

export const CommonButton = styled.button`
  padding: 12px 11px;
  border-radius: 4px;
  color: #fff;
  font-size: 16px;
  outline: none;
  border: none;
  background-color: ${(props) => (props.color ? props.color : '#F12C56')};
  width: ${(props) => (props.width ? props.width : '100%')};
  margin: ${(props) => (props.margin ? props.margin : '4px 0')};
  opacity: 0.8;
  :hover {
    opacity: ${(props) => !props.disabled && 1};
  }
`;

export default GlobalStyle;
