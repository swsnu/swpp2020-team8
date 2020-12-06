import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { getSampleQuestions } from '../modules/question';
import {
  postSelectedQuestions,
  skipOrCompleteSelectQuestions
} from '../modules/user';
import { CommonButton } from '../styles';

const QuestionsWrapper = styled.div`
  margin: 30px auto;
  margin-top: 80px;
  width: 500px;
  @media (max-width: 650px) {
    width: 90%;
    margin-top: 0;
  }
`;

const TitleWrapper = styled.div`
  margin: 16px auto;
  word-break: keep-all;
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
    dispatch(skipOrCompleteSelectQuestions());
    await dispatch(postSelectedQuestions(selectedQuestions));
    history.push('/');
  };

  const onClickSkipButton = async () => {
    dispatch(skipOrCompleteSelectQuestions());
    history.push('/');
  };

  return (
    <QuestionsWrapper>
      <TitleWrapper id="question-selection-title">
        adoor는 매일 새로운 질문을 추천해드립니다!
        <br />
        <div style={{ fontSize: '18px', fontWeight: 500 }}>
          질문 추천을 위해 마음에 드는 질문을
          <span
            style={{ margin: '0 4px', fontWeight: 'bold', color: '#F12C56' }}
          >
            3개 이상
          </span>
          골라주세요 &#128522;
        </div>
      </TitleWrapper>
      <div>{sampleQuestionList}</div>
      <CommonButton
        disabled={selectedQuestions.length < 3}
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
