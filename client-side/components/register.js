import React, { useState } from 'react'
import axios from 'axios'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom';

import { PrimaryButton, TextField, Depths, FontSizes, MessageBar, MessageBarType } from '@fluentui/react';
import './styles.css';
import placeholderimage from '../../assets/signup.png';


const Register = () => {
    let history = useHistory();
    const [username, setUsername] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [errorMessage, setError] = useState();
    const [bio, setBio] = useState();

    const postdata = (e) => {
        const res = axios({
            method: "POST",
            url: '/api/v1/user/register',
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify({
                username, email, password, bio
            }),
            responseType: "json"
        }).then(res => {
            setError("");
            console.log(res);
            history.push("/login");
        }).catch((error) => {
            const { message } = error.response.data.details[0]
            if (message) setError(message)
            console.log(error.response.data);
        })
    }
    return (
        <div className="container">
            <section className="floatleft">
                <img src={placeholderimage} width="100%" className="image" />
            </section>
            <div style={{ boxShadow: Depths.depth8 }} className="floatright">
                <br />
                <div style={{ fontSize: FontSizes.size24 }} >
                    Sign up!
                </div>
                <br />
                {errorMessage ? <MessageBar
                    messageBarType={MessageBarType.error}
                >{errorMessage}</MessageBar> : null}
                <div style={{ fontSize: FontSizes.size20 }}>
                    <form className="form">
                        <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                        <br />
                        <TextField label="Password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" canRevealPassword revealPasswordAriaLabel="Show password" required />
                        <br />
                        <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <br />
                        <TextField label="Bio" value={bio} onChange={(e) => setBio(e.target.value)} />
                        <br /> <br />
                        <PrimaryButton onClick={postdata}> Register </PrimaryButton>
                    </form>
                    <br />
                    <div style={{ fontSize: FontSizes.size16 }}> Already have an account?
                        <Link to="/login" style={{ fontSize: FontSizes.size16 }} className="link" > Login. </Link>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default Register