import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {Navbar, Footer, Sidebar} from './components'
import routes from './pages/routes'

function App() {
  return (
    <Router>
      <Navbar />
      <div className='d-flex' style={{background:'var(--bg-color)', minHeight:'100vh', paddingTop: 106, }}>
        <Sidebar />
        <Routes className='flex-fill' >
            {routes.map(({path, Page}, index) =>{
              return <Route className='flex-fill' key={index} path={path} element={<Page />} />
            })}
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
