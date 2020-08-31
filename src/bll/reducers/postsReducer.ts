import { message } from 'antd';
import {
  Action, Post, PostsState, User,
} from '../../types/types';
import { db } from '../../fbconfig';
import { USER_COLLECTION_NAME } from './userReducer';

export const POSTS_COLLECTION_NAME = 'posts';
export const COMMENTS_COLLECTION_NAME = 'comments';
const initialState: PostsState = {
  posts: [],
  isFetching: false,
};
const BASE_ACTION = 'REACTIA/POSTS/';
const SET_POSTS = `${BASE_ACTION}SET_POSTS`;
const ADD_POST = `${BASE_ACTION}ADD_POST`;
const TOGGLE_FETCHING = `${BASE_ACTION}TOGGLE_FETCHING`;

type VALID_ACTION = typeof SET_POSTS | typeof TOGGLE_FETCHING | typeof ADD_POST;

const toggleFetchingAC = (): Action<typeof TOGGLE_FETCHING, never> => ({
  type: TOGGLE_FETCHING,
});

const setPostsAC = (posts: Array<Post>): Action<typeof SET_POSTS, Array<Post>> => ({
  type: SET_POSTS,
  payload: posts,
});

const addPostAC = (post: Post): Action<typeof ADD_POST, Post> => ({
  type: ADD_POST,
  payload: post,
});

const getPostsByIDThunk = (id: string) => (dispatch: any) => {
  db.collection(POSTS_COLLECTION_NAME).where('author', '==', id).get().then((querry) => {
    querry.forEach((data) => {
      const post: Post = {
        author: '',
        created_at: new Date(),
        comments: [],
        title: '',
        desc: '',
      };
      const comments: Array<Comment> = [];
      const commentsID: Array<string> = data.data().comments || ['id'];
      commentsID.forEach((commentID) => {
        db.collection(COMMENTS_COLLECTION_NAME).doc(commentID).get().then((comment) => {
          comments.push(comment.data() as Comment);
        })
          .then(() => {
            const {
              author, created_at, desc, title,
            } = data.data() as Post;
            // @ts-ignore
            post.comments = comments;
            post.author = author;
            post.created_at = created_at;
            post.desc = desc;
            post.title = title;
            dispatch(addPostAC(post));
          });
      });
    });
  });
};

const getPostsThunkByUserID = (id: string) => (dispatch: any) => {
  dispatch(toggleFetchingAC());
  dispatch(setPostsAC([]));
  db.collection(USER_COLLECTION_NAME).doc(id).get().then((querry) => {
    const user: User = querry.data() as User;
    dispatch(getPostsByIDThunk(user.id));
    user.friends.forEach((friend: string) => {
      dispatch(getPostsByIDThunk(friend));
    });
  })
    .catch((error) => {
      message.error(error, 2);
    })
    .finally(() => {
      dispatch(toggleFetchingAC());
    });
};

const postsReducer = (state = initialState, action: Action<VALID_ACTION, any>) => {
  const stateCopy = { ...state };
  stateCopy.posts = [...state.posts];
  switch (action.type) {
    case TOGGLE_FETCHING: {
      stateCopy.isFetching = !stateCopy.isFetching;
      break;
    }
    case SET_POSTS: {
      stateCopy.posts = action.payload;
      break;
    }
    case ADD_POST: {
      stateCopy.posts.push(action.payload);
      break;
    }
    default: break;
  }
  return stateCopy;
};

export { getPostsThunkByUserID, postsReducer };
