import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router'
import { useHistory } from 'react-router'
import axios from 'axios'
import logout from '../utils/logout'
const Dashboard = ({ }) => {
    let history = useHistory();
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [selectedChat, setSelectedChat] = useState([])
    const token = localStorage.getItem('token')
    if (!token) {
        return <Redirect to='/login' />
    }
    useEffect(() => {
        axios({
            method: "GET",
            url: '/api/v1/all/list',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            responseType: "json"
        }).then((res) => {
            setUsers(res.data.users)
            if (users.length > 0) setSelectedUser(users[0])
        }).catch((error) => {
            console.log(error)
        }, [])
    });
    return (
        <div>{JSON.stringify(users)}</div>
    )
}
export default Dashboard