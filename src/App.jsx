import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {Navbar, Sidebar, ChatNotification} from './components';
import {db, useCurrentUser, query, collection, onSnapshot} from './firebase';
import {ToastContainer} from 'react-bootstrap';
import routes from './pages/routes';

function App() {
  const [unreadMessages, setUnreadMessages] = useState([]);
  const currentUser = useCurrentUser();
  useEffect(() => {
    if (currentUser) {
      const lastMsgRef = collection(db, 'lastMsg');
      const q = query(lastMsgRef);
      const unsub = onSnapshot(q, (querySnapshot) => {
        let unreadMessages = [];
        querySnapshot.forEach((doc) => {
          if (doc.data().to === currentUser.uid && doc.data().unread) {
            unreadMessages.push(doc.data());
          }
        });
        setUnreadMessages(unreadMessages);
      });
      return () => unsub();
    }
  }, []);
  return (
    <Router>
      <Navbar />
      <div
        className='d-flex app-container'
        style={{
          background: 'var(--bg-color)',
          minHeight: 'calc(100vh - 90px)',
          marginLeft: 62,
          marginTop: 90,
        }}
      >
        <Sidebar />
        <Routes className='flex-fill'>
          {routes.map(({path, Page, subPath}, index) => {
            return subPath ? (
              <Route className='flex-fill' key={index} path={path}>
                <Route path={subPath} element={<Page />} />
              </Route>
            ) : (
              <Route
                className='flex-fill'
                key={index}
                path={path}
                element={<Page />}
              />
            );
          })}
        </Routes>
        {currentUser && (
          <ToastContainer position='bottom-end' className='position-fixed'>
            {unreadMessages.map((message, index) => {
              return <ChatNotification key={index} lastMsg={message} />;
            })}
          </ToastContainer>
        )}
      </div>
    </Router>
  );
}

export default App;
