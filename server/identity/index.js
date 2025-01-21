const express = require("express")
const app = express()
const cors = require("cors")

const session = require('express-session');
const RedisStore = require('connect-redis').default
const redis = require('redis');

app.use(cors())
require('dotenv/config')
const db = require("./model/Models");

db.sequelize.sync()
app.use(express.json());

app.use(express.urlencoded({ extended: true }));


const redisClient = redis.createClient({
    url: process.env.REDIS_CONNECTION_STRING
});

redisClient.connect() 

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
        maxAge: 24 * 60 * 60 * 1000
    }
}));

app.get("/", (req, res) => {
    res.json({ message: "Auth Server" });
});

require('./routes/auth')(app)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
