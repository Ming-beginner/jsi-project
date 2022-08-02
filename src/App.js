import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {Navbar, Footer} from './components'
import routes from './pages/routes'

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {routes.map(({path, Page}, index) =>{
          return <Route key={index} path={path} element={<Page />} />
        })}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
