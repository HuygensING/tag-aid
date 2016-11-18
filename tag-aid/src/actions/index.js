export const SET_TEXTS = 'SET_TEXTS';
export const setTexts = (texts) => ({
  type: SET_TEXTS,
  payload: texts
});

export const SET_SELECTED_TEXT = 'SET_SELECTED_TEXT';
export const setSelectedText = (text) => ({
  type: SET_SELECTED_TEXT,
  payload: text
});

export const TOGGLE_WITNESS = 'TOGGLE_WITNESS';
export const toggleWitness = (witness) => ({
  type: TOGGLE_WITNESS,
  payload: witness
});
