import express from 'express'
import router from './routes'
import database from './models';
import dbConfig from './db-config.json'
import config from 'config'
import dotenv from 'dotenv'

const app=express();
const cors=require("cors")

app.use(express.json());
app.use(express.urlencoded({extended:false}));

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
export const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());

io.on("connection", (socket) => {
    socket.emit("me", socket.id);

    socket.on("disconnect", () => {
        socket.broadcast.emit("callEnded")
    });

    socket.on("callUser", ({ userToCall, signalData, from, name }) => {
        io.to(userToCall).emit("callUser", { signal: signalData, from, name });
    });

    socket.on("answerCall", (data) => {
        io.to(data.to).emit("callAccepted", data.signal)
    });
}); 

app.use('/api/v1/user',router.user)
app.use('/api/v1/login', router.auth)
app.use('/api/v1/chat', router.chatroom)

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));