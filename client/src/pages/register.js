import { Fragment, useEffect, createRef } from 'react';
import { Link } from 'react-router-dom';

import { verifyUser, createUser } from '../services';
import makeToast from '../toaster';

export const RegisterPage = ({ history }) => {
    
    useEffect(() => {
        verifyUser()
            .then(({ success }) => {
                if(!success) history.push('/register'); 
                else history.push('/dashboard');               
            });
    }, [history]);

    const usernameRef = createRef(); 
    const passwordRef = createRef(); 
    const confirmPasswordRef = createRef(); 
    
    const registerUser = async e => {
        e.preventDefault();

        const username = usernameRef.current.value.trim(); 
        const password = passwordRef.current.value.trim(); 
        const confirmPassword = confirmPasswordRef.current.value.trim(); 
        
        if(!username) makeToast("error", "Username is required.");
        else if(!password) makeToast("error", "Password is required.");
        else if(!confirmPassword) makeToast("error", "Confirm password is required.");
        else if(password.length < 6) makeToast("error", "Password must be at least 6 characters.");
        else if(password !== confirmPassword) makeToast("error", "Password not match.");
        else {
            try {
                const { data } = await createUser(username, password);
                makeToast("success", data.message);
                history.push("/login");
            } catch (error) {
                const { data } = await error.response;
                makeToast("error", data.message);
            }
        }
    };
    
    return (
        <Fragment>
            <div className="cardHeader">Register</div>
            <div className="cardBody">
                <form onSubmit={registerUser}>
                    <input className="formInput mb-3" type="text" placeholder="Username" ref={usernameRef} required />
                    <input className="formInput mb-3" type="password" placeholder="Password" ref={passwordRef} required />
                    <input className="formInput mb-3" type="password" placeholder="Confirm Password" ref={confirmPasswordRef} required />
                    <input className="formButton mb-3" type="submit" value="Register" />
                    <p className="text-center">Have an account? <Link to="/login">Login</Link></p>
                </form>
            </div>
        </Fragment>
    );
}