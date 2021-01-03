import { Fragment, useEffect, useState, createRef } from 'react';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';
import { FiUsers, FiMessageSquare } from 'react-icons/fi';
import { MdSend, MdClose } from 'react-icons/md';

import { verifyUser } from '../services';
import makeToast from '../toaster';

let socket = null;

export const ChatRoomPage = ({ history, match, location }) => {

    const roomId = match.params.id;
    const chatroomName = location.search.split('=')[1] || 'Chatroom Name';
    const messageRef = createRef();
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [showUsers, setShowUsers] = useState(false);

    useEffect(() => {
        
        verifyUser()
            .then(({ success }) => {
                if(!success) history.push('/login'); 
                else if(!socket) {
                    socket = io('/chat', {
                        query: {
                            token: localStorage.getItem('CA_TOKEN')
                        }
                    });
                }
            
                if(socket) {
                    socket.emit('join room', { roomId }, ({ success, message }) => {
                        if(success) makeToast("success", "Welcome to Room");
                        else {
                            makeToast("error", message);
                            history.push('/dashboard');
                        }
                    });
                    
                    socket.emit('get messages', ({ roomId }), res => {
                        if(res.success) setMessages(res.messages);
                        else makeToast("error", res.message);
                    });
                }

        });
        
        return () => {
            socket.emit('leave room', { roomId }, ({ success, message }) => {
                if(success) makeToast("error", "Left Room");
                else if(!success && message) makeToast("error", message);
            });
            socket = null;
        };

    }, [roomId, history]);

    useEffect(() => {
        if(socket) {
            socket.on('new message', ({ sender, messageText }) => {
                setMessages([...messages, {sender, messageText}]);
            });
        }
    }, [messages]);

    const sendMessage = e => {
        e.preventDefault();
        const message = messageRef.current.value.trim();
        if(message.length) {
            socket.emit('send message', { messageText: message }, res => {
                if(!res.success) makeToast("error", res.message);
            });
        }
        messageRef.current.value = '';
    };

    const usersHandler = () => {
        if(socket) {
            socket.emit('get online users', res => {
                if(res.success) setUsers(res.users);
                else makeToast("error", res.message);
            });
            setShowUsers(!showUsers);
        }
    };

    return (
        <Fragment>
            <div className="chatroomSection">
                <div className="cardHeader">{chatroomName}</div>
                <div className="actionBar">
                    <span className="username text-muted mr-2">shayan</span>
                    <button className="iconButton" aria-label="Close" onClick={usersHandler}>
                        {
                            showUsers ? <FiMessageSquare /> : <FiUsers />
                        }    
                    </button>
                    <Link to="/dashboard" className="ml-2 mr-1" aria-label="Close"><MdClose /></Link>
                </div>
                {
                    showUsers ?
                    <div className="onlineUsers">
                        {
                            users.map((user, index) => {
                                return <p key={index} className="onlineUser">{user.username}</p>
                            })
                        }
                    </div>
                    :
                    <div>
                        <div className="chatroomContent">
                            {
                                messages.map((message, index) => {
                                    return (
                                        (localStorage.getItem('CA_USERNAME') === message.sender) ?
                                            <div key={index} className="mb-3">
                                                <div className="chatMessage-owner">
                                                    <span className="username text-muted">{message.sender}</span>
                                                    <span>{message.messageText}</span>
                                                </div>
                                            </div>
                                            :
                                            <div key={index} className="d-flex justify-content-end mb-3">
                                                <div className="chatMessage-other">
                                                    <span className="username text-right text-muted">{message.sender}</span>
                                                    <span className="text-right">{message.messageText}</span>
                                                </div>
                                            </div>
                                    ); 
                                })
                            }
                        </div>
                        <div className="chatroomActions">
                            <form className="d-flex" onSubmit={sendMessage}>
                                <div className="inputGroup">
                                    <input 
                                        type="text"
                                        placeholder="Type here..."
                                        className="messageInput"
                                        ref={messageRef}
                                    />
                                    <button type="submit" className="sendButton"><MdSend /></button>
                                </div>
                            </form>
                        </div>
                    </div>
                }
            </div>
        </Fragment>
    );
}