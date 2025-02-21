const express = require("express")
const app = express()
const cors = require("cors")
app.use(express.json());
const session = require('express-session');
const RedisStore = require('connect-redis').default
const redis = require('redis');

app.use(cors({
    origin: 'http://localhost:8080'
  }));
require('dotenv/config')
const db = require("./model/Models");

db.sequelize.sync()

app.use(express.urlencoded({ extended: true }));

const redisClient = redis.createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: 'redis-17389.c339.eu-west-3-1.ec2.redns.redis-cloud.com',
        port: 17389
    }
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

const PORT = 3002
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
