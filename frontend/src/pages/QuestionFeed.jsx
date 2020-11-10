import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getDailyQuestions } from '../modules/question';
import QuestionItem from '../components/posts/QuestionItem';

export default function QuestionFeed() {
  const dailyQuestions = useSelector(
    (state) => state.questionReducer.dailyQuestions
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getDailyQuestions());
  }, [dispatch]);

  const dailyQuestionList = dailyQuestions.map((question) => (
    <QuestionItem key={question.id} questionObj={question} />
  ));

  return <>{dailyQuestionList}</>;
}
