// global style
// TODO: reset css, declare common styles here

import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
  }
  button {
    outline: none;
    cursor: pointer;
  }
`;

export default GlobalStyle;
