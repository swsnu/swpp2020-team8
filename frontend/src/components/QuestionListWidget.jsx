import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import ListItemLink from './ListItemLink';
import {
  WidgetWrapper,
  WidgetTitleWrapper,
  FlexDiv,
  CommonButton
} from '../styles';
import {
  getRecommendedQuestions,
  getRandomQuestions,
  getDailyQuestions
} from '../modules/question';
import CustomQuestionModal from './CustomQuestionModal';

CommonButton.displayName = 'CommonButton';

const NewQuestionButton = styled(CommonButton)`
  transform: translateX(-10px);
  position: fixed;
  top: 410px;
  width: 275px;
  box-shadow: '0 5px 10px rgba(154, 160, 185, 0.05), 0 5px 10px rgba(166, 173, 201, 0.2)';
`;

const useStyles = makeStyles((theme) => ({
  card: {
    transform: 'translateX(-10px)',
    position: 'fixed',
    width: '275px',
    borderColor: '#eee',
    boxShadow:
      '0 5px 10px rgba(154, 160, 185, 0.05), 0 5px 10px rgba(166, 173, 201, 0.2)'
  },
  cardContent: {
    padding: '0 !important'
  },
  title: {
    fontWeight: 'bold'
  },
  iconButton: {
    padding: theme.spacing(0.5)
  },
  icon: {
    fontSize: 24
  },
  list: {
    paddingTop: 0
  },
  question: {
    fontSize: 14
  }
}));

const QuestionListWidget = ({
  initialIsRandomQuestions = false,
  initialIsFolded = false
}) => {
  const classes = useStyles();
  const [isRandomQuestions, setRandomQuestions] = useState(
    initialIsRandomQuestions
  );
  const [isFolded, setIsFolded] = useState(initialIsFolded);
  const [isCustomQuestionModalOpen, setCustomQuestionModalOpen] = useState(
    false
  );

  const handleModalOpen = () => {
    setCustomQuestionModalOpen(true);
  };

  const handleModalClose = () => {
    setCustomQuestionModalOpen(false);
  };

  const recommendedQuestions = useSelector(
    (state) => state.questionReducer.recommendedQuestions
  );
  const randomQuestions = useSelector(
    (state) => state.questionReducer.randomQuestions
  );

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getDailyQuestions());
    dispatch(getRecommendedQuestions());
  }, [dispatch]);

  const recommendedQuestionList = recommendedQuestions
    .slice(0, 5)
    .map((question) => (
      <ListItemLink key={question.id} to={`/questions/${question.id}`}>
        <ListItemText
          classes={{ primary: classes.question }}
          primary={question.content}
        />
      </ListItemLink>
    ));

  const randomQuestionList = randomQuestions.slice(0, 5).map((question) => (
    <ListItemLink key={question.id} to={`/questions/${question.id}`}>
      <ListItemText
        classes={{ primary: classes.question }}
        primary={question.content}
      />
    </ListItemLink>
  ));

  const handleClickRefreshButton = () => {
    if (!isRandomQuestions) {
      setRandomQuestions(true);
    }
    dispatch(getRandomQuestions());
  };

  return (
    <WidgetWrapper>
      <Card variant="outlined" className={classes.card}>
        <CardContent className={classes.cardContent}>
          <WidgetTitleWrapper>
            <Typography variant="h6" className={classes.title}>
              추천 질문
            </Typography>
            <FlexDiv>
              {isFolded ? (
                <IconButton
                  href=""
                  className={classes.iconButton}
                  id="question-list-widget-unfold-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setIsFolded(false);
                  }}
                >
                  <ExpandMoreIcon className={classes.icon} />
                </IconButton>
              ) : (
                <>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClickRefreshButton();
                    }}
                    className={classes.iconButton}
                  >
                    <RefreshIcon className={classes.icon} />
                  </IconButton>
                  <IconButton
                    href=""
                    id="question-list-widget-fold-button"
                    className={classes.iconButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setIsFolded(true);
                    }}
                  >
                    <ExpandLessIcon className={classes.icon} />
                  </IconButton>
                </>
              )}
            </FlexDiv>
          </WidgetTitleWrapper>
          {!isFolded && (
            <List
              className={classes.list}
              aria-label="recommended question list"
            >
              {isRandomQuestions ? randomQuestionList : recommendedQuestionList}
            </List>
          )}
        </CardContent>
      </Card>
      <NewQuestionButton margin="16px 0" onClick={handleModalOpen}>
        새로운 질문 만들기
      </NewQuestionButton>
      {isCustomQuestionModalOpen && (
        <CustomQuestionModal
          open={isCustomQuestionModalOpen}
          handleClose={handleModalClose}
        />
      )}
    </WidgetWrapper>
  );
};

export default QuestionListWidget;
