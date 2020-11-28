import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { appendDailyQuestions, getDailyQuestions } from '../modules/question';
import QuestionList from '../components/posts/QuestionList';

export default function QuestionFeed() {
  const dailyQuestions = useSelector(
    (state) => state.questionReducer.dailyQuestions
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getDailyQuestions());
  }, [dispatch]);

  const [target, setTarget] = useState(null);

  const isAppending = useSelector(
    (state) => state.loadingReducer['question/APPEND_QUESTIONS']
  );
  const isLoading = useSelector(
    (state) => state.loadingReducer['question/GET_DAILY_QUESTIONS']
  );

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
      <QuestionList
        questions={dailyQuestions}
        isAppending={isAppending}
        isLoading={isLoading}
      />
      <div ref={setTarget} />
    </>
  );
}
