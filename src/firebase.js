import { initializeApp } from "firebase/app";
import { getAuth, signOut } from "firebase/auth";
import {getFirestore, doc, setDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { useAuthState } from "react-firebase-hooks/auth";

const env = process.env;

const firebaseConfig = {
    apiKey: env.REACT_APP_API_KEY,
    authDomain: env.REACT_APP_AUTH_DOMAIN ,
    databaseURL: env.REACT_APP_DATABASE_URL,
    projectId: env.REACT_APP_PROJECT_ID,
    storageBucket: env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: env.REACT_APP_MESSAGE_SENDER_ID,
    appId: env.REACT_APP_APP_ID,
    measurementId: env.REACT_APP_MESSUREMENT_ID
};

const useCurrentUser = ()=>{
    const [user, loading, error] = useAuthState(auth); 
    return user;
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app)
const storage = getStorage(app);

export {auth, db, signOut, ref, storage, getDownloadURL, useCurrentUser, doc, setDoc, updateDoc};