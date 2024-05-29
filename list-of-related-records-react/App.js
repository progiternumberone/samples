import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ActiveUserContext from './ActiveUserContext';
//import logo from './logo.svg';
import "primereact/resources/themes/bootstrap4-light-blue/theme.css";
import './App.css';
import HomePage from './HomePage'; // Import HomePage
import CustomerProofreaders from './views/customer/CustomerProofreaders'; // Import ViewPNC

function App() {
  const [activeUser, setActiveUser] = useState(null);

  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL_USER)
      .then(response => response.json())
      .then(data => setActiveUser(data));
  }, []);

  return (
    <ActiveUserContext.Provider value={{ activeUser, setActiveUser }}>
      <Router>
        <div className="App">
          {/*
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
          </header>
          */}
          {/* Define your routes here */}
          <div className="container">
            <Routes>
              <Route exact path="/app" element={<HomePage/>} />
              <Route exact path="/app/customer/proofreaders" element={<CustomerProofreaders />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ActiveUserContext.Provider>
  );
}

export default App;
