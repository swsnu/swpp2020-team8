// TODO: reset css, declare common styles here
import styled, { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Lobster&family=Pacifico&family=Quicksand&display=swap');@import url('https://fonts.googleapis.com/css2?family=Lobster&family=Quicksand&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap');
  body {
    margin: 0;
    font-family: 'Noto Sans KR', sans-serif;
  }

  a {
    text-decoration: none;
    color: #000;
  }
  h1 {
    font-size: 24px;
    color: rgb(50, 50, 50);
  }

  h2 {
    font-weight: 400;
    font-size: 20px;
  }
  button {
    outline: none;
    cursor: pointer;
  }
  ::-webkit-scrollbar {
    display: none;
  }
  .MuiBottomNavigationAction-label.Mui-selected {
    font-size: 0.8rem !important;
  }
  
  .MuiDialog-paperFullWidth {
    max-height: 60vh;
    @media (max-width: 650px) {
      position: fixed !important;
      top: 20% !important;
      margin: 0 !important;
      width: calc(100% - 16px) !important;
    }
  }

  .question-send {
    .MuiPaper-root MuiDialog-paper {
      margin: 0 !important;
    }
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

export const MainWrapper = styled.main`
  @media (max-width: 650px) {
    width: 100vw;
    margin-top: 70px;
  }
  width: 1280px;
  margin: 80px auto 100px auto;
  display: flex;
`;

export const FeedWrapper = styled.div`
  @media (max-width: 650px) {
    width: calc(100vw - 12px);
    margin: 0 12px;
  }
  width: 720px;
  margin: 0 40px;
`;

export const WidgetWrapper = styled.div`
  width: 300px;
  transform: 'translateX(-10px)';
  @media (max-width: 650px) {
    width: 95vw;
  }
`;

export const WidgetTitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px;
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
  background-color: #f12c56;
  width: ${(props) => (props.width ? props.width : '100%')};
  margin: ${(props) => (props.margin ? props.margin : '4px 0')};
  opacity: 0.8;
  :hover {
    opacity: ${(props) => !props.disabled && 1};
  }
  :disabled {
    cursor: default;
    background-color: grey;
  }
`;

export const PostItemHeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const PostItemFooterWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const PostItemButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
`;

export const PostItemWrapper = styled.div`
  @media (max-width: 650px) {
    box-shadow: 0 2px 2px rgba(154, 160, 185, 0.05),
      0 5px 5px rgba(166, 173, 201, 0.1);
  }
  background: #fff;
  padding: 16px;
  font-size: 14px;
  border: 1px solid #eee;
  margin: 16px 0;
  position: relative;
  border-radius: 4px;
`;

// export const PostItemWrapper = styled.div`
//   background: #fff;
//   padding: 16px;
//   font-size: 14px;
//   border: 1px solid #eee;
//   margin: 16px 0;
//   position: relative;
//   border-radius: 4px;
// `;
