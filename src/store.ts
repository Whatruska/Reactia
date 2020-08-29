import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';
import { userReducer } from './bll/reducers/userReducer';

const reducers = combineReducers({
  users: userReducer,
});

export type RootState = ReturnType<typeof reducers>

const store = createStore(reducers, applyMiddleware(thunk));

export default store;
