import React, {Component, useContext} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {UserContext} from '../App'
import M from 'materialize-css'


document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.dropdown-trigger');
    var instances = M.Dropdown.init(elems);
});

const NavBar = ()=>{
    const navigate = useNavigate()
    const {state, dispatch} = useContext(UserContext)
    const renderList = () =>{
        if(state){
            return [
                <div>
                    <a class='dropdown-trigger' data-target='dropdown1'>Menu</a>
                    <ul id='dropdown1' class='dropdown-content'>
                        <li><Link to="/myuploads">My Uploads</Link></li>,
                        <li><Link to="/uploadimage">Upload Photo</Link></li>,
                        <li><Link to="/aboutus">About Us</Link></li>,
                        <li><Link to="/voteresults">Vote Results</Link></li>,
                    </ul>
                </div>
                
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