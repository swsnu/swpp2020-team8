import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { appendDailyQuestions, getDailyQuestions } from '../modules/question';
import QuestionList from '../components/posts/QuestionList';
import CustomQuestionModal from '../components/CustomQuestionModal';

const NewQuestionButton = styled.button`
  @media (min-width: 650px) {
    display: none;
  }
  border: 1px solid #f12c56;
  border-radius: 4px;
  padding: 8px 16px;
  color: #f12c56;
  opacity: 0.8;
  font-weight: bold;
  background: white;
  float: right;
`;
export default function QuestionFeed() {
  const dailyQuestions = useSelector(
    (state) => state.questionReducer.dailyQuestions
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getDailyQuestions());
  }, [dispatch]);

  const [target, setTarget] = useState(null);

  const isAppending =
    useSelector(
      (state) => state.loadingReducer['question/APPEND_QUESTIONS']
    ) === 'REQUEST';
  const isLoading =
    useSelector(
      (state) => state.loadingReducer['question/GET_DAILY_QUESTIONS']
    ) === 'REQUEST';

  const [isCustomQuestionModalOpen, setCustomQuestionModalOpen] = useState(
    false
  );

  const handleModalOpen = () => {
    setCustomQuestionModalOpen(true);
  };

  const handleModalClose = () => {
    setCustomQuestionModalOpen(false);
  };

  useEffect(() => {
    let observer;
    if (target) {
      observer = new IntersectionObserver(onIntersect, { threshold: 1 });
      observer.observe(target);
    }
    return () => observer && observer.disconnect();
  }, [target]);

  const onIntersect = ([entry]) => {
    if (entry.isIntersecting) {
      dispatch(appendDailyQuestions());
    }
  };

  return (
    <>
      <>
        <NewQuestionButton
          id="new-question"
          margin="16px 0"
          onClick={handleModalOpen}
        >
          새로운 질문 만들기
        </NewQuestionButton>
        {isCustomQuestionModalOpen && (
          <CustomQuestionModal
            open={isCustomQuestionModalOpen}
            handleClose={handleModalClose}
          />
        )}
      </>
      <div style={{ marginTop: '45px' }}>
        <QuestionList
          questions={dailyQuestions}
          isAppending={isAppending}
          isLoading={isLoading}
        />
        <div ref={setTarget} />
      </div>
    </>
  );
}
