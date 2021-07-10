import React, { useEffect, useState , useRef} from 'react'
import { Redirect } from 'react-router'
import { useHistory } from 'react-router'
import axios from 'axios'
import { TextField, Persona, PersonaSize, Stack, PersonaPresence, IconButton, Callout , Modal } from '@fluentui/react'
import Peer from 'peerjs'
import './styles.css'
import { FontSizes, FontWeights } from '@fluentui/theme';
const userId = localStorage.getItem('id');
const my_username = localStorage.getItem('username');
const peer = new Peer(userId)

const Dashboard = ({ }) => {
    let history = useHistory();
    const [users, setUsers] = useState([])
    const [message, setMessage] = useState('')
    const [selectedUser, setSelectedUser] = useState(null)
    const [selectedChat, setSelectedChat] = useState([])
    const [newMessage, setNewMessage] = useState(null)
    const [callOut, setCallOut] = useState(true)
    const [modal, setModal] = useState(false)
    const [stream1, setStream1] = useState(null)
    const token = localStorage.getItem('token')
    const myStrRef= useRef()

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('id');
        history.replace('/login');
    }

    const logout_icon = { iconName: 'FollowUser' }

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
                const conn = peer.connect(selectedUser._id);
                conn.on('open', () => {
                    conn.send({ ...res.data, type: 'text-message' })
                })
                setMessage('')
            } catch (err) {
                console.log(err)
            }
        }
    }
    useEffect(async () => {
        await getUsers(true);
        peer.on('connection', (conn) => {
            conn.on('data', (data) => {
                setNewMessage(data)
            })
        });
    }, []);
    useEffect(() => {
        if (selectedUser) getMessages(selectedUser.username)
    }, [selectedUser]);
    useEffect(() => {
        if (newMessage && newMessage.type === 'text-message') {
            if (newMessage.sender === selectedUser._id) {
                setSelectedChat([newMessage, ...selectedChat])
            }
            let sender;
            let curUsers = users.filter(user => {
                if (user._id === newMessage.sender) {
                    sender = user;
                    sender.count = sender.count ? sender.count + 1 : 1;
                }
                return user._id != newMessage.sender
            })
            if (sender) curUsers = [sender, ...curUsers]
            setUsers(curUsers)
        }
    }, [newMessage]);
    
    const requestLocalVideo = (success,fail) => {
        navigator.getUserMedia= navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia
        navigator.getUserMedia({audio:true, video:true}, success, fail)
    }


    const handleVideoCall=()=>{
        const handleSuccess = (stream) => {
           setModal(true)
           setStream1()
        }
        const handleFail = () => {
            setCallOut(false)
        }
        requestLocalVideo(handleSuccess,handleFail)
    }

    return (
        <div className='dash'>
            <div className='dash-header'>
                <div className='dash-title' style={{ fontSize: FontSizes.size18, fontWeight: FontWeights.semibold }}>Microsoft Teams</div>
                <div className='dash-user'>
                    <IconButton onClick={logout} iconProps={logout_icon} style={{ color: "#fff" }} />
                    <Persona className="my-persona" secondaryText="Available" text={my_username} size={PersonaSize.size32} presence={PersonaPresence.online} />
                </div>
            </div>
            <div className='dash-container'>
                <div className='dash-left-div'>
                    <div className='left-header'>Chat</div>
                    <Stack className='left-stack' >
                        {users.map((user, i) => {
                            if (users[i].username != my_username) {
                                return (
                                    <div className={`${(selectedUser && user.username === selectedUser.username) ? 'selected-persona' : ''} user-persona`} onClick={(e) => {
                                        setUsers(users.filter(u => {
                                            if (user._id == u._id) u.count = 0;
                                            return u
                                        }))
                                        setSelectedUser(user)
                                    }} >
                                        <Persona key={i} text={users[i].username} size={PersonaSize.size40} secondaryText={users[i].bio} />
                                        {user.count > 0 ? <div className='new-ms'>{user.count}</div> : null}
                                    </div>
                                )
                            }
                        })}
                    </Stack>
                </div>
                <div className='dash-right-div'>
                    <div className="right-header">
                        <div className='chat-person'>
                            {selectedUser && <Persona size={PersonaSize.size32}
                                text={selectedUser.username} />}
                        </div>
                        <IconButton onClick={handleVideoCall} iconProps={{iconName:"video", style: { fontSize: '24px' }}} className="call" id="call-btn" />
                    </div>
                    <div className='dash-messages'>
                        {selectedChat.map(chat => {
                            const updatedAt = new Date(chat.updatedAt);
                            const now = new Date();
                            return (
                                <div key={chat._id} className={`message-bubble ${chat.sender === selectedUser._id ? 'your-bubble' : 'my-bubble'}`}>
                                    {chat.sender === selectedUser._id ? <Persona size={PersonaSize.size32}
                                        text={selectedUser.username} hidePersonaDetails /> : null}
                                    <div className='message-text'>
                                        <div className='timestamp'>
                                            <div className='username'>
                                                {chat.sender === selectedUser._id ? selectedUser.username : null}
                                            </div>
                                            {now.toDateString() != updatedAt.toDateString() ? updatedAt.toLocaleDateString() : ''} {updatedAt.toLocaleTimeString()} </div>
                                        <div>
                                            {chat.message}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className='dash-send'>
                        <TextField value={message} borderless resizable={false} rows={2} placeholder='Type a new message' className='message-text-field'
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={(event) => {
                                if (event.key === 'Enter') {
                                    sendMessage()
                                }
                            }}
                        />
                        <IconButton onClick={sendMessage} iconProps={{ iconName: "send", style: { fontSize: '24px' } }} className='send-btn' />
                    </div>
                    <Callout isBeakVisible={false} target='#call-btn' className="permission-callout" hidden={callOut}> You need to give permissions for camera and microphone.
                    <IconButton onClick={()=>setCallOut(true)} iconProps={{iconName:"ChromeClose" }} className="close-btn"/> </Callout>

                    <Modal className='call-modal' isOpen={ modal} isBlocking={true}> <div className='vc-div'>
                        <div className='stream-div'>
                            <video ref={myStrRef} className='stream-one video-stream'> </video>
                            <div className='stream-two video-stream'> </div>
                        </div>
                        <div className='control-div'> </div>
                        </div>
                        </Modal>
                </div>
            </div>
        </div>
    )
}
export default Dashboard