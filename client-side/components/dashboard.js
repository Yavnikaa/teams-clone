import React, { useEffect, useState, useCallback } from 'react'
import { Redirect } from 'react-router'
import { useHistory } from 'react-router'
import axios from 'axios'
import { TextField, Persona, PersonaSize, Stack, PersonaPresence, IconButton,Callout, FontIcon, Modal } from '@fluentui/react'
import Peer from 'peerjs'
import './styles.css'
import { FontSizes, FontWeights } from '@fluentui/theme';
const userId = localStorage.getItem('id');
const my_username = localStorage.getItem('username');
const peer = new Peer(userId)

const CallStatus = {
    outgoing: "OUTGOING",
    incoming: "INCOMING",
    ongoing: "ONGOING",
    idle: "IDLE"
}
const Dashboard = ({ }) => {

    const history = useHistory();
    const token = localStorage.getItem('token')
    const id = localStorage.getItem('id')
    const username = localStorage.getItem('username')

    const [users, setUsers] = useState([])
    const [message, setMessage] = useState('')
    const [selectedUser, setSelectedUser] = useState(null)
    const [selectedChat, setSelectedChat] = useState([])
    const [newMessage, setNewMessage] = useState(null)

    const [callout, setCallout] = useState(true)
    const [modal, setModal] = useState(false)
    const [stream1, setStream1] = useState(null)
    const [stream2, setStream2] = useState(null)
    const [callStatus, setCallStatus] = useState(CallStatus.idle)
    const [iUser, setIUser] = useState(null)
    const [iCall, setICall] = useState(null)

    const myStrRef = useCallback(node => {
        if (node !== null && stream1 !== null) {
            node.srcObject = stream1
        }
    })
    const othrStrRef = useCallback(node => {
        if (node !== null && stream2 !== null) {
            node.srcObject = stream2
        }
    })
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
        peer.on('call', (call) => {
            setModal(true)
            setCallStatus(CallStatus.incoming)
            setICall(call)
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
        else if (newMessage && newMessage.type === 'call-user') {
            setIUser(newMessage)
        }
        else if (newMessage && newMessage.type === 'decline-call') handleDisconnect()
        else if (newMessage && newMessage.type === 'accept-call') setCallStatus(CallStatus.ongoing)
        else if (newMessage && newMessage.type === 'disconnect-call') handleDisconnect()
    }, [newMessage]);
    const requestLocalVideo = (success, fail) => {
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia
        navigator.getUserMedia({ audio: true, video: true }, success, fail)
    }

    const handleVideoClick = () => {
        const handleSuccess = (stream) => {
            setModal(true)
            setStream1(stream)
            setCallStatus(CallStatus.outgoing)
            const conn = peer.connect(selectedUser._id);
            conn.on('open', () => {
                conn.send({ username, _id: id, type: 'call-user' })
            })
            const call = peer.call(selectedUser._id, stream);
            call.on('stream', (stream) => {
                setCallStatus(CallStatus.ongoing)
                setStream2(stream)
            })
        }
        const handleFail = () => {
            setCallout(false)
        }
        requestLocalVideo(handleSuccess, handleFail)
    }
    const handleDisconnect = (broadcast = false) => {
        setModal(false)
        setCallStatus(CallStatus.idle)
        setIUser(null)
        if (stream1) {
            stream1.getTracks().forEach((track) =>
                track.stop())
            setStream1(null)
        }
        if (stream2) {
            stream2.getTracks().forEach((track) =>
                track.stop())
            setStream2(null)

        }
        if (broadcast) {
            const conn = peer.connect(iUser ? iUser._id : selectedUser._id);
            conn.on('open', () => {
                conn.send({ username, _id: id, type: 'disconnect-call' })
            })
        }
    }
    const handleAccept = () => {
        const handleSuccess = (stream) => {
            setStream1(stream)
            if (iCall) iCall.answer(stream)
        }
        const handleFail = () => {
            if (iCall) iCall.answer();
        }
        setCallStatus(CallStatus.ongoing)
        if (iUser) {
            const conn = peer.connect(iUser._id);
            conn.on('open', () => {
                conn.send({ type: 'accept-call' })
            })
        }
        requestLocalVideo(handleSuccess, handleFail)
    }
    const handleDecline = () => {
        if (iUser) {
            const conn = peer.connect(iUser._id);
            conn.on('open', () => {
                conn.send({ type: 'decline-call' })
            })
        }
        setModal(false)
        setCallStatus(CallStatus.idle)
        setIUser(null)
    }
    return (
        <div className='dash' >
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
                        <IconButton onClick={handleVideoClick} iconProps={{ iconName: "video", style: { fontSize: '24px' } }} className='vcall-btn' id="call-btn" />
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
                        <IconButton onClick={sendMessage} className='send-btn' />
                    </div>
                </div>
            </div>
            <Callout isBeakVisible={false}
                target='#call-btn'
                className='permission-callout'
                hidden={callout}
                dis
            >
                <FontIcon onClick={() => setCallout(true)} iconName="ChromeClose" className='close-btn' />
                <div className='callout-text'>
                    You need to allow camera and microphone permissions to call!
                </div>
            </Callout>
            <Modal className='call-modal' isOpen={modal}
                isBlocking={true}
            >{callStatus === CallStatus.ongoing || callStatus === CallStatus.outgoing ?
                <div className='vc-div'>
                    <div className='stream-div'>
                        {stream1 ?
                            <video autoPlay ref={myStrRef} className='stream-one video-stream'></video> : <div className='persona'>
                            <Persona size={PersonaSize.size120} text={username} hidePersonaDetails /> </div>
                        }
                        {callStatus === CallStatus.ongoing ? <>
                            {stream2 ?
                                <video autoPlay ref={othrStrRef} className='stream-two video-stream'></video> : <div className='persona'>
                                <Persona size={PersonaSize.size120} text={iUser ? iUser.username : 'Anonymous'} hidePersonaDetails /> </div>

                            } </> : null}
                        {callStatus === CallStatus.outgoing ?  <div className='stream-two video-stream'>  <Persona size={PersonaSize.size120} text={selectedUser.username} hidePersonaDetails/> <br/> Calling {selectedUser.username}</div> : null}

                    </div>
                    <div className='controls-div'>
                        <FontIcon iconName="DeclineCall" className='decline-btn call-btn' onClick={() => handleDisconnect(true)} />
                    </div>

                </div> : null}
                {callStatus === CallStatus.incoming ? <div className='incoming-div'>
                    <div className='incoming'> <Persona size={PersonaSize.size120} text={iUser? iUser.username : '' } hidePersonaDetails/> {iUser ?  `${iUser.username} calling` : ''}</div>
                    <div className='call-decision-div'>
                        <FontIcon iconName="IncomingCall" className='accept-btn call-btn' onClick={handleAccept} />
                        <FontIcon iconName="DeclineCall" className='decline-btn call-btn' onClick={handleDecline} />
                    </div>
                </div> : null}
            </Modal>
        </div>
    )
}
export default Dashboard