import React, {useState} from 'react'
import axios from 'axios'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom';
import regeneratorRuntime from "regenerator-runtime";

import { FontSizes } from '@fluentui/theme';
import { Depths } from '@fluentui/theme';
import { TextField } from '@fluentui/react/lib/TextField';
import {PrimaryButton } from '@fluentui/react/lib/Button';
import LoginImage from '../../assets/login.png';
import './styles.css'

const Login=(props)=>{
    let history=useHistory();
    const [username, setUsername]=useState();
    const [password,setPassword]=useState();
    const [email,setEmail]=useState();
    
    const postdata=async(e)=>{
        // e.preventdefault();
        console.log(username);
        console.log(password);
        console.log(email);
        const res= await axios({
            method:"POST",
            url:'http://localhost:8080/api/v1/user/auth',
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify({
                username, password,email
            }),
            responseType: "json"
        }).then((res)=>{
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('username', res.data.username);
            history.push('/');
            window.location.reload();
        }).catch((error)=>{
        console.log("2",error.response);
    })
}
return (
    <div className="container">
        <section className="floatleft">
                <img src={LoginImage} className="image-login" />
        </section>
        <div style={{ boxShadow: Depths.depth8 }} className="floatright">;
        <div style={{ fontSize: FontSizes.size24 }}>
            Login here!
        </div>
        <br/>
        <div style={{ fontSize: FontSizes.size20 }}>
            <form  className="form">
               <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <br/>
                <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                <br/>
                <TextField label="Password" value={password} onChange={(e) => setPassword(e.target.value)}type="password" canRevealPassword revealPasswordAriaLabel="Show password"/>
                <br/>
                <PrimaryButton onClick={postdata}> Sign in </PrimaryButton>
            </form>
            <br/>
            <div style={{ fontSize: FontSizes.size16 }}> New here?
            <Link to="/register"  style={{ fontSize: FontSizes.size16 }} className="link" > Register. </Link>
            </div>
        </div>
        </div>
    </div>
)
}

export default Login