import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getDailyQuestions } from '../modules/question';
import QuestionList from '../components/posts/QuestionList';

export default function QuestionFeed() {
  const dailyQuestions = useSelector(
    (state) => state.questionReducer.dailyQuestions
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getDailyQuestions());
  }, [dispatch]);
  return <QuestionList questions={dailyQuestions} />;
}
