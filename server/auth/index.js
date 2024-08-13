const express = require("express")
const app = express()
const cors = require("cors")

const session = require('express-session');
const RedisStore = require('connect-redis').default
const redis = require('redis');

app.use(cors())
require('dotenv/config')
const db = require("./model/Models");

// db.sequelize.sync({ force: true }).then(() => {
//     console.log('Drop and Resync Db');
//     initial();
// });

db.sequelize.sync()
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));


const redisClient = redis.createClient({
    url: process.env.REDIS_CONNECTION_STRING // Utilisation d'URL complète
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
        //secure: process.env.NODE_ENV === 'production', // Cookie sécurisé en production
        httpOnly: true, 
        maxAge: 24 * 60 * 60 * 1000
    }
}));

app.get("/", (req, res) => {
    res.json({ message: "Auth Server" });
});


// Routes
require('./routes/auth')(app)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
