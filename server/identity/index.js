const express = require("express")
const app = express()
const cors = require("cors")
app.use(express.json());
const session = require('express-session');
const RedisStore = require('connect-redis').default
const redis = require('redis');

app.use(cors({
    origin: 'http://localhost:9000',
    credentials: true
}));

require('dotenv/config')
const db = require("./model/Models");

db.sequelize.sync()

app.use(express.urlencoded({ extended: true }));

const redisClient = redis.createClient({
    socket: {
        host: process.env.REDIS_HOST || 'redis',
        port: 6379
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

const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
