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

jest.mock('./ShareSettings', () => {
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

  let wrapper;

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
    wrapper = getWrapper();
    const questionItem = wrapper.find('QuestionItemWrapper');
    expect(questionItem.length).toBe(2);
  });

  it('should not render <AuthorProfile/>, <PostAuthorButtons/> for admin questions', () => {
    wrapper = getWrapper();

    const component = wrapper.find('#admin-question');
    expect(component.length).toBe(1);
    const authorProfile = component.find('AuthorProfile');
    expect(authorProfile.length).toBe(0);
    const postAuthorButtons = component.find('PostAuthorButtons');
    expect(postAuthorButtons.length).toBe(0);
  });

  it('should proper like icon according to the user likes', () => {
    wrapper = getWrapper();

    const component = wrapper.find('#user-question');
    const likeIcon = component.find('FavoriteBorderIcon');
    const unlikeIcon = component.find('FavoriteIcon');

    if (userMockQuestions[0].current_user_liked) {
      expect(unlikeIcon).toHaveLength(1);
      expect(likeIcon).toHaveLength(0);
    } else {
      expect(likeIcon).toHaveLength(1);
      expect(unlikeIcon).toHaveLength(0);
    }
  });

  it('should toggle like', async () => {
    wrapper = getWrapper();

    let component = wrapper.find('#user-question');
    const likeIcon = component.find('FavoriteBorderIcon');
    const unlikeButton = component.find('FavoriteIcon').closest('button').at(0);
    let likeCount = component.find('#like-count').at(0).text();

    expect(likeIcon.length).toBe(0);
    expect(unlikeButton.length).toBe(1);
    expect(+likeCount).toEqual(userMockQuestions[0].like_count);

    // unlike
    await act(async () => {
      unlikeButton.prop('onClick')();
    });

    wrapper.update();

    component = wrapper.find('#user-question');
    const unlikeIcon = component.find('FavoriteIcon');
    const likeButton = component
      .find('FavoriteBorderIcon')
      .closest('button')
      .at(0);
    likeCount = component.find('#like-count').at(0).text();

    expect(unlikeIcon.length).toBe(0);
    expect(likeButton.length).toBe(1);
    expect(+likeCount).toEqual(userMockQuestions[0].like_count - 1);

    // like
    await act(async () => {
      likeButton.simulate('click');
    });

    wrapper.update();

    component = wrapper.find('#user-question');
    likeCount = component.find('#like-count').at(0).text();

    expect(+likeCount).toEqual(userMockQuestions[0].like_count);
  });

  it('should toggle textarea when click write button', async () => {
    wrapper = getWrapper();

    let component = wrapper.find('#admin-question');
    let writeButton = component.find('CreateIcon').closest('button');

    // open textarea
    writeButton.simulate('click');
    wrapper.update();

    component = wrapper.find('#admin-question');
    let textArea = component.find('TextareaAutosize');
    expect(textArea.length).toBe(1);

    // close textarea
    writeButton = component.find('CreateIcon').closest('button');
    writeButton.simulate('click');
    wrapper.update();

    component = wrapper.find('#admin-question');
    textArea = component.find('TextareaAutosize');
    expect(textArea.length).toBe(0);
  });

  it('should handle textarea change', async () => {
    wrapper = getWrapper();

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
    wrapper = getWrapper();

    let component = wrapper.find('#admin-question');
    const writeButton = component.find('CreateIcon').closest('button');

    await act(async () => {
      writeButton.simulate('click');
    });

    wrapper.update();
    component = wrapper.find('#admin-question');

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
