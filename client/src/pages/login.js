import { Fragment } from 'react';
import { Link } from 'react-router-dom';

export const LoginPage = () => {
    return (
        <Fragment>
            <div className="cardHeader">Login</div>
            <div className="cardBody">
                <form>
                    <input className="formInput mb-3" type="text" placeholder="Username" required />
                    <input className="formInput mb-3" type="password" placeholder="Password" required />
                    <input className="formButton mb-3" type="submit" value="Login" />
                    <p className="text-center"><Link to="/register">Create Account</Link></p>
                </form>
            </div>
        </Fragment>
    );
}