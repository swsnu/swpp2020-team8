import React from 'react';
import QuestionItem from './QuestionItem';

export default function QuestionList({ questions }) {
  const dailyQuestionList = questions.map((question) => (
    <QuestionItem key={question.id} questionObj={question} />
  ));

  return <div id="question-list">{dailyQuestionList}</div>;
}
