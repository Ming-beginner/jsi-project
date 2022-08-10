import {db, collection, getDocs, query, where, limit} from '../firebase';

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
    const userFiltered = users.filter((user) => {
        const index = user.name
            .toLowerCase()
            .indexOf(searchFilterValue.toLowerCase());
        return index !== -1;
    });
    return userFiltered;
};
export const getAllUsers = async (uid, searchFilterValue) => {
    const users = [];
    const q = query(collection(db, 'users'), where('uid', 'not-in', [uid]));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        users.push(doc.data());
    });
    const userFiltered = users.filter((user) => {
        const index = user.name
            .toLowerCase()
            .indexOf(searchFilterValue.toLowerCase());
        return index !== -1;
    });
    return userFiltered;
};
export const getPosts = async (uid, searchFilterValue) => {
    const users = [];
    const q = query(collection(db, 'users'), where('uid', 'not-in', [uid]));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        users.push(doc.data());
    });
    const userFiltered = users.filter((user) => {
        const index = user.name
            .toLowerCase()
            .indexOf(searchFilterValue.toLowerCase());
        return index !== -1;
    });
    return userFiltered;
};
