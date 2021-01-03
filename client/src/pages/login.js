import { Fragment, useEffect, createRef } from 'react';
import { Link } from 'react-router-dom';

import { verifyUser, signinUser } from '../services';
import makeToast from '../toaster';

export const LoginPage = ({ history }) => {

    useEffect(() => {
        verifyUser()
            .then(({ success }) => {
                if(!success) history.push('/login'); 
                else history.push('/dashboard');               
            });
    }, [history]);
    
    const usernameRef = createRef(); 
    const passwordRef = createRef(); 
    
    const loginUser = async e => {
        e.preventDefault();

        const username = usernameRef.current.value.trim(); 
        const password = passwordRef.current.value.trim(); 
        
        if(!username) makeToast("error", "Username is required.");
        else if(!password) makeToast("error", "Password is required.");
        else {
            try {
                const { data } = await signinUser(username, password);
                localStorage.setItem("CA_TOKEN", data.token);
                localStorage.setItem("CA_USERNAME", data.username);
                makeToast("success", data.message);
                history.push("/dashboard");
            } catch (error) {
                const { data } = await error.response;
                makeToast("error", data.message);
            }
        }
    };

    return (
        <Fragment>
            <div className="cardHeader">Login</div>
            <div className="cardBody">
                <form onSubmit={loginUser}>
                    <input className="formInput mb-3" type="text" placeholder="Username" ref={usernameRef} required />
                    <input className="formInput mb-3" type="password" placeholder="Password" ref={passwordRef} required />
                    <input className="formButton mb-3" type="submit" value="Login" />
                    <p className="text-center"><Link to="/register">Create Account</Link></p>
                </form>
            </div>
        </Fragment>
    );
}