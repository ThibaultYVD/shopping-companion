require('dotenv/config')
const express = require("express")

const session = require('express-session');
const RedisStore = require('connect-redis').default
const redis = require('redis');

const app = express()
const bodyParser = require('body-parser')
const routes = require('./routes/routes')

app.use(express.urlencoded({ extended: true }));
const cors = require("cors")
const db = require("./model/Models");


db.sequelize.sync()

app.use(express.json());
app.use(bodyParser.json())
app.use(cors())

const redisClient = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  });
redisClient.connect()
    .then(() => console.log('Connected to Redis successfully!'))
    .catch((err) => console.error('Failed to connect to Redis:', err));

redisClient.on('error', (err) => {
    console.error('Erreur Redis:', err);
});

app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SECRET_KEY, 
    resave: false, 
    saveUninitialized: false, 
    cookie: {
        httpOnly: true, 
        maxAge: 86400000 // 1 jour
    }
}));


routes(app)


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
