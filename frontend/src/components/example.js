import styled from 'styled-components';

export const ExampleWrapper = styled.div`
  margin: 16px 0;
  width: 100vw;
  text-align: center;
`;

export const ExampleImage = styled.img`
  object-fit: cover;
  width: 100px;
  height: 100px;
`;

export const ExampleButton = styled.button`
  padding: 8px;
  border: none;
  font-size: 20px;
  font-weight: bold;
  margin: 24px;
  border-radius: 4px;
  background: ${(props) => (props.clicked ? 'pink' : 'white')};
`;
