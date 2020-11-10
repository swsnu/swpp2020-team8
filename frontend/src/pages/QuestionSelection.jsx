import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { getSampleQuestions } from '../modules/question';
import { CommonButton } from '../styles';

const QuestionsWrapper = styled.div`
  margin: 0 auto;
  width: 500px;
  margin-top: 50px;
`;

const QuestionItem = styled.div`
  padding: 12px;
  text-align: center;
  border: 1px solid;
  border-color: ${(props) => (props.selected ? '#F12C56' : '#ccc')};
  border-radius: 24px;
  margin: 8px 0;
  color: ${(props) => (props.selected ? '#F12C56' : '#777')};
  cursor: pointer !important;
`;

const CustomLink = styled(Link)`
  color: #777;
  margin-top: -20px;
`;

export default function QuestionSelection() {
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  const sampleQuestions = useSelector(
    (state) => state.questionReducer.sampleQuestions
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSampleQuestions());
  }, [dispatch]);

  const onQuestionSelect = (e) => {
    const { id, selected } = e.target;
    if (!selected) setSelectedQuestions((prev) => [...prev, +id]);
    else
      setSelectedQuestions((prev) => {
        return prev.filter((item) => +item !== +id);
      });
  };

  const sampleQuestionList = sampleQuestions.map((question) => (
    <QuestionItem
      onClick={onQuestionSelect}
      selected={selectedQuestions.includes(question.id)}
      key={question.id}
      id={question.id}
      className="question-item"
    >
      {question.content}
    </QuestionItem>
  ));

  const onClickSubmitButton = () => {};

  return (
    <QuestionsWrapper>
      <h1 id="question-selection-title">마음에 드는 질문을 골라주세요.</h1>

      <div>{sampleQuestionList}</div>
      <CommonButton
        disabled={!selectedQuestions.length}
        margin="40px 0"
        onClick={onClickSubmitButton}
        id="complete-button"
      >
        완료!
      </CommonButton>
      <CustomLink to="/">건너뛰기</CustomLink>
    </QuestionsWrapper>
  );
}
