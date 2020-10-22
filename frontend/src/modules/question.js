const initialState = {
  dailyQuestions: [],
  sampleQuestions: [],
  randomQuestions: [],
  recommendedQuestions: [],
  selectedQuestion: {},
  selectedQuestionResponses: []
};

export default function questionReducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
