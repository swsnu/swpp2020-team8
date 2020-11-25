import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { getSampleQuestions } from '../modules/question';
import { postSelectedQuestions, skipSelectQuestions } from '../modules/user';
import { CommonButton } from '../styles';

const QuestionsWrapper = styled.div`
  margin: 80px auto;
  width: 500px;
  @media (max-width: 650px) {
    width: 90%;
  }
`;

const QuestionItem = styled.div`
  padding: 12px;
  text-align: center;
  font-size: 15px;
  border: 1px solid;
  border-color: ${(props) => (props.selected ? '#F12C56' : '#ccc')};
  border-radius: 24px;
  margin: 8px 0;
  color: ${(props) => (props.selected ? '#F12C56' : '#777')};
  cursor: pointer !important;
`;

const CustomLink = styled.button`
  float: right;
  border: none;
  background: #fff;
  color: #777;
  font-size: 16px;
`;

CommonButton.displayName = 'CommonButton';
CustomLink.displayName = 'CustomLink';
QuestionItem.displayName = 'QuestionItem';

export default function QuestionSelection() {
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const history = useHistory();

  const sampleQuestions = useSelector(
    (state) => state.questionReducer.sampleQuestions
  );

  const userId = useSelector((state) => state.userReducer.user?.id);
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

  const onClickSubmitButton = async () => {
    await dispatch(postSelectedQuestions(selectedQuestions, userId));
    history.push('/');
  };

  const onClickSkipButton = async () => {
    await dispatch(skipSelectQuestions());
    history.push('/');
  };

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
      <CustomLink onClick={onClickSkipButton}>건너뛰기</CustomLink>
    </QuestionsWrapper>
  );
}
