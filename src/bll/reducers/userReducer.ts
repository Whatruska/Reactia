import firebase from 'firebase';
import { message } from 'antd';
import { db, storage } from '../../fbconfig';
import { Action, User, UserState } from '../../types/types';

export const USER_COLLECTION_NAME = 'users';
const USER_STORAGE_NAME = 'REACTIA/USER';
const getUserFromStorage = (): User => JSON.parse(window.localStorage.getItem(USER_STORAGE_NAME) as string);
const userFromStorage: User = getUserFromStorage();

const initialState: UserState = {
  user: userFromStorage,
  isFetching: false,
  isLogged: !!userFromStorage,
  isRegistered: userFromStorage ? !userFromStorage.username.includes(userFromStorage.id) : false,
};

const BASE_ACTION = 'REACTIA/USER/';

const SET_USER = `${BASE_ACTION}SET_USER`;
const TOGGLE_FETCHING = `${BASE_ACTION}TOGGLE_FETCHING`;
const LOGIN = `${BASE_ACTION}LOGIN`;
const LOGOUT = `${BASE_ACTION}LOGOUT`;
const TOGGLE_REGISTER = `${BASE_ACTION}TOGGLE_REGISTER`;
const SET_USERNAME = `${BASE_ACTION}SET_USERNAME`;
const SET_PHOTO_URL = `${BASE_ACTION}SET_PHOTO_URL`;

type VALID_ACTIONS = typeof SET_USER | typeof TOGGLE_FETCHING | typeof LOGIN | typeof LOGOUT | typeof TOGGLE_REGISTER | typeof SET_USERNAME | typeof SET_PHOTO_URL

const setUserAC = (user: User): Action<typeof SET_USER, User> => ({
  type: SET_USER,
  payload: user,
});

const toggleFetchingAC = (): Action<typeof TOGGLE_FETCHING, never> => ({
  type: TOGGLE_FETCHING,
});

const toggleRegisterAC = (): Action<typeof TOGGLE_REGISTER, never> => ({
  type: TOGGLE_REGISTER,
});

const loginAC = (): Action<typeof LOGIN, never> => ({
  type: LOGIN,
});

const logoutAC = (): Action<typeof LOGOUT, never> => ({
  type: LOGOUT,
});

const setUsernameAC = (username: string): Action<typeof SET_USERNAME, string> => ({
  type: SET_USERNAME,
  payload: username,
});

const setPhotoUrlAC = (photo_url: string): Action<typeof SET_PHOTO_URL, string> => ({
  type: SET_PHOTO_URL,
  payload: photo_url,
});

const convertUser = ({uid, friends, username, photo_url}: any) => {
  return ({
    id: uid, friends: friends || [], username: username || `User ${uid}`, photo_url: photo_url || '',
  });
};

const createUserThunk = (user: User) => (dispatch: any) => {
  dispatch(toggleFetchingAC());
  const newUser = convertUser(user);
  debugger;
  db.collection(USER_COLLECTION_NAME).doc(newUser.id).set(newUser).then(() => {
    dispatch(setUserAC(newUser));
    dispatch(toggleFetchingAC());
  });
};

const loginThunk = (user: User) => (dispatch: any) => {
  dispatch(toggleFetchingAC());
  db.collection(USER_COLLECTION_NAME).where('id', '==', user.id).get().then((querry) => {
    const { size } = querry;
    debugger;
    if (size) {
      const data: Array<User> = [];
      querry.forEach((resp) => {
        data.push(resp.data() as User);
      });
      dispatch(setUserAC(convertUser(data[0])));
    } else {
      debugger;
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

const registerThunk = (file: File, username: string, id: string) => (dispatch: any) => {
  dispatch(toggleFetchingAC());
  const AVATARS_PATH = 'imgs/avatars/';
  const fileRef = storage.ref('imgs/avatars/').child(id);
  fileRef.put(file).then(() => {
    db.collection(USER_COLLECTION_NAME).doc(id).update({
      photo_url: AVATARS_PATH + id,
      username,
    }).then(() => {
      dispatch(setUsernameAC(username));
      dispatch(setPhotoUrlAC(AVATARS_PATH + id));
      dispatch(toggleRegisterAC());
    });
  }).catch((error) => {
    message.error(error, 2);
  }).finally(() => {
    dispatch(toggleFetchingAC());
  });
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
      stateCopy.isRegistered = false;
      break;
    }
    case SET_PHOTO_URL: {
      stateCopy.user.photo_url = action.payload;
      const user = getUserFromStorage();
      user.photo_url = action.payload;
      window.localStorage.setItem(USER_STORAGE_NAME, JSON.stringify(user));
      break;
    }
    case SET_USERNAME: {
      stateCopy.user.username = action.payload;
      const user = getUserFromStorage();
      user.username = action.payload;
      window.localStorage.setItem(USER_STORAGE_NAME, JSON.stringify(user));
      break;
    }
    case TOGGLE_REGISTER: {
      stateCopy.isRegistered = !stateCopy.isRegistered;
      break;
    }
    default: break;
  }
  return stateCopy;
};

export {
  userReducer, createUserThunk, loginThunk, logoutThunk, registerThunk,
};
