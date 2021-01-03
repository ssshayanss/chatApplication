import { useEffect } from 'react';
import { verifyUser } from '../services';

export const RootPage = ({ history }) => {
    useEffect(() => {
        verifyUser()
            .then(({ success }) => {
                if(!success) history.push('/login'); 
                else history.push('/dashboard');               
            });
    }, [history]);

    return <div>Root Page</div>;
}