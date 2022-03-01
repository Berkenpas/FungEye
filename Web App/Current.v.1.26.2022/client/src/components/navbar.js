import React, {useContext} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {UserContext} from '../App'

const NavBar = ()=>{
    const navigate = useNavigate()
    const {state, dispatch} = useContext(UserContext)
    const renderList = () =>{
        if(state){
            return [
            <li><Link to="/myuploads">My Uploads</Link></li>,
            <li><Link to="/uploadimage">Upload Photo</Link></li>,
            <li><Link to="/aboutus">About Us</Link></li>,
            <li>
                <button className="btn waves-effect waves-light #a1887f brown lighten-2" 
                onClick = {()=>{
                    localStorage.clear()
                    dispatch({type: "CLEAR"})
                    navigate('/login')
                }}>
                    Logout
                </button>
            </li>
            
            ]
        }
        else{
            return [
            <li><Link to="/login">Login</Link></li>,
            <li><Link to="/signup">Sign Up</Link></li>
            
            ]
        }
    }

    return(
        <nav>
        <div className="nav-wrapper green" >
            <Link to= {state?"/":"/login"} className="brand-logo left">FungEye</Link>
            <ul id="nav-mobile" className="right">
                {renderList()}
            </ul>
        </div>
        </nav>
    )
}

export default NavBar;