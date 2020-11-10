import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const QuestionBoxWrapper = styled.div`
  margin-top: 12px;
  background: #f4f4f4;
  text-align: center;
  padding: 12px;
  border-radius: 4px;
  font-weight: 500;
  font-size: 15px;
`;

export default function QuestionBox({ questionObj }) {
  return (
    <Link to={`/questions/${questionObj.id}`}>
      <QuestionBoxWrapper>{questionObj.question}</QuestionBoxWrapper>
    </Link>
  );
}
