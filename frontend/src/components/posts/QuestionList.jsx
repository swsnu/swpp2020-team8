import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import QuestionItem from './QuestionItem';
import LoadingList from './LoadingList';

export default function QuestionList({ questions, isAppending, isLoading }) {
  const dailyQuestionList = questions.map((question) => (
    <QuestionItem
      key={question.id}
      questionObj={question}
      questionId={question.id}
    />
  ));

  return (
    <div id="question-list">
      {isLoading ? <LoadingList /> : dailyQuestionList}

      <div style={{ margin: '8px', textAlign: 'center' }}>
        {isAppending && <CircularProgress id="spinner" color="primary" />}
      </div>
    </div>
  );
}
