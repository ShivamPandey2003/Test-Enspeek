import { combineReducers } from '@reduxjs/toolkit';
import UserReducer from "./UserSlice";
import QuestionReducer from "./QuestionSlice";
import TriggerReducer from "./TriggerSlice";
import FilterReducer from "./FiltersSlice";
import crosstabReducer from "./CrosstabSlice";
import crosstabDataReducer from "./CrossTabDataSlice";
import studyReducer from "./CrosstabStudySlice";
import chatReducer from "./ChatSlice";
import modalReducer from "./ModalSlice";

const appReducer = combineReducers({
  user: UserReducer,
    question: QuestionReducer,
    trigger: TriggerReducer,
    filter: FilterReducer,
    crosstab: crosstabReducer,
    crossTabData: crosstabDataReducer,
    study: studyReducer,
    chat: chatReducer,
    modal: modalReducer,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === 'RESET_STORE') {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
