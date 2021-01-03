const User = require('../models/user');

module.exports = {
    register: async (req, res) => {
        try {
            const { username, password } = await req.body;
            const user = new User({ username: username.toLowerCase(), password });
            await user.save();
            res.status(200).send({ message: `${username} signed up successfully.` });
        } catch (error) {
            if(error.code === 11000) res.status(400).send({ message: `This username (${error.keyValue.username}) is alredy taken.` });
            else if(error.message.includes('validation failed')) res.status(400).send({ message: error.message });
            else {
                console.error(error);
                res.status(500).send({ message: 'Server Error!!!' });
            }
        }
    },
    login: async (req, res) => {
        try {
            const { username, password } = await req.body;
            const user = await User.findOne({ username: username.toLowerCase() });
            if(!user) res.status(400).send({ message: 'Username and Password did not match.' });
            else {
                if(await user.comparePassword(password)) {
                    const token = await user.generateToken();
                    res.status(200).send({ message: `${username} loged in successfuly.`, username, token });
                } else {
                    res.status(400).send({ message: 'Username and Password did not match.' });
                }
            }
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Server Error!!!' });
        }
    },
    verify: async (req, res) => {
        try {
            const { token } = await req.body;
            await User.verifyToken(token);
            res.status(200).send({ success: true });
        } catch (error) {
            res.status(401).send({ success: false });
        }
    }
}