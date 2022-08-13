import {
  db,
  collection,
  getDocs,
  doc,
  query,
  where,
  limit,
  getDoc,
} from '../firebase';

export const getUsers = async (uid, searchFilterValue) => {
  const users = [];
  const q = query(
    collection(db, 'users'),
    where('uid', 'not-in', [uid], limit(3))
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    users.push(doc.data());
  });
  const usersFiltered = users.filter((user) => {
    const index = user.name
      .toLowerCase()
      .indexOf(searchFilterValue.toLowerCase());
    return index !== -1;
  });
  return usersFiltered;
};
export const getAllUsers = async (uid, searchFilterValue) => {
  const users = [];
  const q = query(collection(db, 'users'), where('uid', 'not-in', [uid]));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    users.push(doc.data());
  });
  const usersFiltered = users.filter((user) => {
    const index = user.name
      .toLowerCase()
      .indexOf(searchFilterValue.toLowerCase());
    return index !== -1;
  });
  return usersFiltered;
};
export const getPostsByContent = async (searchFilterValue) => {
  const posts = [];
  const q = query(collection(db, 'post'));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    posts.push(doc.data());
  });
  const postsFiltered = posts.filter((post) => {
    const index = post.content
      .toLowerCase()
      .indexOf(searchFilterValue.toLowerCase());
    return index !== -1;
  });
  return postsFiltered;
};
export const getPostsById = async (id) => {
  const postDoc = await getDoc(doc(db, 'post', id));
  if (postDoc.exists()) {
    return postDoc.data();
  } else {
    return null;
  }
};
export const getPostsByUid = async (uid) => {
  const posts = [];
  const q = query(collection(db, 'post'), where('author.uid', '==', uid));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    let post = doc.data();
    post.id = doc.id;
    posts.push(post);
  });
  return posts;
};
export const getCommentsByPostId = async (id) => {
  const comments = [];
  const q = query(collection(db, 'comments'), where('postId', '==', id));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    let comment = doc.data();
    comment.id = doc.id;
    comments.push(comment);
  });
  const group = {};
  comments.forEach((comment) => {
    group[comment.parentId] ||= [];
    group[comment.parentId].push(comment);
  });
  const rootComments = group[null];
  const getChildComments = (parentId) => group[parentId];
  console.log(comments, rootComments);
  return {comments, rootComments, getChildComments};
};
