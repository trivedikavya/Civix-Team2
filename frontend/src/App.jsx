import { useState, useEffect } from 'react';
import './App.css'
import  Welcome from './components/welcome/Welcome'
import Header from './components/header';
import { Outlet } from 'react-router-dom';


function App() {
  const [user, setUser] = useState(false);

  // This hook checks for a token in localStorage when the app starts
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser(true);
    }
  }, []); // The empty array ensures this runs only once


  return (
    <>
      {(user === true) ?
        <>
          <Header />
          <Outlet />
        </> :
        <Welcome setUser={ setUser} />}
      
    </>
  )
}

export default App;