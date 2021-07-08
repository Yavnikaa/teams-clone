import React, { useState } from 'react'
import axios from 'axios'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom';
import regeneratorRuntime from "regenerator-runtime";

import { FontSizes } from '@fluentui/theme';
import { Depths } from '@fluentui/theme';
import { TextField } from '@fluentui/react/lib/TextField';
import { PrimaryButton, MessageBar, MessageBarType } from '@fluentui/react';
import LoginImage from '../../assets/login.png';
import './styles.css'

const Login = (props) => {
    let history = useHistory();
    const [username, setUsername] = useState();
    const [password, setPassword] = useState("");
    const [errorMessage, setError] = useState();

    const postdata = async (e) => {
        const res = await axios({
            method: "POST",
            url: '/api/v1/user/auth',
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify({
                username, password
            }),
            responseType: "json"
        }).then((res) => {
            setError("")
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('username', res.data.username);
            localStorage.setItem('id', res.data._id);
            history.push('/');
        }).catch((error) => {
            const { data } = error.response
            if (data) setError(data)
        })
    }
    return (
        <div className="container">
            <section className="floatleft">
                <img src={LoginImage} className="image-login" />
            </section>
            <div style={{ boxShadow: Depths.depth8 }} className="floatright">
                <div style={{ fontSize: FontSizes.size24 }}>
                    Login here!
                </div>
                <br />
                {errorMessage ? <MessageBar
                    messageBarType={MessageBarType.error}
                >{errorMessage}</MessageBar> : null}
                <div style={{ fontSize: FontSizes.size20 }}>
                    <form className="form">
                        <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username / email" required />
                        <br />
                        <TextField label="Password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" canRevealPassword revealPasswordAriaLabel="Show password" />
                        <br />
                        <PrimaryButton onClick={postdata}> Sign in </PrimaryButton>
                    </form>
                    <br />
                    <div style={{ fontSize: FontSizes.size16 }}> New here?
                        <Link to="/register" style={{ fontSize: FontSizes.size16 }} className="link" > Register. </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login