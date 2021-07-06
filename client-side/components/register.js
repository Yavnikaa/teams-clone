import React, {useState} from 'react'
import axios from 'axios'
import { useHistory } from 'react-router'
import regeneratorRuntime from "regenerator-runtime";

import { FontSizes } from '@fluentui/theme';
import { Depths } from '@fluentui/theme';
import { TextField } from '@fluentui/react/lib/TextField';
import {PrimaryButton } from '@fluentui/react/lib/Button';
import './styles.css';
import placeholderimage from '../../assets/signup.png';


const Register= () => {
    let history=useHistory();
    const [username, setUsername]=useState();
    const [email,setEmail]=useState();
    const [password,setPassword]=useState();
    const [bio,setBio]=useState();

    const postdata=async(e)=>{
        e.preventdefault();
        console.log(email);
        console.log(username);
        console.log(password);
        console.log(bio);
        const res= await axios({
            method:"POST",
            url:'/api/v1/user/register',
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify({
                username, email, password,bio
            }),
            responseType: "json"
        }).then(res=>{
            history.push('/');
            console.log(res);
        }).catch((error)=>{
            console.log("2",error.response);
        })
    }
    return (
        <div className="container">
            <section className="floatleft">
                <img src={placeholderimage} width="100%" className="image"/>
            </section>
        <div style={{ boxShadow: Depths.depth8 }} className="floatright">
        <div style={{ fontSize: FontSizes.size24 }} >
            Sign up!
        </div>
        <br/>
        <div style={{ fontSize: FontSizes.size20 }}>
            <form onSubmit={postdata} className="form">
                <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} required  />
                <br/>
                <TextField label="Password" value={password} onChange={(e) => setPassword(e.target.value)}type="password" canRevealPassword revealPasswordAriaLabel="Show password"/>
                <br/>
                <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                <br/>
                <TextField label="Bio" value={bio} onChange={(e) => setBio(e.target.value)} required/>
                <br/> <br/>
                <PrimaryButton onclick={postdata}> Register </PrimaryButton>
            </form>
        </div>
        </div>
        </div>
    )

}

export default Register