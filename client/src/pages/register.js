import { Fragment } from 'react';
import { Link } from 'react-router-dom';

export const RegisterPage = () => {
    return (
        <Fragment>
            <div className="cardHeader">Register</div>
            <div className="cardBody">
                <form>
                    <input className="formInput mb-3" type="text" placeholder="Username" required />
                    <input className="formInput mb-3" type="password" placeholder="Password" required />
                    <input className="formInput mb-3" type="password" placeholder="Confirm Password" required />
                    <input className="formButton mb-3" type="submit" value="Register" />
                    <p className="text-center">Have an account? <Link to="/login">Login</Link></p>
                </form>
            </div>
        </Fragment>
    );
}