import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import MyLayout from '../Layout/MyLayout';
import { RootState } from '../../store';
import { getPostsThunkByUserID } from '../../bll/reducers/postsReducer';
import FullScreenPreloader from '../FullScreenPreloader/FullScreenPreloader';

const Posts = ({
  posts, isFetching, userId, fetchPosts,
}: ConnectedProps<typeof connector>) => {
  useEffect(() => {
    if (userId) {
      fetchPosts(userId);
    }
  }, []);
  if (isFetching) {
    return (
      <MyLayout title="Posts">
        <FullScreenPreloader />
      </MyLayout>
    );
  }
  return (
    <MyLayout title="Posts">
      { JSON.stringify(posts) }
    </MyLayout>
  );
};

const mapStateToProps = (state: RootState) => ({
  posts: state.posts.posts,
  isFetching: state.posts.isFetching,
  userId: state.users.user.id,
});

const mapDispatchToProps = (dispatch: any) => ({
  fetchPosts: (id: string) => {
    dispatch(getPostsThunkByUserID(id));
  },
});

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(Posts);
