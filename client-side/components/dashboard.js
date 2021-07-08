import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router'
import { useHistory } from 'react-router'
import axios from 'axios'
import logout from '../utils/logout'

import { Persona,  PersonaSize, Stack } from '@fluentui/react/lib';

const Dashboard = ({ }) => {
    let history = useHistory();
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState([])
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
                if (users.length > 0) setSelectedUser([users[0]])
        }).catch((error) => {
            console.log(error)
        }, []),
        axios({
            method:"GET",
            url:'/api/v1/chat/messages/',
            params: {
                "recipient": `${selectedUser.username}`,
            },
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            responseType: "json"
        }).then((res) => {
            if (selectedUser){
                setSelectedChat(res.data)
            }
        }).catch ((error) => {
            console.log(error)
        }, [])
    });
    return (
        <div>
            <Stack tokens={{ childrenGap: 20 }} >
                {users.map((user,i)=> {
                    return (
                        <Persona key={i} text={users[i].username} size={PersonaSize.size48} secondaryText={users[i].bio} imageInitials={users[i].username[0]}
                       value={selectedUser} onClick={(e) => setSelectedUser(e.target.value)} />
                    )
                })}
            </Stack>
            <div> {JSON.stringify(selectedChat)} </div>
            
        </div>
    )
}
export default Dashboard