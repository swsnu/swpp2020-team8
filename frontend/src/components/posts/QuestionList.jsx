import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import QuestionItem from './QuestionItem';

export default function QuestionList({ questions, isAppending }) {
  const dailyQuestionList = questions.map((question) => (
    <QuestionItem key={question.id} questionObj={question} />
  ));

  return (
    <div id="question-list">
      {dailyQuestionList}

      <div style={{ margin: '8px', textAlign: 'center' }}>
        {isAppending && <CircularProgress id="spinner" color="primary" />}
      </div>
    </div>
  );
}
