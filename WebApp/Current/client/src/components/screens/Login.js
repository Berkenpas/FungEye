import React, {useState, useContext} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import M from 'materialize-css';
import {UserContext} from '../../App'

const Login = ()=>{
    const {state, dispatch} = useContext(UserContext)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    const PostData = ()=>{
        //insert here for username max char, video 19 @ 20 min
        fetch("/login",{
            method: "post",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({
                email,
                password
            })
        }).then(res=>res.json())
        .then(data =>{
            console.log(data)
            if(data.error){
                M.toast({html: data.error, classes:"#c62828 red darken-3"})
            }
            else{
                localStorage.setItem("jwt", data.token)
                localStorage.setItem("user", JSON.stringify(data.user))
                dispatch({type: "USER", payload: data.user})
                
                M.toast({html: "Signed In", classes: "#4caf50 green"})
                navigate('/');
            }
        }).catch(err=>{
            console.log(err)
        })

    }
    return(
        <div className = "myCar">
            <div className="card auth-card">
                <h2>Login</h2>
                <input
                    type = 'email'
                    placeholder = 'email'
                    value = {email}
                    onChange = {(e)=> setEmail(e.target.value)}
                />
                <input
                    type = 'password'
                    placeholder = 'password'
                    value = {password}
                    onChange = {(e)=> setPassword(e.target.value)}
                />
                <button className="btn waves-effect waves-light #a1887f brown lighten-2" 
                onClick = {()=>PostData()}>
                    Login
                </button>
                <h5>
                    <Link to = '/signup'> Don't have an account?</Link>
                </h5>
            </div>
        </div>
    )
}



export default Login;