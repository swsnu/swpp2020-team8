/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/button-has-type */
import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { act } from 'react-dom/test-utils';
import history from '../../history';
import rootReducer from '../../modules';
import QuestionItem from './QuestionItem';
import { mockStore } from '../../mockStore';

jest.mock('../ShareSettings', () => {
  return jest.fn((props) => {
    return (
      <div className="share-settings">
        <button className="submit-button" onClick={props.resetContent} />
      </div>
    );
  });
});

describe('<QuestionItem/>', () => {
  const store = createStore(
    rootReducer,
    mockStore,
    composeWithDevTools(applyMiddleware(thunk))
  );

  const userMockQuestions = mockStore.questionReducer.dailyQuestions.filter(
    (item) => item.author_detail.id === mockStore.userReducer.user.id
  );

  const adminMockQuestions = mockStore.questionReducer.dailyQuestions.filter(
    (item) => item.is_admin_question
  );

  const getWrapper = () =>
    mount(
      <Provider store={store}>
        <Router history={history}>
          <QuestionItem id="user-question" questionObj={userMockQuestions[0]} />
          <QuestionItem
            id="admin-question"
            questionObj={adminMockQuestions[0]}
          />
        </Router>
      </Provider>
    );

  it('should render without errors', () => {
    const component = getWrapper();
    const questionItem = component.find('QuestionItemWrapper');
    expect(questionItem.length).toBe(2);
  });

  it('should not render <AuthorProfile/>, <PostAuthorButtons/> for admin questions', () => {
    const component = getWrapper().find('#admin-question');
    expect(component.length).toBe(1);
    const authorProfile = component.find('AuthorProfile');
    expect(authorProfile.length).toBe(0);
    const postAuthorButtons = component.find('PostAuthorButtons');
    expect(postAuthorButtons.length).toBe(0);
  });

  it('should render <AuthorProfile/>, <PostAuthorButtons/> for author questions', () => {
    const component = getWrapper().find('#user-question');
    const authorProfile = component.find('AuthorProfile');
    expect(authorProfile.length).toBe(1);
    const postAuthorButtons = component.find('PostAuthorButtons');
    expect(postAuthorButtons.length).toBe(1);
  });

  it('should toggle like', async () => {
    const wrapper = getWrapper();

    let component = wrapper.find('#user-question');
    let likeButton = component.find('FavoriteBorderIcon');
    let unlikeButton = component.find('FavoriteIcon').closest('button').at(0);
    let likeCount = component.find('#like-count').at(0).text();

    expect(+likeCount).toEqual(37);
    expect(likeButton.length).toBe(0);
    expect(unlikeButton.length).toBe(1);

    await act(async () => {
      unlikeButton.prop('onClick')();
    });

    wrapper.update();

    component = wrapper.find('#user-question');

    unlikeButton = component.find('FavoriteIcon');
    likeButton = component.find('FavoriteBorderIcon');
    likeCount = component.find('#like-count').at(0).text();

    expect(unlikeButton.length).toBe(0);
    expect(likeButton.length).toBe(1);

    expect(likeButton.length).toBe(1);
    expect(+likeCount).toEqual(36);

    await act(async () => {
      likeButton.simulate('click');
    });
    wrapper.update();

    component = wrapper.find('#user-question');
    likeCount = component.find('#like-count').at(0).text();

    expect(+likeCount).toEqual(37);
  });

  it('should toggle textarea when click write button', async () => {
    const wrapper = getWrapper();
    let component = wrapper.find('#admin-question');
    let writeButton = component.find('CreateIcon').closest('button');

    writeButton.simulate('click');

    wrapper.update();
    component = wrapper.find('#admin-question');

    let textArea = component.find('TextareaAutosize');
    expect(textArea.length).toBe(1);

    writeButton = component.find('CreateIcon').closest('button');

    writeButton.simulate('click');

    wrapper.update();
    component = wrapper.find('#admin-question');

    textArea = component.find('TextareaAutosize');
    expect(textArea.length).toBe(0);
  });

  it('should handle textarea change', async () => {
    const wrapper = getWrapper();
    let component = wrapper.find('#admin-question');
    const writeButton = component.find('CreateIcon').closest('button');

    writeButton.simulate('click');

    wrapper.update();
    component = wrapper.find('#admin-question');

    const textArea = component.find('TextareaAutosize');
    expect(textArea.length).toBe(1);

    textArea.value = 'test';

    await act(async () => {
      textArea.simulate('change');
    });
    expect(textArea.value).toEqual('test');
  });

  it('should pass reset function', async () => {
    const wrapper = getWrapper();
    let component = wrapper.find('#admin-question');
    const writeButton = component.find('CreateIcon').closest('button');

    await act(async () => {
      writeButton.simulate('click');
    });

    wrapper.update();
    component = wrapper.find('#admin-question');

    // expect(typeof component.find('ShareSettings').props().resetContent).toBe(
    //   'function'
    // );

    const submitButton = component
      .find('.share-settings')
      .find('.submit-button');

    expect(submitButton.length).toBe(1);

    await act(async () => {
      submitButton.simulate('click');
    });

    wrapper.update();
    component = wrapper.find('#admin-question');

    const textArea = component.find('TextareaAutosize');
    expect(textArea.length).toBe(1);
    expect(textArea.prop('value')).toEqual('');
  });
});
