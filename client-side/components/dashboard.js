import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router'
import { useHistory } from 'react-router'
import axios from 'axios'
import Peer from 'peerjs'
import logout from '../utils/logout'
import { TextField, Persona, PersonaSize, Stack, PrimaryButton } from '@fluentui/react'

import './styles.css'

const userId= localStorage.getItem('id');
const peer= new Peer(userId, {debug:3});

const Dashboard = ({ }) => {
    
    let history = useHistory();
    const [users, setUsers] = useState([])
    const [message, setMessage] = useState('')
    const [selectedUser, setSelectedUser] = useState(null)
    const [selectedChat, setSelectedChat] = useState([])
    const [newMessage, setNewMessage]=useState(null)
    const token = localStorage.getItem('token')
    if (!token) {
        return <Redirect to='/login' />
    }
    const getMessages = (user) => {
        axios({
            method: "GET",
            url: '/api/v1/chat/messages/',
            params: {
                "recipient": `${user}`,
            },
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            responseType: "json"
        }).then((res) => {
            if (selectedUser) {
                setSelectedChat(res.data)
            }
        }).catch((error) => {
            console.log(error)
        })
    }
    const getUsers = async (setFirstUser = false) => {
        try {
            const res = await axios({
                method: "GET",
                url: '/api/v1/all/list',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                responseType: "json"
            })
            setUsers(res.data.users)
            if (setFirstUser && res.data.users.length > 0)
                setSelectedUser(res.data.users[0])

        }
        catch (error) {
        }
    }
    const sendMessage = async () => {
        if (message.length > 0 && selectedUser.username) {
            try {
                const res = await axios({
                    method: "POST",
                    url: '/api/v1/chat/send',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    responseType: "json",
                    data: {
                        recipient: selectedUser.username,
                        message: message
                    }
                })
                setSelectedChat([res.data, ...selectedChat])
                const conn= peer.connect(selectedUser._id);
                conn.on('open', ()=> {
                    conn.send({...res.data, type:'text-message'})
                })
                setMessage('')
            } catch (err) {
                console.log(err)
            }
        }
    }

  
    useEffect(async () => {
        await getUsers(true);
        peer.on('connection', (conn)=>{
            conn.on('data', (data) => {
                console.log("3", data);
                setNewMessage(data);
            })
        })
    }, []);


    useEffect(() => {
        if (selectedUser) getMessages(selectedUser.username)
    }, [selectedUser]);

    useEffect(()=> {
        if (newMessage && newMessage.type==='text-message'){
            console.log("ajfdvdnms")
            console.log(newMessage, selectedUser);
            if (newMessage.sender=== selectedUser._id){
                setSelectedChat([newMessage, ...selectedChat])
                console.log(newMessage);
            }
        }
    }, [newMessage]);

    return (
        <div className='dash-container'>
            <div className='dash-left-div'>
                <Stack tokens={{ childrenGap: 20 }} >
                    {users.map((user, i) => {
                        return (
                            <Persona key={i} className={`${(selectedUser && user.username === selectedUser.username) ? 'selected-persona' : ''} user-persona`} text={users[i].username} size={PersonaSize.size48} secondaryText={users[i].bio} imageInitials={users[i].username[0]}
                                value={selectedUser} onClick={(e) => setSelectedUser(user)} />
                        )
                    })}
                </Stack>
            </div>
            <div className='dash-right-div'>
                <div className='dash-messages'>
                    {selectedChat.map(chat => {
                        return (
                            <div key={chat._id} className={`message-bubble ${chat.sender === selectedUser._id ? 'your-bubble' : 'my-bubble'}`}>{chat.message}</div>
                        )
                    })}
                </div>
                <div className='dash-send'>
                    <TextField value={message} multiline resizable={false} rows={2} placeholder='enter message' className='message-text-field'
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(event) => {
                            if (event.key === 'Enter') {
                                sendMessage()
                            }
                        }}
                    />
                    <PrimaryButton onClick={sendMessage} text="Primary" className='send-btn' />
                </div>
            </div>
        </div>
    )
}
export default Dashboard