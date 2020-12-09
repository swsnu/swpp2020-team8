/* eslint-disable react/jsx-wrap-multilines */
import React, { useEffect, useState } from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import styled from 'styled-components';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router';
import Skeleton from '@material-ui/lab/Skeleton';
import QuestionItem from '../components/posts/QuestionItem';
import {
  getResponsesByQuestion,
  getFriendResponsesByQuestion
} from '../modules/question';
import PostItem from '../components/posts/PostItem';
import Message from '../components/Message';

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
  const { match } = props;
  const questionId = match.params.id;

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
    dispatch(getFriendResponsesByQuestion(questionId));
    return () => {
      setViewAnonymousResponses(false);
    };
  }, [dispatch, questionId]);

  const handleChangeViewAnonymousResponses = (event) => {
    setViewAnonymousResponses(event.target.checked);
    if (event.target.checked) dispatch(getResponsesByQuestion(questionId));
    else dispatch(getFriendResponsesByQuestion(questionId));
  };

  const isLoading =
    useSelector(
      (state) =>
        state.loadingReducer['question/GET_SELECTED_QUESTION_FRIEND_RESPONSES']
    ) === 'REQUEST';

  const responseList = responses.map((post) => (
    <PostItem
      postKey={`${post.type}-${post.id}`}
      key={`${post.type}-${post.id}`}
      postObj={post}
    />
  ));

  const questionAndResponseList = question ? (
    <>
      <QuestionItem
        questionObj={question}
        questionId={questionId}
        onResetContent={() => setViewAnonymousResponses(false)}
      />
      {responses?.length !== 0 ? (
        <>
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
        </>
      ) : (
        <Message message="표시할 게시물이 없습니다 :(" />
      )}
    </>
  ) : (
    <Message message="존재하지 않는 질문입니다" />
  );

  return (
    <div>
      {isLoading ? (
        <Skeleton variant="rect" width={650} height={118} />
      ) : (
        questionAndResponseList
      )}
    </div>
  );
};

export default withRouter(QuestionDetail);
