
import { useState } from 'react'
import './App.css'
import  Welcome from './components/welcome/Welcome'
import Header from './components/header';
import { Outlet } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';



function App() {
  const [user, setUser] = useState(false);

  return (
    <>
      {/* {(user !== true) ?
        <>
          <Header />
          <Outlet />
        </> :
        <Welcome setUser={ setUser} />} */}
      
       <Dashboard />
    </>
  )
}

export default App
