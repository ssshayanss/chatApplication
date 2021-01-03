const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { saltRounds, jwtPrivateKey } = require('../config');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Your username cannot be blank.'],
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required.'],
        minlength: [6, 'Password must be at least 6 characters.'],
        trim: true
    }
}, { timestamps: true });

UserSchema.pre('save', function(next) {
    try {
        this.password = bcrypt.hashSync(this.password, saltRounds);
        next();
    } catch (error) {
        next(error);
    }
});

UserSchema.methods.comparePassword = function(password) {
    try {
        return bcrypt.compareSync(password, this.password);
    } catch (error) {
        throw error;
    }
};

UserSchema.methods.generateToken = function() {
    try {
        return jwt.sign({ _id: this._id }, jwtPrivateKey);
    } catch (error) {
        throw error;
    }
};

UserSchema.statics.verifyToken = function(token) {
    try {
        return jwt.verify(token, jwtPrivateKey);
    } catch (error) {
        throw error;
    }
};

module.exports = mongoose.model('User', UserSchema);