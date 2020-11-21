/* eslint-disable react/jsx-wrap-multilines */
import React, { useEffect, useState } from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import styled from 'styled-components';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import QuestionItem from '../components/posts/QuestionItem';
import { getResponsesByQuestion } from '../modules/question';
import PostItem from '../components/posts/PostItem';

const SwitchWrapper = styled.div`
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  padding-top: 8px;
`;

const useStyles = makeStyles((theme) => ({
  switch: {
    marginRight: theme.spacing(1)
  },
  switchLabel: {
    marginTop: '-4px'
  }
}));

const QuestionDetail = (props) => {
  const { history } = props;
  const questionId = history.location.pathname.split('/')[2];

  const classes = useStyles();
  const [viewAnonymousResponses, setViewAnonymousResponses] = useState(false);

  const dispatch = useDispatch();
  const question = useSelector(
    (state) => state.questionReducer.selectedQuestion
  );
  const responses = useSelector(
    (state) => state.questionReducer.selectedQuestionResponses
  );

  useEffect(() => {
    dispatch(getResponsesByQuestion(viewAnonymousResponses, questionId));
  }, [dispatch, questionId]);

  const handleChangeViewAnonymousResponses = (event) => {
    setViewAnonymousResponses(event.target.checked);
  };

  const responseList = responses.map((post) => (
    <PostItem key={`${post.type}-${post.id}`} postObj={post} />
  ));

  return (
    <div>
      {question && <QuestionItem questionObj={question} />}
      <SwitchWrapper>
        <span className={classes.switchLabel}>익명의 답변 보기</span>
        <FormControlLabel
          className={classes.switch}
          control={
            <Switch
              checked={viewAnonymousResponses}
              onChange={handleChangeViewAnonymousResponses}
              name="view-anonymous-responses"
              color="primary"
            />
          }
        />
      </SwitchWrapper>
      {responseList}
    </div>
  );
};

export default QuestionDetail;
