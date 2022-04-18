import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import M from 'materialize-css';

const Signup = ()=>{
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    const PostData = ()=>{
        //insert here for username max char, video 19 @ 20 min
        fetch("/signup",{
            method: "post",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({
                name,
                email,
                password
            })
        }).then(res=>res.json())
        .then(data =>{
            if(data.error){
                M.toast({html: data.error, classes:"#c62828 red darken-3"})
            }
            else{
                M.toast({html: data.message, classes: "#4caf50 green"})
                navigate('/login');
            }
        }).catch(err=>{
            console.log(err)
        })

    }

    return(
        <div className = "myCard">
            <div className="card auth-card">
                <h2>Sign Up</h2>
                <input
                    type = 'text'
                    placeholder = 'name'
                    value = {name}
                    onChange = {(e)=> setName(e.target.value)}
                />
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
                <button className="btn waves-effect waves-light #a1887f brown lighten-2" onClick = {()=> PostData()}>
                    Sign Up
                </button>
                <h5>
                    <Link to = '/login'> Already have an account?</Link>
                </h5>
            </div>
        </div>
    )
}



export default Signup;