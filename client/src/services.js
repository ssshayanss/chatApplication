import axios from 'axios';

export const createUser = (username, password) => axios.post('/user/register', { username, password });
export const signinUser = (username, password) => axios.post('/user/login', { username, password });
export const verifyUser = async () => {
    try {
        const token = localStorage.getItem("CA_TOKEN");
        if(!token) return { success: false };
        else {
            const { data } = await axios.post('/user/verify', { token });
            return data.success ? { success: true } : { success: false };
        }
    } catch (error) {
        return { success: false };
    }
};