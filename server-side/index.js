import express from 'express'
import router from './routes'
import database from './models';
import dbConfig from './db-config.json'
import config from 'config'
import dotenv from 'dotenv'
import isAuthenticated from './middleware/is-authenticated'
const app = express();
import { ExpressPeerServer } from 'peer'

app.use(express.json())
app.use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT || 8080;

dotenv.config();

if (!config.get('PrivateKey')) {
    console.error('FATAL ERROR: PrivateKey is not defined.');
    process.exit(1);
}

database.mongoose.connect(`mongodb+srv://${dbConfig.username}:${dbConfig.password}@${dbConfig.url}/${dbConfig.database}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
})
    .then(() => {
        console.log("Successfully connected to MongoDB.");
    })
    .catch(err => {
        console.error("Connection error", err);
        process.exit();
    });

const server = require("http").createServer(app);

const peerServer = ExpressPeerServer(server, {
    path: '/teams-clone', debug: true,
});
app.use('/peerjs', peerServer);

app.use('/api/v1/user', router.user)
app.use('/api/v1/user', router.auth)
app.use('/api/v1/all', isAuthenticated, router.all_users)
app.use('/api/v1/chat', isAuthenticated, router.chat)

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));