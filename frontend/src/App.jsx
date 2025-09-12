
import { useState } from 'react'
import './App.css'
import  Welcome from './components/welcome/Welcome'
import Header from './components/header';
import { Outlet } from 'react-router-dom';


function App() {
  const [user, setUser] = useState(false);

  return (
    <>
      {(user !== true) ?
        <>
          <Header />
          <Outlet />
        </> :
        <Welcome setUser={ setUser} />}
      
    </>
  )
}

export default App
