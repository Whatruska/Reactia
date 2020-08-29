import firebase from 'firebase';
import db from '../../fbconfig';
import { Action, User, UserState } from '../../types/types';

const USER_COLLECTION_NAME = 'users';
const USER_STORAGE_NAME = 'REACTIA/USER';

const userFromStorage: User = JSON.parse(window.localStorage.getItem(USER_STORAGE_NAME) as string);

const initialState: UserState = {
  user: userFromStorage,
  isFetching: false,
  isLogged: !!userFromStorage,
};

const SET_USER = 'REACTIA/USER/SET_USER';
const TOGGLE_FETCHING = 'REACTIA/USER/TOGGLE_FETCHING';
const LOGIN = 'REACTIA/USER/LOGIN';
const LOGOUT = 'REACTIA/USER/LOGOUT';

type VALID_ACTIONS = typeof SET_USER | typeof TOGGLE_FETCHING | typeof LOGIN | typeof LOGOUT

const setUserAC = (user: User): Action<typeof SET_USER, User> => ({
  type: SET_USER,
  payload: user,
});

const toggleFetchingAC = (): Action<typeof TOGGLE_FETCHING, never> => ({
  type: TOGGLE_FETCHING,
});

const loginAC = (): Action<typeof LOGIN, never> => ({
  type: LOGIN,
});

const logoutAC = (): Action<typeof LOGOUT, never> => ({
  type: LOGOUT,
});

const convertUser = ({
  id, friend, username, photo_url,
}: any) => ({
  id, friends: friend || [], username: username || `User ${id}`, photo_url: photo_url || '',
});

const createUserThunk = ({ id }: User) => (dispatch: any) => {
  dispatch(toggleFetchingAC());
  const user = convertUser(id);
  db.collection(USER_COLLECTION_NAME).doc(id).set(user).then(() => {
    dispatch(setUserAC(user));
    dispatch(toggleFetchingAC());
  });
};

const loginThunk = (user: User) => (dispatch: any) => {
  dispatch(toggleFetchingAC());
  db.collection(USER_COLLECTION_NAME).where('id', '==', user.id).get().then((querry) => {
    const { size } = querry;
    if (size) {
      const data: Array<User> = [];
      querry.forEach((resp) => {
        data.push(resp.data() as User);
      });
      dispatch(setUserAC(convertUser(data[0])));
    } else {
      dispatch(createUserThunk(user));
    }
  })
    .finally(() => {
      dispatch(loginAC());
      dispatch(toggleFetchingAC());
    });
};

const logoutThunk = () => (dispatch: any) => {
  window.localStorage.removeItem(USER_STORAGE_NAME);
  dispatch(logoutAC());
  firebase.auth().signOut();
};

const userReducer = (state = initialState, action: Action<VALID_ACTIONS, any>) => {
  const stateCopy = { ...state };
  switch (action.type) {
    case SET_USER: {
      const user = action.payload;
      window.localStorage.setItem(USER_STORAGE_NAME, JSON.stringify(user));
      stateCopy.user = user;
      break;
    }
    case TOGGLE_FETCHING: {
      stateCopy.isFetching = !stateCopy.isFetching;
      break;
    }
    case LOGIN: {
      stateCopy.isLogged = true;
      break;
    }
    case LOGOUT: {
      stateCopy.isLogged = false;
      stateCopy.user = {
        id: '',
        photo_url: '',
        username: '',
        friends: [],
      };
      break;
    }
    default: break;
  }
  return stateCopy;
};

export {
  userReducer, createUserThunk, loginThunk, logoutThunk,
};
