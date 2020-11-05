import React, { useState } from 'react';
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
import ListItemLink from './ListItemLink';
import {
  WidgetWrapper,
  WidgetTitleWrapper,
  FlexDiv,
  CommonButton
} from '../styles';

const useStyles = makeStyles((theme) => ({
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

const QuestionListWidget = () => {
  const [isFolded, setIsFolded] = useState(false);
  const classes = useStyles();

  return (
    <WidgetWrapper>
      <Card variant="outlined">
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
                  <IconButton href="" className={classes.iconButton}>
                    <RefreshIcon className={classes.icon} />
                  </IconButton>
                  <IconButton
                    href=""
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
              <ListItemLink href="">
                <ListItemText
                  classes={{ primary: classes.question }}
                  primary="어디서 마시는 커피를 가장 좋아하는가?"
                />
              </ListItemLink>
              <ListItemLink href="">
                <ListItemText
                  classes={{ primary: classes.question }}
                  primary="가장 오래 통화해본 기억은?"
                />
              </ListItemLink>
              <ListItemLink href="">
                <ListItemText
                  classes={{ primary: classes.question }}
                  primary="사람들의 무리한 부탁을 잘 거절하는 편인가?"
                />
              </ListItemLink>
              <ListItemLink href="">
                <ListItemText
                  classes={{ primary: classes.question }}
                  primary="내일이 생의 마지막 날이라면 오늘 무엇을 하겠는가?"
                />
              </ListItemLink>
              <ListItemLink href="">
                <ListItemText
                  classes={{ primary: classes.question }}
                  primary="나는 운이 좋은 편이라고 생각하는가?"
                />
              </ListItemLink>
            </List>
          )}
        </CardContent>
      </Card>
      <CommonButton margin="16px 0">새로운 질문 만들기</CommonButton>
    </WidgetWrapper>
  );
};

export default QuestionListWidget;
