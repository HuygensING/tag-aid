export const SET_TEXTS = 'SET_TEXTS';
export const setTexts = (texts) => ({
  type: SET_TEXTS,
  payload: texts
});

export const SET_SELECTED_TEXT = 'SET_SELECTED_TEXT';
export const setSelectedTexts = (text) => ({
  type: SET_SELECTED_TEXT,
  payload: text
});
