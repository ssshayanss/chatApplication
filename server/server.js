const http = require('http');
const mongoose = require('mongoose');

const app = require('./app');
const chat = require('./chat');

const { port, mongodbUrl } = require('./config');

mongoose.connect(mongodbUrl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(() => console.log('MongoDB Connected.'))
    .catch(err => console.error(`Mongoose Error: ${err.message}`));

const server = http.Server(app);
chat(server);

server.listen(port, () => console.log(`Server is up and running on port ${port}`));