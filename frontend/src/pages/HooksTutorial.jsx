import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getSampleQuestions, resetQuestions } from '../modules/question';

export default function HooksTutorial() {
  const [sampleQuestionCount, setSampleQuestionCount] = useState(0);
  // setState 대신 쓰는 것, state 하나 하나 useState로 선언

  const sampleQuestions = useSelector(
    (state) => state.questionReducer.sampleQuestions
  );
  // selector, 말 그대로 redux store에서 원하는 state 값을 선택적으로 가져올 수 있음 (mapStateToProps랑 비슷 )
  const dispatch = useDispatch();
  // 이건 dispatch를 hooks 구조 안에서 사용하기 위해 선언하는것! dispatch(ACTION 명)식으로 쓰면 됨, dispatch할 action은 import 필요

  useEffect(() => {
    dispatch(getSampleQuestions());
    return () => {
      dispatch(resetQuestions());
      // 이렇게 하면 언마운트 될 때 resetQuestions가 실행
    };
  }, [dispatch]);
  // 리액트는 컴포넌트가 유지되는 한 dispatch 함수가 항상 같다는 것을 보장하기 때문에 dependency에 넣을 필요는 없는데
  // 명시 안하면 warning이 나니까 그냥 명시 해줍시다 ㅋ

  useEffect(() => {
    if (sampleQuestions.length) setSampleQuestionCount(sampleQuestions.length);
  }, [sampleQuestions]);
  // 뒤에 []를 dependency 배열이라구 하는데, 이 안에 아무것도 없으면 컴포넌트가 처음 마운트 될 때 effect자리에 있는 코드가 실행되고 return은 컴포넌트가 언마운트 (사라질 때) 실행됨
  // dependecy 배열에 state나 변수처럼 변하는 값이 들어가면, 그 값이 변할 때마다 해당 effect가 실행됨!

  const sampleQuestionList = sampleQuestions.map((question) => (
    <li key={question.id}>{question.question}</li>
  ));
  return (
    <div>
      <h5>Sample Questions</h5>
      <div>
        total count:
        {sampleQuestionCount}
      </div>
      <ul>{sampleQuestionList}</ul>
    </div>
  );
}
