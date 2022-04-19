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
                <div >
                    {/*<ul id='dropdown1' class='dropdown-content'>*/}
                        <li><Link to={state?"/vote":"/login" } className= 'navbar'>Vote</Link></li>
                        <li><Link to="/voteresults" className= 'navbar'>Vote Results</Link></li>
                        <li><Link to="/uploadimage" className= 'navbar'>Upload Photo</Link></li>
                        <li><Link to="/myuploads" className= 'navbar'>My Uploads</Link></li>
                        <li><Link to="/aboutus" className= 'navbar'>About Us</Link></li>
                        <li class="divider"></li>
                        <li><a onClick={()=>{
                                localStorage.clear()
                                dispatch({type: "CLEAR"})
                                navigate('/')
                        }} className= 'navbar'>Logout</a>
                        </li>
                    {/*</ul>*/}
                    
                    
                    {/*<li><a class="dropdown-trigger" data-target="dropdown1">Menu<i class="material-icons right">arrow_drop_down</i></a></li>*/}
                    

                </div>
                
            ]
        }
        else{
            return [
            <li><Link to="/login" className= 'navbar'>Login</Link></li>,
            <li><Link to="/signup" className= 'navbar'>Sign Up</Link></li>,
            <li><Link to="/aboutus" className= 'navbar'>About Us</Link></li>
            ]
        }
    }

    return(
        <nav>
        <div className="nav-wrapper green" >
            <Link to= '/' className="brand-logo left">FungEye</Link>
            <ul id="nav-mobile" className="right">
                {renderList()}
            </ul>
        </div>
        </nav>
    )
}

export default NavBar;