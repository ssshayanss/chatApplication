const socketio = require('socket.io');

const jwt = require('jsonwebtoken');
const { jwtPrivateKey } = require('./config');

const User = require('./models/user');
const Room = require('./models/room');
const Message = require('./models/message');

module.exports = server => {
    
    const chat = socketio(server).of('/chat');
    
    chat.use(async (socket, next) => {
        try {
            const token = await socket.handshake.query.token;
            const { _id } = jwt.verify(token, jwtPrivateKey);
            const { username } = await User.findOne({ _id });
            socket.userId = await _id;
            socket.username = await username;
            next();    
        } catch (error) {
            console.log(error);
        }
    });

    chat.on('connection', async socket => {
        console.log(`${socket.username} connected.`);
        
        socket.on('get rooms', async (callback) => {
            try {
                const response = await Room.find({}).populate('owner');
                const rooms = response.map(room => {
                    return {
                        id: room._id,
                        name: room.name,
                        isOwner: (socket.userId == room.owner._id) ? true : false
                    }
                });
                callback({ success: true, rooms });
            } catch (error) {
                callback({ message: 'Server Error!!!' });
            }
        });

        socket.on('create room', async ({ roomName }, callback) => {
            try {
                if(roomName) {
                    const room = new Room({ name: roomName.toLowerCase(), owner: socket.userId });
                    await room.save();
                    chat.emit('new room');
                    callback({ success: true, message: `Room ${roomName} created.` });
                } else {
                    callback({ success: false, message: `Room name is required.` });
                }
            } catch (error) {
                if(error.code === 11000) callback({ success: false, message: `This room name (${error.keyValue.name}) is alredy taken.` });
                else if(error.message.includes('validation failed')) callback({ success: false, message: error.message });
                else callback({ success: false, message: 'Server Error!!!' });
            }
        });

        socket.on('delete room', async ({ roomId }, callback) => {
            try {
                const response = await Room.deleteOne({ _id: roomId, owner: socket.userId });
                if(response.deletedCount>=1) {
                    chat.emit('new room');
                    callback({ success: true, message: 'Room deleted.' });
                }
                else callback({ success: false, message: 'You can not delete this room' });
            } catch (error) {
                callback({ success: false, message: 'Server Error!!!' });
            }
        });

        socket.on('delete user', async callback => {
            try {
                await Room.deleteMany({ owner: socket.userId });
                await User.deleteOne({ _id: socket.userId });
                callback({ success: true, message: 'User deleted.' });
            } catch (error) {
                callback({ success: false, message: 'Server Error!!!' });
            }
        });

        socket.on('join room', async ({ roomId }, callback) => {
            try {
                const room = await Room.findOne({ _id: roomId });
                if(!room) callback({ success: false, message: 'This room is unavaible.' });
                else {
                    if(!room.users.includes(socket.userId)) {
                        await room.users.push(socket.userId);
                        await room.save();
                    }
                    socket.roomId = await roomId;
                    await socket.join(roomId);
                    callback({ success: true });
                }
            } catch (error) {
                callback({ success: false, message: 'Server Error!!!' });   
            }
        });
    
        socket.on('leave room', async ({ roomId }, callback) => {
            try {
                const room = await Room.findOne({ _id: roomId });
                if(room) {
                    const index = await room.users.indexOf(socket.userId);
                    if(index !== -1) {
                        await room.users.splice(index, 1);
                        await room.save();
                    }
                    socket.disconnect(0);
                    callback({ success: true });
                } else {
                    socket.disconnect(0);
                    callback({ success: false });
                }
            } catch (error) {
                callback({ success: false, message: 'Server Error!!!' });
            }
        });
    
        socket.on('send message', async ({ messageText }, callback) => {
            try {
                if(!socket.roomId) callback({ success: false, message: 'You must first join a room.' }); 
                else {
                    const room = await Room.findOne({ _id: socket.roomId });
                    if(!room) callback({ success: false, message: 'This room is unavaible.' });
                    else {
                        const newMessage = new Message({ sender: socket.userId, text: messageText });
                        await newMessage.save();
                        await room.messages.push(newMessage._id);
                        await room.save() 
                        chat.to(socket.roomId).emit('new message', { sender: socket.username, messageText });
                        callback({ success: true });
                    }
                }
            } catch (error) {
                callback({ success: false, message: 'Server Error!!!' });
            }
        });
        
        socket.on('get messages', async ({ roomId }, callback) => {
            try {
                const room = await Room.findOne({ _id: roomId });
                if(!room) callback({ success: false, message: 'This room is unavaible.' });
                else {
                    const messages = [];
                    for(let i=0; i<room.messages.length; i++) {
                        const message = await Message.findById(room.messages[i]).populate('sender');
                        messages.push({ sender: message.sender.username, messageText: message.text, createdAt: message.createdAt }); 
                    }
                    callback({ success: true, messages });
                }
            } catch (error) {
                callback({ success: false, message: 'Server Error!!!' });
            }
        });
    
        socket.on('get online users', async callback => {
            try {
                const room = await Room.findOne({ _id: socket.roomId });
                if(!room) callback({ success: false, message: 'This room is unavaible.' });
                else {
                    const users = [];
                    for(let i=0; i<room.users.length; i++) {
                        const { username } = await User.findById(room.users[i]);
                        users.push({ username }); 
                    }
                    callback({ success: true, users });
                }
            } catch (error) {
                console.log(error);
                callback({ success: false, message: 'Server Error!!!' });
            }
        });
    
        socket.on('disconnect', async () => {
            try {
                if(socket.roomId) {
                    const room = await Room.findOne({ _id: socket.roomId });
                    if(room) {
                        const index = await room.users.indexOf(socket.userId);
                        if(index !== -1) {
                            await room.users.splice(index, 1);
                            await room.save();   
                        }
                    }
                }
                console.log(`${socket.username} disconnected.`);
            } catch (error) {
                console.error(error);
            }
        });
    });
    
};