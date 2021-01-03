import { Fragment, useEffect, useState, createRef } from 'react';
import { Link } from 'react-router-dom';
import { RiDeleteBin2Fill, RiLogoutBoxLine } from 'react-icons/ri';
import io from 'socket.io-client';

import { verifyUser } from '../services';
import makeToast from '../toaster';

let socket = null;

export const DashboardPage = ({ history }) => {

    const roomNameRef = createRef();
    const [rooms, setRooms] = useState([]);

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
                    socket.emit('get rooms', data => {
                        data.success ? setRooms(data.rooms) : makeToast("error", data.message);
                    });
    
                    socket.on('new room', () => {
                        socket.emit('get rooms', data => {
                            data.success ? setRooms(data.rooms) : makeToast("error", data.message);
                        }); 
                    });
                }
    
            });
            
            return () => {
                if(socket) {
                    socket.disconnect(0);    
                    socket = null;
                }
            };
            
    }, [history]);

    const createRoom = e => {
        e.preventDefault();
        
        const roomName = roomNameRef.current.value.trim();

        if(!roomName) makeToast("error", "Room Name is required.");
        else {
            socket.emit('create room', ({ roomName }), ({ success, message }) => {
                success ? makeToast("success", message) : makeToast("error", message);  
            });
            roomNameRef.current.value = '';
        }
    };

    const deleteRoom = roomId => {
        socket.emit('delete room', ({ roomId }), ({ success, message }) => {
            success ? makeToast("success", message) : makeToast("error", message); 
        });
    };

    const logout = () => {
        localStorage.removeItem('CA_TOKEN');
        localStorage.removeItem('CA_USERNAME');
        socket.disconnect(0);
        socket = null;
        history.push('/login');
    };

    const deleteAccount = async () => {
        socket.emit('delete user', ({ success, message }) => {
            if(!success) makeToast("error", message);
            else {
                makeToast("success", message);
                logout();
            }
        });
    };

    return (
        <Fragment>
            <div className="cardHeader">Join to Room</div>
            <div className="actionBar">
                <span className="username text-muted mr-2">shayan</span>
                <button className="iconButton" aria-label="Close" onClick={logout}><RiLogoutBoxLine /></button>
                <button className="iconButton" aria-label="Close" onClick={deleteAccount}><RiDeleteBin2Fill /></button>
            </div>
            <div className="cardBody">
                <form onSubmit={createRoom}>
                    <input className="formInput mb-3" type="text" placeholder="Room Name" ref={roomNameRef} />
                    <input className="formButton" type="submit" value="Create Room" />
                </form>
                <div className="roomsList mt-3">
                    {
                        rooms.map(room => {
                            return (
                                <div key={room.id} className="d-flex justify-content-between align-items-center mb-3">
                                    <div>{room.name}</div>
                                    <div className="d-flex">
                                        <Link to={`/chatroom/${room.id}?roomName=${room.name}`} className="btn btn-primary">Join</Link>     
                                        <input type="button" className="btn btn-danger ml-1" value="Delete" onClick={() => deleteRoom(room.id)} />    
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        </Fragment>
    );
}