import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiMessageSquare } from 'react-icons/fi';
import { MdSend, MdClose } from 'react-icons/md';

export const ChatRoomPage = () => {

    return (
        <Fragment>
            <div className="chatroomSection">
                <div className="cardHeader">Chatroom Name</div>
                <div className="actionBar">
                    <span className="username text-muted mr-2">shayan</span>
                    <button className="iconButton" aria-label="Close"><FiMessageSquare /></button>
                    <button className="iconButton" aria-label="Close"><FiUsers /></button>
                    <Link to="/dashboard" className="ml-2 mr-1" aria-label="Close"><MdClose /></Link>
                </div>
                <div>
                    <div className="chatroomContent">
                        <div className="mb-3">
                            <div className="chatMessage-owner">
                                <span className="username text-muted">shayan</span>
                                <span>How can I help you today?</span>
                                <span className="text-right text-muted">08:55</span>
                            </div>
                        </div>
                        <div className="d-flex justify-content-end mb-3">
                            <div className="chatMessage-other">
                                <span className="username text-right text-muted">shayan</span>
                                <span className="text-right">salam</span>
                                <span className="text-muted">08:55</span>
                            </div>
                        </div>
                    </div>
                    <div className="chatroomActions">
                        <form className="d-flex">
                            <div className="inputGroup">
                                <input 
                                    type="text"
                                    placeholder="Type here..."
                                    className="messageInput"
                                />
                                <button type="submit" className="sendButton"><MdSend /></button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}