import express from 'express'
import router from './routes'
import database from './models';
import dbConfig from './db-config.json'
import config from 'config'
const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:false}));

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

app.use('/api/v1/user',router.user)
app.use('/api/v1/login', router.auth)

app.listen(8080);