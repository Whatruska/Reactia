import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';
import { userReducer } from './bll/reducers/userReducer';
import {postsReducer} from "./bll/reducers/postsReducer";

const reducers = combineReducers({
  users: userReducer,
  posts: postsReducer,
});

export type RootState = ReturnType<typeof reducers>

const store = createStore(reducers, applyMiddleware(thunk));

export default store;
