import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { RiDeleteBin2Fill, RiLogoutBoxLine } from 'react-icons/ri';

export const DashboardPage = () => {
    return (
        <Fragment>
            <div className="cardHeader">Join to Room</div>
            <div className="actionBar">
                <span className="username text-muted mr-2">shayan</span>
                <button className="iconButton" aria-label="Close"><RiDeleteBin2Fill /></button>
                <button className="iconButton" aria-label="Close"><RiLogoutBoxLine /></button>
            </div>
            <div className="cardBody">
                <form>
                    <input className="formInput mb-3" type="text" placeholder="Room Name" />
                    <input className="formButton" type="submit" value="Create Room" />
                </form>
                <div className="roomsList mt-3">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>roomName</div>
                        <div className="d-flex">
                            <Link to='/chatroom/1' className="btn btn-primary">Join</Link>     
                            <input type="button" className="btn btn-danger ml-1" value="Delete" />    
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}