import React from 'react';
import { shallow } from 'enzyme';
import PageNavigation from './PageNavigation';

const showPrevLink = jest.fn();
const showNextLink = jest.fn();
const handlePrevClick = jest.fn();
const handleNextClick = jest.fn();

describe('<PageNavigation/>', () => {
  it('should render without errors', () => {
    const component = shallow(<PageNavigation />);
    expect(component.length).toBe(1);
  });

  it('should not display buttons when page == 0', () => {
    const component = shallow(
      <PageNavigation
        totalPages={0}
        currentPageNo={0}
        showPrevLink={showPrevLink}
        showNextLink={showNextLink}
        handlePrevClick={handlePrevClick}
        handleNextClick={handleNextClick}
      />
    );
    expect(component.length).toBe(1);
    expect(component.find('button')).toMatchObject({});
  });

  it('should display buttons when page != 0', () => {
    const component = shallow(
      <PageNavigation
        totalPages={10}
        currentPageNo={1}
        showPrevLink={showPrevLink}
        showNextLink={showNextLink}
        handlePrevClick={handlePrevClick}
        handleNextClick={handleNextClick}
      />
    );
    expect(component.length).toBe(1);
    expect(component.find('button')).toBeTruthy();
    const prevButton = component.find('.prev-button').at(0);
    expect(prevButton).toBeTruthy();
    const nextButton = component.find('.next-button').at(0);
    expect(nextButton).toBeTruthy();

    prevButton.simulate('click');
    expect(handlePrevClick.mock.calls).toBeTruthy();
    nextButton.simulate('click');
    expect(handleNextClick.mock.calls).toBeTruthy();
  });

  it('should disable prev button when show = false', () => {
    const component = shallow(
      <PageNavigation
        totalPages={10}
        currentPageNo={1}
        showPrevLink={false}
        showNextLink={true}
        handlePrevClick={handlePrevClick}
        handleNextClick={handleNextClick}
      />
    );
    expect(component.length).toBe(1);
    expect(component.find('button')).toBeTruthy();
    const prevButton = component.find('.prev-button').at(0);
    expect(prevButton).toBeTruthy();
    const nextButton = component.find('.next-button').at(0);
    expect(nextButton).toBeTruthy();
    expect(prevButton.props().disabled).toBeTruthy();
    nextButton.simulate('click');
    expect(handleNextClick.mock.calls).toBeTruthy();
  });

  it('should disable next button when show = false', () => {
    const component = shallow(
      <PageNavigation
        totalPages={10}
        currentPageNo={1}
        showPrevLink={false}
        showNextLink={false}
        handlePrevClick={handlePrevClick}
        handleNextClick={handleNextClick}
      />
    );
    expect(component.length).toBe(1);
    expect(component.find('button')).toBeTruthy();
    const prevButton = component.find('.prev-button').at(0);
    expect(prevButton).toBeTruthy();
    const nextButton = component.find('.next-button').at(0);
    expect(nextButton).toBeTruthy();
    expect(nextButton.props().disabled).toBeTruthy();
    nextButton.simulate('click');
  });
});
