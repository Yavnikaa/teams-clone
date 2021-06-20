import express from 'express'
import router from './routes'
import database from './models';
import dbConfig from './db-config.json'
const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:false}));

database.mongoose.connect(`mongodb+srv://${dbConfig.username}:${dbConfig.password}@${dbConfig.url}/${dbConfig.database}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("Successfully connected to MongoDB.");
})
.catch(err => {
    console.error("Connection error", err);
    process.exit();
});

app.use('/api/v1/user',router.user)
app.use('/api/v1/login', router.auth)

app.listen(8080);