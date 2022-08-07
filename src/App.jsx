import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {Navbar, Sidebar} from './components';
import routes from './pages/routes';

function App() {
    return (
        <Router>
            <Navbar />
            <div
                className='d-flex app-container'
                style={{
                    background: 'var(--bg-color)',
                    minHeight: '100vh',
                    paddingTop: 106,
                    marginLeft: 62,
                }}
            >
                <Sidebar />
                <Routes className='flex-fill'>
                    {routes.map(({path, Page}, index) => {
                        return (
                            <Route
                                className='flex-fill'
                                key={index}
                                path={path}
                                element={<Page />}
                            />
                        );
                    })}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
