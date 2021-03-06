import React, {useEffect, createContext, useReducer, useContext} from 'react';
import NavBar from './components/navbar'
import "./App.css"
import {BrowserRouter, Route, Routes, useNavigate} from 'react-router-dom';
import Home from './components/screens/Home'
import Profile from './components/screens/Profile'
import Login from './components/screens/Login'
import Signup from './components/screens/Signup'
import CreatePost from './components/screens/CreatePost'
import AboutUs from './components/screens/AboutUs'
import VoteResults from './components/screens/VoteResults'
import HomeOfficial from './components/screens/HomeOfficial'
import {reducer, initialState} from './reducers/userReducer'

export const UserContext = createContext()

const Routing = () =>{
  const navigate = useNavigate()
  const{state, dispatch} = useContext(UserContext)

  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))   
    if(user){
      dispatch({type: "USER", payload: user})
    }
    else{
      navigate('/')
    }
  }, [])

  return(
    <Routes>
        <Route path = '/' element = {<HomeOfficial/>}/>
        <Route path = '/vote' element = {<Home/>}/>
        <Route path = '/login' element = {<Login/>}/>
        <Route path = '/signup' element = {<Signup/>}/>
        <Route path = '/myuploads' element = {<Profile/>}/>
        <Route path = '/uploadimage' element = {<CreatePost/>}/>
        <Route path = '/aboutus' element = {<AboutUs/>}/>
        <Route path = '/voteresults' element = {<VoteResults/>}/>
    </Routes>
     
  )
}


function App() {

  const [state, dispatch] = useReducer(reducer, initialState)
  return ( 
    <UserContext.Provider value = {{state, dispatch}}>
      <BrowserRouter>
        <NavBar/>
        <Routing/>
      </BrowserRouter>
    </UserContext.Provider>
    

  );
}

export default App;
